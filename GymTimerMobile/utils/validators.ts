import { LIMITS, ERROR_KEY_MAP, PREMIUM } from './constants';
import { ValidationResult } from '../types';

/**
 * Validates set count input
 * @param text - Input text to validate
 * @param isPremium - Whether user has premium access
 * @returns ValidationResult with i18n error key if invalid
 */
export const validateSetCount = (text: string, isPremium: boolean = false): ValidationResult => {
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
  
  // Premium kontrolü: Ücretsiz kullanıcılar için maksimum set sayısı, premium için sınırsız
  if (!isPremium) {
    if (num > PREMIUM.FREE_MAX_SETS) {
      return { valid: false, error: ERROR_KEY_MAP.max_5_free };
    }
  }
  // Premium kullanıcılar için sınırsız (max kontrolü yok)

  return { valid: true };
};

/**
 * Validates duration input
 * @param text - Input text to validate
 * @param isPremium - Whether user has premium access
 * @returns ValidationResult with i18n error key if invalid
 */
export const validateDuration = (text: string, isPremium: boolean = false): ValidationResult => {
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
  
  // Premium kontrolü: Ücretsiz kullanıcılar için maksimum süre, premium için sınırsız
  if (!isPremium) {
    if (num > PREMIUM.FREE_MAX_DURATION) {
      return { valid: false, error: ERROR_KEY_MAP.max_300_free };
    }
  }
  // Premium kullanıcılar için sınırsız (max kontrolü yok)

  return { valid: true };
};

export const sanitizeSetCount = (text: string, isPremium: boolean = false): string => {
  if (text === '') return text;
  
  if (!/^\d+$/.test(text)) return '';
  
  const num = parseInt(text, 10);
  
  // Premium kontrolü: Ücretsiz kullanıcılar için maksimum set sayısı, premium için sınırsız
  if (!isPremium && num > PREMIUM.FREE_MAX_SETS) {
    return PREMIUM.FREE_MAX_SETS.toString();
  }
  
  if (num < LIMITS.SET_COUNT_MIN && num > 0) return LIMITS.SET_COUNT_MIN.toString();
  if (num === 0) return LIMITS.SET_COUNT_MIN.toString();
  
  return text;
};

export const sanitizeDuration = (text: string, isPremium: boolean = false): string => {
  if (text === '') return text;
  
  if (!/^\d+$/.test(text)) return '';
  
  const num = parseInt(text, 10);
  
  // Premium kontrolü: Ücretsiz kullanıcılar için maksimum süre, premium için sınırsız
  if (!isPremium && num > PREMIUM.FREE_MAX_DURATION) {
    return PREMIUM.FREE_MAX_DURATION.toString();
  }
  
  if (num < LIMITS.DURATION_MIN) return LIMITS.DURATION_MIN.toString();
  
  return text;
};

