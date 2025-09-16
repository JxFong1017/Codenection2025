import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { validateCarMake } from "../utils/validationLogic"; // <-- Use the new function

export default function CarBrandInput({ value, onChange }) {
  const [brandValidation, setBrandValidation] = useState({
    isValid: null,
    message: null,
    suggestion: null,
  });

  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    // Only validate if the user has typed something
    if (!debouncedValue) {
      setBrandValidation({ isValid: null, message: null, suggestion: null });
      return;
    }

    const validationResult = validateCarMake(debouncedValue);

    // If there is a suggestion, auto-correct and show a message
    if (validationResult.suggestion) {
      onChange(validationResult.suggestion);
      // The message will be displayed from the state
      setBrandValidation(validationResult);
    } else {
      // If no suggestion, just set the validation state
      setBrandValidation(validationResult);
    }
  }, [debouncedValue, onChange]);

  return (
    <div>
      <label className="block text-blue-900 font-semibold mb-2">
        Car Brand:
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder="e.g. Toyota"
        className={`w-full px-4 py-3 bg-blue-50 rounded-lg text-blue-900 border ${
          brandValidation.isValid === true
            ? "border-green-500"
            : brandValidation.suggestion
            ? "border-yellow-500"
            : brandValidation.isValid === false
            ? "border-red-500"
            : "border-blue-100"
        } focus:ring-2 focus:ring-blue-400`}
      />
      {brandValidation.message && (
        <p
          className={`mt-2 text-sm ${
            brandValidation.isValid
              ? "text-green-600"
              : brandValidation.suggestion
              ? "text-yellow-600" // Use yellow for the typo message
              : "text-red-600" // Use red for the invalid message
          }`}
        >
          {brandValidation.message}
        </p>
      )}
    </div>
  );
}