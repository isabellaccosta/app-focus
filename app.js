/* =====================================================================
   FOCO · app.js — lógica do app (tudo salvo no localStorage)
   ===================================================================== */
(() => {
'use strict';
const D = window.DATA;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY = 'foco.v1';
const NIV = { 1: 'Fácil', 2: 'Média', 3: 'Difícil' };
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const ORDEM = [1, 2, 3, 4, 5, 6, 0];
const iso = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parse = s => new Date(s + 'T00:00:00');
const diasAte = s => Math.round((parse(s) - parse(iso())) / 864e5);
const addDias = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const fmtData = s => parse(s).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

/* ---------- Estado ---------- */
const base = () => ({ user: null, session: false, favs: {}, done: {}, tasks: {}, erros: [], weekly: [], sessions: {}, prefs: { hours: 34, notify: false, reduce: false } });
let S = base();
try { S = Object.assign(base(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = base(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Não foi possível salvar neste navegador.'); } };

/* ---------- UI helpers ---------- */
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2200); }
function openSheet(tag, title, html, foot = '') {
  $('#sheet-tag').textContent = tag; $('#sheet-title').textContent = title;
  $('#sheet-body').innerHTML = html; $('#sheet-foot').innerHTML = foot;
  $('#overlay').hidden = false; $('#sheet').hidden = false; $('#sheet-body').scrollTop = 0;
}
function closeSheet() { $('#overlay').hidden = true; $('#sheet').hidden = true; }
$('#sheet-close').onclick = closeSheet; $('#overlay').onclick = closeSheet;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
const badge = n => `<span class="badge badge--${n}">${NIV[n]}</span>`;
const materia = id => D.materias.find(m => m.id === id);

/* ---------- Acesso ---------- */
let mode = 'signup';
const hash = p => btoa(unescape(encodeURIComponent(p)));
function setMode(m) {
  mode = m; $('#screen-auth').classList.toggle('is-login', m === 'login');
  $$('#auth-toggle .segmented__btn').forEach(b => { const on = b.dataset.mode === m; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
  $('#auth-submit').textContent = m === 'login' ? 'ENTRAR' : 'CRIAR CONTA';
  $('#auth-pass').placeholder = m === 'login' ? 'Sua senha' : 'Crie uma senha';
  $('#auth-pass').autocomplete = m === 'login' ? 'current-password' : 'new-password'; $('#auth-msg').textContent = '';
}
$$('#auth-toggle .segmented__btn').forEach(b => b.onclick = () => setMode(b.dataset.mode));
$('#auth-eye').onclick = () => { const i = $('#auth-pass'); i.type = i.type === 'password' ? 'text' : 'password'; };
$('#auth-form').onsubmit = e => {
  e.preventDefault();
  const email = $('#auth-email').value.trim().toLowerCase(), pass = $('#auth-pass').value, name = $('#auth-name').value.trim(), msg = $('#auth-msg');
  if (!/^\S+@\S+\.\S+$/.test(email)) return msg.textContent = 'Digite um e-mail válido.';
  if (pass.length < 4) return msg.textContent = 'A senha precisa ter ao menos 4 caracteres.';
  if (mode === 'signup') { S.user = { name: name || email.split('@')[0], email, pass: hash(pass) }; }
  else if (!S.user || S.user.email !== email || S.user.pass !== hash(pass)) return msg.textContent = 'E-mail ou senha não conferem neste aparelho.';
  S.session = true; save(); enter();
};
$$('[data-guest]').forEach(b => b.onclick = () => { S.user = S.user || { name: 'Visitante', email: 'visitante@local', pass: '' }; S.session = true; save(); enter(); });
$$('[data-sheet]').forEach(a => a.onclick = e => {
  e.preventDefault();
  const t = { termos: ['Termos de uso', 'Uso pessoal. O plano é uma sugestão: confirme datas e regras nos editais oficiais.'], privacidade: ['Privacidade', 'Nada sai do seu aparelho. Os dados ficam no armazenamento local do navegador.'], sobre: ['Sobre', 'Foco: planner de estudos para vestibulares e estágio, baseado no seu plano de 28/09/2026.'] }[a.dataset.sheet];
  openSheet('INFO', t[0], `<p>${t[1]}</p>`);
});
function enter() { $('#screen-auth').hidden = true; $('#app').hidden = false; renderAll(); go('hoje', true); }

/* ---------- Navegação ---------- */
let cur = 'hoje'; const hist = [];
function go(v, silent) {
  if (!silent && v !== cur) hist.push(cur);
  cur = v;
  $$('.view').forEach(x => x.classList.toggle('is-active', x.dataset.view === v));
  $$('.tabbar__btn').forEach(b => b.classList.toggle('is-active', b.dataset.go === v));
  $('#topbar-tag').textContent = $(`#view-${v}`).dataset.title.toUpperCase();
  const f = !!S.favs[v]; $('#btn-fav').setAttribute('aria-pressed', f);
  $('#viewport').scrollTo({ top: 0, behavior: 'instant' });
}
$$('.tabbar__btn').forEach(b => b.onclick = () => go(b.dataset.go));
$('#btn-back').onclick = () => go(hist.pop() || 'hoje', true);
$('#btn-fav').onclick = () => { S.favs[cur] = !S.favs[cur]; $('#btn-fav').setAttribute('aria-pressed', !!S.favs[cur]); save(); toast(S.favs[cur] ? 'Seção favoritada' : 'Favorito removido'); };

/* ---------- HOJE ---------- */
const faseAtual = () => { const h = iso(); return D.fases.find(f => h >= f.ini && h <= f.fim); };
const proxProva = () => D.provas.filter(p => diasAte(p.data) >= 0).sort((a, b) => a.data.localeCompare(b.data))[0];
function renderHoje() {
  const h = new Date(), dow = h.getDay(), hj = iso();
  $('#hoje-greet').textContent = `Olá, ${S.user?.name || 'estudante'}!`;
  $('#hoje-date').textContent = h.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const f = faseAtual(), p = proxProva();
  $('#hoje-phase').innerHTML = `<p class="card__title">${f ? esc(f.nome) : 'Trilha do estágio'}</p><p>${f ? esc(f.foco) : 'Dezembro a fevereiro: Python, SQL, Git e mini projetos.'}</p>` +
    (p ? `<p class="muted" style="color:#dfe8c8;margin-top:10px">Próxima: <b>${esc(p.nome)}</b> em ${diasAte(p.data)} dias (${fmtData(p.data)})</p>` : '');
  const bl = D.rotina[dow], dn = S.done[hj] || {};
  const n = bl.filter(x => dn[x.id]).length;
  $('#hoje-progress').textContent = `${n} de ${bl.length}`; $('#hoje-bar').style.width = (n / bl.length * 100) + '%';
  $('#hoje-blocks').innerHTML = bl.map(blockHtml.bind(null, dn)).join('');
  bindBlocks($('#hoje-blocks'), hj);
  const ts = S.tasks[hj] || [];
  $('#hoje-tasks').innerHTML = ts.length ? ts.map((t, i) => `<li class="item ${t.d ? 'is-done' : ''}" data-i="${i}"><button class="item__check" data-tk="${i}" aria-label="Concluir"><svg class="icon"><use href="#i-check"/></svg></button><div class="item__main"><p class="item__title">${esc(t.t)}</p></div><button class="item__del" data-dl="${i}" aria-label="Apagar"><svg class="icon icon--sm"><use href="#i-trash"/></svg></button></li>`).join('') : '<li class="empty">Sem metas. Toque em Adicionar.</li>';
  $$('[data-tk]').forEach(b => b.onclick = () => { ts[b.dataset.tk].d = !ts[b.dataset.tk].d; save(); renderHoje(); });
  $$('[data-dl]').forEach(b => b.onclick = () => { ts.splice(b.dataset.dl, 1); save(); renderHoje(); });
  $('#hoje-habit').innerHTML = `<p class="card__title">${esc(D.habit)}</p><p class="muted">Sequência: 1 problema por dia treina o raciocínio para Inteli, FIAP e testes de estágio.</p>`;
  $('#focus-meta').textContent = `${S.sessions[hj] || 0} sessões hoje`; extrasHoje(bl, dn);
  const nx = bl.find(x => !dn[x.id]); $('#focus-title').textContent = nx ? nx.titulo.split(':')[0] : 'Dia completo';
}
function blockHtml(dn, x) {
  const m = materia(x.m);
  return `<li><button class="item ${dn[x.id] ? 'is-done' : ''}" data-b="${x.id}"><span class="item__check" data-ck="${x.id}"><svg class="icon"><use href="#i-check"/></svg></span><span class="item__main"><span class="item__title">${esc(x.titulo)}</span><span class="item__sub" style="display:block">${x.t} · ${x.dur}</span></span><span class="item__side">${m ? badge(m.nivel) : ''}</span></button></li>`;
}
function bindBlocks(root, dia) {
  $$('[data-b]', root).forEach(el => el.onclick = e => {
    const id = el.dataset.b;
    if (e.target.closest('[data-ck]')) { if (!dia) return toast('Só dá para marcar os blocos de hoje.'); S.done[dia] = S.done[dia] || {}; S.done[dia][id] = !S.done[dia][id]; save(); renderAll(); return; }
    const x = Object.values(D.rotina).flat().find(b => b.id === id), m = materia(x.m);
    openSheet(x.t, x.titulo, `<p>${esc(x.txt)}</p>` + (m ? `<p style="margin-top:10px">${badge(m.nivel)} <span class="tag">${esc(m.nome)}</span></p><h4>Método</h4><p>${esc(m.metodo)}</p><h4>Dicas</h4><ul>${m.dicas.map(d => `<li>${esc(d)}</li>`).join('')}</ul>` : ''));
  });
}
$('#task-add').onclick = () => {
  openSheet('META', 'Nova meta', '<input id="nt" placeholder="Ex.: 10 questões de PA/PG" maxlength="80">', '<button class="btn btn--lime btn--block" id="nt-ok">Salvar meta</button>');
  $('#nt-ok').onclick = () => { const v = $('#nt').value.trim(); if (!v) return; const k = iso(); (S.tasks[k] = S.tasks[k] || []).push({ t: v, d: false }); save(); closeSheet(); renderHoje(); toast('Meta salva'); };
};

/* ---------- Imagens: capas geradas + suas fotos ---------- */
function hue(s) { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
function cover(key) {
  const u = (D.imagens || {})[key], pal = ['#c9ea6b', '#c8a2e0', '#56663a', '#f1c05b'];
  let h = hue(key); const r = () => (h = (h * 1664525 + 1013904223) >>> 0) / 4294967296;
  let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#252a1c"/><stop offset="1" stop-color="#0b0c0a"/></linearGradient></defs><rect width="400" height="200" fill="url(#g)"/>';
  for (let i = 0; i < 9; i++) s += `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="200" stroke="#fff" stroke-opacity=".05"/>`;
  for (let i = 0; i < 6; i++) s += `<circle cx="${r() * 400 | 0}" cy="${r() * 200 | 0}" r="${18 + r() * 60 | 0}" fill="${pal[r() * 4 | 0]}" fill-opacity="${(.12 + r() * .35).toFixed(2)}"/>`;
  for (let i = 0; i < 4; i++) s += `<rect x="${r() * 340 | 0}" y="${r() * 160 | 0}" width="${30 + r() * 60 | 0}" height="8" rx="4" fill="${pal[r() * 2 | 0]}" fill-opacity=".8"/>`;
  const art = `url('data:image/svg+xml,${encodeURIComponent(s + '</svg>').replace(/'/g, '%27')}')`;
  return u ? `url('${String(u).replace(/['"]/g, '')}'), ${art}` : art;
}
function heroCovers() { $$('.view').forEach(v => { const h = $('.hero', v); if (h) h.style.setProperty('--cover', cover('hero-' + v.dataset.view)); }); }
function applyPhotos() {
  if (S.cover) document.documentElement.style.setProperty('--auth-photo', `url('${S.cover}')`);
  const a = $('#avatar'); if (S.photo) { a.style.backgroundImage = `url('${S.photo}')`; a.style.backgroundSize = 'cover'; a.textContent = ''; }
}
function readImg(file, max, cb) {
  if (!file) return; const fr = new FileReader();
  fr.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * k; c.height = im.height * k; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); cb(c.toDataURL('image/jpeg', .8)); }; im.src = fr.result; };
  fr.readAsDataURL(file);
}
$('#btn-photo').onclick = () => $('#photo-file').click();
$('#btn-cover').onclick = () => $('#cover-file').click();
$('#photo-file').onchange = e => readImg(e.target.files[0], 360, d => { S.photo = d; save(); applyPhotos(); toast('Foto atualizada'); });
$('#cover-file').onchange = e => readImg(e.target.files[0], 900, d => { S.cover = d; save(); applyPhotos(); toast('Capa atualizada'); });

/* ---------- Extras do Hoje: anel, sequência, dica e gráfico ---------- */
function streak() { const v = k => Object.values(S.done[k] || {}).some(Boolean) || S.sessions[k] > 0; let c = 0, k = iso(); if (!v(k)) k = addDias(k, -1); while (v(k)) { c++; k = addDias(k, -1); } return c; }
function extrasHoje(bl, dn) {
  const n = bl.filter(x => dn[x.id]).length, pct = Math.round(n / bl.length * 100);
  $('#hoje-ring').innerHTML = `<div class="ring" style="--p:${pct}"><b>${pct}%</b></div><div><p class="card__title">Progresso de hoje</p><p class="muted">${n} de ${bl.length} blocos · ${streak()} dia(s) seguidos</p></div>`;
  const doy = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);
  $('#hoje-tip').innerHTML = `<p class="card__title">Dica do dia</p><p>${esc(D.dicasDia[doy % D.dicasDia.length])}</p>`;
  const days = [...Array(7)].map((_, i) => addDias(iso(), i - 6)), val = k => Object.values(S.done[k] || {}).filter(Boolean).length + (S.sessions[k] || 0), mx = Math.max(1, ...days.map(val));
  $('#hoje-week').innerHTML = `<p class="card__title">Últimos 7 dias</p><div class="wk">${days.map(k => `<div><i style="height:${Math.max(4, val(k) / mx * 100)}%"></i><span>${DIAS[parse(k).getDay()]}</span></div>`).join('')}</div>`;
}

/* ---------- Lembrete de bloco (com o app aberto) ---------- */
let lastRem = '';
$('#pref-notify').addEventListener('change', e => { if (e.target.checked && window.Notification && Notification.permission === 'default') Notification.requestPermission(); });
setInterval(() => {
  if (!S.prefs.notify || !S.session) return; const n = new Date(), hm = `${n.getHours()}:${String(n.getMinutes()).padStart(2, '0')}`;
  D.rotina[n.getDay()].forEach(b => { const m = b.t.match(/^(\d+)h(\d*)/); if (m && `${+m[1]}:${(m[2] || '00').padStart(2, '0')}` === hm && lastRem !== b.id + iso()) { lastRem = b.id + iso(); toast('Hora do bloco: ' + b.titulo); navigator.vibrate?.(200); if (window.Notification && Notification.permission === 'granted') new Notification('Foco', { body: b.titulo }); } });
}, 20000);

/* ---------- Cronômetro ---------- */
let tmin = 25, left = 1500, tid = null;
const fmtT = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
function tick() {
  left--; $('#focus-time').textContent = fmtT(left);
  if (left <= 0) { stopT(); const k = iso(); S.sessions[k] = (S.sessions[k] || 0) + 1; save(); left = tmin * 60; $('#focus-time').textContent = fmtT(left); renderHoje(); navigator.vibrate?.([200, 100, 200]); toast('Sessão concluída. Faça uma pausa.'); }
}
function stopT() { clearInterval(tid); tid = null; $('#focus').classList.remove('is-running'); $('#focus-toggle').innerHTML = '<svg class="icon"><use href="#i-play"/></svg>'; }
$('#focus-toggle').onclick = () => {
  if (tid) return stopT();
  tid = setInterval(tick, 1000); $('#focus').classList.add('is-running'); $('#focus-toggle').innerHTML = '<svg class="icon"><use href="#i-pause"/></svg>';
};
$$('#focus-modes .chip').forEach(c => c.onclick = () => { stopT(); tmin = +c.dataset.min; left = tmin * 60; $('#focus-time').textContent = fmtT(left); $$('#focus-modes .chip').forEach(x => x.classList.toggle('is-active', x === c)); });

/* ---------- ROTINA ---------- */
let diaSel = new Date().getDay();
function renderRotina() {
  $('#day-tabs').innerHTML = ORDEM.map(d => `<button role="tab" class="${d === diaSel ? 'is-active' : ''} ${d === new Date().getDay() ? 'is-today' : ''}" data-d="${d}">${DIAS[d]}<b>${D.rotina[d].length}</b></button>`).join('');
  $$('#day-tabs button').forEach(b => b.onclick = () => { diaSel = +b.dataset.d; renderRotina(); });
  const hoje = diaSel === new Date().getDay(), dn = hoje ? S.done[iso()] || {} : {};
  $('#rotina-blocks').innerHTML = D.rotina[diaSel].map(blockHtml.bind(null, dn)).join('');
  bindBlocks($('#rotina-blocks'), hoje ? iso() : null);
  const tot = D.dist.reduce((a, x) => a + x[1], 0);
  $('#rotina-dist').innerHTML = D.dist.map(([n, h]) => `<div class="kv"><span>${n}</span><span>${h} h</span></div><div class="bar"><i style="width:${h / 7.5 * 100}%"></i></div>`).join('') + `<div class="kv"><b>Total</b><b>${tot} h</b></div>`;
  $('#rotina-rule').innerHTML = `<ul>${D.regra.map(r => `<li class="kv"><span style="color:var(--text)">${esc(r)}</span></li>`).join('')}</ul>`;
}

/* ---------- PLANO ---------- */
function renderPlano() {
  const p = proxProva();
  $('#plano-alert').textContent = p ? `Faltam ${diasAte(p.data)} dias para ${p.nome} (${fmtData(p.data)}). Confirme tudo no edital oficial.` : 'Todas as datas da lista já passaram.';
  $('#provas-list').innerHTML = D.provas.map(x => { const d = diasAte(x.data); return `<button class="card" data-p="${x.id}" style="text-align:left;width:100%"><div class="cover" style="background-image:${cover(x.id)}"></div><div style="display:flex;justify-content:space-between;gap:10px"><div><p class="card__title">${esc(x.nome)}</p><p class="muted">${esc(x.curso)}</p></div>${badge(x.nivel)}</div><p class="countdown" style="margin-top:12px">${d >= 0 ? d : '—'}<span class="muted" style="font-family:var(--font);font-size:13px"> ${d >= 0 ? 'dias · ' : 'encerrada · '}${fmtData(x.data)}</span></p><p class="muted" style="margin-top:6px">${esc(x.insc)}</p></button>`; }).join('');
  $$('[data-p]').forEach(b => b.onclick = () => { const x = D.provas.find(q => q.id === b.dataset.p); openSheet(fmtData(x.data).toUpperCase(), x.nome, `<p>${badge(x.nivel)} <span class="tag">${esc(x.curso)}</span></p><h4>Quando</h4><p>${esc(x.hora)}</p><h4>Inscrição</h4><p>${esc(x.insc)}</p><h4>O que saber</h4><ul>${x.info.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`); });
  const nk = 'n48'; const nd = (S.done[nk] = S.done[nk] || {});
  $('#next48').innerHTML = D.next48.map((t, i) => `<li class="item ${nd[i] ? 'is-done' : ''}" data-n="${i}"><span class="item__check"><svg class="icon"><use href="#i-check"/></svg></span><span class="item__main"><span class="item__title">${esc(t)}</span></span></li>`).join('');
  $$('[data-n]').forEach(el => el.onclick = () => { nd[el.dataset.n] = !nd[el.dataset.n]; save(); renderPlano(); });
  $('#fases-list').innerHTML = D.fases.map(f => `<div class="card"><p class="card__title">${esc(f.nome)}</p><p class="muted">${fmtData(f.ini)} a ${fmtData(f.fim)} · ${esc(f.foco)}</p>${f.semanas.map(s => `<div class="kv" style="flex-direction:column;gap:2px"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join('')}</div>`).join('');
  $('#estagio-list').innerHTML = D.estagio.map(e => `<div class="card"><p class="card__title">${esc(e.t)}</p><p>${esc(e.d)}</p></div>`).join('');
}
$$('#plano-toggle .segmented__btn').forEach(b => b.onclick = () => {
  $$('#plano-toggle .segmented__btn').forEach(x => x.classList.toggle('is-active', x === b));
  $$('#view-plano .sub').forEach(s => s.classList.toggle('is-active', s.id === 'sub-' + b.dataset.sub));
});

/* ---------- MATÉRIAS ---------- */
let filtroN = 'all';
function renderMaterias() {
  $('#materias-list').innerHTML = D.materias.filter(m => filtroN === 'all' || m.nivel === +filtroN).map(m => `<button class="card" data-m="${m.id}" style="text-align:left;width:100%"><div class="cover" style="background-image:${cover(m.id)}"></div><div style="display:flex;justify-content:space-between"><p class="card__title">${esc(m.nome)}</p>${badge(m.nivel)}</div><p class="muted">${esc(m.metodo)}</p><p style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px">${m.topicos.slice(0, 4).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</p></button>`).join('');
  $$('[data-m]').forEach(b => b.onclick = () => { const m = materia(b.dataset.m); openSheet('DIFICULDADE: ' + NIV[m.nivel].toUpperCase(), m.nome, `<h4>Método</h4><p>${esc(m.metodo)}</p><h4>Dicas de estudo</h4><ul>${m.dicas.map(d => `<li>${esc(d)}</li>`).join('')}</ul><h4>Tópicos</h4><ul>${m.topicos.map(t => `<li>${esc(t)}</li>`).join('')}</ul><h4>Minhas anotações</h4><textarea id="mn" rows="4" placeholder="Fórmulas, dúvidas, links...">${esc((S.notes || {})[m.id] || '')}</textarea>`, '<button class="btn btn--lime btn--block" id="mn-ok">Salvar anotações</button>'); $('#mn-ok').onclick = () => { (S.notes = S.notes || {})[m.id] = $('#mn').value; save(); toast('Anotações salvas'); }; });
  $('#metodo-steps').innerHTML = D.metodo.map(s => `<li><b>${esc(s[0])}</b>${esc(s[1])}</li>`).join('');
  $('#degraus-list').innerHTML = D.degraus.map(g => `<div class="card"><div style="display:flex;justify-content:space-between"><p class="card__title">${esc(g[0])}</p>${badge(g[1])}</div><p class="muted">${esc(g[2])}</p></div>`).join('') + `<p class="hint">${esc(D.degrauRegra)}</p>`;
  $('#redacao-modelo').innerHTML = `<p class="card__title">Modelo de 4 parágrafos</p>` + D.redModelo.map(r => `<div class="kv" style="flex-direction:column;gap:2px"><b>${esc(r[0])}</b><span>${esc(r[1])}</span></div>`).join('');
  $('#redacao-extra').innerHTML = `<div class="card"><p class="card__title">Autocorreção (0–200 por competência)</p>${D.competencias.map(c => `<div class="kv" style="flex-direction:column;gap:2px"><b>${esc(c[0])}</b><span>${esc(c[1])}</span></div>`).join('')}</div>` +
    `<div class="card"><p class="card__title">Repertórios coringa</p><p style="display:flex;flex-wrap:wrap;gap:6px">${D.repertorios.map(r => `<span class="tag">${esc(r)}</span>`).join('')}</p></div>` +
    `<div class="card"><p class="card__title">Eixos de tema para treinar</p><p style="display:flex;flex-wrap:wrap;gap:6px">${D.temas.map(r => `<span class="tag">${esc(r)}</span>`).join('')}</p></div>`;
}
$$('#materias-filter .chip').forEach(c => c.onclick = () => { filtroN = c.dataset.level; $$('#materias-filter .chip').forEach(x => x.classList.toggle('is-active', x === c)); renderMaterias(); });

/* ---------- ERROS (revisão D+1, D+7, D+21) ---------- */
const INT = [1, 7, 21]; let filtroE = 'all';
const proxRev = e => e.rev >= 3 ? null : addDias(e.data, INT[e.rev]);
function renderErros() {
  const hj = iso(), l = S.erros.filter(e => filtroE === 'all' || e.tipo === filtroE);
  l.sort((a, b) => (proxRev(a) || '9').localeCompare(proxRev(b) || '9'));
  const due = S.erros.filter(e => proxRev(e) && proxRev(e) <= hj).length; $('#erros-due').textContent = due;
  $('#erros-empty').hidden = l.length > 0;
  $('#erros-list').innerHTML = l.map(e => { const p = proxRev(e), dd = p && p <= hj; return `<li><button class="item ${dd ? 'item--now' : ''} ${!p ? 'is-done' : ''}" data-e="${e.id}"><span class="item__main"><span class="item__title">${esc(e.enun)}</span><span class="item__sub" style="display:block">${esc(e.mat)} · ${esc(e.tipo)}</span></span><span class="item__side">${p ? (dd ? '<b style="color:var(--lime)">Revisar hoje</b>' : 'Em ' + fmtData(p)) : 'Dominado'}<span>${e.rev}/3</span></span></button></li>`; }).join('');
  $$('[data-e]').forEach(b => b.onclick = () => {
    const e = S.erros.find(x => x.id === b.dataset.e), p = proxRev(e);
    openSheet(e.tipo.toUpperCase(), e.mat, `<h4>Enunciado</h4><p>${esc(e.enun)}</p><h4>Regra para lembrar</h4><p>${esc(e.regra || '—')}</p><h4>Revisões</h4><p>${e.rev} de 3 · ${p ? 'próxima em ' + fmtData(p) : 'concluído'}</p>`,
      `${p ? '<button class="btn btn--lime" id="er-ok" style="flex:1">Refiz certo</button>' : ''}<button class="btn btn--danger" id="er-del">Apagar</button>`);
    $('#er-ok')?.addEventListener('click', () => { e.rev++; save(); closeSheet(); renderErros(); toast(e.rev >= 3 ? 'Erro dominado!' : 'Revisão registrada'); });
    $('#er-del').onclick = () => { S.erros = S.erros.filter(x => x !== e); save(); closeSheet(); renderErros(); };
  });
}
$$('#erros-filter .chip').forEach(c => c.onclick = () => { filtroE = c.dataset.type; $$('#erros-filter .chip').forEach(x => x.classList.toggle('is-active', x === c)); renderErros(); });
$('#erro-new').onclick = () => {
  openSheet('NOVO', 'Registrar erro', `<input id="e-enun" placeholder="Enunciado curto" maxlength="120"><select id="e-mat">${D.materias.map(m => `<option>${esc(m.nome)}</option>`).join('')}</select><select id="e-tipo"><option value="conceito">Conceito</option><option value="conta">Conta</option><option value="interpretacao">Interpretação</option><option value="distracao">Distração</option></select><input id="e-regra" placeholder="Regra para não errar de novo" maxlength="140">`, '<button class="btn btn--lime btn--block" id="e-ok">Salvar erro</button>');
  $('#e-ok').onclick = () => { const enun = $('#e-enun').value.trim(); if (!enun) return toast('Escreva o enunciado.'); S.erros.push({ id: Date.now() + '', enun, mat: $('#e-mat').value, tipo: $('#e-tipo').value, regra: $('#e-regra').value.trim(), data: iso(), rev: 0 }); save(); closeSheet(); renderErros(); toast('Erro registrado. Revise amanhã.'); };
};

/* ---------- PERFIL ---------- */
function renderPerfil() {
  const u = S.user || {}; $('#avatar').textContent = (u.name || '?')[0].toUpperCase(); applyPhotos(); $('#perfil-email').textContent = `${u.name || ''} · ${u.email || ''}`;
  const blocos = Object.values(S.done).reduce((a, d) => a + Object.values(d).filter(Boolean).length, 0), sess = Object.values(S.sessions).reduce((a, b) => a + b, 0);
  $('#perfil-stats').innerHTML = `<div><b>${blocos}</b><span>blocos feitos</span></div><div><b>${sess}</b><span>sessões de foco</span></div><div><b>${S.erros.length}</b><span>erros no caderno</span></div>`;
  $('#weekly-history').innerHTML = S.weekly.slice(-4).reverse().map(w => `<div class="card"><p class="card__title">Semana de ${fmtData(w.data)}</p><div class="kv"><span>Acerto</span><span>${w.acerto}%</span></div><div class="kv"><span>Redação mais fraca</span><span>${esc(w.comp || '—')}</span></div><div class="kv"><span>Horas</span><span>${w.horas} h</span></div></div>`).join('');
  $('#pref-hours').value = S.prefs.hours; $('#pref-notify').checked = S.prefs.notify; $('#pref-reduce').checked = S.prefs.reduce;
  document.body.classList.toggle('reduce-motion', S.prefs.reduce);
}
$('#weekly-form').onsubmit = e => {
  e.preventDefault(); const a = +$('#w-acerto').value, h = +$('#w-horas').value;
  if (!$('#w-acerto').value || !$('#w-horas').value) return toast('Preencha acerto e horas.');
  S.weekly.push({ data: iso(), acerto: a, comp: $('#w-comp').value, horas: h }); save();
  $('#weekly-hint').textContent = (a < 60 ? 'Abaixo de 60%: volte um degrau nos tópicos. ' : a >= 70 ? 'Acima de 70%: pode subir um degrau. ' : '') + (h < S.prefs.hours ? `Você cumpriu ${h} de ${S.prefs.hours} h: aplique a regra de corte.` : 'Meta de horas cumprida.') + ($('#w-comp').value ? ' Na próxima semana, foque em ' + $('#w-comp').value + '.' : '');
  e.target.reset(); renderPerfil(); toast('Semana salva');
};
$('#pref-hours').onchange = e => { S.prefs.hours = +e.target.value || 34; save(); };
$('#pref-notify').onchange = e => { S.prefs.notify = e.target.checked; save(); };
$('#pref-reduce').onchange = e => { S.prefs.reduce = e.target.checked; save(); renderPerfil(); };
$('#btn-export').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' })); a.download = `foco-backup-${iso()}.json`; a.click(); toast('Backup exportado'); };
$('#btn-import').onclick = () => $('#import-file').click();
$('#import-file').onchange = async e => { try { S = Object.assign(base(), JSON.parse(await e.target.files[0].text())); save(); renderAll(); toast('Dados importados'); } catch (x) { toast('Arquivo inválido.'); } };
$('#btn-logout').onclick = () => { S.session = false; save(); location.reload(); };
$('#btn-reset').onclick = () => {
  openSheet('ATENÇÃO', 'Apagar tudo?', '<p>Conta, blocos, erros e histórico serão removidos deste aparelho. Exporte um backup antes.</p>', '<button class="btn btn--danger" id="rs-ok" style="flex:1">Apagar tudo</button>');
  $('#rs-ok').onclick = () => { localStorage.removeItem(KEY); location.reload(); };
};

/* ---------- Início ---------- */
function renderAll() { heroCovers(); renderHoje(); renderRotina(); renderPlano(); renderMaterias(); renderErros(); renderPerfil(); }
applyPhotos(); setMode('signup');
if (S.session && S.user) enter();
})();
