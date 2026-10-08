export type FormActionState = {
  status: "idle" | "error" | "success";
  fieldErrors?: Record<string, string[]>;
  formError?: string;
  formSuccess?: string;
};
