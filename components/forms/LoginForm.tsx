"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { demoLoginUnsafeAction, loginAction } from "@/app/actions/auth";
import { FormAlert } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ENABLE_UNSAFE_LOGIN_SQL_DEMO } from "@/lib/demo/security";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm() {
  const [formError, setFormError] = useState<string>();
  const [formSuccess, setFormSuccess] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setFormError(undefined);
    setFormSuccess(undefined);
    const result = ENABLE_UNSAFE_LOGIN_SQL_DEMO
      ? await demoLoginUnsafeAction(values)
      : await loginAction(values);

    for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
      if (field in values && messages[0]) {
        setError(field as keyof LoginInput, { type: "server", message: messages[0] });
      }
    }

    setFormError(result.formError);
    setFormSuccess(result.formSuccess);
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormAlert
        message={
          ENABLE_UNSAFE_LOGIN_SQL_DEMO
            ? "DEMO LOCAL: Login dùng SQL nối chuỗi với tài khoản giả. Xác thực thành công sẽ tạo session và chuyển sang Feed."
            : undefined
        }
      />
      <FormAlert message={formError} />
      <FormAlert message={formSuccess} variant="success" />

      <div className="field-group">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="ban@example.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && <p id="login-email-error" className="field-error">{errors.email.message}</p>}
      </div>

      <div className="field-group">
        <label htmlFor="login-password">Mật khẩu</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="Nhập mật khẩu"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "login-password-error" : undefined}
          {...register("password")}
        />
        {errors.password && <p id="login-password-error" className="field-error">{errors.password.message}</p>}
      </div>

      <SubmitButton isPending={isSubmitting} pendingLabel="Đang đăng nhập…">
        Đăng nhập
      </SubmitButton>
    </form>
  );
}
