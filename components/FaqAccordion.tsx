"use client";

import { useState } from "react";
import { useLang } from "@/components/LangProvider";

export default function FaqAccordion() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(0);
  const items = [1, 2, 3, 4];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gap: 12 }}>
      {items.map((i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="card"
            style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}
            onClick={() => setOpen(isOpen ? null : i)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "18px 22px",
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              <span>{t(`faq.q${i}`)}</span>
              <span style={{ color: "var(--emerald)", fontSize: "1.4rem", lineHeight: 1 }}>
                {isOpen ? "−" : "+"}
              </span>
            </div>
            {isOpen && (
              <div style={{ padding: "0 22px 18px", color: "var(--muted)" }}>
                {t(`faq.a${i}`)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
