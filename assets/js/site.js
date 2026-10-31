// Optional Labs homepage behaviour. Content is fully visible without this script.
(() => {
  const top = document.getElementById('top');
  const onScroll = () => top && top.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Lottie: the player and each animation load only when one is near the screen, and never with reduced motion.
  // Without it the page is complete: the receipt ticks are drawn in CSS and the rest is decoration.
  const spots = [...document.querySelectorAll('[data-lottie]')];
  const scriptUrl = new URL(document.querySelector('script[src*="site.js"]').src, location.href);
  const dir = (f) => new URL(f, scriptUrl).href;
  const queue = [];
  let lottieReady = false;
  const whenLottie = (fn) => (lottieReady ? fn() : queue.push(fn));
  const anims = new WeakMap();
  const make = (el) => {
    if (anims.has(el)) return anims.get(el);
    const name = el.dataset.lottie;
    const a = window.lottie.loadAnimation({ container: el, renderer: 'svg', loop: name === 'ripple', autoplay: false, path: dir(`../lottie/${name}.json`) });
    a.addEventListener('DOMLoaded', () => { el.classList.add('has-lottie'); a.goToAndStop(0, true); });
    anims.set(el, a);
    return a;
  };
  if (spots.length && !reduce.matches && 'IntersectionObserver' in window) {
    const load = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      load.disconnect();
      const tag = document.createElement('script');
      tag.src = dir('lottie_light.min.js');
      tag.onload = () => { lottieReady = true; spots.forEach(make); queue.splice(0).forEach((fn) => fn()); };
      document.head.append(tag);
    }, { rootMargin: '400px 0px' });
    spots.forEach((el) => load.observe(el));
    // Ripple loops only while visible; the shield draws once when seen.
    const watch = new IntersectionObserver((entries) => entries.forEach((e) => {
      const name = e.target.dataset.lottie;
      if (name === 'check') return;
      whenLottie(() => {
        const a = make(e.target);
        if (name === 'ripple') (e.isIntersecting ? a.play() : a.pause());
        else if (e.isIntersecting) { a.goToAndPlay(0, true); watch.unobserve(e.target); }
      });
    }), { threshold: 0.5 });
    spots.forEach((el) => watch.observe(el));
  }
  const tick = (row, restart) => {
    const el = row.querySelector('[data-lottie="check"]');
    if (!el) return;
    whenLottie(() => { const a = make(el); restart ? a.goToAndPlay(0, true) : a.goToAndStop(0, true); });
  };

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
      rows.forEach((row) => tick(row, false));
      rows.forEach((row, i) => {
        timers.push(setTimeout(() => row.classList.add('is-scan'), 350 + i * 420));
        timers.push(setTimeout(() => { row.classList.add('is-done'); tick(row, true); }, 650 + i * 420));
      });
      timers.push(setTimeout(() => receipt.classList.remove('is-checking'), 750 + rows.length * 420));
    };
    if (replay) {
      replay.hidden = false;
      replay.addEventListener('click', run);
    }
    // Play once most of the receipt is on screen, so the proof is never hidden at first view.
    if ('IntersectionObserver' in window && !reduce.matches) {
      receipt.classList.add('is-checking'); // rows wait, unchecked, until the total is seen
      const seen = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { run(); seen.disconnect(); }
      }, { threshold: 0.35 });
      seen.observe(receipt);
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

  // Screen galleries: previous/next buttons scroll one screen at a time.
  document.querySelectorAll('[data-gallery]').forEach((g) => {
    const list = g.querySelector('.shots');
    const nav = g.querySelector('[data-gallery-nav]');
    if (!list || !nav) return;
    const [prev, next] = nav.querySelectorAll('button');
    const step = () => (list.querySelector('.shot')?.getBoundingClientRect().width || 240) + parseFloat(getComputedStyle(list).columnGap || 24);
    const update = () => {
      prev.disabled = list.scrollLeft < 4;
      next.disabled = list.scrollLeft + list.clientWidth > list.scrollWidth - 4;
      nav.hidden = list.scrollWidth <= list.clientWidth + 4;
    };
    nav.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
      list.scrollBy({ left: Number(b.dataset.dir) * step(), behavior: reduce.matches ? 'auto' : 'smooth' });
    }));
    list.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // Mobile menu: close on a link tap, Escape or a tap outside.
  const menu = document.querySelector('.menu');
  if (menu) {
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { menu.open = false; }));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
    });
    document.addEventListener('click', (e) => { if (menu.open && !menu.contains(e.target)) menu.open = false; });
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
