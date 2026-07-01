export const toFormData = (fields: Record<string, string | Blob>): FormData => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  return formData;
};
