import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0008] via-[#2a0010] to-[#0a0004]">
        <div className="w-12 h-12 border-4 border-white/30 border-t-[#C8102E] rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
