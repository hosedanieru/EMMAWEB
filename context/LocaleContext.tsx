"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type Dictionary, type Locale } from "@/lib/i18n/dictionary";

const STORAGE_KEY = "emma-locale";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: Dictionary;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  // El idioma guardado se lee DESPUÉS de montar, nunca durante el render.
  // En el servidor no existe localStorage, así que si el primer render usara
  // el valor guardado, el HTML del servidor (siempre "es") no coincidiría con
  // el del navegador y React tumbaría la hidratación.
  //
  // La regla set-state-in-effect avisa del render extra que esto provoca, y
  // en general tiene razón. Acá es inevitable y el costo es un solo render de
  // más al cargar la página.
  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado === "es" || guardado === "en") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(guardado);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(nuevo: Locale) {
    setLocaleState(nuevo);
    localStorage.setItem(STORAGE_KEY, nuevo);
  }

  function toggleLocale() {
    setLocale(locale === "es" ? "en" : "es");
  }

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, toggleLocale, t: dictionaries[locale] }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale debe usarse dentro de <LocaleProvider>");
  }
  return ctx;
}
