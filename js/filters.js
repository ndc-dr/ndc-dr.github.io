/**
 * Multi-factor dynamic filtering engine for Document repositories
 */
const FilterEngine = {
  applyFilters(dataset, { category, type, system, query }) {
    return dataset.filter(item => {
      const matchCategory = !category || category === 'ALL' || item.category === category;
      const matchType = !type || type === 'ALL' || item.type === type;
      const matchSystem = !system || system === 'ALL' || item.system === system;
      const matchQuery = !query || 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(query.toLowerCase())));

      return matchCategory && matchType && matchSystem && matchQuery;
    });
  },

  sortRecords(dataset, sortBy) {
    const cloned = [...dataset];
    switch (sortBy) {
      case 'newest':
        return cloned.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return cloned.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'title-asc':
        return cloned.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return cloned.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return cloned;
    }
  }
};