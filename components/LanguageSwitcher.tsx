"use client";

import { useState } from "react";
import { LANGS } from "@/lib/i18n";
import { useLang } from "@/components/LangProvider";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const cur = LANGS.find((l) => l.code === lang) || LANGS[0];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 12px",
          border: "1px solid var(--border)",
          borderRadius: 10,
          background: "#fff",
          cursor: "pointer",
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "var(--ink)",
        }}
      >
        {cur.flag} {cur.code.toUpperCase()} ▾
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(15,23,42,0.1)",
            overflow: "hidden",
            zIndex: 100,
            minWidth: 150,
          }}
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              onMouseDown={() => {
                setLang(l.code);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "10px 14px",
                border: "none",
                background: l.code === lang ? "var(--emerald-soft)" : "#fff",
                cursor: "pointer",
                fontSize: "0.9rem",
                color: "var(--ink)",
                textAlign: "left",
              }}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
