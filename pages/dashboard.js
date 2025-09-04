import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import DecisionPopup from '../src/components/DecisionPopup';
import { useT } from '../src/utils/i18n';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showDecisionPopup, setShowDecisionPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    // Remove automatic popup - user must click "Get Quotation" button
  }, [status, router]);

  const handleGetQuotation = () => {
    // Go to decision page first
    router.push('/get-quote');
  };

  const handleDecision = (decision) => {
    setShowDecisionPopup(false);
    
    if (decision === 'manual') {
      // User chose manual input - redirect to form
      router.push('/vehicle-validation-form');
    } else if (decision === 'image') {
      // User chose image upload - redirect to form with image mode
      router.push('/vehicle-validation-form?mode=image');
    }
  };

  const handleClosePopup = () => {
    setShowDecisionPopup(false);
    // Redirect to vehicle form anyway
    router.push('/vehicle-validation-form');
  };

  if (status === 'loading') {
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
                  <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>Get Quotation</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-blue-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
                    </svg>
                    <span>Notifications</span>
                  </a>
                </nav>

                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <div className="bg-black text-white px-4 py-2 rounded text-sm font-medium">
                    {session.user.email?.toUpperCase() || 'USER@GMAIL.COM'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">EN</span>
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-blue-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">
              {useT()('get_quote_instantly')}
            </h2>
            <p className="text-xl text-white mb-8">
              {useT()('find_best_coverage')}
            </p>
            <button 
              onClick={handleGetQuotation}
              className="bg-blue-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
            >
              {useT()('get_quote')}
            </button>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Reminder Section */}
          <div className="bg-white rounded-lg border-2 border-black p-6 mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black">{useT()('reminder')}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="text-black">•</span>
                <p className="text-gray-700">
                  {useT()('reminder_1_text')} 
                  <span className="text-blue-600 font-medium"> {useT()('renew_now')}</span>
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-black">•</span>
                <p className="text-gray-700">
                  {useT()('reminder_2_text')} 
                  <span className="text-blue-600 font-medium"> {useT()('pay_before_due')}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Recent Quotes Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-black mb-4">{useT()('recent_quotes')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
              {/* Left Quote Card */}
              <div className="bg-blue-100 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm text-gray-600">{useT()('quote_id')}</div>
                    <div className="font-bold text-lg">#12346</div>
                  </div>
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                    {useT()('pending')}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{useT()('car_plate')}:</span>
                    <span className="font-semibold">PJH 9196</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{useT()('amount')}:</span>
                    <span className="font-semibold">RM980</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{useT()('car_model')}:</span>
                    <span className="font-semibold">Toyota Vios 2020</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50">
                  {useT()('view')}
                </button>
              </div>

              {/* Right Quote Card */}
              <div className="bg-blue-100 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm text-gray-600">{useT()('quote_id')}</div>
                    <div className="font-bold text-lg">#12345</div>
                  </div>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {useT()('confirmed')}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{useT()('car_plate')}:</span>
                    <span className="font-semibold">ABC 1234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{useT()('amount')}:</span>
                    <span className="font-semibold">RM1200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{useT()('car_model')}:</span>
                    <span className="font-semibold">Perodua Myvi 2025</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50">
                  {useT()('view')}
                </button>
              </div>

              {/* Robot Character */}
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* My Car Records Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-black mb-4">{useT()('my_car_records')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left Car Record */}
              <div className="bg-blue-100 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-600">{useT()('car_plate')}</div>
                      <div className="font-bold text-lg">PJH 9196</div>
                    </div>
                    <div className="w-16 h-12 bg-red-200 rounded flex items-center justify-center">
                      <div className="w-12 h-8 bg-red-500 rounded-sm"></div>
                    </div>
                  </div>
                  <div>
                                          <div className="text-sm text-gray-600">{useT()('car_model')}</div>
                    <div className="font-semibold">Toyota Vios 2020</div>
                  </div>
                  <div>
                    <div className="text-sm text-red-600 font-medium">{useT()('insurance_expired_days')}</div>
                  </div>
                  <button className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800">
                    {useT()('renew')}
                  </button>
                </div>
              </div>

              {/* Middle Car Record */}
              <div className="bg-blue-100 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-600">{useT()('car_plate')}</div>
                      <div className="font-bold text-lg">ABC 1234</div>
                    </div>
                    <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <div className="w-12 h-8 bg-gray-600 rounded-sm"></div>
                    </div>
                  </div>
                  <div>
                                          <div className="text-sm text-gray-600">{useT()('car_model')}</div>
                    <div className="font-semibold">Perodua Myvi 2025</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">{useT()('insurance_active_until')} 12/08/2026</div>
                  </div>
                  <button className="w-full bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50">
                    {useT()('view')}
                  </button>
                </div>
              </div>

              {/* Right Car Record */}
              <div className="bg-blue-100 rounded-lg p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-600">{useT()('car_plate')}</div>
                      <div className="font-bold text-lg">PKD 3581</div>
                    </div>
                    <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <div className="w-12 h-8 bg-white rounded-sm border"></div>
                    </div>
                  </div>
                  <div>
                                          <div className="text-sm text-gray-600">{useT()('car_model')}</div>
                    <div className="font-semibold">Honda City 2018</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">{useT()('insurance_active_until')} 02/01/2026</div>
                  </div>
                  <button className="w-full bg-white text-blue-900 border border-blue-200 py-2 rounded-lg font-medium hover:bg-blue-50">
                    {useT()('view')}
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
              <div>
                <h4 className="text-lg font-semibold mb-4">{useT()('about_us')}</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-blue-200 hover:text-white">{useT()('faq')}</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">{useT()('useful_links')}</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-blue-200 hover:text-white">{useT()('contact_us')}</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white">{useT()('personal_data_protection')}</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">{useT()('follow_us')}</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-blue-200 hover:text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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