import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Building2,
  LogOut,
  Rocket,
  ClipboardClock,
  GraduationCap,
  SquareTerminal,
  Leaf,
  Landmark,
  Gem,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sampleSystemAlerts } from '../../data/mockData';
import type { SystemAlert } from '../../types';

type AdminTab = 'dashboard' | 'control';

type AdminDashboardProps = {
  initialTab?: AdminTab;
};

type QueueIcon = 'terminal' | 'leaf' | 'bank';

interface QueueItem {
  id: string;
  title: string;
  company: string;
  submitted: string;
  icon: QueueIcon;
  source: 'demo' | 'context';
}

interface CompanyToVerify {
  id: string;
  name: string;
  task: string;
  logo: 'gem' | 'leaf';
}

// Demo profile shown in the header (matches the mockup).
const ADMIN_PROFILE = {
  name: 'Alex Rivera',
  role: 'SUPER ADMIN',
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
};

const initialDemoQueue: QueueItem[] = [
  {
    id: 'demo-1',
    title: 'AI Research Assistant',
    company: 'Neural Dynamics Inc.',
    submitted: '2h ago',
    icon: 'terminal',
    source: 'demo',
  },
  {
    id: 'demo-2',
    title: 'Sustainability Tracker',
    company: 'GreenStep Global',
    submitted: '5h ago',
    icon: 'leaf',
    source: 'demo',
  },
  {
    id: 'demo-3',
    title: 'Fintech Compliance API',
    company: 'Vanguard Systems',
    submitted: '1d ago',
    icon: 'bank',
    source: 'demo',
  },
];

const initialCompanies: CompanyToVerify[] = [
  { id: 'co-1', name: 'Quantum Core', task: 'Verify Business License', logo: 'gem' },
  { id: 'co-2', name: 'Aether Energy', task: 'Verify Contact Details', logo: 'leaf' },
];

const cardClass =
  'rounded-[28px] border border-slate-100 bg-white shadow-[0_2px_14px_rgba(15,40,90,0.06)]';

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialTab = 'dashboard',
}) => {
  const {
    projects,
    approveProject,
    rejectProject,
    setCurrentView,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [demoQueue, setDemoQueue] = useState<QueueItem[]>(initialDemoQueue);
  const [companies, setCompanies] = useState<CompanyToVerify[]>(initialCompanies);
  const [alerts, setAlerts] = useState<SystemAlert[]>(sampleSystemAlerts);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Projects submitted by companies (pending) + demo items from the mockup.
  const queue = useMemo<QueueItem[]>(() => {
    const fromContext: QueueItem[] = projects
      .filter((project) => project.status === 'pending')
      .map((project) => ({
        id: project.id,
        title: project.title,
        company: project.company,
        submitted: 'just now',
        icon: 'terminal' as const,
        source: 'context' as const,
      }));

    return [...fromContext, ...demoQueue];
  }, [projects, demoQueue]);

  const pushAlert = (title: string, detail: string, type: SystemAlert['type']) => {
    setAlerts((previous) => [
      { id: `alert-${Date.now()}`, title, detail, timeAgo: 'Just now', type },
      ...previous,
    ]);
  };

  const handleDecision = (item: QueueItem, decision: 'approve' | 'reject') => {
    if (item.source === 'context') {
      if (decision === 'approve') approveProject(item.id);
      else rejectProject(item.id);
    } else {
      setDemoQueue((previous) => previous.filter((entry) => entry.id !== item.id));
    }

    pushAlert(
      decision === 'approve'
        ? `Project approved: ${item.title}`
        : `Project rejected: ${item.title}`,
      `${item.company} has been notified.`,
      decision === 'approve' ? 'success' : 'warning',
    );
  };

  const handleVerifyCompany = (company: CompanyToVerify) => {
    setCompanies((previous) => previous.filter((entry) => entry.id !== company.id));
    pushAlert(
      `Company verified: ${company.name}`,
      `${company.task} completed.`,
      'success',
    );
  };

  const navItems: {
    key: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
  }[] = [
    {
      key: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="h-[22px] w-[22px]" strokeWidth={1.6} />,
      active: activeTab === 'dashboard',
      onClick: () => setActiveTab('dashboard'),
    },
    {
      key: 'validations',
      label: 'Validations',
      icon: <ShieldCheck className="h-[22px] w-[22px]" strokeWidth={1.6} />,
      active: activeTab === 'control',
      onClick: () => setActiveTab('control'),
    },
    {
      key: 'students',
      label: 'Students',
      icon: <Users className="h-[22px] w-[22px]" strokeWidth={1.6} />,
      active: false,
      onClick: () => setCurrentView('students_directory'),
    },
    {
      key: 'companies',
      label: 'Companies',
      icon: <Building2 className="h-[22px] w-[22px]" strokeWidth={1.6} />,
      active: false,
      onClick: () => setCurrentView('partner_companies'),
    },
  ];

  return (
    // Full-screen layout: sits above the global Navbar/Footer from App.tsx.
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#f8f8fc] text-[#1d1d2b]">
      {/* HEADER */}
      <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 bg-[#fbfbfd] px-6 md:px-10">
        <div className="flex items-center gap-3">
          <span className="text-[32px] font-extrabold leading-none tracking-[-0.04em] text-[#0b5a9e]">
            internspace
          </span>
          <span className="rounded-full bg-[#0077c8] px-3 py-1.5 text-[9px] font-bold leading-none tracking-wide text-white">
            ADMIN
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[13px] font-medium leading-4 text-[#1d1d2b]">
              {ADMIN_PROFILE.name}
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-wide text-slate-500">
              {ADMIN_PROFILE.role}
            </p>
          </div>
          <img
            src={ADMIN_PROFILE.avatar}
            alt={ADMIN_PROFILE.name}
            referrerPolicy="no-referrer"
            className="h-10 w-10 rounded-full border-2 border-white object-cover shadow"
          />
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 flex-col justify-between px-4 pb-8 pt-9 md:flex">
          <div>
            <p className="px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Main menu
            </p>

            <nav className="mt-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={item.onClick}
                  aria-current={item.active ? 'page' : undefined}
                  className={`flex h-[42px] w-full items-center gap-4 rounded-full px-4 text-left text-[11px] font-bold tracking-[0.08em] transition ${
                    item.active
                      ? 'bg-[#0077c8] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/60'
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
            className="flex items-center gap-3 px-4 text-[12px] font-medium text-red-700 transition hover:text-red-900"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.6} />
            Sign Out
          </button>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1 overflow-y-auto px-6 pb-12 pt-8 md:px-10 md:pt-10">
          {/* Mobile navigation */}
          <nav className="-mx-1 mb-6 flex gap-2 overflow-x-auto pb-1 md:hidden">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-bold tracking-wide ${
                  item.active
                    ? 'bg-[#0077c8] text-white'
                    : 'bg-white text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={logout}
              className="shrink-0 rounded-full bg-white px-4 py-2 text-[11px] font-bold tracking-wide text-red-700"
            >
              Sign Out
            </button>
          </nav>

          <h1 className="text-[28px] font-semibold tracking-tight text-[#111118] md:text-[32px]">
            {activeTab === 'dashboard' ? 'Administration Dashboard' : 'Validations'}
          </h1>
          <p className="mt-3 text-[15px] text-slate-600">
            {activeTab === 'dashboard'
              ? 'Real-time ecosystem health and moderation queue.'
              : 'Review submitted projects and verify company accounts.'}
          </p>

          {/* STATS */}
          {activeTab === 'dashboard' && (
            <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label={'Active Projects'}
                value="1,284"
                valueClass="text-[#0b5a9e]"
                caption="+12% from last month"
                captionClass="text-green-600"
                icon={<Rocket className="h-6 w-6" strokeWidth={1.6} />}
                iconClass="bg-[#cfe3fb] text-[#0b5a9e]"
              />
              <StatCard
                label={'Pending\nValidations'}
                value={String(queue.length)}
                valueClass="text-[#0b5a9e]"
                caption="Requires attention"
                captionClass="text-red-600"
                icon={<ClipboardClock className="h-6 w-6" strokeWidth={1.6} />}
                iconClass="bg-[#cfe3fb] text-[#0b5a9e]"
              />
              <StatCard
                label={'Total Students'}
                value="8,921"
                valueClass="text-[#1d1d2b]"
                caption="Growth: High"
                captionClass="text-slate-500"
                icon={<GraduationCap className="h-6 w-6" strokeWidth={1.6} />}
                iconClass="bg-slate-200 text-slate-700"
              />
              <StatCard
                label={'Total\nCompanies'}
                value="312"
                valueClass="text-[#1d1d2b]"
                caption="Direct Partnerships"
                captionClass="text-slate-500"
                icon={<Building2 className="h-6 w-6" strokeWidth={1.6} />}
                iconClass="bg-slate-200 text-slate-700"
              />
            </section>
          )}

          <div
            className={`mt-10 grid grid-cols-1 items-start gap-8 ${
              activeTab === 'dashboard' ? 'xl:grid-cols-[minmax(0,1fr)_300px]' : ''
            }`}
          >
            <div className="space-y-8">
              {/* PROJECT VALIDATION QUEUE */}
              <section className={`${cardClass} overflow-hidden`}>
                <h2 className="border-b border-slate-100 px-6 py-5 text-[17px] font-medium text-[#1d1d2b]">
                  Project Validation Queue
                </h2>

                {queue.length === 0 ? (
                  <p className="px-6 py-10 text-center text-sm text-slate-500">
                    No projects are waiting for validation.
                  </p>
                ) : (
                  <ul>
                    {queue.map((item) => (
                      <li
                        key={item.id}
                        className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <QueueIconBadge icon={item.icon} />
                          <div className="min-w-0">
                            <p className="truncate text-[15px] text-[#1d1d2b]">
                              {item.title}
                            </p>
                            <p className="mt-1 truncate text-[13px] text-slate-500">
                              {item.company}
                              <span className="mx-1.5">•</span>
                              Submitted {item.submitted}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDecision(item, 'reject')}
                            className="h-10 rounded-full border border-red-600 px-5 text-[13px] text-red-700 transition hover:bg-red-50"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDecision(item, 'approve')}
                            className="h-10 rounded-full bg-[#0b5a9e] px-5 text-[13px] font-medium text-white transition hover:bg-[#094b84]"
                          >
                            Approve
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* COMPANY ACCOUNT VERIFICATION */}
              <section className={`${cardClass} overflow-hidden`}>
                <h2 className="border-b border-slate-100 px-6 py-5 text-[17px] font-medium text-[#1d1d2b]">
                  Company Account Verification
                </h2>

                {companies.length === 0 ? (
                  <p className="px-6 py-10 text-center text-sm text-slate-500">
                    All company accounts are verified.
                  </p>
                ) : (
                  <div className="flex flex-wrap justify-center gap-5 px-6 py-6">
                    {companies.map((company) => (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() => handleVerifyCompany(company)}
                        className="flex h-20 w-full max-w-[278px] items-center gap-4 rounded-full border border-slate-200 bg-white pl-4 pr-6 text-left shadow-[0_1px_6px_rgba(15,40,90,0.05)] transition hover:border-[#0077c8]/40 hover:shadow-md"
                      >
                        <CompanyLogo type={company.logo} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] text-[#1d1d2b]">
                            {company.name}
                          </span>
                          <span className="mt-1 block truncate text-[12px] text-slate-500">
                            {company.task}
                          </span>
                        </span>
                        <ChevronRight className="h-5 w-5 shrink-0 text-[#0b5a9e]" strokeWidth={2} />
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* SYSTEM ALERTS */}
            {activeTab === 'dashboard' && (
              <section className={`${cardClass} overflow-hidden`}>
                <h2 className="border-b border-slate-100 px-6 py-5 text-[17px] font-medium text-[#1d1d2b]">
                  System Alerts
                </h2>

                <div className="space-y-6 px-6 py-7">
                  {alerts.length === 0 ? (
                    <p className="py-4 text-center text-[13px] text-slate-500">
                      All alerts have been cleared.
                    </p>
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-4">
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            alert.type === 'warning'
                              ? 'bg-red-600'
                              : alert.type === 'success'
                                ? 'bg-slate-600'
                                : 'bg-[#0b5a9e]'
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-[13px] leading-[22px] text-[#1d1d2b]">
                            {alert.title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {alert.timeAgo}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setAlerts([])}
                  disabled={alerts.length === 0}
                  className="h-12 w-full bg-slate-200/80 text-[13px] text-slate-700 transition hover:bg-slate-300/70 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Clear All Alerts
                </button>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string;
  valueClass: string;
  caption: string;
  captionClass: string;
  icon: React.ReactNode;
  iconClass: string;
}> = ({ label, value, valueClass, caption, captionClass, icon, iconClass }) => (
  <div className={`${cardClass} flex items-center justify-between gap-4 px-6 py-8`}>
    <div className="min-w-0">
      <p className="whitespace-pre-line text-[11px] uppercase leading-[12px] tracking-[0.06em] text-slate-500">
        {label}
      </p>
      <p className={`mt-3 text-[34px] leading-9 ${valueClass}`}>{value}</p>
      <p className={`mt-3 text-[10px] ${captionClass}`}>{caption}</p>
    </div>
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconClass}`}
    >
      {icon}
    </div>
  </div>
);

const QueueIconBadge: React.FC<{ icon: QueueIcon }> = ({ icon }) => {
  const config =
    icon === 'leaf'
      ? { Icon: Leaf, className: 'bg-[#e6eef9] text-[#0b5a9e]' }
      : icon === 'bank'
        ? { Icon: Landmark, className: 'bg-slate-100 text-slate-600' }
        : { Icon: SquareTerminal, className: 'bg-[#e6eef9] text-[#0b5a9e]' };

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.className}`}
    >
      <config.Icon className="h-5 w-5" strokeWidth={1.7} />
    </div>
  );
};

const CompanyLogo: React.FC<{ type: 'gem' | 'leaf' }> = ({ type }) =>
  type === 'gem' ? (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[#0b5a9e]">
      <Gem className="h-6 w-6" strokeWidth={1.5} />
    </div>
  ) : (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-emerald-400">
      <Leaf className="h-6 w-6" strokeWidth={1.8} />
    </div>
  );

export { AdminDashboard };
export default AdminDashboard;