"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

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
    
    // Split full name
    const nameParts = formData.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    // If user only provides one name, use it for both to satisfy backend validation
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || 'User';

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Registration successful!');
        window.location.href = '/login';
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b101e] text-white flex flex-col font-sans relative overflow-hidden" 
         style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center p-6 z-10 relative">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="w-8 h-8 flex items-center justify-center text-blue-500">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">PrimeInvest</span>
        </div>
        <Link href="/login" className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors text-sm font-medium">
          Login
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10 w-full relative">
        
        {/* Glow Effects */}
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Progress Stepper */}
        <div className="flex items-center gap-8 mb-10">
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-gradient-to-br from-blue-400 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] text-white' : 'bg-[#151928] text-gray-400 border border-white/10'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <span className={`text-xs ${step >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>Personal</span>
          </div>
          
          <div className="w-16 h-[1px] bg-white/10 mt-[-20px]"></div>
          
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-gradient-to-br from-blue-400 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] text-white' : 'bg-[#151928] text-gray-400 border border-white/10'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <span className={`text-xs ${step >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>Security</span>
          </div>

          <div className="w-16 h-[1px] bg-white/10 mt-[-20px]"></div>
          
          <div className="flex flex-col items-center gap-2 relative z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-gradient-to-br from-blue-400 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] text-white' : 'bg-[#151928] text-gray-400 border border-white/10'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </div>
            <span className={`text-xs ${step >= 3 ? 'text-blue-400' : 'text-gray-500'}`}>Contact</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-[460px] bg-[#121624] border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {step === 1 && "Personal Info"}
              {step === 2 && "Security Info"}
              {step === 3 && "Contact Info"}
            </h1>
            <p className="text-gray-400 text-sm">Step {step} of 3</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full pl-10 bg-[#1a1f33] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 bg-[#1a1f33] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 bg-[#1a1f33] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="Enter a secure password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 bg-[#1a1f33] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 bg-[#1a1f33] border border-transparent rounded-lg px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex gap-4">
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="w-1/3 bg-[#1a1f33] hover:bg-[#232a45] border border-transparent text-white font-medium py-3.5 px-4 rounded-lg transition-all duration-300"
                >
                  Back
                </button>
              )}
              <button 
                type="submit" 
                className={`flex-1 bg-gradient-to-r from-[#3ba2ff] to-[#8d49f7] hover:from-[#328ddf] hover:to-[#763dcf] text-white font-medium py-3.5 px-4 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(141,73,247,0.3)] flex items-center justify-center gap-2 ${step === 1 ? 'w-full' : ''}`}
              >
                {step < 3 ? 'Continue' : 'Create Account'}
                {step < 3 && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-[#3ba2ff] hover:text-[#5cb3ff] font-medium transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          Your data is secured with 256-bit encryption
        </div>

      </div>
    </div>
  );
}
