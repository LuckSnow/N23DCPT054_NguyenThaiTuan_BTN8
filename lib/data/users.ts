import "server-only";
import { getPool } from "@/lib/server/db";

type CreateUserInput = {
  username: string;
  email: string;
  passwordHash: string;
};
type UserWithPassword = {
  id: string;
  username: string;
  passwordHash: string;
};

export async function findUserByEmail(
  email: string,
): Promise<UserWithPassword | null> {
  const result = await getPool().query<UserWithPassword>(
    `SELECT id, username, password_hash AS "passwordHash"
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email],
  );

  return result.rows[0] ?? null;
}

type SafeUser = {
  id: string;
  username: string;
};

export async function createUser(
  input: CreateUserInput,
): Promise<SafeUser> {
  const result = await getPool().query<{
    id: string;
    username: string;
  }>(
    `INSERT INTO users (username, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, username`,
    [input.username, input.email, input.passwordHash],
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("User insert returned no row.");
  }

  return user;
}

// CỐ Ý CÓ LỖ HỔNG — chỉ dùng cho demo local.
export async function findDemoUserUnsafe(
  email: string,
  password: string,
): Promise<{ id: number; email: string } | null> {
  const sql = `
    SELECT id, email
    FROM demo_login_users
    WHERE email = '${email}'
      AND password_plain = '${password}'
    LIMIT 1
  `;

  const result = await getPool().query<{
    id: number;
    email: string;
  }>(sql);

  return result.rows[0] ?? null;
}

// Map a demo result to its dedicated Feed profile, never to an unrelated user.
export async function findDemoSessionUser(email: string): Promise<SafeUser | null> {
  const usernames: Record<string, string> = {
    "demo_a@example.com": "sql_demo_a",
    "demo_b@example.com": "sql_demo_b",
  };
  const username = usernames[email];
  if (!username) return null;

  const result = await getPool().query<SafeUser>(
    `SELECT id, username FROM users WHERE email = $1 AND username = $2 LIMIT 1`,
    [email, username],
  );
  return result.rows[0] ?? null;
}
