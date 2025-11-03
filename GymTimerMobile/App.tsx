import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import './i18n';
import HomeScreen from './screens/HomeScreen';
import TimerScreen from './screens/TimerScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './theme/ThemeContext';
import { sanitizeSetCount, sanitizeDuration } from './utils/validators';
import { SoundMode } from './types';
import { DEFAULT_VALUES } from './utils/constants';
import { usePersistedState } from './hooks/usePersistedState';

// Storage keys
const STORAGE_KEYS = {
  SET_COUNT: '@gymtimer:setCount',
  SET_DURATION: '@gymtimer:setDuration',
  REST_DURATION: '@gymtimer:restDuration',
  SOUND_MODE: '@gymtimer:soundMode',
} as const;

function AppContent() {
  // Persisted states
  const [setCount, setSetCount] = usePersistedState<string>({
    key: STORAGE_KEYS.SET_COUNT,
    defaultValue: DEFAULT_VALUES.SET_COUNT.toString(),
  });

  const [setDuration, setSetDuration] = usePersistedState<string>({
    key: STORAGE_KEYS.SET_DURATION,
    defaultValue: DEFAULT_VALUES.SET_DURATION.toString(),
  });

  const [restDuration, setRestDuration] = usePersistedState<string>({
    key: STORAGE_KEYS.REST_DURATION,
    defaultValue: DEFAULT_VALUES.REST_DURATION.toString(),
  });

  const [soundMode, setSoundMode] = usePersistedState<SoundMode>({
    key: STORAGE_KEYS.SOUND_MODE,
    defaultValue: DEFAULT_VALUES.SOUND_MODE,
  });

  const [currentScreen, setCurrentScreen] = useState('home');

  const handleStart = () => {
    setCurrentScreen('timer');
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const handleSetCountChange = async (text: string) => {
    const sanitized = sanitizeSetCount(text);
    await setSetCount(sanitized);
  };

  const handleSetDurationChange = async (text: string) => {
    const sanitized = sanitizeDuration(text);
    await setSetDuration(sanitized);
  };

  const handleRestDurationChange = async (text: string) => {
    const sanitized = sanitizeDuration(text);
    await setRestDuration(sanitized);
  };

  const handleSoundModeChange = async (mode: SoundMode) => {
    await setSoundMode(mode);
  };

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        {currentScreen === 'timer' ? (
          <TimerScreen 
            setCount={parseInt(setCount) || 3}
            setDuration={parseInt(setDuration) || 0}
            restDuration={parseInt(restDuration) || 60}
            soundMode={soundMode}
            onBack={handleBack}
          />
        ) : (
          <HomeScreen
            setCount={setCount}
            setDuration={setDuration}
            restDuration={restDuration}
            soundMode={soundMode}
            onSetCountChange={handleSetCountChange}
            onSetDurationChange={handleSetDurationChange}
            onRestDurationChange={handleRestDurationChange}
            onSoundModeChange={handleSoundModeChange}
            onStart={handleStart}
          />
        )}
        <Toast />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

function AppContentWrapper() {
  const [isReady, setIsReady] = useState(!__DEV__); // Production'da hemen hazır

  useEffect(() => {
    // Development build'de Metro bundler bağlantısını kontrol et
    if (__DEV__) {
      const checkBundlerConnection = async () => {
        let retries = 0;
        const maxRetries = 10; // 10 deneme = 2 saniye
        
        const checkConnection = async () => {
          try {
            // Metro bundler hazır olana kadar kısa bir gecikme ekle
            // Native tarafında script URL'i set edilene kadar bekle
            await new Promise(resolve => setTimeout(resolve, 300));
            setIsReady(true);
          } catch (error) {
            retries++;
            if (retries < maxRetries) {
              // Tekrar dene
              setTimeout(checkConnection, 200);
            } else {
              // Maksimum deneme sayısına ulaşıldı, yine de devam et
              // Kullanıcı manuel reload yapabilir
              setIsReady(true);
            }
          }
        };

        checkConnection();
      };

      checkBundlerConnection();
    }
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AppContent />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContentWrapper />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

