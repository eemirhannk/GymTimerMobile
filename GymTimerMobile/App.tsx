import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import './i18n';
import { useTranslation } from 'react-i18next';
import HomeScreen from './screens/HomeScreen';
import TimerScreen from './screens/TimerScreen';
import PurchaseScreen from './screens/PurchaseScreen';
import StatsScreen from './screens/StatsScreen';
import SoundSettingsScreen from './screens/SoundSettingsScreen';
import TemplatesScreen from './screens/TemplatesScreen';
import ProgramsScreen from './screens/ProgramsScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HelpCenterScreen from './screens/HelpCenterScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { sanitizeSetCount, sanitizeDuration } from './utils/validators';
import { DEFAULT_VALUES, STORAGE_KEYS } from './utils/constants';
import { usePersistedState } from './hooks/usePersistedState';
import { usePremium } from './hooks/usePremium'; // usePremium import eklendi
import PremiumDrawer from './components/PremiumDrawer';
import PremiumOnboardingModal from './components/PremiumOnboardingModal';
import OnboardingTransitionModal from './components/OnboardingTransitionModal';
import { PREMIUM } from './utils/constants';

function AppContent() {
  const { t } = useTranslation();
  
  // Persisted states
  const [setCount, setSetCount] = usePersistedState<string>({
    key: STORAGE_KEYS.SET_COUNT,
    defaultValue: DEFAULT_VALUES.SET_COUNT.toString(),
  });

  const [setDuration, setSetDuration] = usePersistedState<string>({
    key: STORAGE_KEYS.SET_DURATION,
    defaultValue: '', // Boş başla (süresiz)
  });

  const [restDuration, setRestDuration] = usePersistedState<string>({
    key: STORAGE_KEYS.REST_DURATION,
    defaultValue: '', // Boş başla (süresiz)
  });


  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'home' | 'timer' | 'purchase' | 'stats' | 'soundSettings' | 'templates' | 'programs' | 'help'>('onboarding');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [templateSequence, setTemplateSequence] = useState<Array<{ setCount: number; setDuration: number; restDuration: number }> | undefined>(undefined);
  const { premiumTheme, setPremiumTheme } = useTheme();
  const { isPremium } = usePremium(); // Premium durumunu al
  
  // Premium onboarding state
  const [showPremiumOnboardingModal, setShowPremiumOnboardingModal] = useState(false);
  const [isPremiumOnboardingCompleted, setIsPremiumOnboardingCompleted] = useState(false);
  const [premiumOnboardingStep, setPremiumOnboardingStep] = useState<'templates' | 'programs' | null>(null);
  const [showTemplatesCompleteModal, setShowTemplatesCompleteModal] = useState(false);
  const [showProgramsCompleteModal, setShowProgramsCompleteModal] = useState(false);
  
  // Premium onboarding kontrolü
  useEffect(() => {
    const checkPremiumOnboarding = async () => {
      if (!isPremium) {
        return; // Premium değilse kontrol etme
      }
      
      try {
        const completed = await AsyncStorage.getItem(PREMIUM.ONBOARDING_COMPLETED_KEY);
        if (completed === 'true') {
          setIsPremiumOnboardingCompleted(true);
        } else {
          // Premium onboarding tamamlanmamış, modal'ı göster
          setShowPremiumOnboardingModal(true);
        }
      } catch (error) {
        console.error('Error checking premium onboarding:', error);
        // Hata durumunda modal'ı göster
        setShowPremiumOnboardingModal(true);
      }
    };
    
    checkPremiumOnboarding();
  }, [isPremium]);
  
  // Premium satın alındığında onboarding kontrolü
  useEffect(() => {
    if (isPremium && !isPremiumOnboardingCompleted) {
      // Premium oldu, onboarding kontrolü yap
      const checkOnboarding = async () => {
        try {
          const completed = await AsyncStorage.getItem(PREMIUM.ONBOARDING_COMPLETED_KEY);
          if (completed !== 'true') {
            setShowPremiumOnboardingModal(true);
          }
        } catch (error) {
          console.error('Error checking premium onboarding:', error);
          setShowPremiumOnboardingModal(true);
        }
      };
      checkOnboarding();
    }
  }, [isPremium, isPremiumOnboardingCompleted]);
  
  // Onboarding kontrolü - sadece ilk seferde göster
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const onboardingCompleted = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
        if (onboardingCompleted === 'true') {
          setShowOnboarding(false);
          setCurrentScreen('home');
        } else {
          setShowOnboarding(true);
          setCurrentScreen('onboarding');
        }
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setShowOnboarding(true);
        setCurrentScreen('onboarding');
      }
    };
    checkOnboarding();
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      setShowOnboarding(false);
      setCurrentScreen('home');
    } catch (error) {
      console.error('Error saving onboarding:', error);
    }
  };

  const handleOpenHelp = useCallback(() => {
    setCurrentScreen('help');
  }, []);

  const handleCloseHelp = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  const handleStart = () => {
    setCurrentScreen('timer');
  };

  const handleBack = () => {
    // Timer'dan geri dönüldüğünde templateSequence'i temizle
    setTemplateSequence(undefined);
    setCurrentScreen('home');
  };

  const handleOpenPurchase = () => {
    setCurrentScreen('purchase');
  };

  const handleClosePurchase = () => {
    setCurrentScreen('home');
  };

  const handleOpenSoundSettings = () => {
    setCurrentScreen('soundSettings');
  };

  const handleCloseSoundSettings = () => {
    setCurrentScreen('home');
  };

  const handleOpenTemplates = () => {
    setCurrentScreen('templates');
  };

  const handleCloseTemplates = () => {
    // Zorunlu modda ise geri çıkmayı engelle (TemplatesScreen içinde kontrol ediliyor)
    if (premiumOnboardingStep !== 'templates') {
      setCurrentScreen('home');
    }
  };

  // Premium onboarding handler'ları
  const handlePremiumOnboardingStart = () => {
    setShowPremiumOnboardingModal(false);
    setPremiumOnboardingStep('templates');
    setCurrentScreen('templates');
  };

  const handleTemplatesComplete = () => {
    // Şablon ekranı tamamlandı, geçiş modal'ını göster
    setShowTemplatesCompleteModal(true);
  };

  const handleTemplatesCompleteContinue = () => {
    // Geçiş modal'ından devam edildi, program ekranına geç
    setShowTemplatesCompleteModal(false);
    setPremiumOnboardingStep('programs');
    setCurrentScreen('programs');
  };

  const handleProgramsComplete = () => {
    // Program ekranı tamamlandı, tamamlanma modal'ını göster
    setShowProgramsCompleteModal(true);
  };

  const handleProgramsCompleteContinue = async () => {
    // Tamamlanma modal'ından devam edildi, onboarding'i tamamla
    setShowProgramsCompleteModal(false);
    try {
      await AsyncStorage.setItem(PREMIUM.ONBOARDING_COMPLETED_KEY, 'true');
      setIsPremiumOnboardingCompleted(true);
      setPremiumOnboardingStep(null);
      setCurrentScreen('home');
    } catch (error) {
      console.error('Error saving premium onboarding:', error);
      // Hata olsa bile akışı tamamla
      setIsPremiumOnboardingCompleted(true);
      setPremiumOnboardingStep(null);
      setCurrentScreen('home');
    }
  };

  const handleUseTemplate = (template: { setCount: number; setDuration: number; restDuration: number }) => {
    // Template kullanıldığında templateSequence'i temizle
    setTemplateSequence(undefined);
    setSetCount(template.setCount.toString());
    setSetDuration(template.setDuration.toString());
    setRestDuration(template.restDuration.toString());
    setCurrentScreen('home');
  };

  const handleOpenPrograms = () => {
    setCurrentScreen('programs');
  };

  const handleClosePrograms = () => {
    setCurrentScreen('home');
  };

  const handleUseProgram = (templates: Array<{ setCount: number; setDuration: number; restDuration: number }>) => {
    // Tüm template'leri sırayla çalıştır
    if (templates.length > 0) {
      // Toplam set sayısını hesapla
      const totalSetCount = templates.reduce((sum, template) => sum + template.setCount, 0);
      
      // Template sequence'i sakla
      setTemplateSequence(templates);
      
      // Toplam set sayısını ve varsayılan değerleri ayarla
      setSetCount(totalSetCount.toString());
      setSetDuration('0'); // Her zaman süresiz
      setRestDuration('0'); // Varsayılan değer (templateSequence kullanılacak)
      
      // Timer ekranına geç
      setCurrentScreen('timer');
    }
  };

  const handleOpenDrawer = () => {
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const handleSetCountChange = useCallback(async (text: string) => {
    // isPremium parametresini geçir
    const sanitized = sanitizeSetCount(text, isPremium);
    await setSetCount(sanitized);
  }, [isPremium, setSetCount]);

  const handleSetDurationChange = useCallback(async (text: string) => {
    // Boş veya 0 girilirse süresiz olarak ayarla (0), aksi halde girilen değeri kaydet
    if (text === '' || text === '0') {
      await setSetDuration('0');
    } else {
      const sanitized = sanitizeDuration(text, isPremium);
      await setSetDuration(sanitized);
    }
  }, [isPremium, setSetDuration]);

  const handleRestDurationChange = useCallback(async (text: string) => {
    // Boş veya 0 girilirse süresiz olarak ayarla (0), aksi halde girilen değeri kaydet
    if (text === '' || text === '0') {
      await setRestDuration('0');
    } else {
      const sanitized = sanitizeDuration(text, isPremium);
      await setRestDuration(sanitized);
    }
  }, [isPremium, setRestDuration]);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        {showOnboarding ? (
          <OnboardingScreen onComplete={handleOnboardingComplete} />
        ) : currentScreen === 'timer' ? (
            <TimerScreen 
                setCount={parseInt(setCount) || 3}
                setDuration={parseInt(setDuration) || 0}
                restDuration={parseInt(restDuration) || 0}
                templateSequence={templateSequence}
                onBack={handleBack}
              />
            ) : currentScreen === 'purchase' ? (
              <PurchaseScreen onClose={handleClosePurchase} />
            ) : currentScreen === 'stats' ? (
              <StatsScreen onBack={handleBack} />
            ) : currentScreen === 'soundSettings' ? (
              <SoundSettingsScreen onBack={handleCloseSoundSettings} />
            ) : currentScreen === 'templates' ? (
              <TemplatesScreen 
                onBack={handleCloseTemplates} 
                onUseTemplate={handleUseTemplate}
                isRequiredMode={premiumOnboardingStep === 'templates'}
                onComplete={handleTemplatesComplete}
                minRequiredCount={2}
              />
            ) : currentScreen === 'programs' ? (
              <ProgramsScreen 
                onBack={handleClosePrograms} 
                onUseProgram={handleUseProgram}
                isRequiredMode={premiumOnboardingStep === 'programs'}
                onComplete={handleProgramsComplete}
                minRequiredCount={1}
              />
            ) : currentScreen === 'help' ? (
              <HelpCenterScreen onBack={handleCloseHelp} />
            ) : (
              <HomeScreen
                setCount={setCount}
                setDuration={setDuration}
                restDuration={restDuration}
                onSetCountChange={handleSetCountChange}
                onSetDurationChange={handleSetDurationChange}
                onRestDurationChange={handleRestDurationChange}
                onStart={handleStart}
                onOpenPurchase={handleOpenPurchase}
                onOpenDrawer={handleOpenDrawer}
                onOpenHelp={handleOpenHelp}
              />
        )}
            <PremiumDrawer
              visible={drawerVisible}
              onClose={handleCloseDrawer}
              selectedTheme={premiumTheme}
              onThemeSelect={setPremiumTheme}
              onOpenSoundSettings={handleOpenSoundSettings}
              onOpenTemplates={handleOpenTemplates}
              onOpenPrograms={handleOpenPrograms}
            />
        <PremiumOnboardingModal
          visible={showPremiumOnboardingModal}
          onStart={handlePremiumOnboardingStart}
        />
        <OnboardingTransitionModal
          visible={showTemplatesCompleteModal}
          title={t('premiumOnboardingTemplatesCompleteTitle')}
          message={t('premiumOnboardingTemplatesCompleteMessage')}
          buttonText={t('premiumOnboardingTemplatesCompleteButton')}
          onContinue={handleTemplatesCompleteContinue}
        />
        <OnboardingTransitionModal
          visible={showProgramsCompleteModal}
          title={t('premiumOnboardingProgramsCompleteTitle')}
          message={t('premiumOnboardingProgramsCompleteMessage')}
          buttonText={t('premiumOnboardingProgramsCompleteButton')}
          onContinue={handleProgramsCompleteContinue}
        />
        <ToastConfig />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

// Animated Toast Component
function AnimatedToast({ text1, text2, onPress }: { text1?: string; text2?: string; onPress?: () => void }) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sürekli pulse animasyonu (tıklanabilir olduğunu gösterir)
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [pulseAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    if (onPress) {
      onPress();
    }
  };

  return (
    <Animated.View
      style={{
        transform: [
          { scale: Animated.multiply(scaleAnim, pulseAnim) },
        ],
      }}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View
          style={{
            height: 'auto',
            width: '100%',
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            borderLeftWidth: 4,
            borderLeftColor: colors.primary,
          }}
        >
          {text1 && (
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.text,
                marginBottom: text2 ? 4 : 0,
              }}
              numberOfLines={2}
            >
              {text1}
            </Text>
          )}
          {text2 && (
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: 4,
              }}
              numberOfLines={2}
            >
              {text2}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Toast config component - ThemeProvider içinde olmalı
function ToastConfig() {
  return (
    <Toast
      config={{
        info: ({ text1, text2, onPress }) => (
          <AnimatedToast text1={text1} text2={text2} onPress={onPress} />
        ),
      }}
    />
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

