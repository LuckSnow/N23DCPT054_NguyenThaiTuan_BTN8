"use client";

import { useState } from "react";
import { deletePostAction } from "@/app/actions/posts";
import { SubmitButton } from "@/components/ui/SubmitButton";

type DeletePostButtonProps = {
  postId: string;
};

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState<string>();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác.",
    );

    if (!confirmed) return;

    setIsPending(true);
    setFormError(undefined);

    const result = await deletePostAction({ postId });

    if (result.status === "error") {
      setFormError(result.formError);
      setIsPending(false);
    }
  }

  return (
    <div className="post-delete-control">
      <form onSubmit={onSubmit}>
        <SubmitButton
          isPending={isPending}
          pendingLabel="Đang xóa…"
          className="danger-button"
          aria-label="Xóa bài viết của bạn"
        >
          Xóa
        </SubmitButton>
      </form>
      {formError && (
        <p className="post-delete-error" role="alert" aria-live="polite">
          {formError}
        </p>
      )}
    </div>
  );
}
