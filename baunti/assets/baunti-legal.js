/* Baunti legal layer (v7)
   1. Cookie notice: asks once, stores the answer for 12 months, reopens from
      any [data-cookie-settings] control. Essential storage is always on;
      measurement is optional and off until the visitor allows it.
      Anything optional must wait for consent:
        window.bauntiConsent.get()          -> { measurement: boolean } | null
        window.addEventListener('baunti:consent', e => e.detail.measurement)
   2. Legal links in the app footer (/ and /demo/simulador/), added next to the
      copyright line without editing the app bundle. */

const KEY = 'baunti-consent';
const VERSION = 1;
const MAX_AGE = 365 * 864e5;
const root = document.documentElement;

const T = {
  es: {
    title: 'Cookies en Baunti',
    body: 'Usamos solo lo esencial para que el sitio funcione y recuerde tu idioma y tema. ¿Nos dejas medir visitas de forma agregada para mejorarlo?',
    accept: 'Aceptar', reject: 'Rechazar', settings: 'Configurar', more: 'Política de cookies',
    essential: 'Esenciales', essentialHint: 'Hacen que el sitio funcione y recuerde tus opciones.', always: 'Siempre activas',
    measure: 'Medición', measureHint: 'Cuenta visitas de forma agregada. Nunca para publicidad.',
    save: 'Guardar mi elección', saved: 'Elección guardada',
    region: 'Aviso de cookies',
    privacy: 'Privacidad', terms: 'Términos', cookies: 'Cookies', cookieSettings: 'Configurar cookies', legalNav: 'Legal'
  },
  en: {
    title: 'Cookies on Baunti',
    body: 'We only use what the site needs to work and to remember your language and theme. Can we count visits in aggregate to improve it?',
    accept: 'Accept', reject: 'Reject', settings: 'Settings', more: 'Cookie policy',
    essential: 'Essential', essentialHint: 'Make the site work and remember your choices.', always: 'Always on',
    measure: 'Measurement', measureHint: 'Counts visits in aggregate. Never for advertising.',
    save: 'Save my choice', saved: 'Choice saved',
    region: 'Cookie notice',
    privacy: 'Privacy', terms: 'Terms', cookies: 'Cookies', cookieSettings: 'Cookie settings', legalNav: 'Legal'
  }
};

function lang() {
  const l = (root.lang || '').toLowerCase();
  if (l.startsWith('en')) return 'en';
  if (l.startsWith('es')) {
    // the app may not update <html lang>; its footer text is the source of truth there
    const f = document.querySelector('footer');
    if (f && /Made by/.test(f.textContent) && !/Hecho por/.test(f.textContent)) return 'en';
    return 'es';
  }
  try { if (/^en\b/.test(localStorage.getItem('baunti-lang') || '')) return 'en'; } catch (e) {}
  return 'es';
}
const t = k => T[lang()][k];

function read() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!v || v.v !== VERSION || Date.now() - Date.parse(v.at) > MAX_AGE) return null;
    return { measurement: !!v.measurement };
  } catch (e) { return null; }
}
function write(measurement) {
  const v = { v: VERSION, measurement: !!measurement, at: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
  window.dispatchEvent(new CustomEvent('baunti:consent', { detail: { measurement: !!measurement } }));
}

window.bauntiConsent = { get: read, open: () => show(true) };

/* ---------- notice ---------- */
let box = null, lastFocus = null;

function render(expanded) {
  const c = read();
  const on = c ? c.measurement : false;
  box.innerHTML = `
    <div class="bc-head">
      <svg class="bc-mark" viewBox="0 0 64 64" width="28" height="28" aria-hidden="true"><rect x="17" y="3" width="10" height="28" rx="5" fill="currentColor"/><rect x="37" y="3" width="10" height="28" rx="5" transform="rotate(14 42 30)" fill="currentColor"/><path d="M14 40c0-8.8 7.6-14 18-14s18 5.2 18 14c0 9-7.4 17-18 17S14 49 14 40Z" fill="currentColor"/><circle cx="25" cy="40" r="2" class="bc-eye"/><circle cx="39" cy="40" r="6" fill="none" stroke="#FF6B5B" stroke-width="2.8"/><circle cx="39" cy="40" r="2" class="bc-eye"/></svg>
      <h2 id="bc-title">${t('title')}</h2>
    </div>
    <p class="bc-body">${t('body')} <a href="/legal/#cookies">${t('more')}</a></p>
    <div class="bc-prefs" ${expanded ? '' : 'hidden'}>
      <div class="bc-row">
        <div><p class="bc-name">${t('essential')}</p><p class="bc-hint">${t('essentialHint')}</p></div>
        <span class="bc-always">${t('always')}</span>
      </div>
      <div class="bc-row">
        <div><p class="bc-name" id="bc-m">${t('measure')}</p><p class="bc-hint" id="bc-mh">${t('measureHint')}</p></div>
        <button type="button" class="bc-switch" role="switch" aria-checked="${on}" aria-labelledby="bc-m" aria-describedby="bc-mh" data-bc="toggle"><span></span></button>
      </div>
    </div>
    <div class="bc-actions">
      ${expanded
        ? `<button type="button" class="bc-btn bc-btn--solid" data-bc="save">${t('save')}</button>`
        : `<button type="button" class="bc-btn" data-bc="reject">${t('reject')}</button>
           <button type="button" class="bc-btn" data-bc="accept">${t('accept')}</button>
           <button type="button" class="bc-link" data-bc="settings" aria-expanded="false">${t('settings')}</button>`}
    </div>`;
  box.setAttribute('aria-label', t('region'));
  box.dataset.lang = lang();
}

function show(expanded) {
  lastFocus = document.activeElement;
  if (!box) {
    box = document.createElement('section');
    box.className = 'bc';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-labelledby', 'bc-title');
    box.addEventListener('click', onClick);
    document.body.appendChild(box);
  }
  box.dataset.expanded = expanded ? '1' : '0';
  render(expanded);
  requestAnimationFrame(() => box.classList.add('bc-in'));
  if (expanded) box.querySelector('[data-bc="toggle"]')?.focus({ preventScroll: true });
}

function hide() {
  if (!box) return;
  box.classList.remove('bc-in');
  box.classList.add('bc-out');
  const b = box; box = null;
  setTimeout(() => b.remove(), 320);
  if (lastFocus && document.contains(lastFocus) && lastFocus !== document.body) lastFocus.focus({ preventScroll: true });
}

function onClick(e) {
  const a = e.target.closest('[data-bc]');
  if (!a) return;
  const act = a.dataset.bc;
  if (act === 'accept') { write(true); hide(); }
  else if (act === 'reject') { write(false); hide(); }
  else if (act === 'settings') { box.dataset.expanded = '1'; render(true); box.querySelector('[data-bc="toggle"]')?.focus(); }
  else if (act === 'toggle') a.setAttribute('aria-checked', a.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
  else if (act === 'save') {
    write(box.querySelector('[data-bc="toggle"]').getAttribute('aria-checked') === 'true');
    a.textContent = t('saved');
    setTimeout(hide, 450);
  }
}

document.addEventListener('keydown', e => { if (e.key === 'Escape' && box && box.contains(document.activeElement) && read()) hide(); });
document.addEventListener('click', e => {
  if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); show(true); }
});

/* ---------- legal links in the app footer ---------- */
function footerLinks() {
  const f = document.querySelector('footer');
  if (!f || f.querySelector('.bl-legal')) return;
  // the bottom bar is the row that holds the copyright line
  const copy = [...f.querySelectorAll('p')].find(p => /©/.test(p.textContent));
  if (!copy || copy.closest('.foot-base')) return; // standalone pages ship their own links
  const nav = document.createElement('nav');
  nav.className = 'bl-legal';
  copy.insertAdjacentElement('afterend', nav);
  paintFooter();
}
function paintFooter() {
  const nav = document.querySelector('.bl-legal');
  if (!nav) return;
  const L = lang();
  if (nav.dataset.lang === L) return;
  nav.dataset.lang = L;
  nav.setAttribute('aria-label', t('legalNav'));
  nav.innerHTML = `
    <a href="/legal/#privacidad">${t('privacy')}</a>
    <a href="/legal/#terminos">${t('terms')}</a>
    <a href="/legal/#cookies">${t('cookies')}</a>
    <button type="button" data-cookie-settings>${t('cookieSettings')}</button>`;
}

function refreshLang() {
  paintFooter();
  // redraw only when the language actually changed, so focus and toggles survive
  if (box && box.dataset.lang !== lang()) {
    const on = box.querySelector('[data-bc="toggle"]')?.getAttribute('aria-checked');
    render(box.dataset.expanded === '1');
    if (on) box.querySelector('[data-bc="toggle"]')?.setAttribute('aria-checked', on);
  }
}

let queued = false;
new MutationObserver(ms => {
  if (queued || ms.every(m => box && box.contains(m.target))) return; queued = true;
  requestAnimationFrame(() => { queued = false; footerLinks(); refreshLang(); });
}).observe(document.body, { childList: true, subtree: true, characterData: true });
new MutationObserver(refreshLang).observe(root, { attributes: true, attributeFilter: ['lang'] });
window.addEventListener('baunti:lang', refreshLang);

function boot() {
  footerLinks();
  // let the loading screen finish before asking
  if (!read()) setTimeout(() => { if (!read() && !box) show(false); }, document.getElementById('ld') ? 1600 : 500);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
