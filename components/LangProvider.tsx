"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DICT, type Lang } from "@/lib/i18n";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };
const LangCtx = createContext<Ctx>({ lang: "tr", setLang: () => {}, t: (k) => k });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tr");

  useEffect(() => {
    const saved = (typeof window !== "undefined" &&
      localStorage.getItem("av_lang")) as Lang | null;
    if (saved && DICT[saved]) setLangState(saved);
    else {
      const nav = navigator.language?.slice(0, 2) as Lang;
      if (DICT[nav]) setLangState(nav);
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("av_lang", l);
    document.documentElement.lang = l;
  }

  const t = (k: string) => DICT[lang][k] ?? DICT.tr[k] ?? k;

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
