"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { submitCustomerFeedbackAction } from "@/app/actions/feedback";
import { FormAlert } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  customerFeedbackSchema,
  type CustomerFeedbackInput,
} from "@/lib/validations/feedback";

const CATEGORIES = [
  { id: "Chất lượng sản phẩm & Dịch vụ", label: "Chất lượng sản phẩm & Dịch vụ", icon: "🛍️" },
  { id: "Trải nghiệm giao diện & Website", label: "Trải nghiệm giao diện & Web", icon: "🚀" },
  { id: "Thanh toán & Đơn hàng", label: "Thanh toán & Đơn hàng", icon: "💳" },
  { id: "Chăm sóc khách hàng & CSKH", label: "Chăm sóc khách hàng", icon: "🎧" },
  { id: "Đề xuất tính năng mới", label: "Đề xuất tính năng mới", icon: "💡" },
];

const RATING_LABELS: Record<number, string> = {
  5: "Tuyệt vời (5/5) — Rất hài lòng với dịch vụ",
  4: "Tốt (4/5) — Hài lòng",
  3: "Bình thường (3/5) — Cần cải thiện thêm",
  2: "Chưa hài lòng (2/5) — Trải nghiệm chưa tốt",
  1: "Rất thất vọng (1/5) — Cần khắc phục gấp",
};

type CustomerFeedbackFormProps = {
  initialUsername?: string;
};

export function CustomerFeedbackForm({ initialUsername = "" }: CustomerFeedbackFormProps) {
  const [formError, setFormError] = useState<string>();
  const [formSuccess, setFormSuccess] = useState<string>();
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFeedbackInput>({
    resolver: zodResolver(customerFeedbackSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: initialUsername || "",
      phoneNumber: "",
      email: "",
      category: "Chất lượng sản phẩm & Dịch vụ",
      rating: 5,
      content: "",
    },
  });

  const contentValue = watch("content") ?? "";
  const currentCategory = watch("category");
  const currentRating = watch("rating") || 5;
  const contentLength = contentValue.trim().length;

  async function onSubmit(values: CustomerFeedbackInput) {
    setFormError(undefined);
    setFormSuccess(undefined);

    const result = await submitCustomerFeedbackAction(values);

    if (result.status === "error") {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) {
            setError(field as keyof CustomerFeedbackInput, {
              type: "server",
              message: messages[0],
            });
          }
        }
      }
      setFormError(result.formError ?? "Đã xảy ra lỗi khi xác thực dữ liệu.");
    } else if (result.status === "success") {
      setFormSuccess(
        result.formSuccess ?? "Gửi ý kiến đóng góp thành công! Cảm ơn bạn.",
      );
      reset({
        fullName: initialUsername || "",
        phoneNumber: "",
        email: "",
        category: "Chất lượng sản phẩm & Dịch vụ",
        rating: 5,
        content: "",
      });
    }
  }

  const activeRating = hoverRating ?? currentRating;

  return (
    <section className="ecom-feedback-card" aria-labelledby="feedback-form-title">
      <div className="ecom-card-header">
        <div className="ecom-header-badge">
          <span>💬 Trực tiếp đến ban quản trị</span>
        </div>
        <h2 id="feedback-form-title" className="ecom-title">
          Gửi Đóng Góp Ý Kiến &amp; Đánh Giá
        </h2>
        <p className="ecom-subtitle">
          Ý kiến của bạn là động lực để chúng tôi nâng cao chất lượng dịch vụ mỗi ngày.
        </p>
      </div>

      <form className="ecom-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormAlert message={formError} variant="error" />
        <FormAlert message={formSuccess} variant="success" />

        {/* Đánh giá mức độ hài lòng (Star Rating) */}
        <div className="ecom-field-box">
          <label className="ecom-label">Mức độ hài lòng chung của bạn</label>
          <div className="ecom-rating-wrapper">
            <div className="ecom-stars" role="radiogroup" aria-label="Đánh giá sao">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`ecom-star-btn ${star <= activeRating ? "is-active" : ""}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setValue("rating", star, { shouldValidate: true })}
                  aria-label={`${star} sao`}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="ecom-rating-text">
              {RATING_LABELS[activeRating] || "Rất hài lòng"}
            </span>
          </div>
        </div>

        {/* Phân loại dịch vụ cần góp ý */}
        <div className="ecom-field-box">
          <label className="ecom-label">
            Chủ đề bạn muốn phản hồi <span className="ecom-required">*</span>
          </label>
          <div className="ecom-category-grid">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`ecom-cat-pill ${currentCategory === cat.id ? "is-selected" : ""}`}
                onClick={() => setValue("category", cat.id, { shouldValidate: true })}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-text">{cat.label}</span>
              </button>
            ))}
          </div>
          <input type="hidden" {...register("category")} />
        </div>

        {/* Thông tin liên hệ */}
        <div className="ecom-row-2">
          {/* Họ và tên */}
          <div className="ecom-field-group">
            <label htmlFor="fullName" className="ecom-label">
              Họ và tên của bạn <span className="ecom-required">*</span>
            </label>
            <div className="ecom-input-container">
              <span className="ecom-input-prefix">👤</span>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                className="ecom-input"
                placeholder="Nhập họ và tên đầy đủ"
                aria-invalid={Boolean(errors.fullName)}
                {...register("fullName")}
              />
            </div>
            {errors.fullName && (
              <p className="ecom-field-error">{errors.fullName.message}</p>
            )}
          </div>

          {/* Số điện thoại */}
          <div className="ecom-field-group">
            <label htmlFor="phoneNumber" className="ecom-label">
              Số điện thoại liên hệ <span className="ecom-required">*</span>
            </label>
            <div className="ecom-input-container">
              <span className="ecom-input-prefix">🇻🇳</span>
              <input
                id="phoneNumber"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="ecom-input"
                placeholder="0912 345 678"
                aria-invalid={Boolean(errors.phoneNumber)}
                {...register("phoneNumber")}
              />
            </div>
            <p className="ecom-field-hint">Đầu số mạng VN (03x, 05x, 07x, 08x, 09x hoặc +84).</p>
            {errors.phoneNumber && (
              <p className="ecom-field-error">{errors.phoneNumber.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="ecom-field-group">
          <label htmlFor="email" className="ecom-label">
            Địa chỉ Email nhận phản hồi <span className="ecom-optional">(Tùy chọn)</span>
          </label>
          <div className="ecom-input-container">
            <span className="ecom-input-prefix">✉️</span>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className="ecom-input"
              placeholder="email@example.com (nhận thông báo kết quả xử lý)"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="ecom-field-error">{errors.email.message}</p>
          )}
        </div>

        {/* Nội dung góp ý */}
        <div className="ecom-field-group">
          <div className="ecom-label-row">
            <label htmlFor="feedback-content" className="ecom-label">
              Nội dung góp ý chi tiết <span className="ecom-required">*</span>
            </label>
            <span className={`ecom-char-counter ${contentLength > 20 ? "is-valid" : ""}`}>
              {contentLength}/20 ký tự tối thiểu
            </span>
          </div>

          <div className="ecom-textarea-container">
            <textarea
              id="feedback-content"
              rows={5}
              className="ecom-textarea"
              placeholder="Chia sẻ chi tiết trải nghiệm của bạn hoặc những điều bạn mong muốn chúng tôi cải tiến (yêu cầu trên 20 ký tự để chuyên viên CSKH hỗ trợ tốt nhất)…"
              aria-invalid={Boolean(errors.content)}
              {...register("content")}
            />
          </div>

          <div className="ecom-textarea-footer">
            <p className="ecom-field-hint">
              * Nội dung chi tiết trên 20 ký tự giúp chúng tôi hiểu rõ và giải quyết vấn đề nhanh nhất.
            </p>
          </div>
          {errors.content && (
            <p className="ecom-field-error">{errors.content.message}</p>
          )}
        </div>

        {/* Action bar */}
        <div className="ecom-submit-bar">
          <button
            type="button"
            className="ecom-btn-secondary"
            onClick={() => {
              reset({
                fullName: initialUsername || "",
                phoneNumber: "",
                email: "",
                category: "Chất lượng sản phẩm & Dịch vụ",
                rating: 5,
                content: "",
              });
              setFormError(undefined);
              setFormSuccess(undefined);
            }}
          >
            Làm mới
          </button>
          <SubmitButton
            isPending={isSubmitting}
            pendingLabel="Đang gửi phản hồi…"
            className="ecom-btn-primary"
          >
            🚀 Gửi Đóng Góp Ý Kiến
          </SubmitButton>
        </div>
      </form>
    </section>
  );
}
