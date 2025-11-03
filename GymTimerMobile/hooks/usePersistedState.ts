import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UsePersistedStateOptions<T> = {
  key: string;
  defaultValue: T;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
};

/**
 * Persisted state hook using AsyncStorage
 * Automatically saves and loads state from AsyncStorage
 */
export const usePersistedState = <T,>({
  key,
  defaultValue,
  serializer = JSON.stringify,
  deserializer = JSON.parse,
}: UsePersistedStateOptions<T>) => {
  const [state, setState] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  // Load state from AsyncStorage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        if (storedValue !== null) {
          const parsedValue = deserializer(storedValue);
          setState(parsedValue);
        }
      } catch (error) {
        console.error(`Error loading state for key ${key}:`, error);
        // Keep default value on error
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, [key, deserializer]);

  // Save state to AsyncStorage whenever it changes
  const setPersistedState = useCallback(
    async (value: T | ((prev: T) => T)) => {
      try {
        const newValue = typeof value === 'function' ? (value as (prev: T) => T)(state) : value;
        setState(newValue);
        
        // Save to AsyncStorage
        const serializedValue = serializer(newValue);
        await AsyncStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error(`Error saving state for key ${key}:`, error);
        // Still update state even if saving fails
        const newValue = typeof value === 'function' ? (value as (prev: T) => T)(state) : value;
        setState(newValue);
      }
    },
    [key, serializer, state]
  );

  return [state, setPersistedState, isLoading] as const;
};

