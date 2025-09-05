import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useDebounce } from "../src/hooks/useDebounce";
import { validatePlateNumber } from "../src/utils/validationLogic";
import CarBrandInput from "../src/components/CarBrandInput";
import { useQuote } from "../src/context/QuoteContext";
import { useT } from "../src/utils/i18n";
import {
  checkExistingPolicy,
  getPolicyStatusMessage,
} from "../src/data/insuranceDatabase";
import PlateValidationPopup from "../src/components/PlateValidationPopup";

export default function ManualQuoteSixStep() {
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

  const [showPlateConfirm, setShowPlateConfirm] = useState(false);
  const [showPlateValidation, setShowPlateValidation] = useState(false);
  const [plateValidationResult, setPlateValidationResult] = useState(null);

  // Step 2
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  // Step 3
  const [protections, setProtections] = useState({});

  // Step 4
  const [name, setName] = useState("");
  const [ic, setIc] = useState("");
  const [postcode, setPostcode] = useState("");
  const [ncd, setNcd] = useState(20);

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

  const steps = [
    { id: 1, title: t("steps_1") },
    { id: 2, title: t("steps_2") },
    { id: 3, title: t("steps_3") },
    { id: 4, title: t("steps_4") },
    { id: 5, title: t("steps_5") },
    { id: 6, title: t("steps_6") },
  ];

  const toggleProtection = (k) =>
    setProtections((prev) => ({ ...prev, [k]: !prev[k] }));
  const goNext = () => setStep((s) => Math.min(6, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

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
    if (currentStep === 1)
      return (
        plateValidation.isValid &&
        plate.trim() !== "" &&
        plate.replace(/\s/g, "").length <= 10
      );
    if (currentStep === 2) return brand && model && year;
    if (currentStep === 3) return true;
    if (currentStep === 4) return name && ic && postcode;
    if (currentStep === 5) return true;
    return true;
  };

  return (
    <>
      <Head>
        <title>Manual Quote - 6 Steps</title>
      </Head>
      <div className="min-h-screen bg-white">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-900">
              CGS
            </Link>
            <div className="text-sm font-medium px-3 py-1 rounded bg-black text-white">
              USERNAME123@GMAIL.COM
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
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    className="w-full max-w-md px-6 py-4 bg-blue-50 rounded-xl text-blue-900 text-xl text-center outline-none border border-blue-100 focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. PKD 8381"
                    disabled={showPlateConfirm} // ← disable when confirmation is showing
                  />
                </div>
                {plate.replace(/\s/g, "").length > 10 && (
                  <p className="mt-3 text-xs text-red-500">
                    Maximum length: 10 characters exclude space
                  </p>
                )}
                <div className="flex justify-between mt-8 max-w-md mx-auto">
                  <Link
                    href="/"
                    className="px-6 py-3 rounded-xl font-semibold border border-blue-200 text-blue-900 hover:bg-blue-50"
                  >
                    {t("back")} to Landing Page
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
                    {t("next")}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="text-xl font-bold text-blue-900 mb-6">
                  {t("car_plate_number")} {plate || "—"}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Car Brand input */}
                  <CarBrandInput value={brand} onChange={setBrand} />

                  {/* Car Model */}
                  <div>
                    <label className="block text-blue-900 font-semibold mb-2">
                      {t("car_model")}
                    </label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Select model</option>
                      <option value="Vios">Vios</option>
                      <option value="Yaris">Yaris</option>
                      <option value="Corolla">Corolla</option>
                    </select>
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
                    >
                      <option value="">Select year</option>
                      {Array.from({ length: 25 }, (_, i) => 2025 - i).map(
                        (y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        )
                      )}
                    </select>
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
                    className="px-8 py-3 rounded-xl font-semibold text-white bg-blue-800 hover:bg-blue-900"
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
                    className="px-8 py-3 rounded-xl font-semibold text-white bg-blue-800 hover:bg-blue-900"
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
                      {t("car_plate_number")}{" "}
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
                        {t("name_as_ic_field")}
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-900 font-semibold mb-2">
                        {t("ic")}
                      </label>
                      <input
                        value={ic}
                        onChange={(e) => setIc(e.target.value)}
                        className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-900 font-semibold mb-2">
                        {t("postcode")}
                      </label>
                      <input
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
                      />
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
                <p className="text-blue-900">has been sent to</p>
                <div className="mt-4 text-3xl font-extrabold text-blue-800">
                  {name || "username123"}@gmail.com
                </div>
                <p className="mt-6 text-gray-600">{t("contact_us_help")}</p>
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
