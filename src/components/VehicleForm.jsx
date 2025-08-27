import React, { useState, useEffect } from 'react';
import { 
  validatePlateNumber, 
  malaysianStates, 
  getUniqueMakes, 
  getModelsForMake,
  validateYearForModel,
  validateEngineCC
} from '../utils/validationLogic';
import { vehicleDatabase } from '../data/vehicleDatabase';
import { useDebounce } from '../hooks/useDebounce';

const VehicleForm = () => {
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
    year: { isValid: null, error: null },
    engineCC: { isValid: null, error: null }
  });

  // UI state
  const [availableMakes, setAvailableMakes] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounced plate number for validation
  const debouncedPlateNumber = useDebounce(formData.plateNumber, 500);

  // Initialize available makes on component mount
  useEffect(() => {
    setAvailableMakes(getUniqueMakes(vehicleDatabase));
  }, []);

  // Update available models when make changes
  useEffect(() => {
    if (formData.make) {
      const models = getModelsForMake(formData.make, vehicleDatabase);
      setAvailableModels(models);
      // Reset model selection when make changes
      setFormData(prev => ({ ...prev, model: '' }));
    } else {
      setAvailableModels([]);
    }
  }, [formData.make]);

  // Validate plate number when debounced value changes
  useEffect(() => {
    if (debouncedPlateNumber && formData.state) {
      const result = validatePlateNumber(debouncedPlateNumber, formData.state);
      setValidation(prev => ({
        ...prev,
        plateNumber: result
      }));
    }
  }, [debouncedPlateNumber, formData.state]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation for the changed field
    if (validation[field]) {
      setValidation(prev => ({
        ...prev,
        [field]: { isValid: null, suggestion: null, error: null }
      }));
    }
  };

  // Handle plate number suggestion click
  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({ ...prev, plateNumber: suggestion }));
    setShowSuggestions(false);
  };

  // Validate year when model and year are both selected
  const handleYearChange = (value) => {
    handleInputChange('year', value);
    
    if (value && formData.model) {
      const result = validateYearForModel(parseInt(value), formData.model, vehicleDatabase);
      setValidation(prev => ({
        ...prev,
        year: result
      }));
    }
  };

  // Validate engine CC when model and engine CC are both selected
  const handleEngineCCChange = (value) => {
    handleInputChange('engineCC', value);
    
    if (value && formData.model) {
      const result = validateEngineCC(parseInt(value), formData.model, vehicleDatabase);
      setValidation(prev => ({
        ...prev,
        engineCC: result
      }));
    }
  };

  // Get validation status icon
  const getValidationIcon = (field) => {
    const fieldValidation = validation[field];
    if (!fieldValidation || fieldValidation.isValid === null) return null;
    
    if (fieldValidation.isValid) {
      return <span className="text-green-500 text-xl">✓</span>;
    } else {
      return <span className="text-red-500 text-xl">✗</span>;
    }
  };

  // Get validation message
  const getValidationMessage = (field) => {
    const fieldValidation = validation[field];
    if (!fieldValidation) return null;

    if (field === 'plateNumber' && fieldValidation.suggestion) {
      return (
        <div className="text-yellow-600 text-sm mt-1">
          <span className="font-medium">Did you mean:</span>{' '}
          <button
            onClick={() => handleSuggestionClick(fieldValidation.suggestion)}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {fieldValidation.suggestion}
          </button>
        </div>
      );
    }

    if (fieldValidation.error) {
      return (
        <div className="text-red-600 text-sm mt-1">
          {fieldValidation.error}
        </div>
      );
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const plateValidation = validatePlateNumber(formData.plateNumber, formData.state);
    const yearValidation = formData.year && formData.model 
      ? validateYearForModel(parseInt(formData.year), formData.model, vehicleDatabase)
      : { isValid: true, error: null };
    const engineCCValidation = formData.engineCC && formData.model
      ? validateEngineCC(parseInt(formData.engineCC), formData.model, vehicleDatabase)
      : { isValid: true, error: null };

    setValidation({
      plateNumber: plateValidation,
      year: yearValidation,
      engineCC: engineCCValidation
    });

    // Check if all validations pass
    if (plateValidation.isValid && yearValidation.isValid && engineCCValidation.isValid) {
      console.log('Form submitted successfully:', formData);
      // Here you would typically send the data to your backend
      alert('Vehicle data validated successfully!');
    } else {
      alert('Please fix the validation errors before submitting.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Smart Vehicle Data Validation
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Malaysian Vehicle Registration & Error Detection System
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* State Selection */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <select
            id="state"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a state</option>
            {malaysianStates.map(state => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>

        {/* Plate Number */}
        <div>
          <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Plate Number *
          </label>
          <div className="relative">
            <input
              type="text"
              id="plateNumber"
              value={formData.plateNumber}
              onChange={(e) => handleInputChange('plateNumber', e.target.value)}
              placeholder="e.g., BKV 9429"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <div className="absolute right-3 top-2">
              {getValidationIcon('plateNumber')}
            </div>
          </div>
          {getValidationMessage('plateNumber')}
        </div>

        {/* Make Selection */}
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Make *
          </label>
          <select
            id="make"
            value={formData.make}
            onChange={(e) => handleInputChange('make', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a make</option>
            {availableMakes.map(make => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        {/* Model Selection */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Model *
          </label>
          <select
            id="model"
            value={formData.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={!formData.make}
          >
            <option value="">
              {formData.make ? 'Select a model' : 'Select a make first'}
            </option>
            {availableModels.map(model => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
            Year *
          </label>
          <div className="relative">
            <input
              type="number"
              id="year"
              value={formData.year}
              onChange={(e) => handleYearChange(e.target.value)}
              min="1990"
              max={new Date().getFullYear() + 1}
              placeholder="e.g., 2023"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <div className="absolute right-3 top-2">
              {getValidationIcon('year')}
            </div>
          </div>
          {getValidationMessage('year')}
        </div>

        {/* Engine CC */}
        <div>
          <label htmlFor="engineCC" className="block text-sm font-medium text-gray-700 mb-2">
            Engine Capacity (CC) *
          </label>
          <div className="relative">
            <input
              type="number"
              id="engineCC"
              value={formData.engineCC}
              onChange={(e) => handleEngineCCChange(e.target.value)}
              min="600"
              max="8000"
              placeholder="e.g., 1498"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <div className="absolute right-3 top-2">
              {getValidationIcon('engineCC')}
            </div>
          </div>
          {getValidationMessage('engineCC')}
        </div>

        {/* Color */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <input
            type="text"
            id="color"
            value={formData.color}
            onChange={(e) => handleInputChange('color', e.target.value)}
            placeholder="e.g., Red"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
          >
            Validate & Submit Vehicle Data
          </button>
        </div>
      </form>

      {/* Form Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Form Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <span>Plate Number:</span>
            {validation.plateNumber?.isValid === true && <span className="text-green-600">✓ Valid</span>}
            {validation.plateNumber?.isValid === false && <span className="text-red-600">✗ Invalid</span>}
            {validation.plateNumber?.isValid === null && <span className="text-gray-400">- Not checked</span>}
          </div>
          <div className="flex items-center space-x-2">
            <span>Year:</span>
            {validation.year?.isValid === true && <span className="text-green-600">✓ Valid</span>}
            {validation.year?.isValid === false && <span className="text-red-600">✗ Invalid</span>}
            {validation.year?.isValid === null && <span className="text-gray-400">- Not checked</span>}
          </div>
          <div className="flex items-center space-x-2">
            <span>Engine CC:</span>
            {validation.engineCC?.isValid === true && <span className="text-green-600">✓ Valid</span>}
            {validation.engineCC?.isValid === false && <span className="text-red-600">✗ Invalid</span>}
            {validation.engineCC?.isValid === null && <span className="text-gray-400">- Not checked</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleForm;
