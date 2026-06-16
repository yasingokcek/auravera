-- AuraVera sağlık turizmi lead toplama sistemi
-- DeepVera projesinden tamamen izole, kendi şemasında. public şemasına dokunulmaz.

create schema if not exists auravera;

-- Lead durumu (satış hunisi)
do $$
begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where t.typname = 'lead_status' and n.nspname = 'auravera') then
    create type auravera.lead_status as enum
      ('new', 'contacted', 'qualified', 'consultation', 'converted', 'lost');
  end if;
end $$;

create table if not exists auravera.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  full_name   text not null,
  email       text,
  phone       text,
  country     text,
  language    text,
  treatment   text,                       -- sac_ekimi, dis, estetik, obezite, goz, tup_bebek, diger
  message     text,
  source      text,                       -- kanal: website, instagram_ads, google_ads, whatsapp ...
  utm         jsonb not null default '{}'::jsonb,  -- tüm utm/kampanya parametreleri
  status      auravera.lead_status not null default 'new',
  consent     boolean not null default false,      -- KVKK/GDPR onayı
  ip          inet,
  user_agent  text,
  constraint leads_contact_present check (email is not null or phone is not null)
);

comment on table auravera.leads is 'AuraVera sağlık turizmi başvuru/lead kayıtları.';

create index if not exists leads_created_at_idx on auravera.leads (created_at desc);
create index if not exists leads_status_idx     on auravera.leads (status);
create index if not exists leads_treatment_idx  on auravera.leads (treatment);
create index if not exists leads_email_idx       on auravera.leads (lower(email));

-- updated_at otomatik güncelleme
create or replace function auravera.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_leads_updated_at on auravera.leads;
create trigger trg_leads_updated_at
  before update on auravera.leads
  for each row execute function auravera.set_updated_at();

-- RLS: form anon key ile sadece INSERT yapabilir, okuma yapamaz.
alter table auravera.leads enable row level security;

drop policy if exists "anon can insert leads" on auravera.leads;
create policy "anon can insert leads"
  on auravera.leads
  for insert
  to anon, authenticated
  with check (true);

grant usage on schema auravera to anon, authenticated, service_role;
grant insert on auravera.leads to anon, authenticated;
grant all on auravera.leads to service_role;
