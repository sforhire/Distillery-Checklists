
import { ChecklistType, Entry, Template, TemplateItem, EntryItem } from '../types';

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

export const apiService = {
  // --- Templates ---
  async getTemplate(type: ChecklistType): Promise<Template> {
    const res = await fetch(`/api/templates?type=${type}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch template');
    return res.json();
  },

  async addTemplateItem(templateId: string, text: string, orderIndex: number): Promise<TemplateItem> {
    const res = await fetch(`/api/templates/item`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ templateId, text, orderIndex }),
    });
    if (!res.ok) throw new Error('Failed to add item');
    return res.json();
  },

  async deleteTemplateItem(itemId: string): Promise<void> {
    const res = await fetch(`/api/templates/item?id=${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete item');
  },

  async updateTemplateItemsOrder(items: { id: string; order_index: number }[]): Promise<void> {
    const res = await fetch(`/api/templates/reorder`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error('Failed to reorder');
  },

  // --- Entries ---
  async createEntry(type: ChecklistType, createdByName: string): Promise<Entry> {
    const res = await fetch(`/api/entries`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ type, createdByName }),
    });
    if (!res.ok) throw new Error('Failed to create entry');
    return res.json();
  },

  async getEntries(): Promise<Entry[]> {
    const res = await fetch(`/api/entries`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
  },

  async getEntryDetail(entryId: string): Promise<Entry> {
    const res = await fetch(`/api/entries/${entryId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch entry details');
    return res.json();
  },

  async updateEntryItem(entryId: string, itemId: string, updates: Partial<EntryItem>): Promise<void> {
    const res = await fetch(`/api/entries/${entryId}/items`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ itemId, ...updates }),
    });
    if (!res.ok) throw new Error('Failed to update item');
  },

  async submitEntry(entryId: string, entryNotes: string): Promise<void> {
    const res = await fetch(`/api/entries/${entryId}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ entryNotes }),
    });
    if (!res.ok) throw new Error('Failed to submit entry');
  }
};
