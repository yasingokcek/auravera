"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DICT, RTL_LANGS, type Lang } from "@/lib/i18n";

function applyDir(l: Lang) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = l;
    document.documentElement.dir = RTL_LANGS.includes(l) ? "rtl" : "ltr";
  }
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };
const LangCtx = createContext<Ctx>({ lang: "tr", setLang: () => {}, t: (k) => k });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr");

  useEffect(() => {
    const saved = (typeof window !== "undefined" &&
      localStorage.getItem("av_lang")) as Lang | null;
    if (saved && DICT[saved]) {
      setLangState(saved);
      applyDir(saved);
    } else {
      const nav = navigator.language?.slice(0, 2) as Lang;
      if (DICT[nav]) {
        setLangState(nav);
        applyDir(nav);
      }
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("av_lang", l);
    applyDir(l);
  }

  const t = (k: string) => DICT[lang][k] ?? DICT.tr[k] ?? k;

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
