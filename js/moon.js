(() => {
  const moonToggle = document.getElementById('darkToggle');
  const footerMoon = document.getElementById('footerMoon');
  const moons = [moonToggle, footerMoon].filter(Boolean);
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const palettes = JSON.parse(document.getElementById('moon-palettes').textContent);
  const ids = ['waxing-gibbous', 'full', 'waning-gibbous', 'last-quarter',
    'waning-crescent', 'new', 'waxing-crescent', 'first-quarter'];
  const status = document.getElementById('moon-theme-status');
  let phaseIndex = Math.max(0, ids.indexOf(root.dataset.moonTheme));
  let holding = false;
  let holdTimer;
  let longPressed = false;
  let heldKey = null;

  function renderPhase() {
    const palette = palettes[ids[phaseIndex]];
    for (const moon of moons) moon.textContent = palette.emoji;
    document.title = document.title.replace(/(Lay)[🌑🌒🌓🌔🌕🌖🌗🌘](Say)/u, '$1' + palette.emoji + '$2');
    if (moonToggle) {
      const name = root.lang === 'zh-CN' ? palette.nameZh : palette.name;
      moonToggle.title = root.lang === 'zh-CN'
        ? '点击切换日夜 · 长按3秒选择「' + name + '」'
        : 'Click for day/night · Hold 3s for ' + name;
      moonToggle.setAttribute('aria-label', moonToggle.title);
    }
  }

  function cookie(key, value) {
    document.cookie = key + '=' + value + '; Max-Age=31536000; Path=/; SameSite=Lax';
  }

  function updatePressed() {
    if (moonToggle) moonToggle.setAttribute('aria-pressed', String(root.classList.contains('dark-mode')));
  }

  function applyPalette(id) {
    root.dataset.moonTheme = id;
    root.classList.remove('twilight-mode');
    root.classList.toggle('dark-mode', palettes[id].dark);
    cookie('moon-theme', id);
    cookie('twilight', 'disabled');
    cookie('dark', palettes[id].dark ? 'enabled' : 'disabled');
    updatePressed();
    if (status) status.textContent = root.lang === 'zh-CN'
      ? '已切换为' + palettes[id].nameZh + '配色'
      : palettes[id].name + ' theme selected';
  }

  function finishHold() {
    clearTimeout(holdTimer);
    holdTimer = undefined;
    holding = false;
    moonToggle?.classList.remove('holding', 'hold-complete');
  }

  function cancelHold() {
    finishHold();
    heldKey = null;
  }

  function beginHold() {
    if (holding) return;
    holding = true;
    longPressed = false;
    // Capture the phase at press-down and keep all moons still until release.
    const id = ids[phaseIndex];
    moonToggle.classList.add('holding');
    holdTimer = setTimeout(() => {
      holdTimer = undefined;
      longPressed = true;
      applyPalette(id);
      moonToggle.classList.add('hold-complete');
    }, 3000);
  }

  renderPhase();
  updatePressed();
  if (moons.length) {
    window.setInterval(() => {
      if (holding || document.hidden || reducedMotion.matches) return;
      phaseIndex = (phaseIndex + 1) % ids.length;
      renderPhase();
    }, 1500);
  }

  if (moonToggle) {
    moonToggle.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      moonToggle.setPointerCapture(event.pointerId);
      beginHold();
    });
    moonToggle.addEventListener('pointerup', finishHold);
    moonToggle.addEventListener('pointercancel', cancelHold);
    moonToggle.addEventListener('lostpointercapture', finishHold);
    moonToggle.addEventListener('contextmenu', event => event.preventDefault());
    moonToggle.addEventListener('keydown', event => {
      if (![' ', 'Enter'].includes(event.key)) return;
      event.preventDefault();
      if (!event.repeat) {
        heldKey = event.key;
        beginHold();
      }
    });
    moonToggle.addEventListener('keyup', event => {
      if (event.key !== heldKey) return;
      event.preventDefault();
      heldKey = null;
      finishHold();
      moonToggle.click();
    });
    moonToggle.addEventListener('blur', cancelHold);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelHold();
    });
    moonToggle.addEventListener('click', () => {
      if (longPressed) {
        longPressed = false;
        return;
      }
      delete root.dataset.moonTheme;
      root.classList.remove('twilight-mode');
      root.classList.toggle('dark-mode');
      cookie('moon-theme', '');
      cookie('twilight', 'disabled');
      cookie('dark', root.classList.contains('dark-mode') ? 'enabled' : 'disabled');
      updatePressed();
    });
  }

  if (footerMoon) {
    footerMoon.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    });
  }
})();
