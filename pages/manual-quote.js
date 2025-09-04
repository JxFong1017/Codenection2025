import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useDebounce } from "../src/hooks/useDebounce";
import { validatePlateNumber } from "../src/utils/validationLogic";
import CarBrandInput from "../src/components/CarBrandInput";

export default function ManualQuoteSixStep() {
  const [step, setStep] = useState(1);

  // Step 1
  const [plate, setPlate] = useState("");
  const debouncedPlate = useDebounce(plate, 400);
  const [plateValidation, setPlateValidation] = useState({
    isValid: false,
    error: null,
  });

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
    const base = 1200;
    const brandFactor = brand ? 0 : 100; // encourage filling brand
    const protectionFactor =
      Object.values(protections).filter(Boolean).length * 40;
    const min = base + brandFactor + protectionFactor;
    const max = min + 500;
    return { min, max };
  }, [brand, protections]);

  useEffect(() => {
    if (!debouncedPlate) {
      setPlateValidation({ isValid: false, error: null });
      return;
    }
    const result = validatePlateNumber(debouncedPlate, "default");
    setPlateValidation({ isValid: result.isValid, error: result.error });
  }, [debouncedPlate]);

  const steps = [
    { id: 1, title: "Enter car plate number" },
    { id: 2, title: "Vehicle information" },
    { id: 3, title: "Additional protection" },
    { id: 4, title: "Personal information" },
    { id: 5, title: "Estimated car insurance range" },
    { id: 6, title: "Finish" },
  ];

  const toggleProtection = (k) =>
    setProtections((prev) => ({ ...prev, [k]: !prev[k] }));
  const goNext = () => setStep((s) => Math.min(6, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

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

        <section className="bg-blue-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between md:justify-start md:space-x-10">
            {steps.map((s) => (
              <div key={s.id} className="text-center">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-extrabold ${
                    step === s.id
                      ? "bg-blue-800 text-white"
                      : step > s.id
                      ? "bg-blue-300 text-white"
                      : "bg-blue-200 text-white"
                  }`}
                >
                  {s.id}
                </div>
                <div className="mt-2 text-sm text-blue-900 max-w-[7.5rem] leading-snug">
                  {s.title}
                </div>
              </div>
            ))}
          </div>
        </section>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-8">
            {step === 1 && (
              <div className="text-center">
                <h2 className="text-xl font-bold text-blue-900 mb-6">
                  Please enter your car plate number:
                </h2>
                <div className="flex justify-center">
                  <input
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    className="w-full max-w-md px-6 py-4 bg-blue-50 rounded-xl text-blue-900 text-xl text-center outline-none border border-blue-100 focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. PKD 8381"
                  />
                </div>
                {plate.replace(/\s/g, "").length > 10 && (
                  <p className="mt-3 text-xs text-red-500">
                    Maximum length: 10 characters exclude space
                  </p>
                )}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={goNext}
                    disabled={!canProceedFrom(1)}
                    className={`px-10 py-3 rounded-xl font-semibold text-white ${
                      canProceedFrom(1)
                        ? "bg-blue-800 hover:bg-blue-900"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="text-xl font-bold text-blue-900 mb-6">
                  Car plate number: {plate || "—"}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Car Brand input */}
                  <CarBrandInput value={brand} onChange={setBrand} />

                  {/* Car Model */}
                  <div>
                    <label className="block text-blue-900 font-semibold mb-2">
                      Car Model:
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
                      Manufactured Year:
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
                    Back
                  </button>
                  <button
                    onClick={goNext}
                    className="px-8 py-3 rounded-xl font-semibold text-white bg-blue-800 hover:bg-blue-900"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-6">
                  Select additional protection:
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Windscreen",
                    "Named Driver",
                    "All Driver",
                    "Natural Disaster (Special Perils)",
                    "Strike Riot and Civil Commotion",
                    "Personal Accident",
                    "Towing",
                    "Passengers coverage",
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
                    Back
                  </button>
                  <button
                    onClick={goNext}
                    className="px-8 py-3 rounded-xl font-semibold text-white bg-blue-800 hover:bg-blue-900"
                  >
                    Next
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
                      Car plate number:{" "}
                      <span className="font-normal">{plate || "—"}</span>
                    </div>
                    <div className="text-blue-900 font-bold mb-2">
                      Car Brand:{" "}
                      <span className="font-normal">{brand || "—"}</span>
                    </div>
                    <div className="text-blue-900 font-bold mb-2">
                      Car Model:{" "}
                      <span className="font-normal">{model || "—"}</span>
                    </div>
                    <div className="text-blue-900 font-bold mb-2">
                      Manufactured Year:{" "}
                      <span className="font-normal">{year || "—"}</span>
                    </div>
                    <div className="text-blue-900 font-bold mb-2">
                      NCD:{" "}
                      <button
                        className="underline font-normal"
                        type="button"
                        onClick={() => setNcd(20)}
                      >
                        Check NCD
                      </button>
                    </div>
                  </div>

                  {/* Personal Info (editable) */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-blue-900 font-semibold mb-2">
                        Name as IC:
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-900 font-semibold mb-2">
                        IC:
                      </label>
                      <input
                        value={ic}
                        onChange={(e) => setIc(e.target.value)}
                        className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-900 font-semibold mb-2">
                        Postcode:
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
                    Back
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
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-blue-900">
                    <div className="font-bold">
                      Car plate number:{" "}
                      <span className="font-normal">{plate}</span>
                    </div>
                    <div className="font-bold">
                      Car Brand: <span className="font-normal">{brand}</span>
                    </div>
                    <div className="font-bold">
                      Car Model: <span className="font-normal">{model}</span>
                    </div>
                    <div className="font-bold">
                      Manufactured Year:{" "}
                      <span className="font-normal">{year}</span>
                    </div>
                    <div className="font-bold">
                      NCD: <span className="font-normal">{ncd}%</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-blue-900">
                    <div className="font-bold">
                      Name as IC: <span className="font-normal">{name}</span>
                    </div>
                    <div className="font-bold">
                      IC: <span className="font-normal">{ic}</span>
                    </div>
                    <div className="font-bold">
                      Postcode: <span className="font-normal">{postcode}</span>
                    </div>
                    <div className="font-bold">
                      Estimated Car Insurance Range:{" "}
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
                    Back
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
                  Your insurance quotation
                </h2>
                <p className="text-blue-900">has been sent to</p>
                <div className="mt-4 text-3xl font-extrabold text-blue-800">
                  {name || "username123"}@gmail.com
                </div>
                <p className="mt-6 text-gray-600">
                  If you have any questions, please do not hesitate to{" "}
                  <a href="#" className="underline">
                    contact us
                  </a>
                  .
                </p>
                <div className="mt-8">
                  <Link
                    href="/dashboard"
                    className="inline-block px-10 py-3 rounded-xl font-semibold text-white bg-blue-800 hover:bg-blue-900"
                  >
                    Done
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
