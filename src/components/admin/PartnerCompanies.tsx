import React, { useEffect, useState } from 'react';
import {
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FolderKanban,
  Rocket,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { apiRequest } from '../../lib/api';
import { AdminSidebar } from './AdminSidebar';

type PartnerCompany = {
  id: string;
  name: string;
  industry: string;
  accountName: string;
  email: string;
  activeProjects: number;
  status: 'verified' | 'pending' | 'rejected';
  logoUrl: string | null;
  website: string | null;
};

type PartnerCompanyStats = {
  totalPartners: number;
  activeProjects: number;
  pendingVerification: number;
  verifiedPartners: number;
};

type PartnerCompaniesResponse = {
  companies: PartnerCompany[];
  stats: PartnerCompanyStats;
  industries: string[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const PAGE_SIZE = 9;

export const PartnerCompanies: React.FC = () => {
  const { currentUser, setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [activePage, setActivePage] = useState(1);
  const [companies, setCompanies] = useState<PartnerCompany[]>([]);
  const [stats, setStats] = useState<PartnerCompanyStats | null>(null);
  const [industries, setIndustries] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        page: String(activePage),
        pageSize: String(PAGE_SIZE),
      });
      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      if (selectedIndustry !== 'All') params.set('industry', selectedIndustry);

      try {
        const result = await apiRequest<PartnerCompaniesResponse>(`/admin/companies?${params}`);
        if (!isCurrentRequest) return;
        setCompanies(result.companies);
        setStats(result.stats);
        setIndustries(result.industries);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (requestError) {
        if (!isCurrentRequest) return;
        setError(requestError instanceof Error ? requestError.message : 'Unable to load partner companies.');
        setCompanies([]);
        setStats(null);
        setIndustries([]);
        setTotal(0);
        setTotalPages(0);
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    }, 250);

    return () => {
      isCurrentRequest = false;
      window.clearTimeout(timer);
    };
  }, [activePage, searchTerm, selectedIndustry]);

  const pageNumbers = totalPages <= 5
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : Array.from(new Set([1, activePage - 1, activePage, activePage + 1, totalPages]))
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((left, right) => left - right);

  const adminName = currentUser?.name ?? 'Administrator';
  const adminInitials = adminName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

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
              <p className="text-sm leading-5">{adminName}</p>
              <p className="text-[10px] uppercase leading-4 text-[#707882]">Super Admin</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#d1e4ff] bg-[#d1e4ff] text-sm font-bold text-[#005f9f]" aria-hidden="true">
              {adminInitials}
            </span>
          </div>
        </div>
      </header>

      <AdminSidebar activeView="partner_companies" />

      <main className="ml-64 min-h-full px-10 pb-12 pt-28 max-[1100px]:ml-[204px] max-[1100px]:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[32px] font-semibold leading-[1.4] tracking-[-0.01em]">Partner Companies</h1>
              <p className="text-base leading-[1.6] text-[#404751]">Manage registered organizations and their verification status.</p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('admin_control')}
              className="flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[#005f9f] px-4 text-sm text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] sm:px-6 sm:text-base"
            >
              <ClipboardCheck className="h-4 w-4" strokeWidth={2} />
              Review queue
            </button>
          </div>

          <section className="grid gap-6 pt-2 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="TOTAL PARTNERS" value={stats ? String(stats.totalPartners) : '—'} note="Registered companies" icon={<Building2 className="h-5 w-5" />} tone="blue" />
            <StatCard label="ACTIVE PROJECTS" value={stats ? String(stats.activeProjects) : '—'} note="Approved company projects" icon={<Rocket className="h-5 w-5" />} tone="blue" />
            <StatCard label={<>PENDING<br />VERIFICATION</>} value={stats ? String(stats.pendingVerification) : '—'} note="Requires attention" icon={<ClipboardCheck className="h-5 w-5" />} tone="gray" danger />
            <StatCard label={<>VERIFIED<br />PARTNERS</>} value={stats ? String(stats.verifiedPartners) : '—'} note="Verified company profiles" icon={<ShieldCheck className="h-5 w-5" />} tone="gray" />
          </section>

          <section className="flex items-center justify-between pt-2">
            <div className="relative w-[384px] max-w-[45%]">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setActivePage(1);
                }}
                placeholder="Search companies..."
                className="h-12 w-full rounded-full border border-[#c0c7d3] bg-[#f3f3f6] py-3 pl-6 pr-12 text-sm text-[#1a1c1e] outline-none placeholder:text-[#6b7280] focus:border-[#005f9f]"
              />
              <Search className="absolute right-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#707882]" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-2">
              {['All', ...industries].map((industry) => {
                const isActive = selectedIndustry === industry;
                return (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => {
                      setSelectedIndustry(industry);
                      setActivePage(1);
                    }}
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

          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <p role="status" className="col-span-full rounded-2xl bg-white px-6 py-12 text-center text-sm text-[#707882]">Loading partner companies…</p>
            ) : companies.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-[rgba(192,199,211,0.5)] bg-white px-6 py-14 text-center">
                <h2 className="text-lg font-semibold">No companies found</h2>
                <p className="mt-2 text-sm text-[#707882]">
                  {searchTerm || selectedIndustry !== 'All'
                    ? 'Try another search or industry filter.'
                    : 'Registered company profiles will appear here when available.'}
                </p>
              </div>
            ) : companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </section>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-3 pt-4" aria-label="Pagination">
              <PaginationButton
                label="Previous"
                disabled={activePage === 1 || loading}
                onClick={() => setActivePage((page) => Math.max(1, page - 1))}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </PaginationButton>
              {pageNumbers.map((page, index) => (
                <React.Fragment key={page}>
                  {index > 0 && page - pageNumbers[index - 1] > 1 && <span className="px-1 text-[16px] text-[#707882]">...</span>}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setActivePage(page)}
                    aria-current={activePage === page ? 'page' : undefined}
                    className={`h-10 w-10 rounded-full text-[16px] disabled:opacity-50 ${
                      activePage === page
                        ? 'bg-[#005f9f] text-white shadow-sm'
                        : 'border border-[rgba(192,199,211,0.3)] text-[#1a1c1e]'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
              <PaginationButton
                label="Next"
                disabled={activePage === totalPages || loading}
                onClick={() => setActivePage((page) => Math.min(totalPages, page + 1))}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </PaginationButton>
            </nav>
          )}
          {!loading && total > 0 && (
            <p className="text-center text-xs text-[#707882]">
              Showing {(activePage - 1) * PAGE_SIZE + 1} to {Math.min(activePage * PAGE_SIZE, total)} of {total} companies
            </p>
          )}
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
  <article className="flex min-h-[292px] flex-col rounded-[48px] border border-[rgba(192,199,211,0.3)] bg-white p-[25px]">
    <div className="flex items-start justify-between">
      {company.logoUrl ? (
        <img src={company.logoUrl} alt={`${company.name} logo`} className="h-16 w-16 rounded-full border border-[#eeeef0] object-cover" />
      ) : (
        <span className="grid h-16 w-16 place-items-center rounded-full border border-[#eeeef0] bg-[#f3f3f6] text-[#707882]" aria-hidden="true">
          <Building2 className="h-7 w-7" />
        </span>
      )}
    </div>
    <h2 className="mt-5 text-[18px] leading-[27px]">{company.name}</h2>
    <div className="pb-5 pt-1">
      <span className="rounded-full bg-[#eeeef0] px-3 py-1 text-[10px] uppercase leading-[15px] text-[#404751]">
        {company.industry}
      </span>
    </div>
    <p className="truncate pb-4 text-xs text-[#707882]" title={company.email}>
      {company.accountName} · {company.email}
    </p>
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
          company.status === 'verified'
            ? 'bg-[rgba(0,95,159,0.1)] text-[#005f9f]'
            : company.status === 'pending'
              ? 'bg-[rgba(186,26,26,0.1)] text-[#ba1a1a]'
              : 'bg-[#eeeef0] text-[#555d63]'
        }`}>
          {company.status === 'verified' ? <ShieldCheck className="h-3 w-3" /> : <span aria-hidden className="h-2.5 w-2.5 rounded-full border border-current text-center leading-[8px]">!</span>}
          {company.status}
        </span>
      </div>
    </div>
  </article>
);

const PaginationButton: React.FC<{ label: string; onClick: () => void; disabled: boolean; children: React.ReactNode }> = ({ label, onClick, disabled, children }) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(192,199,211,0.3)] text-[#1a1c1e] disabled:opacity-30"
  >
    {children}
  </button>
);
