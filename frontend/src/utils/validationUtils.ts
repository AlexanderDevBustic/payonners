import type { Ref } from 'vue';

export const getErrorMessage = (field?: { $errors: Array<{ $message: string | Ref<string> }> }): string => {
  if (!field || !field.$errors || field.$errors.length === 0) return '';

  const firstError = field.$errors[0];
  const message = firstError.$message;

  return typeof message === 'string' ? message : message.value;
};