import { useState, useEffect } from 'react';
import { getExchangeRates } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const LANG_TO_CURRENCY = { he: 'ILS', en: 'USD', es: 'USD' };
const CURRENCY_SYMBOLS = { ILS: '\u20AA', USD: '$', EUR: '\u20AC' };

let cachedRates = null;
let fetchPromise = null;

const useCurrencyConversion = () => {
  const { language } = useLanguage();
  const [rates, setRates] = useState(cachedRates);
  const preferredCurrency = LANG_TO_CURRENCY[language] || 'USD';

  useEffect(() => {
    if (cachedRates) {
      setRates(cachedRates);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = getExchangeRates()
        .then((res) => {
          cachedRates = res.data.rates;
          return cachedRates;
        })
        .catch(() => null);
    }

    fetchPromise.then((r) => {
      if (r) setRates(r);
    });
  }, []);

  const convert = (amount, fromCurrency) => {
    if (!rates || fromCurrency === preferredCurrency) return null;
    const rate = rates[fromCurrency]?.[preferredCurrency];
    if (!rate) return null;
    return {
      amount: Math.round(amount * rate * 100) / 100,
      currency: preferredCurrency,
      symbol: CURRENCY_SYMBOLS[preferredCurrency] || preferredCurrency,
    };
  };

  const formatConverted = (amount, fromCurrency) => {
    const result = convert(amount, fromCurrency);
    if (!result) return null;
    return `${result.symbol}${result.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${result.currency}`;
  };

  return { convert, formatConverted, preferredCurrency };
};

export default useCurrencyConversion;
