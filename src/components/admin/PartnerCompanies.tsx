import React, { useMemo, useState } from 'react';
import {
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FolderKanban,
  MoreVertical,
  Plus,
  Rocket,
  Search,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

import alexRiveraAvatar from '../../assets/figma-partners/alex-rivera.jpeg';
import acmeLogo from '../../assets/figma-partners/acme.jpeg';
import globalFinanceLogo from '../../assets/figma-partners/global-finance.jpeg';
import ecoSolutionsLogo from '../../assets/figma-partners/eco-solutions.jpeg';
import overviewIcon from '../../assets/figma-admin/nav/overview.svg';
import validationsIcon from '../../assets/figma-admin/nav/validations.svg';
import studentsIcon from '../../assets/figma-admin/nav/students.svg';
import companiesIcon from '../../assets/figma-admin/nav/companies.svg';
import signOutIcon from '../../assets/figma-admin/nav/sign-out.svg';

type PartnerCompany = {
  id: string;
  name: string;
  industry: 'Technology' | 'Finance' | 'Healthcare' | 'Sustainability';
  activeProjects: number;
  status: 'VERIFIED' | 'PENDING';
  logo: string;
  muted?: boolean;
};

const partnerCompanies: PartnerCompany[] = [
  { id: 'acme', name: 'Acme Corp', industry: 'Technology', activeProjects: 14, status: 'VERIFIED', logo: acmeLogo },
  { id: 'global', name: 'Global Finance LLC', industry: 'Finance', activeProjects: 8, status: 'VERIFIED', logo: globalFinanceLogo },
  { id: 'eco', name: 'EcoSolutions Inc.', industry: 'Sustainability', activeProjects: 0, status: 'PENDING', logo: ecoSolutionsLogo, muted: true },
];

const industries = ['All', 'Technology', 'Finance', 'Healthcare'];

const navigation = [
  { label: 'Overview', view: 'admin_dashboard', icon: overviewIcon, gap: 16, iconWidth: 18, iconHeight: 18 },
  { label: 'Validations', view: 'admin_control', icon: validationsIcon, gap: 18, iconWidth: 16, iconHeight: 20 },
  { label: 'Students', view: 'students_directory', icon: studentsIcon, gap: 12, iconWidth: 22, iconHeight: 16 },
  { label: 'Companies', view: 'partner_companies', icon: companiesIcon, gap: 14, iconWidth: 20, iconHeight: 18 },
];

export const PartnerCompanies: React.FC = () => {
  const { setCurrentView, logout } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [activePage, setActivePage] = useState(1);

  const filteredCompanies = useMemo(
    () =>
      partnerCompanies.filter((company) => {
        const matchesSearch =
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.industry.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesIndustry =
          selectedIndustry === 'All' || company.industry === selectedIndustry;
        return matchesSearch && matchesIndustry;
      }),
    [searchTerm, selectedIndustry],
  );

  const handleSignOut = () => {
    logout();
    setCurrentView('login_admin');
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-auto bg-[#f9f9fc] font-['League_Spartan',sans-serif] text-[#1a1c1e]">
      <header className="fixed inset-x-0 top-0 z-30 flex h-20 items-center justify-between border-b border-[rgba(192,199,211,0.1)] bg-[rgba(249,249,252,0.8)] px-6 backdrop-blur-md sm:px-10">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setCurrentView('admin_dashboard')} className="text-[36px] font-bold leading-none tracking-[-0.02em] text-[#005f9f]">
            internspace
          </button>
          <span className="rounded-full bg-[#0078c7] px-3 py-1 text-[10px] uppercase tracking-[0.05em] text-white">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-full bg-[#eeeef0]">
            <Bell className="h-5 w-4 text-[#1a1c1e]" strokeWidth={1.8} />
          </button>
          <div className="flex items-center gap-3 border-l border-[#c0c7d3] pl-4">
            <div className="text-right">
              <p className="text-sm leading-5">Alex Rivera</p>
              <p className="text-[10px] uppercase leading-4 text-[#707882]">Super Admin</p>
            </div>
            <img src={alexRiveraAvatar} alt="Alex Rivera" className="h-10 w-10 rounded-full border-2 border-[#d1e4ff] object-cover" />
          </div>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-20 z-20 flex w-64 flex-col justify-between bg-[#f3f3f6] px-4 py-8 max-[1100px]:w-[204px]">
        <div>
          <p className="px-4 text-xs uppercase tracking-[0.05em] text-[#707882]">Main Menu</p>
          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const isActive = item.view === 'partner_companies';
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setCurrentView(item.view)}
                  style={{ gap: item.gap }}
                  className={`flex w-full items-center rounded-full px-4 py-3 text-left text-xs font-bold tracking-[0.05em] ${
                    isActive ? 'bg-[#0078c7] text-white' : 'text-[#404751] hover:bg-[#e4e6eb]'
                  }`}
                >
                  <img
                    src={item.icon}
                    alt=""
                    style={{ width: item.iconWidth, height: item.iconHeight }}
                    className="shrink-0 object-contain"
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <button type="button" onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 text-xs tracking-[0.05em] text-[#ba1a1a]">
          <img src={signOutIcon} alt="" className="h-[18px] w-[18px]" />
          Sign Out
        </button>
      </aside>

      <main className="ml-64 min-h-full px-10 pb-12 pt-28 max-[1100px]:ml-[204px] max-[1100px]:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[32px] font-semibold leading-[1.4] tracking-[-0.01em]">Partner Companies</h1>
              <p className="text-base leading-[1.6] text-[#404751]">Manage and monitor participating organizations.</p>
            </div>
            <button
              type="button"
              onClick={() => window.alert('Form pendaftaran kemitraan industri dibuka.')}
              className="flex h-12 items-center gap-2 rounded-full bg-[#005f9f] px-6 text-[18px] text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              Invite company
            </button>
          </div>

          <section className="grid gap-6 pt-2 lg:grid-cols-4">
            <StatCard label="TOTAL PARTNERS" value="142" note="Direct Partnerships" icon={<Building2 className="h-5 w-5" />} tone="blue" />
            <StatCard label="ACTIVE PROJECTS" value="328" note="+12% from last month" icon={<Rocket className="h-5 w-5" />} tone="blue" positive />
            <StatCard label={<>PENDING<br />VERIFICATION</>} value="12" note="Requires attention" icon={<ClipboardCheck className="h-5 w-5" />} tone="gray" danger />
            <StatCard label={<>NETWORK<br />GROWTH</>} value="High" note="Scale: Quarter 4" icon={<TrendingUp className="h-5 w-5" />} tone="gray" />
          </section>

          <section className="flex items-center justify-between pt-2">
            <div className="relative w-[384px] max-w-[45%]">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search companies..."
                className="h-12 w-full rounded-full border border-[#c0c7d3] bg-[#f3f3f6] py-3 pl-6 pr-12 text-sm text-[#1a1c1e] outline-none placeholder:text-[#6b7280] focus:border-[#005f9f]"
              />
              <Search className="absolute right-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#707882]" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-2">
              {industries.map((industry) => {
                const isActive = selectedIndustry === industry;
                return (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => setSelectedIndustry(industry)}
                    className={`rounded-full px-5 py-2 text-[16px] ${
                      isActive
                        ? 'bg-[#005f9f] text-white shadow-sm'
                        : 'bg-[#f3f3f6] text-[#404751]'
                    }`}
                  >
                    {industry}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </section>

          <nav className="flex items-center justify-center gap-3 pt-4" aria-label="Pagination">
            <PaginationButton label="Previous" onClick={() => setActivePage((page) => Math.max(1, page - 1))}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </PaginationButton>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setActivePage(page)}
                className={`h-10 w-10 rounded-full text-[16px] ${
                  activePage === page
                    ? 'bg-[#005f9f] text-white shadow-sm'
                    : 'border border-[rgba(192,199,211,0.3)] text-[#1a1c1e]'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-[16px] text-[#707882]">...</span>
            <PaginationButton label="Next" onClick={() => setActivePage((page) => page + 1)}>
              <ChevronRight className="h-3.5 w-3.5" />
            </PaginationButton>
          </nav>
        </div>
      </main>
    </div>
  );
};

const StatCard: React.FC<{
  label: React.ReactNode;
  value: string;
  note: string;
  icon: React.ReactNode;
  tone: 'blue' | 'gray';
  positive?: boolean;
  danger?: boolean;
}> = ({ label, value, note, icon, tone, positive, danger }) => (
  <div className="flex min-h-[144px] items-center justify-between rounded-[32px] border border-[rgba(192,199,211,0.3)] bg-white px-6 py-7 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
    <div>
      <p className="text-xs leading-3 tracking-[0.05em] text-[#707882]">{label}</p>
      <p className={`mt-1 text-[32px] leading-[1.4] tracking-[-0.01em] ${tone === 'blue' ? 'text-[#005f9f]' : 'text-[#1a1c1e]'}`}>{value}</p>
      <p className={`text-[10px] leading-4 ${positive ? 'text-[#16a34a]' : danger ? 'text-[#ba1a1a]' : 'text-[#707882]'}`}>{note}</p>
    </div>
    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${tone === 'blue' ? 'bg-[#d1e4ff] text-[#005f9f]' : 'bg-[#eeeef0] text-[#555d63]'}`}>
      {icon}
    </span>
  </div>
);

const CompanyCard: React.FC<{ company: PartnerCompany }> = ({ company }) => (
  <article className={`flex min-h-[292px] flex-col rounded-[48px] border border-[rgba(192,199,211,0.3)] bg-white p-[25px] ${company.muted ? 'opacity-80' : ''}`}>
    <div className="flex items-start justify-between">
      <img
        src={company.logo}
        alt=""
        className={`h-16 w-16 rounded-full border border-[#eeeef0] object-cover ${company.muted ? 'opacity-60 grayscale' : ''}`}
      />
      <button type="button" aria-label={`More options for ${company.name}`} className="grid h-8 w-8 place-items-center text-[#404751]">
        <MoreVertical className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
    <h2 className="mt-5 text-[18px] leading-[27px]">{company.name}</h2>
    <div className="pb-5 pt-1">
      <span className="rounded-full bg-[#eeeef0] px-3 py-1 text-[10px] uppercase leading-[15px] text-[#404751]">
        {company.industry}
      </span>
    </div>
    <div className="mt-auto flex flex-col gap-3 border-t border-[rgba(192,199,211,0.1)] pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[14px] text-[#404751]">
          <FolderKanban className="h-4 w-4" strokeWidth={1.8} />
          Active Projects
        </div>
        <span className="text-[16px]">{company.activeProjects}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[14px] text-[#404751]">
          <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
          Status
        </div>
        <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] uppercase ${
          company.status === 'VERIFIED'
            ? 'bg-[rgba(0,95,159,0.1)] text-[#005f9f]'
            : 'bg-[rgba(186,26,26,0.1)] text-[#ba1a1a]'
        }`}>
          {company.status === 'VERIFIED' ? <ShieldCheck className="h-3 w-3" /> : <span aria-hidden className="h-2.5 w-2.5 rounded-full border border-current text-center leading-[8px]">!</span>}
          {company.status}
        </span>
      </div>
    </div>
  </article>
);

const PaginationButton: React.FC<{ label: string; onClick: () => void; children: React.ReactNode }> = ({ label, onClick, children }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(192,199,211,0.3)] text-[#1a1c1e]"
  >
    {children}
  </button>
);
