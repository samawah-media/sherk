-- F-001B Cycle 2A client write workflows.
-- Keeps direct Data API client writes closed and wraps client mutation +
-- audit append in constrained RPC functions.

alter table public.clients
add column if not exists revision integer not null default 1;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'clients_revision_positive'
      and conrelid = 'public.clients'::regclass
  ) then
    alter table public.clients
      add constraint clients_revision_positive check (revision > 0);
  end if;
end;
$$;

revoke insert, update on public.clients from anon, authenticated;
grant insert on public.audit_events to authenticated;

create or replace function public.f001_actor_tenant_for_client_write()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  actor_user_id uuid := auth.uid();
  actor_tenant_id uuid;
  active_membership_count integer;
begin
  if actor_user_id is null then
    raise exception 'not authorized'
      using errcode = '42501';
  end if;

  select count(*)::integer, (array_agg(tm.tenant_id order by tm.created_at))[1]
    into active_membership_count, actor_tenant_id
  from public.tenant_memberships tm
  where tm.auth_user_id = actor_user_id
    and tm.status = 'active';

  if active_membership_count <> 1 or actor_tenant_id is null then
    raise exception 'not authorized'
      using errcode = '42501';
  end if;

  if not public.f001_has_active_role(
    actor_tenant_id,
    array['tenant_owner', 'tenant_administrator'],
    'tenant',
    actor_tenant_id
  ) then
    raise exception 'not authorized'
      using errcode = '42501';
  end if;

  return actor_tenant_id;
end;
$$;

create or replace function public.f001_create_client_write(
  client_id uuid,
  audit_event_id uuid,
  client_name text,
  client_slug text,
  new_primary_contact_name text default null,
  new_primary_contact_email text default null
)
returns table (
  id uuid,
  tenant_id uuid,
  name text,
  slug text,
  status text,
  primary_contact_name text,
  primary_contact_email text,
  created_by uuid,
  created_at timestamptz,
  updated_at timestamptz,
  revision integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_user_id uuid := auth.uid();
  actor_tenant_id uuid;
  created_client public.clients%rowtype;
begin
  actor_tenant_id := public.f001_actor_tenant_for_client_write();

  insert into public.clients (
    id,
    tenant_id,
    name,
    slug,
    primary_contact_name,
    primary_contact_email,
    created_by
  )
  values (
    client_id,
    actor_tenant_id,
    client_name,
    client_slug,
    new_primary_contact_name,
    new_primary_contact_email,
    actor_user_id
  )
  returning * into created_client;

  insert into public.audit_events (
    id,
    tenant_id,
    client_id,
    actor_user_id,
    action,
    decision,
    target_type,
    target_id
  )
  values (
    audit_event_id,
    actor_tenant_id,
    created_client.id,
    actor_user_id,
    'ClientCreated',
    'allowed',
    'client',
    created_client.id::text
  );

  return query
  select
    created_client.id,
    created_client.tenant_id,
    created_client.name,
    created_client.slug,
    created_client.status,
    created_client.primary_contact_name,
    created_client.primary_contact_email,
    created_client.created_by,
    created_client.created_at,
    created_client.updated_at,
    created_client.revision;
end;
$$;

create or replace function public.f001_update_client_write(
  target_client_id uuid,
  audit_event_id uuid,
  client_name text,
  client_slug text,
  new_primary_contact_name text default null,
  new_primary_contact_email text default null,
  expected_revision integer default 1
)
returns table (
  id uuid,
  tenant_id uuid,
  name text,
  slug text,
  status text,
  primary_contact_name text,
  primary_contact_email text,
  created_by uuid,
  created_at timestamptz,
  updated_at timestamptz,
  revision integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_user_id uuid := auth.uid();
  actor_tenant_id uuid;
  updated_client public.clients%rowtype;
begin
  actor_tenant_id := public.f001_actor_tenant_for_client_write();

  update public.clients
  set
    name = client_name,
    slug = client_slug,
    primary_contact_name = new_primary_contact_name,
    primary_contact_email = new_primary_contact_email,
    updated_at = now(),
    revision = public.clients.revision + 1
  where public.clients.id = target_client_id
    and public.clients.tenant_id = actor_tenant_id
    and public.clients.status = 'active'
    and public.clients.revision = expected_revision
  returning * into updated_client;

  if updated_client.id is null then
    raise exception 'client write conflict'
      using errcode = 'P0002';
  end if;

  insert into public.audit_events (
    id,
    tenant_id,
    client_id,
    actor_user_id,
    action,
    decision,
    target_type,
    target_id
  )
  values (
    audit_event_id,
    actor_tenant_id,
    updated_client.id,
    actor_user_id,
    'ClientUpdated',
    'allowed',
    'client',
    updated_client.id::text
  );

  return query
  select
    updated_client.id,
    updated_client.tenant_id,
    updated_client.name,
    updated_client.slug,
    updated_client.status,
    updated_client.primary_contact_name,
    updated_client.primary_contact_email,
    updated_client.created_by,
    updated_client.created_at,
    updated_client.updated_at,
    updated_client.revision;
end;
$$;

revoke all on function public.f001_actor_tenant_for_client_write() from public, anon, authenticated;
revoke all on function public.f001_create_client_write(uuid, uuid, text, text, text, text) from public, anon, authenticated;
revoke all on function public.f001_update_client_write(uuid, uuid, text, text, text, text, integer) from public, anon, authenticated;

grant execute on function public.f001_create_client_write(uuid, uuid, text, text, text, text) to authenticated;
grant execute on function public.f001_update_client_write(uuid, uuid, text, text, text, text, integer) to authenticated;
