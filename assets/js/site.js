// Optional Labs homepage behaviour. Content is fully visible without this script.
(() => {
  const top = document.getElementById('top');
  const onScroll = () => top && top.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Receipt: check each app in turn, then stamp the total.
  const receipt = document.querySelector('[data-receipt]');
  if (receipt) {
    const rows = [...receipt.querySelectorAll('.row')];
    const replay = receipt.querySelector('[data-replay]');
    let timers = [];
    const run = () => {
      timers.forEach(clearTimeout);
      timers = [];
      if (reduce.matches) return;
      receipt.classList.add('is-checking');
      rows.forEach((row) => row.classList.remove('is-scan', 'is-done'));
      rows.forEach((row, i) => {
        timers.push(setTimeout(() => row.classList.add('is-scan'), 350 + i * 420));
        timers.push(setTimeout(() => row.classList.add('is-done'), 650 + i * 420));
      });
      timers.push(setTimeout(() => receipt.classList.remove('is-checking'), 750 + rows.length * 420));
    };
    if (replay) {
      replay.hidden = false;
      replay.addEventListener('click', run);
    }
    // Play once the total is on screen, so the stamp is seen (below the fold on phones).
    if ('IntersectionObserver' in window && !reduce.matches) {
      receipt.classList.add('is-checking'); // rows wait, unchecked, until the total is seen
      const seen = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { run(); seen.disconnect(); }
      }, { threshold: 1 });
      seen.observe(receipt.querySelector('.receipt-total') || receipt);
    } else {
      run();
    }
  }

  // Reveal app rows as they enter the viewport.
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
