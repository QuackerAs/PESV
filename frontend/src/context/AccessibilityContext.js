import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'pesv-accessibility';
const defaults = { theme: 'light', highContrast: false, largeText: false, readableFont: false, reduceMotion: false };
const AccessibilityContext = createContext(null);

const loadPreferences = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaults, ...(stored && typeof stored === 'object' ? stored : {}) };
  } catch {
    return defaults;
  }
};

export const AccessibilityProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(loadPreferences);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = preferences.theme;
    root.dataset.contrast = String(preferences.highContrast);
    root.classList.toggle('a11y-large-text', preferences.largeText);
    root.classList.toggle('a11y-readable-font', preferences.readableFont);
    root.classList.toggle('a11y-reduce-motion', preferences.reduceMotion);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const value = useMemo(() => ({
    preferences,
    setPreference: (name, value) => setPreferences((current) => ({ ...current, [name]: value })),
    resetPreferences: () => setPreferences(defaults)
  }), [preferences]);

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility debe usarse dentro de AccessibilityProvider');
  return context;
};
