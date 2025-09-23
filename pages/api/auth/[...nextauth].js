
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase"; // Correctly import the initialized auth instance

const providers = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials, req) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password
        );
        const user = userCredential.user;

        if (user) {
          // Return a user object that NextAuth can use
          return { id: user.uid, email: user.email };
        } else {
          return null;
        }
      } catch (error) {
        // You can log the error or handle specific Firebase auth errors
        console.error("Firebase Auth Error:", error);
        // Returning null will trigger the `error` response in the UI
        return null;
      }
    },
  }),
];

export default NextAuth({
  providers,
  callbacks: {
    async session({ session, token }) {
      // Add user ID to session
      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // url is the intended redirect URL, baseUrl is the app's base URL.
      // After a logout, the callbackUrl is passed as url.
      // In dashboard.js, signOut is called with callbackUrl: "/"
      if (url === "/") {
        return "/"; // Redirect to the homepage on logout
      }
      // For all other cases (like post-login), redirect to the dashboard.
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
  debug: process.env.NODE_ENV === "development",
});
