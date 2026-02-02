import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db/neon';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      username.trim().length < 3 ||
      password.length < 8
    ) {
      return NextResponse.json(
        { error: 'Username must be 3+ characters and password 8+ characters' },
        { status: 400 },
      );
    }

    const normalised = username.toLowerCase().trim();
    const hash = await bcrypt.hash(password, 10);

    const rows = await sql`INSERT INTO users (username, password_hash) VALUES (${normalised}, ${hash})
       ON CONFLICT (username) DO NOTHING
       RETURNING id, username`;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { id: rows[0].id, username: rows[0].username },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
