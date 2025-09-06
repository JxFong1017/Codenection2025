import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import DecisionPopup from "../src/components/DecisionPopup";
import { useT } from "../src/utils/i18n";
import Image from "next/image";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showDecisionPopup, setShowDecisionPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    // Remove automatic popup - user must click "Get Quotation" button
  }, [status, router]);

  const handleGetQuotation = () => {
    // Go to decision page first
    router.push("/get-quote");
  };

  const handleDecision = (decision) => {
    setShowDecisionPopup(false);

    if (decision === "manual") {
      // User chose manual input - redirect to form
      router.push("/vehicle-validation-form");
    } else if (decision === "image") {
      // User chose image upload - redirect to form with image mode
      router.push("/vehicle-validation-form?mode=image");
    }
  };

  const handleClosePopup = () => {
    setShowDecisionPopup(false);
    // Redirect to vehicle form anyway
    router.push("/vehicle-validation-form");
  };

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

  if (!session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard - CGS Insurance</title>
        <meta name="description" content="Your car insurance dashboard" />
      </Head>

      {/* Decision Popup */}
      <DecisionPopup
        isOpen={showDecisionPopup}
        onClose={handleClosePopup}
        onDecision={handleDecision}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-900">CGS</h1>
              </div>

              <div className="flex items-center space-x-6">
                {/* Navigation Links */}
                <nav className="hidden md:flex space-x-6">
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-900"
                  >
                    <img
                      src="/images/profile.png"
                      alt="Profile"
                      className="w-5 h-5"
                    />
                    <span>Profile</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-900"
                  >
                    <img
                      src="/images/get-quotation.png"
                      alt="Get Quotation"
                      className="w-5 h-5"
                    />
                    <span>Get Quotation</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-900"
                  >
                    <img
                      src="/images/notification.png" // replace with your image path
                      alt="Notifications"
                      className="w-5 h-5"
                    />
                    <span>Notifications</span>
                  </a>
                </nav>

                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <div className="bg-black text-white px-4 py-2 rounded text-sm font-medium">
                    {session.user.email?.toUpperCase() || "USER@GMAIL.COM"}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">EN</span>
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-[#162679] pt-12 pb-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            {/* Left Side (Text) */}
            <div className="text-left">
              <h2 className="text-4xl font-bold text-[#F9F871] mb-4">
                {useT()("get_quote_instantly")}
              </h2>
              <p className="text-xl text-white mb-6">
                {useT()("find_best_coverage")}
              </p>
              <button
                onClick={handleGetQuotation}
                className="bg-white text-[#162679] px-8 py-3 rounded-lg font-bold hover:bg-blue-200 transition-colors"
              >
                {useT()("get_quote")}
              </button>
            </div>

            {/* Right Side (Car Image) */}
            <div className="flex justify-center md:justify-end relative">
              <Image
                src="/images/car-picture-3.png"
                alt="Car Hero"
                width={400}
                height={200}
                className="object-contain -mt-8 md:-mt-12"
              />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-yellow-100 rounded-full opacity-20 -z-10"></div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Reminder Section */}
          <div className="bg-white rounded-lg border-2 border-black p-6 mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <Image
                  src="/images/reminder.png"
                  alt="Reminder Icon"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              <h3 className="text-xl font-bold text-black">
                {useT()("reminder")}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="text-[#162679] font-bold">•</span>
                <p className="text-[#162679] font-bold">
                  {useT()("reminder_1_text")}
                  <span className="text-[#162679] font-bold">
                    {" "}
                    {useT()("renew_now")}
                  </span>
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-[#162679] font-bold">•</span>
                <p className="text-[#162679] font-bold">
                  {useT()("reminder_2_text")}
                  <span className="text-[#162679] font-bold">
                    {" "}
                    {useT()("pay_before_due")}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Recent Quotes Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-black mb-4">
              {useT()("recent_quotes")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left Quote Card */}
              <div className="bg-[#BFE4ED] rounded-lg p-6 h-72">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-bold text-lg">#12346</div>
                  </div>
                  <span className="bg-[#F9F871] text-black px-3 py-1 rounded-full text-sm font-medium">
                    {useT()("pending")}
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-bold text-3xl text-[#162679]">
                    PJH 9196
                  </span>
                  <span className="self-end font-semibold text-2xl text-[#162679]">
                    RM980
                  </span>
                  <span className="font-semibold text-2xl text-[#162679]">
                    Toyota Vios 2020
                  </span>
                </div>
                <button className="w-full mt-4 bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50">
                  {useT()("view")}
                </button>
              </div>

              {/* Right Quote Card */}
              <div className="bg-[#BFE4ED] rounded-lg p-6 h-72">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm text-gray-600"></div>
                    <div className="font-bold text-lg">#12345</div>
                  </div>
                  <span className="bg-[#00C898] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {useT()("confirmed")}
                  </span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-bold text-3xl text-[#162679]">
                    ABC 1234
                  </span>
                  <span className="self-end font-semibold text-2xl text-[#162679]">
                    RM1200
                  </span>
                  <span className="font-semibold text-2xl text-[#162679]">
                    Perodua Myvi 2025
                  </span>
                </div>
                <button className="w-full mt-4 bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50">
                  {useT()("view")}
                </button>
              </div>
            </div>
          </div>

          {/* My Car Records Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-black mb-4">
              {useT()("my_car_records")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left Car Record */}
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
                      {useT()("insurance_expired_days")}
                    </div>
                  </div>
                  <button className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800">
                    {useT()("renew")}
                  </button>
                </div>
              </div>

              {/* Middle Car Record */}
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
                      {useT()("insurance_active_until")} 12/08/2026
                    </div>
                  </div>
                  <button className="w-full bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50">
                    {useT()("view")}
                  </button>
                </div>
              </div>

              {/* Right Car Record */}
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
                      {useT()("insurance_active_until")} 02/01/2026
                    </div>
                  </div>
                  <button className="w-full bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50">
                    {useT()("view")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-blue-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - About Us */}
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  {useT()("about_us")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-200 hover:text-white">
                      {useT()("faq")}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Center Column - Useful Links */}
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  {useT()("useful_links")}
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-200 hover:text-white">
                      {useT()("contact_us")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-200 hover:text-white">
                      {useT()("personal_data_protection")}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Right Column - Social Media */}
              <div>
                <h4 className="text-lg font-semibold mb-4">
                  {useT()("follow_us")}
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
