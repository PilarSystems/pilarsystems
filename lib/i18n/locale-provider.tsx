'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { 
  translations, 
  type Locale, 
  type TranslationKeys,
  getDefaultLocale,
  interpolate,
} from './translations';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
  formatMessage: (key: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'pilar-locale';

interface LocaleProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export function LocaleProvider({ children, defaultLocale }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored === 'de' || stored === 'en') {
        return stored;
      }
    }
    return defaultLocale || getDefaultLocale();
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
    }
  }, []);

  // Set document language on mount and locale change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const t = translations[locale];

  /**
   * Format a message by key path with optional interpolation parameters
   * @param keyPath - Dot-separated path to the translation key (e.g., "auth.login")
   * @param params - Optional parameters for interpolation
   * @returns The translated string or the keyPath if not found
   */
  const formatMessage = useCallback((keyPath: string, params?: Record<string, string | number>): string => {
    const keys = keyPath.split('.');
    let result: unknown = translations[locale];
    
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = (result as Record<string, unknown>)[key];
      } else {
        console.warn(`Translation key not found: ${keyPath}`);
        return keyPath;
      }
    }
    
    if (typeof result !== 'string') {
      console.warn(`Translation key does not resolve to string: ${keyPath}`);
      return keyPath;
    }
    
    return params ? interpolate(result, params) : result;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, formatMessage }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextType {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

export { type Locale, type TranslationKeys };
