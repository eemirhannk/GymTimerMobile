import Toast from 'react-native-toast-message';
import i18n from '../i18n';

type ToastType = 'success' | 'error' | 'info';

export const showToast = (type: ToastType, message: string, duration: number = 3000) => {
  Toast.show({
    type,
    text1: message,
    position: 'bottom',
    visibilityTime: duration,
  });
};

export const showErrorToast = (key: string) => {
  const message = i18n.t(key);
  showToast('error', message);
};

export const showSuccessToast = (key: string) => {
  const message = i18n.t(key);
  showToast('success', message);
};

