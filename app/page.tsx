import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#121316] text-[#e9e5df] flex items-center justify-center p-6 font-mono">
      <section className="w-full max-w-xl border border-[#2a2d34] bg-[#18191c] p-8 sm:p-12 rounded-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-[#a0a0a0]">ARTIST-BIO</p>
        <h1 className="mt-6 text-3xl sm:text-4xl font-bold leading-tight">
          Your home for independent music.
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#a0a0a0]">
          Bring your music, socials, and latest updates together on one page, ready to share.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/admin/login?mode=signup"
            className="rounded bg-white px-5 py-3 text-center text-sm font-bold text-black transition hover:bg-gray-200"
          >
            Create my page
          </Link>
          <Link
            href="/admin/login"
            className="rounded border border-[#3a3d44] px-5 py-3 text-center text-sm transition hover:border-white hover:text-white"
          >
            Sign in
          </Link>
        </div>

        <Link
          href="/moli"
          className="mt-8 inline-block text-xs text-[#a0a0a0] underline decoration-[#50535a] underline-offset-4 transition hover:text-white"
        >
          View demo profile (/moli)
        </Link>
      </section>
    </main>
  )
}
