"use server"

import { signIn } from '@/app/api/auth/[...nextauth]/route';
import { loginSchema } from '@/schemas/login-schema';

export async function handleLogin(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const result = loginSchema.safeParse(data);

  if (!result.success) {
    return { success: false, errors: result.error.errors };
  }

  const { dni, password } = result.data;

  const response = await signIn('credentials', {
    redirect: false,
    dni,
    password,
  });

  if (!response || !response.ok) {
    return { success: false, errors: [{ message: response?.error || 'Error al iniciar sesión' }] };
  }

  return { success: true, redirectTo: '/doctor' };
}
