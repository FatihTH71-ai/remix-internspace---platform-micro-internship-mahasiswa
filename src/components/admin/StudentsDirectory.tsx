import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

import alexChenAvatar from '../../assets/figma-students/alex-chen.jpeg';
import samanthaMillerAvatar from '../../assets/figma-students/samantha-miller.jpeg';
import davidKimAvatar from '../../assets/figma-students/david-kim.jpeg';
import alexRiveraAvatar from '../../assets/figma-students/alex-rivera.jpeg';
import exportIcon from '../../assets/figma-students/previous.svg';
import inviteIcon from '../../assets/figma-students/invite.svg';
import previousIcon from '../../assets/figma-students/bell.svg';
import nextIcon from '../../assets/figma-students/more.svg';
import bellIcon from '../../assets/figma-students/bell.svg';
import { AdminSidebar } from './AdminSidebar';

interface StudentsDirectoryProps {
  showInviteModalInitially?: boolean;
}

type DirectoryStudent = {
  name: string;
  email: string;
  university: string;
  status: 'VERIFIED' | 'PENDING' | 'FLAGGED';
  joined: string;
  avatar?: string;
};

const directoryStudents: DirectoryStudent[] = [
  {
    name: 'Alex Chen',
    email: 'alex.chen@student.edu',
    university: 'Stanford University',
    status: 'VERIFIED',
    joined: 'Oct 12, 2023',
    avatar: alexChenAvatar,
  },
  {
    name: 'Samantha Miller',
    email: 's.miller@state.edu',
    university: 'State University',
    status: 'PENDING',
    joined: 'Oct 14, 2023',
    avatar: samanthaMillerAvatar,
  },
  {
    name: 'David Kim',
    email: 'dkim99@tech.edu',
    university: 'Tech Institute',
    status: 'VERIFIED',
    joined: 'Oct 15, 2023',
    avatar: davidKimAvatar,
  },
  {
    name: 'Elena Jones',
    email: 'ejones@arts.edu',
    university: 'College of Arts',
    status: 'FLAGGED',
    joined: 'Oct 16, 2023',
  },
];

const statusStyles: Record<DirectoryStudent['status'], string> = {
  VERIFIED: 'border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]',
  PENDING: 'border-[#c0c7d3] bg-[#e8e8ea] text-[#404751]',
  FLAGGED: 'border-[#ffdad6] bg-[rgba(255,218,214,0.5)] text-[#ba1a1a]',
};

export const StudentsDirectory: React.FC<StudentsDirectoryProps> = ({
  showInviteModalInitially = false,
}) => {
  const { setCurrentView } = useApp();
  const [isInviteOpen, setIsInviteOpen] = useState(showInviteModalInitially);
  const [isInviteSuccessOpen, setIsInviteSuccessOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteUniversity, setInviteUniversity] = useState('');

  const handleExport = () => {
    const csv = [
      'Name,Email,University,Status,Join Date',
      ...directoryStudents.map((student) =>
        [student.name, student.email, student.university, student.status, student.joined]
          .map((value) => `"${value}"`)
          .join(','),
      ),
    ].join('\n');
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = 'InternSpace_Students_Directory.csv';
    link.click();
  };

  const handleInvite = (event: React.FormEvent) => {
    event.preventDefault();
    setIsInviteOpen(false);
    setIsInviteSuccessOpen(true);
    setInviteName('');
    setInviteEmail('');
    setInviteUniversity('');
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
              <p className="text-sm leading-5">Alex Rivera</p>
              <p className="text-[10px] uppercase leading-4 text-[#707882]">Super Admin</p>
            </div>
            <img src={alexRiveraAvatar} alt="Alex Rivera" className="h-10 w-10 rounded-full border-2 border-[#d1e4ff] object-cover" />
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
              <button type="button" onClick={handleExport} className="flex items-center gap-2 rounded-full border border-[#005f9f] px-6 py-2 text-sm text-[#005f9f]">
                <img src={exportIcon} alt="" className="h-3 w-3" />
                Export Data
              </button>
              <button type="button" onClick={() => setIsInviteOpen(true)} className="flex items-center gap-2 rounded-full bg-[#005f9f] px-6 py-3 text-sm text-white">
                <img src={inviteIcon} alt="" className="h-[11px] w-[11px]" />
                Invite Student
              </button>
            </div>
          </div>

          <section className="overflow-hidden rounded-[32px] border border-[rgba(192,199,211,0.3)] bg-white shadow-sm">
            <div className="grid grid-cols-12 gap-4 border-b border-[rgba(192,199,211,0.2)] bg-[#f3f3f6] px-6 py-4 text-xs uppercase tracking-[0.05em] text-[#707882]">
              <span className="col-span-4">Name</span>
              <span className="col-span-3">University</span>
              <span className="col-span-2 text-center">Status</span>
              <span className="col-span-3 text-right">Join Date</span>
            </div>
            <div>
              {directoryStudents.map((student, index) => (
                <div key={student.name} className={`grid grid-cols-12 items-center gap-4 px-6 py-5 ${index > 0 ? 'border-t border-[rgba(192,199,211,0.2)]' : ''}`}>
                  <div className="col-span-4 flex min-w-0 items-center gap-4">
                    {student.avatar ? (
                      <img src={student.avatar} alt={student.name} className="h-10 w-10 shrink-0 rounded-full border-2 border-[#d1e4ff] object-cover" />
                    ) : (
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-[rgba(186,26,26,0.2)] bg-[#ffdad6] text-lg text-[#93000a]">EJ</div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-base leading-[1.6]">{student.name}</p>
                      <p className="truncate text-sm leading-[1.6] text-[#707882]">{student.email}</p>
                    </div>
                  </div>
                  <p className="col-span-3 text-sm text-[#404751]">{student.university}</p>
                  <div className="col-span-2 flex justify-center">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.05em] ${statusStyles[student.status]}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${student.status === 'VERIFIED' ? 'bg-[#16a34a]' : student.status === 'PENDING' ? 'bg-[#707882]' : 'bg-[#ba1a1a]'}`} />
                      {student.status}
                    </span>
                  </div>
                  <p className="col-span-3 text-right text-sm text-[#707882]">{student.joined}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-[rgba(192,199,211,0.2)] bg-[#f3f3f6] px-6 py-4">
              <p className="text-sm text-[#707882]">Showing 1 to 4 of 248 entries</p>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Previous page" disabled={activePage === 1} onClick={() => setActivePage((page) => Math.max(1, page - 1))} className="grid h-8 w-8 place-items-center rounded-full border border-[#707882] disabled:opacity-50">
                  <img src={previousIcon} alt="" className="h-[9px] w-[6px]" />
                </button>
                {[1, 2, 3].map((page) => (
                  <button key={page} type="button" onClick={() => setActivePage(page)} className={`grid h-8 w-8 place-items-center rounded-full border border-[#707882] text-sm ${activePage === page ? 'border-[#005f9f] bg-[#005f9f] text-white' : 'text-[#1a1c1e]'}`}>
                    {page}
                  </button>
                ))}
                <span className="px-1 text-base text-[#707882]">...</span>
                <button type="button" onClick={() => setActivePage(10)} className={`grid h-8 w-8 place-items-center rounded-full border border-[#707882] text-sm ${activePage === 10 ? 'border-[#005f9f] bg-[#005f9f] text-white' : ''}`}>10</button>
                <button type="button" aria-label="Next page" onClick={() => setActivePage((page) => Math.min(10, page + 1))} className="grid h-8 w-8 place-items-center rounded-full border border-[#707882]">
                  <img src={nextIcon} alt="" className="h-[9px] w-[6px]" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {isInviteOpen && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-[#1a1c1e]/40 p-4 backdrop-blur-sm">
          <form onSubmit={handleInvite} className="w-full max-w-[478px] rounded-[20px] bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-semibold leading-7">Add/invite students</h2>
              <button type="button" onClick={() => setIsInviteOpen(false)} className="text-[30px] font-bold leading-7 text-[#808080]" aria-label="Close invite dialog">×</button>
            </div>
            <div className="mt-6 space-y-4">
              <label className="block text-base leading-5">
                Name
                <input
                  required
                  value={inviteName}
                  onChange={(event) => setInviteName(event.target.value)}
                  placeholder="e.g. Fatih Alfaluza"
                  className="mt-2 h-10 w-full rounded-[9px] border border-[#d8d8d8] px-4 text-base text-[#202124] outline-none placeholder:text-[#77808d] focus:border-[#005f9f]"
                />
              </label>
              <label className="block text-base leading-5">
                E-mail
                <input
                  required
                  type="email"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="e.g. fatih@email.com"
                  className="mt-2 h-10 w-full rounded-[9px] border border-[#d8d8d8] px-4 text-base text-[#202124] outline-none placeholder:text-[#77808d] focus:border-[#005f9f]"
                />
              </label>
              <label className="block text-base leading-5">
                University
                <select
                  required
                  value={inviteUniversity}
                  onChange={(event) => setInviteUniversity(event.target.value)}
                  className="mt-2 h-10 w-full rounded-[9px] border border-[#d8d8d8] bg-white px-4 text-base text-[#5f6670] outline-none focus:border-[#005f9f]"
                >
                  <option value="">e.g. Universitas Logistik dan Bisnis Internasional</option>
                  <option value="Universitas Logistik dan Bisnis Internasional">Universitas Logistik dan Bisnis Internasional</option>
                  <option value="Stanford University">Stanford University</option>
                  <option value="State University">State University</option>
                  <option value="Tech Institute">Tech Institute</option>
                </select>
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="submit" className="rounded-[9px] bg-[#0068a9] px-4 py-2.5 text-sm font-semibold text-white">Invite Student</button>
            </div>
          </form>
        </div>
      )}

      {isInviteSuccessOpen && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-[#1a1c1e]/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-[420px] rounded-[20px] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#dcfce7] text-3xl text-[#15803d]">✓</div>
            <h2 className="mt-5 text-2xl font-semibold">Invitation sent</h2>
            <p className="mt-2 text-base leading-6 text-[#5f6670]">The student invitation has been submitted successfully.</p>
            <button
              type="button"
              onClick={() => setIsInviteSuccessOpen(false)}
              className="mt-6 rounded-[9px] bg-[#0068a9] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Back to Students Directory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
