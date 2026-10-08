import type { ButtonHTMLAttributes } from "react";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isPending: boolean;
  pendingLabel: string;
};

export function SubmitButton({
  children,
  isPending,
  pendingLabel,
  disabled,
  className = "primary-button",
  ...props
}: SubmitButtonProps) {
  return (
    <button
      {...props}
      type="submit"
      className={className}
      disabled={disabled || isPending}
      aria-disabled={disabled || isPending}
    >
      {isPending && <span className="button-spinner" aria-hidden="true" />}
      <span>{isPending ? pendingLabel : children}</span>
    </button>
  );
}
