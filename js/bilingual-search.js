(() => {
  const form = document.getElementById('bilingual-search');
  if (!form) return;

  const input = form.elements.q;
  const results = document.getElementById('bilingual-search-results');
  const root = document.documentElement;
  let index;
  let pending;

  function loadIndex() {
    if (!pending) {
      pending = fetch(form.dataset.index).then(response => {
        if (!response.ok) throw new Error('Search index unavailable');
        return response.json();
      }).then(posts => { index = posts; }).finally(() => { pending = null; });
    }
    return pending;
  }

  async function render() {
    const query = input.value.trim().toLowerCase();
    results.replaceChildren();
    if (!query) return;
    const chinese = root.lang === 'zh-CN';
    const language = chinese ? 'zh' : 'en';
    try {
      if (!index) await loadIndex();
      if (query !== input.value.trim().toLowerCase() || chinese !== (root.lang === 'zh-CN')) return;
      const words = query.split(/\s+/);
      const matches = index.filter(({ en, zh }) => {
        const text = `${en.title} ${en.text} ${zh.title} ${zh.text}`.toLowerCase();
        return words.every(word => text.includes(word));
      }).slice(0, 10);
      if (!matches.length) {
        results.textContent = chinese ? '未找到文章。' : 'No matching posts.';
        return;
      }
      const list = document.createElement('ul');
      for (const item of matches) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = new URL(item.path, new URL('.', new URL(form.dataset.index, location.href)));
        link.textContent = item[language].title;
        li.append(link);
        list.append(li);
      }
      results.replaceChildren(list);
    } catch {
      if (query === input.value.trim().toLowerCase()) {
        results.textContent = root.lang === 'zh-CN' ? '暂时无法加载搜索。' : 'Search is temporarily unavailable.';
      }
    }
  }

  input.addEventListener('input', render);
  form.addEventListener('submit', event => {
    event.preventDefault();
    render();
  });
  new MutationObserver(render).observe(root, { attributeFilter: ['lang'] });
})();
