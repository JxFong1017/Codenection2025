
import { useRouter } from 'next/router';
import React, { useEffect, useState, Fragment } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../lib/firebase';
import Head from 'next/head';

const ProgressBar = ({ currentStep }) => {
  return (
      <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{width: "40%"}}></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Edit Quotation</span>
              <span className="font-bold">Choose Insurer</span>
              <span>Billing</span>
              <span>Confirm</span>
              <span>Payment</span>
          </div>
      </div>
  );
};

// ADDED: The crucial insurer-specific adjustment factors
const insurerAdjustments = {
    abc: 1.0,
    xyz: 1.05,
    safedrive: 1.08,
    guardian: 1.1,
    metroprotect: 1.12,
};

export default function ChooseInsurerPage() {
  const router = useRouter();
  const { quoteId } = router.query;
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  // MODIFIED: State now holds only the selected insurer's key
  const [selectedInsurerKey, setSelectedInsurerKey] = useState('');
  const [firebaseUser, setFirebaseUser] = useState(null);
  // MODIFIED: State now holds an object of prices, keyed by insurer key
  const [insurerPrices, setInsurerPrices] = useState({});

  const insurers = [
    {
      key: 'abc',
      name: 'ABC Insurance Ltd.',
      features: [
        'FREE All Drivers Coverage',
        'FREE 24-hour towing up to 50km every trip, no trip limit',
        'FREE 24-hour roadside assistance program',
        'FREE Jumpstart or change of battery service',
        'FREE Refuel empty tank service',
        'FREE Replacement of tyre service',
      ],
    },
    {
      key: 'xyz',
      name: 'XYZ General Insurance',
      features: [
        'FREE 24 hours Emergency towing up to 100km',
        'FREE 24 hours Roadside Assistance - Bantuan Ikhlas',
        'FREE additional 10 drivers',
        'FREE Jump start and Battery replacement services',
        'FREE Changing of Flat Tyre Services',
        'FREE Petrol Assistance Services',
        'FREE Locksmith Services',
      ],
    },
    {
      key: 'safedrive',
      name: 'SafeDrive Assurance',
      features: [
        'FREE 24-hour Emergency Towing up to 150km',
        'FREE 24-hour Roadside Assistance',
        'FREE Jumpstart or change of battery service',
        'FREE Refuel empty tank service',
        'FREE Replacement of tyre service',
      ],
    },
    {
      key: 'guardian',
      name: 'Guardian Insurance',
      features: [
        'FREE 24-hour Emergency Towing up to 150km',
        'FREE 1 Additional Driver',
        'FREE 24-hour Claim Assistance',
        'Best Car Insurer 2018',
        'Instant Cover Note approval',
        'Suitable for E-hailing purpose',
      ],
    },
    {
      key: 'metroprotect',
      name: 'MetroProtect Insurance',
      features: [
        'FREE 24-hour Emergency Towing up to 150km',
        'FREE 24-hour Roadside Assistance',
        'FREE Jumpstart or change of battery service',
        'FREE Refuel empty tank service',
        'FREE Replacement of tyre service',
        'FREE 1 Additional Driver',
        'FREE 24-hour Claim Assistance',
        'FREE Personal Accident (PA) coverage for Policy Holder (Up to RM 10,000.00)',
        'FREE Medical Expenses for Policy Holder (Up to RM1,500)',
        'FREE Key Replacement',
        'FREE Childseat Replacement',
        'Suitable for E-hailing purpose',
      ],
    },
  ];

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
          const docSnap = await getDoc(policyRef);

          if (docSnap.exists() && docSnap.data().user_email === firebaseUser.email) {
            const quoteData = docSnap.data();
            setQuote({ id: docSnap.id, ...quoteData });

            if (quoteData.insurer) {
              const preSelectedInsurer = insurers.find(ins => ins.name === quoteData.insurer);
              if(preSelectedInsurer) {
                // MODIFIED: Set the key of the pre-selected insurer
                setSelectedInsurerKey(preSelectedInsurer.key);
              }
            }
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
  }, [quoteId, firebaseUser]);

    // MODIFIED: This effect now calculates a price for EACH insurer
    useEffect(() => {
        if (quote) {
            const parseCurrency = (value) => {
                if (typeof value === 'string') {
                    return parseFloat(value.replace(/RM|,/g, '')) || 0;
                }
                return parseFloat(value) || 0;
            };

            const basicPremium = parseCurrency(quote.basePremium);
            const ncdPercentage = parseFloat(quote.ncd) || 0;
            const additionalCoverageCost = parseCurrency(quote.additionalProtectionsPremium) || 0;

            const ncdDiscount = basicPremium * (ncdPercentage / 100);
            const grossPremiumUnadjusted = basicPremium - ncdDiscount + additionalCoverageCost;
            
            const prices = {};
            insurers.forEach(insurer => {
                const adjustmentFactor = insurerAdjustments[insurer.key] || 1.0;
                const adjustedGrossPremium = grossPremiumUnadjusted * adjustmentFactor;
                const sst = adjustedGrossPremium * 0.06;
                const stampDuty = 10.00;
                const finalPrice = adjustedGrossPremium + sst + stampDuty;
                prices[insurer.key] = finalPrice;
            });

            setInsurerPrices(prices);
        }
    }, [quote]);


  // MODIFIED: This function now saves the insurer-specific price
  const handleProceed = async () => {
    if (!selectedInsurerKey || !quote) {
      alert('Please select an insurer to proceed.');
      return;
    }
    setLoading(true);
    
    const selectedInsurer = insurers.find(ins => ins.key === selectedInsurerKey);
    const finalPrice = insurerPrices[selectedInsurerKey];

    try {
      const policyRef = doc(db, 'policies', quoteId);

      await updateDoc(policyRef, {
        insurer: selectedInsurer.name,
        price: finalPrice, // Use the correctly calculated, insurer-specific price
      });

      router.push(`/billing?quoteId=${quoteId}`);

    } catch (error) {
      console.error("Error updating policy document: ", error);
      alert('Failed to save selection. Please try again.');
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || typeof value === 'undefined') return 'N/A';
    return `RM ${parseFloat(value).toFixed(2)}`;
  }


  if (loading || !firebaseUser || !quote) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Choose Insurer - CGS Insurance</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Choose Your Insurer</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressBar currentStep={3} />
        <div className="bg-white p-8 rounded-lg shadow">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurer</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Features</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                          <th scope="col" className="relative px-6 py-3"><span className="sr-only">Select</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {insurers.map((insurer) => {
                            return (
                                <tr key={insurer.key}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{insurer.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <ul className="list-disc list-inside text-xs text-gray-600">
                                            {insurer.features.map((feature, i) => <li key={i}>{feature}</li>)}
                                        </ul>
                                    </td>

                                    {/* MODIFIED: Display the insurer-specific price */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{formatCurrency(insurerPrices[insurer.key])}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <input
                                            type="radio"
                                            name="insurer"
                                            checked={selectedInsurerKey === insurer.key}
                                            onChange={() => setSelectedInsurerKey(insurer.key)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="flex justify-between mt-8">
            <button onClick={() => router.push(`/confirm?quoteId=${quoteId}`)} className="bg-gray-200 text-gray-700 rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-300">
                Back
            </button>
            <button
                onClick={handleProceed}
                disabled={!selectedInsurerKey || loading}
                className={`rounded-md py-2 px-4 text-sm font-medium text-white ${!selectedInsurerKey || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {loading ? 'Saving...' : 'Proceed to Payment'}
            </button>
        </div>
      </main>
    </div>
  );
}
