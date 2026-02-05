
import { ChecklistType, Entry, Template, TemplateItem, EntryItem } from '../types.ts';

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

// Mock data for preview environments where the Next.js API is not running
const MOCK_TEMPLATES: Record<string, Template> = {
  [ChecklistType.OPENING]: {
    id: 'tpl-open',
    type: ChecklistType.OPENING,
    items: [
      { id: '1', template_id: 'tpl-open', text: 'Put Sign Out', order_index: 0, active: true },
      { id: '2', template_id: 'tpl-open', text: 'Open Sign On', order_index: 1, active: true },
      { id: '3', template_id: 'tpl-open', text: 'Front Door Unlocked', order_index: 2, active: true },
      { id: '4', template_id: 'tpl-open', text: 'Uplights On', order_index: 3, active: true },
      { id: '5', template_id: 'tpl-open', text: 'Music On', order_index: 4, active: true },
      { id: '6', template_id: 'tpl-open', text: 'Ice In Well', order_index: 5, active: true },
      { id: '7', template_id: 'tpl-open', text: 'Bottles Restocked On Back Bar', order_index: 6, active: true }
    ]
  },
  [ChecklistType.CLOSING]: {
    id: 'tpl-close',
    type: ChecklistType.CLOSING,
    items: [
      { id: 'c1', template_id: 'tpl-close', text: 'Sign Brought In', order_index: 0, active: true },
      { id: 'c2', template_id: 'tpl-close', text: 'Front Door Locked', order_index: 1, active: true },
      { id: 'c3', template_id: 'tpl-close', text: 'Trash Taken Out', order_index: 2, active: true },
      { id: 'c4', template_id: 'tpl-close', text: 'Liquors Capped', order_index: 3, active: true },
      { id: 'c5', template_id: 'tpl-close', text: 'Dishwasher Off', order_index: 4, active: true }
    ]
  },
  [ChecklistType.MANAGERIAL]: {
    id: 'tpl-mgr',
    type: ChecklistType.MANAGERIAL,
    items: [
      { id: 'm1', template_id: 'tpl-mgr', text: 'Review Sales Totals', order_index: 0, active: true },
      { id: 'm2', template_id: 'tpl-mgr', text: 'Inventory Audit - Spirits', order_index: 1, active: true },
      { id: 'm3', template_id: 'tpl-mgr', text: 'Check Temperature Logs', order_index: 2, active: true }
    ]
  }
};

export const apiService = {
  // --- Templates ---
  async getTemplate(type: ChecklistType): Promise<Template> {
    try {
      const res = await fetch(`/api/templates?type=${type}`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API Unavailable');
      return await res.json();
    } catch (e) {
      console.warn(`Using fallback template for ${type} (API Offline)`);
      return MOCK_TEMPLATES[type] || MOCK_TEMPLATES[ChecklistType.OPENING];
    }
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
    try {
      const res = await fetch(`/api/entries`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ type, createdByName }),
      });
      if (!res.ok) throw new Error('API Offline');
      return await res.json();
    } catch (e) {
      // Fallback for creating an entry in preview
      const template = MOCK_TEMPLATES[type] || MOCK_TEMPLATES[ChecklistType.OPENING];
      return {
        id: `mock-entry-${Date.now()}`,
        type,
        created_at: new Date().toISOString(),
        completed_at: null,
        created_by_name: createdByName,
        entry_notes: '',
        items: template.items.map(i => ({
          id: `mock-item-${i.id}-${Math.random().toString(36).substr(2, 5)}`,
          entry_id: 'mock-entry',
          item_text_snapshot: i.text,
          order_index: i.order_index,
          checked: false,
          item_notes: ''
        }))
      };
    }
  },

  async getEntries(): Promise<Entry[]> {
    try {
      const res = await fetch(`/api/entries`, { headers: getHeaders() });
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getEntryDetail(entryId: string): Promise<Entry> {
    const res = await fetch(`/api/entries/${entryId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch entry details');
    return res.json();
  },

  async updateEntryItem(entryId: string, itemId: string, updates: Partial<EntryItem>): Promise<void> {
    if (entryId.startsWith('mock-')) return; // Ignore updates for mock entries
    const res = await fetch(`/api/entries/${entryId}/items`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ itemId, ...updates }),
    });
    if (!res.ok) throw new Error('Failed to update item');
  },

  async submitEntry(entryId: string, entryNotes: string): Promise<void> {
    if (entryId.startsWith('mock-')) return; // Simulate success for mock
    const res = await fetch(`/api/entries/${entryId}/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ entryNotes }),
    });
    if (!res.ok) throw new Error('Failed to submit entry');
  }
};
