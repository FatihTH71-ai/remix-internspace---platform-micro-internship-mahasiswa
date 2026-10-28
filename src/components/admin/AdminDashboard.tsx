import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Building2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sampleSystemAlerts } from '../../data/mockData';
import type { SystemAlert } from '../../types';

type AdminTab = 'dashboard' | 'control';
type AdminDashboardProps = { initialTab?: AdminTab };
type QueueIcon = 'project' | 'company' | 'student';

type QueueItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedRole: string;
  date: string;
  icon: QueueIcon;
  source: 'demo' | 'context';
};

type CompanyToVerify = { id: string; name: string; task: string };

const adminProfile = {
  name: 'Alex Rivera',
  role: 'SUPER ADMIN',
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
};

const initialQueue: QueueItem[] = [
  {
    id: 'proposal',
    label: 'Project Proposal',
    title: 'AI-Driven Supply Chain Optimization',
    description: 'Neural Dynamics Inc. · Submitted project proposal',
    submittedBy: 'LogisTech Solutions',
    submittedRole: 'Verified company',
    date: 'Oct 24, 2023',
    icon: 'project',
    source: 'demo',
  },
  {
    id: 'company',
    label: 'Company Registration',
    title: 'GreenEnergy Innovations Ltd.',
    description: 'Tax ID & incorporation documents',
    submittedBy: 'Sarah Jenkins',
    submittedRole: 'HR director',
    date: 'Oct 23, 2023',
    icon: 'company',
    source: 'demo',
  },
  {
    id: 'student-one',
    label: 'Student Verification',
    title: 'University Transcript Upload',
    description: 'B.S. Computer Science, Class of 2024',
    submittedBy: 'Alex Rivera',
    submittedRole: 'State university',
    date: 'Oct 23, 2023',
    icon: 'student',
    source: 'demo',
  },
  {
    id: 'student-two',
    label: 'Student Verification',
    title: 'University Transcript Upload',
    description: 'B.S. Computer Science, Class of 2024',
    submittedBy: 'Alex Rivera',
    submittedRole: 'State university',
    date: 'Oct 23, 2023',
    icon: 'student',
    source: 'demo',
  },
];

const initialCompanies: CompanyToVerify[] = [
  { id: 'quantum', name: 'Quantum Core', task: 'Verify business license' },
  { id: 'aether', name: 'Aether Energy', task: 'Verify contact details' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialTab = 'dashboard',
}) => {
  const { projects, approveProject, rejectProject, setCurrentView, logout } =
    useApp();
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
          label: 'Project Proposal',
          title: project.title,
          description: `${project.company} · Submitted project proposal`,
          submittedBy: project.company,
          submittedRole: 'Verified company',
          date: 'Just now',
          icon: 'project' as const,
          source: 'context' as const,
        })),
      ...demoQueue,
    ],
    [demoQueue, projects],
  );

  const notify = (title: string, type: SystemAlert['type']) =>
    setAlerts((previous) => [
      {
        id: `alert-${Date.now()}`,
        title,
        detail: 'The submitter has been notified.',
        timeAgo: 'Just now',
        type,
      },
      ...previous,
    ]);

  const decide = (item: QueueItem, decision: 'approve' | 'reject') => {
    if (item.source === 'context') {
      decision === 'approve' ? approveProject(item.id) : rejectProject(item.id);
    } else {
      setDemoQueue((previous) => previous.filter((entry) => entry.id !== item.id));
    }
    notify(
      `${decision === 'approve' ? 'Approved' : 'Rejected'}: ${item.title}`,
      decision === 'approve' ? 'success' : 'warning',
    );
  };

  const verifyCompany = (company: CompanyToVerify) => {
    setCompanies((previous) => previous.filter((item) => item.id !== company.id));
    notify(`Company verified: ${company.name}`, 'success');
  };

  const navigation = [
    {
      label: 'Overview',
      active: activeTab === 'dashboard',
      icon: <LayoutDashboard size={16} />,
      action: () => setActiveTab('dashboard'),
    },
    {
      label: 'Validations',
      active: activeTab === 'control',
      icon: <ShieldCheck size={16} />,
      action: () => setActiveTab('control'),
    },
    {
      label: 'Students',
      active: false,
      icon: <Users size={16} />,
      action: () => setCurrentView('students_directory'),
    },
    {
      label: 'Companies',
      active: false,
      icon: <Building2 size={16} />,
      action: () => setCurrentView('partner_companies'),
    },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex min-h-screen bg-[#fbfcff] font-sans text-[#1a1c1e]">
      <aside className="hidden w-[244px] shrink-0 flex-col border-r border-[#edf0f5] bg-[#f7f8fc] px-5 py-7 lg:flex">
        <div>
          <Brand />
          <p className="mt-11 px-2 text-[8px] font-bold uppercase tracking-[0.08em] text-[#626b76]">
            Main menu
          </p>
          <nav className="mt-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                aria-current={item.active ? 'page' : undefined}
                className={`flex h-9 w-full items-center gap-3 rounded-full px-3 text-left text-[10px] font-semibold transition ${
                  item.active
                    ? 'bg-[#0786d1] text-white shadow-[0_3px_8px_rgba(7,134,209,0.18)]'
                    : 'text-[#4c5560] hover:bg-[#e9eef5]'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <button
          type="button"
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-3 py-2 text-[10px] font-medium text-[#b3261e] hover:text-[#8f1712]"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#edf0f5] bg-white px-5 sm:px-8">
          <div className="lg:hidden"><Brand /></div>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="grid h-8 w-8 place-items-center rounded-full text-[#5f6670] hover:bg-slate-100"
            >
              <Bell size={15} />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-medium leading-3 text-[#303841]">{adminProfile.name}</p>
              <p className="mt-0.5 text-[7px] uppercase tracking-wide text-[#7b838d]">{adminProfile.role}</p>
            </div>
            <img
              src={adminProfile.avatar}
              alt={adminProfile.name}
              referrerPolicy="no-referrer"
              className="h-7 w-7 rounded-full border border-[#e4e8ee] object-cover"
            />
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-9 lg:px-11">
          <nav className="mb-7 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navigation.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className={`shrink-0 rounded-full px-3.5 py-2 text-[10px] font-semibold ${
                  item.active ? 'bg-[#0786d1] text-white' : 'border border-[#e5e9ee] bg-white text-[#4c5560]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mx-auto max-w-[1110px]">
            <h1 className="text-[23px] font-semibold tracking-[-0.03em] text-[#1a1c1e]">
              {activeTab === 'control' ? 'Administration Control' : 'Administration Overview'}
            </h1>
            <p className="mt-2 text-[10px] text-[#707882]">
              {activeTab === 'control'
                ? 'Approve the submitted projects, payments, and user data from companies and students.'
                : 'Monitor the health of the InternSpace ecosystem and keep approvals moving.'}
            </p>

            {activeTab === 'control' ? (
              <ValidationTable queue={queue} onDecision={decide} />
            ) : (
              <Overview
                queueCount={queue.length}
                alerts={alerts}
                companies={companies}
                onOpenValidations={() => setActiveTab('control')}
                onClearAlerts={() => setAlerts([])}
                onVerify={verifyCompany}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const Brand = () => (
  <div className="flex items-center gap-2 px-2">
    <span className="text-[21px] font-extrabold tracking-[-0.07em] text-[#075f9f]">internspace</span>
    <span className="rounded-full bg-[#0786d1] px-2 py-0.5 text-[7px] font-bold tracking-wide text-white">ADMIN</span>
  </div>
);

const ValidationTable: React.FC<{
  queue: QueueItem[];
  onDecision: (item: QueueItem, decision: 'approve' | 'reject') => void;
}> = ({ queue, onDecision }) => (
  <section className="mt-8 overflow-hidden rounded-[13px] border border-[#edf0f3] bg-white shadow-[0_2px_8px_rgba(25,45,70,0.025)]">
    <div className="hidden grid-cols-[minmax(280px,1.65fr)_minmax(170px,1fr)_minmax(105px,.7fr)_150px] gap-5 border-b border-[#edf0f3] px-5 py-4 text-[7px] font-semibold uppercase tracking-[0.06em] text-[#858d97] md:grid">
      <span>Item details</span><span>Submit by</span><span>Date submitted</span><span className="text-right">Actions</span>
    </div>
    {queue.length === 0 ? (
      <p className="px-5 py-12 text-center text-sm text-[#707882]">No items are waiting for validation.</p>
    ) : (
      <ul>
        {queue.map((item) => (
          <li
            key={item.id}
            className="grid gap-4 border-b border-[#edf0f3] px-5 py-4 last:border-b-0 md:grid-cols-[minmax(280px,1.65fr)_minmax(170px,1fr)_minmax(105px,.7fr)_150px] md:items-center md:gap-5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <QueueIcon icon={item.icon} />
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-[#e2e2e5] px-2 py-[2px] text-[7px] font-medium leading-none text-[#404751]">{item.label}</span>
                <p className="mt-1.5 truncate text-[11px] font-medium text-[#1a1c1e]">{item.title}</p>
                <p className="mt-1 truncate text-[9px] text-[#707882]">{item.description}</p>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2.5">
              <SubmitterAvatar icon={item.icon} />
              <div className="min-w-0">
                <p className="truncate text-[10px] font-medium text-[#1a1c1e]">{item.submittedBy}</p>
                <p className="mt-0.5 truncate text-[7px] uppercase tracking-[0.04em] text-[#707882]">{item.submittedRole}</p>
              </div>
            </div>
            <p className="text-[10px] text-[#707882]">{item.date}</p>
            <div className="flex items-center gap-2 md:justify-end">
              <button type="button" onClick={() => onDecision(item, 'reject')} className="h-7 rounded-full border border-[#ba1a1a] px-3 text-[9px] font-medium text-[#ba1a1a] hover:bg-red-50">Reject</button>
              <button type="button" onClick={() => onDecision(item, 'approve')} className="h-7 rounded-full bg-[#075f9f] px-3 text-[9px] font-medium text-white hover:bg-[#064e82]">Approve</button>
            </div>
          </li>
        ))}
      </ul>
    )}
    <div className="flex items-center justify-between border-t border-[#edf0f3] px-5 py-3 text-[8px] text-[#707882]">
      <span>Showing 1 to {Math.min(queue.length, 4)} of {queue.length} entries</span>
      <div className="flex items-center gap-3 text-[#8a929b]"><span>‹</span><span className="grid h-5 w-5 place-items-center rounded bg-[#dbeafe] text-[#075f9f]">1</span><span>2</span><span>3</span><span>›</span></div>
    </div>
  </section>
);

const Overview: React.FC<{
  queueCount: number;
  alerts: SystemAlert[];
  companies: CompanyToVerify[];
  onOpenValidations: () => void;
  onClearAlerts: () => void;
  onVerify: (company: CompanyToVerify) => void;
}> = ({ queueCount, alerts, companies, onOpenValidations, onClearAlerts, onVerify }) => (
  <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_280px]">
    <section className="rounded-[13px] border border-[#edf0f3] bg-white p-5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#707882]">Pending validations</p>
      <p className="mt-2 text-3xl font-semibold text-[#075f9f]">{queueCount}</p>
      <p className="mt-2 text-[10px] text-[#707882]">Submitted projects and account records awaiting review.</p>
      <button type="button" onClick={onOpenValidations} className="mt-5 rounded-full bg-[#075f9f] px-4 py-2 text-[10px] font-medium text-white hover:bg-[#064e82]">Review validations</button>
      <div className="mt-8 border-t border-[#edf0f3] pt-5">
        <p className="text-[10px] font-medium text-[#1a1c1e]">Company account verification</p>
        <div className="mt-3 space-y-2">
          {companies.map((company) => (
            <button key={company.id} type="button" onClick={() => onVerify(company)} className="flex w-full items-center justify-between rounded-lg border border-[#edf0f3] px-3 py-3 text-left hover:border-[#b8d6ec]">
              <span><span className="block text-[10px] font-medium text-[#1a1c1e]">{company.name}</span><span className="mt-1 block text-[9px] text-[#707882]">{company.task}</span></span>
              <ShieldCheck size={15} className="text-[#075f9f]" />
            </button>
          ))}
        </div>
      </div>
    </section>
    <section className="overflow-hidden rounded-[13px] border border-[#edf0f3] bg-white">
      <div className="border-b border-[#edf0f3] px-5 py-4"><h2 className="text-[12px] font-medium text-[#1a1c1e]">System Alerts</h2></div>
      <div className="space-y-4 px-5 py-5">
        {alerts.length === 0 ? <p className="text-[10px] text-[#707882]">All alerts have been cleared.</p> : alerts.slice(0, 4).map((alert) => (
          <div key={alert.id} className="flex gap-2.5"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#075f9f]" /><div><p className="text-[9px] leading-4 text-[#1a1c1e]">{alert.title}</p><p className="mt-0.5 text-[8px] text-[#707882]">{alert.timeAgo}</p></div></div>
        ))}
      </div>
      <button type="button" onClick={onClearAlerts} className="w-full border-t border-[#edf0f3] bg-[#eef1f5] py-3 text-[9px] text-[#4c5560] hover:bg-[#e4e8ed]">Clear All Alerts</button>
    </section>
  </div>
);

const QueueIcon: React.FC<{ icon: QueueIcon }> = ({ icon }) => {
  const Icon = icon === 'project' ? FileText : icon === 'company' ? Building2 : GraduationCap;
  const colour = icon === 'project' ? 'bg-[#e0f1fb] text-[#075f9f]' : icon === 'company' ? 'bg-[#e5f3f6] text-[#07748a]' : 'bg-[#eef0f3] text-[#69717a]';
  return <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${colour}`}><Icon size={14} strokeWidth={1.75} /></span>;
};

const SubmitterAvatar: React.FC<{ icon: QueueIcon }> = ({ icon }) =>
  icon === 'student' ? (
    <img src={adminProfile.avatar} alt="" referrerPolicy="no-referrer" className="h-7 w-7 shrink-0 rounded-full object-cover" />
  ) : (
    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${icon === 'project' ? 'border border-[#d7dee7] bg-white text-[#075f9f]' : 'bg-[#eef0f3] text-[#69717a]'}`}>
      {icon === 'project' ? <Building2 size={12} /> : <Users size={12} />}
    </span>
  );

export { AdminDashboard };
export default AdminDashboard;
