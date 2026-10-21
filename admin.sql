-- ======================================================================
-- Time Report - admin functions (user management from admin.html)
-- Run AFTER users.sql (Part 1). Safe to run more than once.
-- Every function checks, inside the database, that the caller is a signed-in ADMIN.
-- ======================================================================

-- who is calling? (internal helper, not callable from the website)
create or replace function public._me() returns public.app_users
language sql stable security definer set search_path = public as $$
  select u.* from public.app_users u
  join public.app_sessions s on s.user_id = u.id
  where u.active and s.expires_at > now()
    and s.token::text = coalesce(current_setting('request.headers', true)::json ->> 'x-client-info', '')
  limit 1;
$$;
revoke all on function public._me() from public, anon, authenticated;

-- current user info (used by admin.html to decide what to show)
create or replace function public.whoami() returns json
language plpgsql stable security definer set search_path = public as $$
declare m public.app_users;
begin
  m := public._me();
  if m.id is null then return json_build_object('ok', false); end if;
  return json_build_object('ok', true, 'id', m.id, 'username', m.username,
         'name', coalesce(nullif(m.full_name, ''), m.username), 'role', m.role);
end $$;

create or replace function public.admin_list_users() returns json
language plpgsql stable security definer set search_path = public as $$
declare m public.app_users;
begin
  m := public._me();
  if m.id is null or m.role <> 'admin' then raise exception 'Admins only'; end if;
  return (select coalesce(json_agg(json_build_object(
            'id', id, 'username', username, 'full_name', full_name, 'role', role,
            'active', active, 'last_login', last_login, 'created_at', created_at) order by id), '[]'::json)
          from public.app_users);
end $$;

-- create (p_id null) or update a user. Empty p_pass on update = keep the old password.
create or replace function public.admin_save_user(
  p_id bigint, p_username text, p_pass text, p_name text, p_role text, p_active boolean) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare m public.app_users; other_admins int; new_id bigint; tok text;
begin
  m := public._me();
  if m.id is null or m.role <> 'admin' then raise exception 'Admins only'; end if;
  tok := coalesce(current_setting('request.headers', true)::json ->> 'x-client-info', '');
  p_username := trim(coalesce(p_username, ''));
  if p_role not in ('admin', 'user') then raise exception 'Invalid role'; end if;

  if p_id is null then
    if p_username = '' then raise exception 'Username is required'; end if;
    if coalesce(p_pass, '') = '' then raise exception 'Password is required'; end if;
    if length(p_pass) < 4 then raise exception 'Password is too short (minimum 4 characters)'; end if;
    insert into public.app_users (username, password_hash, full_name, role, active)
    values (p_username, crypt(p_pass, gen_salt('bf')), coalesce(p_name, ''), p_role, coalesce(p_active, true))
    returning id into new_id;
    return json_build_object('ok', true, 'id', new_id);
  end if;

  -- never leave the system without an active admin
  if p_role <> 'admin' or not coalesce(p_active, true) then
    select count(*) into other_admins from public.app_users where role = 'admin' and active and id <> p_id;
    if other_admins = 0 and exists (select 1 from public.app_users where id = p_id and role = 'admin' and active) then
      raise exception 'At least one active admin is required';
    end if;
  end if;
  if coalesce(p_pass, '') <> '' and length(p_pass) < 4 then
    raise exception 'Password is too short (minimum 4 characters)';
  end if;

  update public.app_users set
    username      = case when p_username <> '' then p_username else username end,
    full_name     = coalesce(p_name, full_name),
    role          = p_role,
    active        = coalesce(p_active, active),
    password_hash = case when coalesce(p_pass, '') <> '' then crypt(p_pass, gen_salt('bf')) else password_hash end
  where id = p_id;
  if not found then raise exception 'User not found'; end if;

  -- disabled or new password: sign that user out everywhere (except the admin's own current session)
  if not coalesce(p_active, true) or coalesce(p_pass, '') <> '' then
    delete from public.app_sessions where user_id = p_id and token::text <> tok;
  end if;
  return json_build_object('ok', true, 'id', p_id);
exception when unique_violation then
  raise exception 'This username already exists';
end $$;

create or replace function public.admin_delete_user(p_id bigint) returns json
language plpgsql security definer set search_path = public as $$
declare m public.app_users; other_admins int;
begin
  m := public._me();
  if m.id is null or m.role <> 'admin' then raise exception 'Admins only'; end if;
  if p_id = m.id then raise exception 'You cannot delete your own account'; end if;
  select count(*) into other_admins from public.app_users where role = 'admin' and active and id <> p_id;
  if other_admins = 0 and exists (select 1 from public.app_users where id = p_id and role = 'admin' and active) then
    raise exception 'At least one active admin is required';
  end if;
  delete from public.app_users where id = p_id;
  return json_build_object('ok', true);
end $$;

grant execute on function public.whoami()                                       to anon;
grant execute on function public.admin_list_users()                             to anon;
grant execute on function public.admin_save_user(bigint, text, text, text, text, boolean) to anon;
grant execute on function public.admin_delete_user(bigint)                      to anon;
