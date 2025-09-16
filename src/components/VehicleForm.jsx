import React, { useState, useEffect } from 'react';
import {
  validatePlateNumber,
  malaysianStates,
  getUniqueMakes,
  getModelsForMake,
  validateYearForModel,
  validateEngineCC,
  validateCarMake
} from '../utils/validationLogic';
import { carData } from '../data/carData.js';
import { useDebounce } from '../hooks/useDebounce';

const VehicleForm = () => {
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [isPlateValid, setIsPlateValid] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    state: '',
    plateNumber: '',
    make: '',
    model: '',
    year: '',
    engineCC: '',
    color: ''
  });

  // Validation state
  const [validation, setValidation] = useState({
    plateNumber: { isValid: null, suggestion: null, error: null },
    make: { isValid: null, message: null, suggestion: null },
    year: { isValid: null, error: null },
    engineCC: { isValid: null, error: null }
  });

  // UI state
  const [availableMakes, setAvailableMakes] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced values for validation
  const debouncedPlateNumber = useDebounce(formData.plateNumber, 500);
  const debouncedMake = useDebounce(formData.make, 500);

  // Effect for validating plate number
  useEffect(() => {
    if (debouncedPlateNumber) {
      const validationResult = validatePlateNumber(debouncedPlateNumber, formData.state);
      setValidation(prev => ({
        ...prev,
        plateNumber: {
          isValid: validationResult.isValid,
          error: validationResult.error,
          suggestion: validationResult.suggestion,
        },
      }));
    }
  }, [debouncedPlateNumber, formData.state]);

  const handleInputChange = (e) => {
  const { name, value } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));

  // Run validation immediately for 'make'
  if (name === 'make') {
    const makeValidation = validateCarMake(value);
    setValidation(prev => ({
      ...prev,
      make: makeValidation
    }));
  }
};


  const handleAutoCorrect = () => {
    if (validation.make.suggestion) {
      const correctedMake = validation.make.suggestion;
      setFormData(prev => ({
        ...prev,
        make: correctedMake,
        model: ''
      }));

      setValidation(prev => ({
        ...prev,
        make: validateCarMake(correctedMake)
      }));

      setAvailableModels(getModelsForMake(correctedMake));
    }
  };

  // Effect for updating available makes
  useEffect(() => {
    setAvailableMakes(getUniqueMakes());
  }, []);

  // Effect for updating models based on make
  useEffect(() => {
    if (formData.make) {
      setAvailableModels(getModelsForMake(formData.make));
    } else {
      setAvailableModels([]);
    }
  }, [formData.make]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check final validation state before submitting
    if (
      validation.plateNumber.isValid &&
      validation.make.isValid &&
      validation.year.isValid &&
      validation.engineCC.isValid
    ) {
      console.log('Form submitted successfully:', formData);
      alert('Form submitted successfully!');
    } else {
      setShowValidationMessage(true);
      alert('Please correct the errors in the form.');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="w-full p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Vehicle Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Car Brand Input */}
                <div className="mb-4">
                  <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                    Car Brand</label>
                  <input
                    type="text"
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border shadow-sm sm:text-sm
                      ${validation.make.isValid === true ? 'border-green-500' : ''}
                      ${validation.make.suggestion ? 'border-orange-500' : ''}
                      ${validation.make.isValid === false && !validation.make.suggestion ? 'border-red-500' : ''}
                  `} 
                    placeholder="e.g. Toyota"
                  />
                  {/* Show validation message */}
                  {validation.make.message && (
                    <div className="mt-2 flex items-center gap-2">
                      <p
                        className={`text-sm font-medium ${
                          validation.make.isValid
                            ? 'text-green-600'
                            : validation.make.suggestion
                            ? 'text-orange-600'
                            : 'text-red-600'
                        }`}
                      >
                        {validation.make.message}
                      </p>

                      {/* Auto-correct button only if suggestion exists */}
                      {validation.make.suggestion && (
                        <button
                          type="button"
                          onClick={handleAutoCorrect}
                          className="px-2 py-1 text-xs text-blue-600 font-semibold bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-200"
                        >
                          Auto-correct
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Other fields (model, year, etc.) */}
                <div className="mb-4">
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                  <select
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    disabled={!formData.make}
                  >
                    <option value="">Select a model</option>
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g. 2022"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="engineCC" className="block text-sm font-medium text-gray-700">Engine CC</label>
                  <input
                    type="number"
                    id="engineCC"
                    name="engineCC"
                    value={formData.engineCC}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Save & Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default VehicleForm;