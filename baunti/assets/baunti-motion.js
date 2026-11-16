/* Baunti motion layer (v4)
   Plain ES module, no build step. Loaded after the app bundle on "/" only.
   It waits for React to render #main, then:
     1. builds the "How it works" story (vignettes, rabbit guide, progress line)
     2. adds the "if we don't collect, you don't pay" meter under pricing
     3. keeps the injected copy in sync with the ES/EN toggle
   Everything it adds is lazy: a skeleton holds the space until the content is
   built near the viewport, so the page never shifts. */

const doc = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const isReduced = () => reduced.matches;
const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1));
const SVG = 'http://www.w3.org/2000/svg';
const lang = () => (/^en\b/i.test(doc.lang) ? 'en' : 'es');

/* ---------------------------------------------------------------- helpers */

/** Skeleton primitive: BT.skel('line' | 'heading' | 'card' | 'avatar' | 'media' | 'pill') */
function skel(variant = 'line', extra = '') {
  const s = document.createElement('span');
  s.className = `bt-skel bt-skel--${variant} ${extra}`.trim();
  s.setAttribute('aria-hidden', 'true');
  return s;
}

/**
 * Turn `host` into a lazy region: show a skeleton, build the content with
 * `build()` once the region is near the viewport, then reveal it.
 * Resolves with the content element.
 */
function lazyRegion(host, variant, build, { delay = 0, hidden = false } = {}) {
  host.classList.add('bt-lazy');
  if (!hidden) host.setAttribute('aria-busy', 'true');
  else host.setAttribute('aria-hidden', 'true');
  host.style.setProperty('--bt-delay', `${delay}ms`);
  host.append(skel(variant));
  return new Promise((resolve) => {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      idle(() => {
        const content = document.createElement('div');
        content.className = 'bt-content';
        content.append(build());
        host.append(content);
        requestAnimationFrame(() => {
          host.setAttribute('aria-busy', 'false');
          setTimeout(() => host.querySelector(':scope > .bt-skel')?.remove(), 400);
        });
        resolve(content);
      }, { timeout: 600 });
    }, { rootMargin: '400px 0px' });
    io.observe(host);
  });
}

/** Run `fn` once when `el` is at least `ratio` visible. */
function onceVisible(el, fn, ratio = 0.5) {
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.intersectionRatio >= ratio)) { io.disconnect(); fn(); }
  }, { threshold: [ratio] });
  io.observe(el);
}

const svg = (markup, label) =>
  `<svg viewBox="0 0 240 140" xmlns="${SVG}" focusable="false" aria-hidden="true"${label ? ` data-name="${label}"` : ''}>${markup}</svg>`;

/* Baunti rabbit with monocle, from the loader artwork. */
const rabbit = (x, y, s, cls = '') => `
  <g transform="translate(${x} ${y}) scale(${s})" class="${cls}">
    <rect class="f-ink" x="17" y="3" width="10" height="28" rx="5"/>
    <g transform="rotate(14 42 30)"><rect class="f-ink" x="37" y="3" width="10" height="28" rx="5"/></g>
    <path class="f-ink" d="M14 40c0-8.8 7.6-14 18-14s18 5.2 18 14c0 9-7.4 17-18 17S14 49 14 40Z"/>
    <circle class="f-card" cx="25" cy="40" r="2"/>
    <circle cx="39" cy="40" r="6" fill="none" stroke="#FF6B5B" stroke-width="2.8"/>
    <circle class="f-card" cx="39" cy="40" r="2"/>
  </g>`;

/* ---------------------------------------------------------- the vignettes */
/* Coordinates are in a 240×140 box. Elements with an a-* class animate when
   the vignette plays; at rest each one shows its final state. */

const vignettes = [
  // 1. The portfolio file flies into Baunti's panel and becomes rows.
  () => {
    const rows = [0, 1, 2, 3].map((i) => `
      <g class="a-row" style="--i:${i}">
        <circle class="f-soft" cx="132" cy="${66 + i * 13}" r="3"/>
        <rect class="f-soft" x="140" y="${63 + i * 13}" width="${[54, 40, 60, 46][i]}" height="6" rx="3"/>
        <rect class="${i === 1 ? 'f-accent' : 'f-faint'}" x="${204}" y="${63 + i * 13}" width="12" height="6" rx="3"/>
      </g>`).join('');
    return svg(`
      <path class="s-soft" d="M70 70 H112" stroke-width="2" stroke-dasharray="3 5" fill="none" stroke-linecap="round"/>
      <rect class="f-card s-soft" x="114" y="20" width="112" height="104" rx="14" stroke-width="1.5"/>
      <rect class="a-glow s-accent" x="114" y="20" width="112" height="104" rx="14" stroke-width="2" fill="none" style="opacity:0"/>
      ${rabbit(122, 26, 0.36)}
      <rect class="f-ink" x="148" y="36" width="44" height="7" rx="3.5"/>
      <rect class="f-faint" x="148" y="47" width="28" height="5" rx="2.5"/>
      ${rows}
      <g class="a-file" style="opacity:0">
        <path class="f-card s-ink" stroke-width="1.6" d="M22 34h30l12 12v52a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V40a6 6 0 0 1 6-6Z"/>
        <path class="s-ink" stroke-width="1.6" fill="none" d="M52 34v12h12"/>
        <rect class="f-soft" x="24" y="56" width="32" height="5" rx="2.5"/>
        <rect class="f-soft" x="24" y="66" width="26" height="5" rx="2.5"/>
        <rect class="f-soft" x="24" y="76" width="30" height="5" rx="2.5"/>
        <rect class="f-accent" x="24" y="88" width="20" height="9" rx="3"/>
      </g>
      <g opacity=".9">
        <path class="f-card s-soft" stroke-width="1.2" d="M22 34h30l12 12v52a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V40a6 6 0 0 1 6-6Z" style="opacity:.55"/>
        <rect class="f-faint" x="24" y="56" width="32" height="5" rx="2.5"/>
        <rect class="f-faint" x="24" y="66" width="26" height="5" rx="2.5"/>
        <text x="25" y="96" font-size="9" class="f-soft">CSV</text>
      </g>`);
  },

  // 2. The rules: tone, schedule, payment plans. Each one gets approved.
  () => {
    const icons = [
      // tone: speech bubble
      `<path class="s-ink" fill="none" stroke-width="1.6" stroke-linejoin="round" d="M-7 -6h14a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-6l-5 4v-4h-3a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3Z"/>`,
      // schedule: clock
      `<circle class="s-ink" fill="none" stroke-width="1.6" r="9"/><path class="s-ink" stroke-width="1.6" stroke-linecap="round" fill="none" d="M0 -5v5l4 3"/>`,
      // plans: coins
      `<ellipse class="s-ink" fill="none" stroke-width="1.6" cx="0" cy="-4" rx="8" ry="3.5"/><path class="s-ink" fill="none" stroke-width="1.6" d="M-8 -4v8c0 2 3.6 3.5 8 3.5s8-1.5 8-3.5v-8"/>`,
    ];
    const widths = [[70, 34], [52, 46], [64, 28]];
    const rows = [0, 1, 2].map((i) => {
      const y = 26 + i * 36;
      return `
      <g class="a-rule" style="--i:${i}">
        <rect class="f-card s-soft" x="16" y="${y}" width="208" height="28" rx="9" stroke-width="1.2"/>
        <g transform="translate(36 ${y + 14})">${icons[i]}</g>
        <rect class="f-soft" x="54" y="${y + 8}" width="${widths[i][0]}" height="6" rx="3"/>
        <rect class="f-faint" x="54" y="${y + 17}" width="${widths[i][1]}" height="4" rx="2"/>
      </g>
      <g class="a-tick" style="--i:${i}">
        <circle class="f-ok" cx="204" cy="${y + 14}" r="8"/>
        <path class="s-bg" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M200 ${y + 14}l3 3 5-6"/>
      </g>`;
    }).join('');
    return svg(rows);
  },

  // 3. Baunti ranks the accounts: the likeliest to pay rises to the top.
  () => {
    // final order (top to bottom) with the slot each row started in
    const rows = [
      { score: 0.92, start: 2, amt: 44 },
      { score: 0.74, start: 0, amt: 30 },
      { score: 0.51, start: 3, amt: 52 },
      { score: 0.28, start: 1, amt: 24 },
    ];
    const H = 27;
    const body = rows.map((r, i) => {
      const y = 18 + i * H;
      return `
      <g class="a-rank" style="--from:${(r.start - i) * H}px">
        <rect class="f-card s-soft" x="34" y="${y}" width="190" height="22" rx="7" stroke-width="1.2"/>
        <circle class="f-soft" cx="47" cy="${y + 11}" r="5"/>
        <rect class="f-soft" x="58" y="${y + 6}" width="44" height="5" rx="2.5"/>
        <rect class="f-faint" x="58" y="${y + 14}" width="70" height="3" rx="1.5"/>
        <rect class="${i === 0 ? 'f-accent' : 'f-ink'}" x="58" y="${y + 14}" width="${70 * r.score}" height="3" rx="1.5" opacity="${i === 0 ? 1 : 0.55}"/>
        <rect class="f-faint" x="${212 - r.amt}" y="${y + 8}" width="${r.amt}" height="6" rx="3"/>
      </g>`;
    }).join('');
    return svg(`${body}
      <g class="a-top"><circle class="f-accent" cx="20" cy="29" r="9"/><text x="20" y="32.5" font-size="10" text-anchor="middle" fill="#14213D">1</text></g>
      <path class="s-soft" stroke-width="1.4" fill="none" stroke-linecap="round" d="M20 46v62M16 102l4 6 4-6"/>`);
  },

  // 4. Customers answer on their channel; Baunti offers a plan they pick.
  () => {
    const bubbles = [
      `<rect class="f-soft" x="88" y="26" width="52" height="16" rx="8"/>`,
      `<rect class="f-ink" x="112" y="48" width="42" height="13" rx="6.5"/>`,
      `<rect class="f-soft" x="88" y="67" width="56" height="26" rx="8"/><rect class="f-card" x="93" y="80" width="21" height="8" rx="4"/><rect class="f-card" x="118" y="80" width="21" height="8" rx="4"/>`,
      `<rect class="f-accent" x="118" y="99" width="36" height="13" rx="6.5"/>`,
    ].map((b, i) => `<g class="a-bubble" style="--i:${i}">${b}</g>`).join('');
    const chans = [
      `<path class="s-ink" fill="none" stroke-width="1.5" d="M-6 5l1.4-3.6A7 7 0 1 1 -1.6 5.6Z" stroke-linejoin="round"/>`,
      `<rect class="s-ink" fill="none" stroke-width="1.5" x="-7" y="-5" width="14" height="10" rx="2.5"/><path class="s-ink" stroke-width="1.5" d="M-3 0h6" stroke-linecap="round"/>`,
      `<rect class="s-ink" fill="none" stroke-width="1.5" x="-7" y="-5" width="14" height="10" rx="2"/><path class="s-ink" fill="none" stroke-width="1.5" d="M-7 -4l7 5 7-5"/>`,
    ].map((c, i) => `<g class="a-chan" style="--i:${i}"><circle class="f-card s-soft" stroke-width="1.2" cx="38" cy="${40 + i * 30}" r="13"/><g transform="translate(38 ${40 + i * 30})">${c}</g></g>`).join('');
    return svg(`${chans}
      <rect class="f-card s-ink" x="80" y="12" width="82" height="118" rx="14" stroke-width="1.6"/>
      <rect class="f-faint" x="108" y="17" width="26" height="4" rx="2"/>
      ${bubbles}
      <g class="a-typing" style="opacity:0"><rect class="f-faint" x="88" y="70" width="26" height="12" rx="6"/><circle class="f-soft" cx="95" cy="76" r="1.8"/><circle class="f-soft" cx="101" cy="76" r="1.8"/><circle class="f-soft" cx="107" cy="76" r="1.8"/></g>
      <path class="s-soft" fill="none" stroke-width="1.4" stroke-dasharray="2 4" stroke-linecap="round" d="M52 70H78"/>
      ${rabbit(184, 82, 0.6)}`);
  },

  // 5. The payment lands in the company's account and the balance rises.
  () => svg(`
      <rect class="f-card s-ink" x="40" y="58" width="160" height="66" rx="12" stroke-width="1.6"/>
      <rect class="f-soft" x="54" y="70" width="46" height="5" rx="2.5"/>
      <text class="f-ink bt-counter" x="54" y="102" font-size="17">Q9,800.00</text>
      <rect class="f-faint" x="54" y="111" width="132" height="4" rx="2"/>
      <rect class="a-bar f-ok" x="54" y="111" width="132" height="4" rx="2"/>
      <g class="a-paid"><circle class="f-ok" cx="182" cy="74" r="8"/><path class="s-bg" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M178 74l3 3 5-6"/></g>
      <path class="s-soft" fill="none" stroke-width="1.4" stroke-dasharray="2 4" d="M120 20V44" stroke-linecap="round"/>
      <g class="a-coin"><circle class="f-accent" cx="120" cy="40" r="13"/><text x="120" y="44.5" font-size="12" text-anchor="middle" fill="#14213D">Q</text></g>
      <text class="f-soft" x="200" y="50" font-size="9" text-anchor="end">+Q1,480.00</text>`),
];

const fmtQ = (n) => 'Q' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function playCounter(root) {
  const el = root.querySelector('.bt-counter');
  if (!el || isReduced()) return;
  const from = 8320, to = 9800, start = performance.now() + 1000, dur = 900;
  el.textContent = fmtQ(from);
  const tick = (t) => {
    const p = Math.min(1, Math.max(0, (t - start) / dur));
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmtQ(Math.round(from + (to - from) * e));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* -------------------------------------------------------------- the story */

function buildStory(section) {
  const ol = section.querySelector('ol');
  if (!ol || ol.dataset.btStory) return;
  ol.dataset.btStory = '1';
  const wrap = ol.parentElement;
  let active = -1;
  // React re-creates the <li> elements when the language changes, so never
  // cache them: read them fresh and decorate any step that lost its vignette.
  const stepsNow = () => [...ol.children].filter((c) => c.tagName === 'LI');
  const decorate = () => stepsNow().forEach((li, i) => {
    if (li.querySelector(':scope > .bt-vig')) return;
    const slot = document.createElement('span');
    slot.className = 'bt-vig';
    li.insertBefore(slot, li.children[1] || null);
    lazyRegion(slot, 'media', () => {
      const t = document.createElement('template');
      t.innerHTML = vignettes[i] ? vignettes[i]().trim() : '';
      return t.content;
    }, { delay: i * 60, hidden: true }).then((content) => {
      onceVisible(slot, () => {
        if (isReduced()) return;
        content.classList.add('bt-play');
        if (i === 4) playCounter(content);
      }, 0.6);
    });
  });
  decorate();
  new MutationObserver(() => { decorate(); active = -1; schedule(); }).observe(ol, { childList: true });

  // progress fill on both line variants (vertical on mobile, horizontal on desktop)
  const lines = [...wrap.children].filter((c) => c !== ol && c.tagName === 'DIV');
  lines.forEach((line, k) => {
    const p = document.createElement('span');
    p.className = 'bt-progress' + (k === 0 ? ' bt-y' : '');
    p.setAttribute('aria-hidden', 'true');
    line.prepend(p);
  });
  const scrollDriven = CSS.supports('animation-timeline: view()');

  // rabbit guide
  const guide = document.createElement('span');
  guide.className = 'bt-guide';
  guide.setAttribute('aria-hidden', 'true');
  guide.innerHTML = `<svg viewBox="0 0 64 64"><g class="g-body">
    <rect class="g-fg" x="17" y="3" width="10" height="28" rx="5"/>
    <g transform="rotate(14 42 30)"><rect class="g-fg" x="37" y="3" width="10" height="28" rx="5"/></g>
    <path class="g-fg" d="M14 40c0-8.8 7.6-14 18-14s18 5.2 18 14c0 9-7.4 17-18 17S14 49 14 40Z"/>
    <circle class="g-eye" cx="25" cy="40" r="2"/><circle cx="39" cy="40" r="6" fill="none" stroke="#FF6B5B" stroke-width="2.8"/>
    <circle class="g-eye" cx="39" cy="40" r="2"/></g></svg>`;
  wrap.append(guide);
  guide.addEventListener('animationend', () => guide.classList.remove('bt-hop'));

  const place = (i, hop) => {
    const dot = stepsNow()[i]?.firstElementChild;
    if (!dot) return;
    const w = wrap.getBoundingClientRect(), d = dot.getBoundingClientRect();
    const x = d.left - w.left + d.width / 2 - 17;
    const y = d.top - w.top - 33;
    guide.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (hop && !isReduced()) { guide.classList.remove('bt-hop'); void guide.offsetWidth; guide.classList.add('bt-hop'); }
  };
  const update = () => {
    const steps = stepsNow();
    if (!steps.length) return;
    let i = 0;
    const horizontal = steps.length > 1 && Math.abs(steps[0].getBoundingClientRect().top - steps[1].getBoundingClientRect().top) < 4;
    if (horizontal) {
      // one row of cards: walk the steps as the row travels up the viewport
      const r = ol.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.95 - r.top) / (innerHeight * 0.65)));
      i = Math.min(steps.length - 1, Math.floor(p * steps.length));
    } else {
      const line = innerHeight * 0.62;
      steps.forEach((li, k) => { if (li.getBoundingClientRect().top < line) i = k; });
    }
    if (i !== active || !steps[i].classList.contains('bt-active')) {
      steps.forEach((li, k) => li.classList.toggle('bt-active', k === i));
      place(i, active !== -1);
      active = i;
      if (!scrollDriven) wrap.style.setProperty('--bt-p', String(i / (steps.length - 1)));
    }
  };
  let raf = 0;
  const schedule = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', () => { active = -1; schedule(); }, { passive: true });
  // the guide jumps without a hop on first placement
  guide.style.transition = 'none';
  update();
  requestAnimationFrame(() => requestAnimationFrame(() => { guide.style.transition = ''; }));
}

/* -------------------------------------------------------------- the meter */

const METER_COPY = {
  es: {
    title: 'Si un intento no termina en pago, la comisión no se mueve.',
    events: ['Recordatorio enviado', 'Pago recibido', 'Promesa para el viernes', 'Sin respuesta', 'Pago recibido'],
    client: 'Cobrado en tu cuenta',
    fee: 'Comisión de Baunti',
    feeIdle: 'Nada que pagar',
    feeOn: 'Solo sobre lo cobrado',
    note: 'Ejemplo ilustrativo. La comisión es un porcentaje de lo recuperado, definido tras el piloto.',
    label: 'Ejemplo: la comisión de Baunti solo avanza con pagos recibidos',
  },
  en: {
    title: 'If an attempt doesn’t end in a payment, the fee doesn’t move.',
    events: ['Reminder sent', 'Payment received', 'Promise for Friday', 'No reply', 'Payment received'],
    client: 'Collected into your account',
    fee: 'Baunti’s fee',
    feeIdle: 'Nothing to pay',
    feeOn: 'Only on what’s collected',
    note: 'Illustrative example. The fee is a percentage of what’s recovered, set after the pilot.',
    label: 'Example: Baunti’s fee only moves with payments received',
  },
};
const EVENTS = [
  { pay: 0 }, { pay: 1480 }, { pay: 0 }, { pay: 0 }, { pay: 2250 },
];
const TOTAL = EVENTS.reduce((s, e) => s + e.pay, 0);

function buildMeter(section) {
  const anchor = section.querySelector('ul');
  if (!anchor || section.querySelector('.bt-meter')) return;
  const outer = document.createElement('div');
  outer.className = 'bt-meter-wrap';
  const host = document.createElement('figure');
  host.className = 'bt-meter bt-glass';
  outer.append(host);
  anchor.after(outer);

  let state = { step: -1 };
  let content;
  const render = () => {
    if (!content) return;
    const c = METER_COPY[lang()];
    host.setAttribute('aria-label', c.label);
    const collected = EVENTS.slice(0, state.step + 1).reduce((s, e) => s + e.pay, 0);
    content.querySelector('h3').textContent = c.title;
    content.querySelectorAll('ol li').forEach((li, i) => {
      li.querySelector('span').textContent = c.events[i];
      li.querySelector('span:last-child').textContent = EVENTS[i].pay ? fmtQ(EVENTS[i].pay) : '—';
      li.classList.toggle('on', i <= state.step);
    });
    const [client, fee] = content.querySelectorAll('.bt-bar');
    client.querySelector('dt span').textContent = c.client;
    client.querySelector('dt b').textContent = fmtQ(collected);
    client.querySelector('dd span').style.transform = `scaleX(${collected / TOTAL})`;
    fee.querySelector('dt span').textContent = c.fee;
    fee.querySelector('dt b').textContent = collected ? c.feeOn : c.feeIdle;
    // the fee bar is illustrative: it only moves when money came in
    fee.querySelector('dd span').style.transform = `scaleX(${(collected / TOTAL) * 0.22})`;
    content.querySelector('.bt-note').textContent = c.note;
  };

  lazyRegion(host, 'card', () => {
    const frag = document.createElement('div');
    frag.style.display = 'contents';
    frag.innerHTML = `
      <div><h3></h3><ol>${EVENTS.map((e) => `<li class="${e.pay ? 'pay' : 'miss'}"><i aria-hidden="true"></i><span></span><span></span></li>`).join('')}</ol></div>
      <dl class="bt-bars">
        <div class="bt-bar client"><dt><span></span><b></b></dt><dd aria-hidden="true"><span></span></dd></div>
        <div class="bt-bar fee"><dt><span></span><b></b></dt><dd aria-hidden="true"><span></span></dd></div>
      </dl>
      <figcaption class="bt-note"></figcaption>`;
    return frag;
  }).then((el) => {
    content = el;
    render();
    onceVisible(host, () => {
      if (isReduced()) { state.step = EVENTS.length - 1; render(); return; }
      const next = () => {
        state.step++;
        render();
        if (state.step < EVENTS.length - 1) setTimeout(next, 700);
      };
      setTimeout(next, 250);
    }, 0.55);
  });
  return render;
}


/* ------------------------------------------------------------- v5: waves */
/* A ribbon of thin sine strands, periodic over 1200px so it can drift
   forever by translating exactly one period. */
function waveRibbon({ strands = 13, amp = 46, seed = 0 } = {}) {
  const W = 2400, H = 420, step = 30;
  let paths = '';
  for (let i = 0; i < strands; i++) {
    const t = i / (strands - 1);
    const phase = seed + t * 1.9;
    const base = H / 2 + (t - 0.5) * 120;
    let d = '';
    for (let x = 0; x <= W; x += step) {
      const y = base
        + amp * Math.sin((2 * Math.PI * x) / 1200 + phase)
        + amp * 0.45 * Math.sin((2 * Math.PI * x) / 600 + phase * 2 + 1.3);
      d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1);
    }
    const accent = i === Math.round(strands * 0.62);
    const op = accent ? 0.5 : (0.35 + 0.65 * Math.sin(Math.PI * t)).toFixed(2);
    paths += `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${accent ? 1.4 : 1}" opacity="${op}"${accent ? ' class="w-accent"' : ''}/>`;
  }
  const el = document.createElement('div');
  el.className = 'bt-waves';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" focusable="false">${paths}</svg>`;
  return el;
}
function addWaves(main) {
  const hosts = [[document.getElementById('bt-ambient'), 0], [main.querySelector('#control'), 2.2], [main.querySelector('#demo'), 4.1], [document.querySelector('footer'), 1.1]];
  hosts.forEach(([host, seed]) => {
    if (!host || host.querySelector(':scope > .bt-waves')) return;
    const w = waveRibbon({ seed, strands: host.id === 'bt-ambient' ? 15 : 11 });
    host.append(w);
    requestAnimationFrame(() => requestAnimationFrame(() => w.classList.add('bt-on')));
  });
}

/* -------------------------------------------------------------- v5: heat */
const HEAT = '.btn, #pregunta div:has(> button + button) > button';
function heat(btn, x, y) {
  const r = btn.getBoundingClientRect();
  btn.style.setProperty('--hx', `${(x ?? r.left + r.width / 2) - r.left}px`);
  btn.style.setProperty('--hy', `${(y ?? r.top + r.height / 2) - r.top}px`);
  btn.classList.remove('bt-heat');
  void btn.offsetWidth; // restart the animation on rapid presses
  btn.classList.add('bt-heat');
  clearTimeout(btn.__btHeat);
  btn.__btHeat = setTimeout(() => btn.classList.remove('bt-heat'), 1000);
}
document.addEventListener('pointerdown', (e) => {
  const b = e.target.closest?.(HEAT);
  if (b && !b.disabled) heat(b, e.clientX, e.clientY);
}, { passive: true });
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const b = document.activeElement?.closest?.(HEAT);
  if (b && !b.disabled) heat(b);
});

/* -------------------------------------------------------------------- boot */

function enhance(main) {
  idle(() => addWaves(main), { timeout: 2000 });
  const story = main.querySelector('#como-funciona');
  if (story) buildStory(story);
  const modelo = main.querySelector('#modelo');
  const rerender = modelo && buildMeter(modelo);
  // the injected copy follows the language toggle
  new MutationObserver(() => rerender && rerender()).observe(doc, { attributes: true, attributeFilter: ['lang'] });
}

document.addEventListener('visibilitychange', () => doc.classList.toggle('bt-hidden', document.hidden));

function whenMain(cb) {
  const found = document.getElementById('main');
  if (found) return cb(found);
  const mo = new MutationObserver(() => {
    const m = document.getElementById('main');
    if (m) { mo.disconnect(); cb(m); }
  });
  mo.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
}

// Build after the app has painted its first frame, so the enhancements never
// compete with the hero for the main thread.
const start = () => whenMain((m) => requestAnimationFrame(() => setTimeout(() => enhance(m), 0)));
if (window.__btReady) start(); else addEventListener('baunti:ready', start, { once: true });
// safety net if the ready hook never fires
setTimeout(() => { if (!document.querySelector('.bt-guide, .bt-meter')) start(); }, 3500);

window.BT = { skel, lazyRegion };
