import { Link } from "@remix-run/react";
import { Briefcase, Users, CheckCircle2, PlusCircle, ArrowRight } from "lucide-react";

export default function CompanyDashboard() {
  const stats = [
    { label: "Proyek Aktif", value: "3", icon: Briefcase, color: "text-blue-600 bg-blue-50" },
    { label: "Total Pelamar", value: "24", icon: Users, color: "text-indigo-600 bg-indigo-50" },
    { label: "Proyek Selesai", value: "8", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  ];

  const recentApplications = [
    {
      id: "app-1",
      studentName: "Anisa Aulia Rita Putri",
      university: "Universitas Logistik dan Bisnis Internasional",
      projectTitle: "UI/UX Redesign Landing Page",
      appliedDate: "01 Nov 2026",
      status: "Perlu Review",
    },
    {
      id: "app-2",
      studentName: "Fatih Al-Faluza",
      university: "Universitas Logistik dan Bisnis Internasional",
      projectTitle: "SEO Content Writer",
      appliedDate: "30 Okt 2026",
      status: "Perlu Review",
    },
  ];

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Selamat Datang, PT Logistik Indonesia! 👋</h1>
          <p className="text-slate-500 text-xs mt-1">
            Kelola lowongan proyek micro-internship dan seleksi talenta mahasiswa terbaik.
          </p>
        </div>
        <Link
          to="/company/create-project"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Post Proyek Baru
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{item.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{item.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pelamar Terbaru */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-sm">Pelamar Terbaru Masuk</h3>
          <Link to="/company/projects" className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
            Lihat Semua Pelamar <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentApplications.map((app) => (
            <div key={app.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{app.studentName}</h4>
                <p className="text-xs text-slate-500">{app.university} • Melamar untuk: <strong className="text-slate-700">{app.projectTitle}</strong></p>
                <p className="text-[11px] text-slate-400 mt-1">Tanggal Apply: {app.appliedDate}</p>
              </div>
              <Link
                to="/company/projects"
                className="px-3 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Review Berkas
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
