"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setToast({ show: true, message: error.message || 'Login failed', type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
      } else if (data.session) {
        localStorage.setItem('token', data.session.access_token);
        const metadata = data.user?.user_metadata || {};
        const isAdmin = formData.email.toLowerCase() === 'admin60@primeinvestpro.com' || metadata.role === 'admin';
        localStorage.setItem('user', JSON.stringify({
          id: data.user?.id,
          email: data.user?.email,
          firstName: metadata.first_name || (isAdmin ? 'Admin' : ''),
          lastName: metadata.last_name || '',
          phone: metadata.phone || '',
          role: isAdmin ? 'admin' : (metadata.role || 'user')
        }));
        setToast({ show: true, message: 'Logged in successfully!', type: 'success' });
        setTimeout(() => {
          window.location.href = isAdmin ? '/admin' : '/dashboard';
        }, 1000);
      }
    } catch (error: unknown) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : 'An error occurred during login.';
      setToast({ show: true, message: errMsg, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClass =
    'block w-full input-light rounded-xl px-4 py-3.5 text-[15px] font-medium';

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
        <Link href="/register" className="text-[13px] font-medium text-[#5b5bd6] hover:text-[#4f46e5] transition-colors">
          Create account&nbsp;&rsaquo;
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px] animate-rise">
          <div className="text-center mb-8">
            <h1 className="text-[30px] font-semibold tracking-[-0.02em]">Welcome back</h1>
            <p className="mt-1.5 text-[15px] text-[#6e6e73]">Sign in to your account</p>
          </div>

          <div className="glass rounded-3xl p-7 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-[#515159] mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={fieldClass} placeholder="name@example.com" required />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[13px] font-medium text-[#515159]">Password</label>
                  <Link href="/forgot-password" className="text-[12px] font-medium text-[#5b5bd6] hover:text-[#4f46e5]">Forgot?</Link>
                </div>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className={fieldClass} placeholder="••••••••••••" required />
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 rounded-xl text-[15px] font-medium inline-flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    Sign in
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-[14px] text-[#6e6e73]">
            New to primeinvestpro?{' '}
            <Link href="/register" className="font-medium text-[#5b5bd6] hover:text-[#4f46e5]">Create an account</Link>
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-[12px] text-[#aeaeb5]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            256-bit AES encrypted &middot; Secure session
          </div>
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
