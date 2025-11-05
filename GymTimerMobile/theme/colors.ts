export interface Colors {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  cardShadow: string;
  error: string;
  workingBadge: {
    bg: string;
    border: string;
    text: string;
  };
  restBadge: {
    bg: string;
    border: string;
    text: string;
  };
  switch: {
    trackTrue: string;
    thumb: string;
    iosBackground: string;
  };
  // Buton renkleri
  button: {
    start: string;
    pause: string;
    resume: string;
    next: string;
    reset: string;
    finishSet: string;
    finishRest: string;
  };
}

export const lightColors: Colors = {
  primary: '#059669', // Green
  accent: '#3B82F6', // Blue
  background: '#F3F4F6', // Light Gray
  surface: 'white',
  text: '#1F2937', // Dark Gray
  textSecondary: '#6B7280', // Medium Gray
  textTertiary: '#9CA3AF', // Light Gray
  border: '#E5E7EB', // Lighter Gray
  cardShadow: '#000',
  error: '#DC2626', // Red
  workingBadge: {
    bg: '#DCFCE7', // Light Green
    border: '#86EFAC', // Medium Green
    text: '#166534', // Dark Green
  },
  restBadge: {
    bg: '#DBEAFE', // Light Blue
    border: '#93C5FD', // Medium Blue
    text: '#1E40AF', // Dark Blue
  },
  switch: {
    trackTrue: '#10B981', // Light Green
    thumb: '#FFFFFF', // White thumb
    iosBackground: '#E5E7EB', // Light Gray
  },
  button: {
    start: '#059669',
    pause: '#D97706',
    resume: '#059669',
    next: '#7C3AED',
    reset: '#DC2626',
    finishSet: '#10B981',
    finishRest: '#3B82F6',
  },
};

export const darkColors: Colors = {
  primary: '#10B981', // Green
  accent: '#60A5FA', // Blue
  background: '#1F2937', // Dark Gray
  surface: '#374151', // Medium Dark Gray
  text: '#F3F4F6', // Light Gray
  textSecondary: '#9CA3AF', // Medium Light Gray
  textTertiary: '#6B7280', // Darker Gray
  border: '#4B5563', // Even Darker Gray
  cardShadow: '#000',
  error: '#EF4444', // Red
  workingBadge: {
    bg: '#064E3B', // Dark Green
    border: '#34D399', // Medium Green
    text: '#D1FAE5', // Light Green
  },
  restBadge: {
    bg: '#1E3A8A', // Dark Blue
    border: '#60A5FA', // Medium Blue
    text: '#DBEAFE', // Light Blue
  },
  switch: {
    trackTrue: '#10B981', // Dark Green
    thumb: '#FFFFFF', // Very Light Gray/White
    iosBackground: '#4B5563', // Dark Gray
  },
  button: {
    start: '#10B981',
    pause: '#F59E0B',
    resume: '#10B981',
    next: '#8B5CF6',
    reset: '#EF4444',
    finishSet: '#34D399',
    finishRest: '#60A5FA',
  },
};

// Premium Temalar (Light mod için)
export const premiumLightThemes: Record<string, Colors> = {
  azure: {
    primary: '#0891B2', // Cyan - Modern, energetic
    accent: '#06B6D4',
    background: '#F0FDFA', // Mint cream - soft and clean
    surface: '#FFFFFF',
    text: '#0F172A', // Slate - high contrast
    textSecondary: '#475569',
    textTertiary: '#64748B',
    border: '#CBD5E1',
    cardShadow: '#000',
    error: '#DC2626',
    workingBadge: {
      bg: '#CCFBF1',
      border: '#5EEAD4',
      text: '#134E4A',
    },
    restBadge: {
      bg: '#E0F2FE',
      border: '#7DD3FC',
      text: '#0C4A6E',
    },
    switch: {
      trackTrue: '#0891B2',
      thumb: '#FFFFFF',
      iosBackground: '#CBD5E1',
    },
    button: {
      start: '#0891B2',
      pause: '#F59E0B',
      resume: '#0891B2',
      next: '#06B6D4',
      reset: '#DC2626',
      finishSet: '#5EEAD4',
      finishRest: '#7DD3FC',
    },
  },
  ember: {
    primary: '#C2410C', // Deep orange - Warm, sophisticated
    accent: '#EA580C',
    background: '#FFF7ED', // Cream - warm and inviting
    surface: '#FFFFFF',
    text: '#1C1917', // Rich dark
    textSecondary: '#57534E',
    textTertiary: '#78716C',
    border: '#FED7AA',
    cardShadow: '#000',
    error: '#DC2626',
    workingBadge: {
      bg: '#FFF7ED',
      border: '#FDBA74',
      text: '#9A3412',
    },
    restBadge: {
      bg: '#FEF3C7',
      border: '#FCD34D',
      text: '#92400E',
    },
    switch: {
      trackTrue: '#C2410C',
      thumb: '#FFFFFF',
      iosBackground: '#FED7AA',
    },
    button: {
      start: '#C2410C',
      pause: '#F59E0B',
      resume: '#C2410C',
      next: '#EA580C',
      reset: '#DC2626',
      finishSet: '#FDBA74',
      finishRest: '#FCD34D',
    },
  },
  midnight: {
    primary: '#1E40AF', // Deep blue - Professional, calming
    accent: '#3B82F6',
    background: '#EFF6FF', // Soft blue
    surface: '#FFFFFF',
    text: '#1E3A8A', // Deep blue
    textSecondary: '#1E40AF',
    textTertiary: '#2563EB',
    border: '#DBEAFE',
    cardShadow: '#000',
    error: '#DC2626',
    workingBadge: {
      bg: '#DBEAFE',
      border: '#93C5FD',
      text: '#1E40AF',
    },
    restBadge: {
      bg: '#EFF6FF',
      border: '#60A5FA',
      text: '#1E3A8A',
    },
    switch: {
      trackTrue: '#1E40AF',
      thumb: '#FFFFFF',
      iosBackground: '#DBEAFE',
    },
    button: {
      start: '#1E40AF',
      pause: '#F59E0B',
      resume: '#1E40AF',
      next: '#3B82F6',
      reset: '#DC2626',
      finishSet: '#60A5FA',
      finishRest: '#93C5FD',
    },
  },
  slate: {
    primary: '#475569', // Slate gray - Modern, minimal
    accent: '#64748B',
    background: '#F8FAFC', // Soft gray
    surface: '#FFFFFF',
    text: '#0F172A', // Deep slate
    textSecondary: '#334155',
    textTertiary: '#475569',
    border: '#E2E8F0',
    cardShadow: '#000',
    error: '#DC2626',
    workingBadge: {
      bg: '#F1F5F9',
      border: '#CBD5E1',
      text: '#334155',
    },
    restBadge: {
      bg: '#F8FAFC',
      border: '#94A3B8',
      text: '#475569',
    },
    switch: {
      trackTrue: '#475569',
      thumb: '#FFFFFF',
      iosBackground: '#E2E8F0',
    },
    button: {
      start: '#475569',
      pause: '#F59E0B',
      resume: '#475569',
      next: '#64748B',
      reset: '#DC2626',
      finishSet: '#94A3B8',
      finishRest: '#64748B',
    },
  },
};

// Premium Temalar (Dark mod için)
export const premiumDarkThemes: Record<string, Colors> = {
  azure: {
    primary: '#06B6D4', // Cyan - Bright and modern
    accent: '#22D3EE',
    background: '#0F172A', // Deep slate - rich dark
    surface: '#1E293B',
    text: '#F1F5F9', // Light slate
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    border: '#334155',
    cardShadow: '#000',
    error: '#EF4444',
    workingBadge: {
      bg: '#164E63',
      border: '#06B6D4',
      text: '#A5F3FC',
    },
    restBadge: {
      bg: '#0E7490',
      border: '#22D3EE',
      text: '#CFFAFE',
    },
    switch: {
      trackTrue: '#06B6D4',
      thumb: '#FFFFFF',
      iosBackground: '#334155',
    },
    button: {
      start: '#06B6D4',
      pause: '#F59E0B',
      resume: '#06B6D4',
      next: '#22D3EE',
      reset: '#EF4444',
      finishSet: '#5EEAD4',
      finishRest: '#7DD3FC',
    },
  },
  ember: {
    primary: '#EA580C', // Orange - Warm and energetic
    accent: '#FB923C',
    background: '#1C1917', // Rich brown - warm dark
    surface: '#292524',
    text: '#FAFAF9', // Warm white
    textSecondary: '#E7E5E4',
    textTertiary: '#D6D3D1',
    border: '#44403C',
    cardShadow: '#000',
    error: '#EF4444',
    workingBadge: {
      bg: '#7C2D12',
      border: '#F97316',
      text: '#FFEDD5',
    },
    restBadge: {
      bg: '#9A3412',
      border: '#FB923C',
      text: '#FFF7ED',
    },
    switch: {
      trackTrue: '#EA580C',
      thumb: '#FFFFFF',
      iosBackground: '#44403C',
    },
    button: {
      start: '#EA580C',
      pause: '#F59E0B',
      resume: '#EA580C',
      next: '#FB923C',
      reset: '#EF4444',
      finishSet: '#FDBA74',
      finishRest: '#FCD34D',
    },
  },
  midnight: {
    primary: '#3B82F6', // Blue - Professional and calming
    accent: '#60A5FA',
    background: '#1E3A8A', // Deep blue - rich dark
    surface: '#1E40AF',
    text: '#EFF6FF', // Light blue
    textSecondary: '#DBEAFE',
    textTertiary: '#BFDBFE',
    border: '#2563EB',
    cardShadow: '#000',
    error: '#EF4444',
    workingBadge: {
      bg: '#1E40AF',
      border: '#3B82F6',
      text: '#DBEAFE',
    },
    restBadge: {
      bg: '#1E3A8A',
      border: '#60A5FA',
      text: '#EFF6FF',
    },
    switch: {
      trackTrue: '#3B82F6',
      thumb: '#FFFFFF',
      iosBackground: '#2563EB',
    },
    button: {
      start: '#3B82F6',
      pause: '#F59E0B',
      resume: '#3B82F6',
      next: '#60A5FA',
      reset: '#EF4444',
      finishSet: '#93C5FD',
      finishRest: '#60A5FA',
    },
  },
  slate: {
    primary: '#64748B', // Slate gray - Modern and minimal
    accent: '#94A3B8',
    background: '#0F172A', // Deep slate - rich dark
    surface: '#1E293B',
    text: '#F8FAFC', // Light slate
    textSecondary: '#F1F5F9',
    textTertiary: '#E2E8F0',
    border: '#334155',
    cardShadow: '#000',
    error: '#EF4444',
    workingBadge: {
      bg: '#334155',
      border: '#64748B',
      text: '#F1F5F9',
    },
    restBadge: {
      bg: '#475569',
      border: '#94A3B8',
      text: '#F8FAFC',
    },
    switch: {
      trackTrue: '#64748B',
      thumb: '#FFFFFF',
      iosBackground: '#334155',
    },
    button: {
      start: '#64748B',
      pause: '#F59E0B',
      resume: '#64748B',
      next: '#94A3B8',
      reset: '#EF4444',
      finishSet: '#CBD5E1',
      finishRest: '#94A3B8',
    },
  },
};

export type PremiumThemeName = keyof typeof premiumLightThemes;
