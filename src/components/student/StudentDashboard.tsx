import React, { useMemo, useState } from "react";
import {
  Search,
  BriefcaseBusiness,
  FileText,
  Clock,
  MapPin,
  GraduationCap,
  Wallet,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    language,
    projects,
    applications,
    setCurrentView,
    setSelectedProjectId,
    setSelectedApplicationId,
    getSkillMatch,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "recommendations" | "applications"
  >("recommendations");

  const isId = language === "id";

  const t = {
    dashboard: isId ? "Dashboard Mahasiswa" : "Student Dashboard",
    hello: isId ? "Halo" : "Hello",
    intro: isId
      ? "Pantau lamaran dan temukan proyek yang sesuai dengan keterampilanmu."
      : "Track your applications and find projects that match your skills.",
    portfolio: isId ? "Portofolio Saya" : "My Portfolio",
    explore: isId ? "Jelajahi Magang" : "Explore Internships",
    heroTitle: isId
      ? "Bangun pengalaman profesionalmu bersama InternSpace."
      : "Build your professional experience with InternSpace.",
    heroDescription: isId
      ? "Lengkapi keterampilan dan portofolio, lamar proyek yang relevan, lalu pantau perkembangan lamaranmu melalui satu dashboard."
      : "Complete your skills and portfolio, apply to relevant projects, and track your applications from one dashboard.",
    findOpportunities: isId ? "Cari Peluang Magang" : "Find Internship Opportunities",
    summary: isId ? "Ringkasan Aktivitas" : "Activity Summary",
    summaryDescription: isId
      ? "Statistik aktivitas akun mahasiswa."
      : "A summary of your student account activity.",
    opportunities: isId ? "Peluang Magang" : "Internship Opportunities",
    availableProjects: isId ? "Proyek yang tersedia" : "Available projects",
    myApplications: isId ? "Lamaran Saya" : "My Applications",
    applicationsSent: isId ? "Lamaran yang telah dikirim" : "Applications submitted",
    accepted: isId ? "Diterima" : "Accepted",
    acceptedDescription: isId
      ? "Lamaran diterima atau selesai"
      : "Accepted or completed applications",
    inProgress: isId ? "Menunggu Proses" : "In Progress",
    inProgressDescription: isId
      ? "Lamaran dalam proses"
      : "Applications being processed",
    activity: isId ? "Aktivitas dan Rekomendasi" : "Activity and Recommendations",
    activityDescription: isId
      ? "Lihat peluang yang cocok dan status lamaranmu."
      : "Explore matching opportunities and check your application status.",
    recommendations: isId ? "Rekomendasi" : "Recommendations",
    searchPlaceholder: isId
      ? "Cari posisi, perusahaan, kategori, atau keterampilan..."
      : "Search roles, companies, categories, or skills...",
    featured: isId ? "Unggulan" : "Featured",
    skillMatch: isId ? "Kecocokan Keterampilan" : "Skill Match",
    goodMatch: isId
      ? "Keterampilanmu cukup sesuai dengan kebutuhan proyek."
      : "Your skills are a good match for this project.",
    partialMatch: isId
      ? "Periksa keterampilan yang dibutuhkan sebelum melamar."
      : "Review the required skills before applying.",
    noMatch: isId
      ? "Lengkapi daftar keterampilan pada profil agar pencocokan lebih akurat."
      : "Complete your profile skills for more accurate matching.",
    details: isId ? "Lihat Detail Proyek" : "View Project Details",
    noProjects: isId ? "Proyek tidak ditemukan" : "No projects found",
    noProjectsDescription: isId
      ? "Coba gunakan kata kunci lain atau hapus pencarian."
      : "Try another keyword or clear your search.",
    clearSearch: isId ? "Hapus Pencarian" : "Clear Search",
    sent: isId ? "Dikirim" : "Submitted",
    viewDetails: isId ? "Lihat Detail" : "View Details",
    noApplications: isId ? "Belum ada lamaran" : "No applications yet",
    noApplicationsDescription: isId
      ? "Pilih proyek yang sesuai, lalu kirim lamaran melalui formulir aplikasi."
      : "Choose a suitable project and submit an application.",
    browseProjects: isId ? "Jelajahi Proyek" : "Browse Projects",
    profileTitle: isId
      ? "Lengkapi profil dan portofoliomu"
      : "Complete your profile and portfolio",
    profileDescription: isId
      ? "Portofolio dan keterampilan yang relevan membantu perusahaan memahami kemampuanmu."
      : "Your portfolio and relevant skills help companies understand your abilities.",
    openPortfolio: isId ? "Buka Portofolio" : "Open Portfolio",
    studentFallback: isId ? "Mahasiswa" : "Student",
    remote: isId ? "Jarak jauh" : "Remote",
    sentOn: isId ? "Dikirim:" : "Submitted:",
    semester: isId ? "Semester" : "Semester",
  };

  const displayName =
    currentUser?.name?.trim() ||
    currentUser?.email?.split("@")[0] ||
    t.studentFallback;

  const myApplications = useMemo(() => {
    if (!currentUser) return [];
    return applications.filter(
      (application) => application.studentId === currentUser.id
    );
  }, [applications, currentUser]);

  const approvedProjects = useMemo(
    () =>
      projects.filter(
        (project) => !project.status || project.status === "approved"
      ),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return approvedProjects
      .filter((project) => {
        if (!query) return true;

        const searchableText = [
          project.title,
          project.company,
          project.category,
          project.description,
          ...project.skillsRequired,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      })
      .sort((a, b) => getSkillMatch(b) - getSkillMatch(a))
      .slice(0, 6);
  }, [approvedProjects, searchQuery, getSkillMatch]);

  const acceptedCount = myApplications.filter(
    (application) =>
      application.status === "accepted" ||
      application.status === "completed"
  ).length;

  const inProgressCount = myApplications.filter(
    (application) =>
      application.status === "submitted" ||
      application.status === "reviewing"
  ).length;

  const statusLabels: Record<string, string> = isId
    ? {
        submitted: "Terkirim",
        reviewing: "Sedang ditinjau",
        accepted: "Diterima",
        rejected: "Ditolak",
        completed: "Selesai",
      }
    : {
        submitted: "Submitted",
        reviewing: "Under review",
        accepted: "Accepted",
        rejected: "Rejected",
        completed: "Completed",
      };

  const statusClasses: Record<string, string> = {
    submitted: "bg-blue-50 text-blue-700",
    reviewing: "bg-amber-50 text-amber-700",
    accepted: "bg-emerald-50 text-emerald-700",
    rejected: "bg-rose-50 text-rose-700",
    completed: "bg-violet-50 text-violet-700",
  };

  const openProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView("project_detail");
  };

  const openApplication = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setCurrentView("candidate_profile");
  };

  const openPortfolio = () => {
    setCurrentView("candidate_profile");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <GraduationCap size={14} />
                {t.dashboard}
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {t.hello}, {displayName}!
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                {t.intro}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openPortfolio}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <UserRound size={17} />
                {t.portfolio}
              </button>

              <button
                type="button"
                onClick={() => setCurrentView("projects_list")}
                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                {t.explore}
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 sm:px-8 lg:px-10">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-950 p-6 text-white sm:p-9">
          <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-28 right-32 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <GraduationCap size={27} />
            </div>

            <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
              {t.heroTitle}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              {t.heroDescription}
            </p>

            <button
              type="button"
              onClick={() => setCurrentView("projects_list")}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-800 transition hover:bg-blue-50"
            >
              {t.findOpportunities}
            </button>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">{t.summary}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {t.summaryDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={<BriefcaseBusiness size={22} />}
              label={t.opportunities}
              value={String(approvedProjects.length)}
              description={t.availableProjects}
              color="blue"
            />

            <SummaryCard
              icon={<FileText size={22} />}
              label={t.myApplications}
              value={String(myApplications.length)}
              description={t.applicationsSent}
              color="violet"
            />

            <SummaryCard
              icon={<CheckCircle2 size={22} />}
              label={t.accepted}
              value={String(acceptedCount)}
              description={t.acceptedDescription}
              color="emerald"
            />

            <SummaryCard
              icon={<Clock size={22} />}
              label={t.inProgress}
              value={String(inProgressCount)}
              description={t.inProgressDescription}
              color="amber"
            />
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t.activity}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {t.activityDescription}
              </p>
            </div>

            <div className="inline-flex rounded-xl bg-slate-200/70 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("recommendations")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "recommendations"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.recommendations}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("applications")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "applications"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.myApplications} ({myApplications.length})
              </button>
            </div>
          </div>

          {activeTab === "recommendations" ? (
            <>
              <div className="relative mb-6 max-w-xl">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProjects.map((project) => {
                    const match = getSkillMatch(project);

                    return (
                      <article
                        key={project.id}
                        className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-700">
                            {project.companyLogo ? (
                              <img
                                src={project.companyLogo}
                                alt={project.company}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <BriefcaseBusiness size={22} />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-slate-900">
                              {project.title}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {project.company}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            {project.category}
                          </span>

                          {project.isFeatured && (
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                              {t.featured}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-800">
                              <Sparkles size={14} />
                              {t.skillMatch}
                            </span>
                            <span className="text-sm font-bold text-blue-800">
                              {match}%
                            </span>
                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-100">
                            <div
                              className="h-full rounded-full bg-blue-600 transition-all"
                              style={{ width: `${match}%` }}
                            />
                          </div>

                          <p className="mt-2 text-xs leading-5 text-blue-800/80">
                            {match >= 70
                              ? t.goodMatch
                              : match > 0
                                ? t.partialMatch
                                : t.noMatch}
                          </p>
                        </div>

                        <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                          {project.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.skillsRequired.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                          <InfoLine
                            icon={<MapPin size={15} />}
                            value={project.location}
                          />
                          <InfoLine
                            icon={<Clock size={15} />}
                            value={project.duration}
                          />
                          <InfoLine
                            icon={<Wallet size={15} />}
                            value={project.stipend}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => openProject(project.id)}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                        >
                          <Eye size={16} />
                          {t.details}
                        </button>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title={t.noProjects}
                  description={t.noProjectsDescription}
                  actionLabel={t.clearSearch}
                  onAction={() => setSearchQuery("")}
                />
              )}
            </>
          ) : (
            <div className="space-y-4">
              {myApplications.length > 0 ? (
                myApplications.map((application) => (
                  <article
                    key={application.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <FileText size={21} />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          {application.projectTitle}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {application.companyName}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                          {t.sentOn}{" "}
                          {new Date(application.submittedAt).toLocaleDateString(
                            isId ? "id-ID" : "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          statusClasses[application.status] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabels[application.status] ??
                          application.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => openApplication(application.id)}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {t.viewDetails}
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState
                  title={t.noApplications}
                  description={t.noApplicationsDescription}
                  actionLabel={t.browseProjects}
                  onAction={() => setCurrentView("projects_list")}
                />
              )}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t.profileTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {t.profileDescription}
              </p>
            </div>

            <button
              type="button"
              onClick={openPortfolio}
              className="shrink-0 rounded-xl border border-blue-200 px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
            >
              {t.openPortfolio}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

type SummaryCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  color: "blue" | "violet" | "amber" | "emerald";
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  label,
  value,
  description,
  color,
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${colorClasses[color]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
};

const InfoLine: React.FC<{
  icon: React.ReactNode;
  value: string;
}> = ({ icon, value }) => (
  <div className="flex items-center gap-2 text-xs text-slate-500">
    <span className="shrink-0">{icon}</span>
    <span>{value}</span>
  </div>
);

const EmptyState: React.FC<{
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}> = ({ title, description, actionLabel, onAction }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
      <XCircle size={26} />
    </div>
    <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
      {description}
    </p>
    <button
      type="button"
      onClick={onAction}
      className="mt-4 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
    >
      {actionLabel}
    </button>
  </div>
);

export { StudentDashboard };
export default StudentDashboard;