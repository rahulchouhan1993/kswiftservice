import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/translation.json';
import kn from './locales/kn/translation.json';
import hi from './locales/hi/translation.json';
import enO from './locales/overrides/en.json';
import knO from './locales/overrides/kn.json';
import hiO from './locales/overrides/hi.json';

// Merge base translations with overrides
const resources = {
  en: {
    translation: { ...en, ...enO },
  },
  kn: {
    translation: { ...kn, ...knO },
  },
  hi: {
    translation: { ...hi, ...hiO },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
