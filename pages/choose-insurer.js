import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';

export default function ChooseInsurerPage() {
  const router = useRouter();
  const { quoteId } = router.query;
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInsurer, setSelectedInsurer] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (quoteId) {
      const fetchQuote = async () => {
        setLoading(true);
        const quoteRef = doc(db, 'quotations', quoteId);
        const quoteSnap = await getDoc(quoteRef);

        if (quoteSnap.exists()) {
          const quoteData = quoteSnap.data();
          setQuote({ id: quoteSnap.id, ...quoteData });
          if(quoteData.insurer) {
            setSelectedInsurer(quoteData.insurer);
            // Determine which price to set based on coverage type
            if (quoteData.coverage_type === 'Comprehensive') {
                setSelectedPrice(quoteData.comprehensive_premium);
            } else if (quoteData.coverage_type === 'Third-Party, Fire & Theft') {
                setSelectedPrice(quoteData.tpft_premium);
            } else {
                setSelectedPrice(quoteData.third_party_premium);
            }
          }
        } else {
          console.log('No such document!');
        }
        setLoading(false);
      };
      fetchQuote();
    }
  }, [quoteId]);

  const handleProceed = async () => {
    if (!selectedInsurer) {
      alert('Please select an insurer to proceed.');
      return;
    }
    setLoading(true);
    try {
        const quoteRef = doc(db, 'quotations', quoteId);
        await updateDoc(quoteRef, {
            insurer: selectedInsurer,
            price: selectedPrice,
            // You might want to distinguish between different premiums
            comprehensive_premium: quote.coverage_type === 'Comprehensive' ? selectedPrice : 'N/A',
            tpft_premium: quote.coverage_type === 'Third-Party, Fire & Theft' ? selectedPrice : 'N/A',
            third_party_premium: quote.coverage_type === 'Third-Party Only' ? selectedPrice : 'N/A',
        });
        router.push(`/billing?quoteId=${quoteId}`);
    } catch (error) {
        console.error("Error updating document: ", error);
        alert('Failed to save selection. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleSelection = (insurer, price) => {
    setSelectedInsurer(insurer);
    setSelectedPrice(price);
  };
  
  if (loading || status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!quote) {
    return <div className="min-h-screen flex items-center justify-center">Quotation not found.</div>;
  }
  
  const getPriceForInsurer = (insurerKey) => {
      if (!quote) return 'N/A';
      if (quote.coverage_type === 'Comprehensive') {
          return quote[`comprehensive_${insurerKey}`];
      }
      if (quote.coverage_type === 'Third-Party, Fire & Theft') {
          return quote[`tpft_${insurerKey}`];
      }
      if (quote.coverage_type === 'Third-Party Only') {
          return quote[`third_party_only_${insurerKey}`];
      }
      return 'N/A';
  }

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
              'FREE Replacement of tyre service'
          ]
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
              'FREE Locksmith Services'
          ]
      },
      {
          key: 'safedrive',
          name: 'SafeDrive Assurance',
          features: [
              'FREE 24-hour Emergency Towing up to 150km',
              'FREE 24-hour Roadside Assistance',
              'FREE Jumpstart or change of battery service',
              'FREE Refuel empty tank service',
              'FREE Replacement of tyre service'
          ]
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
              'Suitable for E-hailing purpose'
          ]
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
              'Suitable for E-hailing purpose'
          ]
      }
  ];

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
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: "40%"}}></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Edit Quotation</span>
            <span>Choose Insurer</span>
            <span>Billing</span>
            <span>Confirm</span>
            <span>Payment</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurer</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Select</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {insurers.map((insurer) => {
                            const price = getPriceForInsurer(insurer.key);
                            if (price === 'N/A' || !price) return null; // Don't show insurer if no price is available
                            return (
                                <tr key={insurer.key}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{insurer.name}</div>
                                        <ul className="list-disc list-inside text-xs text-gray-500 mt-2 space-y-1">
                                            {insurer.features.map((feature, index) => <li key={index}>{feature}</li>)}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <input
                                            type="radio"
                                            name="insurer"
                                            checked={selectedInsurer === insurer.name}
                                            onChange={() => handleSelection(insurer.name, price)}
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
            <button
                onClick={() => router.push(`/confirm?quoteId=${quoteId}`)}
                className="bg-gray-200 text-gray-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
                Back
            </button>
            <button
                onClick={handleProceed}
                disabled={!selectedInsurer || loading}
                className={`border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white ${!selectedInsurer || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
                {loading ? 'Saving...' : 'Proceed to Next Step'}
            </button>
        </div>
      </main>
    </div>
  );
}
