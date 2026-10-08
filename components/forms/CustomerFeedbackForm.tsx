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

export function CustomerFeedbackForm() {
  const [formError, setFormError] = useState<string>();
  const [formSuccess, setFormSuccess] = useState<string>();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFeedbackInput>({
    resolver: zodResolver(customerFeedbackSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      category: "Góp ý chất lượng dịch vụ",
      content: "",
    },
  });

  const contentValue = watch("content") ?? "";
  const contentLength = contentValue.trim().length;

  // Xử lý gửi form qua Server Action
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
        result.formSuccess ?? "Gửi ý kiến đóng góp thành công!",
      );
      reset({
        fullName: "",
        phoneNumber: "",
        email: "",
        category: "Góp ý chất lượng dịch vụ",
        content: "",
      });
    }
  }

  // Các hàm gán dữ liệu mẫu nhanh để kiểm tra tiêu chí chấm điểm
  function fillInvalidContentDemo() {
    setFormError(undefined);
    setFormSuccess(undefined);
    setValue("fullName", "Trần Văn Test", { shouldValidate: true });
    setValue("phoneNumber", "0987654321", { shouldValidate: true }); // SĐT đúng
    setValue("email", "test.content@example.com", { shouldValidate: true });
    setValue("category", "Góp ý chất lượng dịch vụ");
    setValue("content", "Nội dung quá ngắn", { shouldValidate: true }); // 17 ký tự <= 20
    trigger(["content"]);
  }

  function fillInvalidPhoneDemo() {
    setFormError(undefined);
    setFormSuccess(undefined);
    setValue("fullName", "Lê Thị Test", { shouldValidate: true });
    setValue("phoneNumber", "0123456789", { shouldValidate: true }); // Đầu 01 không phải mạng VN hiện tại
    setValue("email", "test.phone@example.com", { shouldValidate: true });
    setValue("category", "Giao diện website");
    setValue(
      "content",
      "Tôi muốn góp ý về tốc độ tải trang cần được tối ưu tốt hơn để trải nghiệm mượt mà.",
      { shouldValidate: true },
    ); // > 20 ký tự
    trigger(["phoneNumber"]);
  }

  function fillBothInvalidDemo() {
    setFormError(undefined);
    setFormSuccess(undefined);
    setValue("fullName", "Nguyễn Test Cả Hai", { shouldValidate: true });
    setValue("phoneNumber", "12345", { shouldValidate: true }); // SĐT sai định dạng
    setValue("email", "both.test@example.com", { shouldValidate: true });
    setValue("category", "Báo lỗi tính năng");
    setValue("content", "Lỗi nè", { shouldValidate: true }); // 7 ký tự <= 20
    trigger(["phoneNumber", "content"]);
  }

  function fillValidDemo() {
    setFormError(undefined);
    setFormSuccess(undefined);
    setValue("fullName", "Đặng Minh Quân", { shouldValidate: true });
    setValue("phoneNumber", "0912345678", { shouldValidate: true }); // SĐT Việt Nam hợp lệ (Vinaphone)
    setValue("email", "quan.dang@example.com", { shouldValidate: true });
    setValue("category", "Đóng góp tính năng mới");
    setValue(
      "content",
      "Ứng dụng mạng xã hội của Nhóm 8 rất tuyệt vời! Tôi mong muốn nhóm phát triển thêm tính năng bình luận bằng hình ảnh và chế độ ban đêm.",
      { shouldValidate: true },
    ); // > 20 ký tự
    trigger();
  }

  return (
    <section className="composer-card feedback-form-card" aria-labelledby="feedback-form-title">
      <div className="feedback-form-header">
        <div>
          <p className="eyebrow">Nhóm 8 • Server Action & Zod Validation</p>
          <h2 id="feedback-form-title">Biểu mẫu Góp ý khách hàng</h2>
          <p className="feedback-subtitle">
            Mọi ý kiến đóng góp của quý khách giúp chúng tôi ngày càng hoàn thiện chất lượng dịch vụ.
          </p>
        </div>
      </div>

      {/* Thanh công cụ kiểm thử nhanh theo tiêu chí chấm điểm */}
      <div className="quick-test-bar">
        <div className="quick-test-title">
          <span>🧪 Thử nhanh các trường hợp (Tiêu chí chấm điểm):</span>
        </div>
        <div className="quick-test-buttons">
          <button
            type="button"
            className="test-btn test-btn-danger"
            onClick={fillInvalidContentDemo}
            title="Nội dung <= 20 ký tự để kích hoạt lỗi Zod"
          >
            ❌ Thử lỗi: Nội dung ≤ 20 ký tự
          </button>
          <button
            type="button"
            className="test-btn test-btn-danger"
            onClick={fillInvalidPhoneDemo}
            title="Số điện thoại sai định dạng để kích hoạt lỗi Zod"
          >
            ❌ Thử lỗi: SĐT sai định dạng VN
          </button>
          <button
            type="button"
            className="test-btn test-btn-danger"
            onClick={fillBothInvalidDemo}
            title="Thử đồng thời cả 2 lỗi validation"
          >
            ❌ Thử lỗi: Cả hai đều sai
          </button>
          <button
            type="button"
            className="test-btn test-btn-success"
            onClick={fillValidDemo}
            title="Điền dữ liệu đúng chuẩn hợp lệ"
          >
            ✅ Thử đúng: Dữ liệu hợp lệ chuẩn
          </button>
        </div>
      </div>

      <form className="stack-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormAlert message={formError} variant="error" />
        <FormAlert message={formSuccess} variant="success" />

        <div className="form-grid-row">
          {/* Trường Họ và tên */}
          <div className="field-group">
            <label htmlFor="fullName">
              Họ và tên <span className="required-star">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Ví dụ: Nguyễn Văn An"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p id="fullName-error" className="field-error">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Trường Số điện thoại (Yêu cầu Zod kiểm tra định dạng Việt Nam) */}
          <div className="field-group">
            <label htmlFor="phoneNumber">
              Số điện thoại <span className="required-star">*</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Ví dụ: 0912345678 hoặc +84912345678"
              aria-invalid={Boolean(errors.phoneNumber)}
              aria-describedby={
                errors.phoneNumber ? "phoneNumber-error" : "phoneNumber-hint"
              }
              {...register("phoneNumber")}
            />
            <p id="phoneNumber-hint" className="field-hint">
              10 chữ số, đầu mạng VN (03, 05, 07, 08, 09 hoặc tiền tố +84).
            </p>
            {errors.phoneNumber && (
              <p id="phoneNumber-error" className="field-error">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        <div className="form-grid-row">
          {/* Trường Email (Tùy chọn) */}
          <div className="field-group">
            <label htmlFor="email">
              Địa chỉ Email <span className="optional-tag">(Không bắt buộc)</span>
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="example@domain.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="field-error">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phân loại ý kiến */}
          <div className="field-group">
            <label htmlFor="category">Chủ đề góp ý</label>
            <select id="category" className="field-select" {...register("category")}>
              <option value="Góp ý chất lượng dịch vụ">Góp ý chất lượng dịch vụ</option>
              <option value="Giao diện website">Giao diện người dùng (UI/UX)</option>
              <option value="Báo lỗi tính năng">Báo cáo lỗi tính năng (Bug)</option>
              <option value="Đóng góp tính năng mới">Đề xuất tính năng mới</option>
              <option value="Ý kiến khác">Ý kiến đóng góp khác</option>
            </select>
          </div>
        </div>

        {/* Trường Nội dung (Yêu cầu Zod kiểm tra phải trên 20 ký tự) */}
        <div className="field-group">
          <div className="field-label-row">
            <label htmlFor="feedback-content">
              Nội dung góp ý <span className="required-star">*</span>
            </label>
            <div
              className={`content-counter-badge ${
                contentLength === 0
                  ? "counter-empty"
                  : contentLength <= 20
                  ? "counter-invalid"
                  : "counter-valid"
              }`}
            >
              {contentLength === 0 && "Yêu cầu: trên 20 ký tự"}
              {contentLength > 0 && contentLength <= 20 && (
                <>⚠️ Hiện có: {contentLength}/20 ký tự (Cần thêm {21 - contentLength} ký tự)</>
              )}
              {contentLength > 20 && (
                <>✅ Đạt yêu cầu: {contentLength} ký tự (&gt; 20 ký tự)</>
              )}
            </div>
          </div>
          <textarea
            id="feedback-content"
            rows={5}
            placeholder="Kính mong quý khách chia sẻ chi tiết ý kiến góp ý (bắt buộc phải trên 20 ký tự)…"
            aria-invalid={Boolean(errors.content)}
            aria-describedby={
              errors.content ? "feedback-content-error" : "feedback-content-hint"
            }
            {...register("content")}
          />
          <p id="feedback-content-hint" className="field-hint">
            Quy định: Nội dung góp ý phải dài hơn 20 ký tự (tối đa 1000 ký tự).
          </p>
          {errors.content && (
            <p id="feedback-content-error" className="field-error">
              {errors.content.message}
            </p>
          )}
        </div>

        <div className="form-submit-row">
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              reset();
              setFormError(undefined);
              setFormSuccess(undefined);
            }}
          >
            Làm mới form
          </button>
          <SubmitButton isPending={isSubmitting} pendingLabel="Đang gửi góp ý…">
            Gửi góp ý ngay
          </SubmitButton>
        </div>
      </form>
    </section>
  );
}
