"use client";

import { useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { FormAlert } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function LogoutButton() {
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState<string>();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    setIsPending(true);
    setFormError(undefined);
    const result = await logoutAction();
    setFormError(result.formError);
    setIsPending(false);
  }

  return (
    <div className="logout-control">
      <form onSubmit={onSubmit}>
        <SubmitButton
          isPending={isPending}
          pendingLabel="Đang đăng xuất…"
          className="secondary-button"
        >
          Đăng xuất
        </SubmitButton>
      </form>
      <FormAlert message={formError} />
    </div>
  );
}
