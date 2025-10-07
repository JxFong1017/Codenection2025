import { getAuth, onAuthStateChanged } from "firebase/auth";
// In pages/dashboard.js
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore"; // Add onSnapshot
import { db } from "../lib/firebase";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import DecisionPopup from "../src/components/DecisionPopup";
import { useT } from "../src/utils/i18n";
import Image from "next/image";
import Link from "next/link";
import QuotationDetail from "../src/components/QuotationDetail";
import PolicyDetail from "../src/components/PolicyDetail.js";


export default function Dashboard() {
  const t = useT();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showDecisionPopup, setShowDecisionPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [carRecords, setCarRecords] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const handleLogout = () => {
    setShowLogoutPopup(false);
    signOut({ callbackUrl: "/" });
  };
  
  useEffect(() => {
    const auth = getAuth();

    // Set up the primary auth state listener
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, now set up the real-time data listeners.

            // --- Listener for "Recent Quotes" ---
            const recentQuotesQuery = query(
                collection(db, "quotations"),
                where("user_email", "==", user.email),
                where("status", "in", ["pending", "confirmed"]),
                orderBy("createdAt", "desc")
            );
            const recentQuotesUnsubscribe = onSnapshot(recentQuotesQuery, (querySnapshot) => {
                const userQuotations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setQuotations(userQuotations);
            }, (error) => {
                console.error("Error with recent quotes listener: ", error);
            });

            // --- Listener for "My Car Records" ---
            const carRecordsQuery = query(
                collection(db, "policies"),
                where("user_email", "==", user.email),
                where("status", "==", "completed"),
                orderBy("submittedAt", "desc")
            );
            const carRecordsUnsubscribe = onSnapshot(carRecordsQuery, (querySnapshot) => {
                const userCarRecords = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCarRecords(userCarRecords);
            }, (error) => {
                console.error("Error with car records listener: ", error);
            });

            // Return a cleanup function to unsubscribe from data listeners when the user logs out
            return () => {
                recentQuotesUnsubscribe();
                carRecordsUnsubscribe();
            };
        } else {
            // User is signed out, clear the data
            setQuotations([]);
            setCarRecords([]);
        }
    });

    // Return a cleanup function for the main auth listener when the component unmounts
    return () => authUnsubscribe();

}, []); // The empty dependency array is correct here.



  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleGetQuotation = () => {
    router.push("/get-quote");
  };

  const handleDecision = (decision) => {
    setShowDecisionPopup(false);

    if (decision === "manual") {
      router.push("/manual-quote");
    } else if (decision === "image") {
      router.push("/manual-quote?mode=image");
    }
  };

  const handleClosePopup = () => {
    setShowDecisionPopup(false);
    router.push("/manual-quote");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }
  const handleDelete = async (quoteId) => {
    if (!quoteId) return;

    // Optional: Add a confirmation dialog for safety
    if (!confirm("Are you sure you want to delete this quotation?")) {
      return;
    }

    try {
      const quoteRef = doc(db, "quotations", quoteId);
      await updateDoc(quoteRef, {
        status: "deleted",
      });
      // Remove the quote from the local state to update the UI instantly
      setQuotations((prevQuotations) =>
        prevQuotations.filter((q) => q.id !== quoteId)
      );
    } catch (error) {
      console.error("Error deleting quotation: ", error);
      alert("Failed to delete quotation. Please try again.");
    }
  };
  // --- Find cars with insurance expiring in the next 30 days ---
  const expiringSoonRecords = carRecords
    .map(record => {
      const submittedAt = record.submittedAt?.toDate();
      // Create a new date object to avoid mutating the original
      const expiryDate = submittedAt ? new Date(new Date(submittedAt).setFullYear(submittedAt.getFullYear() + 1)) : null;
      const daysLeft = expiryDate ? Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24)) : null;
      // Return the record along with the calculated daysLeft
      return { ...record, daysLeft };
    })
    .filter(record => record.daysLeft > 0 && record.daysLeft <= 30); // Filter for expiring soon

  return (
    <>
      <Head>
        <title>Dashboard - CGS Insurance</title>
        <meta name="description" content="Your car insurance dashboard" />
      </Head>

      <DecisionPopup
        isOpen={showDecisionPopup}
        onClose={handleClosePopup}
        onDecision={handleDecision}
      />

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-4xl font-extrabold text-[#004F9E] ml-1">CGS</h1>
              </div>

              <div className="flex items-center space-x-6">
                <div className="relative">
                  <button
                    onClick={() => setShowLogoutPopup(!showLogoutPopup)}
                    className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {session.user.email || "user@gmail.com"}
                  </button>

                  {showLogoutPopup && (
                    <div className="absolute right-0 translate-x-1 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <p className="px-4 py-3 text-gray-700 text-sm text-left">
                        {t("logout_confirmation")}
                      </p>
                      <div className="flex border-t border-gray-200">
                        <button
                          onClick={() => setShowLogoutPopup(false)}
                          className="flex-1 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-bl-lg"
                        >
                          {t("cancel", "Cancel")}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex-1 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-br-lg"
                        >
                          {t("log_out", "Log out")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="bg-[#162679] pt-12 pb-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div className="text-left">
              <h2 className="text-4xl font-bold text-[#F9F871] mb-4">
                {t("get_quote_instantly")}
              </h2>
              <p className="text-xl text-white mb-6">
                {t("find_best_coverage")}
              </p>
              <button
                onClick={handleGetQuotation}
                className="bg-white text-[#162679] px-8 py-3 rounded-lg font-bold hover:bg-blue-200 transition-colors"
              >
                {t("get_quote")}
              </button>
            </div>

            <div className="flex justify-center md:justify-end relative">
              <Image
                src="/images/car-picture-3.png"
                alt="Car Hero"
                width={350}
                height={200}
                className="object-contain mt-10 md:mt-10"
                priority
              />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-yellow-100 rounded-full opacity-20 -z-10"></div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* --- Dynamic Reminder Section --- */}
          <div className="bg-white rounded-lg border-2 border-black p-6 mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <Image
                  src="/images/reminder.png"
                  alt="Reminder Icon"
                  width={48}
                  height={48}
                  style={{ width: "auto", height: "auto" }}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-black">
                {t("reminder")}
              </h3>
            </div>
            {expiringSoonRecords.length > 0 ? (
              <div className="space-y-3">
                {expiringSoonRecords.map(record => (
                  <div key={record.id} className="flex items-start space-x-2">
                    <span className="text-[#162679] font-bold">•</span>
                    <p className="text-[#162679] font-bold">
                      {`Your insurance for ${record.plateNumber} (${record.car_brand} ${record.vehicleModel}) expires in ${record.daysLeft} days.`}
                      <span
                        onClick={() => router.push(`/confirm?quoteId=${record.id}`)}
                        className="text-blue-600 font-bold cursor-pointer hover:underline ml-2"
                      >
                        {t("renew_now")}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600 font-medium">
                  There are no reminders for now. All policies are up-to-date.
                </p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-black">
                {t("recent_quotes")}
              </h3>
              {quotations.length > 3 && (
                <Link href="/all-quotes" className="text-blue-600 hover:underline">
                  {t("view_all")}
                </Link> 
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quotations.length > 0 ? (
 quotations.slice(0, 3).map((quote) => {
  const statusColors = {
    pending: "bg-yellow-300 text-black",
    confirmed: "bg-green-500 text-white",
    completed: "bg-green-500 text-white", // Green for completed
  };
// Find the policy created from this quote by checking the 'original_quote_id' field.
const matchingPolicy = carRecords.find(record => record.original_quote_id === quote.id);

// If a matching policy exists and its status is 'completed', use that. Otherwise, use the quote's status.
const currentStatus = (matchingPolicy && matchingPolicy.status === 'completed') 
                      ? 'completed' 
                      : quote.status;


  
  return (
    <div key={quote.id} className="bg-[#BFE4ED] rounded-lg p-6 h-72 flex flex-col justify-between">
      <div>
        {/* Top section: ID and Status */}
        <div className="flex justify-between items-start mb-4">
          <div className="font-bold text-lg">#{quote.quotation_no || quote.id}</div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[currentStatus] || 'bg-gray-400'}`}>
          {currentStatus}
          </span>
        </div>

        {/* Middle section: Vehicle Info */}
        <div className="flex flex-col space-y-1">
          <span className="font-bold text-3xl text-[#162679]">
            {quote.plateNumber}
          </span>
          <span className="self-end font-semibold text-2xl text-[#162679]">
            {quote.price || 'N/A'}
          </span>
          <div className="text-xl text-gray-700">
            <span>{quote.car_brand} {quote.vehicleModel} {quote.manufactured_year}</span>
          </div>
        </div>

        {/* Message for completed quotes */}
        {currentStatus === 'completed' && (
           <p className="text-sm text-gray-800 pt-3">
             You have completed your payment, please check in My Car Records.
           </p>
        )}
      </div>

      {/* Bottom section: Button (or lack thereof) */}
      <div className="h-10"> {/* Fixed height for alignment */}
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
                  {t("No recent quotations found. Your quotation history will appear here. Get a quote now!")}
                </p>
              )}
            </div>
            {selectedQuote && (
              <QuotationDetail quote={selectedQuote} onClose={() => setSelectedQuote(null)} />
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-black mb-4">
              {t("my_car_records")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {carRecords.length > 0 ? (
                carRecords.map((record) => {
                  const submittedAt = record.submittedAt?.toDate();
                  const expiryDate = submittedAt ? new Date(submittedAt.setFullYear(submittedAt.getFullYear() + 1)) : null;
                  const daysLeft = expiryDate ? Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24)) : null;

                  return (
                    <div key={record.id} className="bg-[#BFE4ED] rounded-lg p-6 h-72 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-extrabold text-4xl text-[#162679] p-2">
                              {record.plateNumber}
                            </div>
                          </div>
                          <div className="w-40 h-28 rounded flex items-center justify-center">
                            
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-2xl text-[#162679]">
                            {`${record.car_brand} ${record.vehicleModel} ${record.manufactured_year}`}
                          </div>
                        </div>
                        <div>
                          {daysLeft !== null && daysLeft > 30 && (
                            <div className="text-sm text-gray-600">
                              {t("insurance_active_until")} {expiryDate.toLocaleDateString()}
                            </div>
                          )}
                          {daysLeft !== null && daysLeft <= 30 && daysLeft > 0 && (
                            <div className="text-sm text-red-600 font-medium">
                              {`Insurance expires in ${daysLeft} days`}
                            </div>
                          )}
                          {daysLeft !== null && daysLeft <= 0 && (
                             <div className="text-sm text-red-700 font-bold">
                              Insurance has expired
                            </div>
                          )}
                        </div>
                      </div>
                       {(daysLeft !== null && daysLeft <= 30) ? (
                          <button onClick={() => router.push(`/confirm?quoteId=${record.id}`)} className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800">
                            {t("renew")}
                          </button>
                        ) : (
                          <button onClick={() => setSelectedPolicy(record)} className="w-full bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50">
                            {t("view")}
                          </button>
                        )}
                    </div>
                  );
                })
              ) : (
                <p className="col-span-3 text-center text-gray-500">
                  Your car insurance records will appear here after payment. Get a quote and renew your car insurance now!
                </p>
              )}
              {selectedPolicy && <PolicyDetail policy={selectedPolicy} onClose={() => setSelectedPolicy(null)} t={t} />}
            </div>
          </div>
        </main>

        <footer className="bg-blue-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  {t("about_us")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-200 hover:text-white">
                      {t("faq")}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">
                  {t("useful_links")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-200 hover:text-white">
                      {t("contact_us")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-200 hover:text-white">
                      {t("personal_data_protection")}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">
                  {t("follow_us")}
                </h4>
                <div className="flex space-x-4">
                  {/* Facebook */}
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.128 8.438 9.878v-6.988h-2.54v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 17 22 12z" />
                    </svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.78v2.23h.07c.67-1.27 2.31-2.61 4.76-2.61 5.09 0 6.03 3.34 6.03 7.69V24h-5V15.45c0-2.05-.04-4.69-2.86-4.69-2.86 0-3.3 2.24-3.3 4.55V24h-5V8z" />
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.315.975.975 1.253 2.242 1.315 3.608.058 1.266.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.34 2.633-1.315 3.608-.975.975-2.242 1.253-3.608 1.315-1.266.058-1.645.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.34-3.608-1.315-.975-.975-1.253-2.242-1.315-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.34-2.633 1.315-3.608C4.523 2.503 5.79 2.225 7.156 2.163 8.422 2.105 8.802 2.163 12 2.163zm0 1.838c-3.176 0-3.552.012-4.805.069-1.07.049-1.65.227-2.037.38-.512.2-.877.438-1.265.825-.388.388-.625.754-.825 1.265-.153.387-.331.967-.38 2.037-.057 1.253-.069 1.629-.069 4.805s.012 3.552.069 4.805c.049 1.07.227 1.65.38 2.037.2.512.438.877.825 1.265.388.388.754.625 1.265.825.387.153.967.331 2.037.38 1.253.057 1.629.069 4.805.069s3.552-.012 4.805-.069c1.07-.049 1.65-.227 2.037-.38.512-.2.877-.438 1.265-.825.388-.388.625-.754.825-1.265.153-.387.331-.967.38-2.037.057-1.253.069-1.629.069-4.805s-.012-3.552-.069-4.805c-.049-1.07-.227-1.65-.38-2.037-.2-.512-.438-.877-.825-1.265-.388-.388-.754-.625-1.265-.825-.387-.153-.967-.331-2.037-.38-1.253-.057-1.629-.069-4.805-.069zm0 4.838a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.838a3.162 3.162 0 1 0 0 6.324 3.162 3.162 0 0 0 0-6.324zm6.406-3.845a1.17 1.17 0 1 1-2.34 0 1.17 1.17 0 0 1 2.34 0z" />
                    </svg>
                  </a>
                  {/* TikTok */}
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 6.625 5.373 12 12 12 6.627 0 12-5.375 12-12 0-6.627-5.373-12-12-12zm2.95 17.567c-.958.455-2.047.721-3.214.721-3.222 0-5.828-2.606-5.828-5.828 0-3.222 2.606-5.828 5.828-5.828 1.006 0 1.956.293 2.758.796V5.457h2.5v6.153c-.432-.11-.879-.166-1.338-.166-.963 0-1.887.273-2.66.744v1.38c.777.206 1.49.589 2.095 1.092v2.107z" />
                    </svg>
                  </a>
                  {/* X (Twitter) */}
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4 1.64a9.05 9.05 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.5 0c-2.5 0-4.5 2-4.5 4.5 0 .35.04.7.11 1.03A12.94 12.94 0 0 1 1.64.9a4.51 4.51 0 0 0-.61 2.27c0 1.57.8 2.96 2 3.77A4.47 4.47 0 0 1 .96 6.4v.06c0 2.19 1.56 4.03 3.63 4.44a4.53 4.53 0 0 1-2.03.08 4.52 4.52 0 0 0 4.21 3.13A9.06 9.06 0 0 1 0 19.54 12.76 12.76 0 0 0 6.92 21c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 23 3z" />
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a2.994 2.994 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A2.994 2.994 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 0 0 2.122 2.136c1.872.505 9.377.505 9.377.505s7.505 0 9.377-.505a2.995 2.995 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

