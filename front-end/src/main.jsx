import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { THEME_KEY } from './utils/constants';
import './index.css';
import App from './App.jsx';

const initTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  const theme =
    stored === 'dark' || stored === 'light'
      ? stored
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
};

initTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
