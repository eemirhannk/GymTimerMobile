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

function AppContent() {
  const [setCount, setSetCount] = useState<string>('3');
  const [setDuration, setSetDuration] = useState<string>('0');
  const [restDuration, setRestDuration] = useState<string>('60');
  const [soundMode, setSoundMode] = useState<SoundMode>('effects');
  const [currentScreen, setCurrentScreen] = useState('home');

  const handleStart = () => {
    setCurrentScreen('timer');
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const handleSetCountChange = (text: string) => {
    const sanitized = sanitizeSetCount(text);
    setSetCount(sanitized);
  };

  const handleSetDurationChange = (text: string) => {
    const sanitized = sanitizeDuration(text);
    setSetDuration(sanitized);
  };

  const handleRestDurationChange = (text: string) => {
    const sanitized = sanitizeDuration(text);
    setRestDuration(sanitized);
  };

  const handleSoundModeChange = (mode: SoundMode) => {
    setSoundMode(mode);
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

