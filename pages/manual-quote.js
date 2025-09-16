import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useDebounce } from "../src/hooks/useDebounce";
import { validatePlateNumber ,validateCarMake,
  getModelsForMake, // <-- New import
  getYearsForModel, 
  validateIC, validatePassport,     // <-- New import
  validatePostcode, // <-- New import
  validatePhone,  
} from "../src/utils/validationLogic";
import CarBrandInput from "../src/components/CarBrandInput";
import { useQuote } from "../src/context/QuoteContext";
import { useT } from "../src/utils/i18n";
import {
  checkExistingPolicy,
  getPolicyStatusMessage,
} from "../src/data/insuranceDatabase";
import PlateValidationPopup from "../src/components/PlateValidationPopup";
import { useSession } from "next-auth/react";
import ContactHelp from "../src/components/ContactHelp";

export default function ManualQuoteSixStep() {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const { quoteDraft, setQuoteDraft } = useQuote();
  const t = useT();

  // Step 1
  const [plate, setPlate] = useState("");
  const debouncedPlate = useDebounce(plate, 400);
  const [plateValidation, setPlateValidation] = useState({
    isValid: false,
    error: null,
  });
  const [modelValidation, setModelValidation] = useState({ isValid: null, error: null });

  const [showPlateConfirm, setShowPlateConfirm] = useState(false);
  const [showPlateValidation, setShowPlateValidation] = useState(false);
  const [plateValidationResult, setPlateValidationResult] = useState(null);

  // Step 2
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const [modelSearch, setModelSearch] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const [availableModels, setAvailableModels] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  // Step 3
  const [protections, setProtections] = useState({});

  // Step 4
  const [name, setName] = useState("");
  const [ic, setIc] = useState("");
  const [postcode, setPostcode] = useState("");
  const [passport, setPassport] = useState("");
  const [phone, setPhone] = useState("");
  const [ncd, setNcd] = useState(20);

  const [documentType, setDocumentType] = useState("ic");
  const goNext = () => setStep((s) => Math.min(6, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const currentYear = new Date().getFullYear();
  const isCarOlderThan15Years = () => {
    // Check if a year has been selected
    if (!year) {
        return false;
    }
    const currentYear = new Date().getFullYear();
    const selectedYear = parseInt(year, 10); // Convert the string to a number
    return (currentYear - selectedYear) > 15;
};


  // Validation state for Step 4
  const [icValidation, setIcValidation] = useState({ isValid: null, error: null });
  const [passportValidation, setPassportValidation] = useState({ isValid: null, error: null }); // New validation state
  const [postcodeValidation, setPostcodeValidation] = useState({ isValid: null, error: null });
  const [phoneValidation, setPhoneValidation] = useState({ isValid: null, error: null });

  // Debounced values for validation
  const debouncedIC = useDebounce(ic, 500);
  const debouncedPostcode = useDebounce(postcode, 500);
  const debouncedPassport = useDebounce(passport, 500);
  const debouncedPhone = useDebounce(phone, 500);
  const debouncedModelSearch = useDebounce(modelSearch, 500);

  // Step 5 (computed estimate)
  const estimateRange = useMemo(() => {
    const base = 900;
    const brandFactor = brand ? 0 : 100; // encourage filling brand
    const protectionFactor =
      Object.values(protections).filter(Boolean).length * 40;
    const min = base + brandFactor + protectionFactor;
    const max = 1500;
    return { min, max };
  }, [brand, protections]);

  const formatICNumber = (value) => {
    // 1. Remove all non-digit characters (including existing dashes)
    const cleanedValue = value.replace(/\D/g, '');
    // 2. Apply the dash formatting based on length
    let formattedValue = '';
    if (cleanedValue.length > 0) {
      formattedValue = cleanedValue.slice(0, 6);
    }
    if (cleanedValue.length > 6) {
      formattedValue += '-' + cleanedValue.slice(6, 8);
    }
    if (cleanedValue.length > 8) {
      formattedValue += '-' + cleanedValue.slice(8, 12);
    }
    // 3. Return the formatted value
    return formattedValue;
  };

  const toggleProtection = (k) => {
  setProtections((prev) => {
    // If 'None' is toggled
    if (k === "None") {
      // If 'None' is being checked, return an object with only 'None' true
      // Otherwise, return an empty object
      return prev.None ? {} : { None: true };
    } else {
      // If any other protection is toggled
      const newState = { ...prev, [k]: !prev[k] };
      // Remove 'None' if any other protection is selected
      delete newState.None;
      return newState;
    }
  });
};

  // This useEffect handles both IC and Passport validation
useEffect(() => {
  if (documentType === 'ic') {
    const result = validateIC(debouncedIC);
    setIcValidation(result);
    // Reset passport validation when IC is active
    setPassportValidation({ isValid: null, error: null });
  } else if (documentType === 'passport') {
    const result = validatePassport(debouncedPassport);
    setPassportValidation(result);
    // Reset IC validation when Passport is active
    setIcValidation({ isValid: null, error: null });
  }
}, [debouncedIC, debouncedPassport, documentType]);

  useEffect(() => {
    setPostcodeValidation(validatePostcode(debouncedPostcode));
  }, [debouncedPostcode]);

  useEffect(() => {
    setPhoneValidation(validatePhone(debouncedPhone));
  }, [debouncedPhone]);

  useEffect(() => {
    // Prefill from chat assistant or Geran upload
    if (quoteDraft) {
      if (quoteDraft.plate) setPlate(quoteDraft.plate);
      if (quoteDraft.brand) setBrand(quoteDraft.brand);
      if (quoteDraft.model)
        setModel(
          quoteDraft.model.charAt(0).toUpperCase() + quoteDraft.model.slice(1)
        );
      if (quoteDraft.year) setYear(String(quoteDraft.year));
      if (quoteDraft.step) setStep(quoteDraft.step);
      // Reset step and fromGeran flag for future entries
      setQuoteDraft((prev) => ({ ...prev, step: 1, fromGeran: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!debouncedPlate) {
      setPlateValidation({ isValid: false, error: null });
      return;
    }
    const result = validatePlateNumber(debouncedPlate, "default");
    setPlateValidation({ isValid: result.isValid, error: result.error });
  }, [debouncedPlate]);

  // Check for existing policy when plate is valid (only for manual entry, not from Geran upload)
  // Only show policy validation for specific plate "ABC 1234"
  useEffect(() => {
    if (plateValidation.isValid && debouncedPlate && !quoteDraft?.fromGeran) {
      // Only check for existing policy if plate is "ABC 1234"
      if (debouncedPlate.toUpperCase() === "ABC 1234") {
        const policyCheck = checkExistingPolicy(debouncedPlate);
        if (policyCheck.exists) {
          const statusMessage = getPolicyStatusMessage(policyCheck);
          setPlateValidationResult(statusMessage);
          setShowPlateValidation(true);
        }
      }
    }
  }, [plateValidation.isValid, debouncedPlate, quoteDraft?.fromGeran]);

  // Effect to update available models when brand changes
  useEffect(() => {
    if (brand) {
      setAvailableModels(getModelsForMake(brand));
    } else {
      setAvailableModels([]);
    }
    // Reset model and year when brand changes
    setModel("");
    setYear("");
    setModelSearch("");
  }, [brand]);

  // Add a new useEffect to filter models based on the search input
  const filteredModels = useMemo(() => {
    if (!modelSearch) {
      return availableModels;
    }
    return availableModels.filter((m) =>
      m.toLowerCase().includes(modelSearch.toLowerCase())
    );
  }, [modelSearch, availableModels]);

  useEffect(() => {
  if (debouncedModelSearch) {
    // Find a model from the available list that exactly matches the debounced input
    const matchingModel = availableModels.find(m => m.toLowerCase() === debouncedModelSearch.toLowerCase());

    if (matchingModel) {
      // If a matching model is found, automatically set it as the selected model
      setModel(matchingModel);
      setModelSearch(matchingModel); // Keep the search input consistent
      setModelValidation({ isValid: true, error: null });
      // You may also want to close the dropdown here
      setShowModelDropdown(false); 
    } else {
      // If no match is found, set the validation to invalid
      setModelValidation({ isValid: false, error: "Invalid model. Please choose from the dropdown list." });
    }
  } else {
    // If the search input is empty, reset the validation state
    setModelValidation({ isValid: null, error: null });
  }
}, [debouncedModelSearch, availableModels, setModel, setModelSearch]);

  // Effect to update available years when model changes
  useEffect(() => {
    if (brand && model) {
      setAvailableYears(getYearsForModel(brand, model));
    } else {
      setAvailableYears([]);
    }
    // Reset year when model changes
    setYear("");
  }, [brand, model]);

  const steps = [
    { id: 1, title: t("steps_1") },
    { id: 2, title: t("steps_2") },
    { id: 3, title: t("steps_3") },
    { id: 4, title: t("steps_4") },
    { id: 5, title: t("steps_5") },
    { id: 6, title: t("steps_6") },
  ];

  // Plate validation handlers
  const handlePlateValidationClose = () => {
    setShowPlateValidation(false);
    setPlateValidationResult(null);
  };

  const handlePlateValidationProceed = () => {
    setShowPlateValidation(false);
    setPlateValidationResult(null);
    setShowPlateConfirm(true);
  };

  const handleRenewEarly = () => {
    setShowPlateValidation(false);
    setPlateValidationResult(null);
    // Navigate to renewal flow or pre-fill with existing policy data
    setShowPlateConfirm(true);
  };

  const handleTransferOwnership = () => {
    setShowPlateValidation(false);
    setPlateValidationResult(null);
    // Navigate to transfer ownership flow
    setShowPlateConfirm(true);
  };

  const canProceedFrom = (currentStep) => {
  if (currentStep === 1) {
    return (
      plateValidation.isValid &&
      plate.trim() !== "" &&
      plate.replace(/\s/g, "").length <= 10
    );
  }
  if (currentStep === 2) {
    return brand && model && year && modelValidation.isValid;
  }
  if (currentStep === 3) {
    return Object.keys(protections).length > 0;
  }
  if (currentStep === 4) {
    // Logic for step 4 is now correctly enclosed
    const isDocumentValid = documentType === 'ic'
      ? icValidation.isValid === true
      : passportValidation.isValid === true;
      
    // The return statement is now inside the if block
    return (
      name.trim() !== "" &&
      isDocumentValid &&
      postcodeValidation.isValid === true 
    );
  }
  if (currentStep === 5) {
    return true;
  }
  return false;
};

  const handlePlateInput = (e) => {
    const input = e.target;
    let { selectionStart } = input;
    let value = input.value.toUpperCase();

    const clean = value.replace(/\s+/g, "");

    const formatted = clean
      .replace(/([A-Z]+)(\d+)/gi, "$1 $2")
      .replace(/(\d+)([A-Z]+)/gi, "$1 $2");

    if (formatted.length > value.length) selectionStart += 1;
    else if (formatted.length < value.length) selectionStart -= 1;

    setPlate(formatted);

    setTimeout(
      () => input.setSelectionRange(selectionStart, selectionStart),
      0
    );
  };

  return (
    <>
      <Head>
        <title>Manual Quote - 6 Steps</title>
      </Head>
      <div className="min-h-screen bg-white">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
            {/* Logo on the left */}
            <Link
              href="/dashboard"
              className="text-2xl font-bold text-blue-900"
            >
              CGS
            </Link>

            {/* Navigation Links + Email pushed to the right */}
            <div className="flex items-center ml-auto space-x-6">
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
                    src="/images/notification.png"
                    alt="Notifications"
                    className="w-5 h-5"
                  />
                  <span>Notifications</span>
                </a>
              </nav>

              <div className="bg-black text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {session?.user?.email || "USERNAME123@GMAIL.COM"}
              </div>
            </div>
          </div>
        </header>

        <section className="relative bg-blue-50 py-16">
          {/* Step bubbles */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center z-10">
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center w-1/6">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-extrabold ${
                    step === s.id
                      ? "bg-blue-800 text-white"
                      : step > s.id
                      ? "bg-blue-300 text-white"
                      : "bg-blue-200 text-white"
                  }`}
                >
                  {s.id}
                </div>
                <div className="mt-2 text-sm text-blue-900 text-center">
                  {s.title}
                </div>
              </div>
            ))}
          </div>
        </section>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ">
          {/* Background car images */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
            <img
              src="/images/car-picture-1.jpg"
              alt="Car Left"
              className="w-130 h-auto mr-90 opacity-100 mt-120"
            />
            <img
              src="/images/car-picture-2.jpg"
              alt="Car Right"
              className="w-120 h-auto ml-90 opacity-100 mt-120"
            />
          </div>

          <div className="relative z-10 bg-white rounded-2xl shadow border border-gray-200 p-8">
            {step === 1 && (
              <div className="text-center">
                <h2 className="text-xl font-bold text-blue-900 mb-6">
                  {t("plate_prompt")}
                </h2>
                <div className="flex justify-center">
                  <input
                    value={plate}
                    onChange={handlePlateInput}
                    className="w-full max-w-md px-6 py-4 bg-blue-50 rounded-xl text-blue-900 text-xl text-center outline-none border border-blue-100 focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. PKD 8381"
                    disabled={showPlateConfirm} // ← disable when confirmation is showing
                  />
                </div>
                {plate.replace(/\s/g, "").length > 10 && (
                  <p className="mt-3 text-xs text-red-500">
                    {t("plate_max_length")}
                  </p>
                )}

                <div className="flex justify-between mt-8 max-w-md mx-auto">
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-xl font-semibold border border-blue-200 text-blue-900 hover:bg-blue-50"
                  >
                    {t("back_to_home")}
                  </Link>

                  <button
                    onClick={() => setShowPlateConfirm(true)}
                    disabled={!canProceedFrom(1)}
                    className={`px-10 py-3 rounded-xl font-semibold text-white ${
                      canProceedFrom(1)
                        ? "bg-blue-800 hover:bg-blue-900"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {t("submit")}
                  </button>
                </div>
              </div>
            )}

            {step === 1 && showPlateConfirm && (
              <div className="text-center p-6 bg-blue-50 rounded-lg shadow mt-6">
                <p className="text-blue-700 text-lg font-semibold">
                  Are you sure your car plate number is{" "}
                  <span className="font-bold">{plate}</span>?
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    onClick={() => setShowPlateConfirm(false)} // back to edit
                    className="px-6 py-2 border border-blue-200 rounded-lg text-blue-900 font-semibold hover:bg-blue-50"
                  >
                    {t("back")} to Edit
                  </button>
                  <button
                    onClick={() => {
                      setStep(2);
                      setShowPlateConfirm(false);
                    }} // next step
                    className="px-6 py-2 rounded-lg bg-blue-800 text-white font-semibold hover:bg-blue-900"
                  >
                    {t("Yes")}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
          <div className="text-xl font-bold text-blue-900 mb-6">
            {t("Car Plate Number: ")} {plate || "—"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Car Brand input (already a component) */}
            <CarBrandInput value={brand} onChange={setBrand} />

            {/* Car Model search input with filtered dropdown */}
            <div className="relative">
              <label className="block text-blue-900 font-semibold mb-2">
                {t("Car Model:")}
              </label>
              {/* This should be a dropdown now */}
              <input
          type="text"
          value={modelSearch}
          onChange={(e) => {
            setModelSearch(e.target.value);
            setModel(""); // Clear selected model
            setShowModelDropdown(true);
          }}
          onFocus={() => setShowModelDropdown(true)}
          onBlur={() => setTimeout(() => setShowModelDropdown(false), 200)}
          className={`w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border ${
            modelValidation.isValid === true
              ? "border-green-500" // Green border when valid
              : modelValidation.isValid === false
              ? "border-red-500" // Red border when invalid
              : "border-blue-100" // Default border
            } focus:ring-2 focus:ring-blue-400`}
          placeholder="Type to search..."
          disabled={!brand}
          autoComplete="off"
        />

        {/* New: Display error message if the model is invalid */}
        {modelValidation.error && (
          <p className="mt-2 text-sm text-red-600">{modelValidation.error}</p>
        )}

        {showModelDropdown && filteredModels.length > 0 && (
          <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
            {filteredModels.map((m) => (
              <li
                key={m}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                onMouseDown={(e) => { // Use onMouseDown to prevent blur
                  e.preventDefault();
                  setModelSearch(m);
                  setModel(m);
                  setShowModelDropdown(false);
                }}
              >
                {m}
              </li>
            ))}
          </ul>
        )}
      </div>

            {/* Manufactured Year dropdown */}
            <div>
              <label className="block text-blue-900 font-semibold mb-2">
                {t("manufactured_year")}
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
                disabled={!model} // Disable until a model is selected
              >
                <option value="">Select year</option>
                {availableYears
                  .sort((a, b) => b - a) // <-- This is the key change!
                  .map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                ))}
              </select>
              {isCarOlderThan15Years() && (
                <p className="mt-2 text-red-500 font-normal text-center">
                  Your car is older than 15 years. Coverage may be limited or require special inspection.
                </p>
              )}
            </div>
          </div>

                {/* Back / Next buttons */}
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={goBack}
                    className="px-8 py-3 rounded-xl font-semibold border border-blue-200 text-blue-900 hover:bg-blue-50"
                  >
                  {t("back")}
                </button>
                <button
                  onClick={goNext}
                  disabled={!canProceedFrom(2)}
                  className={`px-8 py-3 rounded-xl font-semibold text-white ${
                    canProceedFrom(2)
                      ? "bg-blue-800 hover:bg-blue-900"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                {t("next")}
                </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-6">
                  {t("select_additional_protection")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Add the "None" checkbox here */}
                  <label
                    key="None"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer"
                  >
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={!!protections.None}
                    onChange={() => toggleProtection("None")}
                  />
                  <span className="text-blue-900">None</span>
                  </label>
                  {[
                    t("windscreen"),
                    t("named_driver"),
                    t("all_driver"),
                    t("natural_disaster"),
                    t("strike_riot"),
                    t("personal_accident"),
                    t("towing"),
                    t("passengers_coverage"),
                  ].map((label) => (
                    <label
                      key={label}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={!!protections[label]}
                        onChange={() => toggleProtection(label)}
                        disabled={!!protections.None}
                      />
                      <span className="text-blue-900">{label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={goBack}
                    className="px-8 py-3 rounded-xl font-semibold border border-blue-200 text-blue-900 hover:bg-blue-50"
                  >
                    {t("back")}
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!canProceedFrom(3)} // Check validation for the current step (3)
                    className={`px-8 py-3 rounded-xl font-semibold text-white ${
                      canProceedFrom(3)
                        ? "bg-blue-800 hover:bg-blue-900"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {t("next")}
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vehicle Info (read-only) */}
                  <div>
                    <div className="text-blue-900 font-bold mb-2">
                      {t("Car Plate Number")}{" "}
                      <span className="font-normal">{plate || "—"}</span>
                    </div>
                    <div className="text-blue-900 font-bold mb-2">
                      {t("car_brand")}{" "}
                      <span className="font-normal">{brand || "—"}</span>
                    </div>
                    <div className="text-blue-900 font-bold mb-2">
                      {t("car_model")}{" "}
                      <span className="font-normal">{model || "—"}</span>
                    </div>
                    <div className="text-blue-900 font-bold mb-2">
                      {t("manufactured_year")}{" "}
                      <span className="font-normal">{year || "—"}</span>
                    </div>
                    <div className="text-blue-900 font-bold mb-2">
                      {t("ncd")}{" "}
                      <button
                        className="underline font-normal"
                        type="button"
                        onClick={() => setNcd(20)}
                      >
                        {t("check_ncd")}
                      </button>
                    </div>
                  </div>

                  {/* Personal Info (editable) */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-blue-900 font-semibold mb-2">
                        {t("Full Name")}
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-center mb-4">
            <span className="text-blue-900 font-semibold mr-4">
              ID Type:
            </span>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="documentType"
                value="ic"
                checked={documentType === "ic"}
                onChange={() => {
                  setDocumentType("ic");
                  setPassport(""); // Clear passport value
                }}
              />
              <span className="ml-2 text-blue-900">NRIC (IC)</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="documentType"
                value="passport"
                checked={documentType === "passport"}
                onChange={() => {
                  setDocumentType("passport");
                  setIc(""); // Clear IC value
                }}
              />
              <span className="ml-2 text-blue-900">Passport</span>
            </label>
          </div>

          {/* Conditional input for IC or Passport */}
          {documentType === "ic" ? (
            <div className="mb-4">
              <label className="block text-blue-900 font-semibold mb-2">
                NRIC (IC)
              </label>
              <input
                type="text"
                value={ic}
                onChange={(e) => {
                  const formattedIC = formatICNumber(e.target.value);
                  setIc(formattedIC);}}
                className={`w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border ${
                  icValidation.isValid === true
                    ? "border-green-500"
                    : icValidation.isValid === false
                    ? "border-red-500"
                    : "border-blue-100"
                }`}
                placeholder="e.g. 050102-07-0304"
              />
            
              {icValidation.error && (
                <p className="mt-2 text-sm text-red-600">{icValidation.error}</p>
              )}
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-blue-900 font-semibold mb-2">
                Passport Number
              </label>
              <input
                type="text"
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
                className={`w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border ${
                  passportValidation.isValid === true
                    ? "border-green-500"
                    : passportValidation.isValid === false
                    ? "border-red-500"
                    : "border-blue-100"
                }`}
                placeholder="e.g. 123456789"
              />
              {passportValidation.error && (
                <p className="mt-2 text-sm text-red-600">{passportValidation.error}</p>
              )}
            </div>
          )}
                    <div>
                      <label className="block text-blue-900 font-semibold mb-2">
                        {t("postcode")}
                      </label>
                      <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className={`w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border ${
                postcodeValidation.isValid === true
                  ? "border-green-500"
                  : postcodeValidation.isValid === false
                  ? "border-red-500"
                  : "border-blue-100"
              }`}
              placeholder="e.g. 50000"
            />
            {postcodeValidation.error && (
              <p className="mt-2 text-sm text-red-600">{postcodeValidation.error}</p>
            )}
          </div>

                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={goBack}
                    className="px-8 py-3 rounded-xl font-semibold border border-blue-200 text-blue-900 hover:bg-blue-50"
                  >
                    {t("back")}
                  </button>
                  <button
                    onClick={() => canProceedFrom(step) && goNext()}
                    className={`px-8 py-3 rounded-xl font-semibold text-white ${
                      canProceedFrom(step)
                        ? "bg-blue-800 hover:bg-blue-900"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {t("next")}
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-blue-900">
                    <div className="font-bold">
                      {t("car_plate_number")}{" "}
                      <span className="font-normal">{plate}</span>
                    </div>
                    <div className="font-bold">
                      {t("car_brand")}{" "}
                      <span className="font-normal">{brand}</span>
                    </div>
                    <div className="font-bold">
                      {t("car_model")}{" "}
                      <span className="font-normal">{model}</span>
                    </div>
                    <div className="font-bold">
                      {t("manufactured_year")}{" "}
                      <span className="font-normal">{year}</span>
                    </div>
                    <div className="font-bold">
                      {t("ncd")} <span className="font-normal">{ncd}%</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-blue-900">
                    <div className="font-bold">
                      {t("name_as_ic_field")}{" "}
                      <span className="font-normal">{name}</span>
                    </div>
                    <div className="font-bold">
                      {t("ic")} <span className="font-normal">{ic}</span>
                    </div>
                    <div className="font-bold">
                      {t("postcode")}{" "}
                      <span className="font-normal">{postcode}</span>
                    </div>
                    <div className="font-bold">
                      {t("estimated_range")}{" "}
                      <span className="font-normal">
                        RM{estimateRange.min}-RM{estimateRange.max}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={goBack}
                    className="px-8 py-3 rounded-xl font-semibold border border-blue-200 text-blue-900 hover:bg-blue-50"
                  >
                    {t("back")}
                  </button>
                  <button
                    onClick={goNext}
                    className="px-8 py-3 rounded-xl font-semibold text-white bg-blue-800 hover:bg-blue-900"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="text-center">
                <h2 className="text-xl font-bold text-blue-900 mb-2">
                  {t("your_quotation_sent")}
                </h2>
                <div className="mt-4 text-3xl font-extrabold text-blue-800">
                  {session?.user?.email || "USERNAME123@GMAIL.COM"}
                </div>

                {/* Contact Help with underlined links */}
                <div className="mt-6 text-gray-700">
                  <ContactHelp />
                </div>

                <div className="mt-8">
                  <Link
                    href="/dashboard"
                    className="inline-block px-10 py-3 rounded-xl font-semibold text-white bg-blue-800 hover:bg-blue-900"
                  >
                    {t("done")}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Plate Validation Popup */}
        <PlateValidationPopup
          isOpen={showPlateValidation}
          onClose={handlePlateValidationClose}
          onProceed={handlePlateValidationProceed}
          onRenew={handleRenewEarly}
          onTransfer={handleTransferOwnership}
          validationResult={plateValidationResult}
        />
      </div>
    </>
  );
}
  