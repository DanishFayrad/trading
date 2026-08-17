"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PackageSlider from '@/components/PackageSlider';
import DailyTasks from '@/components/DailyTasks';

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
  const [activeTaskCount, setActiveTaskCount] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');
  const [successfulReferrals, setSuccessfulReferrals] = useState(0);
  const [referralsThreshold, setReferralsThreshold] = useState(10);
  const [fastWithdrawalEligible, setFastWithdrawalEligible] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const cacheKey = (userId: string) => `mining-stats-${userId}`;

  const fetchUserStats = async (userId?: string) => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUser = authData?.user;
      const uid = userId || currentUser?.id;
      if (!uid) return;

      const { data: depData, error } = await supabase
        .from('deposits')
        .select('*')
        .eq('user_id', uid);

      if (!error && depData) {
        // Start counter ONLY on approved deposits
        const validDeposits = depData.filter((d: any) => d.status === 'approved');
        const totalAmount = validDeposits.reduce((sum: number, d: any) => sum + (Number(d.amount) || 0), 0);
        const investedUsd = totalAmount / 278;
        setTotalInvested(investedUsd);

        if (totalAmount > 0) {
          setMiningActive(true);
          setActiveDeposits(validDeposits);
          localStorage.setItem(cacheKey(uid), JSON.stringify({
            totalInvested: investedUsd,
            activeDeposits: validDeposits
          }));
        } else {
          setMiningActive(false);
          setActiveDeposits([]);
          localStorage.removeItem(cacheKey(uid));
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    // ONLY start the live counter if deposit is approved AND at least 1 puzzle task is solved today!
    if (!miningActive || totalInvested <= 0 || activeTaskCount === 0) {
      if (activeTaskCount === 0) {
        setMiningDuration('00:00:00');
      }
      return;
    }

    // Rs 1 profit per $1 invested every 2 days. (USD↔PKR ≈ 278)
    const PKR_RATE = 278;
    const RATE_PER_DOLLAR_PER_SECOND = 1 / PKR_RATE / (2 * 86400);

    const now = Date.now();
    let earliestApprovedAt = now;
    let initialBalance = 0;
    activeDeposits.forEach(d => {
        const amountUsd = (Number(d.amount) || 0) / 278;
        const approvedAt = new Date(d.approved_at || d.updated_at || d.created_at || now).getTime();
        if (approvedAt < earliestApprovedAt) earliestApprovedAt = approvedAt;
        const elapsedSeconds = Math.max(0, (now - approvedAt) / 1000);
        initialBalance += amountUsd * RATE_PER_DOLLAR_PER_SECOND * elapsedSeconds;
    });

    // Power ratio based on calibrated daily nodes (1=20%, 2=40%, 3=60%, 4=80%, 5=100% full peak yield)
    const powerMultiplier = activeTaskCount / 5;

    // Set initial balance scaled by active nodes
    setBalance(initialBalance > 0 ? (initialBalance * powerMultiplier) : 0.0001);

    const formatDuration = (totalSec: number) => {
        const s = Math.max(0, totalSec);
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };
    setMiningDuration(formatDuration(Math.floor((now - earliestApprovedAt) / 1000)));

    // Smooth balance tick — runs dynamically once puzzle task is solved
    const smoothInterval = setInterval(() => {
        setBalance(prev => prev + (totalInvested * RATE_PER_DOLLAR_PER_SECOND * powerMultiplier) / 10);
    }, 100);

    // Duration recomputed from elapsed time
    const durationInterval = setInterval(() => {
        setMiningDuration(formatDuration(Math.floor((Date.now() - earliestApprovedAt) / 1000)));
    }, 1000);

    return () => {
        clearInterval(smoothInterval);
        clearInterval(durationInterval);
    };
  }, [miningActive, activeDeposits, totalInvested, activeTaskCount]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    let userObj: any = null;
    if (userStr) {
      try {
        userObj = JSON.parse(userStr);
      } catch {}
    }

    if (!userObj) {
      userObj = { role: 'user' };
    }

    // Auto-generate unique consistent referral code if missing
    if (!userObj.referralCode) {
      const code = userObj.id ? userObj.id.replace(/-/g, '').slice(0, 8).toUpperCase() : (userObj.email ? userObj.email.split('@')[0].toUpperCase() : 'PRIMEPRO');
      userObj.referralCode = code;
      localStorage.setItem('user', JSON.stringify(userObj));
    }
    setUser(userObj);

    if (userObj.role === 'admin' || userObj.email === 'admin60@primeinvestpro.com') {
      setIsAdmin(true);
      fetchAdminStats();
      return;
    }

    // Hydrate instantly from cache so invested/counter survive logout & reload
    const cached = localStorage.getItem(cacheKey(userObj.id));
    if (cached) {
      try {
        const c = JSON.parse(cached);
        if (c.activeDeposits?.length > 0) {
          setTotalInvested(c.totalInvested);
          setActiveDeposits(c.activeDeposits);
          setMiningActive(true);
        }
      } catch {}
    }

    fetchUserStats(userObj.id);
  }, []);

  const getUserReferralCode = (): string => {
    if (user?.referralCode) return user.referralCode;
    if (user?.id) return user.id.replace(/-/g, '').slice(0, 8).toUpperCase();
    if (user?.email) return user.email.split('@')[0].toUpperCase();
    return 'PRIMEPRO';
  };

  const userRefCode = getUserReferralCode();
  const currentOrigin = origin || (typeof window !== 'undefined' ? window.location.origin : 'https://theprimeinvestpro.com');
  const referralLink = `${currentOrigin}/register?ref=${userRefCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join primeinvestpro',
          text: `Join primeinvestpro with my referral link and earn daily AI investment yield!`,
          url: referralLink,
        });
      } catch (err) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const quickActions = [
    { name: 'Deposit', sub: 'Add funds', path: '/deposit', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { name: 'Invest', sub: 'AI plans', path: '/plans', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
    { name: 'Withdraw', sub: 'Cash out', path: '/withdrawal', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  const services = [
    { name: 'My investments', sub: 'Portfolio management', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', path: '/invests' },
    { name: 'Team network', sub: 'Referral analytics', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', path: '/referrals' },
    { name: 'Financial logs', sub: 'Transaction history', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', path: '/transactions' },
    { name: 'Rank system', sub: 'Performance levels', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', path: '/levels' },
    { name: 'Global news', sub: 'Market updates', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15', path: '/news' },
  ];

  return (
    <div className="space-y-5 pb-4">
      {isAdmin ? (
        <>
          {/* Admin overview */}
          <div className="glass rounded-3xl p-7 sm:p-8 relative overflow-hidden animate-rise">
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-orange-500/10 blob" />
            <div className="relative">
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h1 className="text-[24px] font-semibold tracking-[-0.02em]">Management overview</h1>
                  <p className="text-[14px] text-[#86868b] mt-1">System status & terminal</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="glass-soft rounded-2xl p-4">
                  <p className="text-[12px] text-[#86868b] mb-1">Total liquidity</p>
                  <h3 className="text-[22px] font-semibold tracking-tight">$0</h3>
                  <p className="text-[12px] text-[#86868b] mt-1">Rs 0</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[12px] text-[#86868b] font-medium">0%</span>
                  </div>
                </div>
                <div className="glass-soft rounded-2xl p-4">
                  <p className="text-[12px] text-[#86868b] mb-1">Pending actions</p>
                  <h3 className="text-[22px] font-semibold tracking-tight text-orange-600">{adminStats.pendingCount}</h3>
                  <p className="text-[12px] text-[#86868b] mt-1">Requires approval</p>
                </div>
              </div>

              <Link href="/admin" className="mt-5 w-full py-3.5 rounded-xl text-white font-medium text-[15px] flex items-center justify-center gap-2 group transition-all" style={{ background: '#ea580c', boxShadow: '0 8px 22px -8px rgba(234,88,12,0.5)' }}>
                Open approval terminal
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass glass-hover rounded-3xl p-6">
              <div className="w-10 h-10 rounded-xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h4 className="text-[15px] font-semibold tracking-tight mb-0.5">User growth</h4>
              <p className="text-[13px] text-[#86868b]">+48 this week</p>
            </div>
            <div className="glass glass-hover rounded-3xl p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15a86b] flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h4 className="text-[15px] font-semibold tracking-tight mb-0.5">Security</h4>
              <p className="text-[13px] text-[#15a86b]">Level 4 active</p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Live earnings */}
          <div className="glass rounded-[28px] p-8 sm:p-10 text-center relative overflow-hidden animate-rise">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-40 bg-[#5b5bd6]/12 blob" />
            <div className="relative">
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full chip text-[12px] font-medium mb-6 ${
                activeTaskCount === 5 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : activeTaskCount > 0 
                  ? 'bg-[#eef0ff] text-[#5b5bd6] border border-[#dadcff]' 
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  activeTaskCount === 5 ? 'bg-emerald-500 animate-pulse' : activeTaskCount > 0 ? 'bg-[#5b5bd6] animate-pulse-soft' : 'bg-amber-500'
                }`} />
                {miningActive ? (
                  activeTaskCount === 5 
                    ? '🔥 100% Peak Node Yield Active' 
                    : activeTaskCount > 0 
                    ? `⚡ ${activeTaskCount * 20}% Node Hashrate Active (${activeTaskCount}/5 Calibrated)`
                    : '⚠️ Standby Yield (Calibrate Nodes Below)'
                ) : (
                  'Engine Idle — Deposit to activate'
                )}
              </div>

              <p className="text-[13px] text-[#86868b] mb-2">Live balance accumulation</p>

              <div className="flex flex-col items-center justify-center mb-8">
                <div className="flex items-center justify-center">
                  <span className="text-[26px] font-semibold text-[#5b5bd6] self-start mt-2">$</span>
                  <h2 className={`text-[44px] sm:text-[56px] font-semibold tracking-tight font-mono transition-colors ${miningActive ? 'text-[#1d1d1f]' : 'text-[#c7c7cc]'}`}>
                    {balance.toFixed(6)}<span className="text-[#5b5bd6]/40">{balance.toFixed(8).slice(-2)}</span>
                  </h2>
                </div>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-[16px] font-medium text-[#15a86b] mr-1">Rs</span>
                  <h3 className={`text-[20px] sm:text-[24px] font-medium tracking-tight font-mono transition-colors ${miningActive ? 'text-[#1d1d1f]' : 'text-[#c7c7cc]'}`}>
                    {(balance * 278).toFixed(2)}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
                <div className="glass-soft rounded-2xl p-3 sm:p-4">
                  <p className="text-[11px] sm:text-[12px] text-[#86868b] mb-1">Total invested</p>
                  <p className={`text-[15px] sm:text-[18px] font-semibold font-mono ${miningActive ? 'text-[#15a86b]' : 'text-[#c7c7cc]'}`}>Rs {(totalInvested * 278).toFixed(0)}</p>
                  <p className="text-[10px] sm:text-[11px] text-[#86868b] mt-0.5 font-mono">${totalInvested.toFixed(2)}</p>
                </div>
                <div className="glass-soft rounded-2xl p-3 sm:p-4">
                  <p className="text-[11px] sm:text-[12px] text-[#86868b] mb-1">Active duration</p>
                  <p className={`text-[15px] sm:text-[18px] font-semibold font-mono ${miningActive ? 'text-[#1d1d1f]' : 'text-[#c7c7cc]'}`}>{miningDuration}</p>
                </div>
                <div className="glass-soft rounded-2xl p-3 sm:p-4">
                  <p className="text-[11px] sm:text-[12px] text-[#86868b] mb-1">Hash power</p>
                  <p className={`text-[15px] sm:text-[18px] font-semibold font-mono ${miningActive ? 'text-[#5b5bd6]' : 'text-[#c7c7cc]'}`}>
                    {totalInvested > 0 ? (totalInvested * 0.8 * (activeTaskCount > 0 ? activeTaskCount / 5 : 0.2)).toFixed(1) : '0.0'} GH/s
                  </p>
                  <p className="text-[10px] text-[#86868b] font-medium mt-0.5">{activeTaskCount}/5 Nodes Online</p>
                </div>
              </div>

              <Link 
                href={!miningActive ? '/deposit' : activeTaskCount === 0 ? '#daily-tasks' : '/invests'} 
                className={`group w-full flex items-center justify-center gap-2 font-medium text-[15px] py-3.5 rounded-xl transition-all ${
                  !miningActive 
                    ? 'btn-ghost' 
                    : activeTaskCount === 0 
                    ? 'bg-gradient-to-r from-[#5b5bd6] to-[#7c5cdb] text-white shadow-lg shadow-[#5b5bd6]/30 animate-pulse' 
                    : 'btn-primary'
                }`}
              >
                {!miningActive ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Start AI engine now
                  </>
                ) : activeTaskCount === 0 ? (
                  <>
                    <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    Solve Node Puzzle to Start Counter
                  </>
                ) : (
                  <>
                    View mining analytics
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </Link>
            </div>
          </div>

          {/* Daily Puzzle Tasks Section (5 Tasks every 24 hours) */}
          <DailyTasks 
            isDeposited={activeDeposits.length > 0 || totalInvested > 0} 
            userId={user?.id || user?.email || 'user'}
            onRewardClaim={(amount) => {
              setBalance(prev => prev + (amount / 278));
            }}
            onTasksChange={(count) => {
              setActiveTaskCount(count);
            }}
          />

          {/* Fast withdrawal notice */}
          <div className={`rounded-3xl p-6 border ${fastWithdrawalEligible ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200' : 'bg-gradient-to-br from-[#f8f9ff] to-[#eef0ff] border-[#dadcff]'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${fastWithdrawalEligible ? 'bg-white text-emerald-600' : 'bg-white text-[#5b5bd6]'}`}>
                <svg className="w-6 h-6 animate-pulse-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h3 className={`text-[15px] font-bold tracking-tight ${fastWithdrawalEligible ? 'text-emerald-800' : 'text-[#1d1d1f]'}`}>
                    {fastWithdrawalEligible ? 'Elite Rank Unlocked' : 'VIP Rank-up Promotion'}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${fastWithdrawalEligible ? 'bg-emerald-200 text-emerald-800' : 'bg-[#5b5bd6]/10 text-[#5b5bd6]'}`}>
                    {fastWithdrawalEligible ? '6h Withdrawals' : '20% Bonus + 6h ETA'}
                  </span>
                </div>
                
                <p className="text-[13px] text-[#4a4a50] leading-relaxed mb-4">
                  {fastWithdrawalEligible ? (
                    `Congratulations! You have invited ${successfulReferrals} active users who deposited. Your VIP rank is active: you receive a 20% bonus per deposit and your withdrawals are processed within 6 hours instead of the standard 24 hours.`
                  ) : (
                    `Invite ${referralsThreshold} users who deposit to unlock exclusive partner benefits: earn a huge 20% bonus per deposit, and upgrade your withdrawal processing time to 6 hours instead of the standard 24 hours.`
                  )}
                </p>

                <div className="glass-soft rounded-2xl p-4 space-y-3 border border-white/40">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-[#515159]">Rank progress</span>
                    <span className="font-mono font-bold text-[#5b5bd6]">{successfulReferrals} / {referralsThreshold} referrals</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/60 overflow-hidden relative shadow-inner">
                    <div className={`h-full transition-all duration-500 rounded-full ${fastWithdrawalEligible ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#5b5bd6] to-[#7c5cdb]'}`} style={{ width: `${Math.min(100, (successfulReferrals / referralsThreshold) * 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#86868b] pt-1">
                    <span>Standard Rank (24h approval)</span>
                    <span className="font-semibold text-[#5b5bd6]">Elite Rank (6h approval + 20% commission)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Referral card */}
          <div className="glass glass-hover rounded-3xl p-5 flex items-center justify-between gap-3 group">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-[14px] font-semibold tracking-tight">Referral link</h3>
                <p className="text-[12px] text-[#86868b] font-mono truncate">{referralLink}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={handleCopy} className={`w-9 h-9 rounded-lg transition-all flex items-center justify-center ${copied ? 'bg-emerald-50 text-[#15a86b] border-emerald-100' : 'text-[#86868b] hover:text-[#5b5bd6] bg-[#f5f5f7] hover:bg-[#eef0ff] border border-[#e6e6eb]'}`}>
                {copied ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </button>
              <button onClick={handleShare} className="btn-primary w-9 h-9 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((btn) => (
              <Link key={btn.name} href={btn.path} className="glass glass-hover rounded-2xl p-4 flex flex-col items-center justify-center text-center group">
                <div className="w-10 h-10 rounded-xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={btn.icon} /></svg>
                </div>
                <span className="text-[13px] font-semibold tracking-tight">{btn.name}</span>
                <span className="text-[11px] text-[#86868b]">{btn.sub}</span>
              </Link>
            ))}
          </div>

          {/* Investment packages slider */}
          <PackageSlider />
        </>
      )}

      {/* Services list */}
      <div className="glass rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold tracking-tight">Quick links</h3>
          <span className="text-[12px] text-[#86868b]">Active services</span>
        </div>

        <div className="space-y-1.5">
          {services.map((item) => (
            <Link key={item.name} href={item.path} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#86868b] flex items-center justify-center group-hover:bg-[#eef0ff] group-hover:text-[#5b5bd6] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={item.icon} /></svg>
                </div>
                <div>
                  <h4 className="text-[14px] font-medium tracking-tight">{item.name}</h4>
                  <p className="text-[12px] text-[#86868b]">{item.sub}</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-[#c7c7cc] group-hover:text-[#5b5bd6] group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
