import { create } from 'zustand';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark';
  }
  return mode === 'dark';
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: 'system',
  isDark: resolveIsDark('system'),
  setMode: (mode) => set({ mode, isDark: resolveIsDark(mode) }),
  toggle: () => {
    const current = get().isDark ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    set({ mode: next, isDark: next === 'dark' });
  },
}));
