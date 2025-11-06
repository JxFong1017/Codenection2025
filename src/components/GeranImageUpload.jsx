"use client";
import { useState, useRef, useEffect } from "react";
// Re--enabling mocks for standalone environment
// import NextImage from "next/image";
// import { useRouter } from "next/router";

// Mock NextImage as it's not a standard HTML element
const NextImage = ({ src, alt, className, width, height }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} className={className} style={{ width, height }} />
);

// Mock useRouter as it's a Next.js specific hook
const useRouter = () => {
  return {
    push: (path) => {
      console.log(`Mock navigation to: ${path}`);
      // In a real Next.js app, this would navigate.
    },
  };
};


// Mock Modal for standalone functionality
const MockModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
        <h3 className="text-lg font-bold mb-4">Notification</h3>
        <p className="mb-6">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

function GeranImageUpload({ onFormDataExtracted, onClose }) {
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractionResult, setExtractionResult] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);

  const fileInputRef = useRef(null);

  // useEffect to automatically trigger file input on mount
  // This is a common pattern for "upload modal" components
  /*
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);
  */ // REMOVED: This was causing the double file prompt.

  const showAlert = (message) => {
    setModalMessage(message);
  };

  // This is mocked for the component to run, but the 'X' button
  // will now use handleClose() instead.
  const router = useRouter();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic file type check
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          showAlert("Unsupported file type. Please upload a JPEG, PNG, or WebP image.");
          return;
      }
      
      // Basic file size check (e.g., 10MB)
      if (file.size > 10 * 1024 * 1024) {
          showAlert("File is too large. Please upload an image under 10MB.");
          return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // If user cancels file picker, close the modal.
      handleClose();
    }
  };

  const handleClose = () => {
    setImagePreview(null);
    setExtractionResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset file input
    }
    onClose(); // tell parent to close modal
  };

  const handleReupload = () => {
    setImagePreview(null);
    setExtractionResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!imagePreview) return;

    setIsUploading(true);
    setUploadProgress(0);

    const base64Data = imagePreview.split(",")[1];
    
    // REVERTED: Using your original environment variable logic
    // This is correct for your Next.js project.
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 
    
    // CORRECTED: This is the correct model endpoint
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => (prev >= 90 ? 90 : prev + 10));
    }, 200);

    try {
      // RE-ADDED: This check is important for your real application
      if (!apiKey) {
        throw new Error("Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.");
      }
      
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `Act as an expert OCR system for a Malaysian vehicle registration document (Geran). Your task is to extract specific vehicle details. The document is often referred to as 'Sijil Pemilikan Kenderaan'. Extract the following information by locating the corresponding labels and their values in the provided image. Return the data in a valid JSON format, enclosed in a \`\`\`json ... \`\`\` block. Ensure the extracted values are clean and accurately formatted. If a field cannot be found, return null. The expected keys are: 'plateNumber' for 'No. Pendaftaran', 'ownerName' for 'Nama Pemunya Berdaftar', 'address' for 'Alamat', 'chassisNo' for 'No. Chasis', 'engineNo' for 'No. Enjin', 'makeAndModel' for 'Buatan/Nama Model', 'engineCC' for 'Keupayaan Enjin', 'fuelType' for 'Bahan Bakar', 'registrationDate' for 'Tarikh Pendaftaran'. Be as accurate as possible and handle variations in the document's layout.`,
              },
              {
                inlineData: {
                  // Dynamically get mimeType from preview string
                  mimeType: imagePreview.substring(5, imagePreview.indexOf(';')),
                  data: base64Data,
                },
              },
            ],
          },
        ],
      };

      let response;
      let retries = 0;
      const maxRetries = 5;
      while (retries < maxRetries) {
        try {
          response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            break;
          } else {
            // This was the line (121) throwing the error in the user's original stack trace
            throw new Error(`API error: ${response.status}`);
          }
        } catch (error) {
          console.warn(`API call failed (attempt ${retries + 1}):`, error.message);
          retries++;
          if (retries < maxRetries) {
            const delay = Math.pow(2, retries) * 1000;
            await new Promise((res) => setTimeout(res, delay));
          } else {
            throw new Error(`Failed API call after ${maxRetries} attempts: ${error.message}`);
          }
        }
      }

      if (!response || !response.ok) {
         if (response && response.status === 429) {
          throw new Error(
            "API rate limit exceeded. Please wait a moment before trying again."
          );
        }
        throw new Error(
          `Failed to fetch response from API. Status: ${response ? response.status : 'unknown'}`
        );
      }

      const result = await response.json();
      
      const candidate = result.candidates?.[0];
      if (!candidate) {
        throw new Error("No valid response candidate found from API.");
      }

      // Check for safety ratings block
      if (candidate.finishReason && candidate.finishReason !== "STOP") {
        if (candidate.safetyRatings) {
            const blockedCategory = candidate.safetyRatings.find(r => r.blocked)?.category;
            if (blockedCategory) {
                throw new Error(`Request was blocked for ${blockedCategory}. Please try a different image.`);
            }
        }
        throw new Error(`API call finished unsuccessfully: ${candidate.finishReason}`);
      }
      
      const extractedText = candidate.content?.parts?.[0]?.text || "{}";
      const jsonMatch = extractedText.match(/```json\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : extractedText;
      
      let extractedData;
      try {
        extractedData = JSON.parse(jsonText);
      } catch (e) {
        console.error("Failed to parse JSON from model response:", jsonText);
        throw new Error("Could not read the vehicle details. Please try a clearer image.");
      }

      console.log("Parsed extractedData:", extractedData);

      let make = "";
      let model = "";
      const makeAndModelString = extractedData.makeAndModel?.trim() || "";
      
      if (makeAndModelString.includes("/")) {
          const parts = makeAndModelString.split("/");
          make = parts[0] ? parts[0].trim() : "";
          model = parts[1] ? parts[1].trim() : "";
      } else {
          const words = makeAndModelString.split(/\s+/);
          make = words[0] || "";
          model = words.slice(1).join(" ");
      }

      const plateNumber = extractedData.plateNumber ? extractedData.plateNumber.trim() : "";

      let year = "";
      if (extractedData.registrationDate) {
        const dateStr = extractedData.registrationDate.replace(/\s/g, "").trim();
      
        // Try 4-digit year first
        let match = dateStr.match(/\b(19|20)\d{2}\b/);
        if (match) {
          year = match[0];
        } else {
          // fallback for 2-digit year (e.g., from 'DD/MM/YY')
          match = dateStr.match(/(\d{2})$/);
          if (match) {
            const val = parseInt(match[0], 10);
            // Assuming 50 is the cutoff (e.g., 51-99 is 19xx, 00-50 is 20xx)
            year = val > 50 ? `19${match[0]}` : `20${match[0]}`;
          }
        }
      }

      const mappedData = {
        plateNumber,
        make: make.trim(),
        model: model.trim(),
        year,
        engineCC: extractedData.engineCC || "",
      };

      
      setExtractionResult(mappedData);
      setUploadProgress(100);
    
    } catch (error) {
      console.error("Error processing image:", error);
      
      const errorMessage = error.message || "";

      // Updated to catch more specific API error codes
      if (errorMessage.includes("400")) {
        showAlert("API Error 400 (Bad Request). The request was malformed. This might be due to a corrupted image or invalid data.");
      } else if (errorMessage.includes("403")) {
        showAlert("API Error 403 (Forbidden). Please check your Google Cloud project to ensure the Generative Language API is enabled and your API key has the correct permissions.");
      } else if (errorMessage.includes("429")) {
        showAlert("API Error 429 (Too Many Requests). Please wait a minute and try again.");
      } else if (errorMessage.includes("500")) {
         showAlert("API Error 500 (Internal Server Error). The server encountered an error. Please try again later.");
      } else {
        showAlert(errorMessage || "Error processing image. Please try again.");
      }
      setUploadProgress(0); // Reset progress on error
    } finally {
      setIsUploading(false);
      clearInterval(progressInterval);
    }
  };

  const handleRetry = () => {
    setImagePreview(null);
    setExtractionResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleContinueToForm = () => {
    if (extractionResult) {
      const processedModel = extractionResult.model
        ? extractionResult.model.replace(/\s*\(auto\)\s*/i, "").trim()
        : "";

        const processedData = {
          ...extractionResult,
          model: processedModel,
          plateNumber: extractionResult.plateNumber || "",
          year: extractionResult.year || "",
        };
      console.log("Sending to parent:", processedData);
      onFormDataExtracted(processedData);
      handleClose(); // Close modal after continuing
      }
  };
  

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Upload Geran Image
              </h2>
              <button
                type="button"
                // Updated onClick to use handleClose for better component encapsulation
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {!imagePreview ? (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-4">
                <svg
  className="h-10 w-10 text-blue-600"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a4 4 0 014 4v5a4 4 0 01-4 4H7z"
  />
</svg>

                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Your Vehicle Geran
                </h3>
                <p className="text-gray-600 mb-6">
                  Take a clear photo of your vehicle registration document
                  (Geran) and our AI will automatically extract all the details.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Choose Image
                  </button>
                  <p className="mt-3 text-sm text-gray-500">
                    Supported formats: JPEG, PNG, WebP (Max 10MB)
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 text-left">
                  <h4 className="font-medium text-blue-900 mb-2">
                    📸 Tips for best results:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ensure good lighting and clear focus</li>
                    <li>• Capture the entire document in frame</li>
                    <li>• Avoid shadows and glare</li>
                    <li>• Make sure text is readable</li>
                  </ul>
                </div>
              </div>
            ) : !extractionResult ? (
              <div className="text-center">
                {!isUploading ? (
                   <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-4">
                    <svg
                      className="h-10 w-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                ) : (
                   <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-4 animate-pulse">
                     <svg
                      className="h-10 w-10 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}


                <div className="mb-6">
                  <NextImage
                    src={imagePreview}
                    alt="Geran Preview"
                    className="w-full max-w-md mx-auto rounded-lg border border-gray-300"
                    width={500} // Added explicit width/height for layout
                    height={300}
                  />
                </div>

                {isUploading && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Processing...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 justify-center">
                  <button
                    type="button"
                    onClick={handleReupload}
                    disabled={isUploading}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                  >
                    Choose Different Image
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "Processing..." : "Process Image"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-medium text-green-900 mb-2">
                  Successfully Extracted Vehicle Details!
                </h3>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Extracted Information:
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Plate:</span>{" "}
                      <span className="font-medium">
                        {extractionResult.plateNumber || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Make:</span>{" "}
                      <span className="font-medium">
                        {extractionResult.make || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Model:</span>{" "}
                      <span className="font-medium">
                        {extractionResult.model || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Year:</span>{" "}
                      <span className="font-medium">
                        {extractionResult.year || "N/A"}
                      </span>
                    </div>
<div>
<span className="text-gray-600">Engine:</span>{" "}
<span className="font-medium">
{extractionResult.engineCC ? `${extractionResult.engineCC}cc` : "N/A"}
</span>
</div>
</div>
</div>

                <div className="text-sm text-gray-600 mb-6">
                  ✅ Form will be automatically filled with these details
                </div>

                <div className="flex space-x-3 justify-center">
                  <button
                    type="button"
                    onClick={handleReupload}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    Upload Different Image
                  </button>
                  <button
                    type="button"
                    onClick={handleContinueToForm}
                    disabled={!extractionResult} 
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Continue to Form
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {modalMessage && (
        <MockModal
          message={modalMessage}
          onClose={() => setModalMessage(null)}
        />
      )}
    </>
  );
}
export default GeranImageUpload;