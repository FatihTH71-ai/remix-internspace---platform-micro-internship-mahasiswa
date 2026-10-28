import React, { useState } from "react";
import {
  BriefcaseBusiness,
  Search,
  Globe,
  MessageSquare,
  Bell,
  UserCircle,
  Settings,
  LogOut,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  X,
  Check,
  Trash2,
  Menu,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const Navbar: React.FC = () => {
  const {
    currentUser,
    userRole,
    language,
    setLanguage,
    currentView,
    setCurrentView,
    logout,
    setIsChatOpen,
    alerts,
    messages,
    clearAlerts,
  } = useApp();

  const [showLanguage, setShowLanguage] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isIndonesian = language === "id";
  const isGuest = !currentUser || userRole === "guest";

  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const safeMessages = Array.isArray(messages) ? messages : [];

  const unreadMessages = safeMessages.filter(
    (message) => message?.isUnread
  ).length;

  const labels = {
    explore: isIndonesian ? "Jelajahi Proyek" : "Explore Projects",
    premium: isIndonesian ? "Harga & Premium" : "Pricing & Premium",
    dashboard: isIndonesian ? "Dashboard Saya" : "My Dashboard",
    certificates: isIndonesian
      ? "Sertifikat Digital"
      : "Digital Certificates",
    search: isIndonesian
      ? "Cari proyek, kata kunci, atau perusahaan"
      : "Search projects, keywords, or companies",
    signIn: isIndonesian ? "Masuk" : "Sign In",
    getStarted: isIndonesian ? "Mulai Sekarang" : "Get Started",
    profile: isIndonesian ? "Profil Saya" : "My Profile",
    settings: isIndonesian ? "Pengaturan" : "Settings",
    signOut: isIndonesian ? "Keluar" : "Sign Out",
    alerts: isIndonesian ? "Notifikasi Sistem" : "System Alerts",
    noAlerts: isIndonesian
      ? "Belum ada notifikasi"
      : "No notifications yet",
    clearAlerts: isIndonesian
      ? "Hapus notifikasi"
      : "Clear notifications",
    admin: isIndonesian ? "Login administrator" : "Administrator login",
    chat: isIndonesian ? "Pesan" : "Messages",
    student: isIndonesian ? "Mahasiswa" : "Student",
    company: isIndonesian ? "Perusahaan" : "Company",
    close: isIndonesian ? "Tutup" : "Close",
    menu: isIndonesian ? "Menu" : "Menu",
    notification: isIndonesian ? "Notifikasi" : "Notification",
  };

  const displayName =
    currentUser?.name?.trim() ||
    currentUser?.email?.split("@")[0] ||
    (isIndonesian ? "Pengguna" : "User");

  const roleLabel =
    userRole === "admin"
      ? "Administrator"
      : userRole === "company"
        ? labels.company
        : labels.student;

  const roleDashboard =
    userRole === "admin"
      ? "admin_dashboard"
      : userRole === "company"
        ? "candidate_profile"
        : "student_dashboard";

  const navigate = (view: string) => {
    setCurrentView(view);
    setShowProfile(false);
    setShowAlerts(false);
    setShowLanguage(false);
    setShowMobileMenu(false);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Pengunjung harus login sebelum membuka daftar proyek.
    if (isGuest) {
      navigate("login");
      return;
    }

    navigate("projects_list");
  };

  const handleLogout = () => {
    setShowProfile(false);
    setShowAlerts(false);
    setShowMobileMenu(false);
    logout();
  };

  const toggleAlerts = () => {
    setShowAlerts((previous) => !previous);
    setShowProfile(false);
    setShowLanguage(false);
  };

  const toggleProfile = () => {
    setShowProfile((previous) => !previous);
    setShowAlerts(false);
    setShowLanguage(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <button
          type="button"
          onClick={() => navigate("landing")}
          className="flex shrink-0 items-center gap-2.5 text-left"
          aria-label="InternSpace Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
            <span className="text-sm font-bold">is.</span>
          </div>

          <div className="hidden sm:block">
            <div className="text-lg font-extrabold leading-5 tracking-tight text-slate-900">
              internspace
            </div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
              Micro Internship
            </div>
          </div>
        </button>

        {/* LOGIN ADMIN */}
        <button
          type="button"
          title={labels.admin}
          aria-label={labels.admin}
          onClick={() => navigate("login_admin")}
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-700 sm:flex"
        >
          <ShieldCheck size={18} />
        </button>

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="hidden min-w-[150px] max-w-[280px] flex-1 md:block"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={labels.search}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </form>

        {/* NAVIGASI DESKTOP */}
        <nav className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-7">
          {!isGuest && (
            <button
              type="button"
              onClick={() => navigate("projects_list")}
              className={`whitespace-nowrap text-xs font-medium transition hover:text-blue-700 xl:text-sm ${
                currentView === "projects_list" ||
                currentView === "project_detail"
                  ? "text-blue-700"
                  : "text-slate-700"
              }`}
            >
              {labels.explore}
            </button>
          )}

          {!isGuest && (
            <button
              type="button"
              onClick={() => navigate("premium")}
              className={`flex items-center gap-1.5 whitespace-nowrap text-xs font-medium transition hover:text-blue-700 xl:text-sm ${
                currentView === "premium"
                  ? "text-blue-700"
                  : "text-slate-700"
              }`}
            >
              <Sparkles size={15} className="text-amber-500" />
              {labels.premium}
            </button>
          )}

          {!isGuest && (
            <button
              type="button"
              onClick={() => navigate(roleDashboard)}
              className={`whitespace-nowrap text-xs font-medium transition hover:text-blue-700 xl:text-sm ${
                currentView === roleDashboard
                  ? "text-blue-700"
                  : "text-slate-700"
              }`}
            >
              {labels.dashboard}
            </button>
          )}

          {!isGuest && (
            <button
              type="button"
              onClick={() => navigate("certificate")}
              className={`whitespace-nowrap text-xs font-medium transition hover:text-blue-700 xl:text-sm ${
                currentView === "certificate"
                  ? "text-blue-700"
                  : "text-slate-700"
              }`}
            >
              {labels.certificates}
            </button>
          )}
        </nav>

        {/* MENU KANAN */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          {/* PILIHAN BAHASA GLOBAL */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setShowLanguage((previous) => !previous);
                setShowProfile(false);
                setShowAlerts(false);
              }}
              aria-expanded={showLanguage}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Globe size={16} />
              {language === "id" ? "Indonesia" : "English"}
            </button>

            {showLanguage && (
              <div className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage("id");
                    setShowLanguage(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Indonesia
                  {language === "id" && (
                    <Check size={15} className="text-blue-600" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLanguage("en");
                    setShowLanguage(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  English
                  {language === "en" && (
                    <Check size={15} className="text-blue-600" />
                  )}
                </button>
              </div>
            )}
          </div>

          {!isGuest && (
            <>
              {/* CHAT */}
              <button
                type="button"
                title={labels.chat}
                aria-label={labels.chat}
                onClick={() => setIsChatOpen(true)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-blue-700"
              >
                <MessageSquare size={19} />
                {unreadMessages > 0 && (
                  <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-600" />
                )}
              </button>

              {/* NOTIFIKASI */}
              <div className="relative">
                <button
                  type="button"
                  title={labels.alerts}
                  aria-label={labels.alerts}
                  aria-expanded={showAlerts}
                  onClick={toggleAlerts}
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-blue-700"
                >
                  <Bell size={20} />
                  {safeAlerts.length > 0 && (
                    <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500" />
                  )}
                </button>

                {showAlerts && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
                      <h3 className="text-sm font-bold text-slate-900">
                        {labels.alerts}
                      </h3>
                      <button
                        type="button"
                        aria-label={labels.close}
                        onClick={() => setShowAlerts(false)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {safeAlerts.length > 0 ? (
                        safeAlerts.map((alert) => (
                          <div
                            key={alert.id}
                            className="border-b border-slate-100 px-4 py-3.5 last:border-b-0 hover:bg-slate-50"
                          >
                            <p className="text-sm font-semibold text-slate-800">
                              {alert.title ||
                                (isIndonesian ? "Notifikasi" : "Notification")}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {alert.detail || ""}
                            </p>
                            {alert.timeAgo && (
                              <p className="mt-2 text-[11px] text-slate-400">
                                {alert.timeAgo}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-5 py-9 text-center">
                          <Bell
                            size={25}
                            className="mx-auto text-slate-300"
                          />
                          <p className="mt-3 text-sm text-slate-500">
                            {labels.noAlerts}
                          </p>
                        </div>
                      )}
                    </div>

                    {safeAlerts.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAlerts}
                        className="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        <Trash2 size={14} />
                        {labels.clearAlerts}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* PROFIL */}
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleProfile}
                  aria-expanded={showProfile}
                  className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      displayName.slice(0, 2).toUpperCase()
                    )}
                  </div>

                  <div className="hidden max-w-[140px] sm:block">
                    <p className="truncate text-xs font-bold text-slate-900">
                      {displayName}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {roleLabel}
                    </p>
                  </div>
                </button>

                {showProfile && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="border-b border-slate-100 px-3 py-3">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {displayName}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {currentUser?.email || ""}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          userRole === "company"
                            ? "candidate_profile"
                            : userRole === "admin"
                              ? "admin_dashboard"
                              : "student_dashboard"
                        )
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <UserCircle size={17} />
                      {labels.profile}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("settings")}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Settings size={17} />
                      {labels.settings}
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut size={17} />
                      {labels.signOut}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TOMBOL PENGUNJUNG */}
          {isGuest && (
            <>
              <button
                type="button"
                onClick={() => navigate("login")}
                className="hidden whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:block"
              >
                {labels.signIn}
              </button>

              <button
                type="button"
                onClick={() => navigate("login_student")}
                className="whitespace-nowrap rounded-xl bg-blue-700 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-800 sm:px-4 sm:text-sm"
              >
                {labels.getStarted}
              </button>
            </>
          )}

          {/* MENU MOBILE */}
          <button
            type="button"
            aria-label={labels.menu}
            aria-expanded={showMobileMenu}
            onClick={() => setShowMobileMenu((previous) => !previous)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            {showMobileMenu ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* NAVIGASI MOBILE */}
      {showMobileMenu && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg lg:hidden">
          <form onSubmit={handleSearch} className="mb-4 md:hidden">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={labels.search}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
              />
            </div>
          </form>

          <nav className="space-y-1">
            {!isGuest && (
              <button
                type="button"
                onClick={() => navigate("projects_list")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <BriefcaseBusiness size={18} />
                {labels.explore}
              </button>
            )}

            {!isGuest && (
              <button
                type="button"
                onClick={() => navigate("premium")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Sparkles size={18} />
                {labels.premium}
              </button>
            )}

            {!isGuest && (
              <button
                type="button"
                onClick={() => navigate(roleDashboard)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <GraduationCap size={18} />
                {labels.dashboard}
              </button>
            )}

            {!isGuest && (
              <button
                type="button"
                onClick={() => navigate("certificate")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <ShieldCheck size={18} />
                {labels.certificates}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setLanguage((previous) =>
                  previous === "id" ? "en" : "id"
                );
                setShowMobileMenu(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 sm:hidden"
            >
              <Globe size={18} />
              {language === "id" ? "Switch to English" : "Ganti ke Indonesia"}
            </button>

            {!isGuest && (
              <button
                type="button"
                onClick={() => {
                  setIsChatOpen(true);
                  setShowMobileMenu(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <MessageSquare size={18} />
                {labels.chat}
              </button>
            )}

            {isGuest && (
              <button
                type="button"
                onClick={() => navigate("login")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <UserCircle size={18} />
                {labels.signIn}
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate("login_admin")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ShieldCheck size={18} />
              {labels.admin}
            </button>

            {!isGuest && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={18} />
                {labels.signOut}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;