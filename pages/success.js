
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Head from 'next/head';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function SuccessPage() {
  const router = useRouter();
  const { quoteId } = router.query;
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        router.push('/auth/signin');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (router.isReady && quoteId && firebaseUser) {
      const fetchPolicy = async () => {
        setLoading(true);
        try {
          const policyRef = doc(db, 'policies', quoteId);
          const docSnap = await getDoc(policyRef);

          if (docSnap.exists() && docSnap.data().user_email === firebaseUser.email) {
            setPolicy({ id: docSnap.id, ...docSnap.data() });
          } else {
            console.error("Policy not found or access denied.");
            setPolicy(null);
          }
        } catch (error) {
          console.error("Error fetching policy:", error);
          setPolicy(null);
        } finally {
          setLoading(false);
        }
      };

      fetchPolicy();
    }
  }, [router.isReady, quoteId, firebaseUser]);

  const formatCurrency = (value) => {
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
      return 'RM 0.00';
    }
    return `RM ${numberValue.toFixed(2)}`;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading your policy details...</div>;
  }

  if (!policy) {
    return <div className="min-h-screen flex items-center justify-center">Could not retrieve your policy details.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Payment Successful - CGS Insurance</title>
      </Head>
      <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Thank you for your purchase!</h1>
          <p className="mt-2 text-gray-600">Your policy has been successfully processed. An email confirmation has been sent to you.</p>
          
          <div className="mt-6 border-t border-gray-200 pt-6 text-left space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Policy Summary</h3>
            <div className="flex justify-between">
              <span className="text-gray-500">Policy ID:</span>
              <span className="font-medium text-gray-900">{policy.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Insurer:</span>
              <span className="font-medium text-gray-900">{policy.insurer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Car Plate:</span>
              <span className="font-medium text-gray-900">{policy.plateNumber}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-700">Total Paid:</span>
              <span className="text-blue-600">{formatCurrency(policy.price)}</span>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Go to My Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
