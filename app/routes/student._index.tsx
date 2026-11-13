import { Link } from "@remix-run/react";
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Search, 
  Award, 
  Crown, 
  ArrowRight,
  FileText,
  Star
} from "lucide-react";

export default function StudentDashboard() {
  const stats = [
    { label: "Lamaran Aktif", value: "3", icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Proyek Selesai", value: "4", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "Sertifikat Diraih", value: "4", icon: Award, color: "text-purple-600 bg-purple-50" },
  ];

  const activeProjects = [
    {
      id: "proj-101",
      title: "UI/UX Redesign App InternSpace",
      company: "PT Digital Nusantara",
      deadline: "20 Nov 2026",
      status: "Dalam Pengerjaan",
      progress: "60%",
    }
  ];

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      {/* Banner Upgrade Premium */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Crown className="w-4 h-4" /> InternSpace Premium
          </div>
          <h2 className="text-xl font-bold">Tingkatkan Peluang Diterima hingga 3x Lipat!</h2>
          <p className="text-sm text-slate-200">Dapatkan akses prioritas lamaran, rekomendasi AI, dan lencana profil terverifikasi.</p>
        </div>
        <Link
          to="/student/projects"
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl text-sm transition-colors whitespace-nowrap"
        >
          Upgrade Fitur Premium
        </Link>
      </div>

      {/* Header & Statistik Overview */}
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

      {/* Proyek Aktif & Navigasi Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800">Proyek Micro-Internship Aktif</h3>
            <Link to="/student/projects" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
              Jelajahi Proyek <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {activeProjects.map((proj) => (
            <div key={proj.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                  {proj.status}
                </span>
                <span className="text-xs text-slate-500">Tenggat: {proj.deadline}</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">{proj.title}</h4>
                <p className="text-xs text-slate-500">{proj.company}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">Progres: {proj.progress}</span>
                <Link
                  to="/student/apply"
                  className="px-3 py-1.5 bg-blue-600 text-white font-medium text-xs rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lihat Task Workspace
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Panel Pintas Fitur PI 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 mb-2">Menu Mahasiswa</h3>
          <Link to="/student/projects" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700">
            <Search className="w-4 h-4 text-blue-600" /> Katalog Proyek & Banner
          </Link>
          <Link to="/student/certificates" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700">
            <Award className="w-4 h-4 text-purple-600" /> Sertifikat Digital
          </Link>
          <Link to="/student/feedback" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700">
            <Star className="w-4 h-4 text-amber-500" /> Rating & Feedback
          </Link>
        </div>
      </div>
    </div>
  );
}
