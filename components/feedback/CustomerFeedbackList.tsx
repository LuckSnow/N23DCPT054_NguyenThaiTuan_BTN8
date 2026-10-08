import type { CustomerFeedbackRecord } from "@/lib/data/feedback";

type CustomerFeedbackListProps = {
  feedbacks: CustomerFeedbackRecord[];
};

export function CustomerFeedbackList({ feedbacks }: CustomerFeedbackListProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="ecom-empty-reviews">
        <span className="empty-icon">💬</span>
        <h3>Chưa có đánh giá nào gần đây</h3>
        <p>Hãy là khách hàng đầu tiên đóng góp ý kiến để nhận ưu đãi từ hệ thống!</p>
      </div>
    );
  }

  return (
    <div className="ecom-review-list">
      {feedbacks.map((fb) => (
        <article key={fb.id} className="ecom-review-card">
          <div className="ecom-review-top">
            <div className="ecom-customer-meta">
              <div className="ecom-avatar-badge">
                {fb.fullName.slice(0, 1).toUpperCase()}
              </div>
              <div className="ecom-customer-info">
                <div className="ecom-customer-name-row">
                  <h4 className="ecom-customer-name">{fb.fullName}</h4>
                  <span className="ecom-verified-tag">Đã xác thực ✓</span>
                </div>
                <div className="ecom-contact-sub">
                  <span className="ecom-tag-pill">📞 {fb.phoneNumber}</span>
                  {fb.email && <span className="ecom-tag-pill">✉️ {fb.email}</span>}
                </div>
              </div>
            </div>

            <div className="ecom-rating-col">
              <div className="ecom-stars-display" aria-label={`${fb.rating || 5} trên 5 sao`}>
                {"★".repeat(fb.rating || 5)}
                {"☆".repeat(5 - (fb.rating || 5))}
              </div>
              <time className="ecom-review-date">
                {new Date(fb.createdAt).toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </time>
            </div>
          </div>

          <div className="ecom-review-category">
            <span className="ecom-category-chip">{fb.category}</span>
          </div>

          <div className="ecom-review-content">
            <p>{fb.content}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
