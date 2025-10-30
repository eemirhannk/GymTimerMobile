import { useRef, useCallback, useState } from 'react';
import * as Speech from 'expo-speech';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

type SpeechKey = 'work' | 'rest' | 'congrats' | 'setWork';

export const useSpeech = () => {
  const { t } = useTranslation();
  const isMutedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);

  const speak = useCallback(async (text: string) => {
    if (!isMutedRef.current) {
      try {
        await Speech.stop();
      } catch {}
      Speech.speak(text, {
        language: i18n.language === 'tr' ? 'tr-TR' : 'en-US',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
      });
    }
  }, []);

  const getText = useCallback((key: SpeechKey, n?: number): string => {
    switch (key) {
      case 'work':
        return t('speak_work');
      case 'rest':
        return t('speak_rest');
      case 'congrats':
        return t('speak_congrats');
      case 'setWork':
        return t('speak_setWork', { n });
    }
  }, [t]);

  const speakKey = useCallback((key: SpeechKey, n?: number) => {
    const text = getText(key, n);
    speak(text);
  }, [getText, speak]);

  const toggleMute = useCallback(() => {
    isMutedRef.current = !isMutedRef.current;
    setIsMuted(isMutedRef.current);
  }, []);

  return {
    speak,
    speakKey,
    getText,
    isMuted,
    toggleMute,
  };
};

