(() => {
  const root = document.documentElement;
  const smaller = document.getElementById('text-smaller');
  const larger = document.getElementById('text-larger');
  const reset = document.getElementById('text-reset');
  if (!smaller || !larger || !reset) return;

  let size = Math.round((Number(root.style.getPropertyValue('--reading-scale')) || 1) * 100);

  function update(value, persist = false) {
    size = Math.max(80, Math.min(160, value));
    root.style.setProperty('--reading-scale', size / 100);
    reset.textContent = size + '%';
    smaller.disabled = size === 80;
    larger.disabled = size === 160;
    if (persist) {
      try { localStorage.setItem('laysay-text-size', String(size)); } catch {}
    }
  }

  smaller.addEventListener('click', () => update(size - 10, true));
  larger.addEventListener('click', () => update(size + 10, true));
  reset.addEventListener('click', () => update(100, true));
  update(size);
})();
