import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import GeranImageUpload from '../src/components/GeranImageUpload';
import DecisionPopup from '../src/components/DecisionPopup';

export default function VehicleValidationForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  // Demo session state
  const [demoSession, setDemoSession] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Geran image upload state
  const [showGeranUpload, setShowGeranUpload] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [showDecisionPopup, setShowDecisionPopup] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    state: '',
    plateNumber: '',
    make: '',
    model: '',
    year: '',
    engineCC: '',
    color: '',
    vin: '',
    mileage: '',
    registrationDate: '',
    insuranceType: 'comprehensive'
  });

  // Validation states
  const [validationStates, setValidationStates] = useState({
    plateNumber: { isValid: false, message: '', suggestion: null, confidence: 0 },
    make: { isValid: false, message: '' },
    model: { isValid: false, message: '' },
    year: { isValid: false, message: '' },
    engineCC: { isValid: false, message: '' },
    vin: { isValid: false, message: '' }
  });

  // UI states
  const [activeTab, setActiveTab] = useState('vehicle');
  const [showVehiclePreview, setShowVehiclePreview] = useState(false);
  const [vehiclePreviewData, setVehiclePreviewData] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [premiumEstimate, setPremiumEstimate] = useState(null);
  const [validationLog, setValidationLog] = useState([]);
  const [confidenceScore, setConfidenceScore] = useState(0);

  // Available options
  const [availableMakes, setAvailableMakes] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    // Check for demo session first
    const storedDemoSession = localStorage.getItem('demoSession');
    if (storedDemoSession) {
      const parsedSession = JSON.parse(storedDemoSession);
      setDemoSession(parsedSession);
      setIsDemoMode(true);
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    // Check if we're in image mode from URL query
    if (router.query.mode === 'image') {
      setIsImageMode(true);
      setShowGeranUpload(true);
    } else {
      // Show decision popup when user arrives from dashboard (no mode specified)
      setShowDecisionPopup(true);
    }
  }, [status, router, router.query.mode]);

  useEffect(() => {
    // Initialize makes
    setAvailableMakes(['Proton', 'Honda', 'Toyota', 'Perodua', 'Nissan', 'Mazda', 'BMW', 'Mercedes-Benz']);
  }, []);

  useEffect(() => {
    // Update models when make changes
    if (formData.make) {
      const models = {
        'Proton': ['Saga', 'Persona', 'X70', 'X50', 'Iriz'],
        'Honda': ['Civic', 'City', 'CR-V', 'HR-V', 'Accord'],
        'Toyota': ['Vios', 'Camry', 'Corolla', 'Hilux', 'Fortuner'],
        'Perodua': ['Myvi', 'Axia', 'Bezza', 'Alza', 'Ativa'],
        'Nissan': ['Almera', 'X-Trail', 'Teana', 'Serena'],
        'Mazda': ['CX-5', 'CX-3', '3', '6', 'CX-30'],
        'BMW': ['1 Series', '3 Series', '5 Series', 'X1', 'X3'],
        'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'GLA', 'GLC']
      };
      setAvailableModels(models[formData.make] || []);
      setFormData(prev => ({ ...prev, model: '' }));
    }
  }, [formData.make]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation state for the field
    setValidationStates(prev => ({
      ...prev,
      [field]: { isValid: false, message: '', suggestion: null, confidence: 0 }
    }));
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({ ...prev, plateNumber: suggestion }));
    setValidationStates(prev => ({
      ...prev,
      plateNumber: { isValid: true, message: 'Plate number corrected!', suggestion: null, confidence: 1 }
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        processImageForPlateRecognition(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImageForPlateRecognition = async (file) => {
    setIsProcessingImage(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Simulate plate recognition result
      const recognizedPlate = 'BKV 9429'; // This would come from AI model
      setFormData(prev => ({ ...prev, plateNumber: recognizedPlate }));
      setValidationStates(prev => ({
        ...prev,
        plateNumber: { isValid: true, message: 'Plate number recognized from image!', suggestion: null, confidence: 0.95 }
      }));
      
      setIsProcessingImage(false);
    }, 2000);
  };

  const handleDecision = (decision) => {
    setShowDecisionPopup(false);
    
    if (decision === 'manual') {
      // User chose manual input - stay on form
      // Form is already visible
    } else if (decision === 'image') {
      // User chose image upload - show Geran upload modal
      setShowGeranUpload(true);
    }
  };

  const handleCloseDecisionPopup = () => {
    setShowDecisionPopup(false);
    // Stay on the form page
  };

  const handleGeranFormDataExtracted = (extractedData) => {
    // Auto-fill form with extracted data
    setFormData(extractedData);
    
    // Set validation states to valid for extracted fields
    setValidationStates(prev => ({
      ...prev,
      plateNumber: { isValid: true, message: 'Extracted from Geran image', suggestion: null, confidence: extractedData.confidence },
      make: { isValid: true, message: 'Extracted from Geran image' },
      model: { isValid: true, message: 'Extracted from Geran image' },
      year: { isValid: true, message: 'Extracted from Geran image' },
      engineCC: { isValid: true, message: 'Extracted from Geran image' }
    }));

    // Update confidence score
    setConfidenceScore(extractedData.confidence);
    
    // Close the Geran upload modal
    setShowGeranUpload(false);
    
    // Show success message
    alert(`Form automatically filled with data extracted from Geran image!\nConfidence: ${(extractedData.confidence * 100).toFixed(1)}%`);
  };

  const handleSignOut = () => {
    if (isDemoMode) {
      localStorage.removeItem('demoSession');
      setDemoSession(null);
      setIsDemoMode(false);
      router.push('/auth/signin');
    } else {
      signOut({ callbackUrl: '/auth/signin' });
    }
  };

  const handleSubmit = () => {
    const finalValidation = {
      plateNumber: validationStates.plateNumber.isValid,
      make: validationStates.make.isValid,
      model: validationStates.model.isValid,
      year: validationStates.year.isValid,
      engineCC: validationStates.engineCC.isValid
    };
    
    const allValid = Object.values(finalValidation).every(Boolean);
    
    if (allValid) {
      router.push(`/confirm?plateNumber=${encodeURIComponent(formData.plateNumber)}`);
    } else {
      alert('Please fix validation errors before submitting.');
    }
  };

  // Get current user session (either real or demo)
  const currentUser = isDemoMode ? demoSession?.user : session?.user;

  if (status === 'loading' && !isDemoMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const tabs = [
    { id: 'vehicle', name: 'Vehicle Details', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'advanced', name: 'Advanced Features', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'review', name: 'Review & Submit', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
  ];

  return (
    <>
      <Head>
        <title>Vehicle Validation Form - Smart Vehicle Validation</title>
        <meta name="description" content="Comprehensive vehicle validation with AI-powered features" />
      </Head>

      {/* Decision Popup */}
      <DecisionPopup
        isOpen={showDecisionPopup}
        onClose={handleCloseDecisionPopup}
        onDecision={handleDecision}
      />

      {/* Geran Image Upload Modal */}
      <GeranImageUpload
        isOpen={showGeranUpload}
        onClose={() => setShowGeranUpload(false)}
        onFormDataExtracted={handleGeranFormDataExtracted}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <h1 className="text-2xl font-bold text-blue-900">CGS</h1>
                </Link>
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
                  {isDemoMode && (
                    <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      Demo Mode
                    </div>
                  )}
                  <div className="bg-black text-white px-4 py-2 rounded text-sm font-medium">
                    {currentUser.email?.toUpperCase() || 'USER@GMAIL.COM'}
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
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome, {currentUser.name}! 🚗
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete the comprehensive vehicle validation form with AI-powered features for accurate data entry.
            </p>
            
            {/* Geran Upload Button for Image Mode */}
            {isImageMode && (
              <div className="mt-4">
                <button
                  onClick={() => setShowGeranUpload(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Geran Image Again
                </button>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {tabs.map((tab, index) => (
                <div key={tab.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    activeTab === tab.id 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}>
                    {activeTab === tab.id ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    activeTab === tab.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {tab.name}
                  </span>
                  {index < tabs.length - 1 && (
                    <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                      </svg>
                      <span>{tab.name}</span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'vehicle' && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Information</h3>
                    <p className="text-gray-600">
                      Enter your vehicle details. Our AI-powered system will validate and suggest corrections in real-time.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* State Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select State</option>
                        <option value="selangor">Selangor</option>
                        <option value="kualaLumpur">Kuala Lumpur</option>
                        <option value="johor">Johor</option>
                        <option value="perak">Perak</option>
                        <option value="penang">Penang</option>
                        <option value="negeriSembilan">Negeri Sembilan</option>
                        <option value="melaka">Melaka</option>
                        <option value="pahang">Pahang</option>
                        <option value="terengganu">Terengganu</option>
                        <option value="kelantan">Kelantan</option>
                        <option value="kedah">Kedah</option>
                        <option value="perlis">Perlis</option>
                        <option value="sabah">Sabah</option>
                        <option value="sarawak">Sarawak</option>
                        <option value="putrajaya">Putrajaya</option>
                        <option value="labuan">Labuan</option>
                      </select>
                    </div>

                    {/* Plate Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Plate Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.plateNumber}
                        onChange={(e) => handleInputChange('plateNumber', e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., BKV 9429"
                      />
                    </div>

                    {/* Make */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Make <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.make}
                        onChange={(e) => handleInputChange('make', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Make</option>
                        {availableMakes.map(make => (
                          <option key={make} value={make}>{make}</option>
                        ))}
                      </select>
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={!formData.make}
                      >
                        <option value="">Select Model</option>
                        {availableModels.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>

                    {/* Year */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 2020"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                      />
                    </div>

                    {/* Engine CC */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Engine CC <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.engineCC}
                        onChange={(e) => handleInputChange('engineCC', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 1332"
                        min="600"
                        max="8000"
                      />
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <select
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Color</option>
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                        <option value="Green">Green</option>
                        <option value="Yellow">Yellow</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Silver">Silver</option>
                        <option value="Gray">Gray</option>
                        <option value="Orange">Orange</option>
                        <option value="Purple">Purple</option>
                        <option value="Pink">Pink</option>
                        <option value="Brown">Brown</option>
                      </select>
                    </div>

                    {/* VIN */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">VIN (Optional)</label>
                      <input
                        type="text"
                        value={formData.vin}
                        onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="17-character VIN"
                        maxLength="17"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setActiveTab('advanced')}
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Next: Advanced Features
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Advanced Features</h3>
                    <p className="text-gray-600">
                      AI-powered features for enhanced validation and user experience.
                    </p>
                  </div>

                  {/* Image-Based Verification (Tier 3) */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Image-Based Verification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Vehicle/Plate Image
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current.click()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                          >
                            Choose Image
                          </button>
                          <p className="mt-2 text-sm text-gray-500">
                            Upload a photo of your vehicle or license plate for AI recognition
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        {imagePreview && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                            <img
                              src={imagePreview}
                              alt="Vehicle"
                              className="w-full h-48 object-cover rounded-lg border border-gray-300"
                            />
                            {isProcessingImage && (
                              <div className="mt-2 text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-sm text-gray-600 mt-1">Processing image...</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setActiveTab('vehicle')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Previous: Vehicle Details
                    </button>
                    <button
                      onClick={() => setActiveTab('review')}
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Next: Review & Submit
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'review' && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h3>
                    <p className="text-gray-600">
                      Review all the information before submitting your vehicle validation.
                    </p>
                  </div>
                  
                  {/* Validation Summary */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Validation Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plate Number:</span>
                          <span className="font-medium">{formData.plateNumber || 'Not entered'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Make:</span>
                          <span className="font-medium">{formData.make || 'Not entered'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Model:</span>
                          <span className="font-medium">{formData.model || 'Not entered'}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year:</span>
                          <span className="font-medium">{formData.year || 'Not entered'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Engine CC:</span>
                          <span className="font-medium">{formData.engineCC || 'Not entered'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Color:</span>
                          <span className="font-medium">{formData.color || 'Not entered'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setActiveTab('advanced')}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Previous: Advanced Features
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                    >
                      Submit Validation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
