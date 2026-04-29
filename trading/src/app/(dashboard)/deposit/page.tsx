"use client";
import React, { useState } from 'react';

export default function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const paymentMethods = [
    { id: 'easypaisa', name: 'EasyPaisa', subtitle: 'Deposit: PKR/USD', color: 'text-[#00e699]', bg: 'bg-[#00e699]/10', border: 'border-[#00e699]/20', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { id: 'jazzcash', name: 'Jazzcash', subtitle: 'Deposit: PKR/USD', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'bank', name: 'Bank Transfer', subtitle: 'Direct Bank Deposit', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  ];

  const cryptoMethods = [
    { id: 'solana', name: 'Solana', subtitle: 'SOL, USDC, USDT', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'tron', name: 'Tron', subtitle: 'TRX, USDT, USDD', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'bnb', name: 'BNB Chain', subtitle: 'BNB, USDC, USDT', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  ];

  const [modal, setModal] = useState<{ show: boolean, title: string, message: string, type: 'success' | 'error' }>({
    show: false, title: '', message: '', type: 'success'
  });

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot || !amount || !selectedMethod) {
      setModal({ show: true, title: 'Incomplete', message: 'Please fill all required fields.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const base64Image = await convertToBase64(screenshot);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/deposits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          paymentMethod: selectedMethod,
          transactionId,
          screenshot: base64Image
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setModal({
            show: true,
            title: 'Submitted!',
            message: 'Your deposit has been sent for verification. You can track its status in the logs.',
            type: 'success'
        });
        setSelectedMethod(null);
        setAmount('');
        setScreenshot(null);
        setTransactionId('');
      } else {
        setModal({ show: true, title: 'Failed', message: data.message || 'Submission failed.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setModal({ show: true, title: 'Error', message: 'An error occurred. Please check your connection.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#161c2d] border border-white/5 rounded-2xl p-6 mb-6">
                <div className="text-center mb-6">
                    <h3 className="font-bold text-lg mb-1">{methodInfo?.name} Payment Details</h3>
                    <p className="text-gray-400 text-sm">Send payment to the details below</p>
                </div>
                
                <div className="bg-[#0b101e] border border-white/5 rounded-xl p-6 mb-6 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#3ba2ff] to-[#8d49f7]"></div>
                    <div className="flex-1 text-center">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">TILL ID / ADDRESS</p>
                        <h2 className="text-xl font-bold text-white tracking-wider font-mono">982891804</h2>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">HAPPY MINI MART</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Deposit Amount ($)</label>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-[#0b101e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3ba2ff] transition-colors"
                            placeholder="Enter amount"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Transaction ID (Optional)</label>
                        <input 
                            type="text" 
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="w-full bg-[#0b101e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3ba2ff] transition-colors"
                            placeholder="Enter transaction ID"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Upload Payment Screenshot</label>
                        <div className="relative">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                                className="hidden"
                                id="screenshot-upload"
                                required
                            />
                            <label 
                                htmlFor="screenshot-upload"
                                className="w-full bg-[#0b101e] border border-dashed border-white/20 rounded-xl px-4 py-8 text-center cursor-pointer hover:border-[#3ba2ff] transition-all flex flex-col items-center gap-2"
                            >
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span className="text-sm text-gray-400">{screenshot ? screenshot.name : 'Click to upload screenshot'}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-gradient-to-r from-[#3ba2ff] to-[#8d49f7] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : null}
                {loading ? 'Submitting...' : 'Submit Deposit'}
                {!loading && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
            </button>
          </form>
        </div>

        {/* Action Result Modal */}
        {modal.show && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-[#121624] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${modal.type === 'success' ? 'bg-[#00e699]/10 text-[#00e699]' : 'bg-red-500/10 text-red-500'}`}>
                        {modal.type === 'success' ? (
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{modal.title}</h3>
                    <p className="text-gray-400 text-sm mb-8">{modal.message}</p>
                    <button 
                        onClick={() => setModal({ ...modal, show: false })}
                        className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${modal.type === 'success' ? 'bg-[#00e699] text-[#0b101e] shadow-[#00e699]/10' : 'bg-red-500 text-white shadow-red-500/10'}`}
                    >
                        Okay
                    </button>
                </div>
            </div>
        )}
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