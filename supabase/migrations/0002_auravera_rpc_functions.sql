-- Halka açık form için güvenli giriş noktası.
-- auravera şeması API'ye açılmadan, public şemasındaki RPC üzerinden yazılır.

create or replace function public.auravera_submit_lead(payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_full_name text := nullif(trim(payload->>'full_name'), '');
  v_email     text := nullif(trim(payload->>'email'), '');
  v_phone     text := nullif(trim(payload->>'phone'), '');
begin
  if v_full_name is null then
    raise exception 'full_name_required' using errcode = '22023';
  end if;
  if v_email is null and v_phone is null then
    raise exception 'contact_required' using errcode = '22023';
  end if;

  insert into auravera.leads
    (full_name, email, phone, country, language, treatment, message, source, utm, consent, ip, user_agent)
  values (
    v_full_name,
    v_email,
    v_phone,
    nullif(trim(payload->>'country'), ''),
    nullif(trim(payload->>'language'), ''),
    nullif(trim(payload->>'treatment'), ''),
    nullif(trim(payload->>'message'), ''),
    nullif(trim(payload->>'source'), ''),
    coalesce(payload->'utm', '{}'::jsonb),
    coalesce((payload->>'consent')::boolean, false),
    nullif(payload->>'ip', '')::inet,
    nullif(trim(payload->>'user_agent'), '')
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.auravera_submit_lead(jsonb) from public;
grant execute on function public.auravera_submit_lead(jsonb) to anon, authenticated, service_role;

-- Admin listeleme (yalnızca service_role / sunucu tarafı çağırabilir).
create or replace function public.auravera_list_leads(
  p_status text default null,
  p_limit  int  default 100,
  p_offset int  default 0
)
returns setof auravera.leads
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
    select *
    from auravera.leads l
    where p_status is null or l.status::text = p_status
    order by l.created_at desc
    limit greatest(1, least(p_limit, 500))
    offset greatest(0, p_offset);
end;
$$;

revoke all on function public.auravera_list_leads(text, int, int) from public;
grant execute on function public.auravera_list_leads(text, int, int) to service_role;
