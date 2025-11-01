import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { lightColors, darkColors, Colors } from './colors';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  colors: Colors;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [userSetMode, setUserSetMode] = useState<ThemeMode | null>(null);
  
  // İlk mount'ta: kullanıcı manuel set ettiyse onu kullan, yoksa sistem temasını kullan
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const appearanceScheme = Appearance.getColorScheme();
    return appearanceScheme === 'dark' ? 'dark' : 'light';
  });

  // Aktif renkleri belirle
  const isDark = mode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  // İlk mount'ta ve sistem teması değiştiğinde güncelle (sadece kullanıcı manuel set etmemişse)
  useEffect(() => {
    if (userSetMode === null) {
      // Önce Appearance API'sini kontrol et (daha güvenilir)
      const appearanceScheme = Appearance.getColorScheme();
      const currentScheme = appearanceScheme || systemColorScheme;
      
      if (currentScheme) {
        const newMode = currentScheme === 'dark' ? 'dark' : 'light';
        setModeState(newMode);
      }
    }
  }, [systemColorScheme, userSetMode]);

  // Appearance değişikliğini dinle (sadece kullanıcı manuel set etmemişse)
  useEffect(() => {
    if (userSetMode === null) {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        if (colorScheme) {
          const newMode = colorScheme === 'dark' ? 'dark' : 'light';
          setModeState(newMode);
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, [userSetMode]);

  const handleSetMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    setUserSetMode(newMode); // Kullanıcı manuel değiştirdi
  }, []);

  return (
    <ThemeContext.Provider value={{ colors, mode, setMode: handleSetMode, isDark }}>
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

