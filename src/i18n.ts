/* eslint-disable @typescript-eslint/consistent-type-assertions */
import i18n from "i18next";
import ChainedBackend, { ChainedBackendOptions } from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";
import LocalStorageBackend from "i18next-localstorage-backend";
import { initReactI18next } from "react-i18next";

const getBackend: () => ChainedBackendOptions = () => {
  const backends: any[] = [];
  const backendOptions: any[] = [];

  if (process.env.NODE_ENV === "production") {
    backends.push(LocalStorageBackend);
    backendOptions.push({
      expirationTime: 1 * 24 * 60 * 60 * 1000, // 1 days
    });
  }

  backends.push(HttpBackend);
  backendOptions.push({
    loadPath: "/locales/{{lng}}/{{ns}}.json",
  });

  return { backends, backendOptions };
};

void i18n
  .use(ChainedBackend) // load translation using xhr -> see /public/locales. We will add locales in the next step
  .use(initReactI18next) // pass the i18n instance to react-i18next.
  .init<ChainedBackendOptions>({
    fallbackLng: ["id"],
    supportedLngs: ["id"],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    partialBundledLanguages: true,
    parseMissingKeyHandler: (key, defaultValue) => {
      if (defaultValue != null) return defaultValue;
      return key.replaceAll("_", " ").toTitleCase(false);
    },
    backend: getBackend(),
  });

export default i18n;
