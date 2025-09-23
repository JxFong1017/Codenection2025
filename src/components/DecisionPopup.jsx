"use client";

export default function DecisionPopup({ isOpen, onClose, onDecision }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Choose Quote Method</h2>
        <div className="space-y-3">
          <button
            onClick={() => {
              onDecision("manual");
            }}
            className="w-full px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Fill Form Manually
          </button>
          <button
            onClick={() => {
              onDecision("geran");
            }}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upload Geran Image
          </button>
        </div>
      </div>
    </div>
  );
}