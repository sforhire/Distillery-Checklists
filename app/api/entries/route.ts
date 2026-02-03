
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('checklist_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { type, createdByName } = await request.json();

  // 1. Get the current template items
  const { data: template } = await supabase
    .from('checklist_templates')
    .select('id, items:checklist_template_items(*)')
    .eq('type', type)
    .single();

  // 2. Create the entry
  const { data: entry, error: entryError } = await supabase
    .from('checklist_entries')
    .insert({ type, created_by_name: createdByName })
    .select()
    .single();

  if (entryError) return NextResponse.json({ error: entryError.message }, { status: 500 });

  // 3. Create the snapshot items
  if (template?.items) {
    const entryItems = template.items.map((item: any) => ({
      entry_id: entry.id,
      item_text_snapshot: item.text,
      order_index: item.order_index,
      checked: false
    }));

    await supabase.from('checklist_entry_items').insert(entryItems);
  }

  return NextResponse.json(entry);
}
