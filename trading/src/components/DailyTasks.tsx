"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PuzzleModal from './PuzzleModal';

interface DailyTasksProps {
  isDeposited: boolean;
  userId?: string;
  onRewardClaim?: (amount: number) => void;
  onTasksChange?: (completedCount: number) => void;
}

interface TaskItem {
  id: number;
  nodeName: string;
  title: string;
  desc: string;
  powerBonus: string;
  reward: number;
  type: string;
  icon: string;
  color: string;
  bg: string;
}

export default function DailyTasks({ isDeposited, userId = 'guest', onRewardClaim, onTasksChange }: DailyTasksProps) {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [timeLeft, setTimeLeft] = useState('24 : 00 : 00');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const storageKey = `daily_tasks_data_${userId}`;

  const tasksList: TaskItem[] = [
    {
      id: 0,
      nodeName: 'Alpha Node-01',
      title: 'Optical Security Calibration',
      desc: 'Synchronize optical AI connection frequency',
      powerBonus: '+20% Speed',
      reward: 20,
      type: 'slider',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      id: 1,
      nodeName: 'Beta Node-02',
      title: 'Quantum Math Decryption',
      desc: 'Verify decentralized transaction hashes',
      powerBonus: '+20% Speed',
      reward: 25,
      type: 'math',
      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      id: 2,
      nodeName: 'Gamma Node-03',
      title: 'Cipher Sequence Alignment',
      desc: 'Stream multi-tier blockchain ledger blocks',
      powerBonus: '+20% Speed',
      reward: 30,
      type: 'sequence',
      icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      id: 3,
      nodeName: 'Delta Node-04',
      title: 'Neural Matrix Tuning',
      desc: 'Match high-frequency arbitrage color matrices',
      powerBonus: '+20% Speed',
      reward: 35,
      type: 'color_pattern',
      icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
      color: 'text-pink-600',
      bg: 'bg-pink-50'
    },
    {
      id: 4,
      nodeName: 'Apex Master Node',
      title: 'Vault Security Verification',
      desc: 'Authenticate master PIN to unlock 100% peak yield',
      powerBonus: '+20% Speed',
      reward: 40,
      type: 'pin',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    }
  ];

  // Initialize and check 24-hour cycle
  useEffect(() => {
    const checkCycle = () => {
      const stored = localStorage.getItem(storageKey);
      const now = Date.now();
      const CYCLE_MS = 24 * 60 * 60 * 1000; // 24 hours

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const start = parsed.startTime || now;
          const elapsed = now - start;

          if (elapsed >= CYCLE_MS) {
            // 24 hours passed -> Reset all 5 tasks
            const freshData = { startTime: now, completed: [] };
            localStorage.setItem(storageKey, JSON.stringify(freshData));
            setCompletedTasks([]);
            if (onTasksChange) onTasksChange(0);
          } else {
            const list = parsed.completed || [];
            setCompletedTasks(list);
            if (onTasksChange) onTasksChange(list.length);
            const rem = CYCLE_MS - elapsed;
            const h = Math.floor(rem / (1000 * 60 * 60));
            const m = Math.floor((rem % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((rem % (1000 * 60)) / 1000);
            setTimeLeft(`${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`);
          }
        } catch {
          localStorage.setItem(storageKey, JSON.stringify({ startTime: now, completed: [] }));
        }
      } else {
        localStorage.setItem(storageKey, JSON.stringify({ startTime: now, completed: [] }));
      }
    };

    checkCycle();
    const interval = setInterval(checkCycle, 1000);
    return () => clearInterval(interval);
  }, [storageKey]);

  const handleTaskSuccess = () => {
    if (!activeTask) return;

    const newCompleted = [...completedTasks, activeTask.id];
    setCompletedTasks(newCompleted);
    if (onTasksChange) onTasksChange(newCompleted.length);

    const stored = localStorage.getItem(storageKey);
    let startTime = Date.now();
    if (stored) {
      try {
        startTime = JSON.parse(stored).startTime || startTime;
      } catch {}
    }
    localStorage.setItem(storageKey, JSON.stringify({ startTime, completed: newCompleted }));

    if (onRewardClaim) {
      onRewardClaim(activeTask.reward);
    }

    setToastMessage(`🚀 ${activeTask.nodeName} Calibrated! +${activeTask.powerBonus} Hashrate & +Rs ${activeTask.reward} unlocked.`);
    setTimeout(() => setToastMessage(null), 4000);
    setActiveTask(null);
  };

  const totalRewardsAvailable = tasksList.reduce((sum, t) => sum + t.reward, 0);
  const totalEarnedToday = completedTasks.reduce((sum, id) => {
    const task = tasksList.find(t => t.id === id);
    return sum + (task ? task.reward : 0);
  }, 0);

  return (
    <div className="glass rounded-[28px] p-6 sm:p-7 relative overflow-hidden border border-white/40 shadow-sm animate-rise">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#5b5bd6]/8 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20"></div>

      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] px-4 w-full max-w-md animate-rise">
          <div className="bg-[#f0fdf4]/95 border border-[#bbf7d0] text-[#15a86b] px-5 py-3.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 font-medium text-[14px]">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5b5bd6] to-[#7c5cdb] text-white flex items-center justify-center shadow-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[17px] font-bold tracking-tight text-[#1d1d1f] flex items-center gap-2">
              Daily Puzzle Tasks
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#5b5bd6]/10 text-[#5b5bd6]">
                5 Tasks / 24h
              </span>
            </h3>
            <p className="text-[12px] text-[#86868b]">Solve daily interactive puzzles to earn rewards</p>
          </div>
        </div>

        {/* 24h Countdown Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f5f5f7] border border-[#e6e6eb] text-[11px] font-mono text-[#515159]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[#86868b]">Reset:</span>
          <span className="font-bold text-[#1d1d1f]">{timeLeft}</span>
        </div>
      </div>

      {/* Progress & Earnings Bar */}
      <div className="glass-soft rounded-2xl p-4 mb-4 border border-white/60">
        <div className="flex items-center justify-between text-[13px] mb-2">
          <span className="text-[#515159] font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5b5bd6] animate-pulse"></span>
            AI Node Hashrate Capacity:
          </span>
          <span className="font-bold font-mono text-[#5b5bd6]">
            {completedTasks.length * 20}% Power Active ({completedTasks.length}/5 Nodes)
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-[#e6e6eb] overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-[#5b5bd6] via-[#7c5cdb] to-[#10b981] rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(completedTasks.length / 5) * 100}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#86868b] mt-2 pt-1 border-t border-[#f0f0f5]">
          <span>Earned today: <strong className="text-emerald-600 font-mono">Rs {totalEarnedToday}</strong></span>
          <span>Max daily yield: <strong className="text-[#1d1d1f] font-mono">Rs {totalRewardsAvailable}</strong></span>
        </div>
      </div>

      {/* Locked state if user hasn't deposited */}
      {!isDeposited ? (
        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#f8f9ff] to-[#eef0ff] border border-[#dadcff] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#5b5bd6] mx-auto flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-[#1d1d1f]">AI Nodes Locked</h4>
            <p className="text-[12px] text-[#86868b] max-w-xs mx-auto mt-0.5">
              Make a deposit or activate an investment node to unlock 5 daily interactive calibration tasks and start live mining yield.
            </p>
          </div>
          <Link href="/deposit" className="btn-primary inline-flex items-center gap-2 text-[13px] px-5 py-2.5 rounded-xl shadow-md">
            <span>Deposit to Unlock</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      ) : (
        /* 5 Daily Tasks List */
        <div className="space-y-3">
          {/* Status Message Banner */}
          <div className={`p-3 rounded-xl text-[12px] font-medium flex items-center gap-2 border ${
            completedTasks.length === 5 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : completedTasks.length > 0 
              ? 'bg-[#eef0ff] text-[#5b5bd6] border-[#dadcff]' 
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            <span className="text-[14px]">
              {completedTasks.length === 5 ? '🚀' : completedTasks.length > 0 ? '⚡' : '⚠️'}
            </span>
            <span>
              {completedTasks.length === 5 
                ? 'All 5 AI Trading Nodes are 100% active at peak yield for the next 24 hours!'
                : completedTasks.length > 0 
                ? `${completedTasks.length * 20}% Node Hashrate Active! Calibrate remaining ${5 - completedTasks.length} nodes to reach 100% full earning speed.`
                : 'Nodes in standby mode! Calibrate the 5 nodes below to activate your daily investment yield.'
              }
            </span>
          </div>

          {tasksList.map((task, idx) => {
            const isDone = completedTasks.includes(task.id);
            return (
              <div 
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isDone 
                    ? 'bg-emerald-50/50 border-emerald-200/80 shadow-none' 
                    : 'bg-white/80 border-white/60 hover:border-[#5b5bd6]/40 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isDone ? 'bg-emerald-100 text-emerald-700' : `${task.bg} ${task.color}`
                  }`}>
                    {isDone ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={task.icon} /></svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold ${
                        isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-[#5b5bd6]/10 text-[#5b5bd6]'
                      }`}>
                        {task.nodeName}
                      </span>
                      <span className="text-[10px] font-semibold text-[#86868b]">{task.powerBonus}</span>
                    </div>
                    <h4 className={`text-[14px] font-semibold tracking-tight truncate mt-0.5 ${isDone ? 'text-emerald-950 font-bold' : 'text-[#1d1d1f]'}`}>
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-[#86868b] truncate">{task.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[13px] font-bold font-mono ${isDone ? 'text-emerald-600' : 'text-[#15a86b]'}`}>
                    +Rs {task.reward}
                  </span>

                  {isDone ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100/80 text-emerald-800 text-[11px] font-bold flex items-center gap-1 border border-emerald-200">
                      Active ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveTask(task)}
                      className="px-3.5 py-1.5 rounded-xl text-[12px] font-semibold text-white shadow-sm hover:opacity-90 transition-all flex items-center gap-1"
                      style={{ background: 'linear-gradient(118deg,#5b5bd6,#7c5cdb)', boxShadow: '0 4px 12px -3px rgba(91,91,214,0.4)' }}
                    >
                      <span>Calibrate</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Puzzle Modal */}
      {activeTask && (
        <PuzzleModal
          planName={activeTask.title}
          price={activeTask.reward * 30} // sets the matching puzzle type
          onSuccess={handleTaskSuccess}
          onClose={() => setActiveTask(null)}
        />
      )}
    </div>
  );
}
