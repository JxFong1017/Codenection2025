import { useState, useEffect } from 'react';
import PlateValidationPopup from './PlateValidationPopup';
import { useDebounce } from '../hooks/useDebounce'; // <-- Correctly import the hook

// Assumed API function
const yourApiFunction = async (plate) => {
  // Replace with your actual API call
  console.log(`Calling API for: ${plate}`);
  // Mock API response
  return {
    type: 'expired',
    title: 'Policy Expired',
    message: `The policy for plate ${plate} expired on 2024-01-01.`,
    canProceed: true,
    showOptions: true,
  };
};

export default function YourFormComponent() {
  const [plate, setPlate] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  // 1. Create a debounced value from the plate state
  const debouncedPlate = useDebounce(plate, 500);

  // 2. Use a useEffect to trigger the API call when the debounced value changes
  useEffect(() => {
    // Only run validation if the debounced string is not empty
    if (debouncedPlate) {
      // Your API call function
      const validatePlate = async () => {
        const result = await yourApiFunction(debouncedPlate);
        setValidationResult(result);
        setIsOpen(true);
      };
      validatePlate();
    }
  }, [debouncedPlate]); // <-- The key: listen to the debounced value

  const handlePlateChange = (e) => {
    // This function only updates the immediate `plate` state
    setPlate(e.target.value.toUpperCase());
  };

  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <input type="text" value={plate} onChange={handlePlateChange} />
      <PlateValidationPopup
        isOpen={isOpen}
        onClose={handleClose}
        validationResult={validationResult}
        // ...other props
      />
    </div>
  );
}