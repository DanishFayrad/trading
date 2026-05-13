import Link from 'next/link';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen text-[#1d1d1f] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-5 sm:px-8 h-16 sticky top-0 z-30 bg-[#fbfbfd]/80 backdrop-blur-xl border-b border-[#e6e6eb]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5b5bd6] flex items-center justify-center">
            <img src="/logo.png" alt="theprimeinvestpro" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">theprime<span className="gradient-text">invest</span>pro</span>
        </Link>
        <Link href="/login" className="text-[13px] font-medium text-[#5b5bd6] hover:text-[#4f46e5] transition-colors">
          Log in&nbsp;&rsaquo;
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px] animate-rise">
          <div className="text-center mb-8">
            <h1 className="text-[30px] font-semibold tracking-[-0.02em]">Reset your password</h1>
            <p className="mt-1.5 text-[15px] text-[#6e6e73]">We&apos;ll email you a secure reset link</p>
          </div>

          <div className="glass rounded-3xl p-7 sm:p-8">
            <form className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-[#515159] mb-2">Email</label>
                <input type="email" className="block w-full input-light rounded-xl px-4 py-3.5 text-[15px] font-medium" placeholder="you@example.com" />
              </div>
              <button className="btn-primary w-full py-3.5 rounded-xl text-[15px] font-medium">Send reset link</button>
            </form>
          </div>

          <p className="mt-6 text-center text-[14px] text-[#6e6e73]">
            Remembered it?{' '}
            <Link href="/login" className="font-medium text-[#5b5bd6] hover:text-[#4f46e5]">Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
