import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en';
import ne from './locales/ne';
const resources = {
    en: { translation: en },
    ne: { translation: ne },
    }

// Get device language - falls back to 'en' if not Nepali
const  deviceLanguage = Localization.getLocales()[0].languageCode ?? 'en';;

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON : 'v4',
        resources,
        lng: deviceLanguage,
        fallbackLng: 'en',
        interpolation:{ 
            escapeValue: false,
        }
    });
export default i18n;