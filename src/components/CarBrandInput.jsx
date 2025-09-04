import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { validateCarMake } from "../utils/validationLogic";

export default function CarBrandInput({ value, onChange }) {
  const [brandValidation, setBrandValidation] = useState({
    isValid: null,
    message: null,
  });
  const [autoCorrected, setAutoCorrected] = useState(false);

  const debouncedValue = useDebounce(value, 500); // wait 500ms after typing stops

  // simple distance function to check if close to "Toyota"
  const isCloseToToyota = (val) => {
    if (!val) return false;
    const lower = val.toLowerCase();
    return lower.includes("toy") || lower === "tyota" || lower === "toyotaa";
  };

  useEffect(() => {
    if (!debouncedValue) {
      setBrandValidation({ isValid: null, message: null });
      setAutoCorrected(false);
      return;
    }

    const lower = debouncedValue.toLowerCase();

    if (lower === "toyota") {
      setBrandValidation({ isValid: true, message: null });
      setAutoCorrected(false);
    } else if (isCloseToToyota(debouncedValue)) {
      // Close enough → auto-correct
      if (!autoCorrected) {
        onChange("Toyota");
        setAutoCorrected(true);
      }
      setBrandValidation({
        isValid: false,
        message: "Error Detected. Auto-correct to 'Toyota'",
      });
    } else {
      // Very wrong → show invalid message
      setBrandValidation({
        isValid: false,
        message: "Invalid Car Brand. Please type again!",
      });
      setAutoCorrected(false); // allow manual edit
    }
  }, [debouncedValue, onChange, autoCorrected]);

  return (
    <div>
      <label className="block text-blue-900 font-semibold mb-2">
        Car Brand:
      </label>
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setAutoCorrected(false); // allow manual edits
        }}
        placeholder="e.g. Toyota"
        className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
      />
      {brandValidation.message && (
        <p
          className={`mt-2 text-sm ${
            brandValidation.message.startsWith("Error Detected")
              ? "text-yellow-600" // auto-correct warning
              : "text-red-500" // invalid
          }`}
        >
          {brandValidation.message}
        </p>
      )}
    </div>
  );
}
