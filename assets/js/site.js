// Optional Labs homepage behaviour. Content is fully visible without this script.
(() => {
  const top = document.getElementById('top');
  const onScroll = () => top && top.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
