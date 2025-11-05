import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdvancedSoundSettings } from '../types/sound';
import { PREMIUM } from '../utils/constants';
import { usePersistedState } from './usePersistedState';

// Varsayılan ses ayarları
const DEFAULT_SOUND_SETTINGS: AdvancedSoundSettings = {
  workSoundEnabled: true,
  restSoundEnabled: true,
  congratsSoundEnabled: true,
};

export const useAdvancedSoundSettings = () => {
  const [settings, setSettings] = usePersistedState<AdvancedSoundSettings>({
    key: PREMIUM.SOUND_SETTINGS_STORAGE_KEY,
    defaultValue: DEFAULT_SOUND_SETTINGS,
  });

  // Ses ayarlarını güncelle
  const updateSettings = useCallback(async (updates: Partial<AdvancedSoundSettings>) => {
    await setSettings((prevSettings) => ({
      ...prevSettings,
      ...updates,
    }));
  }, [setSettings]);

  // Ses ayarlarını sıfırla
  const resetSettings = useCallback(async () => {
    await setSettings(DEFAULT_SOUND_SETTINGS);
  }, [setSettings]);

  return {
    settings,
    updateSettings,
    resetSettings,
  };
};

