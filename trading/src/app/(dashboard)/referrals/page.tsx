"use client";
import React, { useState, useEffect } from 'react';

interface Referral {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        setReferralCode(user.referralCode || 'NOT_FOUND');
    }

    const fetchReferrals = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/auth/referrals`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setReferrals(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchReferrals();
  }, []);

  const baseUrl = process.env.NEXT_PUBLIC_LIVE_URL || 'https://invest-app-ab4f3840a6a6.herokuapp.com';
  const referralLink = referralCode !== 'NOT_FOUND' && referralCode !== '' ? `${baseUrl}/register?ref=${referralCode}` : 'Loading...';

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
