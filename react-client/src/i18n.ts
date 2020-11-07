import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import enGB from "locales/enGB.json";
import cy from "locales/cy.json";

import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            "en-GB": {
                translation: enGB
            },
            "cy": {
                translation: cy
            }
        },
        fallbackLng: "en-GB",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;