export const colors = {
  primary: '#174B37',
  primaryDark: '#103629',
  primaryLight: '#2E7D5A',
  ivory: '#F8F7F1',
  white: '#FFFFFF',
  limeAccent: '#B5D96A',
  limeAccentDark: '#9CC155',
  primaryText: '#1D2B23',
  secondaryText: '#758078',
  border: '#E8EAE3',
  surface: '#F8F7F1',
  surfaceElevated: '#FFFFFF',
  success: '#2E7D32',
  warning: '#C08A00',
  error: '#B3261E',
  info: '#174B37',
  muted: '#D8D9D0',
  shadow: 'rgba(16, 54, 41, 0.10)',
  overlay: 'rgba(29, 43, 35, 0.45)',
  demo: '#B5D96A',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 9999,
};

export const typography = {
  fontRegular: 'System',
  fontMedium: 'System',
  fontBold: 'System-Bold',
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  },
};

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const breakpoints = {
  small: 320,
  medium: 375,
  large: 414,
};

export const demoLabel = 'Demo data';

export { POPULAR_CROPS, DEMO_MARKETS, CROP_CATEGORIES, LANGUAGES, ROLES, UNITS, NAV_TABS, API_BASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY } from './index';
