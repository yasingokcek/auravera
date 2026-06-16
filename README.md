# AuraVera — Sağlık Turizmi Lead Toplama Sistemi

Saç ekimi, diş, estetik, obezite vb. tedaviler için uluslararası hasta
başvurularını (lead) toplayan landing page + admin panosu.

## Mimari

- **Frontend / API:** Next.js 14 (App Router, TypeScript)
- **Veritabanı:** Supabase (Postgres) — DeepVera projesi içinde **izole `auravera` şeması**
- Public form, `auravera` şemasını dışarı açmadan, `public` şemasındaki
  güvenli `SECURITY DEFINER` RPC fonksiyonu üzerinden yazar.

### Veritabanı nesneleri (`auravera` şeması)

| Nesne | Açıklama |
|-------|----------|
| `auravera.leads` | Lead kayıtları (RLS açık; anon yalnızca INSERT) |
| `auravera.lead_status` | Durum enum'u: new, contacted, qualified, consultation, converted, lost |
| `public.auravera_submit_lead(jsonb)` | Anon-çağrılabilir; form gönderimi |
| `public.auravera_list_leads(...)` | Yalnızca service_role; admin listeleme |

> Not: Lead sistemi DeepVera'nın `public` tablolarına **dokunmaz**. İleride
> ayrı bir Supabase projesine taşımak için: `pg_dump --schema=auravera`.

## Kurulum

```bash
npm install
cp .env.local.example .env.local   # değerleri doldurun
npm run dev
```

`.env.local` içine eklenecekler:

- `NEXT_PUBLIC_SUPABASE_URL` — proje URL'si (doldurulmuş örnek mevcut)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — publishable/anon key (doldurulmuş örnek mevcut)
- `SUPABASE_SERVICE_ROLE_KEY` — **gizli**, admin panosu için
  (Supabase Dashboard → Project Settings → API → service_role)
- `ADMIN_PASSWORD` — `/admin` sayfasını koruyan parola

## Sayfalar

- `/` — Landing page + başvuru formu (UTM yakalama, honeypot anti-spam, KVKK onayı)
- `/admin` — Parola korumalı lead panosu

## Veritabanı migration'ları

`supabase/migrations/` altındaki SQL dosyaları uygulanmış durumdadır. Yeni bir
projeye uygulamak için Supabase SQL Editor'a sırayla yapıştırın veya
`supabase db push` kullanın.
