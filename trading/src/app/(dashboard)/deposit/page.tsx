"use client";
import React, { useState } from 'react';

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'easypaisa', name: 'EasyPaisa', subtitle: 'Deposit: USD', color: 'text-[#00e699]', bg: 'bg-[#00e699]/10', border: 'border-[#00e699]/20', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { id: 'jazzcash', name: 'Jazzcash', subtitle: 'Deposit: USD', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'bank', name: 'Bank Transfer', subtitle: 'Direct Bank Deposit', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  ];

  const cryptoMethods = [
    { id: 'solana', name: 'Solana', subtitle: 'SOL, USDC, USDT', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'tron', name: 'Tron', subtitle: 'TRX, USDT, USDD', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'bnb', name: 'BNB Chain', subtitle: 'BNB, USDC, USDT', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  ];

  if (selectedMethod) {
    const methodInfo = [...paymentMethods, ...cryptoMethods].find(m => m.id === selectedMethod);
    return (
      <div className="space-y-6 pb-4">
        <div className="bg-[#121624] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#3ba2ff]/10 text-[#3ba2ff] flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">{methodInfo?.name} Deposit</h1>
              <p className="text-gray-400 text-sm">Add funds to your account</p>
            </div>
          </div>

          <button onClick={() => setSelectedMethod(null)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back
          </button>

          <div className="text-center mb-6">
            <h3 className="font-bold text-lg mb-1">{methodInfo?.name} Payment Details</h3>
            <p className="text-gray-400 text-sm">Send payment to the details below</p>
          </div>

          <div className="bg-[#161c2d] border border-white/5 rounded-2xl p-6 mb-6 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#3ba2ff] to-[#8d49f7]"></div>
            <div className="flex-1 text-center">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">TILL ID</p>
              <h2 className="text-3xl font-bold text-white tracking-wider font-mono">982891804</h2>
              <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">HAPPY MINI MART</p>
            </div>
            <button className="text-gray-400 hover:text-white p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </button>
          </div>

          <div className="bg-[#161c2d] border border-white/5 rounded-2xl p-6 text-center">
            <p className="font-medium text-sm mb-4">Scan the QR code below to pay instantly</p>
            <div className="bg-white p-2 w-48 h-48 mx-auto rounded-xl">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=982891804" alt="QR Code" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      <div className="bg-[#121624] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-lg">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#3ba2ff]/10 text-[#3ba2ff] flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Select Payment Method</h1>
            <p className="text-gray-400 text-sm">Add funds to your account</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3 px-1">Payment Methods</p>
            <div className="space-y-3">
              {paymentMethods.map(method => (
                <button 
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border ${method.border} ${method.bg} hover:opacity-80 transition-opacity text-left`}
                >
                  <div>
                    <h3 className="font-bold text-white text-sm">{method.name}</h3>
                    <p className={`text-xs ${method.color}`}>{method.subtitle}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full ${method.bg} flex items-center justify-center border ${method.border}`}>
                    <svg className={`w-4 h-4 ${method.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={method.icon}></path>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center mb-3">
              <div className="h-px bg-white/5 flex-1"></div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest px-4">Cryptocurrency</p>
              <div className="h-px bg-white/5 flex-1"></div>
            </div>
            <div className="space-y-3">
              {cryptoMethods.map(method => (
                <button 
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border ${method.border} ${method.bg} hover:opacity-80 transition-opacity text-left`}
                >
                  <div>
                    <h3 className="font-bold text-white text-sm">{method.name}</h3>
                    <p className={`text-xs ${method.color}`}>{method.subtitle}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full ${method.bg} flex items-center justify-center border ${method.border}`}>
                    <svg className={`w-4 h-4 ${method.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={method.icon}></path>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}