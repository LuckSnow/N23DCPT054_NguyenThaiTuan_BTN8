import type { CustomerFeedbackRecord } from "@/lib/data/feedback";

type CustomerFeedbackListProps = {
  feedbacks: CustomerFeedbackRecord[];
};

export function CustomerFeedbackList({ feedbacks }: CustomerFeedbackListProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="empty-state">
        <span aria-hidden="true">💬</span>
        <h2>Chưa có góp ý nào</h2>
        <p>Hãy là người đầu tiên gửi ý kiến đóng góp cho chúng tôi!</p>
      </div>
    );
  }

  return (
    <div className="feedback-list">
      {feedbacks.map((fb) => (
        <article key={fb.id} className="post-card feedback-item-card">
          <div className="feedback-item-header">
            <div className="feedback-author-info">
              <div className="avatar-placeholder" aria-hidden="true">
                {fb.fullName.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h3 className="feedback-author-name">{fb.fullName}</h3>
                <div className="feedback-meta-sub">
                  <span className="feedback-phone-tag">📞 {fb.phoneNumber}</span>
                  {fb.email && <span className="feedback-email-tag">✉️ {fb.email}</span>}
                </div>
              </div>
            </div>
            <div className="feedback-badge-col">
              <span className="feedback-category-badge">{fb.category}</span>
              <time className="feedback-time">
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
          <p className="post-content feedback-content-text">{fb.content}</p>
        </article>
      ))}
    </div>
  );
}
