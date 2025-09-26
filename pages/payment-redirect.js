
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function PaymentRedirectPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDonePayment = async () => {
    if (!orderId) return;

    setIsProcessing(true);
    try {
      // Step 1: Update the quote status to 'completed' in Firestore.
      const quoteRef = doc(db, 'quotations', orderId);
      await updateDoc(quoteRef, {
        status: 'completed',
        submittedAt: serverTimestamp(),
      });

      // Step 2: Await the confirmation email before redirecting.
      // This is the fix to ensure the email is sent before the page changes.
      await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      
      // Step 3: Redirect to the dashboard only after the email API call is done.
      router.push('/dashboard');

    } catch (error) {
      console.error('Error during payment finalization:', error);
      // Even if email fails, the status is updated, so we can redirect.
      alert('Your payment was processed, but we had an issue sending the confirmation email. Please check your dashboard for the policy record.');
      router.push('/dashboard'); 
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
