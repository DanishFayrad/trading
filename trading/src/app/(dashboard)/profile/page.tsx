"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="space-y-6 pb-20 relative">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5b5bd6]/10 blob pointer-events-none -z-10"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-[#7c5cdb]/8 blob pointer-events-none -z-10"></div>

      <div className="glass rounded-3xl p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5b5bd6]/10 blob -mr-32 -mt-32"></div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-[2rem] p-1 rotate-3 group-hover:rotate-0 transition-transform duration-500" style={{ background: 'linear-gradient(135deg,#5b5bd6,#7c5cdb)', boxShadow: '0 18px 44px -10px rgba(91,91,214,0.5)' }}>
                <div className="w-full h-full rounded-[1.8rem] glass-soft flex items-center justify-center text-4xl font-semibold gradient-text -rotate-3">
                {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
                </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#15a86b] border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
            </div>
          </div>

          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f] mb-1">{user?.firstName || 'User'} {user?.lastName || ''}</h1>
          <p className="text-[12px] sm:text-[13px] text-[#86868b] mb-6">{user.email}</p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full chip text-[12px] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#5b5bd6] glow-dot animate-pulse-soft"></span>
            {user.role} Member Status
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="glass-soft rounded-2xl p-5 text-center">
                <p className="text-[#86868b] text-[12px] mb-2">Security Hub</p>
                <p className="text-[#15a86b] font-semibold text-[13px] tracking-tight">Identity Verified</p>
            </div>
            <div className="glass-soft rounded-2xl p-5 text-center">
                <p className="text-[#86868b] text-[12px] mb-2">Network Age</p>
                <p className="text-[#1d1d1f] font-semibold text-[13px] tracking-tight">Established 2026</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {[
            { label: 'Account Terminal', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
            { label: 'Privacy Cryptography', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
            { label: 'KYC Verification', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
        ].map((item, i) => (
            <button key={i} className="w-full glass rounded-2xl p-3 flex items-center justify-between hover:bg-[#f5f5f7] transition-colors group">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#86868b] flex items-center justify-center group-hover:bg-[#eef0ff] group-hover:text-[#5b5bd6] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={item.icon}></path></svg>
                    </div>
                    <span className="font-medium text-[#1d1d1f] text-[14px] tracking-tight">{item.label}</span>
                </div>
                <svg className="w-4 h-4 text-[#c7c7cc] group-hover:text-[#5b5bd6] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
        ))}

        <button
            onClick={handleLogout}
            className="w-full glass rounded-2xl p-3.5 mt-6 flex items-center justify-center gap-2 text-red-600 font-medium hover:bg-red-50 transition-colors group"
        >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Deactivate Session
        </button>
      </div>
    </div>
  );
}
