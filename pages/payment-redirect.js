
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function PaymentRedirectPage() {
  const router = useRouter();
  const { quoteId } = router.query;
  const [isProcessing, setIsProcessing] = useState(false);
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
  
  const handleDonePayment = async () => {
    if (!quoteId) return;

    setIsProcessing(true);
    try {
      // Get references to both the policy and the quotation documents
      const policyRef = doc(db, 'policies', quoteId);
      const quotationRef = doc(db, 'quotations', quoteId);

      // Update the policy document for "My Car Records"
      await updateDoc(policyRef, {
        status: 'completed',
        submittedAt: serverTimestamp(), // Use `submittedAt` as expected by the dashboard
      });

      // Update the quotation document for "Recent Quotes"
      await updateDoc(quotationRef, {
        status: 'completed',
      });

      // Send the confirmation email
      await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quoteId }),
      });
      
      // Redirect to the success page
      router.push(`/success?quoteId=${quoteId}`);

    } catch (error) {
      console.error('Error during payment finalization:', error);
      alert('There was an error finalizing your payment. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <Head>
        <title>Processing Payment - CGS Insurance</title>
      </Head>
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Redirecting to your payment page...
        </h1>
        <p className="text-gray-600 mb-6">
          Please complete your payment through the secure portal. Once finished, click the button below.
        </p>
        <button
          onClick={handleDonePayment}
          disabled={isProcessing}
          className={`w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
        >
          {isProcessing ? 'Processing...' : 'Done Payment'}
        </button>
      </div>
    </div>
  );
}
