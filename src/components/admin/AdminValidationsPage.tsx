import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiJson, apiRequest } from '../../lib/api';
import companyLogo from '../../assets/figma-admin/validations/company-logo.jpeg';
import alexAvatar from '../../assets/figma-admin/validations/submitter-alex.jpeg';
import adminAvatar from '../../assets/figma-admin/validations/admin-avatar.jpeg';
import projectIcon from '../../assets/figma-admin/validations/project.svg';
import companyIcon from '../../assets/figma-admin/validations/company.svg';
import personIcon from '../../assets/figma-admin/validations/person.svg';
import studentIcon from '../../assets/figma-admin/validations/student.svg';
import previousIcon from '../../assets/figma-admin/validations/previous.svg';
import nextIcon from '../../assets/figma-admin/validations/next.svg';
import bellIcon from '../../assets/figma-admin/validations/bell.svg';
import { AdminSidebar } from './AdminSidebar';

type ValidationType = 'project' | 'company' | 'student' | 'payment';
type ValidationDecision = 'approve' | 'reject';

interface AdminValidation {
  type: ValidationType;
  id: string;
  label: string;
  title: string;
  detail: string;
  submitterName: string;
  submitterDetail: string;
  imageUrl: string | null;
  attachmentUrl: string | null;
  amount: number | null;
  method: string | null;
  submittedAt: string;
}

interface ValidationResponse {
  validations: AdminValidation[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const PAGE_SIZE = 4;

const rowIcons: Record<ValidationType, string> = {
  project: projectIcon,
  company: companyIcon,
  student: studentIcon,
  payment: studentIcon,
};

const rowIconBackgrounds: Record<ValidationType, string> = {
  project: 'bg-[rgba(0,95,159,0.1)]',
  company: 'bg-[rgba(8,99,150,0.1)]',
  student: 'bg-[rgba(85,93,99,0.1)]',
  payment: 'bg-[rgba(85,93,99,0.1)]',
};

const dateLabel = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const AdminValidationsPage: React.FC = () => {
  const {
    currentUser,
    setCurrentView,
    approveProject,
    rejectProject,
    reviewTransaction,
  } = useApp();
  const [validations, setValidations] = useState<AdminValidation[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadValidations = useCallback(async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const result = await apiRequest<ValidationResponse>(
        `/admin/validations?page=${page}&pageSize=${PAGE_SIZE}`,
      );
      setValidations(result.validations);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load validations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadValidations(activePage);
  }, [activePage, loadValidations]);

  const review = async (item: AdminValidation, decision: ValidationDecision) => {
    setError('');
    setLoadingId(item.id);
    try {
      if (item.type === 'project') {
        if (decision === 'approve') await approveProject(item.id);
        else await rejectProject(item.id);
      } else if (item.type === 'payment') {
        await reviewTransaction(item.id, decision === 'approve' ? 'verified' : 'rejected');
      } else {
        await apiJson(
          `/admin/validations/${item.type}/${encodeURIComponent(item.id)}`,
          'PATCH',
          { status: decision === 'approve' ? 'verified' : 'rejected' },
        );
      }

      const updatedTotal = Math.max(0, total - 1);
      const updatedTotalPages = Math.ceil(updatedTotal / PAGE_SIZE);
      const nextPage = Math.min(activePage, Math.max(1, updatedTotalPages));
      if (nextPage !== activePage) setActivePage(nextPage);
      else void loadValidations(activePage);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The validation decision could not be saved.');
    } finally {
      setLoadingId(null);
    }
  };

  const pageNumbers = totalPages <= 3
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : Array.from(new Set([1, activePage, totalPages])).sort((left, right) => left - right);

  const submitterImage = (item: AdminValidation) => {
    if (item.imageUrl) return item.imageUrl;
    if (item.type === 'project' || item.type === 'company') return companyLogo;
    if (item.type === 'student') return alexAvatar;
    return personIcon;
  };

  const showingFrom = total === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(activePage * PAGE_SIZE, total);

  return (
    <div className="fixed inset-0 z-[60] overflow-auto bg-[#f9f9fc] font-['League_Spartan',sans-serif] text-[#1a1c1e]">
      <header className="fixed inset-x-0 top-0 z-30 flex h-20 items-center justify-between border-b border-[rgba(192,199,211,0.1)] bg-[rgba(248,249,250,0.8)] px-6 backdrop-blur-md sm:px-10">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setCurrentView('admin_dashboard')} className="text-[36px] font-bold leading-none tracking-[-0.02em] text-[#005f9f]">
            internspace
          </button>
          <span className="rounded-full bg-[#0078c7] px-3 py-1 text-[10px] uppercase tracking-[0.05em] text-white">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-full bg-[#eeeef0]">
            <img src={bellIcon} alt="" />
          </button>
          <div className="flex items-center gap-3 border-l border-[#c0c7d3] pl-4">
            <div className="text-right">
              <p className="text-sm leading-5">{currentUser?.name ?? 'Administrator'}</p>
              <p className="text-[10px] uppercase leading-4 text-[#707882]">Super Admin</p>
            </div>
            <img src={adminAvatar} alt={currentUser?.name ?? 'Administrator'} className="h-10 w-10 rounded-full border-2 border-[#d1e4ff] object-cover" />
          </div>
        </div>
      </header>

      <AdminSidebar activeView="admin_control" />

      <main className="ml-64 min-h-full px-6 pb-12 pt-28 sm:px-10 max-[1100px]:ml-[204px] max-[1100px]:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
          <div>
            <h1 className="text-[32px] font-semibold leading-[1.4] tracking-[-0.01em]">Administration Control</h1>
            <p className="text-base leading-[1.6] text-[#404751]">Approve submitted projects, payments, and user profiles from companies and students.</p>
          </div>

          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

          <section className="overflow-hidden rounded-[32px] border border-[rgba(192,199,211,0.3)] bg-white shadow-sm">
            <div className="grid grid-cols-12 gap-4 border-b border-[rgba(192,199,211,0.2)] bg-[#f3f3f6] px-6 py-4 text-[10px] uppercase tracking-[1px] text-[#707882]">
              <span className="col-span-4">Item details</span>
              <span className="col-span-3">Submitter</span>
              <span className="col-span-2">Date submitted</span>
              <span className="col-span-3 text-right">Actions</span>
            </div>

            {loading ? (
              <p role="status" className="px-6 py-12 text-center text-sm text-[#707882]">Loading pending validations…</p>
            ) : validations.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <h2 className="text-lg font-semibold">No pending validations</h2>
                <p className="mt-2 text-sm text-[#707882]">New project, payment, company, and student reviews will appear here.</p>
              </div>
            ) : (
              validations.map((item, index) => (
                <div key={`${item.type}-${item.id}`} className={`grid grid-cols-12 items-center gap-4 px-4 py-5 sm:px-6 ${index > 0 ? 'border-t border-[rgba(192,199,211,0.2)]' : ''}`}>
                  <div className="col-span-4 flex min-w-0 items-center gap-3 sm:gap-4">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${rowIconBackgrounds[item.type]}`}>
                      <img src={rowIcons[item.type]} alt="" />
                    </span>
                    <div className="min-w-0">
                      <span className="inline-flex max-w-full rounded-full bg-[#e2e2e5] px-2 py-0.5 text-[9px] leading-[13.5px] text-[#404751]">{item.label}</span>
                      <p className="mt-1 truncate text-sm leading-5 text-[#1a1c1e] sm:text-base">{item.title}</p>
                      <p className="truncate text-xs leading-5 text-[#707882]">{item.detail}</p>
                      {item.attachmentUrl && (
                        <a href={item.attachmentUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#005f9f] underline">
                          View submitted document
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="col-span-3 flex min-w-0 items-center gap-2 sm:gap-3">
                    <img
                      src={submitterImage(item)}
                      alt=""
                      className={`h-8 w-8 shrink-0 border border-[#c0c7d3] object-cover ${item.type === 'project' ? 'rounded-[6px]' : 'rounded-full'}`}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs leading-5 text-[#1a1c1e] sm:text-sm">{item.submitterName}</p>
                      <p className="truncate text-[9px] uppercase leading-4 text-[#707882]">{item.submitterDetail}</p>
                    </div>
                  </div>

                  <p className="col-span-2 text-xs leading-5 text-[#707882] sm:text-sm">{dateLabel(item.submittedAt)}</p>

                  <div className="col-span-3 flex justify-end gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      disabled={loadingId === item.id}
                      onClick={() => void review(item, 'reject')}
                      className="rounded-full border border-[#ba1a1a] px-2.5 py-2 text-xs text-[#ba1a1a] disabled:opacity-50 sm:px-4 sm:text-sm"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={loadingId === item.id || (item.type === 'payment' && !item.attachmentUrl)}
                      onClick={() => void review(item, 'approve')}
                      className="rounded-full bg-[#005f9f] px-2.5 py-2 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(192,199,211,0.2)] bg-[#f3f3f6] px-6 py-4">
              <p className="text-xs text-[#707882] sm:text-sm">Showing {showingFrom} to {showingTo} of {total} entries</p>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Previous page" disabled={activePage === 1 || loading} onClick={() => setActivePage((page) => Math.max(1, page - 1))} className="grid h-8 w-8 place-items-center rounded-md opacity-50 disabled:opacity-30">
                    <img src={previousIcon} alt="" />
                  </button>
                  {pageNumbers.map((page, index) => (
                    <React.Fragment key={page}>
                      {index > 0 && page - pageNumbers[index - 1] > 1 && <span className="px-1 text-sm text-[#707882]">…</span>}
                      <button type="button" disabled={loading} onClick={() => setActivePage(page)} aria-current={activePage === page ? 'page' : undefined} className={`grid h-8 w-8 place-items-center rounded-md text-sm ${activePage === page ? 'bg-[#d1e4ff] text-[#001d36]' : 'text-[#707882]'}`}>
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                  <button type="button" aria-label="Next page" disabled={activePage === totalPages || loading} onClick={() => setActivePage((page) => Math.min(totalPages, page + 1))} className="grid h-8 w-8 place-items-center rounded-md disabled:opacity-30">
                    <img src={nextIcon} alt="" />
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
