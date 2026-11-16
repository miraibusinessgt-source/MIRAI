/* Baunti demo (v7)
   A guided, fully working collections conversation on a 3D phone.
   Everything runs in the browser: nothing typed here is sent anywhere.
   Cedro's policies drive every answer: friendly tone, up to 3 installments,
   promises no later than 15 days out, disputes and "stop" go to a person. */

const $ = s => document.querySelector(s);
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const L = () => (root.lang === 'en' ? 'en' : 'es');

/* ---------- facts of the simulation ---------- */
const BALANCE = 1480;
const POLICY_NO = 'AUT-20418';
const MAX_PROMISE_DAYS = 15;
const MAX_INSTALLMENTS = 3;
const today = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const DUE = addDays(today, -1);

const money = n => 'Q' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d, withDay = true) => {
  const o = withDay ? { weekday: 'long', day: 'numeric', month: 'long' } : { day: 'numeric', month: 'long' };
  return L() === 'en' ? d.toLocaleDateString('en-US', o) : d.toLocaleDateString('es-GT', o).replace(',', '');
};
const fmtShort = d => L() === 'en'
  ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  : d.toLocaleDateString('es-GT', { day: 'numeric', month: 'short' }).replace('.', '');
const nextWeekday = wd => { const diff = (wd - today.getDay() + 7) % 7 || 7; return addDays(today, diff); };

function split(total, n) {
  const cents = Math.round(total * 100), base = Math.floor(cents / n), rest = cents - base * n;
  return Array.from({ length: n }, (_, i) => (base + (i < rest ? 1 : 0)) / 100);
}

/* ---------- copy ---------- */
const C = {
  es: {
    placeholder: 'Escribe como si fueras Andrea…',
    send: 'Enviar', convo: 'Conversación con Aseguradora Cedro',
    biz: 'Aseguradora Cedro', today: 'Hoy',
    c_link: 'Mándame el link', c_friday: 'Te pago el viernes', c_plan: '¿Puedo pagar en cuotas?', c_dispute: 'No reconozco ese monto',
    c_yes: 'Sí, me parece', c_six: '¿Y en 6 cuotas?', c_ok3: 'Está bien, en 3', c_call: 'Prefiero que me llamen',
    c_skip: 'Avanzar al día del pago', c_receipt: 'Enviar foto del comprobante', c_again: 'Probar otra respuesta',
    hintPay: 'Toca el botón de pago en el mensaje.',
    pay: a => `Pagar ${a}`, payTo: 'Pago seguro de Aseguradora Cedro',
    b_open: (a, d) => `Hola Andrea, te escribe Baunti, asistente de cobranza de Aseguradora Cedro. La prima de tu póliza de auto por ${a} venció ayer, ${d}. Puedes pagarla aquí:`,
    b_link: a => `¡Claro! Tu saldo es de ${a}. Apenas se acredite te confirmo.`,
    b_promise: d => `¡Perfecto, Andrea! Quedamos para el ${d}. Ese día te mando tu link para que sea más fácil.`,
    b_promiseTooFar: d => `Entiendo. Lo más que podemos esperar es hasta el ${d}. ¿Te queda bien algún día antes? También podemos dividirlo en cuotas.`,
    b_pastDate: '¿Qué día de los próximos te queda bien?',
    b_reminder: a => `Hola Andrea, hoy es el día que acordamos para tu pago de ${a}. Aquí está tu link. ¡Gracias por cumplir!`,
    b_plan: parts => `Claro. Te propongo ${parts.length} cuotas: ${parts.join(', ').replace(/, ([^,]*)$/, ' y $1')}. ¿Te parece?`,
    b_planLimit: n => `Puedo ofrecerte hasta ${n} cuotas, que es lo que permite Aseguradora Cedro. ¿Te funciona así? Si necesitas otra opción, le paso tu caso a su equipo.`,
    b_planDone: a => `¡Listo, Andrea! Tu plan quedó registrado. La primera cuota de ${a} la puedes pagar aquí:`,
    b_hardship: 'Te entiendo, Andrea, a todos nos pasa. Busquemos algo que te funcione.',
    b_dispute: 'Entiendo, gracias por decírnoslo. Le paso tu caso a Aseguradora Cedro para que lo revisen y te contacten. No te escribiré más sobre esto mientras tanto.',
    b_call: 'Con gusto. Le pido a una persona del equipo de Aseguradora Cedro que te llame hoy en horario hábil.',
    b_stop: 'Entendido, no te escribiremos más por este medio. Si quieres resolverlo, puedes contactar directamente a Aseguradora Cedro.',
    b_wrong: 'Disculpa la molestia. Ya no te escribiremos a este número. ¡Que tengas buen día!',
    b_paidClaim: '¡Gracias por avisar! ¿Me mandas una foto del comprobante para confirmarlo con Aseguradora Cedro?',
    b_receiptOk: '¡Recibido, gracias! Lo estamos verificando con Aseguradora Cedro y te confirmamos.',
    b_unknown: 'Disculpa, no te entendí bien. ¿Quieres pagar hoy, decirnos una fecha o verlo en cuotas?',
    b_paidFull: a => `¡Recibimos tu pago de ${a}, Andrea! Tu póliza está al día. Gracias por cumplir.`,
    b_paidInst: (a, d) => `¡Recibimos tu primera cuota de ${a}! La siguiente es el ${d}; te escribo antes para recordártela.`,
    receiptTitle: 'Comprobante de transferencia', receiptBody: a => `${a} · Banco Industrial`,
    sheetPolicy: 'Póliza', sheetCard: 'Tarjeta', sheetCardVal: 'Visa •••• 4242 (simulada)', sheetConcept: 'Concepto',
    sheetConceptFull: 'Prima de póliza de auto', sheetConceptInst: n => `Cuota 1 de ${n}`,
    sheetPay: a => `Pagar ${a}`, sheetDone: 'Pago aprobado', sheetNote: 'El pago va directo a Aseguradora Cedro. Baunti nunca recibe el dinero.',
    status: { overdue: 'Vencida 1 día', promise: 'Promesa de pago', plan: 'Plan de pago', paid: 'Pagada', team: 'Con tu equipo', stop: 'No contactar', check: 'Por verificar' },
    policy: 'Póliza de auto ' + POLICY_NO,
    pol: { tone: 'Tono amable', plan: 'Hasta 3 cuotas', promise: 'Promesas hasta 15 días' },
    next: {
      waiting: 'Esperando respuesta de Andrea',
      promise: d => `Recordatorio con link el ${d}`,
      plan: 'Cobrar la cuota 1 hoy',
      paid: 'Nada. La cuenta está al día',
      inst: d => `Cuota 2 el ${d}`,
      team: 'Tu equipo revisa el reclamo',
      call: 'Tu equipo llama a Andrea hoy',
      stop: 'Ningún mensaje más por este canal',
      check: 'Confirmar el comprobante con tesorería'
    },
    log: {
      open: 'Primer aviso enviado, en horario permitido',
      link: 'Andrea pidió el link de pago',
      promise: d => `Promesa registrada para el ${d}, dentro de la política`,
      tooFar: 'Fecha fuera de política: Baunti propuso el límite',
      reminder: 'Recordatorio del día acordado enviado',
      plan: n => `Plan de ${n} cuotas propuesto, dentro de la política`,
      planLimit: 'Pidió más cuotas: Baunti ofreció el máximo permitido',
      planOk: 'Plan aceptado',
      paid: a => `Pago de ${a} confirmado, directo a la cuenta de Cedro`,
      dispute: 'Reclamo de monto: cobranza en pausa',
      call: 'Pidió una llamada: caso enviado a tu equipo',
      stop: 'Pidió no recibir mensajes: contacto detenido',
      wrong: 'Número equivocado: contacto detenido',
      receipt: 'Envió comprobante: pendiente de verificar'
    },
    alert: {
      dispute: ['Reclamo de monto', 'Andrea no reconoce el saldo. Baunti dejó de cobrar y espera a tu equipo.'],
      call: ['Llamada solicitada', 'Andrea prefiere hablar con una persona. Baunti no ofreció nada fuera de política.'],
      stop: ['Contacto detenido', 'Andrea pidió no recibir más mensajes. Baunti no volverá a escribirle por este canal.'],
      check: ['Comprobante recibido', 'Verifica la transferencia antes de marcar la cuenta como pagada.']
    }
  },
  en: {
    placeholder: 'Type as if you were Andrea…',
    send: 'Send', convo: 'Conversation with Cedro Insurance',
    biz: 'Cedro Insurance', today: 'Today',
    c_link: 'Send me the link', c_friday: "I'll pay on Friday", c_plan: 'Can I pay in installments?', c_dispute: "I don't recognize this amount",
    c_yes: 'Yes, that works', c_six: 'What about 6?', c_ok3: 'OK, 3 is fine', c_call: "I'd rather get a call",
    c_skip: 'Skip to payment day', c_receipt: 'Send photo of receipt', c_again: 'Try another reply',
    hintPay: 'Tap the payment button in the message.',
    pay: a => `Pay ${a}`, payTo: 'Secure payment to Cedro Insurance',
    b_open: (a, d) => `Hi Andrea, this is Baunti, the collections assistant for Cedro Insurance. Your car policy premium of ${a} was due yesterday, ${d}. You can pay it here:`,
    b_link: a => `Sure! Your balance is ${a}. I'll confirm as soon as it clears.`,
    b_promise: d => `Perfect, Andrea! We're set for ${d}. I'll send your link that day to make it easy.`,
    b_promiseTooFar: d => `I understand. The latest we can wait is ${d}. Does any day before then work? We can also split it into installments.`,
    b_pastDate: 'Which upcoming day works for you?',
    b_reminder: a => `Hi Andrea, today is the day we agreed on for your payment of ${a}. Here's your link. Thanks for keeping your word!`,
    b_plan: parts => `Sure. I can offer you ${parts.length} installments: ${parts.join(', ').replace(/, ([^,]*)$/, ' and $1')}. How does that sound?`,
    b_planLimit: n => `I can offer up to ${n} installments, which is what Cedro Insurance allows. Does that work for you? If you need another option, I'll pass your case to their team.`,
    b_planDone: a => `Done, Andrea! Your plan is set. You can pay the first installment of ${a} here:`,
    b_hardship: 'I hear you, Andrea, it happens to all of us. Let’s find something that works for you.',
    b_dispute: "Understood, thanks for telling us. I'm passing your case to Cedro Insurance so they can review it and contact you. I won't message you about this in the meantime.",
    b_call: "Of course. I'll ask someone from the Cedro Insurance team to call you today during business hours.",
    b_stop: "Understood, we won't message you here anymore. If you'd like to sort it out, you can contact Cedro Insurance directly.",
    b_wrong: "Sorry for the trouble. We won't message this number again. Have a good day!",
    b_paidClaim: 'Thanks for letting us know! Could you send me a photo of the receipt so I can confirm it with Cedro Insurance?',
    b_receiptOk: "Got it, thanks! We're checking it with Cedro Insurance and will confirm.",
    b_unknown: "Sorry, I didn't quite get that. Would you like to pay today, give us a date or split it into installments?",
    b_paidFull: a => `We received your payment of ${a}, Andrea! Your policy is up to date. Thank you.`,
    b_paidInst: (a, d) => `We received your first installment of ${a}! The next one is on ${d}; I'll remind you before then.`,
    receiptTitle: 'Transfer receipt', receiptBody: a => `${a} · Banco Industrial`,
    sheetPolicy: 'Policy', sheetCard: 'Card', sheetCardVal: 'Visa •••• 4242 (simulated)', sheetConcept: 'For',
    sheetConceptFull: 'Car policy premium', sheetConceptInst: n => `Installment 1 of ${n}`,
    sheetPay: a => `Pay ${a}`, sheetDone: 'Payment approved', sheetNote: 'The payment goes straight to Cedro Insurance. Baunti never receives the money.',
    status: { overdue: '1 day overdue', promise: 'Promise to pay', plan: 'Payment plan', paid: 'Paid', team: 'With your team', stop: 'Do not contact', check: 'To verify' },
    policy: 'Car policy ' + POLICY_NO,
    pol: { tone: 'Friendly tone', plan: 'Up to 3 installments', promise: 'Promises up to 15 days' },
    next: {
      waiting: 'Waiting for Andrea to reply',
      promise: d => `Reminder with link on ${d}`,
      plan: 'Collect installment 1 today',
      paid: 'Nothing. The account is up to date',
      inst: d => `Installment 2 on ${d}`,
      team: 'Your team reviews the dispute',
      call: 'Your team calls Andrea today',
      stop: 'No more messages on this channel',
      check: 'Confirm the receipt with treasury'
    },
    log: {
      open: 'First notice sent, within allowed hours',
      link: 'Andrea asked for the payment link',
      promise: d => `Promise logged for ${d}, within policy`,
      tooFar: 'Date outside policy: Baunti offered the limit',
      reminder: 'Payment-day reminder sent',
      plan: n => `${n}-installment plan offered, within policy`,
      planLimit: 'Asked for more installments: Baunti offered the maximum allowed',
      planOk: 'Plan accepted',
      paid: a => `Payment of ${a} confirmed, straight to Cedro's account`,
      dispute: 'Amount disputed: collections paused',
      call: 'Asked for a call: case sent to your team',
      stop: 'Asked not to be messaged: contact stopped',
      wrong: 'Wrong number: contact stopped',
      receipt: 'Sent a receipt: waiting to be verified'
    },
    alert: {
      dispute: ['Amount disputed', "Andrea doesn't recognize the balance. Baunti stopped collecting and is waiting for your team."],
      call: ['Call requested', 'Andrea would rather talk to a person. Baunti offered nothing outside policy.'],
      stop: ['Contact stopped', 'Andrea asked not to be messaged. Baunti won’t write to her on this channel again.'],
      check: ['Receipt received', 'Verify the transfer before marking the account as paid.']
    }
  }
};
const t = (k, ...a) => { const v = k.split('.').reduce((o, p) => o[p], C[L()]); return typeof v === 'function' ? v(...a) : v; };

/* ---------- intent: what did Andrea mean? ---------- */
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '');
const WD = {
  es: ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
  en: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
};
function dateIn(s) {
  if (/\bpasado manana\b|\bday after tomorrow\b/.test(s)) return addDays(today, 2);
  if (/\bmanana\b|\btomorrow\b/.test(s)) return addDays(today, 1);
  if (/\bhoy\b|\btoday\b|\bnow\b|\bahorita\b/.test(s)) return today;
  if (/\bfin de mes\b|\bend of (the )?month\b/.test(s)) return new Date(today.getFullYear(), today.getMonth() + 1, 0);
  if (/\bquincena\b|\bpayday\b/.test(s)) { const d = today.getDate() < 15 ? new Date(today.getFullYear(), today.getMonth(), 15) : new Date(today.getFullYear(), today.getMonth() + 1, 0); return d; }
  for (let i = 0; i < 7; i++) if (new RegExp('\\b(' + WD.es[i] + '|' + WD.en[i] + ')\\b').test(s)) return nextWeekday(i);
  const m = s.match(/\b(?:el|the|on the|dia)?\s*(\d{1,2})(?:st|nd|rd|th)?\b/);
  if (m) {
    const n = +m[1]; if (n < 1 || n > 31) return null;
    let d = new Date(today.getFullYear(), today.getMonth(), n);
    if (d < today) d = new Date(today.getFullYear(), today.getMonth() + 1, n);
    return d;
  }
  const w = s.match(/\ben (\d+|una|dos|tres) semanas?\b|\bin (\d+|a|one|two|three) weeks?\b/);
  if (w) { const k = { una: 1, a: 1, one: 1, dos: 2, two: 2, tres: 3, three: 3 }; const v = w[1] || w[2]; return addDays(today, 7 * (k[v] || +v)); }
  return null;
}
function intent(raw) {
  const s = norm(raw).trim();
  if (/no me (escriban|escribas|molesten|vuelvan)|dejen de escribir|\bstop\b|\bbasta\b|leave me alone|dont (text|message|contact) me|unsubscribe/.test(s)) return { k: 'stop' };
  if (/numero equivocado|no soy (yo|esa persona|andrea)|wrong (number|person)|im not andrea|who is this/.test(s)) return { k: 'wrong' };
  if (/\bya (le |lo )?(pague|cancele|deposite|transferi|abone)|already paid|i paid|ive paid|its paid/.test(s)) return { k: 'paid' };
  if (/no (le )?debo|no reconozco|no es mio|monto (esta )?(mal|equivocado)|reclamo|dont owe|dont recogni[sz]e|wrong amount|not mine|dispute/.test(s)) return { k: 'dispute' };
  if (/llam(en|ar|ada|eme)|hablar con (alguien|una persona)|\bcall me\b|a call|talk to (someone|a person)/.test(s)) return { k: 'call' };
  if (/no tengo (dinero|pisto|plata|lana)|no puedo pagar|ando (corto|sin)|sin (trabajo|chamba)|cant (pay|afford)|no money|lost my job|im broke/.test(s)) return { k: 'hardship' };
  const n = s.match(/\b(\d|dos|tres|cuatro|cinco|seis|two|three|four|five|six)\s*(cuotas|pagos|partes|abonos|installments|payments|parts)\b/);
  if (n || /cuotas|en partes|por partes|abonos|installments?|payment plan|split/.test(s)) {
    const map = { dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, two: 2, three: 3, four: 4, five: 5, six: 6 };
    return { k: 'plan', n: n ? (map[n[1]] || +n[1]) : null };
  }
  if (/\blink\b|\benlace\b|como (le )?pago|donde pago|quiero pagar|how (can|do) i pay|send (me )?(the )?link|i want to pay|pay (now|today)/.test(s)) return { k: 'link' };
  const d = dateIn(s);
  if (d) return { k: 'date', d };
  if (/^(si|dale|va|ok|okay|esta bien|de acuerdo|perfecto|listo|me parece|yes|sure|sounds good|fine)\b/.test(s)) return { k: 'yes' };
  return { k: 'unknown' };
}

/* ---------- DOM ---------- */
const chat = $('#chat'), choicesEl = $('#choices'), form = $('#form'), input = $('#msg'), sendBtn = $('#send');
const sheet = $('#sheet'), skip = $('#skip'), island = document.querySelector('.ph-island');
const tStatus = $('#t-status'), tRec = $('#t-recovered'), tNext = $('#t-next'), tLog = $('#t-log'), tAlert = $('#t-alert'), tPolicy = $('#t-policy'), tBal = $('#t-balance');

let S; // state
let run = 0; // invalidates pending timers on reset
const wait = ms => new Promise((res, rej) => { const r = run; setTimeout(() => (r === run ? res() : rej('reset')), reduced ? Math.min(ms, 250) : ms); });

function fresh() {
  return { clock: 10 * 60, day: today, recovered: 0, status: 'overdue', next: 'waiting', stage: 'start', busy: false, alert: null, used: new Set(), log: [], plan: null, promise: null, amountDue: BALANCE, payMode: 'full', closed: false };
}

/* sim clock */
const clockStr = () => `${String(Math.floor(S.clock / 60)).padStart(2, '0')}:${String(S.clock % 60).padStart(2, '0')}`;
function tick(min = 1) { S.clock += min; $('#sb-time').textContent = clockStr(); }

/* ---------- team panel ---------- */
function paintTeam() {
  tStatus.dataset.status = S.status;
  tStatus.textContent = t('status.' + S.status);
  tPolicy.textContent = '· ' + t('policy');
  tBal.textContent = money(Math.max(0, BALANCE - S.recovered));
  tRec.textContent = money(S.recovered);
  const n = S.next;
  tNext.textContent = typeof n === 'string' ? t('next.' + n) : t('next.' + n[0], fmtDate(n[1]));
  document.querySelectorAll('#t-policies li').forEach(li => {
    const k = li.dataset.policy;
    li.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>${t('pol.' + k)}`;
    li.classList.toggle('used', S.used.has(k));
  });
  if (S.alert) {
    const [h, b] = t('alert.' + S.alert);
    tAlert.innerHTML = `<strong>${h}</strong>${b}`;
    tAlert.hidden = false;
  } else tAlert.hidden = true;
  tLog.innerHTML = S.log.slice(-4).map(e => `<li style="animation:none"><time>${e.time}</time><span>${typeof e.text === 'function' ? e.text() : e.text}</span></li>`).join('');
}
function setStatus(st) {
  if (S.status === st) return;
  S.status = st; paintTeam();
  tStatus.classList.remove('pop'); void tStatus.offsetWidth; tStatus.classList.add('pop');
}
function usePolicy(k) {
  S.used.add(k); paintTeam();
  const li = document.querySelector(`#t-policies li[data-policy="${k}"]`);
  li.classList.remove('flash'); void li.offsetWidth; li.classList.add('flash');
}
function log(key, ...args) {
  const entry = { time: `${fmtShort(S.day)} ${clockStr()}`, text: () => t('log.' + key, ...args.map(a => a instanceof Date ? fmtDate(a, false) : a)) };
  S.log.push(entry);
  paintTeam();
  const last = tLog.lastElementChild;
  if (last) last.style.animation = '';
}

/* ---------- chat ---------- */
const scrollDown = () => chat.scrollTo({ top: chat.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
const checks = '<svg width="16" height="10" viewBox="0 0 16 10" aria-hidden="true"><path d="m1 5.5 3 3L10.5 2M6.5 8.5l.5.5L14.5 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function addDay(label) {
  const el = document.createElement('div'); el.className = 'day'; el.textContent = label; chat.appendChild(el); scrollDown();
}
function addEvent(text) {
  const el = document.createElement('div'); el.className = 'event'; el.textContent = text; chat.appendChild(el); scrollDown();
}
function addMe(html) {
  const el = document.createElement('div');
  el.className = 'msg me';
  el.innerHTML = `<p>${html}</p><span class="meta">${clockStr()} ${checks}</span>`;
  chat.appendChild(el); scrollDown(); nudge(.5);
}
async function bot(text, pay) {
  const typing = document.createElement('div');
  typing.className = 'typing'; typing.setAttribute('aria-hidden', 'true');
  typing.innerHTML = '<i></i><i></i><i></i>';
  chat.appendChild(typing); scrollDown();
  island.classList.add('busy');
  await wait(Math.min(1700, 650 + text.length * 9));
  typing.remove(); island.classList.remove('busy');
  tick(1);
  const el = document.createElement('div');
  el.className = 'msg bot';
  el.innerHTML = `<p>${text}</p>`;
  if (pay) {
    const b = document.createElement('button');
    chat.querySelectorAll('.pay').forEach(o => { o.disabled = true; o.classList.remove('nudge'); });
    b.type = 'button'; b.className = 'pay nudge';
    b.dataset.mode = S.payMode;
    b.innerHTML = `<span>${t('pay', money(pay))}</span><small>pagos.cedro.gt</small>`;
    b.addEventListener('click', () => openSheet(pay, b));
    el.appendChild(b);
  }
  const meta = document.createElement('span'); meta.className = 'meta'; meta.textContent = clockStr();
  el.appendChild(meta);
  chat.appendChild(el); scrollDown(); nudge(-.6);
  return el;
}

function setChoices(list, hint) {
  choicesEl.innerHTML = '';
  if (hint) { const h = document.createElement('p'); h.className = 'hint'; h.textContent = hint; choicesEl.appendChild(h); }
  list.forEach(([label, fn, primary]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'choice' + (primary ? ' primary' : '');
    b.textContent = label;
    b.addEventListener('click', () => { if (!S.busy) step(() => fn(label)); });
    choicesEl.appendChild(b);
  });
}
function lock(on) {
  S.busy = on;
  input.disabled = on || S.closed; sendBtn.disabled = on || S.closed;
  choicesEl.querySelectorAll('button').forEach(b => (b.disabled = on));
}
async function step(fn) {
  lock(true);
  try { await fn(); } catch (e) { if (e !== 'reset') console.error(e); return; }
  lock(false);
}

/* ---------- flows ---------- */
const openingChoices = () => setChoices([
  [t('c_link'), l => onIntent({ k: 'link' }, l)],
  [t('c_friday'), l => onIntent({ k: 'date', d: nextWeekday(5) }, l)],
  [t('c_plan'), l => onIntent({ k: 'plan', n: null }, l)],
  [t('c_dispute'), l => onIntent({ k: 'dispute' }, l)]
]);
const endChoices = () => setChoices([[t('c_again'), () => reset(), true]]);
const payHint = () => setChoices([], t('hintPay'));

async function onIntent(it, said) {
  addMe(escapeHtml(said));
  await wait(350);
  switch (it.k) {
    case 'link':
      log('link');
      S.payMode = 'full'; S.amountDue = BALANCE;
      await bot(t('b_link', money(BALANCE)), BALANCE);
      payHint(); break;

    case 'date': {
      const d = it.d, days = Math.round((d - today) / 864e5);
      if (days <= 0) {
        if (days === 0) { S.payMode = 'full'; await bot(t('b_link', money(BALANCE)), BALANCE); payHint(); break; }
        await bot(t('b_pastDate')); openingChoices(); break;
      }
      if (days > MAX_PROMISE_DAYS) {
        const lim = addDays(today, MAX_PROMISE_DAYS);
        usePolicy('promise'); log('tooFar');
        await bot(t('b_promiseTooFar', fmtDate(lim)));
        setChoices([
          [t('c_friday'), l => onIntent({ k: 'date', d: nextWeekday(5) }, l)],
          [t('c_plan'), l => onIntent({ k: 'plan', n: null }, l)]
        ]); break;
      }
      S.promise = d; usePolicy('promise'); log('promise', d);
      setStatus('promise'); S.next = ['promise', d]; paintTeam();
      await bot(t('b_promise', fmtDate(d)));
      setChoices([[t('c_skip'), () => skipTo(d), true]]); break;
    }

    case 'plan':
    case 'hardship': {
      if (it.k === 'hardship') await bot(t('b_hardship'));
      if (it.n && it.n > MAX_INSTALLMENTS) { await planLimit(); break; }
      await offerPlan(Math.max(2, Math.min(it.n || MAX_INSTALLMENTS, MAX_INSTALLMENTS))); break;
    }

    case 'yes':
      if (S.stage === 'planOffered') { await acceptPlan(); break; }
      await bot(t('b_unknown')); openingChoices(); break;

    case 'dispute':
      log('dispute'); S.alert = 'dispute'; setStatus('team'); S.next = 'team'; paintTeam(); usePolicy('tone');
      await bot(t('b_dispute')); close(); break;

    case 'call':
      log('call'); S.alert = 'call'; setStatus('team'); S.next = 'call'; paintTeam();
      await bot(t('b_call')); close(); break;

    case 'stop':
      log('stop'); S.alert = 'stop'; setStatus('stop'); S.next = 'stop'; paintTeam();
      await bot(t('b_stop')); close(); break;

    case 'wrong':
      log('wrong'); S.alert = 'stop'; setStatus('stop'); S.next = 'stop'; paintTeam();
      await bot(t('b_wrong')); close(); break;

    case 'paid':
      await bot(t('b_paidClaim'));
      setChoices([[t('c_receipt'), () => sendReceipt(), true]]); break;

    default:
      await bot(t('b_unknown'));
      S.stage === 'planOffered' ? planChoices() : openingChoices();
  }
}

function planChoices() {
  setChoices([
    [t('c_yes'), l => onIntent({ k: 'yes' }, l), true],
    [t('c_six'), l => onIntent({ k: 'plan', n: 6 }, l)]
  ]);
}
async function offerPlan(n) {
  const parts = split(BALANCE, n);
  const dates = parts.map((_, i) => addDays(today, i * 14));
  S.plan = { n, parts, dates }; S.stage = 'planOffered';
  usePolicy('plan'); log('plan', n);
  const desc = parts.map((p, i) => (i === 0 ? `${money(p)} ${L() === 'en' ? 'today' : 'hoy'}` : `${money(p)} ${L() === 'en' ? 'on' : 'el'} ${fmtDate(dates[i], false)}`));
  await bot(t('b_plan', desc));
  planChoices();
}
async function planLimit() {
  S.stage = 'planOffered';
  if (!S.plan) { const parts = split(BALANCE, MAX_INSTALLMENTS); S.plan = { n: MAX_INSTALLMENTS, parts, dates: parts.map((_, i) => addDays(today, i * 14)) }; }
  usePolicy('plan'); log('planLimit');
  await bot(t('b_planLimit', MAX_INSTALLMENTS));
  setChoices([
    [t('c_ok3'), l => onIntent({ k: 'yes' }, l), true],
    [t('c_call'), l => onIntent({ k: 'call' }, l)]
  ]);
}
async function acceptPlan() {
  S.stage = 'planAccepted'; log('planOk');
  setStatus('plan'); S.next = 'plan'; paintTeam();
  S.payMode = 'inst'; S.amountDue = S.plan.parts[0];
  await bot(t('b_planDone', money(S.plan.parts[0])), S.plan.parts[0]);
  payHint();
}

async function skipTo(d) {
  lock(true);
  skip.hidden = false;
  const steps = Math.max(1, Math.round((d - S.day) / 864e5));
  skip.innerHTML = `<div class="skip-card"><span class="skip-week"></span><span class="skip-day"></span><span class="skip-month"></span><span class="skip-bar"><i></i></span></div>`;
  const wk = skip.querySelector('.skip-week'), dy = skip.querySelector('.skip-day'), mo = skip.querySelector('.skip-month'), bar = skip.querySelector('.skip-bar i');
  const show = x => {
    const loc = L() === 'en' ? 'en-US' : 'es-GT';
    wk.textContent = x.toLocaleDateString(loc, { weekday: 'long' });
    dy.textContent = x.getDate();
    mo.textContent = x.toLocaleDateString(loc, { month: 'long', year: 'numeric' });
    dy.classList.remove('flip'); void dy.offsetWidth; dy.classList.add('flip');
  };
  show(S.day);
  requestAnimationFrame(() => skip.classList.add('open'));
  const per = reduced ? 0 : Math.min(260, 1400 / steps);
  bar.style.transitionDuration = per * steps + 'ms';
  requestAnimationFrame(() => (bar.style.width = '100%'));
  await wait(300);
  for (let i = 1; i <= steps; i++) { show(addDays(S.day, i)); await wait(per); }
  await wait(450);
  S.day = d; S.clock = 9 * 60; tick(0);
  skip.classList.remove('open');
  await wait(300);
  skip.hidden = true;
  addDay(fmtDate(d));
  log('reminder');
  S.payMode = 'full'; S.amountDue = BALANCE;
  await bot(t('b_reminder', money(BALANCE)), BALANCE);
  payHint();
}

async function sendReceipt() {
  addMe(`<span class="receipt"><b>${t('receiptTitle')}</b>${t('receiptBody', money(BALANCE))}</span>`);
  await wait(400);
  log('receipt'); S.alert = 'check'; setStatus('check'); S.next = 'check'; paintTeam();
  await bot(t('b_receiptOk'));
  close();
}

function close() { chat.querySelectorAll('.pay').forEach(o => { o.disabled = true; o.classList.remove('nudge'); }); S.closed = true; input.disabled = true; sendBtn.disabled = true; endChoices(); }

/* ---------- payment ---------- */
function openSheet(amount, btn) {
  if (S.busy || S.closed || btn.disabled) return;
  lock(true);
  const inst = btn.dataset.mode === 'inst';
  sheet.hidden = false;
  sheet.innerHTML = `
    <div class="sheet-card" role="dialog" aria-modal="true" aria-label="${t('payTo')}">
      <div class="sheet-grab"></div>
      <h3>${t('payTo')}</h3>
      <p class="amt">${money(amount)}</p>
      <dl>
        <div><dt>${t('sheetConcept')}</dt><dd>${inst ? t('sheetConceptInst', S.plan.n) : t('sheetConceptFull')}</dd></div>
        <div><dt>${t('sheetPolicy')}</dt><dd>${POLICY_NO}</dd></div>
        <div><dt>${t('sheetCard')}</dt><dd>${t('sheetCardVal')}</dd></div>
      </dl>
      <button type="button" class="sheet-pay">${t('sheetPay', money(amount))}</button>
      <p class="sheet-note">${t('sheetNote')}</p>
    </div>`;
  requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('open')));
  const pay = sheet.querySelector('.sheet-pay');
  setTimeout(() => pay.focus({ preventScroll: true }), 350);
  pay.addEventListener('click', async () => {
    if (pay.classList.contains('busy') || pay.classList.contains('done')) return;
    try {
      pay.classList.add('busy');
      await wait(1100);
      pay.classList.remove('busy'); pay.classList.add('done');
      pay.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" style="display:inline;vertical-align:-4px;margin-right:6px" aria-hidden="true"><path class="check-draw" d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>${t('sheetDone')}`;
      await wait(700);
      sheet.classList.remove('open');
      await wait(420);
      sheet.hidden = true; sheet.innerHTML = '';
      btn.disabled = true; btn.classList.remove('nudge');
      tick(2);
      addEvent(`${money(amount)} · ${L() === 'en' ? 'paid to Cedro Insurance' : 'pagado a Aseguradora Cedro'}`);
      celebrate(btn, amount);
      await wait(700);
      if (inst) {
        S.next = ['inst', S.plan.dates[1]]; paintTeam();
        await bot(t('b_paidInst', money(amount), fmtDate(S.plan.dates[1])));
      } else {
        setStatus('paid'); S.next = 'paid'; paintTeam();
        await bot(t('b_paidFull', money(amount)));
      }
      close();
      lock(false);
    } catch (e) { if (e !== 'reset') console.error(e); }
  });
}

/* the motion moment: a payment travels from the phone to the team's ledger */
function celebrate(fromEl, amount) {
  log('paid', money(amount));
  const wave = $('#wave'); wave.classList.remove('go'); void wave.offsetWidth; wave.classList.add('go');
  pose.spin = 1;
  const target = tRec;
  const end = () => countTo(S.recovered + amount);
  if (reduced) { end(); return; }
  const a = fromEl.getBoundingClientRect(), b = target.getBoundingClientRect();
  if (!a.width || b.bottom < 0 || b.top > innerHeight) { end(); return; }
  const coin = document.createElement('div');
  coin.className = 'coin'; coin.textContent = 'Q'; coin.setAttribute('aria-hidden', 'true');
  document.body.appendChild(coin);
  const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, x1 = b.left + 24, y1 = b.top + b.height / 2;
  const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 140;
  const anim = coin.animate([
    { transform: `translate(${x0}px,${y0}px) scale(.4)`, opacity: 0 },
    { transform: `translate(${x0}px,${y0 - 30}px) scale(1.1)`, opacity: 1, offset: .15 },
    { transform: `translate(${mx}px,${my}px) scale(1) rotate(180deg)`, offset: .55 },
    { transform: `translate(${x1}px,${y1}px) scale(.5) rotate(360deg)`, opacity: .9 }
  ], { duration: 1100, easing: 'cubic-bezier(.45,0,.2,1)' });
  anim.onfinish = () => { coin.remove(); end(); };
}
function countTo(v) {
  const from = S.recovered; S.recovered = v;
  const tEnd = performance.now() + (reduced ? 0 : 900);
  tRec.classList.add('hot');
  const f = now => {
    const p = reduced ? 1 : Math.min(1, 1 - (tEnd - now) / 900);
    const e = 1 - Math.pow(1 - p, 4);
    tRec.textContent = money(from + (v - from) * e);
    tBal.textContent = money(Math.max(0, BALANCE - (from + (v - from) * e)));
    if (p < 1) requestAnimationFrame(f); else setTimeout(() => tRec.classList.remove('hot'), 1200);
  };
  requestAnimationFrame(f);
}

/* ---------- free text ---------- */
form.addEventListener('submit', e => {
  e.preventDefault();
  const v = input.value.trim();
  if (!v || S.busy || S.closed) return;
  input.value = '';
  // a pending payment link stays valid: any reply is understood in context
  step(() => onIntent(intent(v), v));
});
function escapeHtml(s) { return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

/* ---------- start / reset ---------- */
async function start() {
  S = fresh();
  chat.innerHTML = ''; choicesEl.innerHTML = '';
  sheet.hidden = true; sheet.className = 'sheet'; sheet.innerHTML = '';
  skip.hidden = true; skip.className = 'skip';
  tick(0); paintTeam();
  input.placeholder = t('placeholder');
  sendBtn.setAttribute('aria-label', t('send'));
  chat.setAttribute('aria-label', t('convo'));
  addDay(t('today'));
  await step(async () => {
    await wait(reduced ? 0 : 1300);
    usePolicy('tone');
    log('open');
    await bot(t('b_open', money(BALANCE), fmtDate(DUE)), BALANCE);
    openingChoices();
  });
}
function reset() { run++; S.busy = false; start(); }
$('#t-reset').addEventListener('click', reset);
window.addEventListener('baunti:lang', reset);

/* ---------- the phone in 3D ---------- */
const fit = document.querySelector('.phone-fit');
const shadow = $('#shadow'), scene = $('#scene');
const slices = document.querySelector('.ph-slices');
for (let i = 0; i < 11; i++) {
  const s = document.createElement('i');
  s.style.transform = `translateZ(${-5 + i}px)`;
  slices.appendChild(s);
}

const BASE = { rx: 6, ry: -16 };
const pose = { rx: -18, ry: -62, rz: 0, ty: 90, sc: .86, op: 0, spin: 0, engaged: 0, kick: 0 };
const target = { mx: 0, my: 0 };
let t0 = performance.now(), entered = false;

function nudge(k) { pose.kick += k; }

scene.addEventListener('pointermove', e => {
  if (e.pointerType !== 'mouse') return;
  const r = scene.getBoundingClientRect();
  target.mx = ((e.clientX - r.left) / r.width - .5) * 2;
  target.my = ((e.clientY - r.top) / r.height - .5) * 2;
});
scene.addEventListener('pointerleave', () => { target.mx = 0; target.my = 0; });
// the phone turns toward you while you use it
fit.addEventListener('pointerenter', () => (pose.engaged = 1));
fit.addEventListener('pointerleave', () => (pose.engaged = 0));
fit.addEventListener('focusin', () => (pose.engaged = 1));
fit.addEventListener('focusout', () => (pose.engaged = fit.matches(':hover') ? 1 : 0));

const lerp = (a, b, k) => a + (b - a) * k;
let eng = 0, spinT = 0, vis = true;
new IntersectionObserver(es => (vis = es[0].isIntersecting)).observe(scene);

function frame(now) {
  requestAnimationFrame(frame);
  if (!vis) return;
  const el = (now - t0) / 1000;
  if (reduced) {
    fit.style.cssText = '--rx:4deg;--ry:-8deg;--rz:0deg;--ty:0px;--sc:1;--op:1';
    return;
  }
  // entrance: a long, settling ease toward the resting pose
  const k = entered ? .08 : .045;
  eng = lerp(eng, pose.engaged, .06);
  if (pose.spin) { spinT = 1; pose.spin = 0; }
  spinT = Math.max(0, spinT - .012);
  const spinRy = Math.sin(spinT * Math.PI) * 18;  // turns to face you, then settles back
  const float = Math.sin(el * 1.1) * 6;
  const tx = BASE.rx * (1 - eng * .6) - target.my * 5 + Math.sin(el * .7) * 1.2;
  const ty = BASE.ry * (1 - eng * .75) + target.mx * 9 + spinRy + Math.sin(el * .5) * 1.5;
  pose.rx = lerp(pose.rx, tx, k);
  pose.ry = lerp(pose.ry, ty, k);
  pose.kick *= .9;
  pose.rz = lerp(pose.rz, pose.kick * 1.4, .2);
  pose.ty = lerp(pose.ty, float - spinT * 10, k);
  pose.sc = lerp(pose.sc, 1 + spinT * .03, k);
  pose.op = lerp(pose.op, 1, .06);
  if (!entered && Math.abs(pose.ry - ty) < 1) entered = true;
  fit.style.setProperty('--rx', pose.rx.toFixed(2) + 'deg');
  fit.style.setProperty('--ry', pose.ry.toFixed(2) + 'deg');
  fit.style.setProperty('--rz', pose.rz.toFixed(2) + 'deg');
  fit.style.setProperty('--ty', pose.ty.toFixed(1) + 'px');
  fit.style.setProperty('--sc', pose.sc.toFixed(3));
  fit.style.setProperty('--op', Math.min(1, pose.op).toFixed(3));
  // light follows the angle: glare slides across the glass, the shadow answers the lift
  fit.style.setProperty('--gl-x', (50 + pose.ry * 2.2).toFixed(1) + '%');
  fit.style.setProperty('--gl-a', (pose.rx * 1.5).toFixed(1) + 'deg');
  shadow.style.setProperty('--sx', (-pose.ry * 1.6).toFixed(1) + 'px');
  shadow.style.setProperty('--ss', (1 - Math.abs(pose.ry) / 160 - pose.ty / 300).toFixed(3));
  shadow.style.setProperty('--so', (Math.min(1, pose.op) * (0.85 - pose.ty / 120)).toFixed(3));
}
requestAnimationFrame(frame);

start();
