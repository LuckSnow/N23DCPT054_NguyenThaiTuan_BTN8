import "server-only";
import { getPool } from "@/lib/server/db";
import type { FeedPost } from "@/lib/types/feed";

type FeedPostRow = {
  id: string;
  author_id: string;
  content: string;
  author_username: string;
  created_at: Date;
};

type InsertPostInput = {
  authorId: string;
  content: string;
};

type DeletePostInput = {
  postId: string;
  authorId: string;
};

export async function getFeedPosts(): Promise<FeedPost[]> {
  const { rows } = await getPool().query<FeedPostRow>(`
    SELECT p.id, p.author_id, p.content, u.username AS author_username, p.created_at
    FROM posts p
    JOIN users u ON u.id = p.author_id
    ORDER BY p.created_at DESC, p.id DESC
  `);

  return rows.map((row) => ({
    id: String(row.id),
    authorId: String(row.author_id),
    content: row.content,
    authorUsername: row.author_username,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function insertPost(input: InsertPostInput): Promise<void> {
  await getPool().query(
    `INSERT INTO posts (author_id, content)
     VALUES ($1, $2)`,
    [input.authorId, input.content],
  );
}

export async function deletePostByAuthor(
  input: DeletePostInput,
): Promise<boolean> {
  const result = await getPool().query(
    `DELETE FROM posts
     WHERE id = $1 AND author_id = $2
     RETURNING id`,
    [input.postId, input.authorId],
  );

  return result.rowCount === 1;
}
