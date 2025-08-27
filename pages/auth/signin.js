import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function SignIn() {
  const router = useRouter();
  const [isGoogleConfigured, setIsGoogleConfigured] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push('/vehicle-validation-form');
      }
    });

    // Check if Google OAuth is configured
    checkGoogleConfiguration();
  }, [router]);

  const checkGoogleConfiguration = async () => {
    try {
      const response = await fetch('/api/auth/providers');
      const providers = await response.json();
      setIsGoogleConfigured(providers.google !== undefined);
    } catch (error) {
      console.error('Error checking providers:', error);
      setIsGoogleConfigured(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isGoogleConfigured) {
      alert('Google OAuth is not configured. Please check the setup instructions.');
      return;
    }

    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/vehicle-validation-form' });
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    // Create a mock session for demo purposes
    const mockSession = {
      user: {
        name: 'Demo User',
        email: 'demo@example.com',
        image: 'https://via.placeholder.com/150/3B82F6/FFFFFF?text=D'
      }
    };
    
    // Store mock session in localStorage for demo
    localStorage.setItem('demoSession', JSON.stringify(mockSession));
    
    // Redirect to vehicle validation form
    router.push('/vehicle-validation-form');
  };

  return (
    <>
      <Head>
        <title>Sign In - Smart Vehicle Validation</title>
        <meta name="description" content="Sign in to access the Smart Vehicle Data Validation system" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome to Smart Vehicle Validation
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access the Malaysian vehicle data validation system
            </p>
          </div>
          
          <div className="mt-8 space-y-6">
            {!isGoogleConfigured ? (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Setup Required</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Google OAuth is not configured. To enable sign-in:</p>
                        <ol className="mt-2 list-decimal list-inside space-y-1">
                          <li>Create a Google Cloud Project</li>
                          <li>Enable Google+ API</li>
                          <li>Create OAuth 2.0 credentials</li>
                          <li>Add credentials to .env.local file</li>
                        </ol>
                        <p className="mt-2">
                          <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="font-medium underline">
                            Go to Google Cloud Console
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Demo Mode Button */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Try Demo Mode</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Experience the vehicle validation system without setting up Google OAuth
                  </p>
                  <button
                    onClick={handleDemoMode}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    🚗 Try Demo Mode
                  </button>
                </div>
              </>
            ) : (
              <div>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </button>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our terms of service and privacy policy
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Features</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time plate number validation
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Smart typo correction
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Malaysian vehicle database
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced validation rules
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
