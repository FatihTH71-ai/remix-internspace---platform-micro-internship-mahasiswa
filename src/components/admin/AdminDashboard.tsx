
import React, { useMemo, useState } from "react";
import {
  ShieldCheck,
  BriefcaseBusiness,
  Users,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Bell,
  LayoutDashboard,
  Search,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

type AdminDashboardProps = {
  initialTab?: "dashboard" | "control";
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialTab = "dashboard",
}) => {
  const {
    projects,
    applications,
    alerts,
    approveProject,
    rejectProject,
    clearAlerts,
    setCurrentView,
    setSelectedProjectId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"dashboard" | "control">(initialTab);
  const [search, setSearch] = useState("");

  const pendingProjects = useMemo(
    () =>
      projects.filter(
        (project) => project.status === "pending"
      ),
    [projects]
  );

  const filteredPending = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return pendingProjects;

    return pendingProjects.filter((project) =>
      [project.title, project.company, project.category]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [pendingProjects, search]);

  const approvedCount = projects.filter(
    (project) => project.status === "approved" || !project.status
  ).length;

  const goToProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView("project_detail");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-7 sm:flex-row sm:items-center sm:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              <ShieldCheck size={14} />
              Admin Control Center
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Dashboard Administrator
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Pantau proyek, lamaran, dan aktivitas platform InternSpace.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView("landing")}
            className="self-start rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:self-auto"
          >
            Kembali ke Beranda
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-7 px-5 py-8 sm:px-8">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
              activeTab === "dashboard"
                ? "bg-blue-700 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard size={16} />
            Ringkasan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("control")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
              activeTab === "control"
                ? "bg-blue-700 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ShieldCheck size={16} />
            Moderasi Proyek
          </button>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<BriefcaseBusiness size={22} />}
            title="Total Proyek"
            value={String(projects.length)}
            detail="Semua proyek pada platform"
            color="blue"
          />
          <StatCard
            icon={<Clock size={22} />}
            title="Menunggu Persetujuan"
            value={String(pendingProjects.length)}
            detail="Proyek yang perlu ditinjau"
            color="amber"
          />
          <StatCard
            icon={<CheckCircle2 size={22} />}
            title="Proyek Aktif"
            value={String(approvedCount)}
            detail="Proyek yang dapat dilihat mahasiswa"
            color="emerald"
          />
          <StatCard
            icon={<Users size={22} />}
            title="Total Lamaran"
            value={String(applications.length)}
            detail="Lamaran yang tercatat di aplikasi"
            color="violet"
          />
        </section>

        {activeTab === "dashboard" ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="space-y-4 lg:col-span-2">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Proyek Menunggu Persetujuan
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Tinjau informasi proyek sebelum ditampilkan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("control")}
                  className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Lihat semua
                </button>
              </div>

              {pendingProjects.length === 0 ? (
                <EmptyNotice
                  title="Tidak ada proyek yang menunggu"
                  description="Semua proyek sudah diproses atau belum ada pengajuan baru."
                />
              ) : (
                pendingProjects.slice(0, 5).map((project) => (
                  <ProjectModerationCard
                    key={project.id}
                    project={project}
                    onApprove={() => approveProject(project.id)}
                    onReject={() => rejectProject(project.id)}
                    onView={() => goToProject(project.id)}
                  />
                ))
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900">Notifikasi Sistem</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Aktivitas terbaru platform
                  </p>
                </div>
                <Bell size={19} className="text-slate-400" />
              </div>

              {alerts.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {alerts.slice(0, 6).map((alert) => (
                    <div
                      key={alert.id}
                      className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                            alert.type === "success"
                              ? "bg-emerald-500"
                              : alert.type === "warning"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {alert.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {alert.detail}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {alert.timeAgo}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={clearAlerts}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900"
                  >
                    Bersihkan notifikasi
                  </button>
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-500">
                  Tidak ada notifikasi saat ini.
                </p>
              )}

              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="font-bold text-slate-900">Pengelolaan Data</h3>
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => setCurrentView("students_directory")}
                    className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Users size={17} />
                    Direktori Mahasiswa
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView("partner_companies")}
                    className="flex w-full items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Building2 size={17} />
                    Perusahaan Mitra
                  </button>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <section className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Verifikasi dan Pengawasan Proyek
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Setujui proyek yang memenuhi kriteria atau tolak pengajuan yang
                belum sesuai.
              </p>
            </div>

            <div className="relative max-w-xl">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari judul proyek, perusahaan, atau kategori..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {filteredPending.length > 0 ? (
              <div className="space-y-4">
                {filteredPending.map((project) => (
                  <ProjectModerationCard
                    key={project.id}
                    project={project}
                    onApprove={() => approveProject(project.id)}
                    onReject={() => rejectProject(project.id)}
                    onView={() => goToProject(project.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyNotice
                title="Tidak ada proyek yang cocok"
                description="Ubah pencarian atau periksa kembali nanti saat ada pengajuan baru."
              />
            )}
          </section>
        )}
      </main>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  detail: string;
  color: "blue" | "amber" | "emerald" | "violet";
}> = ({ icon, title, value, detail, color }) => {
  const classes = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${classes[color]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  );
};

const ProjectModerationCard: React.FC<{
  project: {
    id: string;
    title: string;
    company: string;
    category: string;
    description: string;
    skillsRequired: string[];
    duration: string;
    location: string;
    stipend: string;
  };
  onApprove: () => void;
  onReject: () => void;
  onView: () => void;
}> = ({ project, onApprove, onReject, onView }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="flex flex-col justify-between gap-4 sm:flex-row">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-slate-900">{project.title}</h3>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
            Menunggu
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {project.company} · {project.category}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.skillsRequired.map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {project.duration} · {project.location} · {project.stipend}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap items-start gap-2 sm:flex-col">
        <button
          type="button"
          onClick={onView}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Detail
        </button>
        <button
          type="button"
          onClick={onApprove}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          <CheckCircle2 size={14} />
          Setujui
        </button>
        <button
          type="button"
          onClick={onReject}
          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
        >
          <XCircle size={14} />
          Tolak
        </button>
      </div>
    </div>
  </article>
);

const EmptyNotice: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
    <ShieldCheck size={30} className="mx-auto text-slate-400" />
    <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
      {description}
    </p>
  </div>
);

export { AdminDashboard };
export default AdminDashboard;
