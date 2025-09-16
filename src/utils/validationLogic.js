// src/utils/validationLogic.js

import { carData } from "../data/carData.js";

// Utility to calculate Levenshtein Distance (measures typos)
function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

export function validateCarMake(input) {
  if (!input) {
    return { isValid: null, message: null, suggestion: null };
  }

  const brands = [...new Set(carData.map((car) => car.make.toLowerCase()))];
  const inputLower = input.toLowerCase();

  // 1. Exact match
  if (brands.includes(inputLower)) {
    return {
      isValid: true,
      
      suggestion: null,
    };
  }

  // 2. Fuzzy match for typo correction
  let bestMatch = null;
  let bestDistance = Infinity;

  for (let brand of brands) {
    const distance = levenshtein(inputLower, brand);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = brand;
    }
  }

  if (bestDistance <= 2) {
    const capitalizedMatch =
      bestMatch.charAt(0).toUpperCase() + bestMatch.slice(1);
    return {
      isValid: false,
      message: `Error Detected. Auto-correct to '${capitalizedMatch}'.`,
      suggestion: capitalizedMatch,
    };
  }

  // 3. Invalid
  return {
    isValid: false,
    message: "Invalid Car Brand. Please type again!",
    suggestion: null,
  };
}

/**
 * Get all unique car brands from the dataset.
 */
export function getUniqueMakes() {
  const makes = carData.map((car) => car.make);
  return [...new Set(makes)].sort();
}

/**
 * Get models for a given make.
 */
export function getModelsForMake(make) {
  if (!make) return [];
  const models = carData
    .filter((car) => car.make.toLowerCase() === make.toLowerCase())
    .map((car) => car.model);
  return [...new Set(models)].sort();
}

/**
 * Get years for a given make and model.
 */
export function getYearsForModel(make, model) {
  if (!make || !model) return [];
  const car = carData.find(
    (c) =>
      c.make.toLowerCase() === make.toLowerCase() &&
      c.model.toLowerCase() === model.toLowerCase()
  );
  return car ? car.years : [];
}

/**
 * Validates a Malaysian vehicle plate number and provides suggestions.
 * @param {string} plateNumber The plate number input by the user.
 * @param {string} state The selected state.
 * @returns {Object} Validation result object with isValid, error, and suggestion.
 */
export function validatePlateNumber(plateNumber, state) {
  // Remove spaces for character count validation
  const cleanedPlateNumber = plateNumber.replace(/\s/g, "");

  // Check if character count exceeds 10
  if (cleanedPlateNumber.length > 10) {
    return {
      isValid: false,
      error: "Plate number cannot exceed 10 characters (excluding spaces).",
      suggestion: null,
    };
  }

  // ... (rest of the existing validation logic)

  return {
    isValid: true,
    error: null,
    suggestion: null,
  };
}

// Validate year for a model (example logic)
export function validateYearForModel(year) {
  if (!year) return { isValid: null, error: null };
  const currentYear = new Date().getFullYear();
  if (year < 1980 || year > currentYear + 1) {
    return {
      isValid: false,
      error: `Year must be between 1980 and ${currentYear + 1}`,
    };
  }
  return { isValid: true, error: null };
}

// Validate engine CC
export function validateEngineCC(engineCC) {
  if (!engineCC) return { isValid: null, error: null };
  if (engineCC < 50 || engineCC > 8000) {
    return {
      isValid: false,
      error: "Engine CC must be between 50 and 8000",
    };
  }
  return { isValid: true, error: null };
}

/**
 * Validates a Malaysian NRIC (IC) number.
 * Format: 6-digit YYMMDD, followed by 2-digit state code, then 4-digit serial number.
 * @param {string} ic The IC number input.
 * @returns {Object} An object with isValid (boolean) and an error message (string).
 */
export function validateIC(ic) {
  if (!ic) {
    return { isValid: null, error: null };
  }
  
  // Remove spaces and hyphens
  const cleanedIC = ic.replace(/[\s-]/g, '');

  // Regex to check for correct Malaysian IC format
  const icRegex = /^(?:\d{6})(?:\d{2})(?:\d{4})$/;

  if (!icRegex.test(cleanedIC)) {
    return { isValid: false, error: 'Invalid IC format. Should be YYMMDD-XX-XXXX.' };
  }

  // Basic check for valid date of birth (e.g., year is not in the future)
  const year = parseInt(cleanedIC.substring(0, 2), 10);
  const month = parseInt(cleanedIC.substring(2, 4), 10);
  const day = parseInt(cleanedIC.substring(4, 6), 10);
  
  const currentYear = new Date().getFullYear();
  const fullYear = year + (year < (currentYear % 100) ? 2000 : 1900);

  if (fullYear > currentYear || month < 1 || month > 12 || day < 1 || day > 31) {
      return { isValid: false, error: 'Invalid date of birth in IC.' };
  }

  return { isValid: true, error: null };
}

/**
 * Validates a Malaysian postcode.
 * @param {string} postcode The postcode input.
 * @returns {Object} An object with isValid (boolean) and an error message (string).
 */
export function validatePostcode(postcode) {
  if (!postcode) {
    return { isValid: null, error: null };
  }

  // Regex to check for a 5-digit Malaysian postcode
  const postcodeRegex = /^\d{5}$/;

  if (!postcodeRegex.test(postcode)) {
    return { isValid: false, error: 'Invalid postcode. Must be 5 digits.' };
  }

  return { isValid: true, error: null };
}

/**
 * Validates a Malaysian phone number.
 * @param {string} phone The phone number input.
 * @returns {Object} An object with isValid (boolean) and an error message (string).
 */
export function validatePhone(phone) {
  if (!phone) {
    return { isValid: null, error: null };
  }

  // Remove spaces, hyphens, and leading +6
  const cleanedPhone = phone.replace(/[\s-]/g, '').replace(/^\+?6?/, '');

  // Regex to check for a 9-10 digit Malaysian phone number
  const phoneRegex = /^(?:1[0-9]{8,9})$/;

  if (!phoneRegex.test(cleanedPhone)) {
    return { isValid: false, error: 'Invalid phone number format. Must start with 1 and be 9-10 digits long.' };
  }

  return { isValid: true, error: null };
}

/**
 * Validates a passport number.
 * Note: Passport formats vary widely. This function performs a basic check
 * for a common length and alphanumeric characters.
 * @param {string} passport The passport number input.
 * @returns {Object} An object with isValid (boolean) and an error message (string).
 */
export function validatePassport(passport) {
  if (!passport) {
    return { isValid: null, error: null };
  }

  // A common passport number length is 6 to 9 alphanumeric characters.
  // We'll use a regex that allows letters and numbers.
  const passportRegex = /^[a-zA-Z0-9]{6,12}$/;

  if (!passportRegex.test(passport)) {
    return { isValid: false, error: 'Invalid passport number. Please check the format.' };
  }

  return { isValid: true, error: null };
}
