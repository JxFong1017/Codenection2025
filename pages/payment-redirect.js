
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
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
    if (!quoteId || !firebaseUser) return;

    setIsProcessing(true);
    try {
      // Step 1: Securely update the policy status via the API
      const finalizeResponse = await fetch('/api/finalize-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quoteId }),
      });

      if (!finalizeResponse.ok) {
        // The server-side API failed. The user should contact support.
        throw new Error('Failed to update policy status on the server.');
      }

      // Step 2: Send the confirmation email via the API
      const emailResponse = await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quoteId }),
      });

      if (!emailResponse.ok) {
        // This error is less critical, but we should still let the user know.
        // The policy is updated, but the email failed.
        console.warn('Policy status updated, but confirmation email failed to send.');
      }
      
      // Step 3: Redirect to the success page
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
          disabled={isProcessing || !firebaseUser}
          className={`w-full px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${isProcessing || !firebaseUser ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
        >
          {isProcessing ? 'Processing...' : 'Done Payment'}
        </button>
      </div>
    </div>
  );
}
