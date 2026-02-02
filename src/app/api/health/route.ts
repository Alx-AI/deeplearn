import { NextResponse } from 'next/server';
import { sql } from '@/lib/db/neon';

export async function GET() {
  try {
    await sql`SELECT 1`;
    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: (err as Error).message },
      { status: 500 },
    );
  }
}
