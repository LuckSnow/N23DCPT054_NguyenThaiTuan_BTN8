"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createPostAction } from "@/app/actions/posts";
import { FormAlert } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { createPostSchema, type CreatePostInput } from "@/lib/validations/post";

export function CreatePostForm() {
  const [formError, setFormError] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { content: "" },
  });

  const content = watch("content") ?? "";

  async function onSubmit(values: CreatePostInput) {
    setFormError(undefined);
    const result = await createPostAction(values);

    const contentError = result.fieldErrors?.content?.[0];
    if (contentError) setError("content", { type: "server", message: contentError });

    if (result.status === "success") reset();
    setFormError(result.formError);
  }

  return (
    <section className="composer-card" aria-labelledby="composer-title">
      <div className="composer-heading">
        <div>
          <p className="eyebrow">Tạo bài viết</p>
          <h1 id="composer-title">Bạn đang nghĩ gì?</h1>
        </div>
        <span className={`character-count ${content.length > 500 ? "is-over-limit" : ""}`} aria-live="polite">
          {content.length}/500
        </span>
      </div>

      <form className="composer-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormAlert message={formError} />
        <div className="field-group">
          <label className="sr-only" htmlFor="post-content">Nội dung bài viết</label>
          <textarea
            id="post-content"
            rows={5}
            placeholder="Chia sẻ một điều gì đó với mọi người…"
            aria-invalid={Boolean(errors.content)}
            aria-describedby={errors.content ? "post-content-error" : "post-content-hint"}
            {...register("content")}
          />
          <p id="post-content-hint" className="field-hint">Tối đa 500 ký tự.</p>
          {errors.content && <p id="post-content-error" className="field-error">{errors.content.message}</p>}
        </div>
        <div className="composer-actions">
          <p>Nội dung sẽ được hiển thị dưới dạng văn bản thuần túy.</p>
          <SubmitButton isPending={isSubmitting} pendingLabel="Đang đăng…">
            Đăng bài
          </SubmitButton>
        </div>
      </form>
    </section>
  );
}
