/**
 * Instant Client-Side Fuzzy & Field Search Engine
 */
const SearchEngine = {
  documents: [],
  equipment: [],
  glossary: [],

  async init(basePath = './') {
    const [docs, eq, glo] = await Promise.all([
      Utils.fetchJson(`${basePath}data/documents.json`),
      Utils.fetchJson(`${basePath}data/equipment.json`),
      Utils.fetchJson(`${basePath}data/glossary.json`)
    ]);

    this.documents = docs || [];
    this.equipment = eq || [];
    this.glossary = glo || [];

    this.bindSearchInput();
  },

  bindSearchInput() {
    const searchInput = document.getElementById('global-search');
    const resultsBox = document.getElementById('search-dropdown');
    if (!searchInput || !resultsBox) return;

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (q.length < 2) {
        resultsBox.style.display = 'none';
        resultsBox.innerHTML = '';
        return;
      }
      const results = this.query(q);
      this.renderResults(results, resultsBox);
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsBox.contains(e.target)) {
        resultsBox.style.display = 'none';
      }
    });
  },

  query(q) {
    const matchedDocs = this.documents.filter(d => 
      (d.title && d.title.toLowerCase().includes(q)) ||
      (d.description && d.description.toLowerCase().includes(q)) ||
      (d.category && d.category.toLowerCase().includes(q)) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(q))) ||
      (d.manufacturer && d.manufacturer.toLowerCase().includes(q))
    ).map(d => ({ ...d, matchType: 'Document' }));

    const matchedEquipment = this.equipment.filter(eq =>
      (eq.name && eq.name.toLowerCase().includes(q)) ||
      (eq.system && eq.system.toLowerCase().includes(q)) ||
      (eq.function && eq.function.toLowerCase().includes(q))
    ).map(eq => ({ ...eq, matchType: 'Equipment', title: eq.name }));

    const matchedGlossary = this.glossary.filter(g =>
      (g.term && g.term.toLowerCase().includes(q)) ||
      (g.fullForm && g.fullForm.toLowerCase().includes(q)) ||
      (g.definition && g.definition.toLowerCase().includes(q))
    ).map(g => ({ ...g, matchType: 'Glossary', title: `${g.term} - ${g.fullForm}` }));

    return [...matchedDocs, ...matchedEquipment, ...matchedGlossary].slice(0, 10);
  },

  renderResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = `<div class="search-result-item" style="color:var(--text-muted);">No engineering records found matching criteria.</div>`;
      container.style.display = 'block';
      return;
    }

    container.innerHTML = results.map(r => `
      <div class="search-result-item" onclick="SearchEngine.handleSelect('${r.matchType}', '${r.id || ''}')">
        <div style="font-size:0.75rem; color:var(--primary-light); font-weight:700;">${r.matchType.toUpperCase()}</div>
        <div style="font-weight:600; font-size:0.9rem;">${Utils.escapeHtml(r.title)}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${Utils.escapeHtml(r.description || r.function || r.definition || '')}</div>
      </div>
    `).join('');
    container.style.display = 'block';
  },

  handleSelect(type, id) {
    const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    if (type === 'Document') {
      window.location.href = `${prefix}documents.html?docId=${id}`;
    } else if (type === 'Equipment') {
      window.location.href = `${prefix}equipment.html?eqId=${id}`;
    } else {
      window.location.href = `${prefix}glossary.html`;
    }
  }
};