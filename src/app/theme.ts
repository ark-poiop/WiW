import type { Theme } from './types';

const THEME_STORAGE_KEY = 'wiw:theme';

export const getStoredTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return (stored as Theme) || 'light';
};

export const setTheme = (theme: Theme) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
  
  // CSS 변수 설정
  const root = document.documentElement;
  if (theme === 'dark') {
    root.style.setProperty('--bg', '#0f0f0f');
    root.style.setProperty('--surface', '#1a1a1a');
    root.style.setProperty('--text', '#ffffff');
    root.style.setProperty('--muted', '#666666');
    root.style.setProperty('--border', '#333333');
    root.style.setProperty('--accent', '#3b82f6');
    root.style.setProperty('--overlay', 'rgba(0, 0, 0, 0.8)');
  } else {
    root.style.setProperty('--bg', '#ffffff');
    root.style.setProperty('--surface', '#f8f9fa');
    root.style.setProperty('--text', '#000000');
    root.style.setProperty('--muted', '#6b7280');
    root.style.setProperty('--border', '#e5e7eb');
    root.style.setProperty('--accent', '#3b82f6');
    root.style.setProperty('--overlay', 'rgba(0, 0, 0, 0.1)');
  }
};

export const initializeTheme = () => {
  const theme = getStoredTheme();
  setTheme(theme);
};
