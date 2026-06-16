"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { LangProvider, useLang } from "@/components/LangProvider";

function LoginForm() {
  const { t } = useLang();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr(`${t("portal.loginFail")}: ${error.message}`);
      return;
    }
    router.push("/portal");
    router.refresh();
  }

  return (
    <main className="container" style={{ maxWidth: 420, paddingTop: 70 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Logo size={34} />
        <LanguageSwitcher />
      </div>
      <div className="card">
        <h2 style={{ fontSize: "1.3rem" }}>{t("portal.loginTitle")}</h2>
        <p className="sub" style={{ color: "var(--muted)", margin: "4px 0 16px" }}>
          {t("portal.loginSub")}
        </p>
        {err && <div className="alert error">{err}</div>}
        <form onSubmit={login}>
          <div className="field">
            <label>{t("portal.email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>{t("portal.password")}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? t("portal.signingin") : t("portal.signin")}
          </button>
        </form>
        <p style={{ marginTop: 14, fontSize: "0.85rem" }}>
          <a href="/">{t("portal.home")}</a>
        </p>
      </div>
    </main>
  );
}

export default function PortalLogin() {
  return (
    <LangProvider>
      <LoginForm />
    </LangProvider>
  );
}
