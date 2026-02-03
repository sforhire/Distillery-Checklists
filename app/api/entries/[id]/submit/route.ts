
import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { entryNotes } = await request.json();

  const { error } = await supabase
    .from('checklist_entries')
    .update({ 
      completed_at: new Date().toISOString(),
      entry_notes: entryNotes 
    })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
