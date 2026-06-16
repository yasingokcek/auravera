-- ============================================================================
-- AuraVera v2 — public şemasındaki güvenli RPC köprü fonksiyonları
-- (auravera şeması REST API'ye açık değil; tüm erişim bu RPC'ler üzerinden)
--
-- GÜVENLİK NOTU: Supabase'in default privileges'ı yeni fonksiyonlara
-- anon+authenticated için EXECUTE verir. Bu yüzden her fonksiyonda
-- önce PUBLIC + anon'dan revoke edip yalnızca hedef role grant veriyoruz.
-- ============================================================================

-- ---------- PUBLIC (anon): form gönderimi + tedavi listesi ----------
create or replace function public.auravera_submit_lead(payload jsonb)
returns uuid language plpgsql security definer set search_path='' as $$
declare
  v_id uuid; v_tid uuid;
  v_name text := nullif(trim(payload->>'full_name'),'');
  v_email text := nullif(trim(payload->>'email'),'');
  v_phone text := nullif(trim(payload->>'phone'),'');
begin
  if v_name is null then raise exception 'full_name_required' using errcode='22023'; end if;
  if v_email is null and v_phone is null and nullif(trim(payload->>'whatsapp'),'') is null
     then raise exception 'contact_required' using errcode='22023'; end if;
  if coalesce((payload->>'health_data_consent')::boolean,false)=false
     then raise exception 'consent_required' using errcode='22023'; end if;

  select id into v_tid from auravera.treatments where slug = nullif(trim(payload->>'treatment'),'');

  insert into auravera.leads
    (full_name,email,phone,whatsapp,country,city,language,treatment,treatment_id,
     budget_band,timeline,message,source,utm,consent,ip,user_agent)
  values (v_name,v_email,v_phone,
    nullif(trim(payload->>'whatsapp'),''), nullif(trim(payload->>'country'),''),
    nullif(trim(payload->>'city'),''), nullif(trim(payload->>'language'),''),
    nullif(trim(payload->>'treatment'),''), v_tid,
    nullif(trim(payload->>'budget_band'),''), nullif(trim(payload->>'timeline'),''),
    nullif(trim(payload->>'message'),''),
    coalesce(nullif(trim(payload->>'source'),''),'website'),
    coalesce(payload->'utm','{}'::jsonb), true,
    nullif(payload->>'ip','')::inet, nullif(trim(payload->>'user_agent'),''))
  returning id into v_id;

  insert into auravera.consents
    (lead_id,ip,user_agent,language,consent_text_version,consent_text_snapshot,
     privacy_notice_version,purposes,health_data_consent,named_recipients,
     cross_border_consent,aydinlatma_acknowledged,consent_method)
  values (v_id, nullif(payload->>'ip','')::inet, nullif(trim(payload->>'user_agent'),''),
    nullif(trim(payload->>'language'),''), nullif(trim(payload->>'consent_text_version'),''),
    nullif(trim(payload->>'consent_text_snapshot'),''), nullif(trim(payload->>'privacy_notice_version'),''),
    coalesce((select array_agg(value::text) from jsonb_array_elements_text(payload->'purposes')),'{}'),
    true,
    coalesce((select array_agg(value::text) from jsonb_array_elements_text(payload->'named_recipients')),'{}'),
    coalesce((payload->>'cross_border_consent')::boolean,false),
    coalesce((payload->>'aydinlatma_acknowledged')::boolean,false), 'web_form');

  insert into auravera.lead_events (lead_id,actor,event_type,to_stage,detail)
  values (v_id,'system','created','new',jsonb_build_object('source',coalesce(payload->>'source','website')));
  return v_id;
end; $$;
revoke all on function public.auravera_submit_lead(jsonb) from public;
grant execute on function public.auravera_submit_lead(jsonb) to anon, authenticated, service_role;

create or replace function public.auravera_treatments()
returns jsonb language sql stable security definer set search_path='' as $$
  select coalesce(jsonb_agg(jsonb_build_object('slug',slug,'vertical',vertical,
    'name_tr',name_tr,'name_en',name_en) order by sort_order),'[]'::jsonb)
  from auravera.treatments where active $$;
revoke all on function public.auravera_treatments() from public;
grant execute on function public.auravera_treatments() to anon, authenticated, service_role;

-- ---------- ADMIN (yalnızca service_role) ----------
create or replace function public.auravera_admin_leads(
  p_status text default null, p_grade text default null, p_search text default null,
  p_limit int default 100, p_offset int default 0)
returns jsonb language sql stable security definer set search_path='' as $$
  select coalesce(jsonb_agg(row_to_json(x) order by x.created_at desc),'[]'::jsonb) from (
    select l.id,l.created_at,l.full_name,l.email,l.phone,l.whatsapp,l.country,l.city,
           l.language,l.treatment,t.name_tr as treatment_name,l.budget_band,l.timeline,
           l.status,l.temperature,l.fit_grade,l.total_score,l.fit_score,l.intent_score,
           l.source,l.message,l.assigned_count,l.reachability_verified
    from auravera.leads l left join auravera.treatments t on t.id=l.treatment_id
    where (p_status is null or l.status::text=p_status)
      and (p_grade is null or l.fit_grade::text=p_grade)
      and (p_search is null or l.full_name ilike '%'||p_search||'%'
           or l.email ilike '%'||p_search||'%' or l.phone ilike '%'||p_search||'%')
    order by l.created_at desc limit greatest(1,least(p_limit,500)) offset greatest(0,p_offset)
  ) x $$;

create or replace function public.auravera_admin_stats()
returns jsonb language sql stable security definer set search_path='' as $$
  select jsonb_build_object(
    'total',(select count(*) from auravera.leads),
    'new',(select count(*) from auravera.leads where status='new'),
    'hot',(select count(*) from auravera.leads where temperature='hot'),
    'grade_a',(select count(*) from auravera.leads where fit_grade='A'),
    'assigned',(select count(distinct lead_id) from auravera.lead_assignments),
    'clinics',(select count(*) from auravera.clinics where status='active'),
    'by_treatment',(select coalesce(jsonb_object_agg(name_tr,c),'{}'::jsonb) from (
      select t.name_tr, count(l.*) c from auravera.treatments t
      left join auravera.leads l on l.treatment_id=t.id group by t.name_tr) s where c>0)) $$;

create or replace function public.auravera_admin_clinics()
returns jsonb language sql stable security definer set search_path='' as $$
  select coalesce(jsonb_agg(jsonb_build_object('id',c.id,'name',c.name,'country',c.country,
    'city',c.city,'status',c.status,'exclusivity_default',c.exclusivity_default,
    'balance',coalesce(w.balance,0),
    'leads',(select count(*) from auravera.lead_assignments a where a.clinic_id=c.id))
    order by c.created_at desc),'[]'::jsonb)
  from auravera.clinics c left join auravera.credit_wallets w on w.clinic_id=c.id $$;

create or replace function public.auravera_admin_assign(p_lead_id uuid, p_clinic_id uuid, p_mode text default 'shared')
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_price numeric; v_aid uuid;
begin
  select t.base_price_per_lead into v_price from auravera.leads l
    join auravera.treatments t on t.id=l.treatment_id where l.id=p_lead_id;
  v_price := coalesce(v_price,25) * case when p_mode='exclusive' then 2.5 else 1 end;
  insert into auravera.lead_assignments (lead_id,clinic_id,mode,price,status)
  values (p_lead_id,p_clinic_id,p_mode,v_price,'offered')
  on conflict (lead_id,clinic_id) do update set mode=excluded.mode, price=excluded.price
  returning id into v_aid;
  update auravera.leads set assigned_count=(select count(*) from auravera.lead_assignments where lead_id=p_lead_id),
    exclusive=(p_mode='exclusive') where id=p_lead_id;
  insert into auravera.lead_events(lead_id,clinic_id,actor,event_type,detail)
  values (p_lead_id,p_clinic_id,'ops','assigned',jsonb_build_object('mode',p_mode,'price',v_price));
  return jsonb_build_object('assignment_id',v_aid,'price',v_price);
end; $$;

create or replace function public.auravera_admin_create_clinic(p_name text, p_country text default null, p_city text default null)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_id uuid;
begin
  insert into auravera.clinics (name,country,city) values (p_name,p_country,p_city) returning id into v_id;
  insert into auravera.credit_wallets (clinic_id,balance) values (v_id,0);
  insert into auravera.clinic_preferences (clinic_id) values (v_id);
  return jsonb_build_object('ok',true,'clinic_id',v_id);
end; $$;

create or replace function public.auravera_admin_topup(p_clinic_id uuid, p_amount numeric, p_note text default 'Manual topup')
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_bal numeric;
begin
  insert into auravera.credit_wallets (clinic_id,balance) values (p_clinic_id,0) on conflict (clinic_id) do nothing;
  update auravera.credit_wallets set balance=balance+p_amount, updated_at=now() where clinic_id=p_clinic_id returning balance into v_bal;
  insert into auravera.credit_transactions(clinic_id,amount,type,balance_after,note)
  values (p_clinic_id,p_amount,'topup',v_bal,p_note);
  return jsonb_build_object('ok',true,'balance',v_bal);
end; $$;

create or replace function public.auravera_admin_link_user(p_email text, p_clinic_id uuid, p_role text default 'clinic_admin')
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_uid uuid;
begin
  select id into v_uid from auth.users where email = lower(trim(p_email));
  if v_uid is null then return jsonb_build_object('error','user_not_found'); end if;
  insert into auravera.app_users (id,email,role,clinic_id) values (v_uid,lower(trim(p_email)),p_role,p_clinic_id)
  on conflict (id) do update set role=excluded.role, clinic_id=excluded.clinic_id, email=excluded.email;
  return jsonb_build_object('ok',true,'user_id',v_uid);
end; $$;

revoke all on function public.auravera_admin_leads(text,text,text,int,int) from public, anon, authenticated;
revoke all on function public.auravera_admin_stats() from public, anon, authenticated;
revoke all on function public.auravera_admin_clinics() from public, anon, authenticated;
revoke all on function public.auravera_admin_assign(uuid,uuid,text) from public, anon, authenticated;
revoke all on function public.auravera_admin_create_clinic(text,text,text) from public, anon, authenticated;
revoke all on function public.auravera_admin_topup(uuid,numeric,text) from public, anon, authenticated;
revoke all on function public.auravera_admin_link_user(text,uuid,text) from public, anon, authenticated;
grant execute on function public.auravera_admin_leads(text,text,text,int,int) to service_role;
grant execute on function public.auravera_admin_stats() to service_role;
grant execute on function public.auravera_admin_clinics() to service_role;
grant execute on function public.auravera_admin_assign(uuid,uuid,text) to service_role;
grant execute on function public.auravera_admin_create_clinic(text,text,text) to service_role;
grant execute on function public.auravera_admin_topup(uuid,numeric,text) to service_role;
grant execute on function public.auravera_admin_link_user(text,uuid,text) to service_role;

-- ---------- KLİNİK PORTALI (yalnızca authenticated; auth.uid -> clinic) ----------
create or replace function public.auravera_clinic_dashboard()
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_cid uuid; v_res jsonb;
begin
  v_cid := auravera.my_clinic_id();
  if v_cid is null then return jsonb_build_object('error','no_clinic'); end if;
  select jsonb_build_object(
    'clinic',jsonb_build_object('id',c.id,'name',c.name,'country',c.country,'status',c.status),
    'balance',coalesce(w.balance,0),'currency',coalesce(w.currency,'USD'),
    'offered',(select count(*) from auravera.lead_assignments a where a.clinic_id=v_cid and a.status='offered'),
    'claimed',(select count(*) from auravera.lead_assignments a where a.clinic_id=v_cid and a.status in ('claimed','accepted')),
    'won',(select count(*) from auravera.lead_assignments a join auravera.leads l on l.id=a.lead_id
           where a.clinic_id=v_cid and l.status in ('booked','arrived','completed')))
  into v_res from auravera.clinics c left join auravera.credit_wallets w on w.clinic_id=c.id where c.id=v_cid;
  return v_res;
end; $$;

create or replace function public.auravera_clinic_assignments(p_status text default null)
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare v_cid uuid;
begin
  v_cid := auravera.my_clinic_id();
  if v_cid is null then return '[]'::jsonb; end if;
  return (select coalesce(jsonb_agg(row_to_json(x) order by x.offered_at desc),'[]'::jsonb) from (
    select a.id as assignment_id,a.status,a.mode,a.price,a.offered_at,
      l.id as lead_id,t.name_tr as treatment,l.country,l.city,l.language,
      l.budget_band,l.timeline,l.temperature,l.fit_grade,l.total_score,l.status as stage,
      case when a.status in ('claimed','accepted') then l.full_name else left(l.full_name,1)||'***' end as full_name,
      case when a.status in ('claimed','accepted') then l.email else null end as email,
      case when a.status in ('claimed','accepted') then l.phone else null end as phone,
      case when a.status in ('claimed','accepted') then l.whatsapp else null end as whatsapp,
      case when a.status in ('claimed','accepted') then l.message else null end as message,
      (a.status in ('claimed','accepted')) as revealed
    from auravera.lead_assignments a join auravera.leads l on l.id=a.lead_id
    left join auravera.treatments t on t.id=l.treatment_id
    where a.clinic_id=v_cid and (p_status is null or a.status=p_status)
    order by a.offered_at desc) x);
end; $$;

create or replace function public.auravera_clinic_claim(p_assignment_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_cid uuid; v_price numeric; v_bal numeric; v_lead uuid; v_status text;
begin
  v_cid := auravera.my_clinic_id();
  if v_cid is null then return jsonb_build_object('error','no_clinic'); end if;
  select price,lead_id,status into v_price,v_lead,v_status
    from auravera.lead_assignments where id=p_assignment_id and clinic_id=v_cid for update;
  if not found then return jsonb_build_object('error','not_found'); end if;
  if v_status in ('claimed','accepted') then return jsonb_build_object('error','already_claimed'); end if;
  select balance into v_bal from auravera.credit_wallets where clinic_id=v_cid for update;
  v_bal := coalesce(v_bal,0);
  if v_bal < v_price then return jsonb_build_object('error','insufficient_balance','balance',v_bal,'price',v_price); end if;
  update auravera.credit_wallets set balance=balance-v_price, updated_at=now() where clinic_id=v_cid;
  insert into auravera.credit_transactions(clinic_id,amount,type,balance_after,assignment_id,note)
  values (v_cid,-v_price,'lead_charge',v_bal-v_price,p_assignment_id,'Lead claim');
  update auravera.lead_assignments set status='claimed', responded_at=now() where id=p_assignment_id;
  insert into auravera.lead_events(lead_id,clinic_id,actor,event_type,detail)
  values (v_lead,v_cid,'clinic:'||v_cid,'claimed',jsonb_build_object('price',v_price));
  return jsonb_build_object('ok',true,'lead',(select row_to_json(l) from auravera.leads l where l.id=v_lead));
end; $$;

create or replace function public.auravera_clinic_update_stage(p_lead_id uuid, p_stage text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare v_cid uuid; v_old text;
begin
  v_cid := auravera.my_clinic_id();
  if not exists (select 1 from auravera.lead_assignments
                 where lead_id=p_lead_id and clinic_id=v_cid and status in ('claimed','accepted'))
     then return jsonb_build_object('error','not_authorized'); end if;
  select status::text into v_old from auravera.leads where id=p_lead_id;
  update auravera.leads set status=p_stage::auravera.lead_stage where id=p_lead_id;
  insert into auravera.lead_events(lead_id,clinic_id,actor,event_type,from_stage,to_stage)
  values (p_lead_id,v_cid,'clinic:'||v_cid,'stage_change',v_old,p_stage);
  return jsonb_build_object('ok',true);
end; $$;

revoke all on function public.auravera_clinic_dashboard() from public, anon;
revoke all on function public.auravera_clinic_assignments(text) from public, anon;
revoke all on function public.auravera_clinic_claim(uuid) from public, anon;
revoke all on function public.auravera_clinic_update_stage(uuid,text) from public, anon;
grant execute on function public.auravera_clinic_dashboard() to authenticated, service_role;
grant execute on function public.auravera_clinic_assignments(text) to authenticated, service_role;
grant execute on function public.auravera_clinic_claim(uuid) to authenticated, service_role;
grant execute on function public.auravera_clinic_update_stage(uuid,text) to authenticated, service_role;
