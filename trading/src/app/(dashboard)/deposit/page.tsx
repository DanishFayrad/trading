"use client";
import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function DepositContent() {
  const searchParams = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [planName, setPlanName] = useState('Manual Deposit');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const amt = searchParams.get('amount');
    const plan = searchParams.get('plan');
    if (amt) setAmount(amt);
    if (plan) setPlanName(plan);
  }, [searchParams]);

  const paymentMethods = [
    { id: 'jazzcash', name: 'Jazzcash', subtitle: 'Deposit: PKR/USD', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
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
          planName,
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
    const methodInfo = paymentMethods.find(m => m.id === selectedMethod);
    return (
      <div className="space-y-6 pb-4 relative">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5b5bd6]/10 blob -z-10 pointer-events-none"></div>
        <div className="glass rounded-[28px] p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-56 h-56 bg-[#7c5cdb]/8 blob -mr-28 -mt-28 pointer-events-none"></div>
          <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
            </div>
            <div>
              <h1 className="text-[22px] font-semibold tracking-[-0.02em]">{methodInfo?.name} <span className="gradient-text">deposit</span></h1>
              <p className="text-[12px] sm:text-[13px] text-[#86868b] mt-1">Add funds to your account</p>
            </div>
          </div>

          <button onClick={() => setSelectedMethod(null)} className="flex items-center gap-2 text-[#86868b] hover:text-[#5b5bd6] transition-colors text-[14px] mb-8 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-soft rounded-3xl p-6 mb-6">
                <div className="text-center mb-6">
                    <h3 className="text-[15px] font-semibold tracking-tight mb-1">{methodInfo?.name} payment details</h3>
                    <p className="text-[12px] sm:text-[13px] text-[#86868b]">Send payment to the details below</p>
                </div>

                <div className="bg-white border border-[#e6e6eb] rounded-xl p-6 mb-6 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ background: 'linear-gradient(#5b5bd6, #7c5cdb)' }}></div>
                    <div className="flex-1 text-center">
                        <p className="text-[12px] text-[#86868b] mb-1">Jazz Cash number</p>
                        <h2 className="text-[22px] font-semibold gradient-text tracking-wide font-mono">03205805955</h2>
                        <p className="text-[12px] text-[#86868b] mt-1">Haleema Bibi</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[12px] sm:text-[13px] text-[#86868b] mb-2 px-1">Deposit amount ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="input-light w-full rounded-xl px-4 py-3.5 text-[15px] font-medium"
                            placeholder="Enter amount"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[12px] sm:text-[13px] text-[#86868b] mb-2 px-1">Transaction ID (optional)</label>
                        <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="input-light w-full rounded-xl px-4 py-3.5 text-[15px] font-medium"
                            placeholder="Enter transaction ID"
                        />
                    </div>
                    <div>
                        <label className="block text-[12px] sm:text-[13px] text-[#86868b] mb-2 px-1">Upload payment screenshot</label>
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
                                className="w-full input-light border-dashed rounded-xl px-4 py-8 text-center cursor-pointer hover:border-[#5b5bd6] transition-all flex flex-col items-center gap-2"
                            >
                                <svg className="w-8 h-8 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span className="text-[14px] text-[#86868b] font-medium">{screenshot ? screenshot.name : 'Click to upload screenshot'}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`btn-primary w-full font-medium text-[15px] py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : null}
                {loading ? 'Submitting...' : 'Submit deposit'}
                {!loading && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
            </button>
          </form>
          </div>
        </div>

        {/* Action Result Modal */}
        {modal.show && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="glass rounded-3xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-300 text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${modal.type === 'success' ? 'bg-emerald-50 text-[#15a86b]' : 'bg-red-50 text-red-600'}`}>
                        {modal.type === 'success' ? (
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        )}
                    </div>
                    <h3 className="text-[20px] font-semibold tracking-tight mb-2">{modal.title}</h3>
                    <p className="text-[14px] text-[#86868b] mb-8">{modal.message}</p>
                    <button
                        onClick={() => setModal({ ...modal, show: false })}
                        className="btn-primary w-full py-3.5 rounded-xl font-medium text-[15px] transition-all"
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
    <div className="space-y-6 pb-4 relative">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5b5bd6]/10 blob -z-10 pointer-events-none"></div>
      <div className="glass rounded-[28px] p-6 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-[#7c5cdb]/8 blob -mr-28 -mt-28 pointer-events-none"></div>
        <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
          </div>
          <div>
            <h1 className="text-[24px] sm:text-[26px] font-semibold tracking-[-0.02em]">Select <span className="gradient-text">payment method</span></h1>
            <p className="text-[12px] sm:text-[13px] text-[#86868b] mt-1">Add funds to your account</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[12px] sm:text-[13px] text-[#86868b] mb-3 px-1">Payment methods</p>
            <div className="space-y-3">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl glass-soft glass-hover text-left`}
                >
                  <div>
                    <h3 className="text-[14px] font-semibold tracking-tight text-[#1d1d1f]">{method.name}</h3>
                    <p className={`text-[12px] ${method.color} font-medium`}>{method.subtitle}</p>
                  </div>
                  <div className={`w-9 h-9 rounded-full ${method.bg} flex items-center justify-center border ${method.border}`}>
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
    </div>
  );
}

export default function DepositPage() {
  return (
    <Suspense fallback={null}>
      <DepositContent />
    </Suspense>
  );
}
