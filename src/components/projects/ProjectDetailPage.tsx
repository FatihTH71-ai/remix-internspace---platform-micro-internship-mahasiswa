
import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Wallet,
  BriefcaseBusiness,
  GraduationCap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const ProjectDetailPage: React.FC = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    setCurrentView,
    currentUser,
    userRole,
    applications,
  } = useApp();

  const project =
    projects.find((item) => item.id === selectedProjectId) ?? null;

  const alreadyApplied =
    !!currentUser &&
    !!project &&
    applications.some(
      (application) =>
        application.projectId === project.id &&
        application.studentId === currentUser.id
    );

  const handleApply = () => {
    if (!project) {
      setCurrentView("projects_list");
      return;
    }

    setSelectedProjectId(project.id);

    if (!currentUser || userRole === "guest") {
      setCurrentView("login_student");
      return;
    }

    if (userRole !== "student") {
      window.alert("Fitur lamaran hanya tersedia untuk akun mahasiswa.");
      return;
    }

    if (alreadyApplied) {
      window.alert("Kamu sudah pernah melamar proyek ini.");
      setCurrentView("student_dashboard");
      return;
    }

    setCurrentView("apply_step1");
  };

  if (!project) {
    return (
      <div className="min-h-[60vh] bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <BriefcaseBusiness size={27} />
          </div>
          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Proyek tidak ditemukan
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Pilih proyek dari daftar untuk melihat detail dan mengirim lamaran.
          </p>
          <button
            type="button"
            onClick={() => setCurrentView("projects_list")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Proyek
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => setCurrentView("projects_list")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Kembali ke Daftar Proyek
        </button>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <main className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-600 p-6 text-white sm:p-9">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-blue-700 shadow-sm">
                    {project.companyLogo ? (
                      <img
                        src={project.companyLogo}
                        alt={`Logo ${project.company}`}
                        className="h-full w-full object-contain"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <Building2 size={30} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                      {project.category}
                    </span>
                    <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
                      {project.title}
                    </h1>
                    <p className="mt-2 text-sm text-blue-100 sm:text-base">
                      {project.company}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3 sm:p-8">
                <InfoCard
                  icon={<Clock size={20} />}
                  label="Durasi"
                  value={project.duration}
                />
                <InfoCard
                  icon={<MapPin size={20} />}
                  label="Lokasi"
                  value={project.location}
                />
                <InfoCard
                  icon={<Wallet size={20} />}
                  label="Kompensasi"
                  value={project.stipend}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold text-slate-900">
                Tentang Proyek
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                {project.description}
              </p>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="text-base font-bold text-slate-900">
                  Keterampilan yang Dibutuhkan
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.skillsRequired.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800"
                    >
                      <CheckCircle2 size={15} />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-start gap-3">
                <GraduationCap
                  size={22}
                  className="mt-0.5 shrink-0 text-blue-700"
                />
                <div>
                  <h3 className="font-bold text-blue-900">
                    Persiapkan lamaranmu
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-blue-800">
                    Pastikan informasi pendidikan, motivasi, pengalaman,
                    dan portofoliomu sudah siap sebelum mengirim lamaran.
                  </p>
                </div>
              </div>
            </section>
          </main>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Peluang Magang
            </p>
            <h2 className="mt-2 text-xl font-extrabold leading-snug text-slate-900">
              {project.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {project.company}
            </p>

            <div className="my-5 border-t border-slate-100" />

            <p className="text-xs text-slate-500">Kompensasi</p>
            <p className="mt-1 break-words text-xl font-extrabold text-blue-700">
              {project.stipend}
            </p>

            <div className="mt-5 space-y-4 text-sm">
              <DetailLine label="Perusahaan" value={project.company} />
              <DetailLine label="Durasi" value={project.duration} />
              <DetailLine label="Lokasi" value={project.location} />
              <DetailLine label="Kategori" value={project.category} />
            </div>

            <button
              type="button"
              onClick={handleApply}
              disabled={alreadyApplied}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {alreadyApplied ? "Sudah Melamar" : "Apply Now"}
              {!alreadyApplied && <ArrowRight size={17} />}
            </button>

            {alreadyApplied && (
              <p className="mt-3 text-center text-xs leading-5 text-emerald-700">
                Kamu sudah mengirim lamaran untuk proyek ini.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

const InfoCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center gap-2 text-blue-700">
      {icon}
      <span className="text-xs font-semibold text-slate-500">
        {label}
      </span>
    </div>
    <p className="mt-2 break-words text-sm font-bold text-slate-900">
      {value}
    </p>
  </div>
);

const DetailLine: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-1 break-words font-semibold text-slate-800">
      {value || "-"}
    </p>
  </div>
);

export default ProjectDetailPage;
