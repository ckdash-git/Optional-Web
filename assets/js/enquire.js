// Enquiry form. Payload v1 matches the Optional Labs kit (CRM-Tool-Connectors, apps/crm-kit/src/kit/website.ts):
// { v, site, kind, name, phone, interest, message, at, page }.
// A CRM endpoint (data-crm) gets the payload; WhatsApp (data-wa) or, without it, an email draft carries the same words.
(() => {
  const form = document.getElementById('enquire-form');
  if (!form) return;
  const status = form.querySelector('[data-status]');
  const say = (text, kind) => { status.textContent = text; status.dataset.kind = kind; status.hidden = !text; };
  const val = (n) => form.elements[n].value.trim();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = val('phone').replace(/[^0-9+]/g, '');
    const problem = !val('name') ? ['name', 'Please add your name.']
      : phone.replace(/\D/g, '').length < 10 ? ['phone', 'Please add a phone number with at least 10 digits.']
      : !val('message') ? ['message', 'Please tell us a little about what you need.'] : null;
    if (problem) { say(problem[1], 'error'); form.elements[problem[0]].focus(); return; }

    const lead = { name: val('name'), phone, interest: val('interest'), message: val('message') };
    const text = `Enquiry from ${lead.name} (${lead.phone})\nInterested in: ${lead.interest}\n\n${lead.message}`;
    const { crm, wa, mailto } = form.dataset;
    if (crm) {
      const payload = { v: 1, site: 'optionallabs', kind: 'enquiry', ...lead, at: new Date().toISOString(), page: location.pathname };
      fetch(crm, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }).catch(() => {});
    }
    if (wa) window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    else window.location.href = `mailto:${mailto}?subject=${encodeURIComponent('Enquiry: ' + lead.interest)}&body=${encodeURIComponent(text)}`;
    say(wa ? 'WhatsApp should open with your message.' : `Your email app should open. If it does not, write to ${mailto}.`, 'success');
  });
})();
