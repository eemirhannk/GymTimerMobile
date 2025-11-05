import Toast from 'react-native-toast-message';
import i18n from '../i18n';

type ToastType = 'success' | 'error' | 'info';

export const showToast = (type: ToastType, message: string, duration: number = 3000, onPress?: () => void, text2?: string, position: 'top' | 'bottom' = 'top') => {
  Toast.show({
    type,
    text1: message,
    text2: text2,
    position: position,
    visibilityTime: duration,
    onPress,
    topOffset: 60,
  });
};

export const showErrorToast = (key: string) => {
  const message = i18n.t(key);
  showToast('error', message, undefined, undefined, undefined, 'bottom');
};

export const showSuccessToast = (key: string) => {
  const message = i18n.t(key);
  showToast('success', message, undefined, undefined, undefined, 'bottom');
};

export const showPremiumToast = (key: string, onPress: () => void, duration: number = 5000) => {
  const message = i18n.t(key);
  const actionMessage = i18n.t(`${key}Action`);
  showToast('info', message, duration, onPress, actionMessage, 'top');
};

