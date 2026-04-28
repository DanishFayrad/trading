
import Link from 'next/link';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-[#0b101e] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[460px] bg-[#121624] border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
        <h1 className="text-2xl font-bold mb-2 text-center">Reset Password</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Enter your email to receive a password reset link.</p>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email Address</label>
            <input type="email" className="block w-full bg-[#1a1f33] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="you@example.com" />
          </div>
          <button className="w-full bg-gradient-to-r from-[#3ba2ff] to-[#8d49f7] text-white font-medium py-3.5 px-4 rounded-lg">Send Reset Link</button>
        </form>
        <div className="mt-6 text-center border-t border-white/5 pt-4">
          <Link href="/login" className="text-[#3ba2ff] text-sm">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
