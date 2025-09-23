// src/utils/formatPlate.js
export function formatPlate(rawValue) {
    if (!rawValue) return "";
  
    // Convert to uppercase and remove extra whitespace
    let clean = rawValue.toUpperCase().replace(/\s+/g, "");
  
    // Prevent 'I' and 'O' from being used
    clean = clean.replace(/[IO]/g, "");
  
    // Format with space between letters and numbers
    const formatted = clean
      .replace(/([A-Z]+)(\d+)/, "$1 $2")
      .replace(/(\d+)([A-Z]+)/, "$1 $2");
  
    return formatted.trim();
  }
  