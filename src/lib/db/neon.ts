import { neon, Pool } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL!;

/** HTTP-based query function for simple queries (no connection overhead). */
export const sql = neon(databaseUrl);

/** Connection pool for transactions (card update + review log). */
let _pool: Pool | null = null;
export function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({ connectionString: databaseUrl });
  }
  return _pool;
}
