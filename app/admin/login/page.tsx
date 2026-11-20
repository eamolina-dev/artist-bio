'use client'

import { useState } from 'react'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function LoginForm() {
  const searchParams = useSearchParams()
  const [isSignUp, setIsSignUp] = useState(() => searchParams.get('mode') === 'signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const cleanEmail = email.trim()

    if (isSignUp) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (data.session) {
        router.push('/admin')
        router.refresh()
      } else {
        setMessage('Account created. Check your email to confirm it, then sign in.')
        setIsSignUp(false)
        setLoading(false)
      }
    } else {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
      } else {
        router.push('/admin')
        router.refresh()
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#121316] text-[#e9e5df] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm border border-[#2a2d34] bg-[#18191c] p-6 rounded-lg space-y-6">
        <div>
          <h1 className="text-lg font-mono font-bold">
            {isSignUp ? 'CREATE ACCOUNT' : 'ADMIN LOGIN'}
          </h1>
          <p className="text-xs font-mono text-[#a0a0a0]">
            {isSignUp ? 'Create your artist page for free' : 'Sign in to your dashboard'}
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-300 text-xs font-mono p-3 rounded">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-950/40 border border-emerald-900/50 text-emerald-300 text-xs font-mono p-3 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-[#a0a0a0] mb-1">EMAIL</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-[#a0a0a0] mb-1">PASSWORD</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-2.5 rounded hover:bg-gray-200 transition cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading
              ? isSignUp
                ? 'Creating account...'
                : 'Signing in...'
              : isSignUp
                ? 'Create account'
                : 'Sign in'}
          </button>
        </form>

        <div className="border-t border-[#2a2d34] pt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
              setMessage(null)
            }}
            className="text-xs font-mono text-[#a0a0a0] hover:text-white transition cursor-pointer"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : 'New here? Create a free account'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#121316] text-[#e9e5df] flex items-center justify-center p-4 font-mono text-sm">
          Loading...
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
