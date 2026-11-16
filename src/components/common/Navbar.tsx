
import React, { useState } from "react";
import {
  Search,
  Globe,
  MessageSquare,
  Bell,
  ChevronDown,
  LogOut,
  User,
  BriefcaseBusiness,
  LayoutDashboard,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

type Language = "id" | "en";

export const Navbar: React.FC = () => {
  const {
    currentUser,
    userRole,
    currentView,
    setCurrentView,
    logout,
    alerts,
    clearAlerts,
    setIsChatOpen,
  } = useApp();

  const [language, setLanguage] = useState<Language>("id");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isId = language === "id";

  const navigate = (view: string) => {
    setCurrentView(view);
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("landing");
  };

  const dashboardView =
    userRole === "company"
      ? "company_dashboard"
      : userRole === "admin"
        ? "admin_dashboard"
        : "student_dashboard";

  const dashboardLabel = isId ? "Dashboard Saya" : "My Dashboard";

  const navigationItems =
    userRole === "company"
      ? [
          { label: isId ? "Dashboard" : "Dashboard", view: "company_dashboard" },
          { label: isId ? "Kelola Pelamar" : "Applicants", view: "candidate_profile" },
          { label: isId ? "Sertifikat" : "Certificates", view: "certificate" },
        ]
      : userRole === "admin"
        ? [
            { label: "Dashboard", view: "admin_dashboard" },
            { label: isId ? "Mahasiswa" : "Students", view: "students_directory" },
            { label: isId ? "Perusahaan Mitra" : "Partner Companies", view: "partner_companies" },
          ]
        : [
            { label: isId ? "Jelajahi Proyek" : "Explore Projects", view: "projects_list" },
            { label: isId ? "Harga & Premium" : "Pricing & Premium", view: "premium" },
            { label: dashboardLabel, view: dashboardView },
          ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-[82px] max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-8">

        {/* LOGO */}
        <button
          onClick={() => navigate("landing")}
          className="flex shrink-0 items-center gap-3 text-left"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-sm">
            is.
          </div>

          <div>
            <div className="text-xl font-extrabold tracking-tight text-slate-950">
              internspace
            </div>
            <div className="text-xs font-medium tracking-wide text-blue-600">
              MICRO INTERNSHIP
            </div>
          </div>

          <ShieldCheck className="ml-1 hidden h-5 w-5 text-slate-400 sm:block" />
        </button>

        {/* SEARCH */}
        <div className="hidden max-w-[250px] flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 lg:flex">
          <Search className="mr-3 h-5 w-5 shrink-0 text-slate-400" />
          <input
            type="text"
            placeholder={isId ? "Cari proyek, keahlian..." : "Search projects, skills..."}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            onKeyDown={(event) => {
              if (event.key === "Enter") navigate("projects_list");
            }}
          />
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-5 xl:flex">
          {navigationItems.map((item) => (
            <button
              key={item.view}
              onClick={() => navigate(item.view)}
              className={`whitespace-nowrap text-sm font-medium transition ${
                currentView === item.view
                  ? "text-blue-600"
                  : "text-slate-700 hover:text-blue-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">

          {/* LANGUAGE */}
          <div className="relative">
            <button
              onClick={() => {
                setLanguageOpen(!languageOpen);
                setProfileOpen(false);
                setNotificationOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Globe className="h-5 w-5" />
              <span className="hidden sm:inline">
                {isId ? "Indonesia" : "English"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {languageOpen && (
              <div className="absolute right-0 top-14 z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                <button
                  onClick={() => {
                    setLanguage("id");
                    setLanguageOpen(false);
                  }}
                  className={`block w-full px-4 py-3 text-left text-sm hover:bg-slate-50 ${
                    isId ? "font-semibold text-blue-600" : "text-slate-700"
                  }`}
                >
                  Indonesia
                </button>

                <button
                  onClick={() => {
                    setLanguage("en");
                    setLanguageOpen(false);
                  }}
                  className={`block w-full px-4 py-3 text-left text-sm hover:bg-slate-50 ${
                    !isId ? "font-semibold text-blue-600" : "text-slate-700"
                  }`}
                >
                  English
                </button>
              </div>
            )}
          </div>

          {/* CHAT */}
          {currentUser && (
            <button
              onClick={() => setIsChatOpen(true)}
              title={isId ? "Pesan" : "Messages"}
              className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 sm:block"
            >
              <MessageSquare className="h-6 w-6" />
            </button>
          )}

          {/* NOTIFICATION */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setLanguageOpen(false);
                  setProfileOpen(false);
                }}
                title={isId ? "Notifikasi" : "Notifications"}
                className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              >
                <Bell className="h-6 w-6" />
                {alerts.length > 0 && (
                  <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-14 z-50 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">
                      {isId ? "Notifikasi" : "Notifications"}
                    </h3>
                    <button
                      onClick={clearAlerts}
                      className="text-xs font-medium text-blue-600"
                    >
                      {isId ? "Hapus semua" : "Clear all"}
                    </button>
                  </div>

                  {alerts.length === 0 ? (
                    <p className="py-5 text-center text-sm text-slate-500">
                      {isId ? "Belum ada notifikasi." : "No notifications yet."}
                    </p>
                  ) : (
                    <div className="max-h-72 space-y-3 overflow-y-auto">
                      {alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="border-b border-slate-100 pb-3 last:border-0"
                        >
                          <p className="text-sm font-semibold text-slate-800">
                            {alert.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-600">
                            {alert.detail}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {alert.timeAgo}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setLanguageOpen(false);
                  setNotificationOpen(false);
                }}
                className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-50"
              >
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-blue-600 font-bold text-white">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    currentUser.name.slice(0, 2).toUpperCase()
                  )}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-slate-900">
                    {currentUser.name}
                  </p>
                  <p className="text-xs capitalize text-slate-500">
                    {currentUser.role}
                  </p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <button
                    onClick={() => navigate(dashboardView)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {dashboardLabel}
                  </button>

                  <button
                    onClick={() => navigate("candidate_profile")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <User className="h-4 w-4" />
                    {isId ? "Profil" : "Profile"}
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {isId ? "Keluar" : "Log out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("login")}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {isId ? "Masuk" : "Sign In"}
            </button>
          )}

          {/* MOBILE MENU */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 xl:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 shadow-lg xl:hidden">
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 lg:hidden">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              placeholder={isId ? "Cari proyek..." : "Search projects..."}
              className="w-full text-sm outline-none"
              onKeyDown={(event) => {
                if (event.key === "Enter") navigate("projects_list");
              }}
            />
          </div>

          <nav className="flex flex-col">
            {navigationItems.map((item) => (
              <button
                key={item.view}
                onClick={() => navigate(item.view)}
                className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
