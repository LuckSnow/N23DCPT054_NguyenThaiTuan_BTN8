type FormAlertProps = {
  message?: string;
  variant?: "error" | "success";
};

export function FormAlert({ message, variant = "error" }: FormAlertProps) {
  if (!message) return null;

  return (
    <div
      className={`form-alert form-alert-${variant}`}
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {message}
    </div>
  );
}
