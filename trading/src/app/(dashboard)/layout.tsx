"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') setIsAdmin(true);
    }
  }, []);

  const bottomNavItems = [
    { name: 'Home', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    ...(!isAdmin ? [{ name: 'Deposit', path: '/deposit', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }] : []),
    ...(isAdmin ? [{ name: 'Admin', path: '/admin', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }] : []),
    { name: 'Logs', path: '/transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Levels', path: '/levels', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { name: 'Menu', path: '/profile', icon: 'M4 6h16M4 12h16M4 18h16' }
  ];

  const accent = isAdmin ? '#ea580c' : '#5b5bd6';
  const accentSoft = isAdmin ? 'bg-orange-50 text-orange-600' : 'bg-[#eef0ff] text-[#5b5bd6]';
  const accentText = isAdmin ? 'text-orange-600' : 'text-[#5b5bd6]';

  return (
    <div className="min-h-screen text-[#1d1d1f] flex flex-col font-sans pb-[72px]">
      {/* Header */}
      <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 sm:px-6 bg-[#fbfbfd]/80 backdrop-blur-xl border-b border-[#e6e6eb]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: accent }}>
            <img src="/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">
            {isAdmin ? <>theprime<span className={accentText}>admin</span>pro</> : <>theprime<span className={accentText}>invest</span>pro</>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[#86868b] hover:text-[#1d1d1f] transition-colors p-2 rounded-lg hover:bg-[#f5f5f7]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
          <button onClick={handleLogout} title="Log out" className="text-[#86868b] hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-[#f5f5f7]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative z-10 w-full max-w-3xl mx-auto p-4 sm:p-6">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-[72px] z-50 flex items-center justify-around px-2 bg-white/85 backdrop-blur-xl border-t border-[#e6e6eb]">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.path || (pathname === '/' && item.path === '/dashboard');
          return (
            <Link key={item.name} href={item.path} className="flex flex-col items-center justify-center w-full h-full gap-1">
              <div className={`px-3 py-1.5 rounded-full transition-all ${isActive ? accentSoft : 'text-[#aeaeb5]'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={item.icon} /></svg>
              </div>
              <span className={`text-[11px] font-medium transition-colors ${isActive ? accentText : 'text-[#aeaeb5]'}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
