"use client";
import React, { useState, useEffect, useRef } from 'react';

interface PuzzleModalProps {
  planName: string;
  price: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PuzzleModal({ planName, price, onSuccess, onClose }: PuzzleModalProps) {
  // Target percentage where the puzzle fits (e.g. 72%)
  const [targetPos, setTargetPos] = useState(70);
  const [sliderVal, setSliderVal] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Generate random puzzle position between 45% and 80%
    const randomTarget = Math.floor(Math.random() * 35) + 45;
    setTargetPos(randomTarget);
  }, []);

  const handleSliderChange = (val: number) => {
    if (isSuccess) return;
    setSliderVal(val);
  };

  const handleRelease = () => {
    if (isSuccess) return;
    setIsDragging(false);
    // Check if slider is within +- 5% of targetPos
    const diff = Math.abs(sliderVal - targetPos);
    if (diff <= 6) {
      setIsSuccess(true);
      setIsError(false);
      setTimeout(() => {
        onSuccess();
      }, 1100);
    } else {
      setIsError(true);
      setTimeout(() => {
        setSliderVal(0);
        setIsError(false);
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-rise">
      <div className="bg-white rounded-[28px] p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-white/40 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#5b5bd6]/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#1d1d1f] tracking-tight">Security Verification</h3>
              <p className="text-[11px] text-[#86868b]">Solve puzzle to deploy {planName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e6e6eb] text-[#86868b] flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Package banner */}
        <div className="bg-[#f5f5f7] rounded-2xl p-3.5 mb-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#86868b] uppercase font-bold tracking-wider">Deploying Package</span>
            <h4 className="text-[14px] font-bold text-[#1d1d1f]">{planName}</h4>
          </div>
          <span className="text-[15px] font-bold font-mono text-[#5b5bd6]">Rs {price.toLocaleString()}</span>
        </div>

        {/* Puzzle Box Visual Area */}
        <div className="relative h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] p-3 mb-5 border border-indigo-900 shadow-inner flex flex-col justify-between select-none">
          {/* Futuristic grid background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:14px_14px]"></div>

          <div className="relative z-10 flex items-center justify-between text-white/70 text-[11px] font-mono">
            <span>NODE_SECURITY_PASS</span>
            <span className="text-emerald-400">TARGET: {targetPos}%</span>
          </div>

          {/* Puzzle track space */}
          <div className="relative h-20 w-full flex items-center">
            {/* Target slot hole (Slot) */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center ${
                isSuccess
                  ? 'border-emerald-400 bg-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.8)]'
                  : 'border-white/60 bg-black/40'
              }`}
              style={{ left: `calc(${targetPos}% - 28px)` }}
            >
              <div className="w-5 h-5 rounded-lg border border-white/40 bg-white/10"></div>
            </div>

            {/* Sliding puzzle piece */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all ${
                isSuccess
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white scale-105 shadow-[0_0_25px_rgba(52,211,153,1)]'
                  : isError
                  ? 'bg-gradient-to-tr from-red-500 to-rose-400 text-white animate-shake'
                  : 'bg-gradient-to-tr from-[#6366f1] to-[#a855f7] text-white border-2 border-white/80'
              }`}
              style={{
                left: isSuccess ? `calc(${targetPos}% - 28px)` : `calc(${sliderVal}% - 28px)`,
                transition: isDragging ? 'none' : 'all 0.3s ease-out'
              }}
            >
              {isSuccess ? (
                <svg className="w-7 h-7 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
              )}
            </div>
          </div>

          <div className="relative z-10 text-center text-[12px] font-medium text-white/90">
            {isSuccess ? (
              <span className="text-emerald-300 font-bold flex items-center justify-center gap-1.5 animate-pulse">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                Node verified! Redirecting to deposit...
              </span>
            ) : isError ? (
              <span className="text-rose-300">Mismatch! Please align precisely.</span>
            ) : (
              <span>Drag slider to align the security key</span>
            )}
          </div>
        </div>

        {/* Interactive Slider Track */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              disabled={isSuccess}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              onMouseUp={handleRelease}
              onTouchEnd={handleRelease}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="w-full h-12 bg-[#f0f0f5] rounded-2xl appearance-none cursor-grab active:cursor-grabbing outline-none accent-[#5b5bd6] transition-all p-1"
              style={{
                background: `linear-gradient(to right, ${isSuccess ? '#10b981' : '#5b5bd6'} 0%, ${isSuccess ? '#10b981' : '#7c5cdb'} ${sliderVal}%, #eef0ff ${sliderVal}%, #eef0ff 100%)`
              }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-[#86868b] px-1 font-medium">
            <span>Slide to fit slot</span>
            <span>{isSuccess ? '100% Unlocked' : `${sliderVal}%`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
