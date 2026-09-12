/**
 * Document Card Generation & Modal Viewer Module
 */
const DocumentsUI = {
  renderCard(doc) {
    const isFav = Utils.storage.isFavorite(doc.id);
    let badgeClass = 'badge-primary';
    if (doc.type === 'SOP') badgeClass = 'badge-sop';
    if (doc.type === 'EOP') badgeClass = 'badge-eop';
    if (doc.type === 'MOP') badgeClass = 'badge-mop';

    return `
      <div class="card" id="doc-card-${doc.id}">
        <div class="card-header">
          <span class="badge ${badgeClass}">${Utils.escapeHtml(doc.type)}</span>
          <button class="btn btn-secondary btn-sm" onclick="DocumentsUI.toggleFav('${doc.id}')" title="Save Favorite">
            ${isFav ? '★' : '☆'}
          </button>
        </div>
        <div class="card-title">${Utils.escapeHtml(doc.title)}</div>
        <div class="card-desc">${Utils.escapeHtml(doc.description)}</div>
        
        <div class="tag-list">
          ${(doc.tags || []).map(t => `<span class="tag">#${Utils.escapeHtml(t)}</span>`).join('')}
        </div>

        <div class="card-meta">
          <span><strong>System:</strong> ${Utils.escapeHtml(doc.system || 'Facility')}</span>
          <span><strong>Rev:</strong> ${Utils.escapeHtml(doc.version || '1.0')}</span>
          <span><strong>Date:</strong> ${Utils.escapeHtml(doc.date)}</span>
        </div>

        <div class="card-actions">
          <button class="btn btn-primary btn-sm" onclick='DocumentsUI.openPreviewModal(${JSON.stringify(doc)})'>
            👁️ Quick View
          </button>
          <a href="${Utils.escapeHtml(doc.driveUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            📁 Open Drive
          </a>
        </div>
      </div>
    `;
  },

  toggleFav(docId) {
    Utils.storage.toggleFavorite(docId);
    const card = document.getElementById(`doc-card-${docId}`);
    if (card) {
      const btn = card.querySelector('button[title="Save Favorite"]');
      if (btn) btn.innerHTML = Utils.storage.isFavorite(docId) ? '★' : '☆';
    }
  },

  openPreviewModal(doc) {
    Utils.storage.addRecentlyViewed(doc);
    const modal = document.getElementById('document-modal');
    if (!modal) return;

    document.getElementById('modal-title').textContent = doc.title;
    document.getElementById('modal-category').textContent = `${doc.category} → ${doc.subcategory || ''}`;
    document.getElementById('modal-desc').textContent = doc.description;
    document.getElementById('modal-external-link').setAttribute('href', doc.driveUrl);

    const iframe = document.getElementById('modal-preview-frame');
    const previewUrl = Utils.formatDrivePreviewUrl(doc.driveUrl, doc.driveFileId);
    iframe.setAttribute('src', previewUrl);

    modal.style.display = 'flex';
  },

  closeModal() {
    const modal = document.getElementById('document-modal');
    if (!modal) return;
    modal.style.display = 'none';
    const iframe = document.getElementById('modal-preview-frame');
    if (iframe) iframe.setAttribute('src', '');
  }
};