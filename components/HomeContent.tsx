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
import IstanbulSkyline from "@/components/IstanbulSkyline";
import { useLang } from "@/components/LangProvider";
import { REV_AVATARS, DOCTORS } from "@/lib/images";

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
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">● {t("hero.eyebrow")}</span>
            <h1>
              {t("hero.t1")} <span className="grad">{t("hero.grad")}</span>{" "}
              {t("hero.t2")}
            </h1>
            <p className="lead">{t("hero.lead")}</p>
            <div className="hero-cta">
              <a className="btn" href="#basvuru">{t("cta.btn")}</a>
              <a className="btn btn-sec" href="#araclar">{t("calc.title").replace("💰 ", "")}</a>
            </div>
            <div className="badges">
              <span className="badge">{t("hero.b1")}</span>
              <span className="badge">{t("hero.b2")}</span>
              <span className="badge">{t("hero.b3")}</span>
              <span className="badge">{t("hero.b4")}</span>
            </div>
          </div>
          <div className="match-panel">
            <div className="mp-title">✦ {t("tx.title")}</div>
            <div className="match-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mc-av" src={DOCTORS[0]} alt="" loading="lazy" />
              <div>
                <div className="mc-name">Nova Hair Clinic</div>
                <div className="mc-meta">İstanbul · JCI</div>
                <div className="mc-rate">★ 4.9</div>
              </div>
              <span className="mc-badge">{t("cl.verified")}</span>
            </div>
            <div className="match-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="mc-av" src={DOCTORS[1]} alt="" loading="lazy" />
              <div>
                <div className="mc-name">Pearl Smile Dental</div>
                <div className="mc-meta">İstanbul · ISO 9001</div>
                <div className="mc-rate">★ 4.9</div>
              </div>
              <span className="mc-badge">{t("cl.verified")}</span>
            </div>
            <div className="chip-row">
              <span className="chip-g">💬 {t("hero.b2")}</span>
              <span className="chip-g">$1,800 – $2,500</span>
            </div>
          </div>
        </div>
      </section>

      <div className="trustbar">
        <div className="inner">
          <span className="trust-logo">🛡️ JCI <span>Accredited</span></span>
          <span className="trust-logo">ISO 9001</span>
          <span className="trust-logo">🏥 T.C. <span>Sağlık Bakanlığı</span></span>
          <span className="trust-logo">ESHRE</span>
          <span className="trust-logo">🔒 GDPR / KVKK</span>
        </div>
      </div>

      <div className="container">
        <div className="split" id="hesapla">
          <div style={{ display: "grid", gap: 20 }}>
            <CostCalculator />
          </div>
          <div id="basvuru">
            <LeadFunnel />
          </div>
        </div>
      </div>

      <section className="stats-dark">
        <div className="container">
          <div className="stat-row">
            <div className="stat"><div className="num"><Counter to={40} suffix="+" /></div><div className="label">{t("stat.countries")}</div></div>
            <div className="stat"><div className="num"><Counter to={6} /></div><div className="label">{t("stat.areas")}</div></div>
            <div className="stat"><div className="num"><Counter to={5} prefix="<" /></div><div className="label">{t("stat.response")}</div></div>
            <div className="stat"><div className="num"><Counter to={100} suffix="%" /></div><div className="label">{t("stat.transparent")}</div></div>
          </div>
        </div>
      </section>

      <section className="section" id="tedaviler">
        <div className="container">
          <span className="section-eyebrow">AuraVera</span>
          <h2>{t("tx.title")}</h2>
          <p className="muted">{t("tx.sub")}</p>
          <div className="grid-3">
            {TX.map((x) => (
              <a className="tx-card" key={x.slug} href="#basvuru">
                <div className="tx-media"><TreatmentIcon slug={x.slug} size={28} /></div>
                <h3 style={{ margin: "0 0 6px" }}>{x.labels[lang]}</h3>
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
          <div className="photo-split">
            <div className="ps-img"><IstanbulSkyline /></div>
            <div>
              <h2>{t("whyTr.title")}</h2>
              <p className="muted" style={{ marginBottom: 22 }}>{t("whyTr.sub")}</p>
              <div className="why-list">
                {[1, 2, 3, 4].map((i) => (
                  <div className="wl" key={i}>
                    <div className="wl-ic">{["💸", "👨‍⚕️", "⏱️", "🏖️"][i - 1]}</div>
                    <div>
                      <h3>{t(`whyTr.${i}t`)}</h3>
                      <p>{t(`whyTr.${i}d`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                <div className="who-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="review-avatar" src={REV_AVATARS[i - 1]} alt="" loading="lazy" />
                  <span className="who" style={{ margin: 0 }}>{t(`rev.${i}n`)}</span>
                </div>
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
          <div className="footer-cols">
            <div>
              <Logo size={30} />
              <p style={{ marginTop: 12, maxWidth: 420 }}>{t("footer.desc")}</p>
            </div>
            <div>
              <h4>{t("tx.title")}</h4>
              {TX.map((x) => (
                <a key={x.slug} href="#basvuru">{x.labels[lang]}</a>
              ))}
            </div>
            <div>
              <h4>AuraVera</h4>
              <a href="/clinics">{t("cl.nav")}</a>
              <a href="#neden">{t("nav.why")}</a>
              <a href="#klinikler">{t("nav.clinics")}</a>
              <a href="/portal/login">{t("footer.login")}</a>
              <a href="/privacy">{t("footer.privacy")}</a>
            </div>
          </div>
          <div className="footer-bottom">© {year} AuraVera · True care. Radiant results.</div>
        </div>
      </footer>

      <WhatsAppButton />
    </>
  );
}
