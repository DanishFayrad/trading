"use client";
import React, { useState, useEffect } from 'react';

interface PuzzleModalProps {
  planName: string;
  price: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PuzzleModal({ planName, price, onSuccess, onClose }: PuzzleModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  // Type of puzzle based on package
  // 1: 'slider' (Starter Node - Rs 300)
  // 2: 'math' (Bronze Node - Rs 750)
  // 3: 'sequence' (Silver Node - Rs 1500)
  // 4: 'color_pattern' (Gold Node - Rs 3000)
  // 5: 'pin' (Platinum / Diamond - Rs 6000, 12000)
  // 6: 'quantum' (Titan / Quantum / Apex - Rs 25000+)
  const puzzleType = 
    price <= 300 ? 'slider' :
    price <= 750 ? 'math' :
    price <= 1500 ? 'sequence' :
    price <= 3000 ? 'color_pattern' :
    price <= 12000 ? 'pin' : 'quantum';

  // --- 1. Slider State ---
  const [targetPos, setTargetPos] = useState(65);
  const [sliderVal, setSliderVal] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // --- 2. Math State ---
  const [mathProblem, setMathProblem] = useState({ q: '42 + 28', ans: 70, options: [60, 70, 72, 80] });

  // --- 3. Sequence State (Tap 1 -> 2 -> 3 -> 4) ---
  const [sequenceTargets, setSequenceTargets] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // --- 4. Color Pattern State ---
  const colorsList = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
  const [patternTarget, setPatternTarget] = useState<string[]>([]);
  const [userPattern, setUserPattern] = useState<string[]>([]);

  // --- 5. PIN Code State ---
  const [pinTarget, setPinTarget] = useState('7892');
  const [enteredPin, setEnteredPin] = useState('');

  // --- 6. Quantum Symbol State ---
  const glyphs = ['⚡', '💎', '🛡️', '🚀', '🔥', '⚙️'];
  const [targetGlyph, setTargetGlyph] = useState('⚡');
  const [shuffledGlyphs, setShuffledGlyphs] = useState<string[]>([]);

  useEffect(() => {
    // 1. Slider
    setTargetPos(Math.floor(Math.random() * 35) + 45);

    // 2. Math
    const num1 = Math.floor(Math.random() * 30) + 15;
    const num2 = Math.floor(Math.random() * 30) + 15;
    const correct = num1 + num2;
    const wrong1 = correct + 2;
    const wrong2 = correct - 4;
    const wrong3 = correct + 10;
    const opts = [correct, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
    setMathProblem({ q: `${num1} + ${num2}`, ans: correct, options: opts });

    // 3. Sequence
    const seq = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
    setSequenceTargets(seq);

    // 4. Color pattern
    const randColors = [
      colorsList[Math.floor(Math.random() * 4)],
      colorsList[Math.floor(Math.random() * 4)],
      colorsList[Math.floor(Math.random() * 4)]
    ];
    setPatternTarget(randColors);

    // 5. PIN
    const randomPin = String(Math.floor(1000 + Math.random() * 9000));
    setPinTarget(randomPin);

    // 6. Quantum
    const randomGlyph = glyphs[Math.floor(Math.random() * glyphs.length)];
    setTargetGlyph(randomGlyph);
    setShuffledGlyphs([...glyphs].sort(() => Math.random() - 0.5));
  }, [price]);

  const triggerSuccess = () => {
    setIsSuccess(true);
    setIsError(false);
    setTimeout(() => {
      onSuccess();
    }, 1100);
  };

  const triggerError = () => {
    setIsError(true);
    setTimeout(() => {
      setIsError(false);
      setSliderVal(0);
      setEnteredPin('');
      setUserPattern([]);
      setCurrentStep(0);
    }, 800);
  };

  // --- Handlers ---
  const handleSliderRelease = () => {
    if (isSuccess) return;
    setIsDragging(false);
    const diff = Math.abs(sliderVal - targetPos);
    if (diff <= 6) {
      triggerSuccess();
    } else {
      triggerError();
    }
  };

  const handleMathOption = (val: number) => {
    if (isSuccess) return;
    if (val === mathProblem.ans) {
      triggerSuccess();
    } else {
      triggerError();
    }
  };

  const handleSequenceClick = (num: number) => {
    if (isSuccess) return;
    if (num === currentStep + 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next === 4) {
        triggerSuccess();
      }
    } else {
      triggerError();
    }
  };

  const handleColorClick = (color: string) => {
    if (isSuccess) return;
    const nextArr = [...userPattern, color];
    setUserPattern(nextArr);
    if (nextArr[nextArr.length - 1] !== patternTarget[nextArr.length - 1]) {
      triggerError();
      return;
    }
    if (nextArr.length === patternTarget.length) {
      triggerSuccess();
    }
  };

  const handlePinDigit = (digit: string) => {
    if (isSuccess || enteredPin.length >= 4) return;
    const newPin = enteredPin + digit;
    setEnteredPin(newPin);
    if (newPin.length === 4) {
      if (newPin === pinTarget) {
        triggerSuccess();
      } else {
        triggerError();
      }
    }
  };

  const handleGlyphClick = (g: string) => {
    if (isSuccess) return;
    if (g === targetGlyph) {
      triggerSuccess();
    } else {
      triggerError();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-rise">
      <div className="bg-white rounded-[28px] p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-white/40 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#5b5bd6]/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#1d1d1f] tracking-tight">Security Verification</h3>
              <p className="text-[11px] text-[#86868b]">{planName} Deployment Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e6e6eb] text-[#86868b] flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Package Banner */}
        <div className="bg-[#f5f5f7] rounded-2xl p-3.5 mb-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#86868b] uppercase font-bold tracking-wider">Node Tier</span>
            <h4 className="text-[14px] font-bold text-[#1d1d1f]">{planName}</h4>
          </div>
          <span className="text-[15px] font-bold font-mono text-[#5b5bd6]">Rs {price.toLocaleString()}</span>
        </div>

        {/* ---------------- 1. SLIDER PUZZLE (Starter Node) ---------------- */}
        {puzzleType === 'slider' && (
          <div className="space-y-4">
            <div className="relative h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1e1b4b] to-[#4338ca] p-3 border border-indigo-900 shadow-inner flex flex-col justify-between select-none">
              <div className="relative z-10 flex items-center justify-between text-white/70 text-[11px] font-mono">
                <span>ALIGN_SLOT_KEY</span>
                <span className="text-emerald-400">TARGET: {targetPos}%</span>
              </div>
              <div className="relative h-16 w-full flex items-center">
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl border-2 border-dashed transition-all flex items-center justify-center ${
                    isSuccess ? 'border-emerald-400 bg-emerald-500/30' : 'border-white/60 bg-black/40'
                  }`}
                  style={{ left: `calc(${targetPos}% - 24px)` }}
                />
                <div
                  className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl shadow-xl flex items-center justify-center ${
                    isSuccess ? 'bg-emerald-500 text-white' : isError ? 'bg-red-500 text-white' : 'bg-gradient-to-tr from-[#6366f1] to-[#a855f7] text-white'
                  }`}
                  style={{ left: isSuccess ? `calc(${targetPos}% - 24px)` : `calc(${sliderVal}% - 24px)`, transition: isDragging ? 'none' : 'all 0.3s ease-out' }}
                >
                  {isSuccess ? '✓' : '⚡'}
                </div>
              </div>
              <p className="text-center text-[11px] text-white/80 font-medium">
                {isSuccess ? 'Node verified!' : isError ? 'Mismatch, try again' : 'Drag slider to fit target slot'}
              </p>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderVal}
              disabled={isSuccess}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              onMouseUp={handleSliderRelease}
              onTouchEnd={handleSliderRelease}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="w-full h-10 bg-[#f0f0f5] rounded-xl appearance-none cursor-grab outline-none accent-[#5b5bd6]"
            />
          </div>
        )}

        {/* ---------------- 2. MATH CALCULATION (Bronze Node) ---------------- */}
        {puzzleType === 'math' && (
          <div className="space-y-4 text-center">
            <div className="bg-gradient-to-br from-orange-950 to-orange-800 rounded-2xl p-5 border border-orange-700 shadow-inner">
              <span className="text-[11px] text-orange-200 uppercase font-mono">Quantum Hash Equation</span>
              <h2 className="text-[32px] font-extrabold text-white font-mono my-2">{mathProblem.q} = ?</h2>
              <p className="text-[12px] text-orange-200">Select the correct sum to authorize node</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {mathProblem.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleMathOption(opt)}
                  disabled={isSuccess}
                  className={`py-3.5 rounded-xl font-bold font-mono text-[16px] transition-all border ${
                    isSuccess && opt === mathProblem.ans
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-105'
                      : isError
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-white hover:bg-orange-50 text-[#1d1d1f] hover:text-orange-600 border-[#e6e6eb]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 3. SEQUENCE NUMBERS (Silver Node) ---------------- */}
        {puzzleType === 'sequence' && (
          <div className="space-y-4 text-center">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 border border-slate-700">
              <span className="text-[11px] text-slate-300 font-mono">Sequential Circuit Verification</span>
              <p className="text-[13px] text-white font-semibold mt-1">Tap numbers in order: <span className="text-emerald-400 font-mono">1 ➔ 2 ➔ 3 ➔ 4</span></p>
              <div className="flex justify-center gap-2 mt-3">
                {[1, 2, 3, 4].map((step) => (
                  <span
                    key={step}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      currentStep >= step ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {sequenceTargets.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleSequenceClick(num)}
                  disabled={isSuccess}
                  className={`py-4 rounded-2xl font-bold text-[20px] font-mono shadow-sm transition-all border ${
                    currentStep >= num
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-[#f5f5f7] hover:bg-indigo-50 text-[#1d1d1f] border-[#e6e6eb]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 4. COLOR PATTERN (Gold Node) ---------------- */}
        {puzzleType === 'color_pattern' && (
          <div className="space-y-4 text-center">
            <div className="bg-gradient-to-br from-yellow-950 to-amber-900 rounded-2xl p-4 border border-amber-700">
              <span className="text-[11px] text-amber-200 font-mono">Optical Color Key</span>
              <p className="text-[12px] text-amber-100 mt-1 mb-2">Replicate this 3-color sequence:</p>
              <div className="flex justify-center gap-2.5">
                {patternTarget.map((c, idx) => (
                  <div key={idx} className="w-8 h-8 rounded-full shadow-md border-2 border-white" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-1.5 h-6">
              {userPattern.map((c, i) => (
                <div key={i} className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {colorsList.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleColorClick(c)}
                  disabled={isSuccess}
                  className="h-12 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all border border-black/10"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 5. PIN SECURITY KEYPAD (Platinum / Diamond) ---------------- */}
        {puzzleType === 'pin' && (
          <div className="space-y-3 text-center">
            <div className="bg-gradient-to-br from-cyan-950 to-blue-900 rounded-2xl p-3.5 border border-cyan-800">
              <span className="text-[10px] text-cyan-300 font-mono">HARDWARE AUTH PIN</span>
              <h3 className="text-[20px] font-mono font-bold text-white tracking-widest mt-1">
                KEY: <span className="text-cyan-400 bg-black/40 px-2 py-0.5 rounded-lg">{pinTarget}</span>
              </h3>
            </div>
            <div className="bg-[#f5f5f7] rounded-xl py-2 px-4 flex justify-center gap-3 font-mono text-[18px] font-bold tracking-widest text-[#1d1d1f]">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center border ${enteredPin[i] ? 'bg-[#5b5bd6] text-white border-[#5b5bd6]' : 'bg-white border-[#e6e6eb]'}`}>
                  {enteredPin[i] || '•'}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {['1','2','3','4','5','6','7','8','9','C','0','⌫'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    if (k === 'C') setEnteredPin('');
                    else if (k === '⌫') setEnteredPin(prev => prev.slice(0, -1));
                    else handlePinDigit(k);
                  }}
                  className="py-2.5 rounded-xl font-bold font-mono bg-white hover:bg-gray-100 border border-[#e6e6eb] text-[#1d1d1f] text-[15px]"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- 6. QUANTUM GLYPH (Titan / Quantum / Apex) ---------------- */}
        {puzzleType === 'quantum' && (
          <div className="space-y-4 text-center">
            <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 rounded-2xl p-5 border border-purple-800 shadow-xl">
              <span className="text-[11px] text-purple-300 font-mono">QUANTUM APEX CIPHER</span>
              <p className="text-[13px] text-white mt-1">Tap the matching biometric glyph:</p>
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border-2 border-purple-400 mx-auto my-3 flex items-center justify-center text-[34px] shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-pulse">
                {targetGlyph}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {shuffledGlyphs.map((glyph, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleGlyphClick(glyph)}
                  disabled={isSuccess}
                  className="h-14 rounded-2xl bg-white hover:bg-purple-50 text-[26px] border border-[#e6e6eb] hover:border-purple-300 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                >
                  {glyph}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Success Footer Note */}
        {isSuccess && (
          <div className="mt-4 p-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-medium text-[12px] text-center flex items-center justify-center gap-1.5 animate-pulse">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            Verification Passed! Redirecting to deposit...
          </div>
        )}
      </div>
    </div>
  );
}
