
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function SuccessPage() {
  const router = useRouter();
  const { orderId } = router.query; // Changed from quoteId

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center">
        <Head>
            <title>Payment Successful - CGS Insurance</title>
        </Head>
        <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="mt-5 text-3xl font-extrabold text-gray-900">Payment Confirmed!</h1>
            <p className="mt-3 text-base text-gray-600">Your policy is now active. A detailed summary and confirmation have been sent to your email.</p>
            {orderId && ( // Changed from quoteId
              <p className="mt-4 text-sm text-gray-500 bg-gray-100 rounded-md px-2 py-1 inline-block">Order ID: {orderId}</p> // Changed from quoteId
            )}
            <div className="mt-8">
                <Link href="/dashboard" className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Go to My Dashboard
                </Link>
            </div>
        </div>
    </div>
  );
}
