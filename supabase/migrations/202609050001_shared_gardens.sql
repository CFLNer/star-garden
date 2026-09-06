-- Run as the database owner in Supabase SQL Editor (or via supabase db push).
-- Public clients can read their row; all garden writes go through the two RPCs.
begin;

create table public.gardens (
  user_id uuid primary key references auth.users(id) on delete cascade,
  document jsonb not null,
  schema_version integer not null default 1 check (schema_version = 1),
  revision bigint not null default 1 check (revision between 1 and 9007199254740991),
  updated_at timestamptz not null default now()
);

create table public.garden_operations (
  user_id uuid not null references public.gardens(user_id) on delete cascade,
  operation_id uuid not null,
  expected_revision bigint not null,
  document_hash text not null,
  committed_revision bigint not null,
  created_at timestamptz not null default now(),
  primary key (user_id, operation_id)
);

alter table public.gardens enable row level security;
alter table public.garden_operations enable row level security;
revoke all on public.gardens, public.garden_operations from public, anon, authenticated;
grant select on public.gardens to authenticated;
create policy "Read own garden" on public.gardens
  for select to authenticated using (user_id = (select auth.uid()));

create function public.assert_garden_document(p_document jsonb, p_user uuid)
returns void language plpgsql set search_path = '' as $$
declare
  item jsonb;
  balance numeric;
  photo text;
begin
  if p_document is null or jsonb_typeof(p_document) is distinct from 'object'
    or jsonb_typeof(p_document->'child') is distinct from 'object'
    or jsonb_typeof(p_document->'rewards') is distinct from 'array'
    or jsonb_typeof(p_document->'activityPresets') is distinct from 'array'
    or jsonb_typeof(p_document->'events') is distinct from 'array'
    or jsonb_typeof(p_document->'child'->'name') is distinct from 'string'
    or jsonb_typeof(p_document->'child'->'avatar') is distinct from 'string'
    or jsonb_typeof(p_document->'child'->'currentStars') is distinct from 'number' then
    raise exception 'Invalid garden document' using errcode = '22023';
  end if;
  balance := (p_document->'child'->>'currentStars')::numeric;
  if balance < 0 or balance > 9007199254740991 or balance <> trunc(balance) then
    raise exception 'Star balance must be a nonnegative safe integer' using errcode = '22023';
  end if;
  -- Retain the stored balance: old correction events cannot reconstruct it.
  for item in select value from jsonb_array_elements(p_document->'rewards') loop
    if jsonb_typeof(item) is distinct from 'object'
      or jsonb_typeof(item->'id') is distinct from 'string'
      or jsonb_typeof(item->'label') is distinct from 'string'
      or jsonb_typeof(item->'cost') is distinct from 'number' then
      raise exception 'Invalid reward' using errcode = '22023';
    end if;
    if (item->>'cost')::numeric <= 0 or (item->>'cost')::numeric > 9007199254740991
      or (item->>'cost')::numeric <> trunc((item->>'cost')::numeric) then
      raise exception 'Reward cost must be a positive safe integer' using errcode = '22023';
    end if;
  end loop;
  for item in
    select value from jsonb_array_elements(p_document->'activityPresets')
    union all select value from jsonb_array_elements(p_document->'events')
  loop
    if jsonb_typeof(item) is distinct from 'object'
      or jsonb_typeof(item->'id') is distinct from 'string'
      or jsonb_typeof(item->'label') is distinct from 'string' then
      raise exception 'Invalid action or history event' using errcode = '22023';
    end if;
  end loop;
  if p_document->'child' ? 'avatarPhotoPath' and p_document->'child'->'avatarPhotoPath' <> 'null'::jsonb then
    photo := p_document->'child'->>'avatarPhotoPath';
    if jsonb_typeof(p_document->'child'->'avatarPhotoPath') <> 'string'
      or photo !~ ('^' || p_user::text || '/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$') then
      raise exception 'Photo must belong to this account' using errcode = '22023';
    end if;
  end if;
end;
$$;

create function public.initialize_garden(p_document jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  garden public.gardens;
begin
  if actor is null then raise exception 'Sign in required' using errcode = '42501'; end if;
  perform public.assert_garden_document(p_document, actor);
  insert into public.gardens(user_id, document) values (actor, p_document)
    on conflict (user_id) do nothing returning * into garden;
  if found then
    return jsonb_build_object('status', 'initialized', 'garden', to_jsonb(garden) - 'user_id');
  end if;
  -- The insert waits for a competing initializer; the following statement sees its committed row.
  select * into garden from public.gardens where user_id = actor;
  return jsonb_build_object('status', 'exists', 'garden', to_jsonb(garden) - 'user_id');
end;
$$;

create function public.commit_garden(p_expected_revision bigint, p_operation_id uuid, p_document jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := auth.uid();
  garden public.gardens;
  receipt public.garden_operations;
  proposed_hash text;
begin
  if actor is null then raise exception 'Sign in required' using errcode = '42501'; end if;
  if p_operation_id is null or p_expected_revision is null or p_expected_revision < 1 then
    raise exception 'A revision and operation ID are required' using errcode = '22023';
  end if;
  perform public.assert_garden_document(p_document, actor);
  proposed_hash := encode(sha256(convert_to(p_document::text, 'UTF8')), 'hex');
  -- One row lock serializes every device, including parallel retries of the same operation.
  select * into garden from public.gardens where user_id = actor for update;
  if not found then
    return jsonb_build_object('status', 'conflict', 'garden', null);
  end if;
  select * into receipt from public.garden_operations
    where user_id = actor and operation_id = p_operation_id;
  if found then
    if receipt.expected_revision <> p_expected_revision or receipt.document_hash <> proposed_hash then
      raise exception 'Operation ID already used with different content' using errcode = '22023';
    end if;
    -- Return the current row, even when subsequent operations followed the original save.
    return jsonb_build_object('status', 'duplicate', 'garden', to_jsonb(garden) - 'user_id');
  end if;
  if garden.revision <> p_expected_revision then
    return jsonb_build_object('status', 'conflict', 'garden', to_jsonb(garden) - 'user_id');
  end if;
  update public.gardens set document = p_document, revision = revision + 1, updated_at = clock_timestamp()
    where user_id = actor returning * into garden;
  insert into public.garden_operations(user_id, operation_id, expected_revision, document_hash, committed_revision)
    values (actor, p_operation_id, p_expected_revision, proposed_hash, garden.revision);
  return jsonb_build_object('status', 'saved', 'garden', to_jsonb(garden) - 'user_id');
end;
$$;

revoke all on function public.assert_garden_document(jsonb, uuid) from public, anon, authenticated;
revoke all on function public.initialize_garden(jsonb) from public, anon, authenticated;
revoke all on function public.commit_garden(bigint, uuid, jsonb) from public, anon, authenticated;
grant execute on function public.initialize_garden(jsonb) to authenticated;
grant execute on function public.commit_garden(bigint, uuid, jsonb) to authenticated;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Read own avatars" on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Upload own avatars" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Remove own avatars" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
-- No UPDATE policy: uploads use unique filenames and never overwrite another version.

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime'
      and schemaname = 'public' and tablename = 'gardens') then
    alter publication supabase_realtime add table public.gardens;
  end if;
end;
$$;

commit;
