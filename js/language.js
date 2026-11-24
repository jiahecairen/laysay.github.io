(() => {
  const selector = document.getElementById('site-language');
  const root = document.documentElement;
  const title = document.querySelector('title[data-title-zh]');
  const englishTitle = document.title;
  const fields = document.querySelectorAll('[data-placeholder-zh]');
  const englishLabels = Array.from(fields, field =>
    field.tagName === 'OPTION' ? field.textContent : field.placeholder);
  const translations = document.querySelectorAll('.site-chinese-version');
  let preference = readStorage('localStorage', 'laysay-language');
  let detected = readStorage('sessionStorage', 'laysay-ip-language');

  function readStorage(storage, key) {
    try {
      const value = window[storage].getItem(key);
      return value === 'en' || value === 'zh-CN' ? value : null;
    } catch {
      return null;
    }
  }

  function storeLanguage(storage, key, language) {
    try {
      if (language) window[storage].setItem(key, language);
      else window[storage].removeItem(key);
    } catch {
      // Language switching still works for the current document.
    }
  }

  function show(language) {
    const chinese = language === 'zh-CN';
    const wasChinese = root.dataset.articleLanguage === 'zh-CN';
    root.lang = language;
    root.dataset.articleLanguage = language;
    if (title) document.title = chinese ? title.dataset.titleZh : englishTitle;
    fields.forEach((field, index) => {
      const label = chinese ? field.dataset.placeholderZh : englishLabels[index];
      if (field.tagName === 'OPTION') field.textContent = label;
      else field.placeholder = label;
    });
    if (chinese || wasChinese) {
      translations.forEach(translation => { translation.open = chinese; });
    }
  }

  async function autoDetect() {
    if (preference || detected ||
        ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return;
    try {
      const response = await fetch('/cdn-cgi/trace', {
        cache: 'no-store',
        signal: AbortSignal.timeout(2500)
      });
      if (!response.ok) return;
      const country = /^loc=([A-Z]{2})\r?$/m.exec(await response.text());
      if (!country || country[1] === 'XX') return;
      detected = country[1] === 'CN' ? 'zh-CN' : 'en';
      storeLanguage('sessionStorage', 'laysay-ip-language', detected);
      if (!preference) show(detected);
    } catch {
      // English is the fallback when the IP country is unavailable.
    }
  }

  show(preference || detected || 'en');
  if (selector) {
    selector.value = preference || 'auto';
    selector.addEventListener('change', () => {
      preference = selector.value === 'auto' ? null : selector.value;
      storeLanguage('localStorage', 'laysay-language', preference);
      show(preference || detected || 'en');
      autoDetect();
    });
  }
  autoDetect();
})();
