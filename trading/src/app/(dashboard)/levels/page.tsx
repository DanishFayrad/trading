"use client";
import React from 'react';

const levels = [
    {
        tier: "Level 1",
        rank: "Bronze Partner",
        required: "$0 - $500",
        requiredPkr: "Rs 0 - Rs 139,000",
        bonus: "5% Direct",
        color: "from-orange-400 to-orange-600",
        perks: ["Standard Support", "Basic Analytics", "Daily Payouts"]
    },
    {
        tier: "Level 2",
        rank: "Silver Elite",
        required: "$501 - $2500",
        requiredPkr: "Rs 139,278 - Rs 695,000",
        bonus: "8% Direct + 2% Team",
        color: "from-slate-400 to-slate-600",
        perks: ["Priority Support", "Advanced Stats", "Instant Withdrawals"]
    },
    {
        tier: "Level 3",
        rank: "Gold Master",
        required: "$2501 - $10000",
        requiredPkr: "Rs 695,278 - Rs 2,780,000",
        bonus: "12% Direct + 5% Team",
        color: "from-yellow-400 to-yellow-600",
        perks: ["Dedicated Manager", "VIP Nodes", "0% Fee Cash-out"]
    },
    {
        tier: "Level 4",
        rank: "Platinum Legend",
        required: "$10000+",
        requiredPkr: "Rs 2,780,000+",
        bonus: "15% Direct + 10% Team",
        color: "from-blue-600 to-indigo-700",
        perks: ["Elite Governance", "Custom Hardware", "Profit Sharing"]
    }
];

export default function LevelsPage() {
  return (
    <div className="space-y-6 pb-20 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5b5bd6]/10 blob pointer-events-none -z-10"></div>

      <div className="text-center mb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full chip text-[12px] font-medium mb-4">
            Network hierarchy
        </div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Partner <span className="gradient-text">levels</span></h1>
        <p className="text-[12px] sm:text-[13px] text-[#86868b] mt-1">Scale your influence and rewards</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
          {levels.map((lvl, i) => {
              const achieved = i === 0;
              return (
              <div key={i} className={`glass glass-hover rounded-3xl p-6 sm:p-7 relative overflow-hidden group ${achieved ? '' : 'opacity-70'}`}>
                  <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                      <div className="flex items-start gap-4 sm:gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-semibold text-lg flex-shrink-0 ${achieved ? 'bg-emerald-50 text-[#15a86b]' : 'bg-[#f5f5f7] text-[#aeaeb5]'}`}>
                              <span>{i + 1}</span>
                          </div>
                          <div>
                              <span className={`text-[12px] mb-1 block ${achieved ? 'text-[#5b5bd6]' : 'text-[#86868b]'}`}>{lvl.tier}</span>
                              <h3 className="text-[15px] font-semibold tracking-tight mb-2">{lvl.rank}</h3>
                              <div className="flex flex-wrap gap-2">
                                  {lvl.perks.map((perk, j) => (
                                      <span key={j} className="px-2.5 py-0.5 bg-[#f5f5f7] text-[#86868b] text-[11px] font-medium rounded-full border border-[#e6e6eb]">
                                          {perk}
                                      </span>
                                  ))}
                              </div>
                          </div>
                      </div>

                      <div className="flex flex-col justify-center md:text-right min-w-[150px]">
                          <p className="text-[12px] text-[#86868b] mb-1">Incentive plan</p>
                          <p className="text-[15px] font-semibold gradient-text tracking-tight">{lvl.bonus}</p>
                          <p className="text-[12px] text-[#86868b] mt-1">Required: {lvl.required}</p>
                          <p className="text-[11px] font-mono text-[#86868b] mt-0.5">{lvl.requiredPkr}</p>
                      </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[#e6e6eb] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${achieved ? 'bg-[#15a86b] glow-dot animate-pulse-soft' : 'bg-[#d8d8df]'}`}></div>
                          <p className={`text-[12px] font-medium ${achieved ? 'text-[#15a86b]' : 'text-[#aeaeb5]'}`}>{achieved ? 'Currently active' : 'Growth opportunity'}</p>
                      </div>
                      <div className="w-24 h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${achieved ? 'w-full' : 'w-0'}`} style={{ background: 'linear-gradient(90deg,#5b5bd6,#7c5cdb)' }}></div>
                      </div>
                  </div>
              </div>
              );
          })}
      </div>
    </div>
  );
}
