'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function RegisterForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [referralCode, setReferralCode] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setReferralCode(ref);
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }

    const nameParts = formData.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || 'User';

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: formData.email,
          password: formData.password,
          referralCode
        }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToast({ show: true, message: 'User registered successfully!', type: 'success' });
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1500);
      } else {
        setToast({ show: true, message: data.message || 'Registration failed', type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
      }
    } catch (error) {
      console.error(error);
      setToast({ show: true, message: 'An error occurred during registration.', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    }
  };

  const fieldClass =
    'block w-full input-light rounded-xl px-4 py-3.5 text-[15px] font-medium';

  const stepMeta = [
    { n: 1, label: 'Profile' },
    { n: 2, label: 'Security' },
    { n: 3, label: 'Contact' },
  ];

  return (
    <div className="min-h-screen text-[#1d1d1f] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-5 sm:px-8 h-16 sticky top-0 z-30 bg-[#fbfbfd]/80 backdrop-blur-xl border-b border-[#e6e6eb]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5b5bd6] flex items-center justify-center">
            <img src="/logo.png" alt="primeinvestpro" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Prime<span className="gradient-text">invest</span>pro</span>
        </Link>
        <Link href="/login" className="text-[13px] font-medium text-[#5b5bd6] hover:text-[#4f46e5] transition-colors">
          Log in&nbsp;&rsaquo;
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px] animate-rise">
          <div className="text-center mb-7">
            <h1 className="text-[30px] font-semibold tracking-[-0.02em]">Create your account</h1>
            <p className="mt-1.5 text-[15px] text-[#6e6e73]">Set up your mining node in three steps</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-2.5 mb-7">
            {stepMeta.map((s, i) => (
              <React.Fragment key={s.n}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold transition-all ${step >= s.n ? 'bg-[#5b5bd6] text-white' : 'bg-[#ececf0] text-[#aeaeb5]'}`}>
                    {step > s.n ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    ) : s.n}
                  </div>
                  <span className={`text-[12px] font-medium ${step >= s.n ? 'text-[#1d1d1f]' : 'text-[#aeaeb5]'}`}>{s.label}</span>
                </div>
                {i < 2 && <div className={`w-6 h-px ${step > s.n ? 'bg-[#5b5bd6]' : 'bg-[#d8d8df]'}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="glass rounded-3xl p-7 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-[13px] font-medium text-[#515159] mb-2">Full legal name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={fieldClass} placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#515159] mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={fieldClass} placeholder="name@example.com" required />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-[13px] font-medium text-[#515159] mb-2">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className={fieldClass} placeholder="••••••••••••" required />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#515159] mb-2">Confirm password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={fieldClass} placeholder="••••••••••••" required />
                  </div>
                </>
              )}

              {step === 3 && (
                <div>
                  <label className="block text-[13px] font-medium text-[#515159] mb-2">Mobile number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={fieldClass} placeholder="+1 (555) 000-0000" required />
                </div>
              )}

              <div className="flex gap-3 pt-1">
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="btn-ghost w-1/3 py-3.5 rounded-xl text-[15px] font-medium">Back</button>
                )}
                <button type="submit" className={`btn-primary py-3.5 rounded-xl text-[15px] font-medium inline-flex items-center justify-center gap-2 group ${step === 1 ? 'w-full' : 'flex-1'}`}>
                  {step < 3 ? 'Continue' : 'Create account'}
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </form>
          </div>

          <p className="mt-6 text-center text-[14px] text-[#6e6e73]">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[#5b5bd6] hover:text-[#4f46e5]">Sign in</Link>
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-[12px] text-[#aeaeb5]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            256-bit AES encrypted &middot; Privacy shield active
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-rise">
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

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
