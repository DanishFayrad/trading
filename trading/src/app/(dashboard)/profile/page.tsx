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
    <div className="space-y-6 pb-20">
      <div className="bg-gradient-to-br from-[#121624] to-[#0b101e] border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#3ba2ff]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#8d49f7]/5 rounded-full blur-3xl -ml-16 -mb-16"></div>
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#3ba2ff] to-[#8d49f7] p-1 mb-4 shadow-xl">
            <div className="w-full h-full rounded-full bg-[#0f1423] flex items-center justify-center text-3xl font-bold text-white">
              {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">{user?.firstName || 'User'} {user?.lastName || ''}</h1>
          <p className="text-gray-400 text-sm mb-2">{user.email}</p>
          <span className="bg-[#3ba2ff]/10 text-[#3ba2ff] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {user.role} Account
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Status</p>
                <p className="text-[#00e699] font-bold">Verified</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Member Since</p>
                <p className="text-white font-bold text-sm">April 2026</p>
            </div>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-[#121624] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-500/10 text-gray-400 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <span className="font-medium">Account Settings</span>
            </div>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>

        <button className="w-full bg-[#121624] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-red-400">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <span className="font-medium">Security & Privacy</span>
            </div>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>

        <button 
            onClick={handleLogout}
            className="w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mt-4 flex items-center justify-center gap-3 text-red-500 font-bold hover:bg-red-500/20 transition-all"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out
        </button>
      </div>
    </div>
  );
}