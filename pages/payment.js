
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Head from 'next/head';
import { useSession } from 'next-auth/react';

export default function PaymentPage() {
  const router = useRouter();
  const { quoteId } = router.query;
  const { data: session } = useSession();

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
    if (quoteId) {
      const fetchQuote = async () => {
        setLoading(true);
        const quoteRef = doc(db, 'quotations', quoteId);
        const quoteSnap = await getDoc(quoteRef);

        if (quoteSnap.exists()) {
          setQuote({ id: quoteSnap.id, ...quoteSnap.data() });
        } else {
          console.log('No such document!');
        }
        setLoading(false);
      };
      fetchQuote();
    }
  }, [quoteId]);

  const handleConfirmAndPay = async () => {
    if (!isConfirmed) {
      alert('Please confirm the details are accurate before proceeding.');
      return;
    }
    if (!coverNoteAddress.trim()) {
        alert('Please enter the Cover Note Address.');
        return;
    }

    setLoading(true);
    try {
      // **LOGIC CORRECTED: Update the existing quote to 'completed'**
      const quoteRef = doc(db, 'quotations', quoteId);
      await updateDoc(quoteRef, {
        status: 'completed',
        cover_note_address: coverNoteAddress,
        user_email: session?.user?.email, // Ensure email is saved
        submittedAt: serverTimestamp(), // Mark the time of completion
      });

      // Proceed to payment flow using the SAME ID, now treated as an orderId
      router.push(`/payment-selection?orderId=${quoteId}`);

    } catch (error) {
      console.error("Error updating document to completed: ", error);
      alert('Failed to update your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!quote) {
    return <div className="min-h-screen flex items-center justify-center">Quotation not found.</div>;
  }
  
  const DetailItem = ({ label, value }) => (
    value ? (
        <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
        </div>
    ) : null
  );

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
            {/* Vehicle Info */}
            <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Vehicle Information</h3>
                <dl className="mt-4 border-t border-gray-200">
                    <DetailItem label="Car Plate Number" value={quote.plateNumber} />
                    <DetailItem label="Car Brand" value={quote.car_brand} />
                    <DetailItem label="Car Model" value={quote.vehicleModel} />
                    <DetailItem label="Manufactured Year" value={quote.manufactured_year} />
                </dl>
            </div>

            {/* Coverage Info */}
            <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Coverage Details</h3>
                <dl className="mt-4 border-t border-gray-200">
                    <DetailItem label="Insurer" value={quote.insurer} />
                    <DetailItem label="Coverage Type" value={quote.coverage_type} />
                    <DetailItem label="Additional Protections" value={quote.selectedAddOns?.map(item => protectionLabels[item] || item).join(', ') || 'None'} />
                    <DetailItem label="Total Amount Payable" value={<span className="font-bold text-blue-600">{quote.price}</span>} />
                </dl>
            </div>
            
            {/* Personal Info */}
            <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                <dl className="mt-4 border-t border-gray-200">
                    <DetailItem label="Full Name" value={quote.customer_name} />
                    <DetailItem label="IC / Passport" value={quote.ic || quote.passport} />
                    <DetailItem label="Email" value={session?.user?.email} />
                    <DetailItem label="Postcode" value={quote.postcode} />
                </dl>
            </div>

            {/* Cover Note Address */}
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

            {/* Confirmation */}
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
                <p className="text-xs text-gray-500">Note: Your quotation price is based on your postcode. If you wish to change your postcode, please request for a new quote.</p>
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
            {loading ? 'Confirming...' : 'Confirm and Pay'}
          </button>
        </div>
      </main>
    </div>
  );
}
