'use server';

import { loginSchema } from '@/schemas/login-schema';

export async function handleLogin(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return { success: false, errors: result.error.errors };
  }

  const validData = result.data;

  return { success: true, data: validData, redirectTo: '/doctor' };
}
