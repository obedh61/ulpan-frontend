const localeMap = {
  es: 'es-ES',
  en: 'en-US',
  he: 'he-IL',
};

export const getDateLocale = (lang = 'es') => localeMap[lang] || 'es-ES';

export const formatDate = (dateStr, lang = 'es', options = {}) => {
  if (!dateStr) return null;
  const defaultOptions = { day: 'numeric', month: 'short' };
  return new Date(dateStr).toLocaleDateString(
    getDateLocale(lang),
    { ...defaultOptions, ...options }
  );
};
