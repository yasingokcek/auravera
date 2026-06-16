-- ============================================================================
-- AuraVera v2 — B2B Sağlık Turizmi Hasta-Kazanım Platformu
-- Tek dosyada tam şema. DeepVera projesi içinde izole `auravera` şeması.
-- public şemasına yalnızca güvenli RPC köprü fonksiyonları eklenir.
-- ============================================================================

create schema if not exists auravera;

-- ---------- Enum'lar ----------
do $$ begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace
                 where t.typname='treatment_vertical' and n.nspname='auravera') then
    create type auravera.treatment_vertical as enum
      ('hair','dental','aesthetic','bariatric','ivf','eye','other');
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace
                 where t.typname='lead_temperature' and n.nspname='auravera') then
    create type auravera.lead_temperature as enum ('hot','warm','cold');
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace
                 where t.typname='fit_grade' and n.nspname='auravera') then
    create type auravera.fit_grade as enum ('A','B','C','D');
  end if;
end $$;
do $$ begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid=t.typnamespace
                 where t.typname='lead_stage' and n.nspname='auravera') then
    create type auravera.lead_stage as enum (
      'new','contacted','attempting','qualified','consultation_booked',
      'quoted','booked','arrived','completed','follow_up','disqualified','lost');
  end if;
end $$;

-- ---------- Taksonomi & kampanyalar ----------
create table if not exists auravera.treatments (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  vertical auravera.treatment_vertical not null,
  name_tr text not null, name_en text not null,
  value_band int not null default 2,
  base_price_per_lead numeric not null default 25,
  active boolean not null default true,
  sort_order int not null default 100
);

create table if not exists auravera.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  channel text not null default 'organic',
  vertical auravera.treatment_vertical,
  target_country text, landing_path text,
  utm_source text, utm_medium text, utm_campaign text,
  spend numeric not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Lead'ler ----------
create table if not exists auravera.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null,
  email text, phone text, whatsapp text,
  country text, city text, language text,
  treatment text, treatment_id uuid references auravera.treatments(id),
  budget_band text, budget_amount numeric, timeline text,
  message text, source text, utm jsonb not null default '{}'::jsonb,
  status auravera.lead_stage not null default 'new',
  temperature auravera.lead_temperature not null default 'warm',
  fit_grade auravera.fit_grade,
  fit_score int not null default 0,
  intent_score int not null default 0,
  total_score int not null default 0,
  campaign_id uuid references auravera.campaigns(id),
  reachability_verified boolean not null default false,
  disqualified_reason text,
  assigned_count int not null default 0,
  exclusive boolean not null default false,
  consent boolean not null default false,
  ip inet, user_agent text,
  constraint leads_contact_present check (email is not null or phone is not null or whatsapp is not null)
);
create index if not exists leads_created_at_idx on auravera.leads (created_at desc);
create index if not exists leads_status_idx on auravera.leads (status);
create index if not exists leads_grade_idx on auravera.leads (fit_grade);
create index if not exists leads_score_idx on auravera.leads (total_score desc);
create index if not exists leads_treatment_id_idx on auravera.leads (treatment_id);

-- ---------- B2B: klinikler, kullanıcılar, atamalar, kredi, rıza, denetim ----------
create table if not exists auravera.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null, slug text unique, country text, city text,
  languages text[] not null default '{}',
  health_tourism_cert_no text,
  contact_name text, contact_email text, contact_phone text,
  status text not null default 'active',
  exclusivity_default text not null default 'shared',
  created_at timestamptz not null default now()
);

create table if not exists auravera.clinic_preferences (
  clinic_id uuid primary key references auravera.clinics(id) on delete cascade,
  verticals auravera.treatment_vertical[] not null default '{}',
  source_countries text[] not null default '{}',
  languages text[] not null default '{}',
  min_budget_band text,
  daily_cap int not null default 50, monthly_cap int not null default 1000,
  max_price_per_lead numeric,
  accept_exclusive boolean not null default true,
  accept_shared boolean not null default true
);

create table if not exists auravera.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, full_name text,
  role text not null default 'clinic_user',
  clinic_id uuid references auravera.clinics(id) on delete set null,
  locale text not null default 'tr',
  created_at timestamptz not null default now()
);

create table if not exists auravera.lead_assignments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references auravera.leads(id) on delete cascade,
  clinic_id uuid not null references auravera.clinics(id) on delete cascade,
  mode text not null default 'shared',
  status text not null default 'offered',
  price numeric not null default 0,
  offered_at timestamptz not null default now(),
  responded_at timestamptz, reject_reason text,
  unique (lead_id, clinic_id)
);
create index if not exists assignments_clinic_idx on auravera.lead_assignments (clinic_id, status);

create table if not exists auravera.consents (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references auravera.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  ip inet, user_agent text, language text,
  consent_text_version text, consent_text_snapshot text,
  privacy_notice_version text,
  purposes text[] not null default '{}',
  health_data_consent boolean not null default false,
  named_recipients text[] not null default '{}',
  cross_border_consent boolean not null default false,
  aydinlatma_acknowledged boolean not null default false,
  consent_method text not null default 'web_form',
  withdrawal_at timestamptz, retention_expiry timestamptz
);
create index if not exists consents_lead_idx on auravera.consents (lead_id);

create table if not exists auravera.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references auravera.leads(id) on delete cascade,
  clinic_id uuid references auravera.clinics(id),
  actor text, event_type text not null,
  from_stage text, to_stage text,
  detail jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists lead_events_lead_idx on auravera.lead_events (lead_id, created_at desc);

create table if not exists auravera.credit_wallets (
  clinic_id uuid primary key references auravera.clinics(id) on delete cascade,
  balance numeric not null default 0, currency text not null default 'USD',
  auto_recharge boolean not null default false,
  updated_at timestamptz not null default now()
);
create table if not exists auravera.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references auravera.clinics(id) on delete cascade,
  amount numeric not null, type text not null, balance_after numeric,
  assignment_id uuid references auravera.lead_assignments(id),
  note text, created_at timestamptz not null default now()
);
create table if not exists auravera.disputes (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references auravera.lead_assignments(id) on delete cascade,
  reason text not null, status text not null default 'open',
  detail text, resolution text,
  created_at timestamptz not null default now(), decided_at timestamptz
);

-- ---------- updated_at + skorlama trigger'ları ----------
create or replace function auravera.set_updated_at()
returns trigger language plpgsql security definer set search_path='' as $$
begin new.updated_at := now(); return new; end; $$;
drop trigger if exists trg_leads_updated_at on auravera.leads;
create trigger trg_leads_updated_at before update on auravera.leads
  for each row execute function auravera.set_updated_at();

create or replace function auravera.score_lead()
returns trigger language plpgsql security definer set search_path='' as $$
declare v_band int := 2; v_fit int := 0; v_intent int := 0;
begin
  select value_band into v_band from auravera.treatments where id = new.treatment_id;
  v_band := coalesce(v_band, 2);
  v_fit := v_band * 7;
  v_fit := v_fit + case new.budget_band
    when 'gt_7000' then 22 when '3000_7000' then 16 when '1000_3000' then 9
    when 'lt_1000' then 3 else 5 end;
  v_fit := v_fit + case new.timeline
    when 'asap' then 10 when '1_3m' then 7 when '3_6m' then 3 else 1 end;
  if new.country is not null then v_fit := v_fit + 6; end if;
  v_fit := least(v_fit, 60);
  if new.reachability_verified then v_intent := v_intent + 15; end if;
  if coalesce(new.phone, new.whatsapp) is not null then v_intent := v_intent + 10; end if;
  if new.message is not null and length(new.message) > 20 then v_intent := v_intent + 5; end if;
  if new.source in ('google','referral') then v_intent := v_intent + 5; end if;
  if new.email is not null then v_intent := v_intent + 5; end if;
  v_intent := least(v_intent, 40);
  new.fit_score := v_fit; new.intent_score := v_intent;
  new.total_score := least(v_fit + v_intent, 100);
  new.fit_grade := case when new.total_score>=80 then 'A' when new.total_score>=60 then 'B'
                        when new.total_score>=40 then 'C' else 'D' end::auravera.fit_grade;
  new.temperature := case when new.timeline='asap' or new.total_score>=75 then 'hot'
                          when new.total_score>=50 then 'warm' else 'cold' end::auravera.lead_temperature;
  return new;
end; $$;
drop trigger if exists trg_score_lead on auravera.leads;
create trigger trg_score_lead before insert or update of
  treatment_id, budget_band, timeline, country, phone, whatsapp, message, reachability_verified, source
  on auravera.leads for each row execute function auravera.score_lead();

-- ---------- Yardımcılar ----------
create or replace function auravera.is_admin() returns boolean
language sql stable security definer set search_path='' as $$
  select exists (select 1 from auravera.app_users where id=auth.uid() and role in ('super_admin','ops_agent')) $$;
create or replace function auravera.my_clinic_id() returns uuid
language sql stable security definer set search_path='' as $$
  select clinic_id from auravera.app_users where id=auth.uid() $$;

-- ---------- RLS ----------
alter table auravera.leads enable row level security;
alter table auravera.clinics enable row level security;
alter table auravera.clinic_preferences enable row level security;
alter table auravera.app_users enable row level security;
alter table auravera.lead_assignments enable row level security;
alter table auravera.lead_events enable row level security;
alter table auravera.consents enable row level security;
alter table auravera.credit_wallets enable row level security;
alter table auravera.credit_transactions enable row level security;
alter table auravera.disputes enable row level security;
alter table auravera.treatments enable row level security;
alter table auravera.campaigns enable row level security;

drop policy if exists "anon can insert leads" on auravera.leads;
create policy "anon can insert leads" on auravera.leads
  for insert to anon, authenticated with check (true);
drop policy if exists "self read app_user" on auravera.app_users;
create policy "self read app_user" on auravera.app_users
  for select to authenticated using (id = auth.uid());
drop policy if exists "anyone reads active treatments" on auravera.treatments;
create policy "anyone reads active treatments" on auravera.treatments
  for select to anon, authenticated using (active = true);

grant usage on schema auravera to anon, authenticated, service_role;
grant insert on auravera.leads to anon, authenticated;
grant select on auravera.treatments to anon, authenticated;
grant all on all tables in schema auravera to service_role;

-- ---------- Seed: tedaviler ----------
insert into auravera.treatments (slug,vertical,name_tr,name_en,value_band,base_price_per_lead,sort_order) values
  ('sac_ekimi','hair','Saç Ekimi','Hair Transplant',3,35,10),
  ('dis','dental','Diş Tedavisi & Estetiği','Dental & Smile Design',4,45,20),
  ('estetik','aesthetic','Plastik & Estetik Cerrahi','Plastic & Aesthetic Surgery',4,55,30),
  ('obezite','bariatric','Obezite / Bariatrik Cerrahi','Bariatric Surgery',3,40,40),
  ('tup_bebek','ivf','Tüp Bebek / IVF','IVF / Fertility',4,60,50),
  ('goz','eye','Göz (LASIK / Katarakt)','Eye Surgery (LASIK)',2,30,60),
  ('diger','other','Diğer','Other',2,25,70)
on conflict (slug) do update set
  vertical=excluded.vertical, name_tr=excluded.name_tr, name_en=excluded.name_en,
  value_band=excluded.value_band, base_price_per_lead=excluded.base_price_per_lead;
