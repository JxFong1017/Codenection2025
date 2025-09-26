import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useT } from "../src/utils/i18n";
import Image from "next/image";
import Link from "next/link";
import QuotationDetail from "../src/components/QuotationDetail";

export default function AllQuotes() {
  const t = useT();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quotations, setQuotations] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    const fetchQuotations = async () => {
    if (status === "authenticated" && session?.user?.email) {
        // Corrected and improved query to align with the dashboard
        const q = query(
        collection(db, "quotations"),
        where("user_email", "==", session.user.email), // Use the correct field 'user_email'
        where("status", "in", ["pending", "confirmed", "completed"]), // Explicitly fetch all relevant statuses
        orderBy("createdAt", "desc") // Order by creation time for consistency
        );

        try {
        const querySnapshot = await getDocs(q);
        const userQuotations = [];
        querySnapshot.forEach((doc) => {
            userQuotations.push({ id: doc.id, ...doc.data() });
        });
        setQuotations(userQuotations);
        } catch (error) {
        console.error("Error fetching user quotations: ", error);
        }
    }
    };

    fetchQuotations();
}, [session, status]);


  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }
  const formatPrice = (price) => {
    if (price === null || typeof price === 'undefined' || price === '') return 'N/A';
    const priceStr = String(price);
    if (priceStr.startsWith('RM')) {
      return priceStr;
    }
    return `RM${priceStr}`;
  };

  return (
    <>
      <Head>
        <title>All Quotes - CGS Insurance</title>
        <meta name="description" content="All your car insurance quotations" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/dashboard">
                  <h1 className="text-2xl font-extrabold text-blue-900">CGS</h1>
                </Link>
              </div>
              <div className="flex items-center">
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-900">
                  {t("Back to Home Page")}
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-black mb-4">
              {t("All Quotes History")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quotations.length > 0 ? (
 quotations.map((quote) => {
  const statusColors = {
    pending: "bg-yellow-300 text-black",
    confirmed: "bg-green-500 text-white",
    completed: "bg-green-500 text-white", // Green for completed
  };

  return (
    <div key={quote.id} className="bg-[#BFE4ED] rounded-lg p-6 h-72 flex flex-col justify-between">
      <div>
        {/* Top section: ID and Status */}
        <div className="flex justify-between items-start mb-4">
          <div className="font-bold text-lg">#{quote.quotation_no || quote.id}</div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[quote.status] || 'bg-gray-400'}`}>
            {t(quote.status)}
          </span>
        </div>

        {/* Middle section: Vehicle Info */}
        <div className="flex flex-col space-y-1">
          <span className="font-bold text-3xl text-[#162679]">
            {quote.plateNumber}
          </span>
          <span className="self-end font-semibold text-2xl text-[#162679]">
            {formatPrice(quote.price)}
          </span>
          <div className="text-xl text-gray-700">
            <span>{quote.car_brand} {quote.vehicleModel} {quote.manufactured_year}</span>
          </div>
        </div>

        {/* Message for completed quotes */}
        {quote.status === 'completed' && (
           <p className="text-sm text-gray-800 pt-3">
             You have completed your payment, please check in My Car Records.
           </p>
        )}
      </div>

      {/* Bottom section: Button (or lack thereof) */}
      <div className="h-10"> {/* Fixed height for alignment */}
        {quote.status !== 'completed' && (
          <button
            onClick={() => setSelectedQuote(quote)}
            className="w-full bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50"
          >
            {t('view')}
          </button>
        )}
      </div>
    </div>
  );
})

              ) : (
                <p className="col-span-3 text-center text-gray-500">
                  No quotations found.
                </p>
              )}
            </div>

            {selectedQuote && (
              <QuotationDetail quote={selectedQuote} onClose={() => setSelectedQuote(null)} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}