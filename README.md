# AuraVera — B2B Sağlık Turizmi Hasta-Kazanım Platformu

> **True care. Radiant results.**

AuraVera, uluslararası hastaları (saç ekimi, diş, estetik, obezite, IVF, göz)
**doğrulayıp nitelendirir** ve bu lead'leri klinik & estetik merkezlerine
(B2B müşteriler) eşleştirip satar. Bir lead pazar yeri + CRM.

## Mimari

- **Frontend / API:** Next.js 14 (App Router, TypeScript)
- **Auth (klinik portalı):** Supabase Auth + `@supabase/ssr`
- **Veritabanı:** Supabase Postgres — DeepVera projesi içinde **izole `auravera` şeması**
- `auravera` şeması REST API'ye açık değildir; tüm erişim `public` şemasındaki
  güvenli `SECURITY DEFINER` RPC köprü fonksiyonları üzerinden yapılır.

### Üç yüz
| Yüz | Yol | Erişim |
|-----|-----|--------|
| **Hasta hunisi** | `/` | Herkese açık (anon) — çok adımlı quiz + KVKK rıza |
| **Operasyon paneli** | `/admin` | Parola korumalı (service_role) — lead skorları, atama, klinik & kredi yönetimi |
| **Klinik portalı** | `/portal` | Supabase Auth — ping/post maskeli lead'ler, kredili satın alma, pipeline |

### Çekirdek özellikler
- **Otomatik lead skorlama** (trigger): fit (tedavi LTV × bütçe × zaman × ülke) +
  intent → **A–D derece** ve **sıcak/ılık/soğuk** sınıflandırma.
- **KVKK/GDPR rıza yönetimi:** ayrı aydınlatma + açık rıza onayları (2026/347),
  değişmez rıza snapshot'ı, named-recipient, yurt dışı aktarım rızası.
- **Ping/post gizlilik kapısı:** klinik PII'yi yalnızca lead'i satın aldığında görür.
- **Kredi cüzdanı:** önden yüklenen bakiye, lead başına ücret, işlem geçmişi.
- **Denetim günlüğü:** append-only `lead_events`.

### Veritabanı (özet — `auravera` şeması)
`leads`, `treatments`, `campaigns`, `clinics`, `clinic_preferences`,
`app_users`, `lead_assignments`, `consents`, `lead_events`, `credit_wallets`,
`credit_transactions`, `disputes`.

> DeepVera'nın `public` tablolarına dokunulmaz. Ayrı projeye taşımak için:
> `pg_dump --schema=auravera`.

## Kurulum

```bash
npm install
cp .env.local.example .env.local   # değerleri doldurun
npm run dev
```

### Ortam değişkenleri
| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Proje URL'si (örnek dolu) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | publishable key (örnek dolu) |
| `SUPABASE_SERVICE_ROLE_KEY` | **gizli** — admin paneli (sb_secret_…) |
| `ADMIN_PASSWORD` | `/admin` parolası |

## Klinik portalı kullanıcısı oluşturma
1. Supabase Dashboard → Authentication → **Add user** (e-posta + parola).
2. `/admin` → Klinikler sekmesi → ilgili klinikte **"Kullanıcı Bağla"** → kullanıcının e-postası.
3. Kullanıcı `/portal/login` üzerinden giriş yapar.

Seed ile bir **AuraVera Demo Clinic** (500 USD kredi) ve mevcut lead ona teklif
olarak atanmış durumda gelir.

## Migration'lar
`supabase/migrations/` altındaki SQL dosyaları DeepVera projesine uygulanmıştır.
Yeni projede sıfırdan kurmak için `0001` ve `0002`'yi sırayla çalıştırın.
