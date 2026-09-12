/**
 * Global Header, Footer, and Theme Manager
 */
const Navigation = {
  async init(activePage = '') {
    this.initTheme();
    await this.applyConfig();
    this.highlightActiveLink(activePage);
  },

  initTheme() {
    const savedTheme = localStorage.getItem('ndc_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = savedTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ndc_theme', next);
        toggleBtn.innerHTML = next === 'dark' ? '☀️ Light' : '🌙 Dark';
      });
    }
  },

  async applyConfig() {
    // Determine path prefix based on whether we are in /pages/ or root
    const prefix = window.location.pathname.includes('/pages/') ? '../' : './';
    const config = await Utils.fetchJson(`${prefix}data/config.json`);
    if (!config) return;

    // Set page titles dynamically if requested
    const orgLabels = document.querySelectorAll('.dynamic-org-title');
    orgLabels.forEach(el => el.textContent = config.organization);

    const facilityLabels = document.querySelectorAll('.dynamic-facility-title');
    facilityLabels.forEach(el => el.textContent = config.facility);
  },

  highlightActiveLink(pageId) {
    const links = document.querySelectorAll('.nav-link, .sidebar-nav-item a');
    links.forEach(a => {
      if (a.getAttribute('data-page') === pageId) {
        a.classList.add('active');
      }
    });
  }
};