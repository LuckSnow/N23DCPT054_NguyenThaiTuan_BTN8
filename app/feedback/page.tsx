import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CustomerFeedbackForm } from "@/components/forms/CustomerFeedbackForm";
import { CustomerFeedbackList } from "@/components/feedback/CustomerFeedbackList";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { getCurrentUser } from "@/lib/auth/session";
import { getCustomerFeedbacks } from "@/lib/data/feedback";

export const metadata: Metadata = {
  title: "Đóng góp ý kiến & Đánh giá dịch vụ | Nexus",
  description: "Trung tâm tiếp nhận ý kiến đóng góp và đánh giá dịch vụ khách hàng của Nexus.",
};

export default async function FeedbackPage() {
  // Bắt buộc người dùng phải đăng nhập mới được truy cập trang góp ý
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const feedbacks = await getCustomerFeedbacks();

  return (
    <main className="feed-shell ecom-page-shell">
      {/* Header đồng bộ tài khoản người dùng */}
      <FeedHeader currentUser={currentUser} />

      <div className="ecom-container">
        {/* Breadcrumb điều hướng */}
        <nav className="ecom-breadcrumb" aria-label="Breadcrumb">
          <Link href="/feed">Bảng tin</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">Trung tâm Chăm sóc Khách hàng</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">Đóng góp ý kiến &amp; Đánh giá</span>
        </nav>

        {/* Hero Banner phong cách E-commerce */}
        <section className="ecom-hero-banner">
          <div className="ecom-hero-content">
            <span className="ecom-hero-pill">✨ Dịch vụ khách hàng chuyên nghiệp</span>
            <h1 className="ecom-hero-title">
              Trung Tâm Lắng Nghe &amp; Đóng Góp Ý Kiến
            </h1>
            <p className="ecom-hero-desc">
              Ý kiến của bạn là tài sản quý giá nhất giúp chúng tôi không ngừng cải tiến chất lượng
              sản phẩm, tốc độ phục vụ và trải nghiệm người dùng.
            </p>

            {/* Dải cam kết & chỉ số E-commerce */}
            <div className="ecom-trust-grid">
              <div className="ecom-trust-item">
                <span className="trust-icon">⚡</span>
                <div>
                  <strong>Phản hồi trong 24h</strong>
                  <small>Tiếp nhận &amp; xử lý kịp thời</small>
                </div>
              </div>
              <div className="ecom-trust-item">
                <span className="trust-icon">🛡️</span>
                <div>
                  <strong>Bảo mật 100%</strong>
                  <small>Thông tin liên hệ an toàn</small>
                </div>
              </div>
              <div className="ecom-trust-item">
                <span className="trust-icon">⭐</span>
                <div>
                  <strong>Đánh giá 4.9 / 5</strong>
                  <small>Từ hơn 10.000+ thành viên</small>
                </div>
              </div>
              <div className="ecom-trust-item">
                <span className="trust-icon">🎁</span>
                <div>
                  <strong>Ưu đãi thành viên</strong>
                  <small>Tích điểm tri ân khi gửi góp ý</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bố cục 2 cột chính chuẩn E-commerce */}
        <div className="ecom-layout-grid">
          {/* Cột trái: Form nhập liệu */}
          <div className="ecom-main-col">
            <CustomerFeedbackForm initialUsername={currentUser.username} />
          </div>

          {/* Cột phải: Thông tin hỗ trợ, Hotline, SLA và FAQ */}
          <aside className="ecom-sidebar-col">
            {/* Card hotline hỗ trợ */}
            <div className="ecom-side-card contact-card">
              <h3 className="side-card-title">Kênh Hỗ Trợ 24/7</h3>
              <p className="side-card-sub">
                Đội ngũ chăm sóc khách hàng luôn sẵn sàng giải đáp mọi thắc mắc của bạn:
              </p>
              <div className="contact-list">
                <div className="contact-item">
                  <span className="c-icon">📞</span>
                  <div>
                    <small>Tổng đài miễn cước</small>
                    <a href="tel:18006868" className="c-link">1800 6868</a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="c-icon">✉️</span>
                  <div>
                    <small>Email hỗ trợ chính thức</small>
                    <a href="mailto:support@nexus.vn" className="c-link">support@nexus.vn</a>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="c-icon">⏰</span>
                  <div>
                    <small>Thời gian làm việc</small>
                    <strong>08:00 – 22:00 (Hàng ngày)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Card quy trình xử lý */}
            <div className="ecom-side-card process-card">
              <h3 className="side-card-title">Quy Trình Xử Lý Phản Hồi</h3>
              <ul className="process-timeline">
                <li>
                  <span className="timeline-dot">1</span>
                  <div>
                    <strong>Tiếp nhận tức thời</strong>
                    <p>Hệ thống Server Action tự động lưu và gửi thông báo xác nhận.</p>
                  </div>
                </li>
                <li>
                  <span className="timeline-dot">2</span>
                  <div>
                    <strong>Phân loại chuyên sâu</strong>
                    <p>Chuyển giao cho bộ phận kỹ thuật / CSKH phụ trách chuyên môn.</p>
                  </div>
                </li>
                <li>
                  <span className="timeline-dot">3</span>
                  <div>
                    <strong>Phản hồi &amp; Cải tiến</strong>
                    <p>Liên hệ giải đáp và cập nhật tính năng trực tiếp trong các bản phát hành.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Card FAQ */}
            <div className="ecom-side-card faq-card">
              <h3 className="side-card-title">Câu Hỏi Thường Gặp</h3>
              <div className="faq-item">
                <strong>Tôi có được nhận thông báo khi có phản hồi không?</strong>
                <p>Có. Chuyên viên sẽ liên hệ lại qua Số điện thoại hoặc Email bạn cung cấp.</p>
              </div>
              <div className="faq-item">
                <strong>Tại sao cần nhập nội dung chi tiết?</strong>
                <p>Nội dung mô tả rõ ràng giúp đội ngũ nắm bắt chính xác vấn đề để xử lý nhanh nhất.</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Khu vực danh sách đánh giá từ khách hàng */}
        <section className="ecom-reviews-section" aria-labelledby="community-reviews-title">
          <div className="ecom-section-header">
            <div>
              <span className="section-pill">Cộng đồng thành viên</span>
              <h2 id="community-reviews-title" className="section-heading-title">
                Ý Kiến Đóng Góp &amp; Đánh Giá Gần Đây
              </h2>
              <p className="section-heading-sub">
                Những chia sẻ thực tế từ các khách hàng đã và đang đồng hành cùng Nexus.
              </p>
            </div>
            <div className="section-counter">
              <span>{feedbacks.length} phản hồi tiếp nhận</span>
            </div>
          </div>

          <CustomerFeedbackList feedbacks={feedbacks} />
        </section>
      </div>
    </main>
  );
}
