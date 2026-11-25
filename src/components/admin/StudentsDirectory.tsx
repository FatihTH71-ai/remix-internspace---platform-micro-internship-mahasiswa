import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { apiJson, apiRequest } from '../../lib/api';
import exportIcon from '../../assets/figma-students/previous.svg';
import inviteIcon from '../../assets/figma-students/invite.svg';
import previousIcon from '../../assets/figma-students/bell.svg';
import nextIcon from '../../assets/figma-students/more.svg';
import bellIcon from '../../assets/figma-students/bell.svg';
import { AdminSidebar } from './AdminSidebar';

interface StudentsDirectoryProps {
  showInviteModalInitially?: boolean;
}

type StudentStatus = 'VERIFIED' | 'PENDING' | 'FLAGGED';

interface DirectoryStudent {
  id: string;
  name: string;
  email: string;
  university: string;
  status: StudentStatus;
  joinedAt: string;
}

interface DirectoryResponse {
  students: DirectoryStudent[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const PAGE_SIZE = 4;

const statusStyles: Record<StudentStatus, string> = {
  VERIFIED: 'border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]',
  PENDING: 'border-[#c0c7d3] bg-[#e8e8ea] text-[#404751]',
  FLAGGED: 'border-[#ffdad6] bg-[rgba(255,218,214,0.5)] text-[#ba1a1a]',
};

const initialsFor = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();

export const StudentsDirectory: React.FC<StudentsDirectoryProps> = ({
  showInviteModalInitially = false,
}) => {
  const { currentUser, setCurrentView } = useApp();
  const [students, setStudents] = useState<DirectoryStudent[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(showInviteModalInitially);
  const [isInviteSuccessOpen, setIsInviteSuccessOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteUniversity, setInviteUniversity] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [exportError, setExportError] = useState('');

  const loadStudents = useCallback(async (page: number) => {
    setLoading(true);
    setLoadError('');
    try {
      const result = await apiRequest<DirectoryResponse>(
        `/admin/students?page=${page}&pageSize=${PAGE_SIZE}`,
      );
      setStudents(result.students);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not load student records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStudents(activePage);
  }, [activePage, loadStudents]);

  const handleExport = async () => {
    setExportError('');
    try {
      const response = await fetch('/api/v1/admin/students/export', { credentials: 'include' });
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { error?: { message?: string } } | null;
        throw new Error(body?.error?.message ?? `Export failed with status ${response.status}.`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'InternSpace_Students_Directory.csv';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Could not export student records.');
    }
  };

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    setInviteError('');
    setInviteLoading(true);
    try {
      await apiJson<{ message: string }>('/admin/students/invitations', 'POST', {
        name: inviteName,
        email: inviteEmail,
        university: inviteUniversity,
      });
      setIsInviteOpen(false);
      setIsInviteSuccessOpen(true);
      setInviteName('');
      setInviteEmail('');
      setInviteUniversity('');
      if (activePage !== 1) setActivePage(1);
      else void loadStudents(1);
    } catch (error) {
      setInviteError(error instanceof Error ? error.message : 'Could not invite this student.');
    } finally {
      setInviteLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== activePage) setActivePage(page);
  };

  const visiblePages = totalPages <= 5
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : Array.from(new Set([1, activePage - 1, activePage, activePage + 1, totalPages]))
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((left, right) => left - right);

  const handleInvitationClose = () => {
    setIsInviteOpen(false);
    setInviteError('');
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-auto bg-[#f9f9fc] font-['League_Spartan',sans-serif] text-[#1a1c1e]">
      <header className="fixed inset-x-0 top-0 z-30 flex h-20 items-center justify-between bg-[rgba(249,249,252,0.8)] px-6 backdrop-blur-md sm:px-10">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setCurrentView('admin_dashboard')} className="text-[36px] font-bold leading-none tracking-[-0.02em] text-[#005f9f]">
            internspace
          </button>
          <span className="rounded-full bg-[#0078c7] px-3 py-1 text-[10px] uppercase tracking-[0.05em] text-white">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-full bg-[#eeeef0]">
            <img src={bellIcon} alt="" className="h-5 w-4" />
          </button>
          <div className="flex items-center gap-3 border-l border-[#c0c7d3] pl-4">
            <div className="text-right">
              <p className="text-sm leading-5">{currentUser?.name ?? 'Admin'}</p>
              <p className="text-[10px] uppercase leading-4 text-[#707882]">{currentUser?.email ?? 'Administrator'}</p>
            </div>
            <div aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#d1e4ff] bg-[#d1e4ff] text-sm font-semibold text-[#005f9f]">
              {initialsFor(currentUser?.name ?? 'Admin')}
            </div>
          </div>
        </div>
      </header>

      <AdminSidebar activeView="students_directory" />

      <main className="ml-64 min-h-full px-6 pb-12 pt-28 sm:px-10 max-[1100px]:ml-[204px] max-[1100px]:px-8">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="whitespace-nowrap text-[32px] font-semibold leading-[1.4] tracking-[-0.01em]">Students Directory</h1>
              <p className="whitespace-nowrap text-base leading-[1.6] text-[#404751]">Manage and verify registered student accounts.</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => void handleExport()} className="flex items-center gap-2 rounded-full border border-[#005f9f] px-6 py-2 text-sm text-[#005f9f]">
                <img src={exportIcon} alt="" className="h-3 w-3" />
                Export Data
              </button>
              <button type="button" onClick={() => setIsInviteOpen(true)} className="flex items-center gap-2 rounded-full bg-[#005f9f] px-6 py-3 text-sm text-white">
                <img src={inviteIcon} alt="" className="h-[11px] w-[11px]" />
                Invite Student
              </button>
            </div>
          </div>
          {exportError && <p role="alert" className="text-sm text-[#ba1a1a]">{exportError}</p>}

          <section className="overflow-hidden rounded-[32px] border border-[rgba(192,199,211,0.3)] bg-white shadow-sm">
            <div className="grid grid-cols-12 gap-4 border-b border-[rgba(192,199,211,0.2)] bg-[#f3f3f6] px-6 py-4 text-xs uppercase tracking-[0.05em] text-[#707882]">
              <span className="col-span-4">Name</span>
              <span className="col-span-3">University</span>
              <span className="col-span-2 text-center">Status</span>
              <span className="col-span-3 text-right">Join Date</span>
            </div>
            {loading ? (
              <p role="status" className="px-6 py-12 text-center text-sm text-[#707882]">Loading student records…</p>
            ) : loadError ? (
              <div className="px-6 py-12 text-center">
                <p role="alert" className="text-sm text-[#ba1a1a]">{loadError}</p>
                <button type="button" onClick={() => void loadStudents(activePage)} className="mt-3 text-sm font-semibold text-[#005f9f]">Try again</button>
              </div>
            ) : students.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <h2 className="text-lg font-semibold">No students yet</h2>
                <p className="mt-2 text-sm text-[#707882]">Invite a student or wait for students to register. Real accounts will appear here.</p>
                <button type="button" onClick={() => setIsInviteOpen(true)} className="mt-5 rounded-full bg-[#005f9f] px-5 py-2.5 text-sm text-white">Invite Student</button>
              </div>
            ) : (
              <div>
                {students.map((student, index) => (
                  <div key={student.id} className={`grid grid-cols-12 items-center gap-4 px-6 py-5 ${index > 0 ? 'border-t border-[rgba(192,199,211,0.2)]' : ''}`}>
                    <div className="col-span-4 flex min-w-0 items-center gap-4">
                      <div aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-[#d1e4ff] bg-[#e8f1ff] text-sm font-semibold text-[#005f9f]">
                        {initialsFor(student.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base leading-[1.6]">{student.name}</p>
                        <p className="truncate text-sm leading-[1.6] text-[#707882]">{student.email}</p>
                      </div>
                    </div>
                    <p className="col-span-3 truncate text-sm text-[#404751]">{student.university}</p>
                    <div className="col-span-2 flex justify-center">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.05em] ${statusStyles[student.status]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${student.status === 'VERIFIED' ? 'bg-[#16a34a]' : student.status === 'PENDING' ? 'bg-[#707882]' : 'bg-[#ba1a1a]'}`} />
                        {student.status}
                      </span>
                    </div>
                    <p className="col-span-3 text-right text-sm text-[#707882]">{new Date(student.joinedAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between border-t border-[rgba(192,199,211,0.2)] bg-[#f3f3f6] px-6 py-4">
              <p className="text-sm text-[#707882]">
                Showing {total === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1} to {Math.min(activePage * PAGE_SIZE, total)} of {total} entries
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button type="button" aria-label="Previous page" disabled={activePage === 1 || loading} onClick={() => handlePageChange(activePage - 1)} className="grid h-8 w-8 place-items-center rounded-full border border-[#707882] disabled:opacity-50">
                    <img src={previousIcon} alt="" className="h-[9px] w-[6px]" />
                  </button>
                  {visiblePages.map((page, index) => (
                    <React.Fragment key={page}>
                      {index > 0 && page - visiblePages[index - 1] > 1 && <span className="px-1 text-base text-[#707882]">…</span>}
                      <button type="button" disabled={loading} onClick={() => handlePageChange(page)} aria-current={activePage === page ? 'page' : undefined} className={`grid h-8 w-8 place-items-center rounded-full border border-[#707882] text-sm disabled:opacity-50 ${activePage === page ? 'border-[#005f9f] bg-[#005f9f] text-white' : 'text-[#1a1c1e]'}`}>
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                  <button type="button" aria-label="Next page" disabled={activePage === totalPages || loading} onClick={() => handlePageChange(activePage + 1)} className="grid h-8 w-8 place-items-center rounded-full border border-[#707882] disabled:opacity-50">
                    <img src={nextIcon} alt="" className="h-[9px] w-[6px]" />
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {isInviteOpen && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-[#1a1c1e]/40 p-4 backdrop-blur-sm">
          <form onSubmit={handleInvite} className="w-full max-w-[478px] rounded-[20px] bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-semibold leading-7">Add/invite students</h2>
              <button type="button" onClick={handleInvitationClose} className="text-[30px] font-bold leading-7 text-[#808080]" aria-label="Close invite dialog">×</button>
            </div>
            <div className="mt-6 space-y-4">
              <label className="block text-base leading-5">
                Name
                <input required value={inviteName} onChange={(event) => setInviteName(event.target.value)} placeholder="e.g. Fatih Alfaluza" className="mt-2 h-10 w-full rounded-[9px] border border-[#d8d8d8] px-4 text-base text-[#202124] outline-none placeholder:text-[#77808d] focus:border-[#005f9f]" />
              </label>
              <label className="block text-base leading-5">
                E-mail
                <input required type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="e.g. student@email.com" className="mt-2 h-10 w-full rounded-[9px] border border-[#d8d8d8] px-4 text-base text-[#202124] outline-none placeholder:text-[#77808d] focus:border-[#005f9f]" />
              </label>
              <label className="block text-base leading-5">
                University
                <input required value={inviteUniversity} onChange={(event) => setInviteUniversity(event.target.value)} placeholder="e.g. Universitas Indonesia" className="mt-2 h-10 w-full rounded-[9px] border border-[#d8d8d8] px-4 text-base text-[#202124] outline-none placeholder:text-[#77808d] focus:border-[#005f9f]" />
              </label>
            </div>
            {inviteError && <p role="alert" className="mt-4 text-sm text-[#ba1a1a]">{inviteError}</p>}
            <div className="mt-6 flex justify-end">
              <button type="submit" disabled={inviteLoading} className="rounded-[9px] bg-[#0068a9] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {inviteLoading ? 'Sending…' : 'Invite Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isInviteSuccessOpen && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-[#1a1c1e]/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[420px] rounded-[20px] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#dcfce7] text-3xl text-[#15803d]">✓</div>
            <h2 className="mt-5 text-2xl font-semibold">Invitation sent</h2>
            <p className="mt-2 text-base leading-6 text-[#5f6670]">The student has been added as a pending account. They must verify their email, then use Forgot password to create a password.</p>
            <button type="button" onClick={() => setIsInviteSuccessOpen(false)} className="mt-6 rounded-[9px] bg-[#0068a9] px-5 py-2.5 text-sm font-semibold text-white">
              Back to Students Directory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
