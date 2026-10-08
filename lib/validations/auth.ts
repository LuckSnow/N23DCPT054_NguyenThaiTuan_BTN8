import { z } from "zod";
import { ENABLE_UNSAFE_LOGIN_SQL_DEMO } from "@/lib/demo/security";

export const registerSchema = z
  .object({
    //------------------------------------------------------------------
    username: z
      .string()
      .trim()
      .min(3, "Tên người dùng phải có ít nhất 3 ký tự.")
      .max(30, "Tên người dùng không được vượt quá 30 ký tự.")
      .regex(/^[a-zA-Z0-9_]+$/, "Chỉ dùng chữ cái, chữ số và dấu gạch dưới."),
    //------------------------------------------------------------------
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(255, "Email không được vượt quá 255 ký tự.")
      .email("Email không đúng định dạng."),
    //------------------------------------------------------------------
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
      .max(72, "Mật khẩu không được vượt quá 72 ký tự.")
      .refine((value) => new TextEncoder().encode(value).length <= 72, {
        message: "Mật khẩu không được vượt quá 72 byte UTF-8.",
      }),
    //------------------------------------------------------------------
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp.",
    path: ["confirmPassword"],
  });
//------------------------------------------------------------------
const loginEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Vui lòng nhập email.")
  .max(255, "Email không được vượt quá 255 ký tự.");

export const loginSchema = z.object({
  //------------------------------------------------------------------
  // SAFE ORIGINAL: loginEmailSchema.email("Email không đúng định dạng.")
  // DEMO UNSAFE: bo kiem tra dinh dang de payload SQL di toi Server Action.
  email: ENABLE_UNSAFE_LOGIN_SQL_DEMO
    ? loginEmailSchema
    : loginEmailSchema.email("Email không đúng định dạng."),
  //------------------------------------------------------------------
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu.")
    .max(72, "Mật khẩu không được vượt quá 72 ký tự.")
    .refine((value) => new TextEncoder().encode(value).length <= 72, {
      message: "Mật khẩu không được vượt quá 72 byte UTF-8.",
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
