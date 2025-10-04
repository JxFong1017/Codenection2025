
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../lib/firebase';
import Head from 'next/head';
import { useSession } from 'next-auth/react';

const DetailItem = ({ label, value }) => (
    value ? (
        <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
        </div>
    ) : null
);

export default function PaymentPage() {
  const router = useRouter();
  const { quoteId } = router.query;
  const { data: session } = useSession();
 const [firebaseUser, setFirebaseUser] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverNoteAddress, setCoverNoteAddress] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const protectionLabels = {
    windscreen: "Windscreen",
    named_driver: "Named Driver",
    all_driver: "All Driver",
    natural_disaster: "Natural Disaster (Special Perils)",
    strike_riot: "Strike Riot and Civil Commotion",
    personal_accident: "Personal Accident",
    towing: "Towing",
    passengers_coverage: "Passengers coverage",
  };

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
      const fetchQuote = async () => {
        setLoading(true);
        try {
          const policyRef = doc(db, 'policies', quoteId);
          const docSnap = await getDoc(policyRef);

          if (docSnap.exists() && docSnap.data().user_email === firebaseUser.email) {
            const quoteData = docSnap.data();
            setQuote({ id: docSnap.id, ...quoteData });

          } else {
            console.error("Quotation not found or access denied.");
            setQuote(null);
          }
        } catch (error) {
          console.error("Error fetching quotation:", error);
          setQuote(null);
        } finally {
          setLoading(false);
        }
      };

      fetchQuote();
    }
  }, [router.isReady, quoteId, firebaseUser]);

  const handleConfirmAndPay = async () => {
    if (!isConfirmed || !coverNoteAddress.trim()) {
      alert('Please confirm the details and enter the delivery address before proceeding.');
      return;
    }

    setLoading(true);
    try {
            const policyRef = doc(db, 'policies', quote.id);

            await updateDoc(policyRef, {
                cover_note_address: coverNoteAddress, 
                status: 'completed', 
                paymentDate: serverTimestamp(),
            });

      router.push(`/payment-selection?orderId=${quoteId}`);

    } catch (error) {
      console.error("Error during confirmation and policy creation: ", error);
      alert('Failed to process your request. Please try again.');
      setLoading(false);
    }
  };
  
  const formatCurrency = (value) => {
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
      return 'RM 0.00';
    }
    return `RM ${numberValue.toFixed(2)}`;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!quote) {
    return <div className="min-h-screen flex items-center justify-center">Quotation not found or already processed.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Confirm & Pay - CGS Insurance</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Final Confirmation</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: "80%"}}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Edit Quotation</span>
                <span>Choose Insurer</span>
                <span>Billing</span>
                <span className="font-bold">Confirm</span>
                <span>Payment</span>
            </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow space-y-8">
            <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Vehicle Information</h3>
                <dl className="mt-4 border-t border-gray-200">
                    <DetailItem label="Car Plate Number" value={quote.plateNumber} />
                    <DetailItem label="Car Brand" value={quote.car_brand} />
                    <DetailItem label="Car Model" value={quote.vehicleModel} />
                    <DetailItem label="Manufactured Year" value={quote.manufactured_year} />
                </dl>
            </div>

            <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Coverage Details</h3>
                <dl className="mt-4 border-t border-gray-200">
                    <DetailItem label="Insurer" value={quote.insurer} />
                    <DetailItem label="Coverage Type" value={quote.coverage_type} />
                    <DetailItem label="Additional Protections" value={quote.selectedAddOns?.map(item => protectionLabels[item] || item).join(', ') || 'None'} />
                    <DetailItem label="Total Amount Payable" value={<span className="font-bold text-blue-600">{formatCurrency(quote.price)}</span>} />
                </dl>
            </div>
            
            <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                <dl className="mt-4 border-t border-gray-200">
                    <DetailItem label="Full Name" value={quote.customer_name} />
                    <DetailItem label="IC / Passport" value={quote.ic || quote.passport} />
                    <DetailItem label="Email" value={session?.user?.email} />
                    <DetailItem label="Postcode" value={quote.postcode} />
                </dl>
            </div>

            <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Delivery Address</h3>
                 <div className="mt-4 border-t border-gray-200 pt-4">
                    <label htmlFor="coverNoteAddress" className="block text-sm font-medium text-gray-700">Cover Note Address</label>
                    <textarea
                        id="coverNoteAddress"
                        rows={3}
                        className="mt-1 shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                        value={coverNoteAddress}
                        onChange={(e) => setCoverNoteAddress(e.target.value)}
                        placeholder="Please enter the full address where the cover note should be sent."
                    ></textarea>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="confirmation"
                            name="confirmation"
                            type="checkbox"
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="confirmation" className="font-medium text-gray-700">I confirm that the details are accurate and agree to send the details to JPJ.</label>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back
          </button>
          <button
            onClick={handleConfirmAndPay}
            disabled={!isConfirmed || loading || !coverNoteAddress.trim()}
            className={`border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white ${!isConfirmed || loading || !coverNoteAddress.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}>
            {loading ? 'Processing...' : 'Confirm and Proceed to Payment'}
          </button>
        </div>
      </main>
    </div>
  );
}
