import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
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

export default function Dashboard() {
  const t = useT();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showDecisionPopup, setShowDecisionPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const handleLogout = () => {
    setShowLogoutPopup(false);
    signOut({ callbackUrl: "/" });
  };
  
  useEffect(() => {
    const fetchQuotations = async () => {
      if (status === "authenticated" && session?.user?.email) {
        const q = query(
          collection(db, "quotations"),
          where("userId", "==", session.user.email),
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
                <nav className="hidden md:flex space-x-6">
                  <Link href="/profile" className="flex items-center space-x-2 text-gray-600 hover:text-blue-900">
                    <Image
                      src="/images/profile.png"
                      alt="Profile"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span>{t("profile")}</span>
                  </Link>
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-900"
                  >
                    <Image
                      src="/images/get-quotation.png"
                      alt="Get Quotation"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span>{t("get_quotation")}</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-900"
                  >
                    <Image
                      src="/images/notification.png"
                      alt="Notifications"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                    <span>{t("notifications")}</span>
                  </a>
                </nav>

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
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="text-[#162679] font-bold">•</span>
                <p className="text-[#162679] font-bold">
                  {t("reminder_1_text")}
                  <span className="text-[#162679] font-bold">
                    {" "}
                    {t("renew_now")}
                  </span>
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-[#162679] font-bold">•</span>
                <p className="text-[#162679] font-bold">
                  {t("reminder_2_text")}
                  <span className="text-[#162679] font-bold">
                    {" "}
                    {t("pay_before_due")}
                  </span>
                </p>
              </div>
            </div>
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
                quotations.slice(0, 3).map((quote) => (
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
              <div className="bg-[#BFE4ED] rounded-lg p-6 h-72">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-extrabold text-4xl text-[#162679] p-2">
                        PJH 9196
                      </div>
                    </div>
                    <div className="w-40 h-28 rounded flex items-center justify-center">
                      <Image
                        src="/images/red-car.png"
                        alt="Red Car"
                        width={192}
                        height={128}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-2xl text-[#162679]">
                      Toyota Vios 2020
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-red-600 font-medium">
                      {t("insurance_expired_days")}
                    </div>
                  </div>
                  <button className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800">
                    {t("renew")}
                  </button>
                </div>
              </div>
              <div className="bg-[#BFE4ED] rounded-lg p-6 h-72">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-extrabold text-4xl text-[#162679] p-2">
                        ABC 1234
                      </div>
                    </div>
                    <div className="w-40 h-28 rounded flex items-center justify-center">
                      <Image
                        src="/images/black-car.png"
                        alt="Black Car"
                        width={192}
                        height={128}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-2xl text-[#162679]">
                      Perodua Myvi 2025
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">
                      {t("insurance_active_until")} 12/08/2026
                    </div>
                  </div>
                  <button className="w-full bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50">
                    {t("view")}
                  </button>
                </div>
              </div>
              <div className="bg-[#BFE4ED] rounded-lg p-6 h-72">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-extrabold text-4xl text-[#162679] p-2">
                        PKD 3581
                      </div>
                    </div>
                    <div className="w-40 h-28 rounded flex items-center justify-center">
                      <Image
                        src="/images/white-car.png"
                        alt="Red Car"
                        width={192}
                        height={128}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-2xl text-[#162679]">
                      Honda City 2018
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">
                      {t("insurance_active_until")} 02/01/2026
                    </div>
                  </div>
                  <button className="w-full bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50">
                    {t("view")}
                  </button>
                </div>
              </div>
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
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.128 8.438 9.878v-6.988h-2.54v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 17 22 12z" />
                    </svg>
                  </a>
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.78v2.23h.07c.67-1.27 2.31-2.61 4.76-2.61 5.09 0 6.03 3.34 6.03 7.69V24h-5V15.45c0-2.05-.04-4.69-2.86-4.69-2.86 0-3.3 2.24-3.3 4.55V24h-5V8z" />
                    </svg>
                  </a>
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.315.975.975 1.253 2.242 1.315 3.608.058 1.266.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.34 2.633-1.315 3.608-.975.975-2.242 1.253-3.608 1.315-1.266.058-1.645.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.34-3.608-1.315-.975-.975-1.253-2.242-1.315-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.34-2.633 1.315-3.608.975-.975 2.242-1.253 3.608-1.315C8.416 2.175 8.796 2.163 12 2.163zm1.407 1.488c-3.193 0-3.593.01-4.81.065-1.173.055-1.805.28-2.264.739-.46.46-.684 1.092-.739 2.264-.055 1.217-.065 1.617-.065 4.81s.01 3.593.065 4.81c.055 1.173.28 1.805.739 2.264.46.46 1.092.684 2.264.739 1.217.055 1.617.065 4.81.065s3.593-.01 4.81-.065c1.173-.055 1.805-.28 2.264-.739.46-.46.684-1.092.739-2.264.055-1.217.065-1.617.065-4.81s-.01-3.593-.065-4.81c-.055-1.173-.28-1.805-.739-2.264-.46-.46-1.092-.684-2.264-.739-1.217-.055-1.617-.065-4.81-.065zm-.214 2.238c3.193 0 3.593.01 4.81.065 1.173.055 1.805.28 2.264.739.46.46.684 1.092.739 2.264.055 1.217.065 1.617.065 4.81s-.01 3.593-.065 4.81c-.055 1.173-.28 1.805-.739 2.264-.46.46-1.092.684-2.264.739-1.217.055-1.617.065-4.81.065s-3.593-.01-4.81-.065c-1.173-.055-1.805-.28-2.264-.739-.46-.46-.684-1.092-.739-2.264-.055-1.217-.065-1.617-.065-4.81s.01-3.593.065-4.81c.055-1.173.28-1.805.739-2.264.46-.46 1.092-.684 2.264-.739 1.217-.055 1.617-.065 4.81-.065zM12 7c-2.761 0-5 2.239-5 5s2.239 5 5 5 5-2.239 5-5-2.239-5-5-5zm0 8c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
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

