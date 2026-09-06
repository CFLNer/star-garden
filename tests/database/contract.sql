\set ON_ERROR_STOP on
set role authenticated;
set request.jwt.claim.sub = '00000000-0000-4000-8000-000000000001';

do $$
declare
  doc jsonb := '{"child":{"id":"child-1","name":"Little Star","avatar":"🦁","currentStars":3},"rewards":[{"id":"reward-1","label":"Playground","cost":5}],"activityPresets":[],"events":[{"id":"old","label":"Legacy correction","starChange":-100,"note":"Parent-only note","visibleToKid":false}]}';
  result jsonb;
  another jsonb;
begin
  result := public.initialize_garden(doc);
  assert result->>'status' = 'initialized', 'first initialization creates the garden';
  assert result->'garden'->>'revision' = '1', 'initial revision is one';
  assert result->'garden'->'document'->'child'->>'currentStars' = '3', 'legacy balance is preserved independently of history';
  assert result->'garden'->'document'->'events'->0->>'note' = 'Parent-only note', 'private notes survive migration';
  result := public.initialize_garden(jsonb_set(doc, '{child,currentStars}', '999'));
  assert result->>'status' = 'exists', 'second device never overwrites initialization';
  assert result->'garden'->'document'->'child'->>'currentStars' = '3', 'cloud data takes precedence';

  doc := jsonb_set(doc, '{child,currentStars}', '8');
  result := public.commit_garden(1, '10000000-0000-4000-8000-000000000001', doc);
  assert result->>'status' = 'saved', 'first matching save succeeds';
  assert result->'garden'->>'revision' = '2', 'save advances revision';
  result := public.commit_garden(1, '10000000-0000-4000-8000-000000000001', doc);
  assert result->>'status' = 'duplicate', 'retry returns accepted receipt';
  assert result->'garden'->>'revision' = '2', 'retry cannot advance balance twice';

  another := jsonb_set(doc, '{child,currentStars}', '3');
  result := public.commit_garden(2, '10000000-0000-4000-8000-000000000002', another);
  assert result->>'status' = 'saved', 'redemption uses current revision';
  result := public.commit_garden(2, '10000000-0000-4000-8000-000000000003', another);
  assert result->>'status' = 'conflict', 'competing redemption cannot apply twice';
  assert result->'garden'->'document'->'child'->>'currentStars' = '3', 'conflict returns confirmed balance';
  result := public.commit_garden(1, '10000000-0000-4000-8000-000000000001', doc);
  assert result->>'status' = 'duplicate' and result->'garden'->>'revision' = '3', 'late retry returns newest garden';

  begin
    perform public.commit_garden(1, '10000000-0000-4000-8000-000000000001', another);
    raise exception 'reused operation ID accepted different content';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform public.commit_garden(3, '10000000-0000-4000-8000-000000000004', jsonb_set(doc, '{child,currentStars}', '-1'));
    raise exception 'negative balance accepted';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform public.commit_garden(3, '10000000-0000-4000-8000-000000000004', jsonb_set(doc, '{child,currentStars}', '1.5'));
    raise exception 'fractional balance accepted';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform public.commit_garden(3, '10000000-0000-4000-8000-000000000004', '{"child":{}}');
    raise exception 'malformed garden accepted';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform public.commit_garden(3, '10000000-0000-4000-8000-000000000004', null);
    raise exception 'null garden accepted';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform public.commit_garden(3, '10000000-0000-4000-8000-000000000004',
      jsonb_set(doc, '{child,avatarPhotoPath}', '"00000000-0000-4000-8000-000000000002/photo.jpg"'));
    raise exception 'cross-account avatar reference accepted';
  exception when invalid_parameter_value then null;
  end;
  doc := jsonb_set(another, '{child,avatarPhotoPath}', '"00000000-0000-4000-8000-000000000001/photo.jpg"');
  result := public.commit_garden(3, '10000000-0000-4000-8000-000000000004', doc);
  assert result->>'status' = 'saved', 'own-account photo reference accepted';
  assert (select count(*) from public.gardens) = 1, 'owner can read own garden';

  begin
    update public.gardens set revision = 100;
    raise exception 'direct garden write was allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.gardens;
    raise exception 'garden reset was allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    perform * from public.garden_operations;
    raise exception 'operation receipts were directly readable';
  exception when insufficient_privilege then null;
  end;
  insert into storage.objects(bucket_id, name)
    values ('avatars', '00000000-0000-4000-8000-000000000001/photo.jpg');
  assert (select count(*) from storage.objects) = 1, 'owner can read own photo';
end;
$$;

set request.jwt.claim.sub = '00000000-0000-4000-8000-000000000002';
do $$
begin
  assert (select count(*) from public.gardens) = 0, 'another user cannot read garden';
  assert (select count(*) from storage.objects) = 0, 'another user cannot read avatar';
  delete from storage.objects where bucket_id = 'avatars';
  assert not found, 'another user cannot delete avatar';
  begin
    insert into storage.objects(bucket_id, name)
      values ('avatars', '00000000-0000-4000-8000-000000000001/other.jpg');
    raise exception 'cross-account photo upload accepted';
  exception when insufficient_privilege then null;
  end;
end;
$$;

set request.jwt.claim.sub = '';
do $$
begin
  begin
    perform public.initialize_garden('{}');
    raise exception 'missing identity accepted';
  exception when insufficient_privilege then null;
  end;
end;
$$;
set role anon;
do $$
begin
  begin
    perform public.initialize_garden('{}');
    raise exception 'anonymous initialization accepted';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.commit_garden(1, '10000000-0000-4000-8000-000000000001', '{}');
    raise exception 'anonymous commit accepted';
  exception when insufficient_privilege then null;
  end;
  begin
    perform * from public.gardens;
    raise exception 'anonymous garden read accepted';
  exception when insufficient_privilege then null;
  end;
end;
$$;
reset role;
do $$
begin
  assert (select count(*) from storage.objects) = 1, 'cross-account removal preserved avatar';
  assert (select public from storage.buckets where id = 'avatars') = false, 'bucket is private';
  assert (select file_size_limit from storage.buckets where id = 'avatars') = 5242880, '5 MB server upload limit';
  assert (select allowed_mime_types from storage.buckets where id = 'avatars') = array['image/jpeg','image/png','image/webp'], 'server restricts photo formats';
end;
$$;
