// pages/confirm.js
import { useRouter } from "next/router";

export default function ConfirmPage() {
  const router = useRouter();
  const { plateNumber } = router.query; // get the plate number from query params

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Are you sure your car plate number is{" "}
          <span className="text-blue-600">{plateNumber || "..."}</span>?
        </h2>

        <div className="flex justify-between mt-6">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Back to Edit
          </button>

          {/* Next button */}
          <button
            onClick={() => router.push("/next-page")} // replace with your next page
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
