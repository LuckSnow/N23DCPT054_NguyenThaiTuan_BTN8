"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { deletePostByAuthor, insertPost } from "@/lib/data/posts";
import type { FormActionState } from "@/lib/types/forms";
import { createPostSchema, deletePostSchema } from "@/lib/validations/post";

export async function createPostAction(
  input: unknown,
): Promise<FormActionState> {
  const parsed = createPostSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        status: "error",
        formError: "Bạn cần đăng nhập để đăng bài.",
      };
    }

    await insertPost({
      authorId: currentUser.id,
      content: parsed.data.content,
    });
  } catch {
    return {
      status: "error",
      formError: "Không thể đăng bài lúc này. Vui lòng thử lại.",
    };
  }

  revalidatePath("/feed");

  return { status: "success" };
}

export async function deletePostAction(
  input: unknown,
): Promise<FormActionState> {
  const parsed = deletePostSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      formError: "Bài viết không hợp lệ.",
    };
  }

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        status: "error",
        formError: "Bạn cần đăng nhập để xóa bài.",
      };
    }

    const deleted = await deletePostByAuthor({
      postId: parsed.data.postId,
      authorId: currentUser.id,
    });

    if (!deleted) {
      return {
        status: "error",
        formError: "Không thể xóa bài viết này.",
      };
    }
  } catch {
    return {
      status: "error",
      formError: "Không thể xóa bài lúc này. Vui lòng thử lại.",
    };
  }

  revalidatePath("/feed");

  return { status: "success" };
}
