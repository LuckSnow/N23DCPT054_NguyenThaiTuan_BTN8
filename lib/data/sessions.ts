import "server-only";
import { getPool } from "@/lib/server/db";
import type { CurrentUser } from "@/lib/types/feed";
type InsertSessionInput = {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
};

export async function insertSession(
  input: InsertSessionInput,
): Promise<void> {
  await getPool().query(
    `INSERT INTO sessions (id, token_hash, user_id, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [input.id, input.tokenHash, input.userId, input.expiresAt],
  );

}
export async function findSessionUser(
  tokenHash: string,
): Promise<CurrentUser | null> {
  const result = await getPool().query<CurrentUser>(
    `SELECT u.id, u.username
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1
       AND s.expires_at > NOW()
     LIMIT 1`,
    [tokenHash],
  );

  return result.rows[0] ?? null;
}

export async function deleteSessionByTokenHash(
  tokenHash: string,
): Promise<boolean> {
  const result = await getPool().query(
    `DELETE FROM sessions
     WHERE token_hash = $1`,
    [tokenHash],
  );

  return result.rowCount === 1;
}
