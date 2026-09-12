/**
 * Main NDC Knowledge Portal Controller
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Identify if nested in /pages/ or at root
  const inPagesDir = window.location.pathname.includes('/pages/');
  const basePath = inPagesDir ? '../' : './';

  // Extract page identity
  const pageMeta = document.body.getAttribute('data-page-id') || 'home';

  // Initialize Core Nav & Theme
  await Navigation.init(pageMeta);

  // Initialize Global Client-Side Search
  await SearchEngine.init(basePath);

  // Home Page Specific Logic
  if (pageMeta === 'home') {
    initHomePage(basePath);
  }
});

async function initHomePage(basePath) {
  const [docs, categories, equipment, standards] = await Promise.all([
    Utils.fetchJson(`${basePath}data/documents.json`),
    Utils.fetchJson(`${basePath}data/categories.json`),
    Utils.fetchJson(`${basePath}data/equipment.json`),
    Utils.fetchJson(`${basePath}data/standards.json`)
  ]);

  // Compute Statistics
  if (docs) {
    document.getElementById('stat-docs-count').textContent = docs.length;
    document.getElementById('stat-sops-count').textContent = docs.filter(d => ['SOP', 'MOP', 'EOP'].includes(d.type)).length;
  }
  if (categories) {
    document.getElementById('stat-categories-count').textContent = categories.length;
  }
  if (equipment) {
    document.getElementById('stat-equipment-count').textContent = equipment.length;
  }
  if (standards) {
    document.getElementById('stat-standards-count').textContent = standards.length;
  }

  // Render Featured Documents
  const featuredContainer = document.getElementById('featured-docs-container');
  if (featuredContainer && docs) {
    const featured = docs.filter(d => d.featured).slice(0, 6);
    featuredContainer.innerHTML = featured.map(d => DocumentsUI.renderCard(d)).join('');
  }

  // Render Category Cards
  const categoryGrid = document.getElementById('categories-grid');
  if (categoryGrid && categories) {
    categoryGrid.innerHTML = categories.map(cat => `
      <div class="card">
        <div class="card-title" style="color:var(--primary-light);">📂 ${Utils.escapeHtml(cat.name)}</div>
        <p class="card-desc">${Utils.escapeHtml(cat.description)}</p>
        <div class="tag-list">
          ${cat.subcategories.map(sub => `<span class="tag">${Utils.escapeHtml(sub)}</span>`).join('')}
        </div>
        <div style="margin-top:auto;">
          <a href="pages/documents.html?category=${encodeURIComponent(cat.name)}" class="btn btn-secondary btn-sm">Explore Files →</a>
        </div>
      </div>
    `).join('');
  }

  // Render Recently Viewed if present
  renderRecentlyViewed();
}

function renderRecentlyViewed() {
  const container = document.getElementById('recently-viewed-container');
  if (!container) return;
  const recents = Utils.storage.getRecentlyViewed();
  if (recents.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem;">No recently accessed documents in this browser.</p>`;
    return;
  }
  container.innerHTML = `
    <div style="display:flex; flex-wrap:wrap; gap:8px;">
      ${recents.map(r => `
        <a href="pages/documents.html?docId=${r.id}" class="btn btn-secondary btn-sm">
          📄 ${Utils.escapeHtml(r.title)}
        </a>
      `).join('')}
    </div>
  `;
}