"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [timeLeft, setTimeLeft] = useState('00 : 00 : 00');
  const [isInvested, setIsInvested] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState({ pendingCount: 0 });
  const [balance, setBalance] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [miningActive, setMiningActive] = useState(false);
  const [miningDuration, setMiningDuration] = useState('00:00:00');
  const [activeDeposits, setActiveDeposits] = useState<any[]>([]);

  const fetchUserStats = async () => {
    console.log("Fetching user stats...");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/deposits/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log("Stats received:", data);
      
      if (data.success) {
        const approvedDeposits = data.data.filter((d: any) => d.status === 'approved');
        const total = approvedDeposits.reduce((acc: number, d: any) => acc + (Number(d.amount) || 0), 0);
        setTotalInvested(total);
        
        if (total > 0) {
            setMiningActive(true);
            setActiveDeposits(approvedDeposits);
            return;
        }
      }
      
      // Fallback if no approved deposits or error
      startDemoMining();
      
    } catch (error) {
      console.error("Fetch error:", error);
      startDemoMining();
    }
  };

  const startDemoMining = () => {
    console.log("Starting demo mining...");
    setMiningActive(true);
    setTotalInvested(100);
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    setActiveDeposits([{ amount: 100, updatedAt: fiveMinsAgo }]);
  };

  useEffect(() => {
    if (!miningActive) return;

    // First, calculate the initial starting balance from past time
    let initialBalance = 0;
    const now = new Date().getTime();
    activeDeposits.forEach(d => {
        const amount = Number(d.amount) || 100;
        const approvedAt = new Date(d.updatedAt || new Date()).getTime();
        const elapsedSeconds = Math.max(0, (now - approvedAt) / 1000);
        initialBalance += amount * 0.0001 * elapsedSeconds;
    });
    setBalance(initialBalance);

    // Then, start a direct incrementing interval so it ALWAYS moves
    const interval = setInterval(() => {
        setBalance(prev => {
            const ratePerDollar = 0.000001; // Slower, more realistic
            const increment = (totalInvested || 100) * ratePerDollar; 
            return prev + increment;
        });

        setMiningDuration(prev => {
            const parts = prev.split(':').map(Number);
            let [h, m, s] = parts;
            s++;
            if (s >= 60) { s = 0; m++; }
            if (m >= 60) { m = 0; h++; }
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        });
    }, 1000); // Update every second

    // Sub-second smoother for visual effect
    const smoothInterval = setInterval(() => {
        setBalance(prev => {
            const ratePerDollar = 0.000001;
            const incrementPerTenth = (totalInvested || 100) * ratePerDollar / 10;
            return prev + incrementPerTenth;
        });
    }, 100);

    return () => {
        clearInterval(interval);
        clearInterval(smoothInterval);
    };
  }, [miningActive, activeDeposits, totalInvested]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') {
        setIsAdmin(true);
        fetchAdminStats();
      } else {
        fetchUserStats();
      }
    }
  }, []);

  const fetchAdminStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/deposits/admin`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const pending = data.data.filter((d: any) => d.status === 'pending').length;
        setAdminStats({ pendingCount: pending });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const investTime = localStorage.getItem('investmentTime');
      if (!investTime) {
        setIsInvested(false);
        return '00 : 00 : 00';
      }

      setIsInvested(true);
      const startTime = parseInt(investTime, 10);
      // 24 hours in milliseconds
      const cycleDuration = 24 * 60 * 60 * 1000;
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (elapsed >= cycleDuration) {
        // Cycle finished
        return '00 : 00 : 00';
      }

      const remaining = cycleDuration - elapsed;
      const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remaining / 1000 / 60) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 pb-4">
      {/* Admin Controls Section */}
      {isAdmin ? (
        <>
          {/* Admin Header Stats */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-orange-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Management <span className="text-orange-500">Core</span></h1>
                  <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mt-1">System Overview & Terminal</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/10">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-md">
                  <p className="text-gray-500 text-[10px] uppercase font-black mb-1 tracking-tighter">Total Liquidity</p>
                  <h3 className="text-2xl font-black text-white">$428,950</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5V10a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 11.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L10 10.586 13.586 7H12z" clipRule="evenodd"></path></svg>
                    <span className="text-[10px] text-emerald-500 font-bold">+12.5%</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-md">
                  <p className="text-gray-500 text-[10px] uppercase font-black mb-1 tracking-tighter">Pending Actions</p>
                  <h3 className="text-2xl font-black text-orange-500">{adminStats.pendingCount}</h3>
                  <p className="text-[10px] text-gray-500 font-bold mt-1">Requires Approval</p>
                </div>
              </div>

              <Link href="/admin" className="mt-6 w-full py-4 bg-orange-500 hover:bg-orange-600 text-[#0a0a0a] font-black uppercase tracking-tighter rounded-2xl transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 group">
                Access Approval Terminal
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>

          {/* Admin Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </div>
                <h4 className="font-bold text-white mb-1">User Growth</h4>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">+48 This Week</p>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h4 className="font-bold text-white mb-1">Security</h4>
                <p className="text-emerald-500 text-[10px] uppercase font-bold tracking-widest">Level 4 Active</p>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                Recent Log Events
            </h3>
            <div className="space-y-4">
                {[
                    { event: 'Database Backup', time: '12m ago', status: 'Success' },
                    { event: 'New Admin Login', time: '45m ago', status: 'Notice' },
                    { event: 'SSL Certificate', time: '2h ago', status: 'Verified' },
                ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                        <div>
                            <p className="text-sm font-medium text-gray-300">{log.event}</p>
                            <p className="text-[10px] text-gray-500">{log.time}</p>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 border border-white/10 px-2 py-1 rounded-md">{log.status}</span>
                    </div>
                ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Live Earnings Section */}
          <div className="bg-gradient-to-b from-[#161c2d] to-[#121624] border border-white/5 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className={`w-5 h-5 ${miningActive ? 'text-[#00e699] animate-spin' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
              <span className={`${miningActive ? 'text-[#00e699]' : 'text-gray-500'} font-medium`}>{miningActive ? 'Mining Active' : 'Mining Inactive'}</span>
            </div>
            <p className="text-gray-400 text-xs mb-1">Current Earnings</p>
            <h2 className={`text-4xl font-mono font-bold mb-4 ${miningActive ? 'text-white' : 'text-gray-600'}`}>
                ${balance.toFixed(8)}
            </h2>
            
            <div className={`inline-flex items-center gap-3 rounded-full px-4 py-2 border border-white/5 mb-6 ${miningActive ? 'bg-[#00e699]/10 border-[#00e699]/30 shadow-[0_0_10px_rgba(0,230,153,0.1)]' : 'bg-[#1a2035]'}`}>
              <svg className={`w-4 h-4 ${miningActive ? 'text-[#00e699] animate-pulse' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m9-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="text-xs text-gray-400">Duration:</span>
              <span className={`text-sm font-bold font-mono ${miningActive ? 'text-[#00e699]' : 'text-gray-500'}`}>{miningDuration}</span>
            </div>

            <Link href={miningActive ? "/dashboard" : "/deposit"} className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-xl shadow-lg transition-all ${miningActive ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 text-white' : 'bg-gray-700 text-gray-400'}`}>
              {miningActive ? (
                  <>
                    <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Mining in Progress
                  </>
              ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Deposit to Start Mining
                  </>
              )}
            </Link>
          </div>

          {/* Referral Link */}
          <div className="bg-[#161c2d] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#5b32a8]/30 flex items-center justify-center text-[#8c62ff]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-0.5">Your Referral Link</h3>
                <p className="text-[10px] text-gray-500 font-mono break-all line-clamp-1 max-w-[150px] sm:max-w-[200px]">https://primeinvest.com/register?ref=di1t5u6qhc</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-[#1e2740] rounded-lg text-[#3ba2ff] hover:bg-[#1e2740]/80">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </button>
              <button className="p-2 bg-[#00e699]/10 rounded-lg text-[#00e699] hover:bg-[#00e699]/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              </button>
            </div>
          </div>

          {/* Deposit & Earnings Split */}
          <div className="bg-[#161c2d] border border-white/5 rounded-2xl overflow-hidden flex divide-x divide-white/5 text-sm">
            <div className="flex-1 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Total Invested
              </div>
              <span className="font-bold text-white font-mono">${totalInvested.toFixed(2)}</span>
            </div>
            <div className="flex-1 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-[#00e699]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                Mining Profit
              </div>
              <span className="font-bold text-[#00e699] font-mono">+${balance.toFixed(4)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Link href="/deposit" className="bg-[#00bfff] rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3-3v8a3 3 0 003 3z"></path></svg>
              </div>
              <span className="font-bold text-white text-sm mb-0.5">Deposit</span>
              <span className="text-white/70 text-[10px]">Add funds</span>
            </Link>
            <Link href="/plans" className="bg-[#9b51e0] rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
              </div>
              <span className="font-bold text-white text-sm mb-0.5">Invest</span>
              <span className="text-white/70 text-[10px]">AI Plans</span>
            </Link>
            <Link href="/withdrawal" className="bg-[#00e699] rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <span className="font-bold text-white text-sm mb-0.5">Withdraw</span>
              <span className="text-white/70 text-[10px]">Cash out</span>
            </Link>
          </div>
        </>
      )}

      {/* Quick Access */}
      <div className="bg-[#121624] rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-[#3ba2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <h3 className="font-bold">Quick Access</h3>
        </div>
        
        <div className="flex flex-col">
          {[
            { name: 'Investments', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', path: '/invests' },
            { name: 'Referrals', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', path: '/referrals' },
            { name: 'Transactions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', path: '/transactions' },
            { name: 'Levels', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', path: '/levels' },
            { name: 'News', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15', path: '/news' },
            { name: 'Support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', path: '/support' },
          ].map((item, idx) => (
            <Link key={idx} href={item.path} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-[#1a2035] flex items-center justify-center border border-white/5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
                </div>
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}