/**
 * Görsel sistemi. Rastgele stok fotoğraf KULLANILMAZ (alakasız görünüyordu).
 * Yalnızca güvenilir, gerçek portreler (randomuser.me, 128px — avatar/küçük kullanım)
 * + tasarlanmış SVG illüstrasyonlar/gradyanlar kullanılır.
 *
 * Kendi marka fotoğraflarınızı eklemek isterseniz buraya URL ekleyip
 * ilgili bileşende kullanabilirsiniz.
 */
export const avatar = (gender: "men" | "women", n: number) =>
  `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;

// Klinik kartları için doktor portreleri (gerçek, güvenilir)
export const DOCTORS = [
  avatar("men", 32), avatar("women", 44), avatar("men", 51),
  avatar("women", 68), avatar("men", 75), avatar("women", 21),
  avatar("men", 11), avatar("women", 90), avatar("men", 46),
  avatar("women", 33), avatar("men", 60), avatar("women", 12),
];

export const REV_AVATARS = [avatar("men", 32), avatar("women", 44), avatar("women", 68)];
