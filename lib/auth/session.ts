import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { findSessionUser, insertSession } from "@/lib/data/sessions";
import type { CurrentUser } from "@/lib/types/feed";

export const SESSION_COOKIE_NAME = "minisocial_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

type CreatedSession = { rawToken: string; expiresAt: Date };

export function hashSessionToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!rawToken) return null;
  const tokenHash = hashSessionToken(rawToken);
  return findSessionUser(tokenHash);
}

export async function createSession(userId: string): Promise<CreatedSession> {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(rawToken);
  const sessionId = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await insertSession({
    id: sessionId,
    tokenHash,
    userId,
    expiresAt });
  return { rawToken, expiresAt };
}

export async function setSessionCookie(
  rawToken: string,
  expiresAt: Date,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}
