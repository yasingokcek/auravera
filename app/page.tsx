import Logo from "@/components/Logo";
import LeadFunnel from "@/components/LeadFunnel";
import CostCalculator from "@/components/CostCalculator";

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="inner">
          <Logo size={32} />
          <nav className="nav-links">
            <a href="#hesapla">Maliyet</a>
            <a href="#nasil">Nasıl Çalışır</a>
            <a href="#neden">Neden AuraVera</a>
            <a href="#klinikler">Klinikler İçin</a>
            <a className="btn-ghost" href="/portal/login">
              Klinik Girişi
            </a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <span className="eyebrow">● Akredite klinikler · ücretsiz danışmanlık</span>
          <h1>
            Doğru kliniği bulmanın <span className="grad">en kolay</span> ve
            güvenilir yolu
          </h1>
          <p className="lead">
            Saç ekimi, diş, estetik, obezite ve tüp bebek tedavilerinde
            akredite hastanelerle eşleşin. Tek formla birden çok klinikten
            şeffaf teklif, 5 dakikada geri dönüş.
          </p>
          <div className="badges">
            <span className="badge">🏥 Akredite Hastaneler</span>
            <span className="badge">⚡ 5 Dakikada Dönüş</span>
            <span className="badge">🌍 Çok Dilli Destek</span>
            <span className="badge">🔒 KVKK & GDPR</span>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="split" id="hesapla">
          <div style={{ display: "grid", gap: 20 }}>
            <CostCalculator />
            <div className="stat-row">
              <div className="stat"><div className="num">40+</div><div className="label">Ülkeden Hasta</div></div>
              <div className="stat"><div className="num">6</div><div className="label">Tedavi Alanı</div></div>
              <div className="stat"><div className="num">&lt;5dk</div><div className="label">İlk Dönüş</div></div>
              <div className="stat"><div className="num">%100</div><div className="label">Şeffaf Fiyat</div></div>
            </div>
          </div>

          <div id="basvuru">
            <LeadFunnel />
          </div>
        </div>
      </div>

      <section className="section soft" id="neden">
        <div className="container">
          <h2>Neden AuraVera?</h2>
          <p className="muted">
            Yüzlerce kliniği tek tek araştırmak yerine, size en uygun seçenekleri
            biz getiriyoruz.
          </p>
          <div className="grid-3">
            <div className="feature">
              <div className="icon">🎯</div>
              <h3>Tarafsız Eşleştirme</h3>
              <p>Tek formla birden çok akredite klinikten teklif alın; tarafsız karşılaştırın.</p>
            </div>
            <div className="feature">
              <div className="icon">💸</div>
              <h3>Şeffaf Fiyat</h3>
              <p>Gizli ücret yok. Maliyet hesaplayıcı ile baştan net fiyat aralığı.</p>
            </div>
            <div className="feature">
              <div className="icon">🛬</div>
              <h3>Uçtan Uca Concierge</h3>
              <p>Tercüman, VIP transfer, konaklama ve tedavi sonrası takip dahil.</p>
            </div>
            <div className="feature">
              <div className="icon">✅</div>
              <h3>Doğrulanmış Klinikler</h3>
              <p>Yalnızca sertifikalı, akredite kuruluşlar. Dolandırıcılığa son.</p>
            </div>
            <div className="feature">
              <div className="icon">🔒</div>
              <h3>Veri Güvenliği</h3>
              <p>Bilgileriniz yalnızca onayladığınız kliniklerle paylaşılır (KVKK/GDPR).</p>
            </div>
            <div className="feature">
              <div className="icon">💬</div>
              <h3>7/24 Destek</h3>
              <p>WhatsApp üzerinden kendi dilinizde hızlı iletişim.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="nasil">
        <div className="container">
          <h2>Nasıl Çalışır?</h2>
          <p className="muted">Üç adımda doğru klinikle eşleşin.</p>
          <div className="grid-3">
            <div className="feature">
              <div className="icon">1️⃣</div>
              <h3>Formu Doldurun</h3>
              <p>Tedavi, bütçe ve zaman planınızı 60 saniyede paylaşın.</p>
            </div>
            <div className="feature">
              <div className="icon">2️⃣</div>
              <h3>Eşleşin</h3>
              <p>Sistemimiz sizi en uygun akredite kliniklere yönlendirir.</p>
            </div>
            <div className="feature">
              <div className="icon">3️⃣</div>
              <h3>Teklif Alın</h3>
              <p>Danışmanınız 5 dakika içinde arar, şeffaf teklif sunar.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft" id="klinikler">
        <div className="container">
          <h2>Klinikler & Estetik Merkezleri için</h2>
          <p className="muted">
            Size <strong>doğrulanmış, dereceli (A–D) ve nitelikli</strong>{" "}
            uluslararası hasta lead'leri sağlıyoruz. Yalnızca işinize uygun
            gerçek hastalara ödeme yaparsınız.
          </p>
          <div className="grid-3">
            <div className="feature">
              <div className="icon">🎯</div>
              <h3>Nitelikli Lead</h3>
              <p>Tedavi, bütçe, zaman ve ülke ile skorlanmış sıcak hastalar.</p>
            </div>
            <div className="feature">
              <div className="icon">🔐</div>
              <h3>Ping/Post Gizlilik</h3>
              <p>Bilgileri önizleyin; yalnızca satın aldığınızda iletişim açılır.</p>
            </div>
            <div className="feature">
              <div className="icon">💳</div>
              <h3>Kredi & İade</h3>
              <p>Önden yüklenen bakiye, lead başına ücret, geçersiz lead için iade.</p>
            </div>
          </div>
          <div style={{ marginTop: 26 }}>
            <a className="btn-ghost" href="/portal/login">
              Klinik Portalına Giriş →
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <Logo size={28} />
          <p style={{ marginTop: 12, maxWidth: 560 }}>
            AuraVera, uluslararası hastaları akredite sağlık kuruluşlarıyla
            buluşturan bir sağlık turizmi platformudur.
          </p>
          <p style={{ marginTop: 10 }}>
            <a href="/privacy">Aydınlatma & Gizlilik</a> ·{" "}
            <a href="/portal/login">Klinik Girişi</a> · ©{" "}
            {new Date().getFullYear()} AuraVera
          </p>
        </div>
      </footer>
    </>
  );
}
