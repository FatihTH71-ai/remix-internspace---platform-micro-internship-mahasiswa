import { Link, NavLink, Outlet } from "@remix-run/react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  Star, 
  LogOut,
  Bell,
  CheckCircle2,
  ArrowRightLeft
} from "lucide-react";

export default function CompanyLayout() {
  const navItems = [
    { to: "/company", end: true, label: "Dashboard", icon: LayoutDashboard },
    { to: "/company/create-project", end: false, label: "Post Proyek Baru", icon: PlusCircle },
    { to: "/company/projects", end: false, label: "Kelola Proyek & Pelamar", icon: Briefcase },
    { to: "/company/review", end: false, label: "Beri Rating & Feedback", icon: Star },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Perusahaan */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Logo InternSpace */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/company" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                I
              </div>
              <span className="font-bold text-lg text-white tracking-wide">InternSpace</span>
            </Link>
          </div>

          {/* Menu Navigasi Perusahaan */}
          <nav className="p-4 space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-500 px-3 mb-2 tracking-wider">
              Company Portal
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
                        ? "bg-indigo-600 text-white shadow-sm font-semibold"
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

        {/* Bottom Sidebar: Profil Perusahaan & Switch Role */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                PT
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white leading-tight">PT Logistik Indonesia</p>
                <p className="text-[10px] text-slate-500">Mitra Terverifikasi</p>
              </div>
            </div>
            <Link to="/" className="text-slate-400 hover:text-rose-400 transition-colors p-1" title="Keluar">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>

          {/* Tombol Pengalih Portal (Role Switcher) */}
          <Link
            to="/student"
            className="flex items-center justify-center gap-2 w-full py-2 bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 font-medium text-xs rounded-lg border border-blue-700/50 transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Switch ke Portal Mahasiswa</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md font-medium border border-indigo-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Akun Perusahaan Mitra
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
            </button>
          </div>
        </header>

        {/* Tempat Render Sub-Rute (Dashboard, Create Project, Projects, Review) */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}