export const Colors = {
  primary: '#0052FF',
  primaryDark: '#0041CC',
  primaryLight: '#E6EEFF',

  // Background
  backgroundLight: '#FFFFFF',
  backgroundDark: '#0A0B0D',

  // Surface
  surfaceLight: '#F5F5F5',
  surfaceDark: '#1C1C1E',

  // Text
  textPrimaryLight: '#0A0B0D',
  textPrimaryDark: '#FFFFFF',
  textSecondary: '#6B7280',

  // Status
  success: '#00B300',
  successLight: '#E6FFE6',
  error: '#FF4B4B',
  errorLight: '#FFE6E6',
  warning: '#F59E0B',

  // Tab bar
  tabBarLight: '#FFFFFF',
  tabBarDark: '#131417',

  // Border
  borderLight: '#E5E7EB',
  borderDark: '#2C2C2E',

  // Card
  cardLight: '#FFFFFF',
  cardDark: '#1C1C1E',

  // Overlay
  overlay: 'rgba(0,0,0,0.5)',
} as const;

export type ColorTheme = {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  tabBar: string;
  primary: string;
  success: string;
  error: string;
};

export const lightTheme: ColorTheme = {
  background: Colors.backgroundLight,
  surface: Colors.surfaceLight,
  card: Colors.cardLight,
  text: Colors.textPrimaryLight,
  textSecondary: Colors.textSecondary,
  border: Colors.borderLight,
  tabBar: Colors.tabBarLight,
  primary: Colors.primary,
  success: Colors.success,
  error: Colors.error,
};

export const darkTheme: ColorTheme = {
  background: Colors.backgroundDark,
  surface: Colors.surfaceDark,
  card: Colors.cardDark,
  text: Colors.textPrimaryDark,
  textSecondary: Colors.textSecondary,
  border: Colors.borderDark,
  tabBar: Colors.tabBarDark,
  primary: Colors.primary,
  success: Colors.success,
  error: Colors.error,
};
