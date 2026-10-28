
import React, { useMemo, useState } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Building2,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { useApp, type Project } from "../../context/AppContext";

interface ProjectsListPageProps {
  showAdInitially?: boolean;
}

const categories = [
  "All",
  "Technology",
  "Graphic & Design",
  "Digital Marketing",
  "Engineering",
];

const durations = [
  { label: "Semua durasi", value: "All" },
  { label: "2–4 minggu", value: "2-4 weeks" },
  { label: "1–2 bulan", value: "1-2 months" },
  { label: "Lebih dari 2 bulan", value: ">2 months" },
];

export const ProjectsListPage: React.FC<ProjectsListPageProps> = ({
  showAdInitially = false,
}) => {
  const {
    projects,
    setSelectedProjectId,
    setCurrentView,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const visibleProjects = useMemo(
    () =>
      projects.filter(
        (project) => project.status !== "rejected"
      ),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return visibleProjects.filter((project) => {
      const category = project.category.toLowerCase();
      const matchesCategory =
        selectedCategory === "All" ||
        category === selectedCategory.toLowerCase() ||
        (selectedCategory === "Technology" &&
          ["tech & programming", "technology"].includes(category));

      const durationText = project.duration.toLowerCase();
      const weekMatch = durationText.match(/(\d+)\s*minggu|(\d+)\s*weeks?/);
      const monthMatch = durationText.match(/(\d+)\s*bulan|(\d+)\s*months?/);
      const weeks = weekMatch
        ? Number(weekMatch[1] || weekMatch[2])
        : monthMatch
          ? Number(monthMatch[1] || monthMatch[2]) * 4
          : null;

      const matchesDuration =
        selectedDuration === "All" ||
        (selectedDuration === "2-4 weeks" &&
          weeks !== null &&
          weeks >= 2 &&
          weeks <= 4) ||
        (selectedDuration === "1-2 months" &&
          weeks !== null &&
          weeks >= 4 &&
          weeks <= 8) ||
        (selectedDuration === ">2 months" &&
          weeks !== null &&
          weeks > 8);

      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.company.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.skillsRequired.some((skill) =>
          skill.toLowerCase().includes(query)
        );

      return matchesCategory && matchesDuration && matchesSearch;
    });
  }, [
    visibleProjects,
    selectedCategory,
    selectedDuration,
    searchQuery,
  ]);

  const openProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView("project_detail");
  };

  const openAdProject = () => {
    const targetProject = visibleProjects.find(
      (project) => project.id === "project-detikcom"
    );

    if (targetProject) {
      openProject(targetProject.id);
      return;
    }

    // Jangan mengalihkan pengguna ke pencarian yang kosong.
    setSelectedCategory("All");
    setSelectedDuration("All");
    setSearchQuery("");
    document
      .getElementById("project-list")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedDuration("All");
    setSearchQuery("");
  };

  const renderProjectCard = (project: Project) => (
    <article
      key={project.id}
      className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-700">
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
            <Building2 size={22} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold leading-6 text-slate-900">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {project.company}
          </p>
        </div>

        {project.isFeatured && (
          <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
            Unggulan
          </span>
        )}
      </div>

      <div className="mt-3">
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {project.category}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.skillsRequired.map((skill) => (
          <span
            key={skill}
            className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} />
          {project.duration}
        </span>
        <span>·</span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={14} />
          {project.location}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold text-blue-700">
          {project.stipend}
        </p>

        <button
          type="button"
          onClick={() => openProject(project.id)}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Lihat Detail
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* BANNER IKLAN MITRA */}
        <section
          aria-label="Iklan peluang karier"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sponsored
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              Iklan Mitra
            </span>
          </div>

          <div className="grid md:grid-cols-[1.05fr_1fr]">
            <div className="relative min-h-[260px] overflow-hidden bg-blue-950">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85"
                alt="Tim profesional bekerja bersama"
                className="absolute inset-0 h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-900/10 to-transparent" />

              <div className="absolute bottom-5 left-5 z-10">
                <span className="inline-flex rounded-lg bg-white px-4 py-2 text-lg font-extrabold text-blue-900 shadow">
                  detikcom
                </span>
                <p className="mt-4 text-sm font-bold tracking-wider text-white">
                  BUILD YOUR FUTURE
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start justify-center bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 p-6 text-white sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200">
                Career Opportunity
              </p>

              <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
                Your Next Career Starts Here!
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100">
                Explore opportunities in digital media, content writing,
                SEO, and data journalism. Build your portfolio and gain
                practical experience.
              </p>

              <button
                type="button"
                onClick={openAdProject}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/30"
              >
                Lihat Peluang
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* HERO INTERNSPACE */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-700 p-6 text-white shadow-md sm:p-9">
          <div className="pointer-events-none absolute -right-8 -top-20 h-64 w-64 rounded-full border border-white/15" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="inline-flex rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold">
              InternSpace Opportunities
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Temukan Proyek Magang
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-blue-50 sm:text-base">
              Temukan proyek yang sesuai dengan keterampilan, minat, dan
              tujuan kariermu.
            </p>
          </div>
        </section>

        {/* PENCARIAN DAN DAFTAR PROYEK */}
        <div
          id="project-list"
          className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]"
        >
          <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-sm font-extrabold tracking-wide text-slate-800">
                PENCARIAN PROYEK
              </h2>
              <div className="relative mt-3">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari proyek atau perusahaan..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-extrabold tracking-wide text-slate-800">
                KATEGORI
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const active = selectedCategory === category;
                  const label = category === "All" ? "Semua kategori" : category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left text-sm transition ${
                        active
                          ? "bg-blue-50 font-semibold text-blue-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>{label}</span>
                      {active && (
                        <CheckCircle2
                          size={17}
                          className="shrink-0 text-blue-600"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-extrabold tracking-wide text-slate-800">
                DURASI PROYEK
              </h3>
              <div className="space-y-1">
                {durations.map((duration) => (
                  <button
                    key={duration.value}
                    type="button"
                    onClick={() => setSelectedDuration(duration.value)}
                    className={`w-full rounded-lg px-4 py-2.5 text-left text-sm transition ${
                      selectedDuration === duration.value
                        ? "bg-blue-50 font-semibold text-blue-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RotateCcw size={15} />
              Reset Filter
            </button>
          </aside>

          <main className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-slate-500">
                Menampilkan{" "}
                <span className="font-bold text-slate-800">
                  {filteredProjects.length}
                </span>{" "}
                proyek
              </p>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <Search
                  size={36}
                  className="mx-auto mb-3 text-slate-300"
                />
                <h3 className="font-bold text-slate-700">
                  Proyek tidak ditemukan
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Coba kata kunci atau kategori lain.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Tampilkan Semua Proyek
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {filteredProjects.map(renderProjectCard)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProjectsListPage;
