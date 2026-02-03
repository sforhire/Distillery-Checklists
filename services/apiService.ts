
import { ChecklistType, Entry, Template, TemplateItem, EntryItem } from '../types';

/**
 * PRODUCTION NOTE:
 * In your Vercel/Supabase deployment, these methods should call your Next.js API routes.
 * For the purpose of this preview, we are using an in-memory simulation to ensure
 * the app is functional and you can see the checklist items from your photos immediately.
 */

const OPENING_ITEMS = [
  'Put Sign Out', 'Open Sign On', 'Front Door Unlocked', 'Doors Opened',
  'Uplights On', 'Music On', 'Bar/Store Lights On', 'Lamps/Candles Out',
  'Paper Towels Stocked', 'Toilet Paper Stocked', 'Dishwasher On',
  'Outstanding Dishes Washed', 'Oven On', 'Ice In Well', 'Sinks Filled',
  'Bar Mats Out', 'Bottles Restocked On Back Bar'
];

const CLOSING_ITEMS = [
  'Sign Brought In', 'Front Door Locked', 'Doors Secured', 'Uplights Off',
  'Lamps/Candles On Chargers', 'Trash Taken Out', 'Bathroom Trash Taken Out',
  'Oven Off', 'Dishwasher Off', 'Liquors Capped', 'Sinks Clean', 'Bar Mats Put Away'
];

// Simulated DB
let entries: Entry[] = [];
let templates: Template[] = [
  {
    id: 't-opening',
    type: ChecklistType.OPENING,
    items: OPENING_ITEMS.map((text, idx) => ({
      id: `ti-op-${idx}`,
      template_id: 't-opening',
      text,
      order_index: idx,
      active: true
    }))
  },
  {
    id: 't-closing',
    type: ChecklistType.CLOSING,
    items: CLOSING_ITEMS.map((text, idx) => ({
      id: `ti-cl-${idx}`,
      template_id: 't-closing',
      text,
      order_index: idx,
      active: true
    }))
  },
  {
    id: 't-managerial',
    type: ChecklistType.MANAGERIAL,
    items: []
  }
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // --- Templates ---
  async getTemplate(type: ChecklistType): Promise<Template> {
    await sleep(300);
    const template = templates.find(t => t.type === type);
    if (!template) throw new Error('Template not found');
    return JSON.parse(JSON.stringify(template));
  },

  async addTemplateItem(templateId: string, text: string, orderIndex: number): Promise<TemplateItem> {
    await sleep(200);
    const template = templates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');
    const newItem: TemplateItem = {
      id: Math.random().toString(36).substr(2, 9),
      template_id: templateId,
      text,
      order_index: orderIndex,
      active: true
    };
    template.items.push(newItem);
    return newItem;
  },

  async deleteTemplateItem(itemId: string): Promise<void> {
    await sleep(200);
    templates.forEach(t => {
      t.items = t.items.filter(i => i.id !== itemId);
    });
  },

  async updateTemplateItemsOrder(items: { id: string; order_index: number }[]): Promise<void> {
    await sleep(200);
    templates.forEach(t => {
      t.items.forEach(ti => {
        const update = items.find(u => u.id === ti.id);
        if (update) ti.order_index = update.order_index;
      });
    });
  },

  // --- Entries ---
  async createEntry(type: ChecklistType, createdByName: string): Promise<Entry> {
    await sleep(500);
    const template = templates.find(t => t.type === type);
    const newEntry: Entry = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      created_at: new Date().toISOString(),
      completed_at: null,
      created_by_name: createdByName,
      entry_notes: '',
      items: (template?.items || []).map(ti => ({
        id: Math.random().toString(36).substr(2, 9),
        entry_id: '', // set below
        item_text_snapshot: ti.text,
        order_index: ti.order_index,
        checked: false,
        item_notes: ''
      }))
    };
    newEntry.items?.forEach(i => i.entry_id = newEntry.id);
    entries.unshift(newEntry);
    return JSON.parse(JSON.stringify(newEntry));
  },

  async getEntries(): Promise<Entry[]> {
    await sleep(400);
    return JSON.parse(JSON.stringify(entries));
  },

  async getEntryDetail(entryId: string): Promise<Entry> {
    await sleep(300);
    const entry = entries.find(e => e.id === entryId);
    if (!entry) throw new Error('Entry not found');
    return JSON.parse(JSON.stringify(entry));
  },

  async updateEntryItem(entryId: string, itemId: string, updates: Partial<EntryItem>): Promise<void> {
    await sleep(100);
    const entry = entries.find(e => e.id === entryId);
    if (entry && entry.items) {
      const item = entry.items.find(i => i.id === itemId);
      if (item) Object.assign(item, updates);
    }
  },

  async submitEntry(entryId: string, entryNotes: string): Promise<void> {
    await sleep(500);
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      entry.completed_at = new Date().toISOString();
      entry.entry_notes = entryNotes;
    }
  }
};
