"use client";
import React, { useState, useEffect } from 'react';

interface Investment {
    _id: string;
    amount: number;
    planName: string;
    status: string;
    createdAt: string;
}

export default function InvestsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/deposits/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                // Filter deposits that were meant for a plan
                const filtered = data.data.filter((d: any) => d.planName && d.planName !== 'Manual Deposit');
                setInvestments(filtered);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchInvestments();
  }, []);

  return (
    <div className="space-y-6 pb-20 relative overflow-hidden">
      {/* Decorative wash */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5b5bd6]/10 blob -z-10 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-[24px] sm:text-[26px] font-semibold tracking-[-0.02em]">Active <span className="gradient-text">deployments</span></h1>
            <p className="text-[12px] sm:text-[13px] text-[#86868b] mt-1">Tracking your mining node fleet</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
            <div className="text-center p-20 text-[#86868b] text-[14px] animate-pulse">Scanning network...</div>
        ) : investments.length === 0 ? (
            <div className="glass rounded-[28px] p-12 text-center">
                <div className="w-16 h-16 rounded-3xl bg-[#f5f5f7] border border-[#e6e6eb] flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                <h3 className="text-[18px] font-semibold tracking-tight mb-2">No active nodes</h3>
                <p className="text-[13px] text-[#86868b] mb-8">Deploy your first node to start mining</p>
                <a href="/plans" className="btn-primary inline-block px-8 py-3.5 font-medium text-[15px] rounded-xl">Go to plans</a>
            </div>
        ) : (
            investments.map((inv) => (
                <div key={inv._id} className="glass glass-hover rounded-[28px] p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#5b5bd6]/10 blob -mr-12 -mt-12 pointer-events-none"></div>

                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl ${inv.status === 'approved' ? 'bg-emerald-50 text-[#15a86b]' : 'bg-orange-50 text-orange-600'} flex items-center justify-center`}>
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {inv.status === 'approved' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    )}
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-[16px] font-semibold tracking-tight">{inv.planName}</h3>
                                <p className="text-[12px] text-[#86868b] mt-0.5">{new Date(inv.createdAt).toLocaleDateString()} • {inv.status}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-[12px] text-[#86868b] mb-1">Infrastructure cost</p>
                            <p className="text-[20px] font-semibold tracking-tight font-mono">${inv.amount}</p>
                        </div>
                    </div>

                    <div className="mt-6 h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${inv.status === 'approved' ? 'w-full' : 'w-1/3 animate-pulse'}`} style={{ background: 'linear-gradient(90deg, #5b5bd6, #7c5cdb)' }}></div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
