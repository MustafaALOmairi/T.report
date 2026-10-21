/* Time Report ADMIN - standalone site: own sign-in, dashboard and user management.
   Talks to the same Supabase project as the Time Report app (needs users.sql + admin.sql). */
'use strict';
const LOGO_SRC = 'data:image/png;base64,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';
const APP = document.getElementById('app');

/* ---------------- helpers ---------------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad2 = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const parseYmd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const fmtD = s => s ? s.split('-').reverse().join('/') : '';
const fmtN = (n, dec = 0) => Number(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const usingSupabase = () => !!(window.TR_CONFIG && window.TR_CONFIG.SUPABASE_URL && window.TR_CONFIG.SUPABASE_KEY);

function toast(msg, err) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'show' + (err ? ' err' : '');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.className = '', 3200);
}

const toMin = t => { const m = /^(\d{1,2}):(\d{2})/.exec(t || ''); return m ? +m[1] * 60 + +m[2] : null; };
const spanMin = (a, b) => { const x = toMin(a), y = toMin(b); if (x === null || y === null) return 0; let d = y - x; if (d < 0) d += 1440; return d; };

/* read every row (the API returns at most 1000 per request) */
async function fetchAll(table, select, filters) {
  const out = [];
  for (let off = 0; ; off += 1000) {
    const res = await sbFetch(`${table}?select=${select}&${filters}&order=id.asc&limit=1000&offset=${off}`);
    const rows = await res.json();
    out.push(...rows);
    if (rows.length < 1000) break;
  }
  return out;
}

/* ---------------- sign-in (own session, independent from the main app) ---------------- */
const TK = 'tra_token';
const getTok = () => { try { return sessionStorage.getItem(TK) || ''; } catch { return ''; } };
const setTok = v => { try { v ? sessionStorage.setItem(TK, v) : sessionStorage.removeItem(TK); } catch {} };

function gate(title, msg) {
  APP.innerHTML = `<div class="login-wrap"><div class="login-card"><img class="login-logo" src="${LOGO_SRC}" alt="Port of Duqm">
    <h1>${esc(title)}</h1><p class="login-note">${esc(msg)}</p></div></div>`;
}

let ME = null;
function loginView(msg) {
  APP.innerHTML = `<div class="login-wrap"><form class="login-card" id="lf" autocomplete="on">
    <img class="login-logo" src="${LOGO_SRC}" alt="Port of Duqm">
    <h1>TIME REPORT</h1><h2 class="login-sys">ADMIN</h2>
    <label for="lu">User</label><input id="lu" class="login-inp" name="username" autocomplete="username" autofocus>
    <label for="lp">Password</label><input id="lp" class="login-inp" type="password" name="password" autocomplete="current-password">
    <div class="login-err" id="le" role="alert">${esc(msg || '')}</div>
    <button class="login-btn" type="submit">Enter</button></form></div>`;
  document.getElementById('lf').onsubmit = async e => {
    e.preventDefault();
    const btn = e.target.querySelector('button'), err = document.getElementById('le'), pw = document.getElementById('lp');
    btn.disabled = true; err.textContent = '';
    try {
      const r = await sbRpc('login', { p_user: document.getElementById('lu').value.trim(), p_pass: pw.value });
      if (!r || !r.ok) { err.textContent = 'Incorrect user or password'; pw.value = ''; pw.focus(); return; }
      setTok(r.token);
      const me = await sbRpc('whoami');
      if (!me || me.role !== 'admin') {
        try { await sbRpc('logout'); } catch {}
        setTok(''); pw.value = ''; err.textContent = 'This account does not have admin access'; return;
      }
      ME = me; shell();
    } catch (x) { err.textContent = x.message; }
    finally { btn.disabled = false; }
  };
}

async function signOut() {
  try { await sbRpc('logout'); } catch {}
  setTok(''); ME = null; loginView();
}

async function boot() {
  if (!usingSupabase()) return gate('Setup needed', 'Fill in SUPABASE_URL and SUPABASE_KEY in config.js.');
  if (!getTok()) return loginView();
  try {
    const me = await sbRpc('whoami');
    if (!me || !me.ok) { setTok(''); return loginView('Session expired, please sign in again'); }
    if (me.role !== 'admin') { setTok(''); return loginView('This account does not have admin access'); }
    ME = me;
  } catch (e) { return loginView(e.message); }
  shell();
}

/* ---------------- shell ---------------- */
let TAB = 'dash';
function shell() {
  APP.innerHTML = `
  <header class="top"><div class="top-in">
    <img src="${LOGO_SRC}" alt="Port of Duqm"><h1>TIME REPORT <small>Admin</small></h1><span class="sp"></span>
    <span class="chip">${esc(ME.name)}</span>
    <button class="btn" id="so">Sign out</button>
  </div></header>
  <main class="main">
    <div class="tabs"><button class="tab" data-tab="dash">Dashboard</button><button class="tab" data-tab="users">Users</button></div>
    <div id="view"></div>
  </main>
  <dialog id="ud"></dialog><dialog id="rd"></dialog>`;
  document.querySelectorAll('.tab').forEach(b => b.onclick = () => { TAB = b.dataset.tab; show(); });
  document.getElementById('so').onclick = signOut;
  show();
}
function show() {
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === TAB));
  TAB === 'dash' ? dashboard() : usersView();
}

/* =====================================================================
   DASHBOARD
   ===================================================================== */
const P = { key: '30', from: '', to: '' };

function rangeFor(key) {
  const t = new Date(); t.setHours(0, 0, 0, 0);
  if (key === 'today') return [ymd(t), ymd(t)];
  if (key === '7') return [ymd(addDays(t, -6)), ymd(t)];
  if (key === '30') return [ymd(addDays(t, -29)), ymd(t)];
  if (key === '90') return [ymd(addDays(t, -89)), ymd(t)];
  if (key === 'month') return [ymd(new Date(t.getFullYear(), t.getMonth(), 1)), ymd(t)];
  return [P.from, P.to];
}

async function dashboard() {
  const V = document.getElementById('view');
  const presets = [['today', 'Today'], ['7', '7 days'], ['30', '30 days'], ['month', 'This month'], ['90', '90 days'], ['custom', 'Custom']];
  if (P.key !== 'custom') [P.from, P.to] = rangeFor(P.key);
  V.innerHTML = `
    <div class="toolbar">
      <div class="seg">${presets.map(([k, l]) => `<button data-p="${k}" class="${P.key === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      <input type="date" id="pf" value="${P.from}" aria-label="From"><span>→</span><input type="date" id="pt" value="${P.to}" aria-label="To">
      <button class="btn" id="rf">Refresh</button>
      <span class="range-note" id="rn"></span>
    </div>
    <div id="dash-body"><p class="loading">Loading data…</p></div>`;
  V.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { P.key = b.dataset.p; dashboard(); });
  const custom = () => { P.key = 'custom'; P.from = document.getElementById('pf').value; P.to = document.getElementById('pt').value; if (P.from && P.to) dashboard(); };
  document.getElementById('pf').onchange = custom; document.getElementById('pt').onchange = custom;
  document.getElementById('rf').onclick = () => dashboard();
  if (!P.from || !P.to || P.from > P.to) { document.getElementById('dash-body').innerHTML = '<div class="empty">Choose a valid date range.</div>'; return; }

  try {
    const f = `report_date=gte.${P.from}&report_date=lte.${P.to}`;
    const [rows, dis] = await Promise.all([
      fetchAll('time_reports', 'id,mv,voy,report_date,shift,berth,bollard,yard_no,what_we_do,pams_done,activities,equipment,manpower', f),
      fetchAll('discharge_lists', 'id', `list_date=gte.${P.from}&list_date=lte.${P.to}`),
    ]);
    document.getElementById('rn').textContent = `${fmtD(P.from)} → ${fmtD(P.to)}`;
    const agg = aggregate(rows);
    document.getElementById('dash-body').innerHTML = renderDash(agg, dis.length);
    document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => reportDialog(agg.pending.find(r => r.id === +b.dataset.view)));
  } catch (e) {
    document.getElementById('dash-body').innerHTML = `<div class="empty">${esc(e.message)}</div>`;
  }
}

function aggregate(rows) {
  const a = {
    n: rows.length, workMin: 0, eqMin: 0, vessels: new Set(), pending: [],
    byDay: new Map(), shift: new Map(), berth: new Map(), yard: new Map(), vessel: new Map(), eq: new Map(), op: new Map(),
    mp: { FOREMAN: 0, TALLYMAN: 0, DOCKER: 0 },
  };
  const bump = (m, name, v) => {
    const nm = String(name || '').trim(); if (!nm) return;
    const k = nm.toLowerCase(), e = m.get(k) || { name: nm, value: 0 };
    e.value += v; m.set(k, e);
  };
  for (const r of rows) {
    a.byDay.set(r.report_date, (a.byDay.get(r.report_date) || 0) + 1);
    a.shift.set(r.shift || 'Not set', (a.shift.get(r.shift || 'Not set') || 0) + 1);
    bump(a.berth, r.berth, 1); bump(a.yard, r.yard_no, 1); bump(a.vessel, r.mv, 1);
    if (String(r.mv || '').trim()) a.vessels.add(r.mv.trim().toLowerCase());
    for (const x of (r.activities || [])) a.workMin += spanMin(x.start_time, x.end_time);
    for (const e of (r.equipment || [])) {
      const m = spanMin(e.start_time, e.end_time);
      a.eqMin += m; bump(a.eq, e.equipment, m / 60); bump(a.op, e.operator, m / 60);
    }
    const mp = r.manpower || {};
    for (const k of Object.keys(a.mp)) a.mp[k] += (mp[k] || []).filter(x => String(x).trim()).length;
    if (!r.pams_done) a.pending.push(r);
  }
  a.pending.sort((x, y) => String(y.report_date).localeCompare(String(x.report_date)) || y.id - x.id);
  return a;
}

const topN = (m, n = 8) => [...m.values()].sort((x, y) => y.value - x.value || x.name.localeCompare(y.name)).slice(0, n);

function hbars(items, unit) {
  if (!items.length) return '<div class="empty">No data for this period</div>';
  const max = Math.max(...items.map(i => i.value));
  return `<div class="hb">${items.map(i => `<div class="hb-row" title="${esc(i.name)}: ${fmtN(i.value, unit ? 1 : 0)}${unit || ''}">
    <span class="hb-name">${esc(i.name)}</span>
    <span class="hb-track"><span class="hb-fill" style="width:${Math.max(2, i.value / max * 100)}%;display:block"></span></span>
    <span class="hb-val">${fmtN(i.value, unit ? 1 : 0)}${unit || ''}</span></div>`).join('')}</div>`;
}

function dailySeries(a) {
  const from = parseYmd(P.from), to = parseYmd(P.to);
  const days = Math.round((to - from) / 86400000) + 1;
  const out = [];
  if (days <= 62) {
    for (let i = 0; i < days; i++) { const k = ymd(addDays(from, i)); out.push({ key: k, label: k.slice(8) + '/' + k.slice(5, 7), value: a.byDay.get(k) || 0 }); }
  } else { // long ranges: one bar per month
    const m = new Map();
    for (let d = new Date(from); d <= to; d = addDays(d, 1)) m.set(ymd(d).slice(0, 7), 0);
    for (const [k, v] of a.byDay) m.set(k.slice(0, 7), (m.get(k.slice(0, 7)) || 0) + v);
    for (const [k, v] of m) out.push({ key: k, label: k.slice(5) + '/' + k.slice(2, 4), value: v });
  }
  return out;
}

function barChart(data) {
  const W = 760, H = 230, L = 34, B = 28, T = 12;
  const max = Math.max(1, ...data.map(d => d.value));
  const step = niceStep(max);
  const ymax = Math.ceil(max / step) * step;
  const bw = (W - L - 6) / data.length, ph = H - B - T;
  const every = Math.ceil(data.length / 14);
  let g = '';
  for (let v = 0; v <= ymax; v += step) {
    const y = T + ph - v / ymax * ph;
    g += `<line class="grid-l" x1="${L}" x2="${W}" y1="${y}" y2="${y}"/><text x="${L - 6}" y="${y + 4}" text-anchor="end">${v}</text>`;
  }
  const bars = data.map((d, i) => {
    const h = d.value / ymax * ph, x = L + i * bw + bw * 0.14, w = bw * 0.72;
    return `<rect class="bar" x="${x.toFixed(1)}" y="${(T + ph - h).toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(h, d.value ? 1 : 0).toFixed(1)}" rx="2"><title>${esc(d.key)}: ${d.value}</title></rect>`
      + (i % every === 0 ? `<text x="${(x + w / 2).toFixed(1)}" y="${H - 8}" text-anchor="middle">${esc(d.label)}</text>` : '');
  }).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Reports per day">${g}${bars}</svg>`;
}
function niceStep(max) { const raw = max / 4; const p = Math.pow(10, Math.floor(Math.log10(raw || 1))); const n = raw / p; return Math.max(1, (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p); }

const SHIFT_COLORS = { Day: '#fb923c', Night: '#3b82f6', 'Not set': '#cbd5e1' };

function renderDash(a, discharge) {
  const hrs = a.workMin / 60, ehrs = a.eqMin / 60;
  const shifts = [...a.shift.entries()].sort((x, y) => (x[0] === 'Day' ? -1 : y[0] === 'Day' ? 1 : x[0] === 'Night' ? -1 : y[0] === 'Night' ? 1 : 0));
  const sTotal = shifts.reduce((s, [, v]) => s + v, 0) || 1;
  const series = dailySeries(a);
  const kpi = (l, v, s, cls) => `<div class="kpi ${cls || ''}"><div class="l">${l}</div><div class="v">${v}</div>${s ? `<div class="s">${s}</div>` : ''}</div>`;
  return `
  <div class="kpis">
    ${kpi('Time reports', fmtN(a.n), `${fmtN(a.n / Math.max(1, series.length), 1)} per ${series.length > 62 || series[0]?.key.length === 7 ? 'month' : 'day'}`)}
    ${kpi('Working hours', fmtN(hrs, 1), 'from work activities')}
    ${kpi('Equipment hours', fmtN(ehrs, 1), 'start to end')}
    ${kpi('Vessels', fmtN(a.vessels.size), 'different vessels')}
    ${kpi('PAMS pending', fmtN(a.pending.length), a.n ? `${fmtN(100 * (a.n - a.pending.length) / a.n)}% done` : '', a.pending.length ? 'warn' : '')}
    ${kpi('Discharge lists', fmtN(discharge), 'in this period')}
  </div>
  <div class="grid">
    <section class="card span2"><h3>Reports per ${series[0]?.key.length === 7 ? 'month' : 'day'}</h3>${a.n ? barChart(series) : '<div class="empty">No reports in this period</div>'}</section>
    <section class="card"><h3>By shift</h3>${a.n ? `
      <div class="stack" role="img" aria-label="Shift split">${shifts.map(([k, v]) => `<i style="width:${v / sTotal * 100}%;background:${SHIFT_COLORS[k] || '#a78bfa'}" title="${esc(k)}: ${v}"></i>`).join('')}</div>
      <div class="legend">${shifts.map(([k, v]) => `<div><span class="dot" style="background:${SHIFT_COLORS[k] || '#a78bfa'}"></span>${esc(k)}<b>${fmtN(v)} · ${fmtN(100 * v / sTotal)}%</b></div>`).join('')}</div>` : '<div class="empty">No data</div>'}</section>
    <section class="card"><h3>Top berths</h3>${hbars(topN(a.berth))}</section>
    <section class="card"><h3>Top yards</h3>${hbars(topN(a.yard))}</section>
    <section class="card"><h3>Top vessels (reports)</h3>${hbars(topN(a.vessel))}</section>
    <section class="card"><h3>Equipment hours</h3>${hbars(topN(a.eq), ' h')}</section>
    <section class="card"><h3>Operator hours</h3>${hbars(topN(a.op), ' h')}</section>
    <section class="card"><h3>Manpower (names entered)</h3><div class="mp">
      ${['FOREMAN', 'TALLYMAN', 'DOCKER'].map(k => `<div><b>${fmtN(a.mp[k])}</b><span>${k[0] + k.slice(1).toLowerCase()}</span><small>${a.n ? fmtN(a.mp[k] / a.n, 1) : '0'} per report</small></div>`).join('')}</div></section>
    <section class="card span3"><h3>PAMS pending ${a.pending.length ? `(${fmtN(a.pending.length)})` : ''}</h3>
      ${a.pending.length ? `<div class="tbl-wrap"><table><thead><tr><th>Date</th><th>Vessel</th><th>Voyage</th><th>Shift</th><th>Berth</th><th>Yard</th><th></th></tr></thead><tbody>
      ${a.pending.slice(0, 15).map(r => `<tr><td>${fmtD(r.report_date)}</td><td><b>${esc(r.mv)}</b></td><td>${esc(r.voy)}</td><td>${esc(r.shift) || '-'}</td><td>${esc(r.berth) || '-'}</td><td>${esc(r.yard_no) || '-'}</td>
      <td><button class="btn sm" data-view="${r.id}">View</button></td></tr>`).join('')}</tbody></table></div>
      ${a.pending.length > 15 ? `<div class="empty">Showing the latest 15 of ${fmtN(a.pending.length)}</div>` : ''}` : '<div class="empty">Nothing pending - all reports are marked PAMS done</div>'}</section>
  </div>`;
}

/* ---------------- report details (read-only) + mark PAMS done ---------------- */
function reportDialog(r) {
  if (!r) return;
  const d = document.getElementById('rd');
  const acts = (r.activities || []).filter(a => a.start_time || a.end_time || a.qty || a.what_we_use);
  const eqs = (r.equipment || []).filter(e => e.equipment || e.operator || e.start_time || e.end_time);
  const mp = r.manpower || {};
  const chips = k => (mp[k] || []).filter(x => String(x).trim()).map(b => `<span>${esc(b)}</span>`).join('') || '<em>-</em>';
  const hh = t => String(t || '').slice(0, 5);
  d.innerHTML = `<div class="dlg wide"><h3>${esc(r.mv) || '(no vessel)'} <small>${esc(r.voy)}</small></h3>
    <div class="facts">
      <div><span>Date</span>${fmtD(r.report_date)}</div><div><span>Shift</span>${esc(r.shift) || '-'}</div><div><span>Berth</span>${esc(r.berth) || '-'}</div>
      <div><span>Bollard</span>${esc(r.bollard) || '-'}</div><div><span>Yard</span>${esc(r.yard_no) || '-'}</div>
      <div><span>PAMS</span>${r.pams_done ? 'Done' : 'Pending'}</div></div>
    <h4>Work activities</h4>${acts.length ? `<div class="tbl-wrap"><table class="mini"><thead><tr><th>Start</th><th>End</th><th>No</th><th>What we use</th></tr></thead><tbody>
      ${acts.map(a => `<tr><td>${hh(a.start_time)}</td><td>${hh(a.end_time)}</td><td>${esc(a.qty)}</td><td>${esc(a.what_we_use)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="none">None</div>'}
    <h4>What we do</h4><div class="what">${esc(r.what_we_do) || '<em>-</em>'}</div>
    <h4>Manpower</h4><div class="mpl"><div><b>Foreman</b>${chips('FOREMAN')}</div><div><b>Tallyman</b>${chips('TALLYMAN')}</div><div><b>Docker</b>${chips('DOCKER')}</div></div>
    <h4>Equipment</h4>${eqs.length ? `<div class="tbl-wrap"><table class="mini"><thead><tr><th>Equipment</th><th>Operator</th><th>Start</th><th>End</th></tr></thead><tbody>
      ${eqs.map(e => `<tr><td>${esc(e.equipment)}</td><td>${esc(e.operator)}</td><td>${hh(e.start_time)}</td><td>${hh(e.end_time)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="none">None</div>'}
    <div class="foot"><button type="button" class="btn" id="rc">Close</button>${r.pams_done ? '' : '<button type="button" class="btn primary" id="rp">Mark PAMS done</button>'}</div></div>`;
  document.getElementById('rc').onclick = () => d.close();
  const rp = document.getElementById('rp');
  if (rp) rp.onclick = async () => {
    rp.disabled = true;
    try { await sbFetch(`time_reports?id=eq.${r.id}`, { method: 'PATCH', body: { pams_done: true } }); d.close(); toast('Marked as PAMS done'); dashboard(); }
    catch (e) { toast(e.message, true); rp.disabled = false; }
  };
  d.showModal();
}

/* =====================================================================
   USERS
   ===================================================================== */
let USERS = [];
async function usersView() {
  const V = document.getElementById('view');
  V.innerHTML = '<p class="loading">Loading users…</p>';
  try { USERS = (await sbRpc('admin_list_users')) || []; }
  catch (e) { V.innerHTML = `<div class="card"><div class="empty">${esc(e.message)}<br>Run admin.sql in Supabase if you have not yet.</div></div>`; return; }
  const dt = s => s ? new Date(s).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'Never';
  V.innerHTML = `
    <div class="toolbar"><strong>${USERS.length} users</strong><span class="range-note"></span>
      <button class="btn primary" id="add" style="margin-left:auto">+ Add user</button></div>
    <div class="card"><div class="tbl-wrap"><table><thead><tr><th>User</th><th>Name</th><th>Role</th><th>Status</th><th>Last sign-in</th><th>Actions</th></tr></thead><tbody>
    ${USERS.map(u => `<tr><td><b>${esc(u.username)}</b>${u.id === ME.id ? ' <span class="badge on">You</span>' : ''}</td><td>${esc(u.full_name) || '-'}</td>
      <td><span class="badge ${u.role}">${u.role}</span></td><td><span class="badge ${u.active ? 'on' : 'off'}">${u.active ? 'Active' : 'Disabled'}</span></td>
      <td>${dt(u.last_login)}</td>
      <td><div class="acts"><button class="btn sm" data-edit="${u.id}">Edit</button>
        <button class="btn sm" data-toggle="${u.id}">${u.active ? 'Disable' : 'Enable'}</button>
        <button class="btn sm danger" data-del="${u.id}">Delete</button></div></td></tr>`).join('')}
    </tbody></table></div></div>`;
  document.getElementById('add').onclick = () => userDialog(null);
  V.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => userDialog(USERS.find(u => u.id === +b.dataset.edit)));
  V.querySelectorAll('[data-toggle]').forEach(b => b.onclick = async () => {
    const u = USERS.find(x => x.id === +b.dataset.toggle);
    try { await saveUser(u.id, u.username, '', u.full_name, u.role, !u.active); toast(u.active ? 'User disabled' : 'User enabled'); usersView(); } catch (e) { toast(e.message, true); }
  });
  V.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
    const u = USERS.find(x => x.id === +b.dataset.del);
    if (!confirm(`Delete user "${u.username}" permanently?`)) return;
    try { await sbRpc('admin_delete_user', { p_id: u.id }); toast('User deleted'); usersView(); } catch (e) { toast(e.message, true); }
  });
}

const saveUser = (id, username, pass, name, role, active) =>
  sbRpc('admin_save_user', { p_id: id, p_username: username, p_pass: pass || null, p_name: name || '', p_role: role, p_active: active });

function genPass() {
  const cs = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789', a = new Uint32Array(10);
  crypto.getRandomValues(a); return [...a].map(n => cs[n % cs.length]).join('');
}

function userDialog(u) {
  const d = document.getElementById('ud'), isNew = !u;
  d.innerHTML = `<form class="dlg" id="uf" autocomplete="off">
    <h3>${isNew ? 'Add user' : 'Edit user'}</h3>
    <label for="uu">Username</label><input type="text" id="uu" value="${esc(u?.username)}" required>
    <label for="un">Full name</label><input type="text" id="un" value="${esc(u?.full_name)}">
    <label for="ur">Role</label><select id="ur"><option value="user">User - reports only</option><option value="admin">Admin - reports + admin page</option></select>
    <label for="up">${isNew ? 'Password' : 'New password'}</label>
    <div class="pw-row"><input type="text" id="up" autocomplete="new-password" placeholder="${isNew ? 'At least 4 characters' : 'Leave empty to keep the current one'}"><button type="button" class="btn" id="gp">Generate</button></div>
    <div class="hint">${isNew ? 'Give this password to the user.' : 'Changing it signs that user out on all devices.'}</div>
    <label class="chk"><input type="checkbox" id="ua" ${u && !u.active ? '' : 'checked'}> Active</label>
    <div class="err" id="ue" role="alert"></div>
    <div class="foot"><button type="button" class="btn" id="uc">Cancel</button><button class="btn primary" id="us">Save</button></div></form>`;
  document.getElementById('ur').value = u?.role || 'user';
  document.getElementById('gp').onclick = () => { document.getElementById('up').value = genPass(); };
  document.getElementById('uc').onclick = () => d.close();
  document.getElementById('uf').onsubmit = async e => {
    e.preventDefault();
    const b = document.getElementById('us'); b.disabled = true; document.getElementById('ue').textContent = '';
    try {
      await saveUser(u ? u.id : null, document.getElementById('uu').value, document.getElementById('up').value,
        document.getElementById('un').value, document.getElementById('ur').value, document.getElementById('ua').checked);
      d.close(); toast(isNew ? 'User added' : 'User updated'); usersView();
    } catch (x) { document.getElementById('ue').textContent = x.message; b.disabled = false; }
  };
  d.showModal();
  document.getElementById('uu').focus();
}

boot();
