"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const bottomNavItems = [
    { name: 'Home', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Deposit', path: '/deposit', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'Invest', path: '/plans', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
    { name: 'Logs', path: '/transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Menu', path: '/profile', icon: 'M4 6h16M4 12h16M4 18h16' }
  ];

  return (
    <div className="min-h-screen bg-[#0f1423] text-white flex flex-col font-sans relative pb-20">
      <header className="h-16 flex items-center justify-between px-4 bg-[#0f1423]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center text-blue-500">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#3ba2ff]">Prime<span className="text-[#00e699]">Invest</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
          <button className="text-gray-400 hover:text-white border border-gray-600 rounded-full p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </button>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto relative z-10 w-full max-w-3xl mx-auto p-4">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#121624] border-t border-white/5 h-16 z-50 flex items-center justify-around px-2 pb-safe">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.path || (pathname === '/' && item.path === '/dashboard');
          return (
            <Link key={item.name} href={item.path} className="flex flex-col items-center justify-center w-full h-full gap-1">
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-[#1a2b4c] text-[#3ba2ff]' : 'text-gray-400'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                </svg>
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-[#3ba2ff]' : 'text-gray-400'}`}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
