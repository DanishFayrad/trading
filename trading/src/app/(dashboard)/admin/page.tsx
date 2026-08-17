"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getApiUrl } from '@/config';

interface Deposit {
  _id: string;
  user?: { firstName: string; lastName: string; email: string; phone?: string; };
  amount: number;
  paymentMethod: string;
  screenshot: string;
  status: string;
  transactionId?: string;
  planName?: string;
  createdAt: string;
}

interface Withdrawal {
    _id: string;
    user?: { firstName: string; lastName: string; email: string; phone?: string; };
    amount: number;
    paymentMethod: string;
    accountDetails: string;
    status: string;
    createdAt: string;
    fastTrack?: boolean;
    eta?: string;
}

interface ReferredUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
}

interface ReferralGroup {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    referralCode: string;
    affiliateBalance: number;
    affiliateEarnedTotal: number;
    referredUsers: ReferredUser[];
}

interface Partner {
    _id: string;
    name: string;
    email?: string;
    code: string;
    notes?: string;
    registered: number;
    active: number;
    createdAt: string;
}

interface PartnerUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    isActive: boolean;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<'deposits' | 'withdrawals' | 'referrals' | 'partners' | 'users'>('deposits');
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [referralGroups, setReferralGroups] = useState<ReferralGroup[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [deleteUserConfirm, setDeleteUserConfirm] = useState<any | null>(null);
  const [editBalanceVal, setEditBalanceVal] = useState('');
  const [partnerUsers, setPartnerUsers] = useState<Record<string, PartnerUser[]>>({});
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});
  const [expandedPartners, setExpandedPartners] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: 'deposits' | 'withdrawals' } | null>(null);
  const [deletePartnerConfirm, setDeletePartnerConfirm] = useState<Partner | null>(null);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({ name: '', email: '', code: '', notes: '' });
  const [origin, setOrigin] = useState('');
  const [copiedPartnerId, setCopiedPartnerId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ show: boolean, title: string, message: string, type: 'success' | 'error' }>({
    show: false, title: '', message: '', type: 'success'
  });

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      // 1. Fetch deposits from Supabase
      const { data: depData, error: depError } = await supabase
        .from('deposits')
        .select('*')
        .order('created_at', { ascending: false });

      if (!depError && depData) {
        setDeposits(depData.map((d: any) => ({
          _id: d.id,
          amount: Number(d.amount),
          paymentMethod: d.payment_method,
          screenshot: d.screenshot,
          status: d.status,
          transactionId: d.transaction_id,
          planName: d.plan_name,
          createdAt: d.created_at,
          user: {
            firstName: d.user_name || d.plan_name || 'Investor',
            lastName: '',
            email: d.user_email || d.user_id || 'Registered Account',
            phone: d.user_phone || ''
          }
        })));

        // Populate usersList from depositors
        const uniqueUsersMap = new Map();
        depData.forEach((d: any) => {
          const uid = d.user_id || d.user_email || d.id;
          if (!uniqueUsersMap.has(uid)) {
            uniqueUsersMap.set(uid, {
              _id: uid,
              firstName: d.user_name || d.plan_name || 'Investor',
              lastName: '',
              email: d.user_email || d.user_id || 'Investor Account',
              balance: Number(d.amount),
              depositedTotal: Number(d.amount),
              affiliateBalance: 0,
              createdAt: d.created_at,
              role: 'user'
            });
          } else {
            const existing = uniqueUsersMap.get(uid);
            existing.balance += Number(d.amount);
            existing.depositedTotal += Number(d.amount);
          }
        });
        setUsersList(Array.from(uniqueUsersMap.values()));
      }

      // 2. Fetch withdrawals from Supabase
      const { data: withData } = await supabase
        .from('withdrawals')
        .select('*')
        .order('created_at', { ascending: false });

      if (withData) {
        setWithdrawals(withData.map((w: any) => ({
          _id: w.id,
          amount: Number(w.amount),
          paymentMethod: w.payment_method,
          accountDetails: w.account_details,
          status: w.status,
          createdAt: w.created_at,
          user: { firstName: w.user_name || 'User', lastName: '', email: w.user_email || w.user_id || 'Account' }
        })));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    setOrigin(window.location.origin);

    // Setup realtime subscription
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deposits' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'withdrawals' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusUpdate = async (id: string, type: 'deposits' | 'withdrawals', status: 'approved' | 'rejected') => {
    setActionLoading(`${id}-${status}`);
    try {
      let { error } = await supabase
        .from(type)
        .update({ status, ...(status === 'approved' && type === 'deposits' ? { approved_at: new Date().toISOString() } : {}) })
        .eq('id', id);

      if (error && error.message?.includes('approved_at')) {
        // Fallback without approved_at if column is missing
        const retry = await supabase.from(type).update({ status }).eq('id', id);
        error = retry.error;
      }

      if (error) throw error;

      // Optimistically update local state so it updates immediately on screen
      if (type === 'deposits') {
        setDeposits(prev => prev.map(d => d._id === id ? { ...d, status } : d));
      } else {
        setWithdrawals(prev => prev.map(w => w._id === id ? { ...w, status } : w));
      }

      setModal({
        show: true,
        title: status === 'approved' ? 'Approved!' : 'Rejected!',
        message: `${type === 'deposits' ? 'Deposit' : 'Withdrawal'} has been ${status} successfully.`,
        type: 'success'
      });
      fetchData(true);
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Action could not be performed.';
      setModal({ show: true, title: 'Error', message: msg, type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, type: 'deposits' | 'withdrawals') => {
    setActionLoading(`${id}-delete`);
    try {
      const { error } = await supabase
        .from(type)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setModal({
        show: true,
        title: 'Deleted',
        message: `${type === 'deposits' ? 'Deposit' : 'Withdrawal'} has been deleted.`,
        type: 'success'
      });
      fetchData();
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Could not delete.';
      setModal({ show: true, title: 'Error', message: msg, type: 'error' });
    } finally {
      setActionLoading(null);
      setDeleteConfirm(null);
    }
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartner.name) return;
    setActionLoading('create-partner');
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/auth/admin/partners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPartner)
      });
      const data = await response.json();
      if (data.success) {
        setModal({
          show: true,
          title: 'Partner Created!',
          message: `Partner "${newPartner.name}" has been created successfully with code: ${data.data.code}`,
          type: 'success'
        });
        setNewPartner({ name: '', email: '', code: '', notes: '' });
        setShowAddPartner(false);
        fetchData();
      } else {
        setModal({ show: true, title: 'Failed', message: data.message || 'Could not create partner.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setModal({ show: true, title: 'Error', message: 'Something went wrong.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePartner = async (id: string) => {
    setActionLoading(`${id}-delete-partner`);
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/auth/admin/partners/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setModal({
          show: true,
          title: 'Deleted',
          message: 'Partner has been deleted.',
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
      setDeletePartnerConfirm(null);
    }
  };

  const handleEditBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || editBalanceVal === '') return;
    setActionLoading('edit-balance');
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/auth/admin/users/${selectedUser._id}/balance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ balance: Number(editBalanceVal) })
      });
      const data = await response.json();
      if (data.success) {
        setModal({
          show: true,
          title: 'Balance Updated!',
          message: `Successfully set balance for ${selectedUser.firstName} to Rs ${Number(editBalanceVal).toLocaleString()}`,
          type: 'success'
        });
        setSelectedUser(null);
        setEditBalanceVal('');
        fetchData();
      } else {
        setModal({ show: true, title: 'Failed', message: data.message || 'Could not update balance.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setModal({ show: true, title: 'Error', message: 'Something went wrong.', type: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setActionLoading(`${id}-delete-user`);
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/auth/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setModal({
          show: true,
          title: 'Deleted',
          message: 'User and all associated logs have been deleted.',
          type: 'success'
        });
        fetchData();
      } else {
        setModal({ show: true, title: 'Failed', message: data.message || 'Could not delete user.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setModal({ show: true, title: 'Error', message: 'Something went wrong.', type: 'error' });
    } finally {
      setActionLoading(null);
      setDeleteUserConfirm(null);
    }
  };

  const togglePartnerExpand = async (partnerId: string) => {
    if (expandedPartners[partnerId]) {
      setExpandedPartners(prev => ({ ...prev, [partnerId]: false }));
      return;
    }

    setLoadingUsers(prev => ({ ...prev, [partnerId]: true }));
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/auth/admin/partners/${partnerId}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPartnerUsers(prev => ({ ...prev, [partnerId]: data.data }));
        setExpandedPartners(prev => ({ ...prev, [partnerId]: true }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUsers(prev => ({ ...prev, [partnerId]: false }));
    }
  };

  const copyPartnerLink = (code: string, id: string) => {
    const link = `${origin}/register?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedPartnerId(id);
    setTimeout(() => setCopiedPartnerId(null), 2000);
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

      {/* Header and Refresh Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#1d1d1f]">Admin <span className="gradient-text">Console</span></h1>
          <p className="text-[12px] text-[#86868b]">Manage deposits, withdrawals, users and approvals</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="px-3.5 py-2 rounded-xl bg-white/80 border border-[#e6e6eb] text-[13px] font-medium text-[#515159] hover:text-[#1d1d1f] hover:bg-white flex items-center gap-2 shadow-sm transition-all"
        >
          <svg className={`w-4 h-4 text-[#5b5bd6] ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Premium Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-rise">
        {/* Total Deposits Card */}
        <div className="glass rounded-[24px] p-5 relative overflow-hidden border border-white/20 shadow-sm">
          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-emerald-500/10 rounded-full pointer-events-none blur-xl"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15a86b] flex items-center justify-center shadow-inner">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              </div>
              <div>
                <span className="text-[13px] text-[#86868b] font-medium block">Total Deposits</span>
                <span className="text-[11px] text-[#15a86b] font-semibold">{deposits.length} {deposits.length === 1 ? 'record' : 'records'}</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#86868b] bg-white/70 px-2.5 py-1 rounded-lg border border-[#e6e6eb]">
              $ {(deposits.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) / 278).toFixed(2)}
            </span>
          </div>

          <h3 className="text-[24px] sm:text-[28px] font-bold text-[#1d1d1f] font-mono tracking-tight mb-2">
            Rs {deposits.reduce((sum, d) => sum + (Number(d.amount) || 0), 0).toLocaleString()}
          </h3>

          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#f0f0f5]">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
              Approved: Rs {deposits.filter(d => d.status === 'approved').reduce((sum, d) => sum + (Number(d.amount) || 0), 0).toLocaleString()}
            </span>
            {deposits.filter(d => d.status === 'pending').length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                Pending: Rs {deposits.filter(d => d.status === 'pending').reduce((sum, d) => sum + (Number(d.amount) || 0), 0).toLocaleString()} ({deposits.filter(d => d.status === 'pending').length})
              </span>
            )}
          </div>
        </div>

        {/* Total Withdrawals Card */}
        <div className="glass rounded-[24px] p-5 relative overflow-hidden border border-white/20 shadow-sm">
          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-orange-500/10 rounded-full pointer-events-none blur-xl"></div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-inner">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" /></svg>
              </div>
              <div>
                <span className="text-[13px] text-[#86868b] font-medium block">Total Withdrawals</span>
                <span className="text-[11px] text-orange-600 font-semibold">{withdrawals.length} {withdrawals.length === 1 ? 'record' : 'records'}</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#86868b] bg-white/70 px-2.5 py-1 rounded-lg border border-[#e6e6eb]">
              $ {(withdrawals.reduce((sum, w) => sum + (Number(w.amount) || 0), 0) / 278).toFixed(2)}
            </span>
          </div>

          <h3 className="text-[24px] sm:text-[28px] font-bold text-[#1d1d1f] font-mono tracking-tight mb-2">
            Rs {withdrawals.reduce((sum, w) => sum + (Number(w.amount) || 0), 0).toLocaleString()}
          </h3>

          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#f0f0f5]">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
              Approved: Rs {withdrawals.filter(w => w.status === 'approved').reduce((sum, w) => sum + (Number(w.amount) || 0), 0).toLocaleString()}
            </span>
            {withdrawals.filter(w => w.status === 'pending').length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                Pending: Rs {withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + (Number(w.amount) || 0), 0).toLocaleString()} ({withdrawals.filter(w => w.status === 'pending').length})
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2 flex-wrap">
          <button
            onClick={() => setTab('deposits')}
            className={`flex-1 min-w-[80px] py-3.5 rounded-xl font-medium text-[14px] transition-all flex items-center justify-center gap-1.5 ${tab === 'deposits' ? 'text-white shadow-lg' : 'btn-ghost'}`}
            style={tab === 'deposits' ? { background: 'linear-gradient(118deg,#f97316,#ea580c)', boxShadow: '0 10px 30px -8px rgba(249,115,22,0.45)' } : undefined}
          >
              <span>Deposits</span>
              {deposits.filter(d => d.status === 'pending').length > 0 && (
                <span className={`px-1.5 py-0.2 text-[11px] rounded-full font-bold ${tab === 'deposits' ? 'bg-white text-orange-600' : 'bg-orange-500 text-white'}`}>
                  {deposits.filter(d => d.status === 'pending').length}
                </span>
              )}
          </button>
          <button
            onClick={() => setTab('withdrawals')}
            className={`flex-1 min-w-[80px] py-3.5 rounded-xl font-medium text-[14px] transition-all flex items-center justify-center gap-1.5 ${tab === 'withdrawals' ? 'text-white shadow-lg' : 'btn-ghost'}`}
            style={tab === 'withdrawals' ? { background: 'linear-gradient(118deg,#f97316,#ea580c)', boxShadow: '0 10px 30px -8px rgba(249,115,22,0.45)' } : undefined}
          >
              <span>Withdrawals</span>
              {withdrawals.filter(w => w.status === 'pending').length > 0 && (
                <span className={`px-1.5 py-0.2 text-[11px] rounded-full font-bold ${tab === 'withdrawals' ? 'bg-white text-orange-600' : 'bg-orange-500 text-white'}`}>
                  {withdrawals.filter(w => w.status === 'pending').length}
                </span>
              )}
          </button>
          <button
            onClick={() => setTab('referrals')}
            className={`flex-1 min-w-[80px] py-3.5 rounded-xl font-medium text-[14px] transition-all ${tab === 'referrals' ? 'text-white' : 'btn-ghost'}`}
            style={tab === 'referrals' ? { background: 'linear-gradient(118deg,#f97316,#ea580c)', boxShadow: '0 10px 30px -8px rgba(249,115,22,0.45)' } : undefined}
          >
              Referrals
          </button>
          <button
            onClick={() => setTab('partners')}
            className={`flex-1 min-w-[80px] py-3.5 rounded-xl font-medium text-[14px] transition-all ${tab === 'partners' ? 'text-white' : 'btn-ghost'}`}
            style={tab === 'partners' ? { background: 'linear-gradient(118deg,#f97316,#ea580c)', boxShadow: '0 10px 30px -8px rgba(249,115,22,0.45)' } : undefined}
          >
              Partners
          </button>
          <button
            onClick={() => setTab('users')}
            className={`flex-1 min-w-[80px] py-3.5 rounded-xl font-medium text-[14px] transition-all ${tab === 'users' ? 'text-white' : 'btn-ghost'}`}
            style={tab === 'users' ? { background: 'linear-gradient(118deg,#f97316,#ea580c)', boxShadow: '0 10px 30px -8px rgba(249,115,22,0.45)' } : undefined}
          >
              Users
          </button>
      </div>

      <div className="space-y-4">
        {tab === 'deposits' ? (
            deposits.length === 0 ? (
                <div className="text-center p-12 glass rounded-3xl border border-white/40 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 mx-auto flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <h4 className="text-[15px] font-semibold text-[#1d1d1f]">No deposit requests found</h4>
                    <p className="text-[#86868b] text-[13px] max-w-sm mx-auto">When users submit a JazzCash or bank deposit with proof screenshot, it will appear here for verification and approval.</p>
                    <button onClick={() => fetchData(true)} className="btn-secondary text-[13px] px-4 py-2 mt-2">Check for new deposits</button>
                </div>
            ) : (
                deposits.map((deposit) => (
                    <div key={deposit._id} className="glass rounded-[24px] p-5 relative overflow-hidden border border-white/30 shadow-sm hover:shadow-md transition-all">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1.5 ${
                                    deposit.status === 'pending' ? 'bg-orange-50 text-orange-600 border border-orange-200' : deposit.status === 'approved' ? 'bg-emerald-50 text-[#15a86b] border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                                }`}>
                                    {deposit.status === 'pending' && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
                                    {deposit.status === 'approved' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                                    <span className="capitalize">{deposit.status}</span>
                                </span>

                                {deposit.planName && (
                                    <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-[#5b5bd6]/10 text-[#5b5bd6] border border-[#5b5bd6]/20">
                                        {deposit.planName}
                                    </span>
                                )}
                            </div>

                            <span className="text-[11px] text-[#86868b] font-medium">
                                {deposit.createdAt ? new Date(deposit.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                        </div>

                        {/* Main Body */}
                        <div className="flex gap-4 items-start mb-5">
                            {/* Screenshot proof */}
                            <div 
                                className="w-24 h-24 rounded-2xl bg-[#f5f5f7] border border-[#e6e6eb] flex-shrink-0 cursor-pointer overflow-hidden group relative shadow-inner" 
                                onClick={() => setSelectedImage(deposit.screenshot)}
                                title="Click to view full image"
                            >
                                <img src={deposit.screenshot} alt="Payment Proof" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg>
                                </div>
                            </div>

                            {/* User & Transaction Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-[16px] font-bold tracking-tight truncate text-[#1d1d1f]">
                                    {deposit.user?.firstName} {deposit.user?.lastName}
                                </h3>
                                <p className="text-[12px] text-[#86868b] truncate mb-2">
                                    {deposit.user?.email} {deposit.user?.phone ? `• ${deposit.user.phone}` : ''}
                                </p>

                                {deposit.transactionId && (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f5f5f7] border border-[#e6e6eb] text-[11px] font-mono text-[#1d1d1f] mb-3">
                                        <span className="text-[#86868b]">Trx ID:</span>
                                        <span className="font-semibold">{deposit.transactionId}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    <div className="p-2.5 rounded-xl bg-white/60 border border-white/60">
                                        <span className="text-[10px] text-[#86868b] block uppercase tracking-wider font-semibold">Amount</span>
                                        <span className="text-[16px] font-bold text-[#15a86b] font-mono block">Rs {deposit.amount.toLocaleString()}</span>
                                        <span className="text-[10px] font-mono text-[#86868b]">$ {(deposit.amount / 278).toFixed(2)}</span>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-white/60 border border-white/60">
                                        <span className="text-[10px] text-[#86868b] block uppercase tracking-wider font-semibold">Method</span>
                                        <span className="text-[15px] font-bold text-[#5b5bd6] capitalize block truncate">{deposit.paymentMethod}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2.5 pt-2 border-t border-[#f0f0f5]">
                            {deposit.status === 'pending' && (
                                <>
                                    <button 
                                        onClick={() => handleStatusUpdate(deposit._id, 'deposits', 'approved')} 
                                        disabled={actionLoading !== null}
                                        className="flex-1 font-semibold text-[14px] py-3 rounded-xl text-white shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5" 
                                        style={{ background: 'linear-gradient(118deg,#10b981,#059669)', boxShadow: '0 10px 25px -8px rgba(16,185,129,0.5)' }}
                                    >
                                        {actionLoading === `${deposit._id}-approved` ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                <span>Approve</span>
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        onClick={() => handleStatusUpdate(deposit._id, 'deposits', 'rejected')} 
                                        disabled={actionLoading !== null}
                                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold text-[14px] py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                                    >
                                        {actionLoading === `${deposit._id}-rejected` ? (
                                            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                <span>Reject</span>
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                            <button 
                                onClick={() => setDeleteConfirm({ id: deposit._id, type: 'deposits' })} 
                                title="Delete" 
                                className={`${deposit.status === 'pending' ? 'w-12' : 'w-full'} flex items-center justify-center gap-2 bg-[#f5f5f7] hover:bg-red-50 text-[#86868b] hover:text-red-600 border border-[#e6e6eb] hover:border-red-200 font-medium text-[14px] py-3 rounded-xl transition-colors`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" /></svg>
                                {deposit.status !== 'pending' && <span>Delete</span>}
                            </button>
                        </div>
                    </div>
                ))
            )
        ) : tab === 'withdrawals' ? (
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
                            <div className="flex gap-6 flex-wrap">
                                <div className="flex flex-col">
                                    <span className="text-[11px] text-[#86868b]">Amount</span>
                                    <span className="text-[16px] font-semibold text-red-600">Rs {withdrawal.amount.toLocaleString()}</span>
                                    <span className="text-[11px] font-mono text-[#86868b]">$ {(withdrawal.amount / 278).toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] text-[#86868b]">Method</span>
                                    <span className="text-[16px] font-semibold text-orange-600">{withdrawal.paymentMethod}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] text-[#86868b]">Processing Time</span>
                                    <span className={`text-[14px] font-semibold flex items-center gap-1.5 ${withdrawal.fastTrack ? 'text-emerald-600' : 'text-[#86868b]'}`}>
                                        {withdrawal.fastTrack ? (
                                            <>
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Fast Track (6h)
                                            </>
                                        ) : (
                                            'Normal (24h)'
                                        )}
                                    </span>
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
        ) : tab === 'referrals' ? (
            referralGroups.length === 0 ? (
                <div className="text-center p-10 glass-soft rounded-2xl text-[#86868b] text-[13px]">No referral activity yet.</div>
            ) : (
                referralGroups.map((group) => {
                    const isOpen = !!expanded[group._id];
                    return (
                        <div key={group._id} className="glass rounded-2xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[11px] font-medium bg-[#eef0ff] text-[#5b5bd6]">
                                {group.referredUsers.length} invited
                            </div>
                            <div className="mb-4">
                                <h3 className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">{group.firstName} {group.lastName}</h3>
                                <p className="text-[12px] text-[#86868b]">{group.email}</p>
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className="chip px-2.5 py-1 rounded-full text-[11px] font-mono">{group.referralCode}</span>
                                    <span className="text-[11px] text-[#86868b]">Balance: <span className="font-semibold text-[#15a86b]">Rs {Math.round(group.affiliateBalance).toLocaleString()}</span></span>
                                    <span className="text-[11px] text-[#86868b]">Earned: <span className="font-semibold text-[#1d1d1f]">Rs {Math.round(group.affiliateEarnedTotal).toLocaleString()}</span></span>
                                </div>
                            </div>
                            <button
                                onClick={() => setExpanded(prev => ({ ...prev, [group._id]: !prev[group._id] }))}
                                className="btn-ghost w-full py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2"
                            >
                                {isOpen ? 'Hide' : 'View'} referred users
                                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {isOpen && (
                                <div className="mt-3 space-y-1.5">
                                    {group.referredUsers.map((u) => (
                                        <div key={u._id} className="flex items-center justify-between p-3 rounded-xl bg-[#f5f5f7]">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-xl bg-white text-[#5b5bd6] flex items-center justify-center font-semibold text-[12px] flex-shrink-0">
                                                    {u.firstName[0]}{u.lastName[0]}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-[13px] font-medium tracking-tight truncate">{u.firstName} {u.lastName}</h4>
                                                    <p className="text-[11px] text-[#86868b] truncate">{u.email}</p>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-[#86868b] flex-shrink-0 ml-2">{new Date(u.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })
            )
        ) : tab === 'partners' ? (
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-[18px] font-semibold tracking-tight text-[#1d1d1f]">Partner Referral Codes</h2>
                        <p className="text-[12px] text-[#86868b]">Create and manage partner tracking links</p>
                    </div>
                    <button
                        onClick={() => setShowAddPartner(true)}
                        className="py-2.5 px-4 rounded-xl text-white font-medium text-[13px] flex items-center gap-1.5 transition-all"
                        style={{ background: 'linear-gradient(118deg,#f97316,#ea580c)', boxShadow: '0 4px 12px -3px rgba(249,115,22,0.3)' }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                        Add Partner
                    </button>
                </div>

                {partners.length === 0 ? (
                    <div className="text-center p-10 glass-soft rounded-2xl text-[#86868b] text-[13px]">No partners added yet.</div>
                ) : (
                    partners.map((partner) => {
                        const isExpanded = !!expandedPartners[partner._id];
                        const users = partnerUsers[partner._id] || [];
                        const isCopied = copiedPartnerId === partner._id;
                        const partnerLink = `${origin}/register?ref=${partner.code}`;

                        return (
                            <div key={partner._id} className="glass rounded-2xl p-5 relative overflow-hidden">
                                <div className="mb-4">
                                    <h3 className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">{partner.name}</h3>
                                    {partner.email && <p className="text-[12px] text-[#86868b]">{partner.email}</p>}
                                    {partner.notes && <p className="text-[12px] text-[#86868b] mt-1.5 italic">"{partner.notes}"</p>}

                                    <div className="mt-4 glass-soft rounded-xl p-3 flex items-center justify-between gap-3">
                                        <span className="text-[11px] font-mono text-orange-600 break-all select-all truncate">{partnerLink}</span>
                                        <button
                                            onClick={() => copyPartnerLink(partner.code, partner._id)}
                                            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all shrink-0 flex items-center gap-1 ${
                                                isCopied ? 'bg-emerald-50 text-[#15a86b]' : 'bg-white hover:bg-orange-50 text-[#86868b] hover:text-orange-600 border border-[#e6e6eb]'
                                            }`}
                                        >
                                            {isCopied ? (
                                                <>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="bg-[#f5f5f7] rounded-xl p-3 text-center">
                                            <span className="text-[10px] text-[#86868b] block font-medium">Registered Users</span>
                                            <span className="text-[18px] font-bold text-[#1d1d1f]">{partner.registered}</span>
                                        </div>
                                        <div className="bg-[#f5f5f7] rounded-xl p-3 text-center">
                                            <span className="text-[10px] text-[#86868b] block font-medium">Active Users</span>
                                            <span className="text-[18px] font-bold text-emerald-600">{partner.active}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => togglePartnerExpand(partner._id)}
                                        disabled={loadingUsers[partner._id]}
                                        className="flex-1 btn-ghost py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-1.5 disabled:opacity-50"
                                    >
                                        {loadingUsers[partner._id] ? 'Loading...' : (isExpanded ? 'Hide' : 'View') + ' referred users'}
                                        {!loadingUsers[partner._id] && (
                                            <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setDeletePartnerConfirm(partner)}
                                        title="Delete Partner"
                                        className="w-10 flex items-center justify-center bg-[#f5f5f7] hover:bg-red-50 text-[#86868b] hover:text-red-600 border border-[#e6e6eb] hover:border-red-200 rounded-xl transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" /></svg>
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-[#e6e6eb] space-y-1.5 animate-rise">
                                        <h4 className="text-[12px] font-semibold text-[#1d1d1f] mb-2 px-1">Referred users under partner ({users.length}):</h4>
                                        {users.length === 0 ? (
                                            <p className="text-center py-4 text-[#86868b] text-[12px]">No users registered under this partner link yet.</p>
                                        ) : (
                                            users.map((u) => (
                                                <div key={u._id} className="flex items-center justify-between p-3 rounded-xl bg-[#f5f5f7] gap-3">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-8 h-8 rounded-lg bg-white text-orange-600 flex items-center justify-center font-semibold text-[11px] shrink-0 border border-[#e6e6eb]">
                                                            {(u.firstName?.[0] || '') + (u.lastName?.[0] || '')}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h5 className="text-[12.5px] font-medium tracking-tight truncate text-[#1d1d1f]">{u.firstName} {u.lastName}</h5>
                                                            <p className="text-[11px] text-[#86868b] truncate">{u.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0 flex flex-col items-end">
                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${u.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-500'}`}>
                                                            {u.isActive ? 'Active (Deposited)' : 'Registered'}
                                                        </span>
                                                        <span className="text-[9.5px] text-[#aeaeb5] mt-1">{new Date(u.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        ) : (
            <div className="space-y-5">
                <div className="flex flex-col gap-1">
                    <h2 className="text-[18px] font-semibold tracking-tight text-[#1d1d1f]">User Management</h2>
                    <p className="text-[12px] text-[#86868b]">View balances, edit credits, and delete user accounts</p>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email..."
                        className="input-light w-full rounded-xl pl-10 pr-4 py-2.5 text-[13px] font-medium"
                    />
                    <svg className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>

                <div className="space-y-3">
                    {usersList.filter(u => {
                        const q = searchQuery.toLowerCase();
                        const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
                        const email = (u.email || '').toLowerCase();
                        return fullName.includes(q) || email.includes(q);
                    }).length === 0 ? (
                        <div className="text-center p-10 glass-soft rounded-2xl text-[#86868b] text-[13px]">No users found.</div>
                    ) : (
                        usersList.filter(u => {
                            const q = searchQuery.toLowerCase();
                            const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
                            const email = (u.email || '').toLowerCase();
                            return fullName.includes(q) || email.includes(q);
                        }).map((user) => (
                            <div key={user._id} className="glass rounded-2xl p-5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-medium bg-[#f5f5f7] text-[#86868b]">
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex gap-4 items-start mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#f97316] flex items-center justify-center font-bold text-[14px] shrink-0 border border-[#e6e6eb]">
                                        {((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-[14px] font-semibold tracking-tight text-[#1d1d1f] truncate">
                                            {user.firstName} {user.lastName} {user.role === 'admin' && <span className="text-[9px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full border border-purple-100 font-semibold align-middle ml-1">Admin</span>}
                                        </h3>
                                        <p className="text-[11.5px] text-[#86868b] truncate mb-2">{user.email}</p>
                                        
                                        <div className="flex gap-6 mt-1 flex-wrap">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-[#86868b]">Deposited Balance</span>
                                                <span className="text-[14px] font-semibold text-[#15a86b]">Rs {(user.balance || 0).toLocaleString()}</span>
                                                <span className="text-[10px] font-mono text-[#86868b]">$ {((user.balance || 0) / 278).toFixed(2)} · Rs {(user.depositedTotal || 0).toLocaleString()} approved</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-[#86868b]">Affiliate Balance</span>
                                                <span className="text-[14px] font-semibold text-orange-600">Rs {Math.round(user.affiliateBalance || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {user.role !== 'admin' && (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setEditBalanceVal(String(user.balance || user.depositedTotal || 0));
                                            }}
                                            className="flex-1 btn-ghost py-2 rounded-xl text-[12px] font-medium flex items-center justify-center gap-1.5"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            Edit Balance
                                        </button>
                                        <button
                                            onClick={() => setDeleteUserConfirm(user)}
                                            className="w-10 flex items-center justify-center bg-[#f5f5f7] hover:bg-red-50 text-[#86868b] hover:text-red-600 border border-[#e6e6eb] hover:border-red-200 rounded-xl transition-colors"
                                            title="Delete User"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" /></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}
      </div>

      {/* Modals remain same as before for visual consistency, but with padding-bottom to clear bottom nav */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm pb-[92px] pt-[80px]">
            <div className="glass rounded-3xl p-8 max-w-sm w-full text-center max-h-[80vh] overflow-y-auto">
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

      {deletePartnerConfirm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm pb-[92px] pt-[80px]">
            <div className="glass rounded-3xl p-8 max-w-sm w-full text-center max-h-[80vh] overflow-y-auto">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-red-50 text-red-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" /></svg>
                </div>
                <h3 className="text-[18px] font-semibold tracking-tight text-[#1d1d1f] mb-2">Delete Partner?</h3>
                <p className="text-[#86868b] text-[13px] mb-8">This will permanently delete "{deletePartnerConfirm.name}" and their referral link. Existing users will remain in the system.</p>
                <div className="flex gap-3">
                    <button onClick={() => setDeletePartnerConfirm(null)} className="btn-ghost flex-1 py-3.5 rounded-xl font-medium text-[15px]">Cancel</button>
                    <button onClick={() => handleDeletePartner(deletePartnerConfirm._id)} disabled={actionLoading === `${deletePartnerConfirm._id}-delete-partner`} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-medium text-[15px] disabled:opacity-60 transition-colors">
                        {actionLoading === `${deletePartnerConfirm._id}-delete-partner` ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-sm pb-[92px] pt-[80px]">
            <div className="glass rounded-[24px] p-5 sm:p-6 max-w-md w-full relative max-h-[calc(100vh-200px)] flex flex-col overflow-hidden">
                <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 p-2 text-[#aeaeb5] hover:text-[#1d1d1f] transition-colors rounded-lg hover:bg-[#f5f5f7] z-10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="mb-4 shrink-0">
                    <h3 className="text-[18px] font-semibold tracking-tight text-[#1d1d1f]">Edit Deposited Balance</h3>
                    <p className="text-[11px] text-[#86868b] mt-0.5">This is the user's deposited/invested balance shown on their dashboard for {selectedUser.firstName} {selectedUser.lastName}</p>
                </div>
                <form onSubmit={handleEditBalance} className="space-y-4 overflow-y-auto pr-1 flex-1 pb-2">
                    <div>
                        <label className="block text-[11px] font-medium text-[#515159] mb-1 px-1">User Email</label>
                        <div className="bg-[#f5f5f7] px-3.5 py-2.5 rounded-xl text-[13px] font-mono text-[#86868b] select-all truncate border border-[#e6e6eb]">
                            {selectedUser.email}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-[#515159] mb-1 px-1">New Balance (PKR) *</label>
                        <input
                            type="number"
                            value={editBalanceVal}
                            onChange={(e) => setEditBalanceVal(e.target.value)}
                            className="input-light w-full rounded-xl px-3.5 py-2.5 text-[13px] font-medium"
                            placeholder="Enter balance in PKR"
                            required
                            min="0"
                        />
                        <p className="text-[11px] text-[#86868b] mt-1.5 font-mono px-1">
                            Estimated USD: <span className="text-[#15a86b] font-semibold">$ {editBalanceVal && !isNaN(Number(editBalanceVal)) ? (Number(editBalanceVal) / 278).toFixed(2) : '0.00'}</span>
                        </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#eef0ff] border border-[#dadcff]">
                        <div className="min-w-0">
                            <p className="text-[10px] text-[#86868b]">Approved deposits total</p>
                            <p className="text-[14px] font-semibold text-[#5b5bd6]">Rs {(selectedUser.depositedTotal || 0).toLocaleString()}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setEditBalanceVal(String(selectedUser.depositedTotal || 0))}
                            className="btn-ghost shrink-0 px-3 py-2 rounded-lg text-[12px] font-medium"
                        >
                            Set to deposited
                        </button>
                    </div>
                    <div className="flex gap-3 pt-2 shrink-0">
                        <button type="button" onClick={() => setSelectedUser(null)} className="btn-ghost flex-1 py-2.5 rounded-xl font-medium text-[13px]">Cancel</button>
                        <button type="submit" disabled={actionLoading === 'edit-balance'} className="flex-1 text-white font-medium text-[13px] py-2.5 rounded-xl flex items-center justify-center animate-pulse-soft" style={{ background: 'linear-gradient(118deg,#f97316,#ea580c)', boxShadow: '0 6px 16px -4px rgba(249,115,22,0.4)' }}>
                            {actionLoading === 'edit-balance' ? 'Updating...' : 'Update Balance'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {deleteUserConfirm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm pb-[92px] pt-[80px]">
            <div className="glass rounded-3xl p-8 max-w-sm w-full text-center max-h-[80vh] overflow-y-auto">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center bg-red-50 text-red-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" /></svg>
                </div>
                <h3 className="text-[18px] font-semibold tracking-tight text-[#1d1d1f] mb-2">Delete User Account?</h3>
                <p className="text-[#86868b] text-[13px] mb-4">
                    Are you sure you want to delete <span className="font-semibold text-[#1d1d1f]">{deleteUserConfirm.firstName} {deleteUserConfirm.lastName}</span> ({deleteUserConfirm.email})?
                </p>
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl mb-6 text-left">
                    <span className="text-[11px] font-semibold text-red-700 block mb-1">⚠️ CRITICAL WARNING:</span>
                    <span className="text-[10.5px] text-red-600 leading-relaxed block">
                        This will permanently delete the user and **permanently wipe all associated deposits, withdrawals, and affiliate commissions**. This action is irreversible.
                    </span>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setDeleteUserConfirm(null)} className="btn-ghost flex-1 py-3.5 rounded-xl font-medium text-[15px]">Cancel</button>
                    <button onClick={() => handleDeleteUser(deleteUserConfirm._id)} disabled={actionLoading === `${deleteUserConfirm._id}-delete-user`} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-medium text-[15px] disabled:opacity-60 transition-colors">
                        {actionLoading === `${deleteUserConfirm._id}-delete-user` ? 'Deleting...' : 'Delete User'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {showAddPartner && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-sm pb-[92px] pt-[80px]">
            <div className="glass rounded-[24px] p-5 sm:p-6 max-w-md w-full relative max-h-[calc(100vh-200px)] flex flex-col overflow-hidden">
                <button onClick={() => setShowAddPartner(false)} className="absolute top-4 right-4 p-2 text-[#aeaeb5] hover:text-[#1d1d1f] transition-colors rounded-lg hover:bg-[#f5f5f7] z-10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="mb-4 shrink-0">
                    <h3 className="text-[18px] font-semibold tracking-tight text-[#1d1d1f]">Add Partner</h3>
                    <p className="text-[11px] text-[#86868b] mt-0.5">Assign a unique referral code to a new partner</p>
                </div>
                <form onSubmit={handleCreatePartner} className="space-y-3.5 overflow-y-auto pr-1 flex-1 pb-2">
                    <div>
                        <label className="block text-[11px] font-medium text-[#515159] mb-1 px-1">Partner Name *</label>
                        <input
                            type="text"
                            value={newPartner.name}
                            onChange={(e) => setNewPartner(prev => ({ ...prev, name: e.target.value }))}
                            className="input-light w-full rounded-xl px-3.5 py-2.5 text-[13px] font-medium"
                            placeholder="e.g. John's Trading Channel"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-[#515159] mb-1 px-1">Email Address</label>
                        <input
                            type="email"
                            value={newPartner.email}
                            onChange={(e) => setNewPartner(prev => ({ ...prev, email: e.target.value }))}
                            className="input-light w-full rounded-xl px-3.5 py-2.5 text-[13px] font-medium"
                            placeholder="partner@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-[#515159] mb-1 px-1">Referral Code (Optional)</label>
                        <input
                            type="text"
                            value={newPartner.code}
                            onChange={(e) => setNewPartner(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                            className="input-light w-full rounded-xl px-3.5 py-2.5 text-[13px] font-medium uppercase"
                            placeholder="Auto-generated if empty"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-medium text-[#515159] mb-1 px-1">Admin Notes</label>
                        <textarea
                            value={newPartner.notes}
                            onChange={(e) => setNewPartner(prev => ({ ...prev, notes: e.target.value }))}
                            className="input-light w-full rounded-xl px-3.5 py-2.5 text-[13px] font-medium h-20 resize-none"
                            placeholder="Add partner contact info, agreement notes, etc."
                        />
                    </div>
                    <div className="flex gap-3 pt-2 shrink-0">
                        <button type="button" onClick={() => setShowAddPartner(false)} className="btn-ghost flex-1 py-2.5 rounded-xl font-medium text-[13px]">Cancel</button>
                        <button type="submit" disabled={actionLoading === 'create-partner'} className="flex-1 text-white font-medium text-[13px] py-2.5 rounded-xl flex items-center justify-center animate-pulse-soft" style={{ background: 'linear-gradient(118deg,#f97316,#ea580c)', boxShadow: '0 6px 16px -4px rgba(249,115,22,0.4)' }}>
                            {actionLoading === 'create-partner' ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Full Screenshot" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl border border-white/10" />
        </div>
      )}
      {modal.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm pb-[92px] pt-[80px]">
            <div className="glass rounded-3xl p-8 max-w-sm w-full text-center max-h-[80vh] overflow-y-auto">
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
