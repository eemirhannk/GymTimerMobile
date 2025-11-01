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
    trackTrue: '#10B981', // Light Green (for speech mode)
    thumb: '#FFFFFF', // White thumb
    iosBackground: '#E5E7EB', // Light Gray
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
    trackTrue: '#10B981', // Dark Green (for speech mode)
    thumb: '#FFFFFF', // Very Light Gray/White
    iosBackground: '#4B5563', // Dark Gray
  },
};

