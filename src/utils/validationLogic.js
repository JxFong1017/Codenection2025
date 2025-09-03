// src/utils/validationLogic.js

// utils/validationLogic.js
import { vehicleDatabase } from "../data/vehicleDatabase";

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

  const brands = vehicleDatabase.map((car) => car.make.toLowerCase());
  const inputLower = input.toLowerCase();

  // ✅ 1. Exact match (valid brand)
  if (brands.includes(inputLower)) {
    return {
      isValid: true,
      message: "Valid Car Brand ✅",
      suggestion: null,
    };
  }

  // ✅ 2. Check for typo (Levenshtein distance ≤ 2)
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
    // close enough to be a typo
    return {
      isValid: false,
      message: `Error Detected. Auto-correct to '${bestMatch.charAt(0).toUpperCase() + bestMatch.slice(1)}'.`,
      suggestion: bestMatch.charAt(0).toUpperCase() + bestMatch.slice(1),
    };
  }

  // ✅ 3. Completely invalid
  return {
    isValid: false,
    message: "Invalid Car Brand. Please type again!",
    suggestion: null,
  };
}



/**
 * Validates a Malaysian vehicle plate number and provides suggestions.
 * @param {string} plateNumber The plate number input by the user.
 * @param {string} state The selected state.
 * @returns {Object} Validation result object with isValid, error, and suggestion.
 */
export function validatePlateNumber(plateNumber, state) {
  // Remove spaces for character count validation
  const cleanedPlateNumber = plateNumber.replace(/\s/g, '');

  // Check if character count exceeds 10
  if (cleanedPlateNumber.length > 10) {
    return {
      isValid: false,
      error: 'Plate number cannot exceed 10 characters (excluding spaces).',
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

// Get all unique car brands
export function getUniqueMakes() {
  const makes = vehicleDatabase.map(car => car.make);
  return [...new Set(makes)]; // remove duplicates
}

// Get models for a given make
export function getModelsForMake(make) {
  return vehicleDatabase
    .filter(car => car.make.toLowerCase() === make.toLowerCase())
    .map(car => car.model);
}

// Validate year for a model (example logic)
export function validateYearForModel(year) {
  if (!year) return { isValid: null, error: null };
  const currentYear = new Date().getFullYear();
  if (year < 1980 || year > currentYear + 1) {
    return { isValid: false, error: `Year must be between 1980 and ${currentYear + 1}` };
  }
  return { isValid: true, error: null };
}

// Validate engine CC
export function validateEngineCC(engineCC) {
  if (!engineCC) return { isValid: null, error: null };
  if (engineCC < 50 || engineCC > 8000) {
    return { isValid: false, error: "Engine CC must be between 50 and 8000" };
  }
  return { isValid: true, error: null };
}

