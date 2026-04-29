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
      if (user.role === 'admin') {
        setIsAdmin(true);
      }
    }
  }, []);

  const bottomNavItems = [
    { name: 'Home', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    ...(!isAdmin ? [{ name: 'Deposit', path: '/deposit', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }] : []),
    ...(isAdmin ? [{ name: 'Admin', path: '/admin', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }] : []),
    { name: 'Logs', path: '/transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Menu', path: '/profile', icon: 'M4 6h16M4 12h16M4 18h16' }
  ];

  const themeClass = isAdmin ? 'bg-[#0a0a0a] text-orange-500' : 'bg-[#0f1423] text-white';
  const accentColor = isAdmin ? '#f97316' : '#3ba2ff';

  return (
    <div className={`min-h-screen ${isAdmin ? 'bg-[#050505]' : 'bg-[#0f1423]'} text-white flex flex-col font-sans relative pb-20 transition-colors duration-700`}>
      <header className={`h-16 flex items-center justify-between px-4 ${isAdmin ? 'bg-[#0a0a0a] border-b border-orange-500/10 shadow-[0_4px_20px_rgba(249,115,22,0.05)]' : 'bg-[#0f1423]'}`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 flex items-center justify-center ${isAdmin ? 'text-orange-500' : 'text-blue-500'}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>
          <span className={`text-xl font-bold tracking-tight ${isAdmin ? 'text-white' : 'text-[#3ba2ff]'}`}>
            {isAdmin ? 'Prime' : 'Prime'}<span className={isAdmin ? 'text-orange-500' : 'text-[#00e699]'}>{isAdmin ? 'Admin' : 'Invest'}</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className={`${isAdmin ? 'text-orange-500/50' : 'text-gray-400'} hover:text-white transition-colors`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
          <button 
            onClick={handleLogout}
            className={`${isAdmin ? 'text-orange-500/50 border-orange-500/30 hover:text-red-500 hover:border-red-500' : 'text-gray-400 border-gray-600 hover:text-red-500 hover:border-red-500'} border rounded-full p-1 transition-all`}
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto relative z-10 w-full max-w-3xl mx-auto p-4">
        {children}
      </main>

      <nav className={`fixed bottom-0 left-0 right-0 ${isAdmin ? 'bg-[#0a0a0a] border-t border-orange-500/10 shadow-[0_-4px_20px_rgba(249,115,22,0.05)]' : 'bg-[#121624] border-t border-white/5'} h-16 z-50 flex items-center justify-around px-2 pb-safe`}>
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.path || (pathname === '/' && item.path === '/dashboard');
          return (
            <Link key={item.name} href={item.path} className="flex flex-col items-center justify-center w-full h-full gap-1">
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? (isAdmin ? 'bg-orange-500/10 text-orange-500 scale-110' : 'bg-[#1a2b4c] text-[#3ba2ff] scale-110') : 'text-gray-500 hover:text-gray-300'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                </svg>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isActive ? (isAdmin ? 'text-orange-500' : 'text-[#3ba2ff]') : 'text-gray-500'}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
