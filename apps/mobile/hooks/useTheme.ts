import { useThemeStore } from '../store/theme.store';
import { lightTheme, darkTheme } from '../constants/colors';

export function useTheme() {
  const { isDark, toggle, setMode, mode } = useThemeStore();
  const colors = isDark ? darkTheme : lightTheme;
  return { isDark, toggle, setMode, mode, colors };
}
