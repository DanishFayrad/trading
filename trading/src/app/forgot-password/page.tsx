"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/config';

type Step = 'email' | 'otp' | 'password' | 'done';

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const notify = (message: string, type: 'success' | 'error' = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const post = async (path: string, body: Record<string, unknown>) => {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/api/auth/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  // Step 1 — request the OTP
  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await post('forgot-password', { email });
      if (data.success) {
        notify('Code sent! Check your email.', 'success');
        setStep('otp');
      } else {
        notify(data.message || 'Could not send code');
      }
    } catch {
      notify('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 — verify the OTP
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return notify('Enter the 6-digit code');
    setIsLoading(true);
    try {
      const data = await post('verify-otp', { email, otp });
      if (data.success) {
        setStep('password');
      } else {
        notify(data.message || 'Invalid code');
      }
    } catch {
      notify('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3 — set the new password
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return notify('Password must be at least 6 characters');
    if (password !== confirmPassword) return notify('Passwords do not match');
    setIsLoading(true);
    try {
      const data = await post('reset-password', { email, otp, password });
      if (data.success) {
        setStep('done');
      } else {
        notify(data.message || 'Could not reset password');
      }
    } catch {
      notify('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setIsLoading(true);
    try {
      const data = await post('forgot-password', { email });
      notify(data.success ? 'A new code has been sent.' : (data.message || 'Could not resend'), data.success ? 'success' : 'error');
    } catch {
      notify('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClass = 'block w-full input-light rounded-xl px-4 py-3.5 text-[15px] font-medium';

  const spinner = (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const headings: Record<Step, { title: string; sub: string }> = {
    email: { title: 'Reset your password', sub: "Enter your email and we'll send you a code" },
    otp: { title: 'Enter the code', sub: `We sent a 6-digit code to ${email}` },
    password: { title: 'Set a new password', sub: 'Choose a strong password you’ll remember' },
    done: { title: 'Password updated', sub: 'You can now sign in with your new password' },
  };

  return (
    <div className="min-h-screen text-[#1d1d1f] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-5 sm:px-8 h-16 sticky top-0 z-30 bg-[#fbfbfd]/80 backdrop-blur-xl border-b border-[#e6e6eb]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5b5bd6] flex items-center justify-center">
            <img src="/logo.png" alt="primeinvestpro" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">prime<span className="gradient-text">invest</span>pro</span>
        </Link>
        <Link href="/login" className="text-[13px] font-medium text-[#5b5bd6] hover:text-[#4f46e5] transition-colors">
          Log in&nbsp;&rsaquo;
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px] animate-rise">
          <div className="text-center mb-8">
            <h1 className="text-[30px] font-semibold tracking-[-0.02em]">{headings[step].title}</h1>
            <p className="mt-1.5 text-[15px] text-[#6e6e73]">{headings[step].sub}</p>
          </div>

          <div className="glass rounded-3xl p-7 sm:p-8">
            {step === 'email' && (
              <form onSubmit={requestOtp} className="space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#515159] mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} placeholder="you@example.com" required />
                </div>
                <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 rounded-xl text-[15px] font-medium inline-flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed">
                  {isLoading ? spinner : (<>Send code<svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>)}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={verifyOtp} className="space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#515159] mb-2">6-digit code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className={`${fieldClass} text-center tracking-[0.5em] text-[20px] font-semibold`}
                    placeholder="••••••"
                    required
                  />
                </div>
                <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 rounded-xl text-[15px] font-medium inline-flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed">
                  {isLoading ? spinner : (<>Verify code<svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>)}
                </button>
                <div className="flex items-center justify-between text-[13px]">
                  <button type="button" onClick={() => setStep('email')} className="font-medium text-[#86868b] hover:text-[#1d1d1f]">Change email</button>
                  <button type="button" onClick={resendCode} disabled={isLoading} className="font-medium text-[#5b5bd6] hover:text-[#4f46e5] disabled:opacity-60">Resend code</button>
                </div>
              </form>
            )}

            {step === 'password' && (
              <form onSubmit={resetPassword} className="space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-[#515159] mb-2">New password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass} placeholder="••••••••••••" required />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#515159] mb-2">Confirm password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={fieldClass} placeholder="••••••••••••" required />
                </div>
                <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 rounded-xl text-[15px] font-medium inline-flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed">
                  {isLoading ? spinner : (<>Reset password<svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></>)}
                </button>
              </form>
            )}

            {step === 'done' && (
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#15a86b] flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <Link href="/login" className="btn-primary w-full py-3.5 rounded-xl text-[15px] font-medium inline-flex items-center justify-center gap-2 group">
                  Continue to sign in
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
            )}
          </div>

          {step !== 'done' && (
            <p className="mt-6 text-center text-[14px] text-[#6e6e73]">
              Remembered it?{' '}
              <Link href="/login" className="font-medium text-[#5b5bd6] hover:text-[#4f46e5]">Back to sign in</Link>
            </p>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-rise">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg border ${toast.type === 'success' ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#15a86b]' : 'bg-[#fef2f2] border-[#fecaca] text-[#ef4444]'}`}>
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            )}
            <span className="text-[14px] font-medium tracking-tight">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
