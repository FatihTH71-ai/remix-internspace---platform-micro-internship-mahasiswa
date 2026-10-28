import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  UserPlus,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Ban,
  X,
  GraduationCap,
  Mail,
  Building
} from 'lucide-react';

interface StudentsDirectoryProps {
  showInviteModalInitially?: boolean;
}

export const StudentsDirectory: React.FC<StudentsDirectoryProps> = ({
  showInviteModalInitially = false
}) => {
  const { students, inviteStudent, setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'In Review' | 'Suspended'>('All');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(showInviteModalInitially);

  // Invite Student Form state (Gambar 4.27)
  const [inviteName, setInviteName] = useState('Fatih Alfaluza');
  const [inviteEmail, setInviteEmail] = useState('fatih@email.com');
  const [inviteUniversity, setInviteUniversity] = useState('Universitas Logistik dan Bisnis Internasional');

  const filteredStudents = students.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;
    inviteStudent(inviteName, inviteEmail, inviteUniversity);
    setIsInviteModalOpen(false);
    alert(`Undangan berhasil dikirim ke ${inviteEmail}`);
  };

  const handleExportData = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Name,Email,University,Major,Status\n' +
      students.map(s => `"${s.name}","${s.email}","${s.university}","${s.major}","${s.status}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'InternSpace_Students_Directory_ULBI.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header matching Gambar 4.26 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Gambar 4.26 · Direktori Mahasiswa
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Students Directory</h1>
            <p className="text-xs text-slate-500">
              Manage and verify registered student accounts across university partners.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Data</span>
            </button>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Invite Student</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student or university..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            {(['All', 'Active', 'In Review', 'Suspended'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Students Table matching Gambar 4.26 */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Mahasiswa</th>
                  <th className="py-3.5 px-6">Universitas & Program Studi</th>
                  <th className="py-3.5 px-6">Status Akun</th>
                  <th className="py-3.5 px-6">Tanggal Terdaftar</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-[11px] text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-700">
                      <p className="font-semibold text-slate-800">{student.university}</p>
                      <p className="text-[11px] text-slate-500">{student.major}</p>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          student.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : student.status === 'In Review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {student.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                        {student.status === 'In Review' && <Clock className="w-3 h-3" />}
                        {student.status === 'Suspended' && <Ban className="w-3 h-3" />}
                        <span>{student.status}</span>
                      </span>
                    </td>

                    <td className="py-4 px-6 text-slate-500 tabular-nums">
                      {student.registeredDate}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => alert(`Detail akun ${student.name} dibuka`)}
                        className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                      >
                        Kelola
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* GAMBAR 4.27: Halaman / Modal Invite Student */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  Gambar 4.27 · Undangan Mahasiswa
                </span>
                <h3 className="text-lg font-bold text-slate-900">Invite Student</h3>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fatih Alfaluza"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  placeholder="e.g. fatih@email.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">University</label>
                <select
                  value={inviteUniversity}
                  onChange={e => setInviteUniversity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Universitas Logistik dan Bisnis Internasional">
                    Universitas Logistik dan Bisnis Internasional (ULBI)
                  </option>
                  <option value="Institut Teknologi Bandung">Institut Teknologi Bandung (ITB)</option>
                  <option value="Universitas Padjadjaran">Universitas Padjadjaran (UNPAD)</option>
                  <option value="Universitas Indonesia">Universitas Indonesia (UI)</option>
                  <option value="Universitas Gadjah Mada">Universitas Gadjah Mada (UGM)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Invite Student</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
