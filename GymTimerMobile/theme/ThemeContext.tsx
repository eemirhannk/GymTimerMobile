import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  lightColors,
  darkColors,
  premiumLightThemes,
  premiumDarkThemes,
  PremiumThemeName,
  Colors,
} from './colors';
import { PREMIUM } from '../utils/constants';
import { usePremium } from '../hooks/usePremium';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  colors: Colors;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
  premiumTheme: PremiumThemeName | null;
  setPremiumTheme: (theme: PremiumThemeName | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const { isPremium } = usePremium();
  const [premiumTheme, setPremiumThemeState] = useState<PremiumThemeName | null>(null);
  
  // İlk mount'ta: kullanıcının seçtiği modu yükle, yoksa sistem temasını kullan
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const appearanceScheme = Appearance.getColorScheme();
    return appearanceScheme === 'dark' ? 'dark' : 'light';
  });

  // Kullanıcının seçtiği tema modunu yükle (sadece bir kez, mount'ta)
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const stored = await AsyncStorage.getItem(PREMIUM.THEME_MODE_STORAGE_KEY);
        if (stored) {
          const savedMode = JSON.parse(stored) as ThemeMode | null;
          if (savedMode === 'light' || savedMode === 'dark') {
            setModeState(savedMode);
          }
        } else {
          // Kayıtlı mod yoksa sistem temasını kullan
          const appearanceScheme = Appearance.getColorScheme();
          const systemMode = appearanceScheme === 'dark' ? 'dark' : 'light';
          setModeState(systemMode);
        }
      } catch (error) {
        console.error('Error loading theme mode:', error);
        // Hata durumunda sistem temasını kullan
        const appearanceScheme = Appearance.getColorScheme();
        const systemMode = appearanceScheme === 'dark' ? 'dark' : 'light';
        setModeState(systemMode);
      }
    };
    loadThemeMode();
  }, []); // Sadece mount'ta çalış

  // Premium tema seçimini yükle (sadece bir kez, mount'ta)
  useEffect(() => {
    const loadPremiumTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(PREMIUM.THEME_STORAGE_KEY);
        if (stored) {
          const theme = JSON.parse(stored) as PremiumThemeName | null;
          
          // Premium değilse ve premium tema seçiliyse, Classic (null) yap
          if (!isPremium && theme !== null) {
            console.log('User is not premium, resetting premium theme to Classic');
            setPremiumThemeState(null);
            await AsyncStorage.setItem(PREMIUM.THEME_STORAGE_KEY, JSON.stringify(null));
            return;
          }
          
          // Geçerli bir tema ise yükle, değilse sıfırla
          if (theme) {
            // Her iki tema setini de kontrol et (light ve dark)
            if (premiumLightThemes[theme] || premiumDarkThemes[theme]) {
              setPremiumThemeState(theme);
            } else {
              // Geçersiz tema, temizle
              console.warn(`Invalid stored premium theme: ${theme}, clearing`);
              await AsyncStorage.setItem(PREMIUM.THEME_STORAGE_KEY, JSON.stringify(null));
              setPremiumThemeState(null);
            }
          } else {
            setPremiumThemeState(null);
          }
        }
      } catch (error) {
        console.error('Error loading premium theme:', error);
        // Hata durumunda temizle
        setPremiumThemeState(null);
      }
    };
    loadPremiumTheme();
  }, [isPremium]); // isPremium değiştiğinde de kontrol et

      // Premium durumu değiştiğinde kontrol et: Eğer premium değilse ve premium tema seçiliyse, temayı varsayılan (Classic/null) yap
      useEffect(() => {
        const checkPremiumThemeAccess = async () => {
          if (!isPremium && premiumTheme !== null) {
            // Premium değil ama premium tema seçili, temayı varsayılan (Classic/null) yap
            console.log('Premium status expired, resetting to Classic theme');
            setPremiumThemeState(null);
            try {
              // AsyncStorage'dan premium tema bilgisini kaldır ve varsayılan (null) yap
              await AsyncStorage.setItem(PREMIUM.THEME_STORAGE_KEY, JSON.stringify(null));
            } catch (error) {
              console.error('Error resetting premium theme to Classic:', error);
            }
          }
        };
        checkPremiumThemeAccess();
      }, [isPremium, premiumTheme]);

  // Aktif renkleri belirle
  const isDark = mode === 'dark';
  let colors: Colors;
  
  if (premiumTheme) {
    // Premium tema seçilmişse onu kullan
    const premiumThemes = isDark ? premiumDarkThemes : premiumLightThemes;
    const selectedTheme = premiumThemes[premiumTheme];
    
    // Geçerli bir tema yoksa (eski tema isimleri vs.) varsayılan temaya dön
    if (selectedTheme) {
      colors = selectedTheme;
    } else {
      // Geçersiz tema, varsayılan temaya dön ve temayı sıfırla
      console.warn(`Invalid premium theme: ${premiumTheme}, falling back to default`);
      setPremiumThemeState(null);
      colors = isDark ? darkColors : lightColors;
    }
  } else {
    // Varsayılan tema
    colors = isDark ? darkColors : lightColors;
  }

  const handleSetMode = useCallback(async (newMode: ThemeMode) => {
    setModeState(newMode);
    // Kullanıcının seçimini AsyncStorage'a kaydet
    try {
      await AsyncStorage.setItem(PREMIUM.THEME_MODE_STORAGE_KEY, JSON.stringify(newMode));
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  }, []);

  const handleSetPremiumTheme = useCallback(async (theme: PremiumThemeName | null) => {
    try {
      // Premium kontrolü: Eğer premium değilse ve premium tema seçmeye çalışıyorsa, engelle
      if (theme && !isPremium) {
        console.warn('Attempted to set premium theme without premium subscription');
        return; // Premium değilse tema seçimini engelle
      }
      
      // Geçerli bir tema ise kaydet
      if (theme) {
        const premiumThemes = mode === 'dark' ? premiumDarkThemes : premiumLightThemes;
        if (!premiumThemes[theme]) {
          console.warn(`Invalid premium theme: ${theme}`);
          theme = null;
        }
      }
      
      setPremiumThemeState(theme);
      
      // Tema bilgisini kaydet (null ise de kaydet, böylece varsayılan temaya döner)
      await AsyncStorage.setItem(PREMIUM.THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch (error) {
      console.error('Error saving premium theme:', error);
    }
  }, [mode, isPremium]);

  return (
    <ThemeContext.Provider
      value={{
        colors,
        mode,
        setMode: handleSetMode,
        isDark,
        premiumTheme,
        setPremiumTheme: handleSetPremiumTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

