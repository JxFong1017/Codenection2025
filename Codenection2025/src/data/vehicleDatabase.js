// Malaysian vehicle database for validation and suggestions
export const vehicleDatabase = [
  // Proton vehicles
  { plateNumber: "BKV 9429", make: "Proton", model: "Saga", year: 2022, engineCC: 1332, color: "Red" },
  { plateNumber: "WXY 4567", make: "Proton", model: "Persona", year: 2023, engineCC: 1498, color: "White" },
  { plateNumber: "V 1234 BC", make: "Proton", model: "X70", year: 2021, engineCC: 1799, color: "Silver" },
  { plateNumber: "BKV 1234", make: "Proton", model: "Iriz", year: 2020, engineCC: 1332, color: "Blue" },
  { plateNumber: "WXY 7890", make: "Proton", model: "Exora", year: 2019, engineCC: 1597, color: "Black" },
  
  // Perodua vehicles
  { plateNumber: "BKV 5678", make: "Perodua", model: "Myvi", year: 2023, engineCC: 1496, color: "Red" },
  { plateNumber: "WXY 2345", make: "Perodua", model: "Axia", year: 2022, engineCC: 998, color: "White" },
  { plateNumber: "V 5678 BC", make: "Perodua", model: "Bezza", year: 2021, engineCC: 1332, color: "Silver" },
  { plateNumber: "BKV 9012", make: "Perodua", model: "Alza", year: 2020, engineCC: 1496, color: "Blue" },
  { plateNumber: "WXY 6789", make: "Perodua", model: "Ativa", year: 2023, engineCC: 1496, color: "Black" },
  
  // Honda vehicles
  { plateNumber: "BKV 3456", make: "Honda", model: "Civic", year: 2023, engineCC: 1799, color: "Red" },
  { plateNumber: "WXY 0123", make: "Honda", model: "City", year: 2022, engineCC: 1498, color: "White" },
  { plateNumber: "V 9012 BC", make: "Honda", model: "CR-V", year: 2021, engineCC: 1996, color: "Silver" },
  { plateNumber: "BKV 7890", make: "Honda", model: "HR-V", year: 2020, engineCC: 1498, color: "Blue" },
  { plateNumber: "WXY 4567", make: "Honda", model: "Accord", year: 2019, engineCC: 1996, color: "Black" },
  
  // Toyota vehicles
  { plateNumber: "BKV 2345", make: "Toyota", model: "Vios", year: 2023, engineCC: 1496, color: "Red" },
  { plateNumber: "WXY 8901", make: "Toyota", model: "Camry", year: 2022, engineCC: 2487, color: "White" },
  { plateNumber: "V 3456 BC", make: "Toyota", model: "Hilux", year: 2021, engineCC: 2755, color: "Silver" },
  { plateNumber: "BKV 6789", make: "Toyota", model: "Innova", year: 2020, engineCC: 2393, color: "Blue" },
  { plateNumber: "WXY 1234", make: "Toyota", model: "Fortuner", year: 2019, engineCC: 2755, color: "Black" },
  
  // Nissan vehicles
  { plateNumber: "BKV 4567", make: "Nissan", model: "Almera", year: 2023, engineCC: 1198, color: "Red" },
  { plateNumber: "WXY 7890", make: "Nissan", model: "X-Trail", year: 2022, engineCC: 1997, color: "White" },
  { plateNumber: "V 6789 BC", make: "Nissan", model: "Teana", year: 2021, engineCC: 2488, color: "Silver" },
  { plateNumber: "BKV 0123", make: "Nissan", model: "Serena", year: 2020, engineCC: 1997, color: "Blue" },
  { plateNumber: "WXY 3456", make: "Nissan", model: "Navara", year: 2019, engineCC: 2488, color: "Black" },
  
  // Mazda vehicles
  { plateNumber: "BKV 8901", make: "Mazda", model: "CX-5", year: 2023, engineCC: 1998, color: "Red" },
  { plateNumber: "WXY 2345", make: "Mazda", model: "CX-3", year: 2022, engineCC: 1496, color: "White" },
  { plateNumber: "V 0123 BC", make: "Mazda", model: "3", year: 2021, engineCC: 1998, color: "Silver" },
  { plateNumber: "BKV 5678", make: "Mazda", model: "6", year: 2020, engineCC: 1998, color: "Blue" },
  { plateNumber: "WXY 9012", make: "Mazda", model: "CX-8", year: 2019, engineCC: 2191, color: "Black" },
  
  // BMW vehicles
  { plateNumber: "BKV 1234", make: "BMW", model: "3 Series", year: 2023, engineCC: 1998, color: "Red" },
  { plateNumber: "WXY 6789", make: "BMW", model: "5 Series", year: 2022, engineCC: 1998, color: "White" },
  { plateNumber: "V 4567 BC", make: "BMW", model: "X3", year: 2021, engineCC: 1998, color: "Silver" },
  { plateNumber: "BKV 9012", make: "BMW", model: "X5", year: 2020, engineCC: 2993, color: "Blue" },
  { plateNumber: "WXY 3456", make: "BMW", model: "1 Series", year: 2019, engineCC: 1499, color: "Black" },
  
  // Mercedes-Benz vehicles
  { plateNumber: "BKV 7890", make: "Mercedes-Benz", model: "A-Class", year: 2023, engineCC: 1332, color: "Red" },
  { plateNumber: "WXY 0123", make: "Mercedes-Benz", model: "C-Class", year: 2022, engineCC: 1991, color: "White" },
  { plateNumber: "V 8901 BC", make: "Mercedes-Benz", model: "E-Class", year: 2021, engineCC: 1991, color: "Silver" },
  { plateNumber: "BKV 2345", make: "Mercedes-Benz", model: "GLC", year: 2020, engineCC: 1991, color: "Blue" },
  { plateNumber: "WXY 6789", make: "Mercedes-Benz", model: "GLE", year: 2019, engineCC: 2991, color: "Black" }
];

// Vehicle categories for filtering
export const vehicleCategories = {
  local: ["Proton", "Perodua"],
  japanese: ["Honda", "Toyota", "Nissan", "Mazda"],
  european: ["BMW", "Mercedes-Benz", "Volkswagen", "Audi"],
  korean: ["Hyundai", "Kia"],
  chinese: ["Geely", "Chery", "MG"]
};

// Common vehicle colors
export const vehicleColors = [
  "Red", "White", "Black", "Silver", "Blue", "Green", "Yellow", "Orange", "Purple", "Brown", "Grey"
];

// Engine capacity ranges by vehicle type
export const engineCapacityRanges = {
  small: { min: 600, max: 1200, label: "Small (600-1200cc)" },
  medium: { min: 1201, max: 2000, label: "Medium (1201-2000cc)" },
  large: { min: 2001, max: 4000, label: "Large (2001-4000cc)" },
  extraLarge: { min: 4001, max: 8000, label: "Extra Large (4001-8000cc)" }
};
