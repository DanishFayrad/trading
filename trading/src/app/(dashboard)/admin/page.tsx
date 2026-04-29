"use client";
import React, { useState, useEffect } from 'react';

interface Deposit {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  amount: number;
  paymentMethod: string;
  screenshot: string;
  status: string;
  transactionId?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modal, setModal] = useState<{ show: boolean, title: string, message: string, type: 'success' | 'error' }>({
    show: false, title: '', message: '', type: 'success'
  });

  const fetchDeposits = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/deposits/admin`, {
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

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(`${id}-${status}`);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/deposits/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setModal({
          show: true,
          title: status === 'approved' ? 'Approved!' : 'Rejected!',
          message: `Transaction has been ${status} successfully.`,
          type: 'success'
        });
        fetchDeposits();
      } else {
        setModal({
          show: true,
          title: 'Failed',
          message: data.message || 'Action could not be performed.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error(error);
      setModal({ show: true, title: 'Error', message: 'Something went wrong.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-gray-400 gap-4">
      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="font-medium animate-pulse">Loading Admin Control Panel...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#121624] border border-white/5 rounded-2xl p-4 text-center">
            <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Pending</p>
            <p className="text-xl font-bold text-yellow-500">{deposits.filter(d => d.status === 'pending').length}</p>
        </div>
        <div className="bg-[#121624] border border-white/5 rounded-2xl p-4 text-center">
            <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Approved</p>
            <p className="text-xl font-bold text-emerald-500">{deposits.filter(d => d.status === 'approved').length}</p>
        </div>
        <div className="bg-[#121624] border border-white/5 rounded-2xl p-4 text-center">
            <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Rejected</p>
            <p className="text-xl font-bold text-red-500">{deposits.filter(d => d.status === 'rejected').length}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Manual Approvals</h1>
        <button onClick={fetchDeposits} className="text-[#3ba2ff] text-xs font-bold hover:underline">Refresh List</button>
      </div>

      <div className="space-y-4">
        {deposits.length === 0 ? (
          <div className="text-center p-10 bg-[#121624] rounded-2xl border border-white/5 text-gray-500">
            No deposit requests found.
          </div>
        ) : (
          deposits.map((deposit) => (
            <div key={deposit._id} className="bg-[#121624] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-all">
              <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-wider shadow-lg ${
                deposit.status === 'pending' ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white' : 
                deposit.status === 'approved' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-600 to-red-500 text-white'
              }`}>
                {deposit.status}
              </div>

              <div className="flex gap-5 items-start mb-5">
                <div 
                    className="w-24 h-24 rounded-2xl bg-[#0b101e] border border-white/10 flex-shrink-0 cursor-pointer overflow-hidden group relative shadow-inner"
                    onClick={() => setSelectedImage(deposit.screenshot)}
                >
                    <img 
                        src={deposit.screenshot} 
                        alt="Screenshot" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                    </div>
                </div>
                
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg truncate leading-tight">{deposit.user?.firstName || 'Unknown'} {deposit.user?.lastName || 'User'}</h3>
                    <p className="text-xs text-gray-500 mb-3 truncate">{deposit.user?.email}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Amount</span>
                            <span className="text-base font-bold text-[#00e699]">${deposit.amount}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Method</span>
                            <span className="text-base font-bold text-[#3ba2ff]">{deposit.paymentMethod}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Date</span>
                            <span className="text-xs font-medium text-gray-300">{new Date(deposit.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
              </div>

              {deposit.transactionId && (
                <div className="bg-[#0b101e] rounded-xl p-3 mb-5 flex items-center justify-between border border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase font-bold px-1">Transaction ID</span>
                    <span className="text-xs font-mono text-gray-300 px-2 truncate">{deposit.transactionId}</span>
                </div>
              )}

              {deposit.status === 'pending' && (
                <div className="flex gap-3">
                    <button 
                        disabled={actionLoading !== null}
                        onClick={() => handleStatusUpdate(deposit._id, 'approved')}
                        className={`flex-1 bg-[#00e699] hover:bg-[#00e699]/90 text-[#0b101e] font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00e699]/10 ${actionLoading === `${deposit._id}-approved` ? 'opacity-70' : ''}`}
                    >
                        {actionLoading === `${deposit._id}-approved` ? (
                            <div className="w-5 h-5 border-2 border-[#0b101e]/30 border-t-[#0b101e] rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        )}
                        {actionLoading === `${deposit._id}-approved` ? 'Processing...' : 'Approve'}
                    </button>
                    <button 
                        disabled={actionLoading !== null}
                        onClick={() => handleStatusUpdate(deposit._id, 'rejected')}
                        className={`flex-1 bg-red-500 hover:bg-red-500/90 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 ${actionLoading === `${deposit._id}-rejected` ? 'opacity-70' : ''}`}
                    >
                        {actionLoading === `${deposit._id}-rejected` ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        )}
                        {actionLoading === `${deposit._id}-rejected` ? 'Processing...' : 'Reject'}
                    </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Image Zoom Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in zoom-in duration-300"
            onClick={() => setSelectedImage(null)}
        >
            <div className="relative max-w-full max-h-full">
                <img 
                    src={selectedImage} 
                    alt="Full Screenshot" 
                    className="max-w-full max-h-[90vh] rounded-xl shadow-2xl border border-white/10"
                />
                <button 
                    className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-all flex items-center gap-2"
                    onClick={() => setSelectedImage(null)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        </div>
      )}

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
                    Great, thanks!
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
