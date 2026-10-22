(() => {
  'use strict';
  const OWNER = 'lighthouse333';
  const CACHE_KEY = 'lighthouse333-public-repos-v1';
  const CACHE_AGE = 10 * 60 * 1000;
  const colors = { JavaScript: '#b49a25', Kotlin: '#9268bb', Python: '#4a7e9e', MATLAB: '#b9773d', 'C#': '#62834f', HTML: '#c7734c', CSS: '#7974ad' };
  const iconPaths = {
    lab: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M8 15h8M10 18h.01"/>',
    calendar: '<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M4 10h16M8 3v4M16 3v4m-8 8 3 3 5-5"/>',
    clock: '<circle cx="12" cy="13" r="8"/><path d="M9 2h6M12 5V2M12 9v5l3 2"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',
    sparkle: '<path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3ZM20 2v4M18 4h4"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4M10 10h4v4h-4z"/>',
    route: '<circle cx="5" cy="18" r="2"/><circle cx="19" cy="5" r="2"/><path d="M5 16V8a3 3 0 0 1 6 0v8a4 4 0 0 0 8 0V7"/>',
    pet: '<path d="M7 13c-2 2-3 4-2 6 1 2 4 1 7 1s6 1 7-1c1-2 0-4-2-6-3-3-7-3-10 0Z"/><ellipse cx="4" cy="9" rx="2" ry="3"/><ellipse cx="9" cy="5" rx="2" ry="3"/><ellipse cx="15" cy="5" rx="2" ry="3"/><ellipse cx="20" cy="9" rx="2" ry="3"/>',
    code: '<path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 3l-4 18"/>'
  };
  const details = window.PORTFOLIO_DETAILS || {};
  const snapshot = window.PORTFOLIO_SNAPSHOT || { fetchedAt: '', repositories: [] };
  const state = { repositories: snapshot.repositories.slice(), language: 'all', search: '', sort: 'updated' };
  const grid = document.getElementById('project-grid');
  const filterList = document.getElementById('language-filters');
  const search = document.getElementById('project-search');
  const resultCount = document.getElementById('result-count');
  const syncNote = document.getElementById('sync-note');
  const html = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const svg = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.code}</svg>`;
  function safeHomepage(value) {
    if (!value) return null;
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
  }
  function dateLabel(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Shanghai' }).format(date).replaceAll('/', '.');
  }
  function languages() { return [...new Set(state.repositories.map((repo) => repo.language).filter(Boolean))].sort(); }
  function renderFilters() {
    const options = [{ value: 'all', label: '全部项目' }, ...languages().map((value) => ({ value, label: value }))];
    if (!options.some((option) => option.value === state.language)) state.language = 'all';
    filterList.innerHTML = options.map(({ value, label }) => `<button class="filter${value === state.language ? ' active' : ''}" type="button" data-language="${html(value)}" aria-pressed="${value === state.language}">${html(label)}</button>`).join('');
  }
  function card(repo) {
    const detail = details[repo.name] || {};
    const description = detail.description || repo.description || '这个项目暂未填写简介，可以打开仓库查看源码与文件。';
    const kind = repo.archived ? '已归档' : repo.fork ? 'Fork 项目' : detail.category || '开源项目';
    const tags = (detail.tags || repo.topics || []).slice(0, 2);
    const date = repo.pushed_at || repo.updated_at;
    const homepage = safeHomepage(repo.homepage);
    const repoUrl = `https://github.com/${OWNER}/${encodeURIComponent(repo.name)}`;
    return `<article class="project-card" data-repo="${html(repo.name)}" style="--tile-bg:${html(detail.color || '#e8ede4')};--tile-ink:${html(detail.ink || '#4d6c50')}">
      <div class="card-top"><span class="project-icon">${svg(detail.icon || 'code')}</span><span class="project-kind">${html(kind)}</span></div>
      <h3><a class="project-title" href="${repoUrl}" target="_blank" rel="noopener noreferrer"><span>${html(repo.name)}</span><span class="external-arrow" aria-hidden="true">↗</span></a></h3>
      <p class="project-description">${html(description)}</p>
      <div class="card-tags">${repo.language ? `<span class="language-tag" style="--language-color:${colors[repo.language] || '#7e8a7a'}"><i aria-hidden="true"></i>${html(repo.language)}</span>` : ''}${tags.map((tag) => `<span class="topic-tag">${html(tag)}</span>`).join('')}</div>
      <div class="card-footer">${dateLabel(date) ? `<time datetime="${html(date)}" title="最后提交时间">${dateLabel(date)}</time>` : '<span style="margin-right:auto"></span>'}<span class="card-stars" aria-label="${Number(repo.stars) || 0} 个 Star"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true"><path d="m10 2 2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.3l-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L10 2Z"/></svg>${Number(repo.stars) || 0}</span>${homepage && homepage !== 'https://lighthouse333.github.io/' ? `<a class="demo-link" href="${html(homepage)}" target="_blank" rel="noopener noreferrer" aria-label="访问 ${html(repo.name)} 的项目网站">网站 ↗</a>` : ''}<a class="repo-link" href="${repoUrl}" target="_blank" rel="noopener noreferrer" aria-label="查看 ${html(repo.name)} 源码">源码 ↗</a></div>
    </article>`;
  }
  function render() {
    const query = state.search.trim().toLocaleLowerCase();
    const visible = state.repositories.filter((repo) => {
      const detail = details[repo.name] || {};
      const text = [repo.name, repo.description, repo.language, detail.description, detail.category, ...(detail.tags || []), ...(repo.topics || [])].filter(Boolean).join(' ').toLocaleLowerCase();
      return (state.language === 'all' || repo.language === state.language) && (!query || text.includes(query));
    }).sort((a, b) => state.sort === 'stars' ? (b.stars - a.stars || a.name.localeCompare(b.name)) : state.sort === 'name' ? a.name.localeCompare(b.name) : (Date.parse(b.pushed_at || b.updated_at) || 0) - (Date.parse(a.pushed_at || a.updated_at) || 0));
    grid.innerHTML = visible.map(card).join('');
    document.getElementById('empty-state').hidden = visible.length !== 0;
    resultCount.textContent = state.language === 'all' && !query ? `${visible.length} 个公开项目` : `找到 ${visible.length} 个项目 / 共 ${state.repositories.length} 个`;
    document.getElementById('repo-total').textContent = state.repositories.length;
    document.getElementById('language-total').textContent = languages().length;
    filterList.querySelectorAll('button').forEach((button) => { const selected = button.dataset.language === state.language; button.classList.toggle('active', selected); button.setAttribute('aria-pressed', String(selected)); });
  }
  filterList.addEventListener('click', (event) => { const button = event.target.closest('button[data-language]'); if (button) { state.language = button.dataset.language; render(); } });
  search.addEventListener('input', () => { state.search = search.value; render(); });
  document.getElementById('project-sort').addEventListener('change', (event) => { state.sort = event.target.value; render(); });
  document.getElementById('clear-filters').addEventListener('click', () => { state.language = 'all'; state.search = ''; search.value = ''; render(); search.focus(); });
  document.getElementById('year').textContent = new Date().getFullYear();
  renderFilters(); render();

  function normalize(repo) {
    return { name: repo.name, description: repo.description, homepage: repo.homepage, language: repo.language, stars: repo.stargazers_count, fork: repo.fork, archived: repo.archived, topics: repo.topics || [], updated_at: repo.updated_at, pushed_at: repo.pushed_at };
  }
  async function refreshRepositories() {
    try {
      let cached;
      try { cached = JSON.parse(localStorage.getItem(CACHE_KEY)); } catch { /* Storage is optional. */ }
      const cachedAt = Number(cached?.savedAt);
      if (cached && cachedAt <= Date.now() && Date.now() - cachedAt < CACHE_AGE && Array.isArray(cached.repositories) && cached.repositories.every((repo) => typeof repo?.name === 'string')) {
        state.repositories = cached.repositories; renderFilters(); render(); syncNote.textContent = '项目资料来自 GitHub · 最近已同步'; return;
      }
      const repositories = [];
      for (let page = 1; ; page += 1) {
        const response = await fetch(`https://api.github.com/users/${OWNER}/repos?type=owner&sort=pushed&per_page=100&page=${page}`, { headers: { Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error(`GitHub ${response.status}`);
        const batch = await response.json();
        if (!Array.isArray(batch)) throw new Error('Invalid repository response');
        repositories.push(...batch.filter((repo) => !repo.private && repo.owner?.login?.toLowerCase() === OWNER && typeof repo.name === 'string').map(normalize));
        if (batch.length < 100) break;
      }
      state.repositories = repositories;
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), repositories })); } catch { /* The embedded snapshot works without storage. */ }
      renderFilters(); render(); syncNote.textContent = '项目资料来自 GitHub · 已同步';
    } catch {
      syncNote.textContent = snapshot.fetchedAt ? `项目资料更新于 ${dateLabel(snapshot.fetchedAt)}` : '项目资料来自 GitHub';
    }
  }
  refreshRepositories();
})();
