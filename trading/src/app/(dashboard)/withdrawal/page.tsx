"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WithdrawalPage() {
  const [method, setMethod] = useState('easypaisa');
  const [amount, setAmount] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ show: boolean, title: string, message: string, type: 'success' | 'error' }>({
    show: false, title: '', message: '', type: 'success'
  });
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Fetch real balance from deposits (simplified for now)
    const fetchBalance = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiUrl}/api/deposits/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                const total = data.data.filter((d: any) => d.status === 'approved').reduce((acc: number, d: any) => acc + d.amount, 0);
                setBalance(total);
            }
        } catch (error) {
            console.error(error);
        }
    };
    fetchBalance();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !accountDetails) {
        setModal({ show: true, title: 'Incomplete', message: 'Please fill all required fields.', type: 'error' });
        return;
    }

    if (Number(amount) > balance) {
        setModal({ show: true, title: 'Insufficient Balance', message: 'You do not have enough funds for this withdrawal.', type: 'error' });
        return;
    }

    setLoading(true);
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/withdrawals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                amount,
                paymentMethod: method,
                accountDetails
            })
        });

        const data = await response.json();
        if (data.success) {
            setModal({
                show: true,
                title: 'Request Sent',
                message: 'Your withdrawal request has been submitted and is pending approval.',
                type: 'success'
            });
            setAmount('');
            setAccountDetails('');
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

  return (
    <div className="space-y-6 pb-20 relative overflow-hidden">
      {/* Decorative wash */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5b5bd6]/10 blob -z-10 pointer-events-none"></div>

      <div className="glass rounded-[28px] p-7 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c5cdb]/8 blob -mr-32 -mt-32 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <div>
                <h1 className="text-[24px] sm:text-[26px] font-semibold tracking-[-0.02em]">Cash <span className="gradient-text">withdrawal</span></h1>
                <p className="text-[12px] sm:text-[13px] text-[#86868b] mt-1">Withdraw your earnings securely</p>
            </div>
          </div>

          <div className="glass-soft rounded-3xl p-6 mb-8 flex items-center justify-between">
              <div>
                  <p className="text-[12px] sm:text-[13px] text-[#86868b] mb-1">Withdrawable balance</p>
                  <h2 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f] font-mono">Rs {balance.toLocaleString()}</h2>
                  <p className="text-[13px] font-mono text-[#86868b]">$ {(balance / 278).toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15a86b] flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-[12px] sm:text-[13px] text-[#86868b] mb-3 px-1">Transfer protocol</label>
                <div className="grid grid-cols-3 gap-3">
                    {['easypaisa', 'jazzcash', 'bank'].map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setMethod(m)}
                            className={`p-3.5 rounded-xl border transition-all text-center capitalize text-[13px] font-medium ${method === m ? 'btn-primary border-transparent' : 'btn-ghost'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="flex justify-between text-[12px] sm:text-[13px] text-[#86868b] mb-2 px-1">
                    <span>Withdrawal amount (Rs)</span>
                    {amount && <span>~ $ {(Number(amount) / 278).toFixed(2)}</span>}
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-light w-full rounded-xl px-4 py-3.5 text-[15px] font-medium"
                    placeholder="0.00"
                    required
                />
            </div>

            <div>
                <label className="block text-[12px] sm:text-[13px] text-[#86868b] mb-2 px-1">Account number / IBAN</label>
                <input
                    type="text"
                    value={accountDetails}
                    onChange={(e) => setAccountDetails(e.target.value)}
                    className="input-light w-full rounded-xl px-4 py-3.5 text-[15px] font-medium"
                    placeholder="Enter your account details"
                    required
                />
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className={`btn-primary w-full font-medium text-[15px] py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <svg className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    )}
                    {loading ? 'Processing...' : 'Authorize withdrawal'}
                </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      {modal.show && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm">
                <div className="glass rounded-[28px] p-8 max-w-sm w-full text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5" style={{ background: 'linear-gradient(90deg, #5b5bd6, #7c5cdb)' }}></div>
                    <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center ${modal.type === 'success' ? 'bg-emerald-50 text-[#15a86b]' : 'bg-red-50 text-red-600'}`}>
                        {modal.type === 'success' ? (
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        )}
                    </div>
                    <h3 className="text-[20px] font-semibold tracking-tight mb-2">{modal.title}</h3>
                    <p className="text-[14px] text-[#86868b] mb-8 leading-relaxed">{modal.message}</p>
                    <button
                        onClick={() => setModal({ ...modal, show: false })}
                        className="btn-primary w-full py-3.5 rounded-xl font-medium text-[15px] transition-all"
                    >
                        Acknowledged
                    </button>
                </div>
            </div>
        )}
    </div>
  );
}
