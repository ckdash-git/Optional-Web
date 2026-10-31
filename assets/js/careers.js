// Careers form: builds an email draft to career@optionallabs.com. Nothing is sent from the page.
(() => {
  const form = document.getElementById('apply-form');
  if (!form) return;
  const status = form.querySelector('[data-status]');
  const say = (text, kind) => { status.textContent = text; status.dataset.kind = kind; status.hidden = !text; };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const field = (n) => form.elements[n].value.trim();
    const missing = ['name', 'message'].filter((n) => !field(n));
    if (missing.length) {
      say('Please add your name and a few lines about you.', 'error');
      form.elements[missing[0]].focus();
      return;
    }
    const lines = [`Name: ${field('name')}`, `Area: ${field('area')}`, field('link') && `Work: ${field('link')}`, '', field('message')];
    const to = form.dataset.mailto;
    const url = `mailto:${to}?subject=${encodeURIComponent('Application: ' + field('area'))}&body=${encodeURIComponent(lines.filter((l) => l !== false && l !== '').join('\n'))}`;
    say(`Your email app should open. If it does not, write to ${to}.`, 'success');
    window.location.href = url;
  });
})();
