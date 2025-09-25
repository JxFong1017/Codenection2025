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
        const q = query(
          collection(db, "quotations"),
          where("userId", "==", session.user.email), // Use user.email as requested
          where("status", "not-in", ["deleted"]),
          orderBy("quotation_no", "desc")
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
                quotations.map((quote) => (
                  <div key={quote.quotation_no} className="bg-[#BFE4ED] rounded-lg p-6 h-72 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-bold text-lg">#{quote.quotation_no}</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          quote.status === "pending" ? "bg-[#F9F871] text-black" : "bg-[#00C898] text-white"
                        }`}>
                          {t(quote.status)}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="font-bold text-3xl text-[#162679]">
                          {quote.plateNumber}
                        </span>
                        <span className="self-end font-semibold text-2xl text-[#162679]">
                          RM{quote.price}
                        </span>
                        <div className="flex space-x-2">
                          <span className="font-semibold text-2xl text-[#162679]">
                            {quote.car_brand}
                          </span>
                          <span className="font-semibold text-2xl text-[#162679]">
                            {quote.vehicleModel}
                          </span>
                          <span className="font-semibold text-2xl text-[#162679]">
                            {quote.manufactured_year}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedQuote(quote)}
                      className="w-full mt-4 bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50"
                    >
                      {t("view")}
                    </button>
                  </div>
                ))
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