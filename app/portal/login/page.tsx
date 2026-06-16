"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Logo from "@/components/Logo";

export default function PortalLogin() {
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
      setErr("Giriş başarısız: " + error.message);
      return;
    }
    router.push("/portal");
    router.refresh();
  }

  return (
    <main className="container" style={{ maxWidth: 420, paddingTop: 70 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Logo size={36} />
      </div>
      <div className="card">
        <h2 style={{ fontSize: "1.3rem" }}>Klinik Portalı</h2>
        <p className="sub" style={{ color: "#5b6675", margin: "4px 0 16px" }}>
          Size atanan hasta lead'lerini görüntüleyin ve yönetin.
        </p>
        {err && <div className="alert error">{err}</div>}
        <form onSubmit={login}>
          <div className="field">
            <label>E-posta</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Parola</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <p style={{ marginTop: 14, fontSize: "0.85rem" }}>
          <a href="/">← Ana sayfa</a>
        </p>
      </div>
    </main>
  );
}
