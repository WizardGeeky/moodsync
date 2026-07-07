import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  APP_THEMES,
  DEFAULT_MODE,
  DEFAULT_THEME_ID,
  type AppMode,
  type AppThemeId,
  type AppThemePalette,
  type ModeColors,
} from '@/constants/themes';

const STORAGE_KEY = 'moodsync.theme-preference';

type AppThemeContextValue = {
  theme: AppThemePalette;
  themeId: AppThemeId;
  setThemeId: (id: AppThemeId) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  colors: ModeColors;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function isAppThemeId(value: unknown): value is AppThemeId {
  return typeof value === 'string' && APP_THEMES.some((candidate) => candidate.id === value);
}

function isAppMode(value: unknown): value is AppMode {
  return value === 'dark' || value === 'light';
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [themeId, setThemeIdState] = useState<AppThemeId>(DEFAULT_THEME_ID);
  const [mode, setModeState] = useState<AppMode>(DEFAULT_MODE);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null) return;
        const { themeId: storedThemeId, mode: storedMode } = parsed as Record<string, unknown>;
        if (isAppThemeId(storedThemeId)) setThemeIdState(storedThemeId);
        if (isAppMode(storedMode)) setModeState(storedMode);
      })
      .catch(() => {});
  }, []);

  const setThemeId = useCallback(
    (id: AppThemeId) => {
      setThemeIdState(id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ themeId: id, mode })).catch(() => {});
    },
    [mode],
  );

  const setMode = useCallback(
    (nextMode: AppMode) => {
      setModeState(nextMode);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ themeId, mode: nextMode })).catch(() => {});
    },
    [themeId],
  );

  const value = useMemo<AppThemeContextValue>(() => {
    const theme = APP_THEMES.find((candidate) => candidate.id === themeId) ?? APP_THEMES[0];
    return { theme, themeId, setThemeId, mode, setMode, colors: theme[mode] };
  }, [themeId, mode, setThemeId, setMode]);

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return context;
}
