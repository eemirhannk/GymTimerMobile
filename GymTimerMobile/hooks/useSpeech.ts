import { useRef, useCallback, useState, useEffect, useMemo } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import { showErrorToast } from '../utils/toast';
import { useAdvancedSoundSettings } from './useAdvancedSoundSettings';

type SoundKey = 'work' | 'rest' | 'congrats';

const SOUND_FILES = {
  work: require('../assets/sounds/work.mp3'),
  rest: require('../assets/sounds/rest.mp3'),
  congrats: require('../assets/sounds/end.mp3'),
};

export const useSpeech = () => {
  const { settings: soundSettings } = useAdvancedSoundSettings();
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
    workPlayer.volume = 1.0; // Sabit volume
    restPlayer.loop = false;
    restPlayer.volume = 1.0; // Sabit volume
    congratsPlayer.loop = false;
    congratsPlayer.volume = 1.0; // Sabit volume
  }, [workPlayer, restPlayer, congratsPlayer]);

  const playSoundEffect = useCallback(async (key: SoundKey) => {
    if (isMutedRef.current) return;
    
    // Enable/disable kontrolü
    if (key === 'work' && !soundSettings?.workSoundEnabled) return;
    if (key === 'rest' && !soundSettings?.restSoundEnabled) return;
    if (key === 'congrats' && !soundSettings?.congratsSoundEnabled) return;
    
    try {
      const player = players[key];
      if (player) {
        player.seekTo(0);
        player.play();
      }
    } catch (error) {
      showErrorToast('errorPlaySound');
    }
  }, [players, soundSettings]);

  const speakKey = useCallback((key: 'work' | 'rest' | 'congrats' | 'setWork', n?: number) => {
    // Sadece ses efekti modu
    if (key === 'work' || key === 'rest' || key === 'congrats') {
      playSoundEffect(key);
    } else if (key === 'setWork') {
      // setWork için work sesini çal
      playSoundEffect('work');
    }
  }, [playSoundEffect]);

  const toggleMute = useCallback(() => {
    isMutedRef.current = !isMutedRef.current;
    setIsMuted(isMutedRef.current);
  }, []);

  return {
    speakKey,
    isMuted,
    toggleMute,
  };
};

