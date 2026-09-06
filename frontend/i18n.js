import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import baseLanguageEN from '@/locales/en/base_language.json';
import baseLanguageFR from '@/locales/fr/base_language.json';
import baseLanguageUS from '@/locales/us/base_language.json';
import baseLanguageES from '@/locales/es/base_language.json';
import baseLanguageDE from '@/locales/de/base_language.json';
import baseLanguagePT from '@/locales/pt/base_language.json';
import baseLanguageMG from '@/locales/mg/base_language.json';
import baseLanguageRU from '@/locales/ru/base_language.json';
import baseLanguageIT from '@/locales/it/base_language.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { baseLanguage: baseLanguageEN },
      fr: { baseLanguage: baseLanguageFR },
      us: { baseLanguage: baseLanguageUS },
      es: { baseLanguage: baseLanguageES },
      de: { baseLanguage: baseLanguageDE },
      pt: { baseLanguage: baseLanguagePT },
      mg: { baseLanguage: baseLanguageMG },
      ru: { baseLanguage: baseLanguageRU },
      it: { baseLanguage: baseLanguageIT },
    },
    lng: 'fr',
    fallbackLng: 'fr',
    defaultNS: 'baseLanguage',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
