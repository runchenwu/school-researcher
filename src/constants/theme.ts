export const colors = {
  // Primary palette - Sky blue
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  // Accent - Warm coral for CTAs
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
  },
  // Neutrals - Slate based
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  // Semantic
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const lightTheme = {
  background: colors.slate[50],
  surface: '#ffffff',
  surfaceSecondary: colors.slate[100],
  text: colors.slate[900],
  textSecondary: colors.slate[600],
  textMuted: colors.slate[400],
  border: colors.slate[200],
  primary: colors.primary[600],
  primaryLight: colors.primary[100],
  accent: colors.accent[500],
};

export const darkTheme = {
  background: colors.slate[950],
  surface: colors.slate[900],
  surfaceSecondary: colors.slate[800],
  text: colors.slate[50],
  textSecondary: colors.slate[300],
  textMuted: colors.slate[500],
  border: colors.slate[700],
  primary: colors.primary[400],
  primaryLight: colors.primary[900],
  accent: colors.accent[400],
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
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  // Using system fonts for reliability, with nice fallbacks
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 36,
  },
};

