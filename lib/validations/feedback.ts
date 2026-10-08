import { z } from "zod";

/**
 * Regex kiểm tra số điện thoại Việt Nam:
 * - Hỗ trợ các đầu số di động 10 số của các nhà mạng Việt Nam:
 *   + Viettel: 086, 096, 097, 098, 032, 033, 034, 035, 036, 037, 038, 039
 *   + Vinaphone: 088, 091, 094, 083, 084, 085, 081, 082
 *   + Mobifone: 089, 090, 093, 070, 079, 077, 076, 078
 *   + Vietnamobile / Wintel / Gmobile: 092, 056, 058, 052, 055, 059, 099
 *   => Bắt đầu bằng 03, 05, 07, 08, 09 kèm 8 chữ số tiếp theo.
 * - Hỗ trợ tiền tố mã quốc gia +84 hoặc 84.
 */
export const VIETNAMESE_PHONE_REGEX = /^(?:(?:\+84|84)0?|0)(?:3|5|7|8|9)\d{8}$/;

export const customerFeedbackSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự.")
    .max(100, "Họ và tên không được vượt quá 100 ký tự."),

  phoneNumber: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại.")
    .regex(
      VIETNAMESE_PHONE_REGEX,
      "Số điện thoại không đúng định dạng Việt Nam.",
    ),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(255, "Email không được vượt quá 255 ký tự.")
    .email("Email không đúng định dạng.")
    .optional()
    .or(z.literal("")),

  category: z
    .string()
    .trim()
    .min(1, "Vui lòng chọn loại dịch vụ cần góp ý.")
    .default("Chất lượng sản phẩm & Dịch vụ"),

  rating: z.coerce.number().min(1).max(5).default(5),

  content: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập nội dung góp ý.")
    .max(1000, "Nội dung góp ý không được vượt quá 1000 ký tự.")
    .refine((val) => val.length > 20, {
      message: "Nội dung góp ý phải trên 20 ký tự.",
    }),
});

export type CustomerFeedbackInput = z.infer<typeof customerFeedbackSchema>;
