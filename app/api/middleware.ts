
import { NextResponse } from 'next/server';

export function checkPin(request: Request) {
  // PIN check disabled as requested for open access
  return true;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
