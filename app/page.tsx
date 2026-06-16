import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <main>
      <section className="container hero">
        <h1>
          Türkiye'de <span>Güvenli Sağlık Turizmi</span>
          <br />
          Uluslararası Standartlarda Tedavi
        </h1>
        <p>
          Saç ekimi, diş tedavisi, estetik ve obezite cerrahisinde anlaşmalı
          akredite hastaneler, uzman doktorlar ve uçtan uca tercüman destekli
          hizmet. Ücretsiz ön değerlendirme alın.
        </p>
        <div className="badges">
          <span className="badge">✈️ Havalimanı & Transfer</span>
          <span className="badge">🏥 Akredite Hastaneler</span>
          <span className="badge">🌍 Çok Dilli Destek</span>
          <span className="badge">💬 7/24 İletişim</span>
        </div>
      </section>

      <section className="container layout">
        <div className="features">
          <div className="feature">
            <div className="icon">🩺</div>
            <div>
              <h3>Kişiye Özel Tedavi Planı</h3>
              <p>
                Tıbbi geçmişinize göre uzman doktorlarımızdan ücretsiz ön
                değerlendirme ve net fiyat teklifi.
              </p>
            </div>
          </div>
          <div className="feature">
            <div className="icon">🛬</div>
            <div>
              <h3>All-Inclusive Paketler</h3>
              <p>
                Konaklama, VIP transfer, tercüman ve tedavi sonrası takip tek
                bir pakette.
              </p>
            </div>
          </div>
          <div className="feature">
            <div className="icon">🔒</div>
            <div>
              <h3>Güvence & Şeffaflık</h3>
              <p>
                Akredite hastaneler, sertifikalı doktorlar ve gizli ücret
                olmayan şeffaf fiyatlandırma.
              </p>
            </div>
          </div>
          <div className="feature">
            <div className="icon">⭐</div>
            <div>
              <h3>Binlerce Mutlu Hasta</h3>
              <p>
                40+ ülkeden hastaya hizmet veren deneyimli ekibimizle yanınızdayız.
              </p>
            </div>
          </div>
        </div>

        <LeadForm />
      </section>

      <footer>
        © {new Date().getFullYear()} AuraVera Sağlık Turizmi · Tüm hakları saklıdır.
      </footer>
    </main>
  );
}
