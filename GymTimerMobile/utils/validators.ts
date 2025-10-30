import { LIMITS } from './constants';
import { ValidationResult } from '../types';

export const validateSetCount = (text: string): ValidationResult => {
  if (text === '') {
    return { valid: true }; // Boş bırakılabilir, ancak submit'te kontrol edilir
  }

  if (!/^\d+$/.test(text)) {
    return { valid: false, error: 'invalid_number' };
  }

  const num = parseInt(text, 10);
  
  if (num < LIMITS.SET_COUNT_MIN) {
    return { valid: false, error: 'min_1' };
  }
  
  if (num > LIMITS.SET_COUNT_MAX) {
    return { valid: false, error: 'max_50' };
  }

  return { valid: true };
};

export const validateDuration = (text: string): ValidationResult => {
  if (text === '') {
    return { valid: true }; // Boş bırakılabilir
  }

  if (!/^\d+$/.test(text)) {
    return { valid: false, error: 'invalid_number' };
  }

  const num = parseInt(text, 10);
  
  if (num < LIMITS.DURATION_MIN) {
    return { valid: false, error: 'min_0' };
  }
  
  if (num > LIMITS.DURATION_MAX) {
    return { valid: false, error: 'max_300' };
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

