import "server-only";
import { Pool } from "pg";

const dbGlobal = globalThis as typeof globalThis & {
  miniSocialPool?: Pool;
};

export function getPool(): Pool {
  if (!dbGlobal.miniSocialPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("Missing DATABASE_URL");

    const pool = new Pool({
      connectionString,
      max: 10,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    });
    pool.on("error", () => {
      console.error("Database idle connection failed.");
    });
    dbGlobal.miniSocialPool = pool;
  }

  return dbGlobal.miniSocialPool;
}
