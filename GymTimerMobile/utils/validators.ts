import { LIMITS, ERROR_KEY_MAP } from './constants';
import { ValidationResult } from '../types';

/**
 * Validates set count input
 * @param text - Input text to validate
 * @returns ValidationResult with i18n error key if invalid
 */
export const validateSetCount = (text: string): ValidationResult => {
  if (text === '') {
    return { valid: true }; // Boş bırakılabilir, ancak submit'te kontrol edilir
  }

  if (!/^\d+$/.test(text)) {
    return { valid: false, error: ERROR_KEY_MAP.invalid_number };
  }

  const num = parseInt(text, 10);
  
  if (num < LIMITS.SET_COUNT_MIN) {
    return { valid: false, error: ERROR_KEY_MAP.min_1 };
  }
  
  if (num > LIMITS.SET_COUNT_MAX) {
    return { valid: false, error: ERROR_KEY_MAP.max_50 };
  }

  return { valid: true };
};

/**
 * Validates duration input
 * @param text - Input text to validate
 * @returns ValidationResult with i18n error key if invalid
 */
export const validateDuration = (text: string): ValidationResult => {
  if (text === '') {
    return { valid: true }; // Boş bırakılabilir
  }

  if (!/^\d+$/.test(text)) {
    return { valid: false, error: ERROR_KEY_MAP.invalid_number };
  }

  const num = parseInt(text, 10);
  
  if (num < LIMITS.DURATION_MIN) {
    return { valid: false, error: ERROR_KEY_MAP.min_0 };
  }
  
  if (num > LIMITS.DURATION_MAX) {
    return { valid: false, error: ERROR_KEY_MAP.max_300 };
  }

  return { valid: true };
};

export const sanitizeSetCount = (text: string): string => {
  if (text === '') return text;
  
  if (!/^\d+$/.test(text)) return '';
  
  const num = parseInt(text, 10);
  
  if (num > LIMITS.SET_COUNT_MAX) return LIMITS.SET_COUNT_MAX.toString();
  if (num < LIMITS.SET_COUNT_MIN && num > 0) return LIMITS.SET_COUNT_MIN.toString();
  if (num === 0) return LIMITS.SET_COUNT_MIN.toString();
  
  return text;
};

export const sanitizeDuration = (text: string): string => {
  if (text === '') return text;
  
  if (!/^\d+$/.test(text)) return '';
  
  const num = parseInt(text, 10);
  
  if (num > LIMITS.DURATION_MAX) return LIMITS.DURATION_MAX.toString();
  if (num < LIMITS.DURATION_MIN) return LIMITS.DURATION_MIN.toString();
  
  return text;
};

