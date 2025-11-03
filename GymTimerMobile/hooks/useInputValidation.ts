import { useCallback } from 'react';
import { ValidationResult } from '../types';
import { showErrorToast } from '../utils/toast';

type ValidatorFn = (text: string) => ValidationResult;
type SanitizerFn = (text: string) => string;

type UseInputValidationOptions = {
  validator: ValidatorFn;
  sanitizer: SanitizerFn;
  showErrors?: boolean;
};

/**
 * Generic input validation hook
 * Reduces code duplication for form validation
 */
export const useInputValidation = ({
  validator,
  sanitizer,
  showErrors = true,
}: UseInputValidationOptions) => {
  const handleChange = useCallback(
    (text: string, onChange: (value: string) => void) => {
      // Validation yap
      const validation = validator(text);
      
      // Hata varsa ve gösterilmesi gerekiyorsa toast göster
      // Validator artık direkt i18n key döndürüyor
      if (showErrors && !validation.valid && validation.error && text !== '') {
        showErrorToast(validation.error);
      }
      
      // Sanitize et ve güncelle
      const sanitized = sanitizer(text);
      onChange(sanitized);
    },
    [validator, sanitizer, showErrors]
  );

  return { handleChange };
};

