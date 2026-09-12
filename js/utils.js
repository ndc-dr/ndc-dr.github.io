/**
 * NDC Portal Utilities Module
 */
const Utils = {
  // Safe fetch JSON wrapper with error state
  async fetchJson(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status} fetching ${url}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`[NDC Utils] Failed loading JSON from: ${url}`, err);
      return null;
    }
  },

  // Document Metadata Validator
  validateDocumentMetadata(doc) {
    const required = ['id', 'title', 'category', 'type', 'driveUrl'];
    const missing = required.filter(field => !doc[field]);
    if (missing.length > 0) {
      console.warn(`[NDC Validation] Document ID "${doc.id || 'UNKNOWN'}" is missing required fields:`, missing);
      return false;
    }
    return true;
  },

  // Google Drive URL Sanitizer & Preview Embedder
  formatDrivePreviewUrl(rawUrl, fileId) {
    if (!rawUrl && !fileId) return '#';
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    // Attempt fallback regex
    const match = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return rawUrl;
  },

  // Escape HTML to prevent injection
  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // LocalStorage Helpers for Favorites & History
  storage: {
    getFavorites() {
      return JSON.parse(localStorage.getItem('ndc_favorites') || '[]');
    },
    toggleFavorite(docId) {
      let favs = this.getFavorites();
      if (favs.includes(docId)) {
        favs = favs.filter(id => id !== docId);
      } else {
        favs.push(docId);
      }
      localStorage.setItem('ndc_favorites', JSON.stringify(favs));
      return favs.includes(docId);
    },
    isFavorite(docId) {
      return this.getFavorites().includes(docId);
    },
    getRecentlyViewed() {
      return JSON.parse(localStorage.getItem('ndc_recent_docs') || '[]');
    },
    addRecentlyViewed(doc) {
      let recents = this.getRecentlyViewed().filter(item => item.id !== doc.id);
      recents.unshift({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        date: new Date().toISOString()
      });
      recents = recents.slice(0, 8); // Max 8
      localStorage.setItem('ndc_recent_docs', JSON.stringify(recents));
    }
  }
};