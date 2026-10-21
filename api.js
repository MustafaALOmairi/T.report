/* Minimal Supabase REST client for the admin site (own session key: tra_token). */
const sbToken = () => { try { return sessionStorage.getItem('tra_token') || ''; } catch { return ''; } };

async function sbFetch(path, { method = 'GET', body, prefer } = {}) {
  const c = window.TR_CONFIG;
  const headers = { apikey: c.SUPABASE_KEY, 'Content-Type': 'application/json' };
  if (c.SUPABASE_KEY.startsWith('eyJ')) headers.Authorization = 'Bearer ' + c.SUPABASE_KEY; // legacy JWT keys only
  if (prefer) headers.Prefer = prefer;
  const tok = sbToken(); if (tok) headers['x-client-info'] = tok; // session token, checked inside the database
  let res;
  try {
    res = await fetch(c.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/' + path,
      { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new Error('Cannot reach Supabase. Check your internet and SUPABASE_URL in config.js');
  }
  if (!res.ok) {
    let m = ''; try { m = (await res.json()).message; } catch {}
    throw new Error(m || 'Supabase error ' + res.status);
  }
  return res;
}

async function sbRpc(name, args = {}) {
  const res = await sbFetch('rpc/' + name, { method: 'POST', body: args });
  const t = await res.text();
  return t ? JSON.parse(t) : null;
}
