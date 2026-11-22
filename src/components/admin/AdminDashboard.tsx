import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  FileText,
  GraduationCap,
  Rocket,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sampleSystemAlerts } from '../../data/mockData';
import type { SystemAlert } from '../../types';

import alexRiveraAvatar from '../../assets/figma-admin/alex-rivera.jpeg';
import quantumCoreImage from '../../assets/figma-admin/quantum-core.jpeg';
import aetherEnergyImage from '../../assets/figma-admin/aether-energy.jpeg';
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
  source: 'demo' | 'context';
};
type CompanyToVerify = { id: string; name: string; task: string; image: string };

const initialQueue: QueueItem[] = [
  { id: 'proposal', title: 'AI Research Assistant', company: 'Neural Dynamics Inc.', submitted: 'Submitted 2h ago', icon: 'project', source: 'demo' },
  { id: 'sustainability', title: 'Sustainability Tracker', company: 'GreenStep Global', submitted: 'Submitted 5h ago', icon: 'company', source: 'demo' },
  { id: 'fintech', title: 'Fintech Compliance API', company: 'Vanguard Systems', submitted: 'Submitted 1d ago', icon: 'student', source: 'demo' },
];

const initialCompanies: CompanyToVerify[] = [
  { id: 'quantum', name: 'Quantum Core', task: 'Verify Business License', image: quantumCoreImage },
  { id: 'aether', name: 'Aether Energy', task: 'Verify Contact Details', image: aetherEnergyImage },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'dashboard' }) => {
  const { projects, approveProject, rejectProject, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [demoQueue, setDemoQueue] = useState(initialQueue);
  const [companies, setCompanies] = useState(initialCompanies);
  const [alerts, setAlerts] = useState<SystemAlert[]>(sampleSystemAlerts);

  useEffect(() => setActiveTab(initialTab), [initialTab]);

  const queue = useMemo<QueueItem[]>(
    () => [
      ...projects
        .filter((project) => project.status === 'pending')
        .map((project) => ({
          id: project.id,
          title: project.title,
          company: project.company,
          submitted: 'Submitted just now',
          icon: 'project' as const,
          source: 'context' as const,
        })),
      ...demoQueue,
    ],
    [demoQueue, projects],
  );

  const notify = (title: string, type: SystemAlert['type']) =>
    setAlerts((previous) => [
      { id: `alert-${Date.now()}`, title, detail: 'The submitter has been notified.', timeAgo: 'Just now', type },
      ...previous,
    ]);

  const decide = (item: QueueItem, decision: 'approve' | 'reject') => {
    if (item.source === 'context') {
      decision === 'approve' ? approveProject(item.id) : rejectProject(item.id);
    } else {
      setDemoQueue((previous) => previous.filter((entry) => entry.id !== item.id));
    }
    notify(`${decision === 'approve' ? 'Approved' : 'Rejected'}: ${item.title}`, decision === 'approve' ? 'success' : 'warning');
  };

  const verifyCompany = (company: CompanyToVerify) => {
    setCompanies((previous) => previous.filter((item) => item.id !== company.id));
    notify(`Company verified: ${company.name}`, 'success');
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
            <p className="text-sm leading-5">Alex Rivera</p>
            <p className="text-[10px] uppercase leading-4 text-[#707882]">Super Admin</p>
          </div>
          <img src={alexRiveraAvatar} alt="Alex Rivera" className="h-10 w-10 rounded-full border-2 border-[#d1e4ff] object-cover" />
        </div>
      </header>

      <AdminSidebar
        activeView={activeTab === 'control' ? 'admin_control' : 'admin_dashboard'}
        onNavigate={(view) => {
          if (view === 'admin_dashboard') setActiveTab('dashboard');
          else if (view === 'admin_control') setActiveTab('control');
          else setCurrentView(view);
        }}
      />

      <main className="ml-64 min-h-full px-6 pb-12 pt-28 sm:px-10 max-[1100px]:ml-[204px] max-[1100px]:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
          <div>
            <h1 className="text-[32px] font-semibold leading-[1.4] tracking-[-0.01em]">Administration Dashboard</h1>
            <p className="text-base leading-[1.6] text-[#404751]">Real-time ecosystem health and moderation queue.</p>
          </div>

          <section className="grid gap-6 lg:grid-cols-4">
            <StatCard label="ACTIVE PROJECTS" value="1,284" note="+12% from last month" tone="blue" icon={<Rocket size={20} />} />
            <StatCard label={<>PENDING<br />VALIDATIONS</>} value="42" note="Requires attention" tone="blue" icon={<FileText size={20} />} />
            <StatCard label="TOTAL STUDENTS" value="8,921" note="Growth: High" tone="dark" icon={<GraduationCap size={20} />} />
            <StatCard label={<>TOTAL<br />COMPANIES</>} value="312" note="Direct Partnerships" tone="dark" icon={<Building2 size={20} />} />
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <ValidationQueue queue={queue} onDecision={decide} />
              <CompanyVerification companies={companies} onVerify={verifyCompany} />
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

const ValidationQueue: React.FC<{ queue: QueueItem[]; onDecision: (item: QueueItem, decision: 'approve' | 'reject') => void }> = ({ queue, onDecision }) => (
  <section className="overflow-hidden rounded-[32px] border border-[rgba(192,199,211,0.3)] bg-white">
    <div className="border-b border-[rgba(192,199,211,0.2)] px-6 py-4">
      <h2 className="text-lg">Project Validation Queue</h2>
    </div>
    {queue.map((item, index) => (
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

const CompanyVerification: React.FC<{ companies: CompanyToVerify[]; onVerify: (company: CompanyToVerify) => void }> = ({ companies, onVerify }) => (
  <section className="overflow-hidden rounded-[32px] border border-[rgba(192,199,211,0.3)] bg-white">
    <div className="border-b border-[rgba(192,199,211,0.2)] px-6 py-4">
      <h2 className="text-lg">Company Account Verification</h2>
    </div>
    <div className="flex flex-wrap justify-center gap-4 px-6 py-6">
      {companies.map((company) => (
        <button key={company.id} type="button" onClick={() => onVerify(company)} className="flex w-full max-w-[278px] items-center gap-4 rounded-full border border-[rgba(192,199,211,0.5)] p-4 text-left hover:border-[#005f9f]">
          <img src={company.image} alt="" className="h-12 w-12 rounded-full object-cover" />
          <span className="min-w-0 flex-1"><span className="block text-sm">{company.name}</span><span className="block text-xs text-[#707882]">{company.task}</span></span>
          <span className="text-xl text-[#005f9f]">›</span>
        </button>
      ))}
    </div>
  </section>
);

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
