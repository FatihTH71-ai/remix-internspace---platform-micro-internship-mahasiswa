import { Link, NavLink, Outlet } from "@remix-run/react";
import { 
  LayoutDashboard, 
  Search, 
  Award, 
  Star, 
  UserCheck, 
  LogOut,
  Bell,
  Sparkles
} from "lucide-react";

export default function StudentLayout() {
  const navItems = [
    { to: "/student", end: true, label: "Dashboard", icon: LayoutDashboard },
    { to: "/student/projects", end: false, label: "Katalog Proyek", icon: Search },
    { to: "/student/apply", end: false, label: "Pengajuan Saya", icon: UserCheck },
    { to: "/student/certificates", end: false, label: "Sertifikat Digital", icon: Award },
    { to: "/student/feedback", end: false, label: "Rating & Feedback", icon: Star },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Navigasi Mahasiswa */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Logo InternSpace */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/student" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                I
              </div>
              <span className="font-bold text-lg text-white tracking-wide">InternSpace</span>
            </Link>
          </div>

          {/* Menu Link */}
          <nav className="p-4 space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-500 px-3 mb-2 tracking-wider">
              Mahasiswa POV
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm font-semibold"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Profil Singkat Mahasiswa di Bottom Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                AN
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white leading-tight">Anisa Aulia</p>
                <p className="text-[10px] text-slate-500">Mahasiswa</p>
              </div>
            </div>
            <Link to="/" className="text-slate-400 hover:text-rose-400 transition-colors p-1" title="Keluar">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md font-medium border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Akun Mahasiswa Aktif
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
            </button>
          </div>
        </header>

        {/* Dynamic Child Routes Rendered Here */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
