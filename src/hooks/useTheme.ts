import { useColorScheme } from 'react-native';
import { useSettingsStore } from '../store';
import { lightTheme, darkTheme } from '../constants/theme';

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const { settings } = useSettingsStore();

  const isDark =
    settings.theme === 'dark' ||
    (settings.theme === 'system' && systemColorScheme === 'dark');

  const theme = isDark ? darkTheme : lightTheme;

  return {
    theme,
    isDark,
  };
}

