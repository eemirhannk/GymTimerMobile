import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import * as Speech from 'expo-speech';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { SoundMode } from '../types';
import { showErrorToast } from '../utils/toast';

type SpeechKey = 'work' | 'rest' | 'congrats' | 'setWork';

const SOUND_FILES = {
  work: require('../assets/sounds/work.mp3'),
  rest: require('../assets/sounds/rest.mp3'),
  congrats: require('../assets/sounds/end.mp3'),
};

export const useSpeech = (soundMode: SoundMode = 'effects') => {
  const { t } = useTranslation();
  const isMutedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const workPlayer = useAudioPlayer(SOUND_FILES.work as AudioSource);
  const restPlayer = useAudioPlayer(SOUND_FILES.rest as AudioSource);
  const congratsPlayer = useAudioPlayer(SOUND_FILES.congrats as AudioSource);

  const players = useMemo(() => ({
    work: workPlayer,
    rest: restPlayer,
    congrats: congratsPlayer,
  }), [workPlayer, restPlayer, congratsPlayer]);

  // Player ayarlarını yap
  useEffect(() => {
    workPlayer.loop = false;
    workPlayer.volume = 1.0;
    restPlayer.loop = false;
    restPlayer.volume = 1.0;
    congratsPlayer.loop = false;
    congratsPlayer.volume = 1.0;
  }, [workPlayer, restPlayer, congratsPlayer]);

  const playSoundEffect = useCallback(async (key: 'work' | 'rest' | 'congrats') => {
    if (isMutedRef.current) return;
    
    try {
      const player = players[key];
      if (player) {
        player.seekTo(0);
        player.play();
      }
    } catch (error) {
      showErrorToast('errorPlaySound');
    }
  }, [players]);

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
    if (soundMode === 'effects') {
      // Ses efekti modunda
      if (key === 'work' || key === 'rest' || key === 'congrats') {
        playSoundEffect(key);
      } else if (key === 'setWork') {
        // setWork için work sesini çal
        playSoundEffect('work');
      }
    } else {
      // Speech modunda
      const text = getText(key, n);
      speak(text);
    }
  }, [soundMode, getText, speak, playSoundEffect]);

  const toggleMute = useCallback(() => {
    isMutedRef.current = !isMutedRef.current;
    setIsMuted(isMutedRef.current);
    if (isMutedRef.current) {
      Speech.stop();
    }
  }, []);

  return {
    speak,
    speakKey,
    getText,
    isMuted,
    toggleMute,
  };
};

