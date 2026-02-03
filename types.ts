
export enum ChecklistType {
  OPENING = 'opening',
  CLOSING = 'closing',
  MANAGERIAL = 'managerial'
}

export interface TemplateItem {
  id: string;
  template_id: string;
  text: string;
  order_index: number;
  active: boolean;
}

export interface Template {
  id: string;
  type: ChecklistType;
  items: TemplateItem[];
}

export interface Entry {
  id: string;
  type: ChecklistType;
  created_at: string;
  completed_at: string | null;
  created_by_name: string;
  entry_notes: string;
  items?: EntryItem[];
}

export interface EntryItem {
  id: string;
  entry_id: string;
  item_text_snapshot: string;
  order_index: number;
  checked: boolean;
  item_notes: string;
}

export type AppView = 'home' | 'new-entry' | 'log' | 'template-editor' | 'entry-detail';
