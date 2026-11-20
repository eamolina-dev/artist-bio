'use client'

import { useEffect, useState } from 'react'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function sanitizeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function LoginForm() {
  const searchParams = useSearchParams()
  const [isSignUp, setIsSignUp] = useState(() => searchParams.get('mode') === 'signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEditedManually, setSlugEditedManually] = useState(false)
  const [slugAvailability, setSlugAvailability] = useState<
    'idle' | 'checking' | 'available' | 'taken' | 'error'
  >('idle')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isSignUp || !slug) {
      setSlugAvailability('idle')
      return
    }

    let isCurrent = true
    setSlugAvailability('checking')
    const timeout = window.setTimeout(async () => {
      const { data, error: lookupError } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()

      if (!isCurrent) return
      setSlugAvailability(lookupError ? 'error' : data ? 'taken' : 'available')
    }, 300)

    return () => {
      isCurrent = false
      window.clearTimeout(timeout)
    }
  }, [isSignUp, slug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)

    const cleanEmail = email.trim()

    if (isSignUp) {
      const cleanName = name.trim()
      const cleanSlug = sanitizeSlug(slug)

      if (!cleanName || !cleanSlug) {
        setError('Enter your artist name and a valid page URL.')
        return
      }

      if (slugAvailability !== 'available') {
        setError(
          slugAvailability === 'taken'
            ? 'That page URL is already taken. Try another one.'
            : 'Wait until your page URL availability has been checked.',
        )
        return
      }

      setLoading(true)
      const { error: lookupError, data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', cleanSlug)
        .maybeSingle()

      if (lookupError) {
        setError('Could not check page URL availability. Please try again.')
        setLoading(false)
        return
      }

      if (existingProfile) {
        setSlugAvailability('taken')
        setError('That page URL is already taken. Try another one.')
        setLoading(false)
        return
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { name: cleanName, slug: cleanSlug },
          emailRedirectTo: `${window.location.origin}/admin/login`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      setMessage('Account created. Check your email to confirm it, then sign in.')
      setIsSignUp(false)
      setLoading(false)
    } else {
      setLoading(true)
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

  const slugStatusText = {
    idle: '',
    checking: 'Checking availability...',
    available: '✓ Available',
    taken: '✗ Already taken',
    error: 'Could not check availability.',
  }[slugAvailability]

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

          {isSignUp && (
            <>
              <div>
                <label className="block text-[#a0a0a0] mb-1">ARTIST NAME</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    const value = e.target.value
                    setName(value)
                    if (!slugEditedManually) {
                      const nextSlug = sanitizeSlug(value)
                      setSlug(nextSlug)
                      if (nextSlug !== slug) setSlugAvailability('checking')
                    }
                  }}
                  placeholder="e.g. Moli"
                  className="w-full bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[#a0a0a0] mb-1">YOUR PAGE URL</label>
                <div className="flex items-center bg-[#121316] border border-[#2a2d34] rounded px-3 py-2 focus-within:border-white">
                  <span className="text-[#606871] select-none">artist-bio/</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => {
                      setSlugEditedManually(true)
                      const nextSlug = sanitizeSlug(e.target.value)
                      setSlug(nextSlug)
                      if (nextSlug !== slug) setSlugAvailability('checking')
                    }}
                    placeholder="your-name"
                    aria-label="Page URL slug"
                    className="flex-1 bg-transparent text-white focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-[10px] text-[#606871]">
                  Your page: artist-bio/{slug || 'your-name'}
                </p>
                {slug && (
                  <p
                    aria-live="polite"
                    className={`mt-1 text-[10px] ${
                      slugAvailability === 'available'
                        ? 'text-emerald-400'
                        : slugAvailability === 'taken' || slugAvailability === 'error'
                          ? 'text-red-400'
                          : 'text-[#a0a0a0]'
                    }`}
                  >
                    {slugStatusText}
                  </p>
                )}
              </div>
            </>
          )}

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
            disabled={loading || (isSignUp && slugAvailability !== 'available')}
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
