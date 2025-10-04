
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../lib/firebase';
import Head from 'next/head';

// ADDED: Insurer-specific data to find the correct adjustment factor
const insurerAdjustments = {
    abc: 1.0,
    xyz: 1.05,
    safedrive: 1.08,
    guardian: 1.1,
    metroprotect: 1.12,
};

const insurers = [
    { key: 'abc', name: 'ABC Insurance Ltd.' },
    { key: 'xyz', name: 'XYZ General Insurance' },
    { key: 'safedrive', name: 'SafeDrive Assurance' },
    { key: 'guardian', name: 'Guardian Insurance' },
    { key: 'metroprotect', name: 'MetroProtect Insurance' },
];

export default function BillingPage() {
  const router = useRouter();
  const { quoteId } = router.query;

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingDetails, setBillingDetails] = useState(null);
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
    if (quoteId && firebaseUser) {
      const fetchQuote = async () => {
        setLoading(true);
        try {
          const policyRef = doc(db, 'policies', quoteId);
          const quoteSnap = await getDoc(policyRef);

          if (quoteSnap.exists() && quoteSnap.data().user_email === firebaseUser.email) {
            setQuote({ id: quoteSnap.id, ...quoteSnap.data() });
          } else {
            console.error('Billing page: Policy document not found or access denied.');
            setQuote(null);
          }
        } catch (error) {
          console.error("Error fetching document:", error);
          setQuote(null);
        } finally {
          setLoading(false);
        }
      };
      fetchQuote();
    }
  }, [quoteId, firebaseUser]);

  // REVISED: This hook now correctly calculates the premium breakdown based on the chosen insurer
  useEffect(() => {
    if (quote) {
        const parseCurrency = (value) => {
            if (typeof value === 'string') {
                return parseFloat(value.replace(/RM|,/g, '')) || 0;
            }
            return parseFloat(value) || 0;
        };

        // Find the selected insurer's adjustment factor
        const selectedInsurer = insurers.find(ins => ins.name === quote.insurer);
        const adjustmentFactor = selectedInsurer ? insurerAdjustments[selectedInsurer.key] : 1.0;

        const basicPremium = parseCurrency(quote.basePremium);
        const ncdPercentage = parseFloat(quote.ncd) || 0;
        const additionalCoverageCost = parseCurrency(quote.additionalProtectionsPremium);

        const ncdDiscount = basicPremium * (ncdPercentage / 100);
        const grossPremiumUnadjusted = basicPremium - ncdDiscount + additionalCoverageCost;

        // Apply the insurer-specific adjustment to the gross premium
        const grossPremium = grossPremiumUnadjusted * adjustmentFactor;
        
        const sst = grossPremium * 0.06;
        const stampDuty = 10.00;
        const commission = basicPremium * 0.10; 
        const grandTotal = grossPremium + sst + stampDuty;

      setBillingDetails({
        coverType: quote.coverage_type,
        sumInsured: parseCurrency(quote.sumInsured),
        basicPremium,
        ncd: ncdPercentage,
        ncdDiscount,
        additionalCoverageCost,
        grossPremium,
        sst,
        stampDuty,
        commission,
        grandTotal
      });
    }
  }, [quote]);


  const handleProceed = () => {
    if (!quoteId) return;
    router.push(`/payment?quoteId=${quoteId}`);
  };

  const handleBack = () => {
    router.push(`/choose-insurer?quoteId=${quoteId}`);
  }

  if (loading || !firebaseUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading billing details...</div>;
  }

  if (!quote || !billingDetails) {
    return <div className="min-h-screen flex items-center justify-center">Could not load billing details.</div>;
  }

  const formatCurrency = (value) => {
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
      return 'RM 0.00';
    }
    return `RM ${numberValue.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <Head>
            <title>Billing Details - CGS Insurance</title>
        </Head>

        <header className="bg-white shadow-sm">
            <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900">Billing Details</h1>
            </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: "60%"}}></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Edit Quotation</span>
                    <span>Choose Insurer</span>
                    <span className="font-bold">Billing</span>
                    <span>Confirm</span>
                    <span>Payment</span>
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Premium Breakdown</h2>
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Cover Type</span>
                        <span className="font-medium text-gray-900">{billingDetails.coverType}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Sum Insured</span>
                        <span className="font-medium text-gray-900">{formatCurrency(billingDetails.sumInsured)}</span>
                    </div>
                     <hr className="my-4"/>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Basic Premium</span>
                        <span className="font-medium text-gray-900">{formatCurrency(billingDetails.basicPremium)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">NCD ({billingDetails.ncd}%)</span>
                        <span className="font-medium text-red-500">-{formatCurrency(billingDetails.ncdDiscount)}</span>
                    </div>
                     {billingDetails.additionalCoverageCost > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-600">Additional Protections</span>
                            <span className="font-medium text-gray-900">{formatCurrency(billingDetails.additionalCoverageCost)}</span>
                        </div>
                    )}
                    <hr className="my-4"/>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Gross Premium</span>
                        <span className="font-medium text-gray-900">{formatCurrency(billingDetails.grossPremium)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">SST (6%)</span>
                        <span className="font-medium text-gray-900">{formatCurrency(billingDetails.sst)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Stamp Duty</span>
                        <span className="font-medium text-gray-900">{formatCurrency(billingDetails.stampDuty)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Agency Commission (10%)</span>
                        <span className="font-medium text-gray-900">-{formatCurrency(billingDetails.commission)}</span>
                    </div>
                    <hr className="my-8"/>
                    <div className="flex justify-between text-xl font-bold">
                        <span className="text-gray-900">Grand Total</span>
                        <span className="text-blue-600">{formatCurrency(billingDetails.grandTotal)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-xs text-gray-500 space-y-3">
                <p>Our customers is always 1st priority. There are no cancellation fees, and a full refund will be given to cancellation requests for any policies not enforced. </p>
                <p>CGS Sdn Bhd is an approved insurance and takaful agent under the Financial Services Act 2013 & Islamic Financial Services Act 2013 and regulated by BNM.</p>
                <p>Similar auto insurance products are available at ITOs' websites that provides a rebate on commission without service.</p>
                <p>All insurers on our platform are members of PIDM. The benefit(s) payable under eligible policy is protected by PIDM up to limits. Please refer to PIDM Brochure or contact our insurer or PIDM.</p>
                <p>The Product Disclosure Sheet will be provided to you in digital form only.</p>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={handleBack}
                    className="bg-gray-200 text-gray-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    Back
                </button>
                <button
                    onClick={handleProceed}
                    disabled={loading}
                    className="border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Loading...' : 'Proceed to Confirmation'}
                </button>

            </div>
        </main>
    </div>
  );
}
