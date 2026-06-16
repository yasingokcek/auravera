"use client";

import Logo from "@/components/Logo";
import LeadFunnel from "@/components/LeadFunnel";
import CostCalculator from "@/components/CostCalculator";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FaqAccordion from "@/components/FaqAccordion";
import Counter from "@/components/Counter";
import TreatmentIcon from "@/components/TreatmentIcon";
import WhatsAppButton from "@/components/WhatsAppButton";
import SimulationTool from "@/components/SimulationTool";
import BmiCalculator from "@/components/BmiCalculator";
import { useLang } from "@/components/LangProvider";

const TX = [
  { slug: "sac_ekimi", icon: "🌱", labels: { tr: "Saç Ekimi", en: "Hair Transplant", de: "Haartransplantation", fr: "Greffe de cheveux", ar: "زراعة الشعر" } },
  { slug: "dis", icon: "🦷", labels: { tr: "Diş & Gülüş", en: "Dental & Smile", de: "Zähne & Lächeln", fr: "Dentaire & Sourire", ar: "الأسنان والابتسامة" } },
  { slug: "estetik", icon: "✨", labels: { tr: "Estetik Cerrahi", en: "Aesthetic Surgery", de: "Ästhetische Chirurgie", fr: "Chirurgie esthétique", ar: "جراحة تجميلية" } },
  { slug: "obezite", icon: "⚖️", labels: { tr: "Obezite", en: "Bariatric", de: "Adipositas", fr: "Bariatrique", ar: "السمنة" } },
  { slug: "tup_bebek", icon: "👶", labels: { tr: "Tüp Bebek / IVF", en: "IVF", de: "IVF", fr: "FIV", ar: "أطفال الأنابيب" } },
  { slug: "goz", icon: "👁️", labels: { tr: "Göz / LASIK", en: "Eye / LASIK", de: "Augen / LASIK", fr: "Yeux / LASIK", ar: "العيون / الليزك" } },
] as const;

export default function HomeContent() {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <>
      <header className="site-header">
        <div className="inner">
          <Logo size={32} />
          <nav className="nav-links">
            <a href="#tedaviler">{t("tx.title")}</a>
            <a href="#hesapla">{t("nav.cost")}</a>
            <a href="/clinics">{t("cl.nav")}</a>
            <a href="#nasil">{t("nav.how")}</a>
            <a href="#klinikler">{t("nav.clinics")}</a>
            <a className="btn-ghost" href="/portal/login">
              {t("nav.login")}
            </a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <span className="eyebrow">● {t("hero.eyebrow")}</span>
          <h1>
            {t("hero.t1")} <span className="grad">{t("hero.grad")}</span>{" "}
            {t("hero.t2")}
          </h1>
          <p className="lead">{t("hero.lead")}</p>
          <div className="badges">
            <span className="badge">{t("hero.b1")}</span>
            <span className="badge">{t("hero.b2")}</span>
            <span className="badge">{t("hero.b3")}</span>
            <span className="badge">{t("hero.b4")}</span>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="split" id="hesapla">
          <div style={{ display: "grid", gap: 20 }}>
            <CostCalculator />
            <div className="stat-row">
              <div className="stat"><div className="num"><Counter to={40} suffix="+" /></div><div className="label">{t("stat.countries")}</div></div>
              <div className="stat"><div className="num"><Counter to={6} /></div><div className="label">{t("stat.areas")}</div></div>
              <div className="stat"><div className="num"><Counter to={5} prefix="<" /></div><div className="label">{t("stat.response")}</div></div>
              <div className="stat"><div className="num"><Counter to={100} suffix="%" /></div><div className="label">{t("stat.transparent")}</div></div>
            </div>
          </div>
          <div id="basvuru">
            <LeadFunnel />
          </div>
        </div>
      </div>

      <section className="section" id="tedaviler">
        <div className="container">
          <h2>{t("tx.title")}</h2>
          <p className="muted">{t("tx.sub")}</p>
          <div className="grid-3">
            {TX.map((x) => (
              <a className="tx-card" key={x.slug} href="#basvuru">
                <div className="tx-icon"><TreatmentIcon slug={x.slug} size={30} /></div>
                <h3>{x.labels[lang]}</h3>
                <p>{t(`tx.${x.slug}.d`)}</p>
                <div className="go">{t("funnel.submit")} →</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft" id="araclar">
        <div className="container">
          <h2>{t("tools.title")}</h2>
          <p className="muted">{t("tools.sub")}</p>
          <div className="split" style={{ marginTop: 8, paddingBottom: 0 }}>
            <SimulationTool />
            <BmiCalculator />
          </div>
        </div>
      </section>

      <section className="section" id="neden">
        <div className="container">
          <h2>{t("why.title")}</h2>
          <p className="muted">{t("why.sub")}</p>
          <div className="grid-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div className="feature" key={i}>
                <div className="icon">{["🎯", "💸", "🛬", "✅", "🔒", "💬"][i - 1]}</div>
                <h3>{t(`why.${i}t`)}</h3>
                <p>{t(`why.${i}d`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="nasil">
        <div className="container">
          <h2>{t("how.title")}</h2>
          <p className="muted">{t("how.sub")}</p>
          <div className="grid-3">
            {[1, 2, 3].map((i) => (
              <div className="feature" key={i}>
                <div className="icon">{["1️⃣", "2️⃣", "3️⃣"][i - 1]}</div>
                <h3>{t(`how.${i}t`)}</h3>
                <p>{t(`how.${i}d`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft" id="klinikler">
        <div className="container">
          <h2>{t("clinics.title")}</h2>
          <p className="muted">{t("clinics.sub")}</p>
          <div className="grid-3">
            {[1, 2, 3].map((i) => (
              <div className="feature" key={i}>
                <div className="icon">{["🎯", "🔐", "💳"][i - 1]}</div>
                <h3>{t(`clinics.${i}t`)}</h3>
                <p>{t(`clinics.${i}d`)}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26 }}>
            <a className="btn-ghost" href="/portal/login">
              {t("clinics.cta")}
            </a>
          </div>
        </div>
      </section>

      <section className="section soft" id="neden-turkiye">
        <div className="container">
          <h2>{t("whyTr.title")}</h2>
          <p className="muted">{t("whyTr.sub")}</p>
          <div className="grid-3">
            {[1, 2, 3, 4].map((i) => (
              <div className="feature" key={i}>
                <div className="icon">{["💸", "👨‍⚕️", "⏱️", "🏖️"][i - 1]}</div>
                <h3>{t(`whyTr.${i}t`)}</h3>
                <p>{t(`whyTr.${i}d`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{t("rev.title")}</h2>
          <p className="muted">{t("rev.sub")}</p>
          <div className="grid-3">
            {[1, 2, 3].map((i) => (
              <div className="review" key={i}>
                <div className="stars">★★★★★</div>
                <p>“{t(`rev.${i}q`)}”</p>
                <div className="who">{t(`rev.${i}n`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <h2 style={{ textAlign: "center" }}>{t("faq.title")}</h2>
          <div style={{ marginTop: 28 }}>
            <FaqAccordion />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>{t("cta.title")}</h2>
            <p>{t("cta.sub")}</p>
            <a className="btn" href="#basvuru">{t("cta.btn")}</a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <Logo size={28} />
          <p style={{ marginTop: 12, maxWidth: 560 }}>{t("footer.desc")}</p>
          <p style={{ marginTop: 10 }}>
            <a href="/privacy">{t("footer.privacy")}</a> ·{" "}
            <a href="/portal/login">{t("footer.login")}</a> · © {year} AuraVera
          </p>
        </div>
      </footer>

      <WhatsAppButton />
    </>
  );
}
