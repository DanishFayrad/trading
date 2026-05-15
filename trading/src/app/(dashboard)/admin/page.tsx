"use client";
import React, { useState, useEffect } from 'react';

interface Deposit {
  _id: string;
  user: { firstName: string; lastName: string; email: string; };
  amount: number;
  paymentMethod: string;
  screenshot: string;
  status: string;
  transactionId?: string;
  createdAt: string;
}

interface Withdrawal {
    _id: string;
    user: { firstName: string; lastName: string; email: string; };
    amount: number;
    paymentMethod: string;
    accountDetails: string;
    status: string;
    createdAt: string;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<'deposits' | 'withdrawals'>('deposits');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: 'deposits' | 'withdrawals' } | null>(null);
  const [modal, setModal] = useState<{ show: boolean, title: string, message: string, type: 'success' | 'error' }>({
    show: false, title: '', message: '', type: 'success'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      const [depRes, withRes] = await Promise.all([
          fetch(`${apiUrl}/api/deposits/admin`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${apiUrl}/api/withdrawals/admin`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const depData = await depRes.json();
      const withData = await withRes.json();

      if (depData.success) setDeposits(depData.data);
      if (withData.success) setWithdrawals(withData.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: string, type: 'deposits' | 'withdrawals', status: 'approved' | 'rejected') => {
    setActionLoading(`${id}-${status}`);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/${type}/${id}/status`, {
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
          message: `${type === 'deposits' ? 'Deposit' : 'Withdrawal'} has been ${status} successfully.`,
          type: 'success'
        });
        fetchData();
      } else {
        setModal({ show: true, title: 'Failed', message: data.message || 'Action could not be performed.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setModal({ show: true, title: 'Error', message: 'Something went wrong.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, type: 'deposits' | 'withdrawals') => {
    setActionLoading(`${id}-delete`);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setModal({
          show: true,
          title: 'Deleted',
          message: `${type === 'deposits' ? 'Deposit' : 'Withdrawal'} has been deleted.`,
          type: 'success'
        });
        fetchData();
      } else {
        setModal({ show: true, title: 'Failed', message: data.message || 'Could not delete.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setModal({ show: true, title: 'Error', message: 'Something went wrong.', type: 'error' });
    } finally {
      setActionLoading(null);
      setDeleteConfirm(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-[#86868b] gap-4">
      <div className="w-12 h-12 border-4 border-[#d8d8df] border-t-[#5b5bd6] rounded-full animate-spin"></div>
      <p className="text-[13px] animate-pulse">Accessing control panel...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 blob pointer-events-none -z-10"></div>

      <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setTab('deposits')}
            className={`flex-1 py-3.5 rounded-xl font-medium text-[14px] transition-all ${tab === 'deposits' ? 'text-white' : 'btn-ghost'}`}
            style={tab === 'deposits' ? { background: 'linear-gradient(118deg,#f97316,#ea580c)', boxShadow: '0 10px 30px -8px rgba(249,115,22,0.45)' } : undefined}
          >
              Deposits
          </button>
          <button
            onClick={() => setTab('withdrawals')}
            className={`flex-1 py-3.5 rounded-xl font-medium text-[14px] transition-all ${tab === 'withdrawals' ? 'text-white' : 'btn-ghost'}`}
            style={tab === 'withdrawals' ? { background: 'linear-gradient(118deg,#f97316,#ea580c)', boxShadow: '0 10px 30px -8px rgba(249,115,22,0.45)' } : undefined}
          >
              Withdrawals
          </button>
      </div>

      <div className="space-y-4">
        {tab === 'deposits' ? (
            deposits.length === 0 ? (
                <div className="text-center p-10 glass-soft rounded-2xl text-[#86868b] text-[13px]">No deposit requests found.</div>
            ) : (
                deposits.map((deposit) => (
                    <div key={deposit._id} className="glass rounded-2xl p-5 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[11px] font-medium ${
                            deposit.status === 'pending' ? 'bg-orange-50 text-orange-600' : deposit.status === 'approved' ? 'bg-emerald-50 text-[#15a86b]' : 'bg-red-50 text-red-600'
                        }`}>
                            {deposit.status}
                        </div>
                        <div className="flex gap-5 items-start mb-5">
                            <div className="w-20 h-20 rounded-2xl bg-[#f5f5f7] border border-[#e6e6eb] flex-shrink-0 cursor-pointer overflow-hidden group relative" onClick={() => setSelectedImage(deposit.screenshot)}>
                                <img src={deposit.screenshot} alt="Proof" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[15px] font-semibold tracking-tight truncate text-[#1d1d1f]">{deposit.user?.firstName} {deposit.user?.lastName}</h3>
                                <p className="text-[12px] text-[#86868b] mb-3 truncate">{deposit.user?.email}</p>
                                <div className="flex gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] text-[#86868b]">Amount</span>
                                        <span className="text-[16px] font-semibold text-[#15a86b]">${deposit.amount}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] text-[#86868b]">Method</span>
                                        <span className="text-[16px] font-semibold text-[#5b5bd6]">{deposit.paymentMethod}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {deposit.status === 'pending' && (
                                <>
                                    <button onClick={() => handleStatusUpdate(deposit._id, 'deposits', 'approved')} className="flex-1 font-medium text-[14px] py-3 rounded-xl text-white" style={{ background: 'linear-gradient(118deg,#f97316,#ea580c)', boxShadow: '0 10px 30px -8px rgba(249,115,22,0.45)' }}>{actionLoading === `${deposit._id}-approved` ? '...' : 'Approve'}</button>
                                    <button onClick={() => handleStatusUpdate(deposit._id, 'deposits', 'rejected')} className="flex-1 bg-red-50 text-red-600 border border-red-200 font-medium text-[14px] py-3 rounded-xl">{actionLoading === `${deposit._id}-rejected` ? '...' : 'Reject'}</button>
                                </>
                            )}
                            <button onClick={() => setDeleteConfirm({ id: deposit._id, type: 'deposits' })} title="Delete" className={`${deposit.status === 'pending' ? 'w-12' : 'w-full'} flex items-center justify-center gap-2 bg-[#f5f5f7] hover:bg-red-50 text-[#86868b] hover:text-red-600 border border-[#e6e6eb] hover:border-red-200 font-medium text-[14px] py-3 rounded-xl transition-colors`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" /></svg>
                                {deposit.status !== 'pending' && <span>Delete</span>}
                            </button>
                        </div>
                    </div>
                ))
            )
        ) : (
            withdrawals.length === 0 ? (
                <div className="text-center p-10 glass-soft rounded-2xl text-[#86868b] text-[13px]">No withdrawal requests found.</div>
            ) : (
                withdrawals.map((withdrawal) => (
                    <div key={withdrawal._id} className="glass rounded-2xl p-5 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[11px] font-medium ${
                            withdrawal.status === 'pending' ? 'bg-orange-50 text-orange-600' : withdrawal.status === 'approved' ? 'bg-emerald-50 text-[#15a86b]' : 'bg-red-50 text-red-600'
                        }`}>
                            {withdrawal.status}
                        </div>
                        <div className="mb-5">
                            <h3 className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">{withdrawal.user?.firstName} {withdrawal.user?.lastName}</h3>
                            <p className="text-[12px] text-[#86868b] mb-4">{withdrawal.user?.email}</p>
                            <div className="glass-soft rounded-xl p-4 mb-4">
                                <p className="text-[11px] text-[#86868b] mb-1">Account details</p>
                                <p className="text-sm font-mono text-orange-600 break-all">{withdrawal.accountDetails}</p>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[11px] text-[#86868b]">Amount</span>
                                    <span className="text-[16px] font-semibold text-red-600">${withdrawal.amount}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] text-[#86868b]">Method</span>
                                    <span className="text-[16px] font-semibold text-orange-600">{withdrawal.paymentMethod}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {withdrawal.status === 'pending' && (
                                <>
                                    <button onClick={() => handleStatusUpdate(withdrawal._id, 'withdrawals', 'approved')} className="flex-1 text-white font-medium text-[14px] py-3 rounded-xl" style={{ background: 'linear-gradient(118deg,#f97316,#ea580c)', boxShadow: '0 10px 30px -8px rgba(249,115,22,0.45)' }}>{actionLoading === `${withdrawal._id}-approved` ? '...' : 'Approve'}</button>
                                    <button onClick={() => handleStatusUpdate(withdrawal._id, 'withdrawals', 'rejected')} className="flex-1 bg-red-50 text-red-600 border border-red-200 font-medium text-[14px] py-3 rounded-xl">{actionLoading === `${withdrawal._id}-rejected` ? '...' : 'Reject'}</button>
                                </>
                            )}
                            <button onClick={() => setDeleteConfirm({ id: withdrawal._id, type: 'withdrawals' })} title="Delete" className={`${withdrawal.status === 'pending' ? 'w-12' : 'w-full'} flex items-center justify-center gap-2 bg-[#f5f5f7] hover:bg-red-50 text-[#86868b] hover:text-red-600 border border-[#e6e6eb] hover:border-red-200 font-medium text-[14px] py-3 rounded-xl transition-colors`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" /></svg>
                                {withdrawal.status !== 'pending' && <span>Delete</span>}
                            </button>
                        </div>
                    </div>
                ))
            )
        )}
      </div>

      {/* Modals remain same as before for visual consistency */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm">
            <div className="glass rounded-3xl p-8 max-w-sm w-full text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-red-50 text-red-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" /></svg>
                </div>
                <h3 className="text-[18px] font-semibold tracking-tight text-[#1d1d1f] mb-2">Delete this {deleteConfirm.type === 'deposits' ? 'deposit' : 'withdrawal'}?</h3>
                <p className="text-[#86868b] text-[13px] mb-8">This will permanently remove the record. This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={() => setDeleteConfirm(null)} className="btn-ghost flex-1 py-3.5 rounded-xl font-medium text-[15px]">Cancel</button>
                    <button onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.type)} disabled={actionLoading === `${deleteConfirm.id}-delete`} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-medium text-[15px] disabled:opacity-60 transition-colors">
                        {actionLoading === `${deleteConfirm.id}-delete` ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
      )}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Full Screenshot" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl border border-white/10" />
        </div>
      )}
      {modal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm">
            <div className="glass rounded-3xl p-8 max-w-sm w-full text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${modal.type === 'success' ? 'bg-emerald-50 text-[#15a86b]' : 'bg-red-50 text-red-600'}`}>
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-[18px] font-semibold tracking-tight text-[#1d1d1f] mb-2">{modal.title}</h3>
                <p className="text-[#86868b] text-[13px] mb-8">{modal.message}</p>
                <button onClick={() => setModal({ ...modal, show: false })} className="btn-primary w-full py-3.5 rounded-xl font-medium text-[15px]">OK</button>
            </div>
        </div>
      )}
    </div>
  );
}
