import type { Metadata } from 'next'
import { RegisterForm } from '@/features/auth/register-form'

export const metadata: Metadata = {
  title: 'Create Account',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <RegisterForm />
    </div>
  )
}
