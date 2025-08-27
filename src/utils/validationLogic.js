// Malaysian vehicle plate number validation and error detection system

// Malaysian state plate number format regex patterns
export const malaysianPlateFormatRegex = {
  selangor: /^B[A-Z]{2}\s[0-9]{4}$/,
  kualaLumpur: /^W[A-Z]{2}\s[0-9]{4}$/,
  johor: /^J[A-Z]{2}\s[0-9]{4}$/,
  perak: /^A[A-Z]{2}\s[0-9]{4}$/,
  kedah: /^K[A-Z]{2}\s[0-9]{4}$/,
  kelantan: /^D[A-Z]{2}\s[0-9]{4}$/,
  terengganu: /^T[A-Z]{2}\s[0-9]{4}$/,
  pahang: /^C[A-Z]{2}\s[0-9]{4}$/,
  negeriSembilan: /^N[A-Z]{2}\s[0-9]{4}$/,
  melaka: /^M[A-Z]{2}\s[0-9]{4}$/,
  pulauPinang: /^P[A-Z]{2}\s[0-9]{4}$/,
  perlis: /^R[A-Z]{2}\s[0-9]{4}$/,
  sabah: /^S[A-Z]{2}\s[0-9]{4}$/,
  sarawak: /^Q[A-Z]{2}\s[0-9]{4}$/,
  labuan: /^L[A-Z]{2}\s[0-9]{4}$/,
  putrajaya: /^F[A-Z]{2}\s[0-9]{4}$/
};

// Common character substitution map for typo correction
export const commonTyposMap = {
  'O': '0', '0': 'O',
  'I': '1', '1': 'I',
  'Z': '2', '2': 'Z',
  'S': '5', '5': 'S',
  'G': '6', '6': 'G',
  'B': '8', '8': 'B'
};

// Malaysian states for dropdown
export const malaysianStates = [
  { value: 'selangor', label: 'Selangor' },
  { value: 'kualaLumpur', label: 'Kuala Lumpur' },
  { value: 'johor', label: 'Johor' },
  { value: 'perak', label: 'Perak' },
  { value: 'kedah', label: 'Kedah' },
  { value: 'kelantan', label: 'Kelantan' },
  { value: 'terengganu', label: 'Terengganu' },
  { value: 'pahang', label: 'Pahang' },
  { value: 'negeriSembilan', label: 'Negeri Sembilan' },
  { value: 'melaka', label: 'Melaka' },
  { value: 'pulauPinang', label: 'Pulau Pinang' },
  { value: 'perlis', label: 'Perlis' },
  { value: 'sabah', label: 'Sabah' },
  { value: 'sarawak', label: 'Sarawak' },
  { value: 'labuan', label: 'Labuan' },
  { value: 'putrajaya', label: 'Putrajaya' }
];

/**
 * Validates Malaysian vehicle plate number format and suggests corrections
 * @param {string} plate - The plate number to validate
 * @param {string} state - The Malaysian state (must match malaysianPlateFormatRegex keys)
 * @returns {Object} Validation result with isValid, suggestion, and normalizedPlate
 */
export function validatePlateNumber(plate, state) {
  if (!plate || !state) {
    return {
      isValid: false,
      suggestion: null,
      normalizedPlate: plate || '',
      error: 'Plate number and state are required'
    };
  }

  // Normalize input: remove whitespace, convert to uppercase
  const normalizedPlate = plate.replace(/\s/g, '').toUpperCase();
  
  // Check if state exists in our regex patterns
  if (!malaysianPlateFormatRegex[state]) {
    return {
      isValid: false,
      suggestion: null,
      normalizedPlate,
      error: 'Invalid state selected'
    };
  }

  // Check if the normalized plate matches the expected format
  const expectedFormat = malaysianPlateFormatRegex[state];
  const formattedPlate = formatPlateNumber(normalizedPlate, state);
  
  if (expectedFormat.test(formattedPlate)) {
    return {
      isValid: true,
      suggestion: null,
      normalizedPlate: formattedPlate,
      error: null
    };
  }

  // Generate suggestions for common mistakes
  const suggestions = generatePlateSuggestions(normalizedPlate, state);
  
  return {
    isValid: false,
    suggestion: suggestions.length > 0 ? suggestions[0] : null,
    normalizedPlate: formattedPlate,
    error: 'Invalid plate number format',
    allSuggestions: suggestions
  };
}

/**
 * Formats plate number according to Malaysian standards (e.g., "BKV9429" -> "BKV 9429")
 * @param {string} plate - The normalized plate number
 * @param {string} state - The Malaysian state
 * @returns {string} Formatted plate number
 */
function formatPlateNumber(plate, state) {
  if (plate.length < 6) return plate;
  
  // Format: First 3 characters, then space, then 4 numbers
  const letters = plate.substring(0, 3);
  const numbers = plate.substring(3, 7);
  
  return `${letters} ${numbers}`;
}

/**
 * Generates suggestions for common plate number mistakes
 * @param {string} plate - The normalized plate number
 * @param {string} state - The Malaysian state
 * @returns {Array} Array of suggested corrections
 */
function generatePlateSuggestions(plate, state) {
  const suggestions = [];
  
  if (plate.length < 6) return suggestions;
  
  // Check for common character substitutions
  const letters = plate.substring(0, 3);
  const numbers = plate.substring(3, 7);
  
  // Generate variations by substituting common typos
  for (const [wrongChar, correctChar] of Object.entries(commonTyposMap)) {
    if (letters.includes(wrongChar)) {
      const correctedLetters = letters.replace(wrongChar, correctChar);
      const correctedPlate = formatPlateNumber(correctedLetters + numbers, state);
      
      if (malaysianPlateFormatRegex[state].test(correctedPlate)) {
        suggestions.push(correctedPlate);
      }
    }
    
    if (numbers.includes(wrongChar)) {
      const correctedNumbers = numbers.replace(wrongChar, correctChar);
      const correctedPlate = formatPlateNumber(letters + correctedNumbers, state);
      
      if (malaysianPlateFormatRegex[state].test(correctedPlate)) {
        suggestions.push(correctedPlate);
      }
    }
  }
  
  // Check if adding/removing space would help
  const withoutSpace = plate.replace(/\s/g, '');
  if (withoutSpace.length === 7) {
    const withSpace = formatPlateNumber(withoutSpace, state);
    if (malaysianPlateFormatRegex[state].test(withSpace)) {
      suggestions.push(withSpace);
    }
  }
  
  // Return unique suggestions, limited to 2
  return [...new Set(suggestions)].slice(0, 2);
}

/**
 * Gets make and model suggestions based on search term using fuzzy search
 * @param {string} searchTerm - The search term for make or model
 * @param {Array} vehicleDatabase - The vehicle database to search
 * @returns {Array} Array of matching make-model pairs
 */
export function getMakeModelSuggestions(searchTerm, vehicleDatabase) {
  if (!searchTerm || !vehicleDatabase) return [];
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  if (normalizedSearch.length < 2) return [];
  
  const suggestions = [];
  const seen = new Set();
  
  // Simple fuzzy search implementation
  for (const vehicle of vehicleDatabase) {
    const makeMatch = vehicle.make.toLowerCase().includes(normalizedSearch);
    const modelMatch = vehicle.model.toLowerCase().includes(normalizedSearch);
    
    if (makeMatch || modelMatch) {
      const key = `${vehicle.make}-${vehicle.model}`;
      if (!seen.has(key)) {
        suggestions.push({
          make: vehicle.make,
          model: vehicle.model,
          relevance: makeMatch && modelMatch ? 3 : (makeMatch ? 2 : 1)
        });
        seen.add(key);
      }
    }
  }
  
  // Sort by relevance (exact matches first, then partial matches)
  return suggestions
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 10); // Limit to 10 suggestions
}

/**
 * Gets unique makes from the vehicle database
 * @param {Array} vehicleDatabase - The vehicle database
 * @returns {Array} Array of unique makes
 */
export function getUniqueMakes(vehicleDatabase) {
  if (!vehicleDatabase) return [];
  
  const makes = [...new Set(vehicleDatabase.map(v => v.make))];
  return makes.sort();
}

/**
 * Gets models for a specific make
 * @param {string} make - The vehicle make
 * @param {Array} vehicleDatabase - The vehicle database
 * @returns {Array} Array of models for the specified make
 */
export function getModelsForMake(make, vehicleDatabase) {
  if (!make || !vehicleDatabase) return [];
  
  const models = vehicleDatabase
    .filter(v => v.make.toLowerCase() === make.toLowerCase())
    .map(v => v.model);
  
  return [...new Set(models)].sort();
}

/**
 * Validates if a year is plausible for a given model
 * @param {number} year - The year to validate
 * @param {string} model - The vehicle model
 * @param {Array} vehicleDatabase - The vehicle database
 * @returns {Object} Validation result with isValid and error message
 */
export function validateYearForModel(year, model, vehicleDatabase) {
  if (!year || !model || !vehicleDatabase) {
    return {
      isValid: false,
      error: 'Year, model, and database are required'
    };
  }
  
  const currentYear = new Date().getFullYear();
  
  // Basic year range validation
  if (year < 1990 || year > currentYear + 1) {
    return {
      isValid: false,
      error: `Year must be between 1990 and ${currentYear + 1}`
    };
  }
  
  // Find the model in the database to get expected year range
  const modelData = vehicleDatabase.find(v => 
    v.model.toLowerCase() === model.toLowerCase()
  );
  
  if (modelData) {
    const expectedYear = modelData.year;
    const yearDiff = Math.abs(year - expectedYear);
    
    if (yearDiff > 5) {
      return {
        isValid: false,
        error: `Year ${year} seems unlikely for ${model} (expected around ${expectedYear})`
      };
    }
  }
  
  return {
    isValid: true,
    error: null
  };
}

/**
 * Validates engine capacity (CC) for a given model
 * @param {number} engineCC - The engine capacity in CC
 * @param {string} model - The vehicle model
 * @param {Array} vehicleDatabase - The vehicle database
 * @returns {Object} Validation result with isValid and error message
 */
export function validateEngineCC(engineCC, model, vehicleDatabase) {
  if (!engineCC || !model || !vehicleDatabase) {
    return {
      isValid: false,
      error: 'Engine CC, model, and database are required'
    };
  }
  
  // Basic CC range validation
  if (engineCC < 600 || engineCC > 8000) {
    return {
      isValid: false,
      error: 'Engine capacity must be between 600cc and 8000cc'
    };
  }
  
  // Find the model in the database to get expected CC range
  const modelData = vehicleDatabase.find(v => 
    v.model.toLowerCase() === model.toLowerCase()
  );
  
  if (modelData) {
    const expectedCC = modelData.engineCC;
    const ccDiff = Math.abs(engineCC - expectedCC);
    const tolerance = expectedCC * 0.3; // 30% tolerance
    
    if (ccDiff > tolerance) {
      return {
        isValid: false,
        error: `Engine capacity ${engineCC}cc seems unusual for ${model} (expected around ${expectedCC}cc)`
      };
    }
  }
  
  return {
    isValid: true,
    error: null
  };
}
