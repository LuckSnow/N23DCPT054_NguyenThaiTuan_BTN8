"use server";

import { revalidatePath } from "next/cache";
import type { FormActionState } from "@/lib/types/forms";
import {
  customerFeedbackSchema,
  type CustomerFeedbackInput,
} from "@/lib/validations/feedback";
import { insertCustomerFeedback } from "@/lib/data/feedback";

export async function submitCustomerFeedbackAction(
  input: unknown,
): Promise<FormActionState> {
  const parsed = customerFeedbackSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
      formError:
        "Thông tin góp ý chưa hợp lệ. Vui lòng kiểm tra các thông báo lỗi bên dưới.",
    };
  }

  try {
    await insertCustomerFeedback(parsed.data as CustomerFeedbackInput);
  } catch (error) {
    console.error("Lỗi khi xử lý lưu góp ý:", error);
    return {
      status: "error",
      formError: "Không thể gửi góp ý lúc này. Vui lòng thử lại sau.",
    };
  }

  revalidatePath("/feedback");

  return {
    status: "success",
    formSuccess:
      "Gửi góp ý thành công! Nhóm 8 xin chân thành cảm ơn ý kiến đóng góp của bạn.",
  };
}
