import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AccentColor = 'blue' | 'purple' | 'green' | 'pink' | 'orange';

export interface ThemeColors {
  // Base colors
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  border: string;
  borderLight: string;

  // Accent colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Status colors
  success: string;
  warning: string;
  error: string;

  // Interactive colors
  upvoteActive: string;
  reactionActive: string;
}

export interface Theme {
  isDark: boolean;
  accentColor: AccentColor;
  colors: ThemeColors;
}

const accentColorMap: Record<AccentColor, { primary: string; light: string; dark: string }> = {
  blue: { primary: '#2196F3', light: '#e3f2fd', dark: '#1976d2' },
  purple: { primary: '#9c27b0', light: '#f3e5f5', dark: '#7b1fa2' },
  green: { primary: '#4caf50', light: '#e8f5e8', dark: '#388e3c' },
  pink: { primary: '#e91e63', light: '#fce4ec', dark: '#c2185b' },
  orange: { primary: '#ff9800', light: '#fff3e0', dark: '#f57c00' },
};

const createTheme = (isDark: boolean, accentColor: AccentColor): ThemeColors => {
  const accent = accentColorMap[accentColor];

  if (isDark) {
    return {
      background: '#121212',
      surface: '#1e1e1e',
      surfaceSecondary: '#2a2a2a',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#333333',
      borderLight: '#404040',
      primary: accent.primary,
      primaryLight: accent.light,
      primaryDark: accent.dark,
      success: '#4caf50',
      warning: '#ff9800',
      error: '#f44336',
      upvoteActive: '#ff6b47',
      reactionActive: accent.primary,
    };
  }

  return {
    background: '#f7f7f7',
    surface: '#ffffff',
    surfaceSecondary: '#f9f9f9',
    text: '#111111',
    textSecondary: '#666666',
    border: '#e6e6e6',
    borderLight: '#f0f0f0',
    primary: accent.primary,
    primaryLight: accent.light,
    primaryDark: accent.dark,
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    upvoteActive: '#ff4500',
    reactionActive: accent.primary,
  };
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setAccentColor: (color: AccentColor) => void;
  isSystemTheme: boolean;
  setSystemTheme: (useSystem: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [accentColor, setAccentColor] = useState<AccentColor>('blue');
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [systemTheme, setSystemTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  // Load saved preferences
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const savedIsSystemTheme = await AsyncStorage.getItem('isSystemTheme');
        const savedAccentColor = await AsyncStorage.getItem('accentColor');
        const savedIsDark = await AsyncStorage.getItem('isDark');

        if (savedIsSystemTheme !== null) {
          setIsSystemTheme(JSON.parse(savedIsSystemTheme));
        }
        if (savedAccentColor) {
          setAccentColor(savedAccentColor as AccentColor);
        }
        if (savedIsDark !== null && !JSON.parse(savedIsSystemTheme || 'true')) {
          setIsDark(JSON.parse(savedIsDark));
        }
      } catch (error) {
        console.error('Error loading theme preferences:', error);
      }
    };

    loadThemePreferences();
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  // Determine current theme
  const currentIsDark = isSystemTheme ? systemTheme === 'dark' : isDark;
  const theme: Theme = {
    isDark: currentIsDark,
    accentColor,
    colors: createTheme(currentIsDark, accentColor),
  };

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    try {
      await AsyncStorage.setItem('isDark', JSON.stringify(newIsDark));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const handleSetAccentColor = async (color: AccentColor) => {
    setAccentColor(color);
    try {
      await AsyncStorage.setItem('accentColor', color);
    } catch (error) {
      console.error('Error saving accent color:', error);
    }
  };

  const handleSetSystemTheme = async (useSystem: boolean) => {
    setIsSystemTheme(useSystem);
    try {
      await AsyncStorage.setItem('isSystemTheme', JSON.stringify(useSystem));
    } catch (error) {
      console.error('Error saving system theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setAccentColor: handleSetAccentColor,
        isSystemTheme,
        setSystemTheme: handleSetSystemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};