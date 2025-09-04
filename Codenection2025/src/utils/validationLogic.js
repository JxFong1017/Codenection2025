// src/utils/validationLogic.js

// ... (existing regex patterns and code)

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

// ... (rest of the file)