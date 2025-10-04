
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Head from 'next/head';
import Image from 'next/image';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Placeholder logos
const visaMastercardLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 384 512'%3E%3Cpath d='M336 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM96 368H48v-48h48v48zm0-80H48v-48h48v48zm0-80H48v-48h48v48zm80 160h-48v-48h48v48zm0-80h-48v-48h48v48zm0-80h-48v-48h48v48zm160 160h-48v-48h48v48zm0-80h-48v-48h48v48zm0-80h-48v-48h48v48zm-80 160h-48v-48h48v48zm0-80h-48v-48h48v48z' fill='%230166b3'/%3E%3C/svg%3E";
const fpxLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 512 512'%3E%3Cpath d='M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.6 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z' fill='%231a478a'/%3E%3C/svg%3E";
const sevenElevenLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 448 512'%3E%3Cpath d='M352 240V320H320V272H288v48H256V240h96zM224 240H128v48h48v32H128v48h96v-48h-48v-32h48V240zm128-48a160 160 0 1 0-320 0 160 160 0 1 0 320 0zM448 256A192 192 0 1 1 64 256a192 192 0 1 1 384 0z' fill='%23f26522'/%3E%3C/svg%3E";
const kkMartLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 640 512'%3E%3Cpath d='M320 32c-17.7 0-32 14.3-32 32V256H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H288V448c0 17.7 14.3 32 32 32s32-14.3 32-32V320H592c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64c0-17.7-14.3-32-32-32z' fill='%23e62129'/%3E%3C/svg%3E";

export default function PaymentSelectionPage() {
  const router = useRouter();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState('credit_card');
  const { quoteId } = router.query;
  
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

  const handlePayNow = () => {
    router.push(`/payment-redirect?quoteId=${quoteId}`);
  };

  if (loading || !quote) {
    return <div className="min-h-screen flex items-center justify-center">Loading payment details...</div>;
  }

  const PaymentOption = ({ value, label, iconSrc }) => (
    <div
      onClick={() => setSelectedPayment(value)}
      className={`p-4 border rounded-lg cursor-pointer flex items-center justify-between transition-all ${selectedPayment === value ? 'border-blue-600 ring-2 ring-blue-600' : 'border-gray-300'}`}
    >
      <div className="flex items-center cursor-pointer">
        <input
          type="radio"
          id={value}
          name="payment_option"
          value={value}
          checked={selectedPayment === value}
          onChange={() => setSelectedPayment(value)}
          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
        />
        <span className="ml-4 text-sm font-medium text-gray-800">{label}</span>
      </div>
      {iconSrc && <Image src={iconSrc} alt={label} width={80} height={24} objectFit="contain" />}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>Select Payment Method - CGS Insurance</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Choose a Payment Method</h1>
        </div>
      </header>
      <main className="flex-grow max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Full Payment</h2>
          <div className="space-y-4">
            <PaymentOption value="credit_card" label="Credit / Debit Card" iconSrc={visaMastercardLogo}/>
            <PaymentOption value="fpx" label="FPX Online Banking" iconSrc={fpxLogo} />
            <PaymentOption value="cash_7eleven" label="Cash (7-eleven)" iconSrc={sevenElevenLogo}/>
            <PaymentOption value="cash_kkmart" label="Cash (KK Mart)" iconSrc={kkMartLogo} />
          </div>
        </div>
      </main>
      <footer className="sticky bottom-0 bg-white border-t border-gray-200 shadow-t-lg">
          <div className="max-w-lg mx-auto">
              <div className="bg-blue-800 text-white p-3 flex justify-between items-center">
                  <span className="text-sm font-semibold tracking-wider">AMOUNT PAYABLE</span>
                  <span className="text-xl font-bold">
                    RM{Number(quote.price).toFixed(2)}
                  </span>

              </div>
              <div className="p-4 bg-white">
                  <button
                      onClick={handlePayNow}
                      className="w-full bg-orange-500 text-white font-bold py-3 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                  >
                      Pay Now
                  </button>
              </div>
          </div>
      </footer>
    </div>
  );
}
