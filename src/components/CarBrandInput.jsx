      import { useState, useEffect } from "react";
      import { useDebounce } from "../hooks/useDebounce";
      import { validateCarMake } from "../utils/validationLogic";

      export default function CarBrandInput({ value, onChange, suggestions }) {
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

          const validate = async () => {
            const validationResult = await validateCarMake(debouncedValue);
            setBrandValidation(validationResult);
          };

          validate();
        }, [debouncedValue]);

        const handleSuggestionClick = (suggestion) => {
          onChange(suggestion);
        };

        return (
          <div>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
            {brandValidation.suggestion && (
              <div
                onClick={() => handleSuggestionClick(brandValidation.suggestion)}
                className="cursor-pointer p-2 hover:bg-gray-200"
              >
                Suggested: {brandValidation.suggestion}
              </div>
            )}
            {brandValidation.isValid === false && (
              <p className="text-red-500 text-sm">{brandValidation.message}</p>
            )}
            {suggestions && suggestions.length > 0 && (
              <ul className="border border-gray-300 rounded-md mt-1">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      }
      