"use client";
import { useRef } from 'react';
import Link from 'next/link';
import { plans, planReturns } from '@/data/plans';

const CUBE_ICON = "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9";

export default function PackageSlider() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Slide the strip sideways by ~one card per click.
  const slide = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 180, behavior: 'smooth' });
  };

  return (
    <div className="glass rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight">Investment packages</h3>
          <p className="text-[12px] text-[#86868b]">Earn up to 10% daily over 30 days</p>
        </div>
        <Link href="/plans" className="text-[12px] font-medium text-[#5b5bd6] flex items-center gap-1 hover:gap-1.5 transition-all shrink-0">
          View all
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>

      <div className="relative">
        <div ref={trackRef} className="flex gap-3 overflow-x-auto pb-2 px-1 snap-x scroll-smooth">
          {plans.map((plan) => {
            const { dailyPkr, totalPkr, dailyRoi } = planReturns(plan);
            return (
              <Link
                key={plan.name}
                href={`/deposit?amount=${plan.price}&plan=${encodeURIComponent(plan.name)}`}
                className="snap-start shrink-0 w-[165px] rounded-2xl border border-[#e6e6eb] bg-white p-4 hover:border-[#5b5bd6]/40 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={CUBE_ICON} /></svg>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#15a86b]">{dailyRoi}%/day</span>
                </div>
                <h4 className="text-[13px] font-semibold tracking-tight truncate">{plan.name}</h4>
                <p className="text-[18px] font-semibold font-mono mt-0.5">Rs {plan.price.toLocaleString()}</p>
                <div className="mt-3 pt-3 border-t border-[#f0f0f3] space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#86868b]">Daily</span>
                    <span className="font-mono font-medium text-[#5b5bd6]">Rs {dailyPkr.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#86868b]">Total ({plan.duration}d)</span>
                    <span className="font-mono font-medium text-[#15a86b]">Rs {totalPkr.toLocaleString()}</span>
                  </div>
                </div>
                <span className="mt-3 w-full inline-flex items-center justify-center gap-1 py-2 rounded-lg bg-[#5b5bd6] text-white text-[12px] font-medium group-hover:bg-[#4a4ac4] transition-colors">Deploy</span>
              </Link>
            );
          })}
        </div>

        {/* Previous / Next slide buttons */}
        <button
          onClick={() => slide(-1)}
          aria-label="Previous"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 border border-[#e6e6eb] shadow-sm flex items-center justify-center text-[#5b5bd6] hover:bg-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={() => slide(1)}
          aria-label="Next"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 border border-[#e6e6eb] shadow-sm flex items-center justify-center text-[#5b5bd6] hover:bg-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
