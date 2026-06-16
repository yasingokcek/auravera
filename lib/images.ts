/**
 * Stok görsel URL'leri. LoremFlickr anahtar-kelime bazlı gerçek fotoğraflar döndürür
 * (CDN düşerse arka plan gradyanı devreye girer — kırık görsel olmaz).
 * Avatarlar randomuser.me'den (yüksek güvenilirlik).
 *
 * NOT: Bunlar geçici stok görsellerdir. Kendi marka/klinik fotoğraflarınızı
 * bu dosyadaki URL'lerle değiştirerek kolayca güncelleyebilirsiniz.
 */
const flickr = (kw: string, lock: number, w = 800, h = 600) =>
  `https://loremflickr.com/${w}/${h}/${kw}?lock=${lock}`;

export const IMG = {
  hero: flickr("hospital,doctor", 21, 900, 800),
  istanbul: flickr("istanbul,city", 7, 900, 700),
  cta: flickr("hospital,medical", 12, 1400, 600),
  tx: {
    sac_ekimi: flickr("hair,barber", 31),
    dis: flickr("dentist,teeth", 32),
    estetik: flickr("beauty,face", 33),
    obezite: flickr("fitness,health", 34),
    tup_bebek: flickr("baby,family", 35),
    goz: flickr("eye,vision", 36),
  } as Record<string, string>,
  clinic: [
    flickr("hospital,interior", 41),
    flickr("clinic,medical", 42),
    flickr("doctor,surgery", 43),
    flickr("hospital,room", 44),
    flickr("laboratory,medical", 45),
    flickr("clinic,reception", 46),
  ],
};

export const avatar = (gender: "men" | "women", n: number) =>
  `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;
