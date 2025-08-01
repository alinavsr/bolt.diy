import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6B73FF',
    primaryContainer: '#E1E3FF',
    secondary: '#FF9F43',
    secondaryContainer: '#FFE4CC',
    tertiary: '#FF6B9D',
    tertiaryContainer: '#FFE1EC',
    surface: '#F8F4F0',
    surfaceVariant: '#F0EBE6',
    background: '#FEFCF8',
    outline: '#D4C4B0',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#2C2C2C',
    onBackground: '#2C2C2C',
    error: '#FF6B6B',
    onError: '#FFFFFF',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: {
      ...MD3LightTheme.fonts.displayLarge,
      fontWeight: '600',
    },
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontWeight: '600',
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontWeight: '500',
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};