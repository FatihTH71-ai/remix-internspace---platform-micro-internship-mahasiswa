
import React, { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Users,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  Building2,
  FileText,
  MapPin,
  Wallet,
  X,
  Search,
  CalendarDays,
  ChevronRight,
  ClipboardList,
} from "lucide-react";

import { durationInWeeks, useApp } from "../../context/AppContext";

const CompanyDashboard: React.FC = () => {
  const {
    currentUser,
    getCompanyProjects,
    getCompanyApplications,
    addProject,
    setCurrentView,
    setSelectedApplicationId,
  } = useApp();

  const [showAddProject, setShowAddProject] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Technology",
    description: "",
    skillsRequired: "",
    duration: "",
    location: "Remote",
    stipend: "",
  });

  const companyName =
    currentUser?.companyName || currentUser?.name || "Perusahaan";

  const companyProjects = useMemo(
    () => getCompanyProjects(),
    [getCompanyProjects]
  );

  const companyApplications = useMemo(
    () => getCompanyApplications(),
    [getCompanyApplications]
  );

  const totalProjects = companyProjects.length;

  const approvedProjects = companyProjects.filter(
    (project) => project.status === "approved"
  ).length;

  const pendingProjects = companyProjects.filter(
    (project) => project.status === "pending"
  ).length;

  const totalApplicants = companyApplications.length;

  const activeApplicants = companyApplications.filter(
    (application) =>
      application.status === "submitted" ||
      application.status === "reviewing"
  ).length;

  const acceptedApplicants = companyApplications.filter(
    (application) => application.status === "accepted"
  ).length;

  const filteredProjects = companyProjects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddProject = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");

    const title = formData.title.trim();
    const description = formData.description.trim();
    const skillsRequired = formData.skillsRequired
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (title.length < 4 || title.length > 180) {
      setFormError("Nama proyek harus terdiri dari 4 sampai 180 karakter.");
      return;
    }
    if (description.length < 30 || description.length > 15000) {
      setFormError("Deskripsi proyek harus terdiri dari 30 sampai 15.000 karakter.");
      return;
    }
    if (skillsRequired.length === 0 || skillsRequired.length > 30) {
      setFormError("Masukkan 1 sampai 30 skill, pisahkan dengan tanda koma.");
      return;
    }
    if (skillsRequired.some((skill) => skill.length > 100)) {
      setFormError("Setiap skill maksimal 100 karakter.");
      return;
    }
    let durationWeeks: number;
    try {
      durationWeeks = durationInWeeks(formData.duration);
    } catch {
      setFormError("Masukkan durasi dalam minggu atau bulan, contohnya 4 Minggu.");
      return;
    }
    if (durationWeeks < 1 || durationWeeks > 104) {
      setFormError("Durasi proyek harus antara 1 minggu dan 104 minggu.");
      return;
    }
    if (formData.stipend.trim().length > 180) {
      setFormError("Insentif atau kompensasi maksimal 180 karakter.");
      return;
    }

    setIsSubmittingProject(true);
    try {
      await addProject({
        title,
        company: companyName,
        companyId: currentUser?.id,
        category: formData.category,
        description,
        skillsRequired,
        duration: formData.duration.trim(),
        durationWeeks,
        location: formData.location,
        stipend: formData.stipend.trim() || "Tidak disebutkan",
      });

      setFormData({
        title: "",
        category: "Technology",
        description: "",
        skillsRequired: "",
        duration: "",
        location: "Remote",
        stipend: "",
      });
      setShowAddProject(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Proyek gagal dikirim.");
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const handleOpenApplicant = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setCurrentView("candidate_profile");
  };

  const getProjectStatus = (status?: string) => {
    switch (status) {
      case "approved":
        return {
          label: "Dipublikasikan",
          className: "bg-green-100 text-green-700",
        };

      case "rejected":
        return {
          label: "Ditolak",
          className: "bg-red-100 text-red-700",
        };

      default:
        return {
          label: "Menunggu Persetujuan",
          className: "bg-yellow-100 text-yellow-700",
        };
    }
  };

  const getApplicationStatus = (status: string) => {
    switch (status) {
      case "accepted":
        return {
          label: "Diterima",
          className: "bg-green-100 text-green-700",
        };

      case "rejected":
        return {
          label: "Ditolak",
          className: "bg-red-100 text-red-700",
        };

      case "reviewing":
        return {
          label: "Sedang Ditinjau",
          className: "bg-blue-100 text-blue-700",
        };

      case "completed":
        return {
          label: "Selesai",
          className: "bg-purple-100 text-purple-700",
        };

      default:
        return {
          label: "Baru Masuk",
          className: "bg-yellow-100 text-yellow-700",
        };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Building2 size={16} />
                <span>Company Workspace</span>
                <ChevronRight size={14} />
                <span>Dashboard</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Selamat Datang, {companyName}!
              </h1>

              <p className="text-gray-500 mt-2">
                Kelola proyek magang dan pantau perkembangan kandidat
                melalui satu dashboard.
              </p>
            </div>

            <button
              onClick={() => setShowAddProject(true)}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              <Plus size={19} />
              Tambah Proyek
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* STATISTICS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Proyek</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {totalProjects}
                </h2>
              </div>

              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                <BriefcaseBusiness size={25} />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Seluruh proyek perusahaan
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Proyek Aktif</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {approvedProjects}
                </h2>
              </div>

              <div className="bg-green-50 text-green-600 p-3 rounded-xl">
                <CheckCircle2 size={25} />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Proyek yang telah dipublikasikan
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pelamar</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {totalApplicants}
                </h2>
              </div>

              <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
                <Users size={25} />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Kandidat yang mendaftar
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Perlu Ditinjau</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {activeApplicants}
                </h2>
              </div>

              <div className="bg-orange-50 text-orange-600 p-3 rounded-xl">
                <Clock size={25} />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Pelamar yang belum diputuskan
            </p>
          </div>
        </section>

        {/* QUICK INFORMATION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">
                  Status Persetujuan Proyek
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {pendingProjects}
                </h2>

                <p className="text-blue-100 text-sm mt-2">
                  Proyek sedang menunggu pemeriksaan admin
                </p>
              </div>

              <ClipboardList size={42} className="opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-indigo-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">
                  Kandidat Diterima
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {acceptedApplicants}
                </h2>

                <p className="text-purple-100 text-sm mt-2">
                  Kandidat yang telah diterima perusahaan
                </p>
              </div>

              <CheckCircle2 size={42} className="opacity-80" />
            </div>
          </div>
        </section>

        {/* PROJECT LIST */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Proyek Perusahaan
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Daftar proyek micro-internship yang Anda kelola.
                </p>
              </div>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari proyek..."
                  className="border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BriefcaseBusiness
                    size={28}
                    className="text-gray-400"
                  />
                </div>

                <h3 className="font-semibold text-gray-800">
                  {searchTerm
                    ? "Proyek tidak ditemukan"
                    : "Belum Ada Proyek"}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  {searchTerm
                    ? "Coba gunakan kata kunci lain."
                    : "Mulai buat proyek micro-internship pertama perusahaan Anda."}
                </p>

                {!searchTerm && (
                  <button
                    onClick={() => setShowAddProject(true)}
                    className="mt-5 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition"
                  >
                    <Plus size={17} />
                    Buat Proyek
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filteredProjects.map((project) => {
                  const status = getProjectStatus(project.status);

                  const projectApplicantCount =
                    companyApplications.filter(
                      (application) =>
                        application.projectId === project.id
                    ).length;

                  return (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                            <BriefcaseBusiness size={22} />
                          </div>

                          <div>
                            <h3 className="font-bold text-gray-900">
                              {project.title}
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              {project.category}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-4 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {project.location}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {project.duration}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Users size={14} />
                          {projectApplicantCount} pelamar
                        </span>
                      </div>

                      <div className="border-t border-gray-100 mt-5 pt-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                          <Wallet size={16} />
                          {project.stipend}
                        </span>

                        <button
                          onClick={() =>
                            setCurrentView("projects_list")
                          }
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          Lihat proyek
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* APPLICANT LIST */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Pelamar Terbaru
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Pantau kandidat yang mendaftar pada proyek Anda.
              </p>
            </div>

            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              {totalApplicants} Pelamar
            </span>
          </div>

          {companyApplications.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-gray-400" />
              </div>

              <h3 className="font-semibold text-gray-800">
                Belum Ada Pelamar
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Pelamar akan muncul di sini setelah mahasiswa mendaftar
                pada proyek perusahaan Anda.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      Nama Kandidat
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Proyek
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Tanggal Daftar
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 font-semibold text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {companyApplications.map((application) => {
                    const status = getApplicationStatus(
                      application.status
                    );

                    return (
                      <tr
                        key={application.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {application.studentName}
                          </div>

                          <div className="text-xs text-gray-500 mt-1">
                            {application.studentEmail}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {application.projectTitle}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(application.submittedAt)}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              handleOpenApplicant(application.id)
                            }
                            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
                          >
                            Detail
                            <ArrowRight size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* FOOTER INFORMATION */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start gap-3">
          <FileText
            size={21}
            className="text-blue-600 mt-0.5 shrink-0"
          />

          <div>
            <h3 className="font-semibold text-blue-900">
              Informasi Pengelolaan Proyek
            </h3>

            <p className="text-sm text-blue-800 mt-1">
              Proyek yang baru ditambahkan akan berstatus menunggu
              persetujuan admin. Setelah disetujui, proyek dapat
              ditampilkan kepada mahasiswa di halaman daftar proyek.
            </p>
          </div>
        </div>
      </main>

      {/* ADD PROJECT MODAL */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Tambah Proyek Baru
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Lengkapi informasi proyek micro-internship.
                </p>
              </div>

              <button
                onClick={() => setShowAddProject(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                aria-label="Tutup formulir"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="p-6 space-y-5">
              {formError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Proyek *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Social Media Campaign"
                  required
                  minLength={4}
                  maxLength={180}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-2 text-xs text-gray-400">Nama proyek harus terdiri dari 4 sampai 180 karakter.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori Proyek *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Technology">Technology</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Data">Data & Analytics</option>
                  <option value="Content">Content Creation</option>
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">
                    Human Resources
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi Proyek *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Jelaskan tujuan, tugas, dan tanggung jawab proyek..."
                  rows={4}
                  required
                  minLength={30}
                  maxLength={15000}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="mt-2 text-xs text-gray-400">
                  Minimal 30 karakter agar tujuan, tugas, dan tanggung jawab proyek jelas. {formData.description.trim().length}/30.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Skill yang Dibutuhkan *
                </label>

                <input
                  type="text"
                  name="skillsRequired"
                  value={formData.skillsRequired}
                  onChange={handleInputChange}
                  placeholder="Contoh: Canva, Figma, Copywriting"
                  required
                  aria-describedby="project-skills-hint"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p id="project-skills-hint" className="text-xs text-gray-400 mt-2">
                  Pisahkan setiap skill menggunakan tanda koma. Maksimal 30 skill dan 100 karakter per skill.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Durasi Proyek
                  </label>

                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Contoh: 4 Minggu"
                    required
                    aria-describedby="project-duration-hint"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p id="project-duration-hint" className="mt-2 text-xs text-gray-400">Masukkan durasi 1 sampai 104 minggu, atau dalam bulan.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lokasi
                  </label>

                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Insentif / Kompensasi
                </label>

                <input
                  type="text"
                  name="stipend"
                  value={formData.stipend}
                  onChange={handleInputChange}
                  placeholder="Contoh: Rp500.000 atau Sertifikat"
                  maxLength={180}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingProject}
                  className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Plus size={18} />
                  {isSubmittingProject ? "Mengirim..." : "Simpan Proyek"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
