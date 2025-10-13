import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function VehicleFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is authenticated, redirect to manual quote page
        router.push("/manual-quote");
      } else {
        // If user is not authenticated, redirect to a sign-in page
        // Note: You might need to create this page or adjust the path.
        router.push("/auth/signin"); 
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  // Render a loading state while we determine the auth status
  // and wait for the redirect to happen.
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Head>
        <title>Loading...</title>
      </Head>
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
