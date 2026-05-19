"use client";
import React, { useState, useEffect } from 'react';

interface Referral {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
}

interface Commission {
    _id: string;
    referredUser?: { firstName: string; lastName: string; email: string } | null;
    depositAmount: number;
    amount: number;
    percentage: number;
    status: 'credited' | 'reversed';
    createdAt: string;
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');
  const [balance, setBalance] = useState(0);
  const [earnedTotal, setEarnedTotal] = useState(0);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [successfulReferrals, setSuccessfulReferrals] = useState(0);
  const [referralsThreshold, setReferralsThreshold] = useState(10);
  const [fastWithdrawalEligible, setFastWithdrawalEligible] = useState(false);
  const [milestoneBonusGiven, setMilestoneBonusGiven] = useState(false);
  const [milestoneBonusAmount, setMilestoneBonusAmount] = useState(1000);

  useEffect(() => {
    setOrigin(window.location.origin);
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        setReferralCode(user.referralCode || 'NOT_FOUND');
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const authHeader = { 'Authorization': `Bearer ${token}` };

    const fetchAll = async () => {
        try {
            const [refRes, affRes] = await Promise.all([
                fetch(`${apiUrl}/api/auth/referrals`, { headers: authHeader }),
                fetch(`${apiUrl}/api/auth/affiliate`, { headers: authHeader }),
            ]);
            const refData = await refRes.json();
            const affData = await affRes.json();
            if (refData.success) setReferrals(refData.data);
            if (affData.success) {
                setBalance(affData.data.balance || 0);
                setEarnedTotal(affData.data.earnedTotal || 0);
                setCommissions(affData.data.commissions || []);
                setSuccessfulReferrals(affData.data.successfulReferrals || 0);
                setReferralsThreshold(affData.data.referralsThreshold || 10);
                setFastWithdrawalEligible(!!affData.data.fastWithdrawalEligible);
                setMilestoneBonusGiven(!!affData.data.milestoneBonusGiven);
                setMilestoneBonusAmount(affData.data.milestoneBonusAmount || 1000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchAll();
  }, []);

  const formatPKR = (n: number) => `Rs ${Math.round(n).toLocaleString()}`;

  const referralLink = referralCode !== 'NOT_FOUND' && referralCode !== '' && origin ? `${origin}/register?ref=${referralCode}` : 'Loading...';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5b5bd6]/10 blob pointer-events-none -z-10"></div>

      <div className="glass rounded-3xl p-8 sm:p-10 relative overflow-hidden animate-rise">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c5cdb]/8 blob -mr-32 -mt-32"></div>

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Affiliate <span className="gradient-text">network</span></h1>
          <p className="text-[12px] sm:text-[13px] text-[#86868b] mt-1.5">Earn commissions by growing your network</p>

          <div className="mt-8 glass-soft rounded-2xl p-6 sm:p-8 text-left">
              <p className="text-[12px] sm:text-[13px] text-[#86868b] mb-4">Your unique referral link</p>
              <div className="flex flex-col gap-4">
                  <div className="bg-[#f5f5f7] border border-[#e6e6eb] rounded-xl px-5 py-4 text-sm font-mono text-[#5b5bd6] break-all">
                      {referralLink}
                  </div>
                  <div className="flex gap-3">
                    <button
                        onClick={copyToClipboard}
                        className={`flex-1 py-3.5 font-medium text-[15px] rounded-xl flex items-center justify-center gap-2.5 transition-all ${copied ? 'bg-emerald-50 text-[#15a86b] border border-emerald-100' : 'btn-primary'}`}
                    >
                        {copied ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                Copy link
                            </>
                        )}
                    </button>
                    <button
                        onClick={async () => {
                            if (navigator.share) {
                                try {
                                    await navigator.share({
                                        title: 'Join me on Invest App',
                                        text: 'Use my referral link to join!',
                                        url: referralLink,
                                    });
                                } catch (err) {
                                    console.error('Error sharing:', err);
                                }
                            } else {
                                copyToClipboard();
                            }
                        }}
                        className="w-[52px] flex-shrink-0 bg-[#f5f5f7] hover:bg-[#eef0ff] text-[#86868b] hover:text-[#5b5bd6] rounded-xl flex items-center justify-center transition-all border border-[#e6e6eb]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    </button>
                  </div>
              </div>
          </div>
        </div>
      </div>

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
                          <>
                              Your VIP rank is active: you receive a 20% bonus per deposit and your withdrawals are processed within 6 hours instead of the standard 24 hours. {milestoneBonusGiven ? `Milestone bonus of Rs ${milestoneBonusAmount} credited.` : ''}
                              <span className="block mt-2 font-medium text-[14px] text-right font-sans" dir="rtl">
                                  آپ کا وی آئی پی رینک فعال ہے: آپ کو ہر ڈیپازٹ پر 20% بونس ملے گا اور آپ کے ودڈرال عام 24 گھنٹے کے بجائے 6 گھنٹے میں پروسیس ہوں گے۔ {milestoneBonusGiven ? `روپے ${milestoneBonusAmount} کا سنگ میل بونس کریڈٹ ہو چکا ہے۔` : ''}
                              </span>
                          </>
                      ) : (
                          <>
                              Invite {referralsThreshold} users who deposit to unlock exclusive partner benefits: earn a huge 20% bonus per deposit, and upgrade your withdrawal processing time to 6 hours instead of the standard 24 hours. One-time Rs {milestoneBonusAmount} bonus on reaching {referralsThreshold}.
                              <span className="block mt-2 font-medium text-[14px] text-right font-sans" dir="rtl">
                                  خصوصی پارٹنر فوائد حاصل کرنے کے لیے ایسے {referralsThreshold} صارفین کو دعوت دیں جو ڈیپازٹ کریں۔ ہر ڈیپازٹ پر 20% کا بڑا بونس حاصل کریں، اور اپنے ودڈرال کی پروسیسنگ کا وقت عام 24 گھنٹے سے اپ گریڈ کر کے صرف 6 گھنٹے کریں۔ {referralsThreshold} تک پہنچنے پر روپے {milestoneBonusAmount} کا یکمشت بونس۔
                              </span>
                          </>
                      )}
                  </p>
                  <div className="glass-soft rounded-2xl p-4 space-y-3 border border-white/40">
                      <div className="flex items-center justify-between text-[12px]">
                          <span className="font-semibold text-[#515159]">Rank progress</span>
                          <span className="font-mono font-bold text-[#5b5bd6]">{successfulReferrals} / {referralsThreshold} active referrals</span>
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

      <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-2xl p-5">
              <p className="text-[12px] text-[#86868b] font-medium">Affiliate balance</p>
              <p className="text-[22px] font-semibold tracking-tight mt-1 text-[#15a86b]">{formatPKR(balance)}</p>
              <p className="text-[11px] text-[#86868b] mt-1">Available to withdraw</p>
          </div>
          <div className="glass rounded-2xl p-5">
              <p className="text-[12px] text-[#86868b] font-medium">Total earned</p>
              <p className="text-[22px] font-semibold tracking-tight mt-1">{formatPKR(earnedTotal)}</p>
              <p className="text-[11px] text-[#86868b] mt-1">All-time commissions</p>
          </div>
      </div>

      <div className="glass rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold tracking-tight">Commission history</h3>
              <span className="chip px-2.5 py-1 rounded-full text-[12px] font-medium">20% per deposit</span>
          </div>
          <div className="space-y-1.5">
              {loading ? (
                  <div className="text-center p-8 text-[#86868b] text-[13px] animate-pulse">Loading...</div>
              ) : commissions.length === 0 ? (
                  <div className="text-center p-8 border border-dashed border-[#e6e6eb] rounded-2xl">
                      <p className="text-[#86868b] text-[13px]">No commissions yet. Share your link to start earning!</p>
                  </div>
              ) : (
                  commissions.map((c) => (
                      <div key={c._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f5f5f7] transition-colors">
                          <div>
                              <h4 className="text-[14px] font-medium tracking-tight">
                                  {c.referredUser ? `${c.referredUser.firstName} ${c.referredUser.lastName}` : 'Referred user'}
                              </h4>
                              <p className="text-[12px] text-[#86868b]">
                                  Deposit {formatPKR(c.depositAmount)} · {new Date(c.createdAt).toLocaleDateString()}
                              </p>
                          </div>
                          <div className="text-right">
                              <p className={`text-[14px] font-semibold ${c.status === 'credited' ? 'text-[#15a86b]' : 'text-[#ef4444] line-through'}`}>
                                  +{formatPKR(c.amount)}
                              </p>
                              <p className="text-[11px] text-[#86868b]">{c.status === 'credited' ? 'Credited' : 'Reversed'}</p>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>

      <div className="glass rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold tracking-tight">Network members</h3>
              <span className="chip px-2.5 py-1 rounded-full text-[12px] font-medium">
                  {referrals.length} members
              </span>
          </div>

          <div className="space-y-1.5">
              {loading ? (
                  <div className="text-center p-10 text-[#86868b] text-[13px] animate-pulse">Loading network...</div>
              ) : referrals.length === 0 ? (
                  <div className="text-center p-10 border border-dashed border-[#e6e6eb] rounded-2xl">
                      <p className="text-[#86868b] text-[13px]">No active referrals in your network yet</p>
                  </div>
              ) : (
                  referrals.map((ref) => (
                      <div key={ref._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f5f5f7] transition-colors group">
                          <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#86868b] flex items-center justify-center font-semibold text-sm group-hover:bg-[#eef0ff] group-hover:text-[#5b5bd6] transition-colors">
                                  {ref.firstName[0]}{ref.lastName[0]}
                              </div>
                              <div>
                                  <h4 className="text-[14px] font-medium tracking-tight">{ref.firstName} {ref.lastName}</h4>
                                  <p className="text-[12px] text-[#86868b]">{ref.email}</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-[11px] text-[#86868b]">Joined</p>
                              <p className="text-[12px] font-medium text-[#1d1d1f]">{new Date(ref.createdAt).toLocaleDateString()}</p>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </div>
    </div>
  );
}
