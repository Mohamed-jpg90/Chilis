import i18n from "i18next";
// import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';// npm install i18next-browser-languagedetector
import HttpApi from 'i18next-http-backend'; //npm install i18next-http-backend
import { useTranslation, initReactI18next, Translation } from "react-i18next";

import { cache } from 'react';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "ar"], 
    fallbackLng: "en",
    detection: {
      order: [
          "cookie",
        "htmlTag",
      
        "localStorage",
        "sessionStorage",
        "navigator",
        "path",
        "subdomain"
      ],
      caches: ["cookie"]
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json"
    },
    react: { useSuspense: false }
  });

export default i18n;
