
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  const { data: template, error } = await supabase
    .from('checklist_templates')
    .select('*, items:checklist_template_items(*)')
    .eq('type', type)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(template);
}
