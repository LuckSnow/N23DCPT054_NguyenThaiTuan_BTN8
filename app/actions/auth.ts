"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  createSession,
  hashSessionToken,
  SESSION_COOKIE_NAME,
  setSessionCookie,
} from "@/lib/auth/session";
import { deleteSessionByTokenHash } from "@/lib/data/sessions";
import {
  createUser,
  findDemoUserUnsafe,
  findDemoSessionUser,
  findUserByEmail,
} from "@/lib/data/users";
import { ENABLE_UNSAFE_LOGIN_SQL_DEMO } from "@/lib/demo/security";
import type { FormActionState } from "@/lib/types/forms";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
const INVALID_CREDENTIALS = "Email hoặc mật khẩu không đúng.";


type PgErrorLike = {
  code?: unknown;
  constraint?: unknown;
};

function getUniqueConstraint(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const pgError = error as PgErrorLike;

  if (
    pgError.code !== "23505" ||
    typeof pgError.constraint !== "string"
  ) {
    return undefined;
  }

  return pgError.constraint;
}



export async function registerAction(
  input: unknown,
): Promise<FormActionState> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { username, email, password } = parsed.data;

  try {
    const passwordHash = await hashPassword(password);

    await createUser({
      username,
      email,
      passwordHash,
    });
  } catch (error: unknown) {
    const constraint = getUniqueConstraint(error);

    if (constraint === "users_email_unique") {
      return {
        status: "error",
        fieldErrors: {
          email: ["Email này đã được sử dụng."],
        },
      };
    }

    if (constraint === "users_username_unique") {
      return {
        status: "error",
        fieldErrors: {
          username: ["Tên người dùng này đã được sử dụng."],
        },
      };
    }

    return {
      status: "error",
      formError: "Không thể đăng ký lúc này. Vui lòng thử lại.",
    };
  }

  redirect("/login");
}
export async function loginAction(
  input: unknown,
): Promise<FormActionState> {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await findUserByEmail(parsed.data.email);

    if (!user) {
      return {
        status: "error",
        formError: INVALID_CREDENTIALS,
      };
    }

    const passwordMatches = await verifyPassword(
      parsed.data.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      return {
        status: "error",
        formError: INVALID_CREDENTIALS,
      };
    }

    const { rawToken, expiresAt } = await createSession(user.id);

    await setSessionCookie(rawToken, expiresAt);
  } catch {
    return {
      status: "error",
      formError: "Không thể đăng nhập lúc này. Vui lòng thử lại.",
    };
  }

  redirect("/feed");
}

export async function logoutAction(): Promise<FormActionState> {
  try {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!rawToken) {
      return {
        status: "error",
        formError: "Không thể đăng xuất lúc này. Vui lòng thử lại.",
      };
    }

    const deleted = await deleteSessionByTokenHash(
      hashSessionToken(rawToken),
    );

    if (!deleted) {
      return {
        status: "error",
        formError: "Không thể đăng xuất lúc này. Vui lòng thử lại.",
      };
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    return {
      status: "error",
      formError: "Không thể đăng xuất lúc này. Vui lòng thử lại.",
    };
  }

  redirect("/login");
}

// CỐ Ý KHÔNG AN TOÀN — chỉ dùng cho demo local.
export async function demoLoginUnsafeAction(
  input: unknown,
): Promise<FormActionState> {
  if (!ENABLE_UNSAFE_LOGIN_SQL_DEMO || process.env.NODE_ENV === "production") {
    return {
      status: "error",
      formError: "Demo chỉ hoạt động khi bật cờ demo và chạy npm run dev.",
    };
  }

  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await findDemoUserUnsafe(
      parsed.data.email,
      parsed.data.password,
    );

    if (!user) {
      return {
        status: "error",
        formError: "Demo: email hoặc mật khẩu không đúng.",
      };
    }

    const sessionUser = await findDemoSessionUser(user.email);
    if (!sessionUser) {
      return {
        status: "error",
        formError: "Demo: chưa có hồ sơ Feed tương ứng. Chạy script setup-login-demo trước.",
      };
    }

    const { rawToken, expiresAt } = await createSession(sessionUser.id);
    await setSessionCookie(rawToken, expiresAt);
  } catch {
    return {
      status: "error",
      formError: "Demo: truy vấn SQL bị lỗi.",
    };
  }
  redirect("/feed");
}
