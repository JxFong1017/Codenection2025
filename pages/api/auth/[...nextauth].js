import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Check if Google OAuth credentials are configured
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

const providers = [];

if (isGoogleConfigured) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

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
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
  debug: process.env.NODE_ENV === 'development',
});
