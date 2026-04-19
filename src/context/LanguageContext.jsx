import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { themeOptions } from '../theme';

const LanguageContext = createContext();

const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const ltrCache = createCache({
  key: 'mui',
});

const RTL_LANGUAGES = ['he', 'ar'];

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || 'en');

  const isRtl = RTL_LANGUAGES.includes(language);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRtl]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const theme = useMemo(() => {
    return createTheme({
      ...themeOptions,
      direction: isRtl ? 'rtl' : 'ltr',
      typography: {
        ...themeOptions.typography,
        fontFamily: isRtl
          ? '"Noto Sans Hebrew", "Inter", "Roboto", "Helvetica", "Arial", sans-serif'
          : '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      },
    });
  }, [isRtl]);

  const cache = isRtl ? rtlCache : ltrCache;

  const value = useMemo(
    () => ({ language, changeLanguage, isRtl }),
    [language, isRtl]
  );

  return (
    <LanguageContext.Provider value={value}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </CacheProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
