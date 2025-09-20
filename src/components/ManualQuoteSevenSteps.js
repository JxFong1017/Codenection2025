"use client";

import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Fuse from "fuse.js";
import { useDebounce } from "../hooks/useDebounce";
import {
  validatePlateNumber,
  validateCarMake,
  getModelsForMake,
  getYearsForModel,
  getUniqueMakes,
  validateIC,
  validatePassport,
  validatePostcode,
  validatePhone,
} from "../utils/validationLogic";
import { useQuote } from "../context/QuoteContext";
import { useT } from "../utils/i18n";
import {
  checkExistingPolicy,
  getPolicyStatusMessage,
} from "../data/insuranceDatabase";
import PlateValidationPopup from "./PlateValidationPopup";
import { useSession } from "next-auth/react";
import ContactHelp from "./ContactHelp";
import { carData } from "../data/carData";
import NextImage from "next/image";
import GeranImageUpload from "./GeranImageUpload";

export default function ManualQuoteSevenStep() {
  const { data: session } = useSession();
  const t = useT();
  const [step, setStep] = useState(1);
  const { quoteDraft, setQuoteDraft } = useQuote();
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [notification, setNotification] = useState(null);

  // Step 1
  const [plate, setPlate] = useState("");
  const debouncedPlate = useDebounce(plate, 400);
  const [plateValidation, setPlateValidation] = useState({
    isValid: false,
    error: null,
  });
  const [modelValidation, setModelValidation] = useState({
    isValid: null,
    error: null,
  });
  const [showPlateConfirm, setShowPlateConfirm] = useState(false);
  const [showPlateValidation, setShowPlateValidation] = useState(false);
  const [plateValidationResult, setPlateValidationResult] = useState(null);
  const [showGeranModal, setShowGeranModal] = useState(false);

  // Step 2
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [brandValidation, setBrandValidation] = useState({
    isValid: null,
    error: null,
  });
  const [modelFuse, setModelFuse] = useState(null);
  const [modelSearch, setModelSearch] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  // Step 3
  const [coverageType, setCoverageType] = useState("");

  // Step 4
  const [protections, setProtections] = useState({});

  // Step 5
  const [name, setName] = useState("");
  const [ic, setIc] = useState("");
  const [postcode, setPostcode] = useState("");
  const [passport, setPassport] = useState("");
  const [phone, setPhone] = useState("");
  const [documentType, setDocumentType] = useState("ic");
  const [ncdValidation, setNcdValidation] = useState({
    isValid: true,
    error: "",
  });

  const [ncd, setNcd] = useState(20);
  const [ncdInput, setNcdInput] = useState("");
  const ncdOptions = [0, 25, 30, 38.3, 45, 55];

  const handleNcdChange = (e) => {
    const value = e.target.value;
    setNcdInput(value);

    if (value.trim() === "") {
      setNcdValidation({ isValid: null, error: "" });
      setNcd(0);
      return;
    }

    const parsedValue = parseInt(value, 10);
    const isValueValid =
      !isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 55;

    if (isValueValid) {
      setNcd(parsedValue);
      setNcdValidation({ isValid: true, error: "" });
    } else {
      let errorMessage = "Please enter a valid NCD between 0 and 55.";
      if (parsedValue > 55) {
        errorMessage =
          "The maximum NCD rate for cars in Malaysia is 55% according to rates set by the Persatuan Insurans Am Malaysia (PIAM).";
      }
      setNcdValidation({
        isValid: false,
        error: errorMessage,
      });
    }
  };

  const handleCheckNcd = () => {
    window.open("https://www.mycarinfo.com.my/NCDCheck/Online", "_blank");
  };

  const currentYear = new Date().getFullYear();
  const isCarOlderThan15Years = () => {
    if (!year) {
      return false;
    }
    const selectedYear = parseInt(year, 10);
    return currentYear - selectedYear > 15;
  };

  const [icValidation, setIcValidation] = useState({
    isValid: null,
    error: null,
  });
  const [passportValidation, setPassportValidation] = useState({
    isValid: null,
    error: null,
  });
  const [postcodeValidation, setPostcodeValidation] = useState({
    isValid: null,
    error: null,
  });
  const [phoneValidation, setPhoneValidation] = useState({
    isValid: null,
    error: null,
  });

  const debouncedIC = useDebounce(ic, 500);
  const debouncedPostcode = useDebounce(postcode, 500);
  const debouncedPassport = useDebounce(passport, 500);
  const debouncedPhone = useDebounce(phone, 500);
  const debouncedModelSearch = useDebounce(modelSearch, 500);
  const debouncedBrandSearch = useDebounce(brandSearch, 500);
  const allBrands = useMemo(() => getUniqueMakes(), []);

  const estimateRange = useMemo(() => {
    const selectedCar = carData.find(
      (car) => car.make === brand && car.model === model
    );

    if (!selectedCar || !year || !coverageType || !postcode) {
      return { min: 0, max: 0 };
    }

    const carAge = new Date().getFullYear() - parseInt(year, 10);
    const depreciationFactor = Math.max(0.3, Math.pow(0.9, carAge));
    const currentMarketValue = selectedCar.marketValue * depreciationFactor;

    let basicPremium = 0;
    const { engineCapacity } = selectedCar;

    const firstTwoPostcodeDigits = parseInt(postcode.substring(0, 2), 10);
    const isEastMalaysia =
      (firstTwoPostcodeDigits >= 88 && firstTwoPostcodeDigits <= 91) ||
      (firstTwoPostcodeDigits >= 93 && firstTwoPostcodeDigits <= 98);

    const comprehensiveRates = {
      peninsular: {
        rates: [
          { cc: 1400, base: 273.8 },
          { cc: 1650, base: 305.5 },
          { cc: 2200, base: 339.1 },
          { cc: 3050, base: 372.6 },
          { cc: 4100, base: 404.3 },
          { cc: 4250, base: 436.0 },
          { cc: 4400, base: 469.6 },
          { cc: Infinity, base: 501.3 },
        ],
        per1000: 26.0,
      },
      east: {
        rates: [
          { cc: 1400, base: 219.0 },
          { cc: 1650, base: 244.4 },
          { cc: 2200, base: 271.3 },
          { cc: 3050, base: 298.1 },
          { cc: 4100, base: 323.4 },
          { cc: 4250, base: 348.8 },
          { cc: 4400, base: 375.7 },
          { cc: Infinity, base: 401.1 },
        ],
        per1000: 20.3,
      },
    };

    const thirdPartyRates = {
      peninsular: [
        { cc: 1400, premium: 120.6 },
        { cc: 1650, premium: 135.0 },
        { cc: 2200, premium: 151.2 },
        { cc: 3050, premium: 167.4 },
        { cc: 4100, premium: 181.8 },
        { cc: 4250, premium: 196.2 },
        { cc: 4400, premium: 212.4 },
        { cc: Infinity, premium: 226.8 },
      ],
      east: [
        { cc: 1400, premium: 95.9 },
        { cc: 1650, premium: 107.5 },
        { cc: 2200, premium: 120.6 },
        { cc: 3050, premium: 133.6 },
        { cc: 4100, premium: 145.1 },
        { cc: 4250, premium: 156.5 },
        { cc: 4400, premium: 169.6 },
        { cc: Infinity, premium: 181.1 },
      ],
    };

    const ratesForComprehensive = isEastMalaysia
      ? comprehensiveRates.east
      : comprehensiveRates.peninsular;
    const ratesForThirdParty = isEastMalaysia
      ? thirdPartyRates.east
      : thirdPartyRates.peninsular;

    if (coverageType === "Comprehensive") {
      const rateTier = ratesForComprehensive.rates.find(
        (tier) => engineCapacity <= tier.cc
      );
      const rate = rateTier.base;
      const ratePer1000 = ratesForComprehensive.per1000;

      const excessValue = Math.max(0, currentMarketValue - 1000);
      basicPremium = rate + (excessValue / 1000) * ratePer1000;
    } else if (coverageType === "Third-Party, Fire & Theft") {
      const rateTier = ratesForComprehensive.rates.find(
        (tier) => engineCapacity <= tier.cc
      );
      const rate = rateTier.base;
      const ratePer1000 = ratesForComprehensive.per1000;

      const excessValue = Math.max(0, currentMarketValue - 1000);
      const comprehensivePremium = rate + (excessValue / 1000) * ratePer1000;

      basicPremium = comprehensivePremium * 0.75;
    } else {
      const rateTier = ratesForThirdParty.find(
        (tier) => engineCapacity <= tier.cc
      );
      basicPremium = rateTier.premium;
    }

    let additionalCoverageCost = 0;
    if (coverageType === "Comprehensive" && protections && !protections.None) {
      additionalCoverageCost = Object.keys(protections).reduce((acc, key) => {
        if (!protections[key]) return acc;

        if (key === t("windscreen")) return acc + 150;
        if (key === t("natural_disaster"))
          return acc + currentMarketValue * 0.005;
        if (key === t("strike_riot")) return acc + currentMarketValue * 0.003;
        if (key === t("personal_accident")) return acc + 100;
        if (key === t("towing")) return acc + 50;
        if (key === t("named_driver")) return acc + 10;
        if (key === t("all_driver")) return acc + 50;
        if (key === t("passengers_coverage")) return acc + 25;

        return acc;
      }, 0);
    }

    const ncdDiscount = basicPremium * (ncd / 100);
    const premiumPayable = basicPremium - ncdDiscount + additionalCoverageCost;
    const sst = premiumPayable * 0.06;
    const stampDuty = 10;
    const totalPremium = premiumPayable + sst + stampDuty;

    if (
      coverageType === "Comprehensive" ||
      coverageType === "Third-Party, Fire & Theft"
    ) {
      const minEstimate = Math.round(totalPremium * 0.95);
      const maxEstimate = Math.round(totalPremium * 1.05);
      return { min: minEstimate, max: maxEstimate };
    } else {
      const finalEstimate = Math.round(totalPremium);
      return { min: finalEstimate, max: finalEstimate };
    }
  }, [brand, model, year, coverageType, protections, ncd, t, postcode]);

  const fuse = useMemo(() => {
    return new Fuse(allBrands, {
      keys: [],
      includeScore: true,
      threshold: 0.3,
    });
  }, [allBrands]);

  const formatICNumber = (value) => {
    const cleanedValue = value.replace(/\D/g, "");
    let formattedValue = "";
    if (cleanedValue.length > 0) {
      formattedValue = cleanedValue.slice(0, 6);
    }
    if (cleanedValue.length > 6) {
      formattedValue += "-" + cleanedValue.slice(6, 8);
    }
    if (cleanedValue.length > 8) {
      formattedValue += "-" + cleanedValue.slice(8, 12);
    }
    return formattedValue;
  };

  const toggleProtection = (label) => {
    setProtections((prevProtections) => {
      if (label === "None") {
        return {
          None: !prevProtections.None,
        };
      }
      const newProtections = {
        ...prevProtections,
        [label]: !prevProtections[label],
      };
      if (newProtections[label]) {
        delete newProtections.None;
      }
      return newProtections;
    });
  };

  const handleSubmit = async () => {
    if (!session?.user?.email) {
      setNotification({
        type: "error",
        message: "You must be signed in to submit a quote.",
      });
      return;
    }

    const quotationData = {
      customer: {
        name,
        ic: documentType === "ic" ? ic : passport,
        postcode,
      },
      car: {
        plate,
        brand,
        model,
        year,
        ncd,
      },
      coverage: {
        type: coverageType,
        protections: coverageType === "Comprehensive" ? protections : null,
      },
      estimatedPremium: estimateRange,
      email: session.user.email,
    };

    try {
      const response = await fetch("/api/generate-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotationData),
      });

      if (response.ok) {
        const emailResponse = await fetch("/api/sendQuote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientEmail: quotationData.email,
            quotationData,
          }),
        });

        const result = await emailResponse.json();

        if (result.success) {
          setNotification({ type: "success", message: "Quotation email sent successfully!" });
          goNext();
        } else {
          setNotification({ type: "error", message: "Failed to send email: " + result.error });
        }
      } else {
        setNotification({ type: "error", message: "Failed to generate quotation." });
      }
    } catch (error) {
      setNotification({ type: "error", message: "Something went wrong: " + error.message });
    }
  };

  const steps = [
    { id: 1, title: t("steps_1") },
    { id: 2, title: t("steps_2") },
    { id: 3, title: "Choose Coverage" },
    { id: 4, title: t("steps_3") },
    { id: 5, title: t("steps_4") },
    { id: 6, title: t("steps_5") },
    { id: 7, title: t("steps_6") },
  ];

  const goNext = () => setStep((s) => Math.min(7, s + 1));

  const goBack = () => {
    if (step === 5 && coverageType !== "Comprehensive") {
      setStep(3);
    } else {
      setStep((s) => Math.max(1, s - 1));
    }
  };

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
    setShowPlateConfirm(true);
  };

  const handleTransferOwnership = () => {
    setShowPlateValidation(false);
    setPlateValidationResult(null);
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
      return (
        brandValidation.isValid === true &&
        modelValidation.isValid === true &&
        year !== ""
      );
    }
    if (currentStep === 3) {
      return coverageType !== "";
    }
    if (currentStep === 4) {
      return Object.keys(protections).length > 0;
    }
    if (currentStep === 5) {
      const isDocumentValid =
        documentType === "ic" ?
        icValidation.isValid === true :
        passportValidation.isValid === true;
      return (
        name.trim() !== "" &&
        isDocumentValid &&
        postcodeValidation.isValid === true &&
        ncdValidation.isValid === true
      );
    }
    if (currentStep === 6) {
      return true;
    }
    if (currentStep === 7) {
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

  useEffect(() => {
    if (debouncedPlate) {
      const { isValid, error } = validatePlateNumber(debouncedPlate);
      setPlateValidation({ isValid, error });

      if (isValid) {
        const policyStatus = checkExistingPolicy(debouncedPlate);
        if (policyStatus) {
          setPlateValidationResult(policyStatus);
          setShowPlateValidation(true);
        } else {
          setQuoteDraft((prev) => ({ ...prev, plate: debouncedPlate }));
        }
      }
    }
  }, [debouncedPlate, setQuoteDraft]);

  useEffect(() => {
    if (debouncedIC.length === 12) {
      const { isValid, error } = validateIC(debouncedIC);
      setIcValidation({ isValid, error });
    } else {
      setIcValidation({ isValid: null, error: null });
    }
  }, [debouncedIC]);

  useEffect(() => {
    if (debouncedPassport) {
      const { isValid, error } = validatePassport(debouncedPassport);
      setPassportValidation({ isValid, error });
    } else {
      setPassportValidation({ isValid: null, error: null });
    }
  }, [debouncedPassport]);

  useEffect(() => {
    if (debouncedPostcode) {
      const { isValid, error } = validatePostcode(debouncedPostcode);
      setPostcodeValidation({ isValid, error });
    } else {
      setPostcodeValidation({ isValid: null, error: null });
    }
  }, [debouncedPostcode]);

  useEffect(() => {
    if (debouncedPhone) {
      const { isValid, error } = validatePhone(debouncedPhone);
      setPhoneValidation({ isValid, error });
    } else {
      setPhoneValidation({ isValid: null, error: null });
    }
  }, [debouncedPhone]);

  useEffect(() => {
    const uniqueMakes = getUniqueMakes();
    const sortedMakes = uniqueMakes.sort();
    setAvailableBrands(sortedMakes);
  }, []);

  useEffect(() => {
    if (brandSearch) {
      const results = fuse.search(brandSearch);
      setAvailableBrands(results.map((result) => result.item));
      setShowBrandDropdown(true);
    } else {
      setAvailableBrands(getUniqueMakes());
      setShowBrandDropdown(false);
    }
  }, [brandSearch, fuse]);

  useEffect(() => {
    if (brand && debouncedBrandSearch) {
      setBrandValidation(validateCarMake(brand));
      setAvailableModels(getModelsForMake(brand).sort());
      setModelFuse(
        new Fuse(getModelsForMake(brand), {
          keys: [],
          includeScore: true,
          threshold: 0.3,
        })
      );
    }
  }, [brand, debouncedBrandSearch]);

  useEffect(() => {
    if (model) {
      setAvailableYears(getYearsForModel(brand, model).sort().reverse());
    }
  }, [brand, model]);

  useEffect(() => {
    if (modelFuse && debouncedModelSearch) {
      const results = modelFuse.search(debouncedModelSearch);
      setAvailableModels(results.map((result) => result.item));
      setShowModelDropdown(true);
    } else if (brand) {
      setAvailableModels(getModelsForMake(brand));
      setShowModelDropdown(false);
    } else {
      setAvailableModels([]);
    }
  }, [debouncedModelSearch, modelFuse, brand]);

  useEffect(() => {
    if (coverageType && coverageType !== "Comprehensive") {
      setProtections({});
    }
  }, [coverageType]);

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
                  <NextImage
                    src="/images/profile.png"
                    alt="Profile"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span>Profile</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-900"
                >
                  <NextImage
                    src="/images/get-quotation.png"
                    alt="Get Quotation"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span>Get Quotation</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-900"
                >
                  <NextImage
                    src="/images/help.png"
                    alt="Help"
                    className="w-5 h-5"
                  />
                  <span>Help</span>
                </a>
              </nav>
              {/* User Email */}
              <div className="hidden md:block text-gray-800 font-medium">
                {session?.user?.email || "USERNAME123@GMAIL.COM"}
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-600 hover:text-blue-900 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="bg-gray-100 py-10 min-h-[calc(100vh-64px)]">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-extrabold text-center text-blue-900 mb-6">
              {t("quotation_title")}
            </h1>
            <p className="text-center text-gray-600 mb-8">
              {t("quotation_subtitle")}
            </p>

            {/* Progress Bar */}
            <div className="flex justify-between items-center mb-10">
              {steps.map((s, index) => (
                <div key={s.id} className="relative flex-1 flex flex-col items-center">
                  <div
                    className={`h-2 w-full absolute top-1/2 -mt-1 ${
                      index < steps.length - 1 ? "bg-gray-300" : "bg-transparent"
                    }`}
                  ></div>
                  <div
                    className={`h-2 w-full absolute top-1/2 -mt-1 ${
                      step > s.id ? "bg-blue-600" : "bg-transparent"
                    }`}
                  ></div>
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-300 z-10 ${
                      step >= s.id ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    {s.id}
                  </div>
                  <span
                    className={`mt-2 text-center text-sm transition-colors duration-300 ${
                      step >= s.id ? "text-blue-800 font-medium" : "text-gray-500"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Form Steps */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {/* Step 1: Plate Number */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-4">
                    {t("step_1_title")}
                  </h2>
                  <p className="text-gray-600 mb-6">{t("step_1_subtitle")}</p>
                  <div className="relative">
                    <input
                      type="text"
                      id="plate"
                      name="plate"
                      value={plate}
                      onChange={handlePlateInput}
                      placeholder={t("step_1_placeholder")}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        plateValidation.isValid === false ? "border-red-500" : "border-gray-300"
                      }`}
                      maxLength="10"
                    />
                    {plateValidation.isValid === false && (
                      <p className="text-red-500 text-sm mt-2">
                        {plateValidation.error}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Car Details */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-4">
                    {t("step_2_title")}
                  </h2>
                  <p className="text-gray-600 mb-6">{t("step_2_subtitle")}</p>

                  <div className="space-y-4">
                    {/* Brand Input */}
                    <div>
                      <label
                        htmlFor="brand"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t("brand")}
                      </label>
                      <div className="relative">
                        <input
                          id="brand"
                          name="brand"
                          type="text"
                          value={brand}
                          onChange={(e) => {
                            setBrand(e.target.value);
                            setBrandSearch(e.target.value);
                            setModel("");
                            setYear("");
                            setBrandValidation({ isValid: null, error: null });
                          }}
                          onFocus={() => setShowBrandDropdown(true)}
                          onBlur={() =>
                            setTimeout(() => setShowBrandDropdown(false), 200)
                          }
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                            brandValidation.isValid === false ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder={t("select_brand")}
                        />
                        {brandValidation.isValid === false && (
                          <p className="text-red-500 text-sm mt-2">
                            {brandValidation.error}
                          </p>
                        )}
                        {showBrandDropdown && availableBrands.length > 0 && (
                          <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto mt-1">
                            {availableBrands.map((b) => (
                              <li
                                key={b}
                                onMouseDown={() => {
                                  setBrand(b);
                                  setBrandSearch(b);
                                  setShowBrandDropdown(false);
                                  setBrandValidation({ isValid: true, error: null });
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                              >
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Model Input */}
                    <div>
                      <label
                        htmlFor="model"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t("model")}
                      </label>
                      <div className="relative">
                        <input
                          id="model"
                          name="model"
                          type="text"
                          value={model}
                          onChange={(e) => {
                            setModel(e.target.value);
                            setModelSearch(e.target.value);
                            setYear("");
                            setModelValidation({ isValid: null, error: null });
                          }}
                          onFocus={() => {
                            if (brand) setShowModelDropdown(true);
                          }}
                          onBlur={() =>
                            setTimeout(() => setShowModelDropdown(false), 200)
                          }
                          disabled={!brand}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                            modelValidation.isValid === false ? "border-red-500" : "border-gray-300"
                          } ${!brand ? "bg-gray-200" : ""}`}
                          placeholder={t("select_model")}
                        />
                        {modelValidation.isValid === false && (
                          <p className="text-red-500 text-sm mt-2">
                            {modelValidation.error}
                          </p>
                        )}
                        {showModelDropdown && availableModels.length > 0 && (
                          <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto mt-1">
                            {availableModels.map((m) => (
                              <li
                                key={m}
                                onMouseDown={() => {
                                  setModel(m);
                                  setModelSearch(m);
                                  setShowModelDropdown(false);
                                  setModelValidation({ isValid: true, error: null });
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                              >
                                {m}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Year Dropdown */}
                    <div>
                      <label
                        htmlFor="year"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t("year")}
                      </label>
                      <select
                        id="year"
                        name="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        disabled={!model}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                          year === "" ? "text-gray-400" : "text-gray-900"
                        } ${!model ? "bg-gray-200" : "border-gray-300"}`}
                      >
                        <option value="">{t("select_year")}</option>
                        {availableYears.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Coverage Type */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-4">
                    {t("step_3_title")}
                  </h2>
                  <p className="text-gray-600 mb-6">{t("step_3_subtitle")}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Comprehensive", "Third-Party, Fire & Theft", "Third-Party"].map(
                      (type) => (
                        <div
                          key={type}
                          onClick={() => setCoverageType(type)}
                          className={`relative p-6 border rounded-xl text-center cursor-pointer transition-all duration-200 ${
                            coverageType === type
                              ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500 shadow-md"
                              : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {coverageType === type && (
                            <svg
                              className="w-6 h-6 text-blue-600 absolute top-2 right-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          )}
                          <h3 className="font-bold text-lg text-blue-900 mb-1">
                            {type}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {t(`coverage_${type.toLowerCase().replace(/ /g, "_")}`)}
                          </p>
                          {isCarOlderThan15Years() && type === "Comprehensive" && (
                            <p className="text-xs text-red-500 mt-2 font-medium">
                              {t("age_warning")}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Additional Protections (Conditional) */}
              {step === 4 && coverageType === "Comprehensive" && (
                <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-4">
                    {t("step_4_title")}
                  </h2>
                  <p className="text-gray-600 mb-6">{t("step_4_subtitle")}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      t("windscreen"),
                      t("natural_disaster"),
                      t("strike_riot"),
                      t("personal_accident"),
                      t("towing"),
                      t("named_driver"),
                      t("all_driver"),
                      t("passengers_coverage"),
                    ].map((label) => (
                      <div
                        key={label}
                        onClick={() => toggleProtection(label)}
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                          protections[label]
                            ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500 shadow-md"
                            : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-700">{label}</span>
                          <input
                            type="checkbox"
                            checked={!!protections[label]}
                            readOnly
                            className="form-checkbox h-5 w-5 text-blue-600 rounded"
                          />
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={() => toggleProtection("None")}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                        protections.None
                          ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500 shadow-md"
                          : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{t("no_addons")}</span>
                        <input
                          type="checkbox"
                          checked={!!protections.None}
                          readOnly
                          className="form-checkbox h-5 w-5 text-blue-600 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Personal Details */}
              {step === 5 && (
                <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-4">
                    {t("step_5_title")}
                  </h2>
                  <p className="text-gray-600 mb-6">{t("step_5_subtitle")}</p>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t("full_name")}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("enter_full_name")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="documentType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("document_type")}
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="documentType"
                            value="ic"
                            checked={documentType === "ic"}
                            onChange={() => setDocumentType("ic")}
                            className="form-radio h-5 w-5 text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">{t("ic_number")}</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="documentType"
                            value="passport"
                            checked={documentType === "passport"}
                            onChange={() => setDocumentType("passport")}
                            className="form-radio h-5 w-5 text-blue-600"
                          />
                          <span className="ml-2 text-gray-700">{t("passport_number")}</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="document"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {documentType === "ic" ? t("ic_number") : t("passport_number")}
                      </label>
                      <input
                        type="text"
                        id="document"
                        name="document"
                        value={documentType === "ic" ? formatICNumber(ic) : passport}
                        onChange={(e) => {
                          if (documentType === "ic") {
                            setIc(e.target.value.replace(/-/g, "").slice(0, 12));
                          } else {
                            setPassport(e.target.value);
                          }
                        }}
                        placeholder={
                          documentType === "ic"
                            ? t("enter_ic_number")
                            : t("enter_passport_number")
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                          (documentType === "ic" && icValidation.isValid === false) ||
                          (documentType === "passport" && passportValidation.isValid === false)
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {documentType === "ic" && icValidation.isValid === false && (
                        <p className="text-red-500 text-sm mt-2">
                          {icValidation.error}
                        </p>
                      )}
                      {documentType === "passport" && passportValidation.isValid === false && (
                        <p className="text-red-500 text-sm mt-2">
                          {passportValidation.error}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="postcode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t("postcode")}
                      </label>
                      <input
                        type="text"
                        id="postcode"
                        name="postcode"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value.slice(0, 5))}
                        placeholder={t("enter_postcode")}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                          postcodeValidation.isValid === false
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        maxLength="5"
                      />
                      {postcodeValidation.isValid === false && (
                        <p className="text-red-500 text-sm mt-2">
                          {postcodeValidation.error}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="ncd"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {t("ncd_rate")}
                      </label>
                      <div className="flex items-center space-x-2">
                        <select
                          id="ncd"
                          name="ncd"
                          value={ncd}
                          onChange={(e) => setNcd(Number(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        >
                          {ncdOptions.map((rate) => (
                            <option key={rate} value={rate}>
                              {rate}%
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={handleCheckNcd}
                          className="px-4 py-3 text-sm rounded-xl font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                        >
                          {t("check_ncd")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Quote Summary */}
              {step === 6 && (
                <div>
                  <h2 className="text-xl font-bold text-blue-900 mb-4">
                    {t("step_6_title")}
                  </h2>
                  <p className="text-gray-600 mb-6">{t("step_6_subtitle")}</p>
                  <div className="bg-blue-50 p-6 rounded-xl space-y-4">
                    <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                      <span className="text-blue-800 font-medium">{t("car_details")}</span>
                      <span className="text-blue-900">
                        {brand} {model} ({year})
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                      <span className="text-blue-800 font-medium">{t("plate_number")}</span>
                      <span className="text-blue-900">{plate}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                      <span className="text-blue-800 font-medium">{t("coverage")}</span>
                      <span className="text-blue-900">{coverageType}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                      <span className="text-blue-800 font-medium">{t("ncd_rate")}</span>
                      <span className="text-blue-900">{ncd}%</span>
                    </div>
                    {coverageType === "Comprehensive" &&
                      Object.keys(protections).length > 0 &&
                      !protections.None && (
                        <div className="border-b border-blue-200 pb-2">
                          <span className="text-blue-800 font-medium">
                            {t("additional_protections")}
                          </span>
                          <ul className="mt-2 space-y-1">
                            {Object.keys(protections).map(
                              (key) =>
                                protections[key] && (
                                  <li key={key} className="text-blue-900 ml-4">
                                    - {key}
                                  </li>
                                )
                            )}
                          </ul>
                        </div>
                      )}

                    <div className="flex flex-col items-center pt-4">
                      <span className="text-sm font-medium text-blue-800">
                        {t("estimated_total_premium")}
                      </span>
                      <span className="text-4xl font-extrabold text-blue-800 mt-2">
                        MYR {estimateRange.min} - MYR {estimateRange.max}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">
                        {t("estimate_note")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Confirmation */}
              {step === 7 && (
                <div className="text-center">
                  <h2 className="text-xl font-bold text-blue-900 mb-2">
                    {t("your_quotation_sent")}
                  </h2>
                  <div className="mt-4 text-3xl font-extrabold text-blue-800">
                    {session?.user?.email || "USERNAME123@GMAIL.COM"}
                  </div>
                  <p className="mt-2 text-gray-600">{t("check_email_for_quote")}</p>
                  <p className="mt-6 text-gray-500">
                    {t("need_help")} <ContactHelp />
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8">
                {step > 1 && step < 7 && (
                  <button
                    onClick={goBack}
                    className="px-8 py-3 rounded-xl font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors duration-150"
                  >
                    {t("back")}
                  </button>
                )}
                {step < 6 && (
                  <button
                    onClick={goNext}
                    disabled={!canProceedFrom(step)}
                    className={`px-8 py-3 rounded-xl font-semibold text-white transition-colors duration-150 ${
                      canProceedFrom(step)
                        ? "bg-blue-800 hover:bg-blue-900"
                        : "bg-blue-300 cursor-not-allowed"
                    }`}
                  >
                    {t("next")}
                  </button>
                )}
                {step === 6 && (
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 rounded-xl font-semibold text-white bg-blue-800 hover:bg-blue-900"
                  >
                    {t("submit_quotation")}
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>

        {/* Plate Validation Pop-up */}
        {showPlateValidation && plateValidationResult && (
          <PlateValidationPopup
            status={getPolicyStatusMessage(plateValidationResult.status)}
            expiryDate={plateValidationResult.expiryDate}
            onClose={handlePlateValidationClose}
            onRenewEarly={handleRenewEarly}
            onTransferOwnership={handleTransferOwnership}
            onProceedAnyway={handlePlateValidationProceed}
          />
        )}
        {showGeranModal && (
          <GeranImageUpload
            isOpen={showGeranModal}
            onClose={() => setShowGeranModal(false)}
            onImageUpload={() => {
              setShowGeranModal(false);
            }}
          />
        )}
      </div>
    </>
  );
}