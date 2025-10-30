import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './i18n';
import HomeScreen from './screens/HomeScreen';
import TimerScreen from './screens/TimerScreen';
import { sanitizeSetCount, sanitizeDuration } from './utils/validators';

export default function App() {
  const [setCount, setSetCount] = useState('3');
  const [setDuration, setSetDuration] = useState('0');
  const [restDuration, setRestDuration] = useState('60');
  const [currentScreen, setCurrentScreen] = useState('home');

  const handleStart = () => {
    setCurrentScreen('timer');
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  return (
    <SafeAreaProvider>
      {currentScreen === 'timer' ? (
        <TimerScreen 
          setCount={parseInt(setCount) || 3}
          setDuration={parseInt(setDuration) || 0}
          restDuration={parseInt(restDuration) || 60}
          onBack={handleBack}
        />
      ) : (
        <HomeScreen
          setCount={setCount}
          setDuration={setDuration}
          restDuration={restDuration}
          onSetCountChange={(text) => {
            const sanitized = sanitizeSetCount(text);
            setSetCount(sanitized);
          }}
          onSetDurationChange={(text) => {
            const sanitized = sanitizeDuration(text);
            setSetDuration(sanitized);
          }}
          onRestDurationChange={(text) => {
            const sanitized = sanitizeDuration(text);
            setRestDuration(sanitized);
          }}
          onStart={handleStart}
        />
      )}
    </SafeAreaProvider>
  );
}
