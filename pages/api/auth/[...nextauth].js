import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import admin from "../../../lib/firebase-admin"; // Use the SERVER-SIDE Admin SDK
import { getAuth } from "firebase-admin/auth";

// This is the definitive and correct configuration for NextAuth with Firebase Custom Tokens.
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // This `authorize` function runs on the SERVER.
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        try {
          // We use the Firebase Auth REST API to securely verify the password on the server.
          // This is the correct server-side replacement for signInWithEmailAndPassword.
          const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                returnSecureToken: true,
              }),
            }
          );

          const user = await res.json();

          // If the sign-in is successful, we get back a user object with a localId (Firebase UID).
          if (res.ok && user.localId) {
            return {
              uid: user.localId,
              email: user.email,
            };
          }

          // If there's an error (e.g., wrong password), log it and return null.
          console.error("Firebase sign-in error on server:", user.error.message);
          return null;

        } catch (error) {
          console.error("Authorize function error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // The JWT callback is called AFTER `authorize` and is used to create the custom token.
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.uid;
      }
      
      // If we have a UID, we can use the ADMIN SDK to create the custom token.
      if (token.uid) {
          try {
            const customToken = await getAuth(admin.app()).createCustomToken(token.uid);
            token.customToken = customToken;
          } catch (error) {
              console.error("Error creating custom token:", error);
              token.error = "CustomTokenError";
          }
      }
      return token;
    },
    // The session callback makes the custom token available on the client-side `session` object.
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
      }
      session.customToken = token.customToken;
      session.error = token.error;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});