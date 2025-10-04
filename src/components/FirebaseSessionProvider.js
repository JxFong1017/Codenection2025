
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { app } from '../../lib/firebase';

// This component will wrap our entire application.
export default function FirebaseSessionProvider({ children }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    const signInWithFirebase = async () => {
      const auth = getAuth(app);
      
      if (session?.customToken) {
        try {
          // Use the custom token to sign in to the Firebase Client SDK
          await signInWithCustomToken(auth, session.customToken);
        } catch (error) {
          console.error("Error signing in with custom token:", error);
        }
      }
    };

    if (status === 'authenticated') {
      signInWithFirebase();
    }
  }, [session, status]);

  return <>{children}</>;
}
