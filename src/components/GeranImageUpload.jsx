import { useState, useRef } from 'react';

export default function GeranImageUpload({ onFormDataExtracted, onClose }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractionResult, setExtractionResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setExtractionResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!imagePreview) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate API call to process Geran image
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate extracted data from Geran
      const extractedData = {
        state: 'selangor',
        plateNumber: 'BKV 9429',
        make: 'Proton',
        model: 'Saga',
        year: '2020',
        engineCC: '1332',
        color: 'White',
        vin: 'PROTON12345678901',
        mileage: '45000',
        registrationDate: '2020-03-15',
        insuranceType: 'comprehensive',
        confidence: 0.95
      };

      setExtractionResult(extractedData);
      setUploadProgress(100);
      
      // Auto-fill form after a short delay
      setTimeout(() => {
        onFormDataExtracted(extractedData);
      }, 1500);

    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
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
      fileInputRef.current.value = '';
    }
  };

  const handleManualInput = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upload Geran Image</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!imagePreview ? (
            /* Upload Section */
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-4">
                <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload Your Vehicle Geran
              </h3>
              
              <p className="text-gray-600 mb-6">
                Take a clear photo of your vehicle registration document (Geran) and our AI will automatically extract all the details.
              </p>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Choose Image
                </button>
                <p className="mt-3 text-sm text-gray-500">
                  Supported formats: JPEG, PNG, WebP (Max 10MB)
                </p>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-4 text-left">
                <h4 className="font-medium text-blue-900 mb-2">📸 Tips for best results:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ensure good lighting and clear focus</li>
                  <li>• Capture the entire document in frame</li>
                  <li>• Avoid shadows and glare</li>
                  <li>• Make sure text is readable</li>
                </ul>
              </div>
            </div>
          ) : !extractionResult ? (
            /* Processing Section */
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mb-4">
                <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              {/* Image Preview */}
              <div className="mb-6">
                <img
                  src={imagePreview}
                  alt="Geran Preview"
                  className="w-full max-w-md mx-auto rounded-lg border border-gray-300"
                />
              </div>

              {/* Upload Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Choose Different Image
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Processing...' : 'Process Image'}
                </button>
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-lg font-medium text-green-900 mb-2">
                Successfully Extracted Vehicle Details!
              </h3>
              
              <p className="text-gray-600 mb-4">
                Confidence Score: {(extractionResult.confidence * 100).toFixed(1)}%
              </p>

              {/* Extracted Data Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium text-gray-900 mb-3">Extracted Information:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-600">Plate:</span> <span className="font-medium">{extractionResult.plateNumber}</span></div>
                  <div><span className="text-gray-600">Make:</span> <span className="font-medium">{extractionResult.make}</span></div>
                  <div><span className="text-gray-600">Model:</span> <span className="font-medium">{extractionResult.model}</span></div>
                  <div><span className="text-gray-600">Year:</span> <span className="font-medium">{extractionResult.year}</span></div>
                  <div><span className="text-gray-600">Engine:</span> <span className="font-medium">{extractionResult.engineCC}cc</span></div>
                  <div><span className="text-gray-600">Color:</span> <span className="font-medium">{extractionResult.color}</span></div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-6">
                ✅ Form will be automatically filled with these details
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Upload Different Image
                </button>
                <button
                  onClick={handleManualInput}
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
  );
}

