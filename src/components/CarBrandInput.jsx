import { useState, useEffect } from "react";
import { validateCarMake } from "../utils/validationLogic"; // adjust path if needed

export default function CarBrandInput({ value, onChange }) {
  const [brandValidation, setBrandValidation] = useState({
    isValid: null,
    message: null,
    suggestion: null,
  });

  useEffect(() => {
    if (value) {
      if (value.toLowerCase().startsWith("toy")) {
        const result = validateCarMake(value);
        setBrandValidation(result);
      } else {
        setBrandValidation({
          isValid: false,
          message: "Invalid Car Brand. Please type again!",
          suggestion: null,
        });
      }
    } else {
      setBrandValidation({ isValid: null, message: null, suggestion: null });
    }
  }, [value]);

  return (
    <div>
      <label className="block text-blue-900 font-semibold mb-2">
        Car Brand:
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Toyota"
        className="w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border border-blue-100 focus:ring-2 focus:ring-blue-400"
      />
      {/* Validation messages */}
      {brandValidation.message && (
        <p
          className={`mt-2 text-sm ${
            brandValidation.isValid
              ? "text-green-600" // valid
              : brandValidation.suggestion
              ? "text-yellow-600" // typo (suggestion)
              : "text-red-500" // invalid
          }`}
        >
          {brandValidation.message}{" "}
          {brandValidation.suggestion && (
            <button
              type="button"
              className="underline text-blue-700 ml-1"
              onClick={() => onChange(brandValidation.suggestion)}
            >
              Apply
            </button>
          )}
        </p>
      )}
         
    </div>
  );
}
