"use client";
import { useRouter } from "next/router";

export default function DecisionPopup({ isOpen, onClose, onDecision }) {
  const router = useRouter();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="text-center">
          {/* Header */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Welcome! How would you like to proceed?
          </h3>
          
          <p className="text-gray-600 mb-6">
            Choose your preferred method to fill out the vehicle validation form.
          </p>

          {/* Decision Buttons */}
          <div className="space-y-3">
            {/* Manual Input Option */}
            <button
              onClick={() => {
                onDecision("manual");
              }}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Manual Input</div>
                  <div className="text-sm text-gray-500">Type in vehicle details manually</div>
                </div>
              </div>
            </button>

            {/* Image Upload Option */}
            <button
              onClick={() => {
                onDecision("geran");
              }}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-medium">Upload Geran Image</div>
                  <div className="text-sm text-blue-100">AI will automatically fill the form</div>
                </div>
              </div>
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium">What is a Geran?</p>
                <p className="mt-1">A Geran is the Malaysian vehicle registration document that contains all vehicle details including plate number, make, model, year, and engine specifications.</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            I'll decide later
          </button>
        
        </div>
      </div>
    </div>
  );
}