import Logo from "@/components/Logo";
import LeadFunnel from "@/components/LeadFunnel";

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="inner">
          <Logo size={32} />
          <nav className="nav-links">
            <a href="#tedaviler">Tedaviler</a>
            <a href="#nasil">Nasıl Çalışır</a>
            <a href="#klinikler">Klinikler İçin</a>
            <a className="btn-ghost" href="/portal/login">
              Klinik Girişi
            </a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="tagline">True care. Radiant results.</div>
          <h1>
            Sağlığınız için <span className="gold">doğru kliniği</span> bulmanın
            güvenilir yolu
          </h1>
          <p className="lead">
            Saç ekimi, diş, estetik, obezite ve tüp bebek tedavilerinde akredite
            hastaneler ve uzman doktorlarla eşleşin. Ücretsiz ön değerlendirme,
            şeffaf fiyat, uçtan uca tercüman desteği.
          </p>
          <div className="badges">
            <span className="badge">🏥 Akredite Hastaneler</span>
            <span className="badge">⚡ 5 Dakikada Geri Dönüş</span>
            <span className="badge">🌍 Çok Dilli Destek</span>
            <span className="badge">🔒 KVKK & GDPR Uyumlu</span>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="split">
          <div>
            <div className="stat-row" style={{ marginTop: 0 }}>
              <div className="stat">
                <div className="num">40+</div>
                <div className="label">Ülkeden Hasta</div>
              </div>
              <div className="stat">
                <div className="num">6</div>
                <div className="label">Tedavi Alanı</div>
              </div>
              <div className="stat">
                <div className="num">&lt;5dk</div>
                <div className="label">İlk Dönüş Süresi</div>
              </div>
              <div className="stat">
                <div className="num">%100</div>
                <div className="label">Şeffaf Fiyat</div>
              </div>
            </div>

            <div className="grid-3" id="tedaviler" style={{ marginTop: 26 }}>
              <div className="feature">
                <div className="icon">🩺</div>
                <h3>Kişiye Özel Plan</h3>
                <p>Tıbbi geçmişinize göre ücretsiz ön değerlendirme ve net teklif.</p>
              </div>
              <div className="feature">
                <div className="icon">🛬</div>
                <h3>All-Inclusive</h3>
                <p>Konaklama, VIP transfer, tercüman ve tedavi sonrası takip.</p>
              </div>
              <div className="feature">
                <div className="icon">⭐</div>
                <h3>Güvence</h3>
                <p>Sertifikalı doktorlar, akredite klinikler, gizli ücret yok.</p>
              </div>
            </div>
          </div>

          <div id="basvuru">
            <LeadFunnel />
          </div>
        </div>
      </div>

      <section className="section" id="nasil" style={{ background: "#fff" }}>
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

      <section className="section" id="klinikler">
        <div className="container">
          <h2>Klinikler & Estetik Merkezleri için</h2>
          <p className="muted">
            AuraVera, size <strong>doğrulanmış, dereceli (A–D) ve nitelikli</strong>{" "}
            uluslararası hasta lead'leri sağlar. Yalnızca işinize uygun, gerçek
            ilgili hastalara ödeme yaparsınız.
          </p>
          <div className="grid-3">
            <div className="feature">
              <div className="icon">🎯</div>
              <h3>Nitelikli Lead</h3>
              <p>
                Tedavi, bütçe, zaman ve ülke bilgisiyle skorlanmış; A sınıfı sıcak
                hastalar.
              </p>
            </div>
            <div className="feature">
              <div className="icon">🔐</div>
              <h3>Ping/Post Gizlilik</h3>
              <p>
                Hasta bilgilerini görmeden önizleyin; yalnızca satın aldığınızda
                iletişim açılır.
              </p>
            </div>
            <div className="feature">
              <div className="icon">💳</div>
              <h3>Kredi & İade</h3>
              <p>
                Önden yüklenen bakiye, lead başına ücret ve geçersiz lead'ler için
                iade sistemi.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <a className="btn-ghost" href="/portal/login">
              Klinik Portalına Giriş →
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <Logo size={28} light />
          <p style={{ marginTop: 12, maxWidth: 560 }}>
            AuraVera, uluslararası hastaları akredite sağlık kuruluşlarıyla
            buluşturan bir sağlık turizmi platformudur.
          </p>
          <p style={{ marginTop: 10 }}>
            <a href="/privacy">Aydınlatma & Gizlilik</a> ·{" "}
            <a href="/portal/login">Klinik Girişi</a> ·{" "}
            © {new Date().getFullYear()} AuraVera
          </p>
        </div>
      </footer>
    </>
  );
}
