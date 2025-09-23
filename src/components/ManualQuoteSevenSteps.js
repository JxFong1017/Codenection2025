"use client";

import { useRouter } from "next/router";
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
import DecisionPopup from "./DecisionPopup.jsx";
import { formatPlate } from "../utils/formatPlate";

export default function ManualQuoteSevenStep({ autofillData }) {
  const { data: session } = useSession();
  const t = useT();
  const [step, setStep] = useState(1);
  const { quoteDraft, setQuoteDraft } = useQuote();
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [notification, setNotification] = useState(null);

  const [showDecisionPopup, setShowDecisionPopup] = useState(true);

  const handleDecision = (type) => {
    if (type === "manual") {
      setStep(1);
      setShowDecisionPopup(false);
    } else if (type === "geran") {
      setShowDecisionPopup(false);
      setShowGeranModal(true);
    }
  };

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

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatTyping, setIsChatTyping] = useState(false);

  useEffect(() => {
    const latestBotMessage = chatMessages[chatMessages.length - 1];

    if (latestBotMessage && latestBotMessage.sender === "bot") {
      try {
        // Attempt to parse the bot's reply as JSON
        const data = JSON.parse(latestBotMessage.text);
        if (data.action === "fillForm") {
          // Update the form state with the extracted data
          if (data.plate) setPlate(data.plate);
          if (data.make) setBrand(data.make);
          if (data.model) setModel(data.model);

          // Move to the next step if crucial data is filled
          if (data.plate && data.make && data.model && step < 2) {
            setStep(2);
          }
        }
      } catch (e) {
        // If the reply is not JSON, it's a conversational answer. Do nothing to the form.
        console.log("Bot replied with text, not form data.");
      }
    }
  }, [chatMessages, setPlate, setBrand, setModel, setStep, step]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setChatInput("");
    setIsChatTyping(true);

    try {
      const response = await fetch(
        "https://us-central1-codenection2025-19a07.cloudfunctions.net/chatAssistant",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        }
      );
      const data = await response.json();

      setChatMessages((prev) => [...prev, { text: data.reply, sender: "bot" }]);
    } catch (error) {
      console.error("Failed to fetch from chatbot API:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting right now.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsChatTyping(false);
    }
  };

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

  // NEW EFFECT FOR BRAND AUTO-SELECTION with partial matching
  useEffect(() => {
    if (!debouncedBrandSearch) {
      // If the input is empty, clear validation.
      setBrandValidation({ isValid: null, error: null });
      return;
    }
    const normalizedSearch = debouncedBrandSearch.toLowerCase();
    // 2. Check for an exact case-insensitive match (highest priority)
    const exactMatch = allBrands.find(
      (b) => b.toLowerCase() === normalizedSearch
    );
    if (exactMatch) {
      setBrand(exactMatch);
      setBrandSearch(exactMatch);
      setBrandValidation({ isValid: true, error: null });
      setShowBrandDropdown(false);
      return; // Exit early if we found an exact match
    }
    // 3. Perform a fuzzy search for potential misspellings
    const fuzzyResults = fuse.search(normalizedSearch);

    if (fuzzyResults.length === 1 && fuzzyResults[0].score < 0.3) {
      // If there is ONE and only ONE result, and its score is low enough
      // (indicating a very close fuzzy match), auto-correct and select it.
      const autoCorrectedBrand = fuzzyResults[0].item;
      setBrand(autoCorrectedBrand);
      setBrandSearch(autoCorrectedBrand);
      setBrandValidation({ isValid: true, error: null });
      setShowBrandDropdown(false);
    } else {
      // 4. If no exact match and no strong fuzzy match, it's invalid
      setBrand(""); // Clear the brand state to prevent invalid submissions
      setBrandValidation({
        isValid: false,
        error: "Invalid brand. Please choose from the dropdown list.",
      });
    }
  }, [debouncedBrandSearch, allBrands, fuse]);

  // This useEffect handles both IC and Passport validation
  useEffect(() => {
    if (documentType === "ic") {
      const result = validateIC(debouncedIC);
      setIcValidation(result);
      // Reset passport validation when IC is active
      setPassportValidation({ isValid: null, error: null });
    } else if (documentType === "passport") {
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
      const models = getModelsForMake(brand);
      setAvailableModels(models);
      // Initialize the Fuse instance for the new set of models
      setModelFuse(
        new Fuse(models, {
          keys: [],
          includeScore: true,
          threshold: 0.3, // Adjust for fuzziness
        })
      );
    } else {
      setAvailableModels([]);
      setModelFuse(null); // Clear the Fuse instance if no brand is selected
    }
    setModel("");
    setYear("");
    setModelSearch("");
  }, [brand]);

  const filteredBrands = useMemo(() => {
    if (!brandSearch) {
      return allBrands;
    }
    return allBrands.filter((b) =>
      b.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [brandSearch, allBrands]);

  // Add a new useEffect to filter models based on the search input
  const filteredModels = useMemo(() => {
    if (!modelSearch) {
      return availableModels;
    }
    return availableModels.filter((m) =>
      m.toLowerCase().includes(modelSearch.toLowerCase())
    );
  }, [modelSearch, availableModels]);

  // --- NEW EFFECT FOR MODEL AUTO-SELECTION with partial matching ---
  useEffect(() => {
    if (!debouncedModelSearch || !modelFuse) {
      setModelValidation({ isValid: null, error: null });
      return;
    }
    const normalizedSearch = debouncedModelSearch.toLowerCase();
    // 2. Check for an exact case-insensitive match (highest priority)
    const exactMatch = availableModels.find(
      (m) => m.toLowerCase() === normalizedSearch
    );
    if (exactMatch) {
      setModel(exactMatch);
      setModelSearch(exactMatch);
      setModelValidation({ isValid: true, error: null });
      setShowModelDropdown(false);
      return; // Exit early if we found an exact match
    }
    // 3. Perform a fuzzy search for potential misspellings
    const fuzzyResults = modelFuse.search(normalizedSearch);
    if (fuzzyResults.length === 1 && fuzzyResults[0].score < 0.3) {
      // If there is ONE and only ONE strong fuzzy match, auto-correct and select it.
      const autoCorrectedModel = fuzzyResults[0].item;
      setModel(autoCorrectedModel);
      setModelSearch(autoCorrectedModel);
      setModelValidation({ isValid: true, error: null });
      setShowModelDropdown(false);
    } else {
      // 4. If no exact match and no strong fuzzy match, it's invalid
      setModel("");
      if (debouncedModelSearch.length > 0) {
        setModelValidation({
          isValid: false,
          error: "Invalid model. Please choose from the dropdown list.",
        });
      } else {
        setModelValidation({ isValid: null, error: null });
      }
    }
  }, [debouncedModelSearch, availableModels, modelFuse]);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);
    if (!session?.user?.email) {
      setNotification({
        type: "error",
        message: "You must be signed in to submit a quote.",
      });
      return;
    }
    const selectedCar = carData.find(
      (car) => car.make === brand && car.model === model
    );

    // Defensive check to ensure a valid car was found
    if (!selectedCar) {
      setNotification({
        type: "error",
        message: "Please select a valid car brand and model.",
      });
      setIsSubmitting(false);
      return;
    }
    const { engineCapacity, marketValue } = selectedCar;

    // Calculate the current market value
    const carAge = new Date().getFullYear() - parseInt(year, 10);
    const depreciationFactor = Math.max(0.3, Math.pow(0.9, carAge));
    const currentMarketValue = parseFloat(
      (marketValue * depreciationFactor).toFixed(2)
    );

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
        engineCapacity: engineCapacity,
        marketValue: currentMarketValue,
      },
      coverage: {
        type: coverageType,
        protections: coverageType === "Comprehensive" ? protections : null,
      },
      estimatedPremium: estimateRange,
      email: session.user.email,
      timezoneOffset: new Date().getTimezoneOffset(),
    };

    try {
      const response = await fetch("/api/generate-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotationData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNotification({
          type: "success",
          message: "Quotation email sent successfully!",
        });
        goNext();
      } else {
        setNotification({
          type: "error",
          message: `Failed to generate quotation: ${
            result.error || "Unknown error"
          }`,
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: `Something went wrong: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const router = useRouter();
  const handleDoneClick = async () => {
    try {
      
      router.push("/dashboard"); // Redirect to dashboard
    } catch (e) {
      console.error("Error adding document: ", e);
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
      // Add the regular expression check for valid characters.
    const plateHasOnlyValidChars = /^[a-zA-Z0-9\s]*$/.test(plate);
    const plateHasNoRestrictedChars = !/[iIoO]/.test(plate); // New condition
      return (
        plateValidation.isValid &&
        plate.trim() !== "" &&
        plate.replace(/\s/g, "").length <= 10 &&
        plateHasOnlyValidChars && plateHasNoRestrictedChars // Add new condition here
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
        documentType === "ic"
          ? icValidation.isValid
          : passportValidation.isValid;
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
    const formatted = formatPlate(e.target.value);
    setPlate(formatted);
    setQuoteDraft((prev) => ({ ...prev, plate: formatted }));
  };

  const [formInput, setFormInput] = useState({
    plate: "",
    brand: "",
    model: "",
    year: "",
    nric: "",
    passport: "",
    postcode: "",
    phone: "",
    email: "",
    ...quoteDraft,
  });

  useEffect(() => {
    if (debouncedPlate) {
      const { isValid, error } = validatePlateNumber(debouncedPlate);
      setPlateValidation({ isValid, error });

      if (isValid) {
        const checkResult = checkExistingPolicy(debouncedPlate);

        if (checkResult && checkResult.exists) {
          // Change this line
          setPlateValidationResult(getPolicyStatusMessage(checkResult));
          setShowPlateValidation(true);
        } else {
          setQuoteDraft((prev) => {
            if (!prev.fromGeran) {
              return { ...prev, plate: debouncedPlate };
            }
            return prev;
          });
        }
      }
    }
  }, [debouncedPlate, setQuoteDraft]);

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

// Step 1: Autofill plate + brand first
useEffect(() => {
  if (autofillData) {
    const formattedPlate = formatPlate(autofillData.plateNumber);

    setQuoteDraft((prev) => ({
      ...prev,
      plate: formattedPlate || "",
      brand: autofillData.make || "",
      fromGeran: true,
    }));

    setPlate(formattedPlate || "");
    setBrandSearch(autofillData.make || "");
    setBrand(autofillData.make || "");

    setStep(2);
  }
}, [autofillData]);

// Step 2: Once brand is ready, then set model
useEffect(() => {
  if (brand && autofillData) {
    setModelSearch(autofillData.model || "");
    setModel(autofillData.model || "");
  }
}, [brand, autofillData]);

// Step 3: Once model is ready, then set year
useEffect(() => {
  if (model && autofillData) {
    setYear(autofillData.year || "");
  }
}, [model, autofillData]);



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
                  />
                  <span>Get Quotation</span>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-900"
                >
                  <NextImage
                    src="/images/notification.png"
                    alt="Notifications"
                    width={20}
                    height={20}
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
            <NextImage
              src="/images/car-picture-1.jpg"
              alt="Car Left"
              width={130}
              height={80}
              className="w-130 h-auto mr-90 opacity-100 mt-120"
            />
            <NextImage
              src="/images/car-picture-2.jpg"
              alt="Car Right"
              width={120}
              height={75}
              className="w-120 h-auto ml-90 opacity-100 mt-120"
            />
          </div>

          {notification && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                notification.type === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              } border`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {/* Icon: Heroicon name: solid/x-circle for error, check-circle for success */}
                  <svg
                    className={`h-5 w-5 ${
                      notification.type === "error"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    {notification.type === "error" ? (
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    ) : (
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    )}
                  </svg>
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      notification.type === "error"
                        ? "text-red-800"
                        : "text-green-800"
                    }`}
                  >
                    {notification.message}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      onClick={() => setNotification(null)}
                      className={`inline-flex rounded-md p-1.5 ${
                        notification.type === "error"
                          ? "bg-red-50 text-red-500 hover:bg-red-100"
                          : "bg-green-50 text-green-500 hover:bg-green-100"
                      }`}
                    >
                      <span className="sr-only">Dismiss</span>
                      {/* Heroicon name: solid/x */}
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    disabled={showPlateConfirm}
                  />
                </div>

                {plate.replace(/\s/g, "").length > 10 && (
                  <p className="mt-3 text-xs text-red-500">
                    {t("plate_max_length")}
                  </p>
                )}
                
                {/* New validation for symbols */}
                {!/^[a-zA-Z0-9\s]*$/.test(plate) && plate.length > 0 && (
                <p className="mt-3 text-xs text-red-500">
                Please use only letters and numbers.
                </p>
                )}

                {/* New validation for 'I' and 'O' */}
                {/^[a-zA-Z\s]*[iIoO][a-zA-Z0-9\s]*$/.test(plate) && (
                <p className="mt-3 text-xs text-red-500">
               Did you mean to use numbers '1' or '0'? Letters 'I' and 'O' are not allowed.
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
                  {t("Car Plate Number: ")} {quoteDraft.plate || "—"}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Car Brand */}
                  <div className="relative">
                    <label className="block text-blue-900 font-semibold mb-2">
                      {t("Car Brand:")}
                    </label>
                    <input
                      type="text"
                      value={brandSearch}
                      onChange={(e) => {
                        setBrandSearch(e.target.value);
                        setBrand("");
                        setShowBrandDropdown(true);
                      }}
                      onFocus={() => setShowBrandDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowBrandDropdown(false), 200)
                      }
                      className={`w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border ${
                        brandValidation.isValid
                          ? "border-green-500"
                          : brandValidation.isValid === false
                          ? "border-red-500"
                          : "border-blue-100"
                      } focus:ring-2 focus:ring-blue-400`}
                      placeholder="Type to search..."
                      autoComplete="off"
                    />
                    {brandValidation.error && (
                      <p className="mt-2 text-sm text-red-600">
                        {brandValidation.error}
                      </p>
                    )}
                    {showBrandDropdown && filteredBrands.length > 0 && (
                      <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                        {filteredBrands.map((b) => (
                          <li
                            key={b}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setBrand(b);
                              setBrandSearch(b);
                              setShowBrandDropdown(false);
                            }}
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Car Model */}
                  <div className="relative">
                    <label className="block text-blue-900 font-semibold mb-2">
                      {t("Car Model:")}
                    </label>
                    <input
                      type="text"
                      value={modelSearch}
                      onChange={(e) => {
                        setModelSearch(e.target.value);
                        // only clear model if user manually types something different
                        if (e.target.value !== model) {
                          setModel("");
                        }
                        setShowModelDropdown(true);
                      }}
                      disabled={!brand}
                      onFocus={() => setShowModelDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowModelDropdown(false), 200)
                      }
                      className={`w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border ${
                        modelValidation.isValid === true
                          ? "border-green-500"
                          : modelValidation.isValid === false
                          ? "border-red-500"
                          : "border-blue-100"
                      } focus:ring-2 focus:ring-blue-400`}
                      placeholder="Type to search..."
                      disabled={!brand}
                      autoComplete="off"
                    />
                    {modelValidation.error && (
                      <p className="mt-2 text-sm text-red-600">
                        {modelValidation.error}
                      </p>
                    )}
                    {showModelDropdown && filteredModels.length > 0 && (
                      <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                        {filteredModels.map((m) => (
                          <li
                            key={m}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                            onMouseDown={(e) => {
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

                  {/* Manufactured Year */}
                  <div>
                    <label className="block text-blue-900 font-semibold mb-2">
                      {t("manufactured_year")}
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
                      disabled={!model}
                    >
                      <option value="">Select year</option>
                      {availableYears
                        .sort((a, b) => b - a)
                        .map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                    </select>
                    {isCarOlderThan15Years() && (
                      <p className="mt-2 text-red-500 font-normal text-center">
                        Your car is older than 15 years. Coverage may be limited
                        or require special inspection.
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
                  Choose Your Coverage Type
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Third-Party Only Option */}
                  <label
                    className={`flex items-center space-x-3 p-4 rounded-lg border border-blue-200 hover:bg-blue-50 cursor-pointer shadow-sm ${
                      coverageType === "Third-Party Only"
                        ? "bg-blue-50 border-blue-800"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="coverageType"
                      value="Third-Party Only"
                      checked={coverageType === "Third-Party Only"}
                      onChange={(e) => setCoverageType(e.target.value)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900">
                        Third-Party Only
                      </h3>
                      <p className="text-sm text-gray-600">
                        Covers damages to other parties&apos; vehicles or
                        property.
                      </p>
                      {/* Conditional message for Third-Party Only */}
                      {coverageType === "Third-Party Only" && (
                        <p className="text-sm text-red-500 mt-1">
                          No additional protection available.
                        </p>
                      )}
                    </div>
                  </label>

                  {/* Third-Party, Fire & Theft Option */}
                  <label
                    className={`flex items-center space-x-3 p-4 rounded-lg border border-blue-200 hover:bg-blue-50 cursor-pointer shadow-sm ${
                      coverageType === "Third-Party, Fire & Theft"
                        ? "bg-blue-50 border-blue-800"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="coverageType"
                      value="Third-Party, Fire & Theft"
                      checked={coverageType === "Third-Party, Fire & Theft"}
                      onChange={(e) => setCoverageType(e.target.value)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900">
                        Third-Party, Fire & Theft
                      </h3>
                      <p className="text-sm text-gray-600">
                        Includes Third-Party coverage plus protection against
                        fire and theft.
                      </p>
                      {/* Conditional message for Third-Party, Fire & Theft */}
                      {coverageType === "Third-Party, Fire & Theft" && (
                        <p className="text-sm text-red-500 mt-1">
                          No additional protection available.
                        </p>
                      )}
                    </div>
                  </label>

                  {/* Comprehensive Option */}
                  <label
                    className={`flex items-center space-x-3 p-4 rounded-lg border border-blue-200 hover:bg-blue-50 cursor-pointer shadow-sm ${
                      coverageType === "Comprehensive"
                        ? "bg-blue-50 border-blue-800"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="coverageType"
                      value="Comprehensive"
                      checked={coverageType === "Comprehensive"}
                      onChange={(e) => setCoverageType(e.target.value)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900">
                        Comprehensive
                      </h3>
                      <p className="text-sm text-gray-600">
                        The highest level of protection, covering damage to your
                        vehicle, third parties, fire, and theft.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={goBack}
                    className="px-8 py-3 rounded-xl font-semibold border border-blue-200 text-blue-900 hover:bg-blue-50"
                  >
                    {t("back")}
                  </button>
                  <button
                    onClick={() => {
                      if (coverageType === "Comprehensive") {
                        setStep(step + 1); // Move to the next step
                      } else {
                        // For other coverage types, skip to step 5 (assuming step 4 is add-ons)
                        setStep(5);
                      }
                    }}
                    disabled={!coverageType}
                    className={`px-8 py-3 rounded-xl font-semibold text-white ${
                      coverageType
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
                <h2 className="text-xl font-bold text-blue-900 mb-6">
                  {t("select_additional_protection")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Add the "None" checkbox here */}
                  <label
                    key="None"
                    className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer ${
                      protections.None ? "bg-blue-100" : ""
                    }`}
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
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                        protections[label] ? "bg-blue-100" : "hover:bg-blue-50"
                      } ${
                        protections.None ? "opacity-50 cursor-not-allowed" : ""
                      }`}
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
                    // Change `canProceedFrom(3)` to `canProceedFrom(4)`
                    disabled={!canProceedFrom(4)}
                    className={`px-8 py-3 rounded-xl font-semibold text-white ${
                      canProceedFrom(4)
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
                  {/* Vehicle Info (read-only) */}
                  <div>
                    <div className="text-blue-900 font-bold mb-2">
                      {t("Car Plate Number:")}{" "}
                      <span className="font-normal">{plate || "—"}</span>
                    </div>
                    <div className="text-blue-900 font-bold mb-2">
                      {t("car_brand")}{" "}
                      <span className="font-normal">{brand || "—"}</span>
                    </div>
                    <div className="text-blue-900 font-bold mb-2">
                      {t("car_model")}
                      {": "}
                      <span className="font-normal">{model || "—"}</span>
                    </div>
                    <div className="text-blue-900 font-bold mb-2">
                      {t("manufactured_year")}{" "}
                      <span className="font-normal">{year || "—"}</span>
                    </div>

                    {/* New: Display Coverage Type */}
                    <div className="text-blue-900 font-bold mb-2">
                      Type of Coverage:{" "}
                      <span className="font-normal">{coverageType || "—"}</span>
                    </div>

                    {/* New: Display Additional Protection (conditionally) */}
                    {coverageType === "Comprehensive" && (
                      <div className="text-blue-900 font-bold mb-2">
                        Additional Protection:{" "}
                        <span className="font-normal">
                          {Object.keys(protections).length > 0 &&
                          !protections.None
                            ? Object.keys(protections).join(", ")
                            : "None"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Personal Info (editable) */}
                  <div className="space-y-4">
                    {/* NCD Section (Moved to be the first item in the personal info column) */}
                    <div>
                      <label className="block text-blue-900 font-semibold mb-2">
                        {t("Select Your Next NCD:")}
                        <span className="font-normal ml-2">
                          (Unsure?{" "}
                          <button
                            className="underline"
                            type="button"
                            onClick={handleCheckNcd}
                          >
                            Click here to check your NCD
                          </button>
                          )
                        </span>
                      </label>
                      <select
                        value={ncd}
                        onChange={(e) => setNcd(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
                      >
                        <option value={0}>0%</option>
                        <option value={25}>25%</option>
                        <option value={30}>30%</option>
                        <option value={38.3}>38.3%</option>
                        <option value={45}>45%</option>
                        <option value={55}>55%</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-blue-900 font-semibold mb-2">
                        {t("Full Name: ")}
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
                            setPassport("");
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
                            setIc("");
                          }}
                        />
                        <span className="ml-2 text-blue-900">Passport</span>
                      </label>
                    </div>

                    {documentType === "ic" ? (
                      <div className="mb-4">
                        <label className="block text-blue-900 font-semibold mb-2">
                          NRIC (IC):
                        </label>
                        <input
                          type="text"
                          value={ic}
                          onChange={(e) => {
                            const formattedIC = formatICNumber(e.target.value);
                            setIc(formattedIC);
                          }}
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
                          <p className="mt-2 text-sm text-red-600">
                            {icValidation.error}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mb-4">
                        <label className="block text-blue-900 font-semibold mb-2">
                          Passport Number:
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
                          <p className="mt-2 text-sm text-red-600">
                            {passportValidation.error}
                          </p>
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
                        <p className="mt-2 text-sm text-red-600">
                          {postcodeValidation.error}
                        </p>
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

            {step === 6 && (
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
                      {t("car_model")}
                      {": "}
                      <span className="font-normal">{model}</span>
                    </div>
                    <div className="font-bold">
                      {t("manufactured_year")}{" "}
                      <span className="font-normal">{year}</span>
                    </div>
                    <div className="font-bold">
                      {t("ncd")} <span className="font-normal">{ncd}%</span>
                    </div>

                    {/* New: Display Coverage Type */}
                    <div className="font-bold">
                      Type of Coverage:{" "}
                      <span className="font-normal">{coverageType || "—"}</span>
                    </div>

                    {/* New: Display Additional Protection (conditionally) */}
                    {coverageType === "Comprehensive" && (
                      <div className="font-bold">
                        Additional Protection:{" "}
                        <span className="font-normal">
                          {Object.keys(protections).length > 0 &&
                          !protections.None
                            ? Object.keys(protections).join(", ")
                            : "None"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 text-blue-900">
                    <div className="font-bold">
                      {t("name_as_ic_field")}{" "}
                      <span className="font-normal">{name}</span>
                    </div>
                    <div className="font-bold">
                      {t("ic")}{" "}
                      <span className="font-normal">
                        {documentType === "ic" ? ic : passport}
                      </span>
                    </div>
                    <div className="font-bold">
                      {t("postcode")}{" "}
                      <span className="font-normal">{postcode}</span>
                    </div>
                    <div className="font-bold">
                      {t("estimated_range")}{" "}
                      <span className="font-normal">
                        {/* The corrected display logic */}
                        {estimateRange.min === estimateRange.max
                          ? `RM${estimateRange.min}`
                          : `RM${estimateRange.min}-RM${estimateRange.max}`}
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
                    onClick={handleSubmit} /* Updated this line */
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-xl font-semibold text-white ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-800 hover:bg-blue-900"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            )}
            {step === 7 && (
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
                  <button
                  onClick={handleDoneClick}
                    className="inline-block px-10 py-3 rounded-xl font-semibold text-white bg-blue-800 hover:bg-blue-900"
                  >
                    {t("done")}
                    </button>
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