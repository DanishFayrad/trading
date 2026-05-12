"use client";
import React, { useState, useEffect } from 'react';

interface Deposit {
  _id: string;
  amount: number;
  paymentMethod: string;
  status: string;
  screenshot: string;
  createdAt: string;
  transactionId?: string;
}

export default function TransactionsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyDeposits = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/api/deposits/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setDeposits(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyDeposits();
  }, []);

  return (
    <div className="space-y-6 pb-20 relative">
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-[#5b5bd6]/10 blob pointer-events-none -z-10"></div>

      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">Transaction <span className="gradient-text">History</span></h1>
        <div className="w-10 h-10 rounded-xl bg-[#eef0ff] text-[#5b5bd6] flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center p-10 text-[#86868b] font-medium">Loading transactions...</div>
        ) : deposits.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-[#86868b] font-medium">
            No transactions found.
          </div>
        ) : (
          deposits.map((deposit) => (
            <div key={deposit._id} className="glass rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                    className="w-12 h-12 rounded-lg bg-[#f5f5f7] border border-[#e6e6eb] overflow-hidden cursor-pointer group relative flex-shrink-0"
                    onClick={() => setSelectedImage(deposit.screenshot)}
                >
                    <img
                        src={deposit.screenshot}
                        alt="Proof"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-[#5b5bd6]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </div>
                </div>
                <div>
                    <h3 className="text-[14px] font-semibold text-[#1d1d1f] capitalize tracking-tight">{deposit.paymentMethod} Deposit</h3>
                    <p className="text-[12px] text-[#86868b]">{new Date(deposit.createdAt).toLocaleDateString()} • {new Date(deposit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-semibold text-[#1d1d1f] font-mono">${deposit.amount}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                    deposit.status === 'approved' ? 'bg-emerald-50 text-[#15a86b]' :
                    deposit.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                }`}>{deposit.status}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
            className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
        >
            <div className="relative max-w-full max-h-full">
                <img
                    src={selectedImage}
                    alt="Full Screenshot"
                    className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border border-[#e6e6eb]"
                />
                <button
                    className="absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-2"
                    onClick={() => setSelectedImage(null)}
                >
                    <span className="text-sm">Close</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
