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
      // Önce sanitize et
      const sanitized = sanitizer(text);
      
      // Sanitize edilmiş değeri validate et
      const validation = validator(sanitized);
      
      // Eğer değer değiştiyse (sanitize edildiyse) ve hata varsa, hata göster
      // Eğer değer değişmediyse ama hata varsa, hata göster
      if (showErrors && !validation.valid && validation.error && sanitized !== '') {
        // Sadece sanitize edilmiş değer hala geçersizse hata göster
        // Eğer sanitizer değeri düzeltiyorsa (örn: 6 -> 5), hata gösterme
        if (text !== sanitized) {
          // Değer otomatik olarak düzeltildi, hata gösterme
          // Sadece güncelle
        } else {
          // Değer değişmedi ama hala geçersiz, hata göster
          showErrorToast(validation.error);
        }
      }
      
      // Güncelle
      onChange(sanitized);
    },
    [validator, sanitizer, showErrors]
  );

  return { handleChange };
};

