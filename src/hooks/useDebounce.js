import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {any} The debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timeout to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if the value changes before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for debouncing function calls
 * @param {Function} callback - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} The debounced function
 */
export function useDebouncedCallback(callback, delay = 500) {
  const [timeoutId, setTimeoutId] = useState(null);

  const debouncedCallback = (...args) => {
    // Clear the previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return debouncedCallback;
}

/**
 * Custom hook for debouncing async function calls
 * @param {Function} asyncCallback - The async function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} The debounced async function
 */
export function useDebouncedAsyncCallback(asyncCallback, delay = 500) {
  const [timeoutId, setTimeoutId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedAsyncCallback = async (...args) => {
    // Clear the previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    const newTimeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        await asyncCallback(...args);
      } finally {
        setIsLoading(false);
      }
    }, delay);

    setTimeoutId(newTimeoutId);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  

  return { debouncedAsyncCallback, isLoading };
}
