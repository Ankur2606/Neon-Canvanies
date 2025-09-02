
"use client";

import { useState, useEffect, useCallback } from 'react';

// A wrapper for JSON.parse that returns a default value on error.
function safelyParseJSON<T>(json: string | null, defaultValue: T): T {
  if (json === null) {
    return defaultValue;
  }
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    console.warn('Error parsing JSON from localStorage', e);
    return defaultValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? safelyParseJSON(item, initialValue) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    setStoredValue(readValue());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  const setValue = (value: T | ((val: T) => T)) => {
    if (typeof window === 'undefined') {
        console.warn(
            `Tried setting localStorage key “${key}” even though environment is not a client`,
        );
    }

    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };


  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key && e.newValue !== e.oldValue) {
            setStoredValue(readValue());
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
}
