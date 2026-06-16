import Logo from "@/components/Logo";

export const metadata = { title: "Aydınlatma & Gizlilik — AuraVera" };

export default function Privacy() {
  return (
    <main className="container" style={{ maxWidth: 800, padding: "40px 22px 80px" }}>
      <Logo size={32} />
      <h1 style={{ marginTop: 24, fontSize: "2rem" }}>
        Aydınlatma Metni & Gizlilik Politikası
      </h1>
      <p style={{ color: "#5b6675", marginTop: 8 }}>
        KVKK m.10 ve GDPR Art.13 kapsamında bilgilendirme.
      </p>

      <section style={{ marginTop: 28, lineHeight: 1.75 }}>
        <h2 style={{ fontSize: "1.2rem", marginTop: 22 }}>Veri Sorumlusu</h2>
        <p>
          AuraVera, sağlık turizmi aracılık hizmeti kapsamında hastaları akredite
          sağlık kuruluşlarıyla eşleştirir.
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: 22 }}>İşlenen Veriler</h2>
        <p>
          Ad-soyad, iletişim bilgileri (e-posta, telefon/WhatsApp), ülke/şehir,
          dil tercihi ve ilgilendiğiniz tedaviye ilişkin{" "}
          <strong>özel nitelikli (sağlık) verileriniz</strong>.
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: 22 }}>Amaç ve Hukuki Sebep</h2>
        <p>
          Verileriniz; ücretsiz ön değerlendirme, size uygun klinikle eşleştirme
          ve tedavi danışmanlığı amacıyla, <strong>açık rızanıza</strong>{" "}
          dayanılarak işlenir. Sağlık verisi işleme ve yurt dışı aktarım için
          ayrıca açık rıza alınır.
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: 22 }}>Aktarım Yapılan Taraflar</h2>
        <p>
          Verileriniz, eşleştirildiğiniz <strong>anlaşmalı klinik ve estetik
          merkezleriyle</strong> ve gerekli olduğu ölçüde yurt dışındaki sağlık
          kuruluşlarıyla paylaşılabilir.
        </p>

        <h2 style={{ fontSize: "1.2rem", marginTop: 22 }}>Haklarınız</h2>
        <p>
          KVKK m.11 / GDPR uyarınca verilerinize erişme, düzeltme, silme ve açık
          rızanızı <strong>her zaman geri çekme</strong> hakkına sahipsiniz.
          Talepleriniz için bizimle iletişime geçebilirsiniz.
        </p>
      </section>

      <p style={{ marginTop: 32 }}>
        <a href="/">← Ana sayfaya dön</a>
      </p>
    </main>
  );
}
