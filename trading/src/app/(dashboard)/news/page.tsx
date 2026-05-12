"use client";
import React from 'react';

const newsItems = [
    {
        title: "Prime Invest Node V3.0 Deployed",
        date: "2026-04-30",
        category: "Network",
        content: "Our latest mining nodes are now active, providing 15% more efficiency across all titan deployments.",
        icon: "M13 10V3L4 14h7v7l9-11h-7z"
    },
    {
        title: "Global Payout System Optimized",
        date: "2026-04-28",
        category: "Finance",
        content: "Withdrawal processing times have been reduced to under 12 hours for all verified accounts.",
        icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
        title: "Affiliate Bonus Multiplier",
        date: "2026-04-25",
        category: "Promo",
        content: "Earn 2x rewards on all referrals this week as we celebrate our 1M milestone.",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    }
];

export default function NewsPage() {
  return (
    <div className="space-y-6 pb-20 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5b5bd6]/10 blob pointer-events-none -z-10"></div>

      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1h3a2 2 0 012 2v11a2 2 0 01-2 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 7h2a1 1 0 011 1v1m-6 3h6m-6 3h6m-6 3h6"></path></svg>
        </div>
        <div>
            <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Network <span className="gradient-text">broadcast</span></h1>
            <p className="text-[12px] sm:text-[13px] text-[#86868b]">Global infrastructure updates</p>
        </div>
      </div>

      <div className="space-y-4">
          {newsItems.map((news, i) => (
              <div key={i} className="glass glass-hover rounded-3xl p-6 sm:p-7 group">
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#f5f5f7] text-[#86868b] flex items-center justify-center group-hover:bg-[#eef0ff] group-hover:text-[#5b5bd6] transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={news.icon}></path></svg>
                          </div>
                          <div>
                              <span className="chip inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium">{news.category}</span>
                              <p className="text-[11px] text-[#86868b] mt-1">{news.date}</p>
                          </div>
                      </div>
                  </div>
                  <h3 className="text-[15px] font-semibold tracking-tight mb-2 leading-tight">{news.title}</h3>
                  <p className="text-[#515159] text-sm leading-relaxed">{news.content}</p>
              </div>
          ))}
      </div>
    </div>
  );
}
