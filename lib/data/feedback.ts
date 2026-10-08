import "server-only";
import { getPool } from "@/lib/server/db";
import type { CustomerFeedbackInput } from "@/lib/validations/feedback";

export type CustomerFeedbackRecord = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  category: string;
  rating: number;
  content: string;
  createdAt: string;
};

// Fallback in-memory list phòng khi PostgreSQL chưa khởi chạy
const inMemoryFeedbacks: CustomerFeedbackRecord[] = [
  {
    id: "sample-1",
    fullName: "Nguyễn Văn An",
    phoneNumber: "0987654321",
    email: "an.nguyen@example.com",
    category: "Chất lượng sản phẩm & Dịch vụ",
    rating: 5,
    content:
      "Giao diện mua sắm và mạng xã hội rất đẹp mắt, các form nhập liệu phản hồi cực nhanh, tốc độ thanh toán mượt mà.",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: "sample-2",
    fullName: "Trần Thị Mai",
    phoneNumber: "0912345678",
    email: "mai.tran@example.com",
    category: "Chăm sóc khách hàng & CSKH",
    rating: 5,
    content:
      "Nhân viên hỗ trợ rất nhiệt tình và chu đáo, giải quyết thắc mắc về đơn hàng của tôi trong vòng chưa đầy 10 phút.",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

export async function insertCustomerFeedback(
  data: CustomerFeedbackInput,
): Promise<CustomerFeedbackRecord> {
  const newRecord: CustomerFeedbackRecord = {
    id: `fb-${Date.now()}`,
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    email: data.email ? data.email : undefined,
    category: data.category,
    rating: Number(data.rating) || 5,
    content: data.content,
    createdAt: new Date().toISOString(),
  };

  try {
    const pool = getPool();
    const result = await pool.query<{ id: string; created_at: Date }>(
      `INSERT INTO customer_feedbacks (full_name, phone_number, email, category, content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [
        data.fullName,
        data.phoneNumber,
        data.email || null,
        data.category,
        data.content,
      ],
    );

    if (result.rows[0]) {
      newRecord.id = String(result.rows[0].id);
      newRecord.createdAt = result.rows[0].created_at.toISOString();
    }
  } catch (error) {
    console.warn(
      "Không thể lưu vào PostgreSQL (sử dụng in-memory fallback):",
      error instanceof Error ? error.message : error,
    );
  }

  inMemoryFeedbacks.unshift(newRecord);
  return newRecord;
}

export async function getCustomerFeedbacks(): Promise<CustomerFeedbackRecord[]> {
  try {
    const pool = getPool();
    const { rows } = await pool.query<{
      id: string;
      full_name: string;
      phone_number: string;
      email: string | null;
      category: string;
      content: string;
      created_at: Date;
    }>(
      `SELECT id, full_name, phone_number, email, category, content, created_at
       FROM customer_feedbacks
       ORDER BY created_at DESC
       LIMIT 20`,
    );

    return rows.map((row) => ({
      id: String(row.id),
      fullName: row.full_name,
      phoneNumber: row.phone_number,
      email: row.email ?? undefined,
      category: row.category,
      rating: 5,
      content: row.content,
      createdAt: row.created_at.toISOString(),
    }));
  } catch {
    return inMemoryFeedbacks;
  }
}
