"use client";
import React from 'react';
import Link from 'next/link';

const plans = [
    {
        name: "Bronze Node",
        price: 50,
        roi: "1.5% Daily",
        hash: "500 GH/s",
        duration: "30 Days",
        color: "from-orange-400 to-orange-600",
        shadow: "shadow-orange-200"
    },
    {
        name: "Silver Node",
        price: 200,
        roi: "2.5% Daily",
        hash: "2200 GH/s",
        duration: "45 Days",
        color: "from-slate-400 to-slate-600",
        shadow: "shadow-slate-200"
    },
    {
        name: "Gold Node",
        price: 500,
        roi: "3.5% Daily",
        hash: "6000 GH/s",
        duration: "60 Days",
        color: "from-yellow-400 to-yellow-600",
        shadow: "shadow-yellow-200"
    },
    {
        name: "Titan Node",
        price: 1500,
        roi: "5.0% Daily",
        hash: "20000 GH/s",
        duration: "90 Days",
        color: "from-blue-600 to-indigo-700",
        shadow: "shadow-blue-200"
    }
];

export default function PlansPage() {
  return (
    <div className="space-y-6 pb-20 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#5b5bd6]/10 blob pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7c5cdb]/8 blob pointer-events-none -z-10"></div>

      <div className="px-2">
        <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full chip text-[12px] font-medium mb-4">
                Scalable Infrastructure
            </div>
            <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">Mining <span className="gradient-text">Hardware</span></h1>
            <p className="text-[12px] sm:text-[13px] text-[#86868b] mt-1">Deploy high-performance nodes</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
            {plans.map((plan, i) => {
                const featured = plan.name === 'Titan Node';
                return (
                <div
                    key={i}
                    className={`${featured ? '' : 'glass glass-hover'} rounded-3xl p-8 relative overflow-hidden group transition-all duration-500`}
                    style={featured ? { background: 'linear-gradient(135deg,#5b5bd6,#7c5cdb)', boxShadow: '0 24px 60px -16px rgba(91,91,214,0.5)' } : undefined}
                >
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity ${featured ? 'bg-white/20' : 'bg-[#5b5bd6]/5 group-hover:bg-[#5b5bd6]/10'}`}></div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500 ${featured ? 'bg-white/20 text-white backdrop-blur-sm' : 'bg-[#eef0ff] text-[#5b5bd6]'}`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </div>
                            <div>
                                <h3 className={`text-[15px] font-semibold tracking-tight ${featured ? 'text-white' : 'text-[#1d1d1f]'}`}>{plan.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[12px] ${featured ? 'text-white/80' : 'text-[#5b5bd6]'}`}>{plan.roi} Yield</span>
                                    <span className={`w-1 h-1 rounded-full ${featured ? 'bg-white/40' : 'bg-[#d8d8df]'}`}></span>
                                    <span className={`text-[12px] ${featured ? 'text-white/70' : 'text-[#86868b]'}`}>{plan.duration} Cycle</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className={`text-[12px] mb-1 ${featured ? 'text-white/70' : 'text-[#86868b]'}`}>Price Point</p>
                                <p className={`text-[22px] font-semibold font-mono ${featured ? 'text-white' : 'text-[#1d1d1f]'}`}>${plan.price}</p>
                                <p className={`text-[12px] font-mono ${featured ? 'text-white/70' : 'text-[#86868b]'}`}>Rs {(plan.price * 278).toLocaleString()}</p>
                            </div>
                            <Link
                                href={`/deposit?amount=${plan.price * 278}&plan=${plan.name}`}
                                className={`px-8 py-3.5 font-medium rounded-xl transition-all duration-300 flex items-center gap-3 group/btn ${featured ? 'bg-white text-[#5b5bd6] hover:bg-white/90' : 'btn-primary'}`}
                            >
                                Deploy
                                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </Link>
                        </div>
                    </div>

                    <div className={`grid grid-cols-3 gap-4 mt-8 pt-8 border-t ${featured ? 'border-white/20' : 'border-[#e6e6eb]'}`}>
                        <div className="text-center">
                            <p className={`text-[12px] mb-1 ${featured ? 'text-white/70' : 'text-[#86868b]'}`}>Computing Power</p>
                            <p className={`text-[13px] font-semibold tracking-tight ${featured ? 'text-white' : 'text-[#1d1d1f]'}`}>{plan.hash}</p>
                        </div>
                        <div className={`text-center border-x ${featured ? 'border-white/20' : 'border-[#e6e6eb]'}`}>
                            <p className={`text-[12px] mb-1 ${featured ? 'text-white/70' : 'text-[#86868b]'}`}>Daily Accrual</p>
                            <p className={`text-[13px] font-semibold tracking-tight ${featured ? 'text-white' : 'text-[#5b5bd6]'}`}>~${(plan.price * parseFloat(plan.roi) / 100).toFixed(2)}</p>
                            <p className={`text-[11px] ${featured ? 'text-white/70' : 'text-[#86868b]'}`}>Rs {((plan.price * parseFloat(plan.roi) / 100) * 278).toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                            <p className={`text-[12px] mb-1 ${featured ? 'text-white/70' : 'text-[#86868b]'}`}>Node Status</p>
                            <div className="flex items-center justify-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${featured ? 'bg-white' : 'bg-[#15a86b]'}`}></div>
                                <p className={`text-[12px] ${featured ? 'text-white' : 'text-[#15a86b]'}`}>Optimized</p>
                            </div>
                        </div>
                    </div>
                </div>
                );
            })}
        </div>
      </div>
    </div>
  );
}
