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
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Transaction History</h1>
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center p-10 text-gray-500">Loading transactions...</div>
        ) : deposits.length === 0 ? (
          <div className="bg-[#121624] border border-white/5 rounded-2xl p-8 text-center text-gray-500">
            No transactions found.
          </div>
        ) : (
          deposits.map((deposit) => (
            <div key={deposit._id} className="bg-[#121624] border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-4">
                <div 
                    className="w-12 h-12 rounded-lg bg-[#0b101e] border border-white/10 overflow-hidden cursor-pointer group relative flex-shrink-0"
                    onClick={() => setSelectedImage(deposit.screenshot)}
                >
                    <img 
                        src={deposit.screenshot} 
                        alt="Proof" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white capitalize">{deposit.paymentMethod} Deposit</h3>
                    <p className="text-[10px] text-gray-500">{new Date(deposit.createdAt).toLocaleDateString()} • {new Date(deposit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">${deposit.amount}</p>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${
                    deposit.status === 'approved' ? 'text-emerald-500' : 
                    deposit.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'
                }`}>{deposit.status}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
        >
            <div className="relative max-w-full max-h-full">
                <img 
                    src={selectedImage} 
                    alt="Full Screenshot" 
                    className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border border-white/10"
                />
                <button 
                    className="absolute -top-10 right-0 text-white hover:text-gray-300 flex items-center gap-2"
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