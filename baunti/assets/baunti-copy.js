/* Baunti concise copy (v5)
   Shorter body copy for "/" in Spanish and English. The app bundle is not
   edited (it is shared with /demo); instead, exact original strings are
   swapped for their concise versions as React writes them, before the browser
   paints, so there is no flash and no layout shift. Headlines, prices and
   claims are unchanged. To revert a line, delete its pair. */
const COPY = new Map([
 [
  "Baunti opera la cobranza de aseguradoras, hospitales, agencias de autos y entidades financieras. Escribe a cada cliente a nombre de tu marca, acuerda fechas y planes dentro de tus políticas y confirma cada pago, que llega directo a tu cuenta.",
  "Cobranza para aseguradoras, hospitales, agencias de autos y financieras. A nombre de tu marca, dentro de tus políticas y con cada pago directo a tu cuenta."
 ],
 [
  "Tus clientes te pagan a ti. El dinero nunca pasa por Baunti.",
  "El dinero nunca pasa por Baunti."
 ],
 [
  "Un segmento de tu cartera, con resultados medidos antes de firmar.",
  "Resultados medidos antes de firmar."
 ],
 [
  "Cada sector tiene su propio calendario, su lenguaje y sus límites. Baunti se configura con los tuyos antes de enviar el primer mensaje.",
  "Baunti se configura con el calendario, el lenguaje y los límites de tu sector antes del primer mensaje."
 ],
 [
  "Primas vencidas antes de que la póliza entre en cancelación.",
  "Primas vencidas, antes de la cancelación."
 ],
 [
  "Avisos antes del vencimiento, enlace de pago en cada mensaje y seguimiento dentro del periodo de gracia que defines. Cada contacto queda en la bitácora de la póliza.",
  "Avisos previos, enlace de pago en cada mensaje y seguimiento dentro de tu periodo de gracia."
 ],
 [
  "Saldos del paciente después de lo que cubre su seguro: copagos, deducibles y planes de pago.",
  "Saldos del paciente tras el seguro: copagos, deducibles y planes."
 ],
 [
  "Mensajes discretos que nunca mencionan diagnósticos ni tratamientos, y que pasan a tu equipo cualquier reclamo de facturación.",
  "Mensajes discretos, sin diagnósticos ni tratamientos. Los reclamos pasan a tu equipo."
 ],
 [
  "Cuotas de financiamiento propio, enganches pendientes y órdenes de taller entregadas a crédito.",
  "Cuotas de financiamiento propio, enganches y órdenes de taller a crédito."
 ],
 [
  "Recordatorios a nombre de la agencia con el monto y la fecha exactos, y planes de pago dentro de los límites que aprueba tu gerencia.",
  "Recordatorios con monto y fecha exactos, y planes dentro de los límites de tu gerencia."
 ],
 [
  "Guiones aprobados por tu equipo de cumplimiento, horarios permitidos y un registro completo de cada mensaje, listo para auditoría.",
  "Guiones aprobados por cumplimiento, horarios permitidos y registro listo para auditoría."
 ],
 [
  "¿Tu empresa cobra a una cartera grande con contratos recurrentes y no está en la lista? Cuéntanos cómo cobras hoy.",
  "¿Otro sector con cartera grande y contratos recurrentes? Cuéntanos cómo cobras hoy."
 ],
 [
  "Tu equipo interviene solo cuando la decisión le corresponde: un reclamo, una excepción o una condición fuera de política.",
  "Tu equipo solo interviene en reclamos, excepciones o condiciones fuera de política."
 ],
 [
  "El archivo que ya exporta tu core, ERP o sistema hospitalario. CSV o Excel bastan para empezar.",
  "El archivo que ya exporta tu sistema. Basta un CSV o Excel."
 ],
 [
  "Tono, horarios, plazos máximos, cuotas permitidas y qué casos se escalan a tu equipo.",
  "Tono, horarios, plazos, cuotas y qué casos pasan a tu equipo."
 ],
 [
  "Cada mañana ordena a quién contactar según saldo, antigüedad e historial de pago.",
  "Cada mañana ordena a quién contactar por saldo, antigüedad e historial."
 ],
 [
  "Pagan, prometen una fecha o piden un plan. Baunti atiende cada respuesta dentro de tus límites.",
  "Pagan, prometen o piden un plan. Baunti responde dentro de tus límites."
 ],
 [
  "Nunca a la nuestra. Baunti lo confirma, actualiza la cuenta y deja todo en la bitácora.",
  "Nunca a la nuestra. Baunti lo confirma y lo registra."
 ],
 [
  "Baunti nunca ofrece una condición que no aprobaste. Si un cliente pide algo fuera de política, el caso pasa a tu equipo con la conversación completa.",
  "Baunti nunca ofrece una condición que no aprobaste. Lo que esté fuera de política pasa a tu equipo."
 ],
 [
  "Cada mensaje, respuesta, promesa y pago, con fecha y hora. Tu equipo de cumplimiento puede revisar cualquier cuenta cuando quiera.",
  "Cada mensaje, promesa y pago, con fecha y hora, a la vista de tu equipo de cumplimiento."
 ],
 [
  "Horarios razonables, sin amenazas, sin hablar de la deuda con terceros y sin volver a escribir a quien pidió que no lo hiciéramos.",
  "Horarios razonables, sin amenazas, sin terceros y sin insistir a quien pidió no recibir mensajes."
 ],
 [
  "Todo tu proceso de cobranza preventiva y de mora temprana, operado por nosotros: priorización diaria, mensajes, acuerdos de pago y confirmación de cada pago.",
  "Cobranza preventiva y de mora temprana, operada por nosotros: priorización, mensajes, acuerdos y confirmación de pagos."
 ],
 [
  "Avisos antes del vencimiento, seguimiento automático de cada promesa y cuotas que tus clientes sí pueden cumplir.",
  "Avisos previos, seguimiento de cada promesa y cuotas que tus clientes sí pueden cumplir."
 ],
 [
  "El mismo motor responde dudas sobre saldos y fechas, recibe comprobantes y pasa los reclamos a tu equipo con todo el contexto.",
  "Responde dudas de saldos y fechas, recibe comprobantes y pasa los reclamos a tu equipo."
 ],
 [
  "En la demo haces de asegurado con la prima vencida y le respondes a Baunti como lo harías de verdad. A un lado ves lo que ve tu equipo: el estado de la cuenta, los avisos y la bitácora.",
  "Haz de asegurado con la prima vencida y respóndele a Baunti. A un lado ves lo que ve tu equipo."
 ],
 [
  "Escribe los números de tu cartera. La calculadora solo multiplica lo que escribes: no usa tasas de recuperación ni proyecciones.",
  "Escribe los números de tu cartera. Solo multiplicamos lo que escribes, sin proyecciones."
 ],
 [
  "Cálculo basado solo en los valores de arriba. La recuperación real depende de cada cartera y se mide en el piloto.",
  "Solo usa los valores de arriba. La recuperación real se mide en el piloto."
 ],
 [
  "Baunti cobra un porcentaje de lo que realmente recupera, definido para cada empresa después del piloto. No hay implementación ni pagos por adelantado.",
  "Un porcentaje de lo que realmente recuperamos, definido tras el piloto. Sin implementación ni pagos por adelantado."
 ],
 [
  "Empezamos con un segmento acotado de tu cartera para medir resultados antes de cualquier contrato.",
  "Un segmento de tu cartera para medir resultados antes de cualquier contrato."
 ],
 [
  "Facturamos una vez al mes, solo sobre los pagos recuperados.",
  "Facturamos cada mes, solo sobre lo recuperado."
 ],
 [
  "El asistente conoce el servicio, el modelo de cobro y cómo empezar. Toca una pregunta o escribe la tuya.",
  "Conoce el servicio, el modelo de cobro y cómo empezar."
 ],
 [
  "Cuéntanos qué cobras y a cuántos clientes. Te respondemos por WhatsApp para definir el alcance del piloto.",
  "Cuéntanos qué cobras y a cuántos clientes. Te respondemos por WhatsApp."
 ],
 [
  "Esto abre WhatsApp con tu mensaje listo para enviar. Este sitio no guarda nada.",
  "Abre WhatsApp con tu mensaje listo. Este sitio no guarda nada."
 ],
 [
  "Baunti runs collections for insurers, hospitals, car dealerships and financial institutions. It writes to each customer in your brand’s name, agrees on dates and plans within your policies and confirms every payment, which goes straight to your account.",
  "Collections for insurers, hospitals, car dealerships and lenders. In your brand’s name, within your policies, with every payment going straight to your account."
 ],
 [
  "Customers pay you. The money never goes through Baunti.",
  "The money never goes through Baunti."
 ],
 [
  "One segment of your portfolio, with results measured before you sign.",
  "Results measured before you sign."
 ],
 [
  "Every industry has its own calendar, language and limits. Baunti is configured with yours before the first message goes out.",
  "Baunti is set up with your industry’s calendar, language and limits before the first message."
 ],
 [
  "Notices before the due date, a payment link in every message and follow-up within the grace period you set. Every contact is logged against the policy.",
  "Advance notices, a payment link in every message and follow-up within your grace period."
 ],
 [
  "Patient balances after insurance: co-pays, deductibles and payment plans.",
  "Patient balances after insurance: co-pays, deductibles and plans."
 ],
 [
  "Discreet messages that never mention diagnoses or treatments, and that route any billing dispute to your team.",
  "Discreet messages, never mentioning diagnoses or treatments. Disputes go to your team."
 ],
 [
  "In-house financing installments, pending down payments and service orders released on credit.",
  "In-house financing installments, down payments and service orders on credit."
 ],
 [
  "Reminders in the dealership’s name with the exact amount and date, and payment plans within the limits your management approves.",
  "Reminders with the exact amount and date, and plans within your management’s limits."
 ],
 [
  "Scripts approved by your compliance team, permitted hours and a full record of every message, ready for audit.",
  "Compliance-approved scripts, permitted hours and an audit-ready record."
 ],
 [
  "Collecting from a large portfolio with recurring contracts in another industry? Tell us how you collect today.",
  "Another industry with a large recurring portfolio? Tell us how you collect today."
 ],
 [
  "Your team steps in only when the decision is theirs: a dispute, an exception or a term outside policy.",
  "Your team steps in only for disputes, exceptions or off-policy terms."
 ],
 [
  "The file your core system, ERP or hospital system already exports. CSV or Excel is enough to start.",
  "The file your system already exports. A CSV or Excel file is enough."
 ],
 [
  "Tone, hours, maximum terms, allowed installments and which cases go to your team.",
  "Tone, hours, terms, installments and what goes to your team."
 ],
 [
  "Every morning it ranks who to contact by balance, age and payment history.",
  "Each morning it ranks who to contact by balance, age and history."
 ],
 [
  "They pay, promise a date or ask for a plan. Baunti handles each reply within your limits.",
  "They pay, promise or ask for a plan. Baunti replies within your limits."
 ],
 [
  "Never in ours. Baunti confirms it, updates the account and logs everything.",
  "Never in ours. Baunti confirms and logs it."
 ],
 [
  "Baunti never offers a term you didn’t approve. If a customer asks for something outside policy, the case goes to your team with the full conversation.",
  "Baunti never offers a term you didn’t approve. Anything off-policy goes to your team."
 ],
 [
  "Every message, reply, promise and payment, with date and time. Your compliance team can review any account at any time.",
  "Every message, promise and payment, time-stamped and open to your compliance team."
 ],
 [
  "Reasonable hours, no threats, no discussing the debt with third parties and no further messages to anyone who asked us to stop.",
  "Reasonable hours, no threats, no third parties, and no messages to anyone who opted out."
 ],
 [
  "Your full preventive and early-delinquency collections process, run by us: daily prioritization, messages, payment agreements and confirmation of every payment.",
  "Preventive and early-delinquency collections, run by us: prioritization, messages, agreements and payment confirmation."
 ],
 [
  "Notices before the due date, automatic follow-up on every promise and installments your customers can actually keep.",
  "Advance notices, follow-up on every promise and installments customers can actually keep."
 ],
 [
  "The same engine answers questions about balances and dates, receives proof of payment and routes disputes to your team with full context.",
  "Answers balance and date questions, takes proof of payment and routes disputes to your team."
 ],
 [
  "In the demo you play a policyholder with an overdue premium and reply to Baunti as you really would. Beside it you see what your team sees: the account status, the alerts and the log.",
  "Play a policyholder with an overdue premium and reply to Baunti. Alongside, see what your team sees."
 ],
 [
  "Enter your portfolio’s numbers. The calculator only multiplies what you type: no recovery rates, no projections.",
  "Enter your portfolio’s numbers. We only multiply what you type, with no projections."
 ],
 [
  "Based only on the values above. Actual recovery depends on each portfolio and is measured in the pilot.",
  "Uses only the values above. Actual recovery is measured in the pilot."
 ],
 [
  "Baunti charges a percentage of what it actually recovers, set for each company after the pilot. No implementation fee and nothing up front.",
  "A percentage of what we actually recover, set after the pilot. No implementation fee, nothing up front."
 ],
 [
  "We start with a defined segment of your portfolio to measure results before any contract.",
  "One segment of your portfolio, to measure results before any contract."
 ],
 [
  "Billed once a month, only on recovered payments.",
  "Billed monthly, only on what’s recovered."
 ],
 [
  "The assistant knows the service, the pricing model and how to start. Tap a question or type your own.",
  "It knows the service, the pricing and how to start."
 ],
 [
  "Tell us what you collect and from how many customers. We'll reply on WhatsApp to scope the pilot.",
  "Tell us what you collect and from how many customers. We’ll reply on WhatsApp."
 ],
 [
  "This opens WhatsApp with your message ready to send. Nothing is stored on this site.",
  "Opens WhatsApp with your message ready. Nothing is stored here."
 ]
]);

function swap(node) {
  const raw = node.nodeValue;
  if (!raw || raw.length < 20) return;
  const key = raw.trim();
  const next = COPY.get(key);
  if (next) node.nodeValue = raw.replace(key, next);
}
function scan(root) {
  if (root.nodeType === 3) return swap(root);
  if (root.nodeType !== 1) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) swap(n);
}
const target = document.getElementById("root");
if (target) {
  scan(target);
  new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === "characterData") swap(r.target);
      else r.addedNodes.forEach(scan);
    }
  }).observe(target, { childList: true, subtree: true, characterData: true });
}
