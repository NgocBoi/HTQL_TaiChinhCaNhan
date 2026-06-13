import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { THEME_KEY } from '../utils/constants';

export const ThemeContext = createContext(null);

const getInitialTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  const isDark = theme === 'dark';

  const applyTheme = useCallback((nextTheme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setLightTheme = useCallback(() => setTheme('light'), []);
  const setDarkTheme = useCallback(() => setTheme('dark'), []);

  const value = useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme,
      setLightTheme,
      setDarkTheme,
    }),
    [theme, isDark, toggleTheme, setLightTheme, setDarkTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
