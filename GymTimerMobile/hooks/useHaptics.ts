import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

export const useHaptics = () => {
  const triggerImpact = useCallback((style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
    Haptics.impactAsync(style);
  }, []);

  const triggerNotification = useCallback((type: 'success' | 'warning' | 'error' = 'success') => {
    const notificationType = 
      type === 'success' ? Haptics.NotificationFeedbackType.Success :
      type === 'warning' ? Haptics.NotificationFeedbackType.Warning :
      Haptics.NotificationFeedbackType.Error;
    
    Haptics.notificationAsync(notificationType);
  }, []);

  const triggerSelection = useCallback(() => {
    Haptics.selectionAsync();
  }, []);

  return {
    triggerImpact,
    triggerNotification,
    triggerSelection,
  };
};

