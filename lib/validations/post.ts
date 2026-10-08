import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Nội dung bài viết không được để trống.")
    .max(500, "Nội dung bài viết không được vượt quá 500 ký tự."),
});

export const deletePostSchema = z.object({
  postId: z
    .string()
    .regex(/^[1-9]\d*$/, "Bài viết không hợp lệ."),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
