import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CustomerFeedbackForm } from "@/components/forms/CustomerFeedbackForm";
import { CustomerFeedbackList } from "@/components/feedback/CustomerFeedbackList";
import { getCustomerFeedbacks } from "@/lib/data/feedback";

export const metadata: Metadata = {
  title: "Góp ý khách hàng | Nhóm 8",
  description:
    "Form Góp ý khách hàng sử dụng Next.js Server Actions và Zod Form Validation của Nhóm 8.",
};

export default async function FeedbackPage() {
  const feedbacks = await getCustomerFeedbacks();

  return (
    <main className="feed-shell">
      {/* Header đồng bộ phong cách Nexus Social Network */}
      <header className="feed-header">
        <div className="header-inner">
          <div className="feed-brand" aria-label="Nexus Social Network">
            <span className="feed-brand-logo" aria-hidden="true">
              <Image src="/icon.png" alt="" fill priority sizes="44px" />
            </span>
            <span className="feed-brand-copy">
              <strong>Nexus • Nhóm 8</strong>
              <small>Customer Feedback Form</small>
            </span>
          </div>
          <div className="user-actions">
            <Link href="/feed" className="secondary-button feedback-nav-btn">
              ← Về Bảng tin (Feed)
            </Link>
            <Link href="/login" className="secondary-button feedback-nav-btn">
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      <div className="feed-content feedback-page-content">
        {/* Khối tóm tắt đề bài và tiêu chuẩn Zod Validation */}
        <section className="assignment-info-card" aria-labelledby="assignment-title">
          <div className="assignment-header">
            <span className="assignment-badge">BÀI TẬP NHÓM 8</span>
            <h1 id="assignment-title">Form Góp ý Khách hàng với Server Action & Zod</h1>
          </div>
          <div className="assignment-details">
            <div className="assignment-criterion">
              <span className="criterion-icon">✅</span>
              <div>
                <strong>Tiêu chí 1 - Trường &quot;Nội dung&quot;:</strong>
                <p>
                  Bắt buộc phải <em>trên 20 ký tự</em> (&gt; 20 ký tự). Báo lỗi nếu nội dung để trống hoặc không vượt quá 20 ký tự.
                </p>
              </div>
            </div>
            <div className="assignment-criterion">
              <span className="criterion-icon">✅</span>
              <div>
                <strong>Tiêu chí 2 - Trường &quot;Số điện thoại&quot;:</strong>
                <p>
                  Bắt buộc phải đúng định dạng <em>số điện thoại Việt Nam</em> (10 chữ số, các đầu số mạng di động 03x, 05x, 07x, 08x, 09x hoặc tiền tố quốc gia +84/84).
                </p>
              </div>
            </div>
            <div className="assignment-criterion">
              <span className="criterion-icon">🛡️</span>
              <div>
                <strong>Bảo mật &amp; Kiến trúc:</strong>
                <p>
                  Kiểm tra đồng thời cả <em>Client-side</em> (React Hook Form) và <em>Server-side</em> (Next.js Server Action với Zod schema an toàn).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Biểu mẫu góp ý chính */}
        <CustomerFeedbackForm />

        {/* Danh sách góp ý đã gửi */}
        <section className="post-section" aria-labelledby="feedbacks-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Dữ liệu đã tiếp nhận</p>
              <h2 id="feedbacks-title">Các ý kiến đóng góp gần đây</h2>
            </div>
            <span className="post-total" aria-label={`${feedbacks.length} ý kiến`}>
              {feedbacks.length} góp ý
            </span>
          </div>
          <CustomerFeedbackList feedbacks={feedbacks} />
        </section>
      </div>
    </main>
  );
}
