import React, { useEffect, useState } from 'react';
import {
  Building2,
  FileText,
  GraduationCap,
  Rocket,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiRequest } from '../../lib/api';
import type { SystemAlert } from '../../types';

import { AdminSidebar } from './AdminSidebar';

type AdminTab = 'dashboard' | 'control';
type AdminDashboardProps = { initialTab?: AdminTab };
type QueueIcon = 'project' | 'company' | 'student';
type QueueItem = {
  id: string;
  title: string;
  company: string;
  submitted: string;
  icon: QueueIcon;
};
type CompanyToVerify = { id: string; name: string; task: string; image: string | null };
type DashboardMetrics = {
  totalStudents: number;
  totalCompanies: number;
  approvedProjects: number;
  pendingValidations: number;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'dashboard' }) => {
  const { currentUser, approveProject, rejectProject, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [metricsError, setMetricsError] = useState('');
  const [metricsRefresh, setMetricsRefresh] = useState(0);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [queueLoading, setQueueLoading] = useState(true);
  const [queueError, setQueueError] = useState('');
  const [queueRefresh, setQueueRefresh] = useState(0);
  const [companies, setCompanies] = useState<CompanyToVerify[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companiesError, setCompaniesError] = useState('');
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [actionError, setActionError] = useState('');

  useEffect(() => setActiveTab(initialTab), [initialTab]);

  useEffect(() => {
    let active = true;
    setMetricsError('');
    void apiRequest<DashboardMetrics>('/admin/dashboard')
      .then((result) => { if (active) setMetrics(result); })
      .catch((requestError: unknown) => {
        if (active) setMetricsError(requestError instanceof Error ? requestError.message : 'Unable to load dashboard metrics.');
      });
    return () => { active = false; };
  }, [metricsRefresh]);

  useEffect(() => {
    let active = true;
    setCompaniesLoading(true);
    setCompaniesError('');
    void apiRequest<{ validations: Array<{ id: string; title: string; detail: string; submitterName: string; imageUrl: string | null }> }>(
      '/admin/validations?type=company&page=1&pageSize=3'
    )
      .then(({ validations }) => {
        if (active) {
          setCompanies(validations.map((company) => ({
            id: company.id,
            name: company.title,
            task: `${company.submitterName} · ${company.detail}`,
            image: company.imageUrl,
          })));
        }
      })
      .catch((requestError: unknown) => {
        if (active) setCompaniesError(requestError instanceof Error ? requestError.message : 'Unable to load company verifications.');
      })
      .finally(() => { if (active) setCompaniesLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setQueueLoading(true);
    setQueueError('');
    void apiRequest<{ validations: Array<{ id: string; title: string; submitterName: string; submittedAt: string }> }>(
      '/admin/validations?type=project&page=1&pageSize=4'
    )
      .then(({ validations }) => {
        if (active) {
          setQueue(validations.map((project) => ({
            id: project.id,
            title: project.title,
            company: project.submitterName,
            submitted: new Date(project.submittedAt).toLocaleDateString(),
            icon: 'project' as const,
          })));
        }
      })
      .catch((requestError: unknown) => {
        if (active) setQueueError(requestError instanceof Error ? requestError.message : 'Unable to load project reviews.');
      })
      .finally(() => { if (active) setQueueLoading(false); });
    return () => { active = false; };
  }, [queueRefresh]);

  const notify = (title: string, type: SystemAlert['type']) =>
    setAlerts((previous) => [
      { id: `alert-${Date.now()}`, title, detail: 'Moderation decision saved.', timeAgo: 'Just now', type },
      ...previous,
    ]);

  const decide = async (item: QueueItem, decision: 'approve' | 'reject') => {
    setActionError('');
    try {
      if (decision === 'approve') await approveProject(item.id);
      else await rejectProject(item.id);
      notify(`${decision === 'approve' ? 'Approved' : 'Rejected'}: ${item.title}`, decision === 'approve' ? 'success' : 'warning');
      setMetricsRefresh((value) => value + 1);
      setQueueRefresh((value) => value + 1);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Project moderation failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-auto bg-[#f9f9fc] font-['League_Spartan',sans-serif] text-[#1a1c1e]">
      <header className="fixed inset-x-0 top-0 z-30 flex h-20 items-center justify-between border-b border-[rgba(192,199,211,0.1)] bg-[rgba(248,249,250,0.8)] px-6 backdrop-blur-md sm:px-10">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setCurrentView('admin_dashboard')} className="text-[36px] font-bold leading-none tracking-[-0.02em] text-[#005f9f]">
            internspace
          </button>
          <span className="rounded-full bg-[#0078c7] px-3 py-1 text-[10px] uppercase tracking-[0.05em] text-white">Admin</span>
        </div>
        <div className="flex items-center gap-3 border-l border-[#c0c7d3] pl-4">
          <div className="text-right">
            <p className="text-sm leading-5">{currentUser?.name ?? 'Administrator'}</p>
            <p className="text-[10px] uppercase leading-4 text-[#707882]">Super Admin</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#d1e4ff] bg-[#d1e4ff] text-sm font-bold text-[#005f9f]" aria-hidden="true">
            {(currentUser?.name ?? 'A').split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
          </span>
        </div>
      </header>

      <AdminSidebar
        activeView={activeTab === 'control' ? 'admin_control' : 'admin_dashboard'}
        onNavigate={(view) => setCurrentView(view)}
      />

      <main className="ml-64 min-h-full px-6 pb-12 pt-28 sm:px-10 max-[1100px]:ml-[204px] max-[1100px]:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
          <div>
            <h1 className="text-[32px] font-semibold leading-[1.4] tracking-[-0.01em]">Administration Dashboard</h1>
            <p className="text-base leading-[1.6] text-[#404751]">Project moderation and premium payment review.</p>
          </div>

          {metricsError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{metricsError}</p>}

          <section className="grid gap-6 lg:grid-cols-4">
            <StatCard label="APPROVED PROJECTS" value={metrics ? String(metrics.approvedProjects) : '—'} note="Currently public" tone="blue" icon={<Rocket size={20} />} />
            <StatCard label={<>PENDING<br />VALIDATIONS</>} value={metrics ? String(metrics.pendingValidations) : '—'} note={metrics?.pendingValidations ? 'Requires attention' : 'No pending reviews'} tone="blue" icon={<FileText size={20} />} />
            <StatCard label="TOTAL STUDENTS" value={metrics ? String(metrics.totalStudents) : '—'} note="Registered student accounts" tone="dark" icon={<GraduationCap size={20} />} />
            <StatCard label={<>TOTAL<br />COMPANIES</>} value={metrics ? String(metrics.totalCompanies) : '—'} note="Registered company profiles" tone="dark" icon={<Building2 size={20} />} />
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {actionError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{actionError}</p>}
              <ValidationQueue queue={queue} loading={queueLoading} error={queueError} onDecision={decide} />
              <PendingPayments onReviewed={() => setMetricsRefresh((value) => value + 1)} />
              <CompanyVerification
                companies={companies}
                loading={companiesLoading}
                error={companiesError}
                onVerify={() => setCurrentView('admin_control')}
              />
            </div>
            <Alerts alerts={alerts} onClear={() => setAlerts([])} />
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard: React.FC<{ label: React.ReactNode; value: string; note: string; tone: 'blue' | 'dark'; icon: React.ReactNode }> = ({ label, value, note, tone, icon }) => (
  <div className="flex items-center justify-between rounded-[32px] border border-[rgba(192,199,211,0.3)] bg-white px-6 py-7 shadow-sm">
    <div>
      <p className="text-xs uppercase leading-3 tracking-[0.05em] text-[#707882]">{label}</p>
      <p className={`mt-1 text-[32px] leading-[1.4] tracking-[-0.01em] ${tone === 'blue' ? 'text-[#005f9f]' : 'text-[#1a1c1e]'}`}>{value}</p>
      <p className={`text-[10px] ${note.startsWith('+') ? 'text-[#16a34a]' : note === 'Requires attention' ? 'text-[#ba1a1a]' : 'text-[#707882]'}`}>{note}</p>
    </div>
    <span className={`grid h-12 w-12 place-items-center rounded-full ${tone === 'blue' ? 'bg-[#d1e4ff] text-[#005f9f]' : 'bg-[#eeeef0] text-[#555d63]'}`}>{icon}</span>
  </div>
);

const ValidationQueue: React.FC<{
  queue: QueueItem[];
  loading: boolean;
  error: string;
  onDecision: (item: QueueItem, decision: 'approve' | 'reject') => void | Promise<void>;
}> = ({ queue, loading, error, onDecision }) => (
  <section className="overflow-hidden rounded-[32px] border border-[rgba(192,199,211,0.3)] bg-white">
    <div className="border-b border-[rgba(192,199,211,0.2)] px-6 py-4">
      <h2 className="text-lg">Project Validation Queue</h2>
    </div>
    {error && <p role="alert" className="mx-6 mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {loading ? (
      <p role="status" className="px-6 py-5 text-sm text-[#707882]">Loading project reviews…</p>
    ) : !error && queue.length === 0 ? (
      <p className="px-6 py-5 text-sm text-[#707882]">No projects are waiting for review.</p>
    ) : queue.map((item, index) => (
      <div key={item.id} className={`flex items-center justify-between gap-4 px-6 py-4 ${index > 0 ? 'border-t border-[rgba(192,199,211,0.2)]' : ''}`}>
        <div className="flex min-w-0 items-center gap-4">
          <QueueIcon icon={item.icon} />
          <div className="min-w-0">
            <p className="truncate text-base leading-[1.6]">{item.title}</p>
            <p className="truncate text-sm leading-[1.6] text-[#707882]">{item.company} <span aria-hidden="true">•</span> {item.submitted}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => onDecision(item, 'reject')} className="rounded-full border border-[#ba1a1a] px-4 py-2 text-sm text-[#ba1a1a]">Reject</button>
          <button type="button" onClick={() => onDecision(item, 'approve')} className="rounded-full bg-[#005f9f] px-4 py-2 text-sm text-white">Approve</button>
        </div>
      </div>
    ))}
  </section>
);

const CompanyVerification: React.FC<{
  companies: CompanyToVerify[];
  loading: boolean;
  error: string;
  onVerify: (company: CompanyToVerify) => void;
}> = ({ companies, loading, error, onVerify }) => (
  <section className="overflow-hidden rounded-[32px] border border-[rgba(192,199,211,0.3)] bg-white">
    <div className="border-b border-[rgba(192,199,211,0.2)] px-6 py-4">
      <h2 className="text-lg">Company Account Verification</h2>
    </div>
    <div className="flex flex-wrap justify-center gap-4 px-6 py-6">
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {loading && <p role="status" className="text-sm text-[#707882]">Loading company verifications…</p>}
      {!loading && !error && companies.length === 0 && <p className="text-sm text-[#707882]">No companies are waiting for verification.</p>}
      {companies.map((company) => (
        <button key={company.id} type="button" onClick={() => onVerify(company)} className="flex w-full max-w-[278px] items-center gap-4 rounded-full border border-[rgba(192,199,211,0.5)] p-4 text-left hover:border-[#005f9f]">
          {company.image
            ? <img src={company.image} alt="" className="h-12 w-12 rounded-full object-cover" />
            : <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f3f3f6] text-[#707882]" aria-hidden="true"><Building2 size={20} /></span>}
          <span className="min-w-0 flex-1"><span className="block text-sm">{company.name}</span><span className="block text-xs text-[#707882]">{company.task}</span></span>
          <span className="text-xl text-[#005f9f]">›</span>
        </button>
      ))}
    </div>
  </section>
);

interface AdminTransaction {
  id: string;
  planName: string;
  amount: number;
  method: 'bank_transfer' | 'ewallet';
  proofUrl: string | null;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  userName?: string;
  userEmail?: string;
}

const PendingPayments: React.FC<{ onReviewed: () => void }> = ({ onReviewed }) => {
  const { reviewTransaction } = useApp();
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void apiRequest<{ transactions: AdminTransaction[] }>('/transactions/admin?status=pending')
      .then(({ transactions: results }) => { if (active) setTransactions(results); })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Unable to load payment reviews.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const review = async (transaction: AdminTransaction, status: 'verified' | 'rejected') => {
    setError('');
    setLoadingId(transaction.id);
    try {
      await reviewTransaction(transaction.id, status);
      setTransactions((previous) => previous.filter((item) => item.id !== transaction.id));
      onReviewed();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Payment review failed.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-[32px] border border-[rgba(192,199,211,0.3)] bg-white">
      <div className="border-b border-[rgba(192,199,211,0.2)] px-6 py-4">
        <h2 className="text-lg">Premium Payment Review</h2>
      </div>
      {error && <p role="alert" className="mx-6 mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading ? (
        <p role="status" className="px-6 py-5 text-sm text-[#707882]">Loading payment reviews…</p>
      ) : transactions.length === 0 && !error ? (
        <p className="px-6 py-5 text-sm text-[#707882]">No pending premium payments.</p>
      ) : transactions.map((transaction, index) => (
        <div key={transaction.id} className={`space-y-3 px-6 py-4 ${index > 0 ? 'border-t border-[rgba(192,199,211,0.2)]' : ''}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{transaction.planName} · Rp {transaction.amount.toLocaleString('id-ID')}</p>
              <p className="text-xs text-[#707882]">{transaction.userName} · {transaction.userEmail} · {transaction.method}</p>
            </div>
            {transaction.proofUrl && (
              <a href={transaction.proofUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#005f9f] underline">
                View payment proof
              </a>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" disabled={loadingId === transaction.id} onClick={() => void review(transaction, 'rejected')} className="rounded-full border border-[#ba1a1a] px-4 py-2 text-sm text-[#ba1a1a] disabled:opacity-50">Reject</button>
            <button type="button" disabled={!transaction.proofUrl || loadingId === transaction.id} onClick={() => void review(transaction, 'verified')} className="rounded-full bg-[#005f9f] px-4 py-2 text-sm text-white disabled:opacity-50">Verify</button>
          </div>
        </div>
      ))}
    </section>
  );
};

const Alerts: React.FC<{ alerts: SystemAlert[]; onClear: () => void }> = ({ alerts, onClear }) => (
  <section className="self-start overflow-hidden rounded-[32px] border border-[rgba(192,199,211,0.3)] bg-white">
    <div className="border-b border-[rgba(192,199,211,0.2)] px-6 py-4"><h2 className="text-lg">System Alerts</h2></div>
    <div className="space-y-5 px-6 py-6">
      {alerts.length === 0 ? <p className="text-sm text-[#707882]">All alerts have been cleared.</p> : alerts.slice(0, 3).map((alert, index) => (
        <div key={alert.id} className="flex gap-4">
          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${index === 0 ? 'bg-[#005f9f]' : index === 1 ? 'bg-[#ba1a1a]' : 'bg-[#555d63]'}`} />
          <div><p className="text-sm leading-[1.6]">{alert.title}</p><p className="text-xs text-[#707882]">{alert.timeAgo}</p></div>
        </div>
      ))}
    </div>
    <button type="button" onClick={onClear} className="w-full bg-[#eeeef0] py-3 text-sm text-[#404751]">Clear All Alerts</button>
  </section>
);

const QueueIcon: React.FC<{ icon: QueueIcon }> = ({ icon }) => {
  const Icon = icon === 'project' ? FileText : icon === 'company' ? ShieldCheck : Users;
  const colour = icon === 'project' ? 'bg-[rgba(0,95,159,0.1)] text-[#005f9f]' : icon === 'company' ? 'bg-[rgba(8,99,150,0.1)] text-[#086396]' : 'bg-[rgba(85,93,99,0.1)] text-[#555d63]';
  return <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${colour}`}><Icon size={20} /></span>;
};

export { AdminDashboard };
export default AdminDashboard;
