/* Baunti standalone pages (v7): theme and language toggles for /legal/ and /demo/.
   Uses the same storage keys as the app (baunti-theme, baunti-lang), so a
   choice made here carries over to the rest of the site and back. */
const root = document.documentElement;

function setTheme(t) {
  root.dataset.theme = t;
  try { localStorage.setItem('baunti-theme', t); } catch (e) {}
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', t === 'dark' ? '#14213D' : '#F4EDE0');
  syncLabels();
}

function setLang(l) {
  root.lang = l === 'en' ? 'en' : 'es';
  try { localStorage.setItem('baunti-lang', root.lang); } catch (e) {}
  const t = document.querySelector('[data-title-' + root.lang + ']');
  if (t) document.title = t.getAttribute('data-title-' + root.lang);
  syncLabels();
  window.dispatchEvent(new CustomEvent('baunti:lang', { detail: root.lang }));
}

function syncLabels() {
  const en = root.lang === 'en';
  const dark = root.dataset.theme === 'dark';
  document.querySelectorAll('[data-lang-toggle]').forEach(b => {
    b.textContent = en ? 'ES' : 'EN';
    b.setAttribute('aria-label', en ? 'Cambiar a español' : 'Switch to English');
  });
  document.querySelectorAll('[data-theme-toggle]').forEach(b => {
    const label = dark ? (en ? 'Switch to light mode' : 'Cambiar a modo claro') : (en ? 'Switch to dark mode' : 'Cambiar a modo oscuro');
    b.setAttribute('aria-label', label);
    b.setAttribute('title', label);
    b.querySelector('.i-moon')?.toggleAttribute('hidden', dark);
    b.querySelector('.i-sun')?.toggleAttribute('hidden', !dark);
  });
}

document.addEventListener('click', e => {
  const l = e.target.closest('[data-lang-toggle]');
  if (l) { setLang(root.lang === 'en' ? 'es' : 'en'); return; }
  const t = e.target.closest('[data-theme-toggle]');
  if (t) setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

setLang(root.lang);
