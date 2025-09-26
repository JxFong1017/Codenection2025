import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Head from 'next/head';
import { carData } from '../src/data/carData';

export default function BillingPage() {
  const router = useRouter();
  const { quoteId } = router.query;

  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingDetails, setBillingDetails] = useState(null);

  useEffect(() => {
    if (!quoteId) return;

    const fetchQuoteAndCalculate = async () => {
      setLoading(true);
      const quoteRef = doc(db, 'quotations', quoteId);
      const quoteSnap = await getDoc(quoteRef);

      if (quoteSnap.exists()) {
        const quoteData = quoteSnap.data();
        setQuote(quoteData);

        // --- Re-calculate Billing Details --- 
        const { 
            car_brand,
            vehicleModel,
            manufactured_year,
            postcode,
            coverage_type,
            selectedAddOns,
            ncd
        } = quoteData;

        const selectedCar = carData.find(c => c.make === car_brand && c.model === vehicleModel);

        if (selectedCar && manufactured_year && postcode) {
            const carAge = new Date().getFullYear() - parseInt(manufactured_year, 10);
            const depreciationFactor = Math.max(0.3, Math.pow(0.9, carAge));
            const sumInsured = selectedCar.marketValue * depreciationFactor;

            const { engineCapacity } = selectedCar;
            const firstTwoPostcodeDigits = parseInt(postcode.substring(0, 2), 10);
            const isEastMalaysia = (firstTwoPostcodeDigits >= 88 && firstTwoPostcodeDigits <= 91) || (firstTwoPostcodeDigits >= 93 && firstTwoPostcodeDigits <= 98);

            const comprehensiveRates = {
                peninsular: { rates: [ { cc: 1400, base: 273.8 }, { cc: 1650, base: 305.5 }, { cc: 2200, base: 339.1 }, { cc: 3050, base: 372.6 }, { cc: 4100, base: 404.3 }, { cc: 4250, base: 436.0 }, { cc: 4400, base: 469.6 }, { cc: Infinity, base: 501.3 } ], per1000: 26.0 },
                east: { rates: [ { cc: 1400, base: 219.0 }, { cc: 1650, base: 244.4 }, { cc: 2200, base: 271.3 }, { cc: 3050, base: 298.1 }, { cc: 4100, base: 323.4 }, { cc: 4250, base: 348.8 }, { cc: 4400, base: 375.7 }, { cc: Infinity, base: 401.1 } ], per1000: 20.3 },
            };
            const thirdPartyRates = {
                peninsular: [ { cc: 1400, premium: 120.6 }, { cc: 1650, premium: 135.0 }, { cc: 2200, premium: 151.2 }, { cc: 3050, premium: 167.4 }, { cc: 4100, premium: 181.8 }, { cc: 4250, premium: 196.2 }, { cc: 4400, premium: 212.4 }, { cc: Infinity, premium: 226.8 } ],
                east: [ { cc: 1400, premium: 95.9 }, { cc: 1650, premium: 107.5 }, { cc: 2200, premium: 120.6 }, { cc: 3050, premium: 133.6 }, { cc: 4100, premium: 145.1 }, { cc: 4250, premium: 156.5 }, { cc: 4400, premium: 169.6 }, { cc: Infinity, premium: 181.1 } ],
            };

            let basePremium = 0;
            if (coverage_type === "Comprehensive") {
                const rates = isEastMalaysia ? comprehensiveRates.east : comprehensiveRates.peninsular;
                const rateTier = rates.rates.find(tier => engineCapacity <= tier.cc);
                const excessValue = Math.max(0, sumInsured - 1000);
                basePremium = rateTier.base + (excessValue / 1000) * rates.per1000;
            } else if (coverage_type === "Third-Party, Fire & Theft") {
                 const rates = isEastMalaysia ? comprehensiveRates.east : comprehensiveRates.peninsular;
                const rateTier = rates.rates.find(tier => engineCapacity <= tier.cc);
                const excessValue = Math.max(0, sumInsured - 1000);
                const compPremium = rateTier.base + (excessValue / 1000) * rates.per1000;
                basePremium = compPremium * 0.75;
            } else { // Third-Party Only
                const rates = isEastMalaysia ? thirdPartyRates.east : thirdPartyRates.peninsular;
                const rateTier = rates.find(tier => engineCapacity <= tier.cc);
                basePremium = rateTier.premium;
            }
            
            let additionalCoverageCost = 0;
            if (coverage_type === "Comprehensive" && selectedAddOns && selectedAddOns.length > 0) {
                additionalCoverageCost = selectedAddOns.reduce((acc, protectionId) => {
                    if (protectionId === 'windscreen') return acc + 150;
                    if (protectionId === 'natural_disaster') return acc + sumInsured * 0.005;
                    if (protectionId === 'strike_riot') return acc + sumInsured * 0.003;
                    if (protectionId === 'personal_accident') return acc + 100;
                    if (protectionId === 'towing') return acc + 50;
                    if (protectionId === 'named_driver') return acc + 10;
                    if (protectionId === 'all_driver') return acc + 50;
                    if (protectionId === 'passengers_coverage') return acc + 25;
                    return acc;
                }, 0);
            }

            const ncdDiscount = basePremium * (ncd / 100);
            const grossPremium = basePremium - ncdDiscount + additionalCoverageCost;
            const sst = grossPremium * 0.06;
            const stampDuty = 10.00;
            const commission = grossPremium * 0.10; // 10% commission
            const grandTotal = parseFloat(quoteData.price.replace('RM','')); // Use the price from the selected insurer

            setBillingDetails({
                coverType: coverage_type,
                sumInsured,
                basicPremium: basePremium,
                ncd, 
                ncdDiscount,
                grossPremium,
                additionalCoverageCost, // For detailed breakdown if needed
                sst,
                stampDuty,
                commission,
                grandTotal
            });
        }

      } else {
        console.error("Quotation not found");
      }
      setLoading(false);
    };

    fetchQuoteAndCalculate();
  }, [quoteId]);

  const handleProceed = async () => {
    // Here you would navigate to the final confirmation/payment page
    router.push(`/payment?quoteId=${quoteId}`);
  };

  const handleBack = () => {
      router.push(`/choose-insurer?quoteId=${quoteId}`);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading billing details...</div>;
  }

  if (!quote || !billingDetails) {
    return <div className="min-h-screen flex items-center justify-center">Could not load billing details.</div>;
  }

  const formatCurrency = (value) => `RM ${value.toFixed(2)}`;

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
                <p>Our customers is always 1st priority. There are no cancellation fees, and full refund will be given to cancellation requests for any policies not enforced. <a href="#" className="underline">Learn more</a></p>
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
                    className="border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Proceed to Confirmation
                </button>
            </div>
        </main>
    </div>
  );
}
