import { collection, query, where, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../lib/firebase";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { useT } from "../src/utils/i18n";
import Link from "next/link";
import QuotationDetail from "../src/components/QuotationDetail";

export default function AllQuotes() {
  const t = useT();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quotations, setQuotations] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for latest, 'asc' for oldest
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'completed'


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      } else {
        setFirebaseUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchQuotations = async () => {
      if (status === "authenticated" && session?.user?.email) {
        const q = query(
          collection(db, "quotations"),
          where("user_email", "==", session.user.email),
          orderBy("createdAt", "desc")
        );

        try {
          const querySnapshot = await getDocs(q);
          const userQuotations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setQuotations(userQuotations);
        } catch (error) {
          console.error("Error fetching user quotations: ", error);
        }
      }
    };

    fetchQuotations();
  }, [session, status]);

  useEffect(() => {
    if (!firebaseUser) return;

    const policiesQuery = query(
      collection(db, "policies"),
      where("user_email", "==", firebaseUser.email),
      where("status", "==", "completed")
    );

    const unsubscribe = onSnapshot(policiesQuery, (querySnapshot) => {
      const userPolicies = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPolicies(userPolicies);
    });

    return () => unsubscribe();
  }, [firebaseUser]);

  const handleQuoteDeleted = (deletedQuoteId) => {
    setQuotations((prevQuotations) => prevQuotations.filter((quote) => quote.id !== deletedQuoteId));
  };

  const displayedQuotes = useMemo(() => {
    const quotesWithStatus = quotations
        .filter(quote => quote.status !== 'deleted')
        .map(quote => {
            const matchingPolicy = policies.find(record => record.original_quote_id === quote.id);
            const currentStatus = (matchingPolicy && matchingPolicy.status === 'completed') 
                                ? 'completed' 
                                : quote.status;
            return { ...quote, currentStatus };
        });

    const filtered = statusFilter !== 'all'
        ? quotesWithStatus.filter(quote => quote.currentStatus === statusFilter)
        : quotesWithStatus;

    return [...filtered].sort((a, b) => {
        const dateA = a.createdAt?.toDate() || new Date(0);
        const dateB = b.createdAt?.toDate() || new Date(0);
        if (sortOrder === 'asc') {
            return dateA - dateB;
        }
        return dateB - dateA;
    });
  }, [quotations, policies, sortOrder, statusFilter]);


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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">
                {t("All Quotes History")}
              </h3>
              <div className="flex items-center gap-4">
                <div>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <select
                    id="sort-order"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="desc">Latest to Oldest</option>
                    <option value="asc">Oldest to Latest</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quotations.filter(q => q.status !== 'deleted').length > 0 ? (
                displayedQuotes.length > 0 ? (
                  displayedQuotes.map((quote) => {
                    const statusColors = {
                      pending: "bg-yellow-300 text-black",
                      confirmed: "bg-blue-300 text-black",
                      completed: "bg-green-500 text-white",
                    };

                    const { currentStatus } = quote;
                    
                    return (
                      <div key={quote.id} className="bg-[#BFE4ED] rounded-lg p-6 h-72 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="font-bold text-lg">#{quote.quotation_no || quote.id}</div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[currentStatus] || 'bg-gray-400'}`}>
                              {t(currentStatus)}
                            </span>
                          </div>

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

                          {currentStatus === 'completed' && (
                            <p className="text-sm text-gray-800 pt-3">
                              You have completed your payment, please check in My Car Records.
                            </p>
                          )}
                        </div>

                        <div className="h-10">
                          {currentStatus !== 'completed' && (
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
                    No quotations match the current filters.
                  </p>
                )
              ) : (
                <p className="col-span-3 text-center text-gray-500">
                  No quotations found.
                </p>
              )}
            </div>

            {selectedQuote && (
              <QuotationDetail quote={selectedQuote} onClose={() => setSelectedQuote(null)} onQuoteDeleted={handleQuoteDeleted} />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
