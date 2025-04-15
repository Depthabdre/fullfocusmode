// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const result = await sql`SELECT 1 + 1 AS result`;
    return NextResponse.json({ message: 'DB Connected!', result });
  } catch (err) {
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 });
  }
}


