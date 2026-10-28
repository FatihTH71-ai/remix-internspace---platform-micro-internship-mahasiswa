
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  UserRound,
  BriefcaseBusiness,
  MapPin,
  Clock,
  Wallet,
  Send,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface ApplicationWizardProps {
  currentStepView?: string;
}

interface ApplicationForm {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  studyProgram: string;
  semester: string;
  motivation: string;
  relevantExperience: string;
  portfolioUrl: string;
  linkedinUrl: string;
}

const initialForm: ApplicationForm = {
  fullName: "",
  email: "",
  phone: "",
  university: "",
  studyProgram: "",
  semester: "",
  motivation: "",
  relevantExperience: "",
  portfolioUrl: "",
  linkedinUrl: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const labelClass = "text-sm font-semibold text-slate-700";

export const ApplicationWizard: React.FC<ApplicationWizardProps> = ({
  currentStepView = "apply_step1",
}) => {
  const {
    currentUser,
    userRole,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    setCurrentView,
    submitApplication,
    setSelectedApplicationId,
    applications,
  } = useApp();

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? null;

  const [form, setForm] = useState<ApplicationForm>(() => ({
    ...initialForm,
    fullName: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    university: currentUser?.university ?? "",
    studyProgram: currentUser?.major ?? "",
    portfolioUrl: currentUser?.portfolioUrl ?? "",
  }));

  const [errors, setErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState("");
  const [submittedApplicationId, setSubmittedApplicationId] =
    useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepNumber =
    currentStepView === "apply_step2"
      ? 2
      : currentStepView === "apply_step3"
        ? 3
        : currentStepView === "apply_success"
          ? 4
          : 1;

  useEffect(() => {
    if (!currentUser) return;

    setForm((previous) => ({
      ...previous,
      fullName: previous.fullName || currentUser.name || "",
      email: previous.email || currentUser.email || "",
      university: previous.university || currentUser.university || "",
      studyProgram: previous.studyProgram || currentUser.major || "",
      portfolioUrl:
        previous.portfolioUrl || currentUser.portfolioUrl || "",
    }));
  }, [currentUser]);

  const updateField = (
    field: keyof ApplicationForm,
    value: string
  ) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors([]);
    setSubmitError("");
  };

  const goToStep = (step: number) => {
    const viewByStep: Record<number, string> = {
      1: "apply_step1",
      2: "apply_step2",
      3: "apply_step3",
      4: "apply_success",
    };

    setErrors([]);
    setSubmitError("");
    setCurrentView(viewByStep[step] ?? "apply_step1");
  };

  const validateStepOne = () => {
    const nextErrors: string[] = [];

    if (!form.fullName.trim()) {
      nextErrors.push("Nama lengkap wajib diisi.");
    }

    if (!form.email.trim()) {
      nextErrors.push("Email wajib diisi.");
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.push("Format email tidak valid.");
    }

    if (!form.phone.trim()) {
      nextErrors.push("Nomor telepon wajib diisi.");
    } else if (!/^[+()\d\s.-]{8,20}$/.test(form.phone.trim())) {
      nextErrors.push("Nomor telepon tidak valid.");
    }

    if (!form.university.trim()) {
      nextErrors.push("Nama universitas wajib diisi.");
    }

    if (!form.studyProgram.trim()) {
      nextErrors.push("Program studi wajib diisi.");
    }

    if (!form.semester) {
      nextErrors.push("Semester wajib dipilih.");
    }

    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const validateStepTwo = () => {
    const nextErrors: string[] = [];

    if (form.motivation.trim().length < 30) {
      nextErrors.push(
        "Motivasi melamar minimal 30 karakter agar lebih jelas."
      );
    }

    const validateUrl = (url: string) => {
      if (!url.trim()) return true;

      try {
        const parsed = new URL(url.trim());
        return (
          parsed.protocol === "https:" ||
          parsed.protocol === "http:"
        );
      } catch {
        return false;
      }
    };

    if (!validateUrl(form.portfolioUrl)) {
      nextErrors.push(
        "URL portofolio harus berupa alamat web yang valid."
      );
    }

    if (!validateUrl(form.linkedinUrl)) {
      nextErrors.push(
        "URL LinkedIn harus berupa alamat web yang valid."
      );
    }

    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const validateProject = () => {
    if (!selectedProject) {
      setErrors([
        "Proyek belum dipilih. Kembali ke daftar proyek dan pilih proyek terlebih dahulu.",
      ]);
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateProject()) return;

    if (currentStepView === "apply_step1") {
      if (validateStepOne()) goToStep(2);
      return;
    }

    if (currentStepView === "apply_step2") {
      if (validateStepTwo()) goToStep(3);
    }
  };

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    setSubmitError("");

    if (isSubmitting) return;

    if (!currentUser || userRole !== "student") {
      setSubmitError(
        "Silakan masuk menggunakan akun mahasiswa sebelum mengirim lamaran."
      );
      return;
    }

    if (!validateProject()) {
      goToStep(1);
      return;
    }

    if (!validateStepOne()) {
      goToStep(1);
      return;
    }

    if (!validateStepTwo()) {
      goToStep(2);
      return;
    }

    if (!selectedProject) return;

    setIsSubmitting(true);

    try {
      const result = submitApplication({
        projectId: selectedProject.id,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        university: form.university,
        studyProgram: form.studyProgram,
        semester: form.semester,
        motivation: form.motivation,
        relevantExperience: form.relevantExperience,
        portfolioUrl: form.portfolioUrl,
        linkedinUrl: form.linkedinUrl,
      });

      if (result) {
        setSubmittedApplicationId(result.id);
        setSelectedApplicationId(result.id);
        goToStep(4);
        return;
      }

      const existingApplication = applications.find(
        (application) =>
          application.projectId === selectedProject.id &&
          application.studentId === currentUser.id
      );

      if (existingApplication) {
        setSubmittedApplicationId(existingApplication.id);
        setSelectedApplicationId(existingApplication.id);
        setSubmitError(
          "Kamu sudah pernah melamar proyek ini. Lamaran yang lama dapat dilihat di dashboard."
        );
        goToStep(4);
        return;
      }

      setSubmitError(
        "Lamaran belum berhasil disimpan. Pastikan proyek masih tersedia dan akunmu valid."
      );
    } catch (error) {
      console.error("Gagal mengirim lamaran:", error);
      setSubmitError(
        "Terjadi kesalahan saat mengirim lamaran. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStepView === "apply_step2") {
      goToStep(1);
    } else if (currentStepView === "apply_step3") {
      goToStep(2);
    } else {
      setCurrentView("project_detail");
    }
  };

  const handleReturnToProjects = () => {
    setCurrentView("projects_list");
  };

  const handleViewApplications = () => {
    setCurrentView("student_dashboard");
  };

  const renderErrors = () => {
    if (errors.length === 0) return null;

    return (
      <div
        role="alert"
        className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4"
      >
        <div className="flex items-start gap-2">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0 text-red-600"
          />
          <div>
            <p className="font-semibold text-red-800">
              Periksa kembali formulir
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectSummary = () => {
    if (!selectedProject) {
      return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Proyek belum dipilih. Pilih proyek terlebih dahulu sebelum
          mengirim lamaran.
          <button
            type="button"
            onClick={handleReturnToProjects}
            className="mt-3 block font-bold underline"
          >
            Kembali ke daftar proyek
          </button>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700">
            <BriefcaseBusiness size={23} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Proyek yang dilamar
            </p>
            <h3 className="mt-1 font-bold text-slate-900">
              {selectedProject.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {selectedProject.company}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} />
                {selectedProject.duration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} />
                {selectedProject.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wallet size={14} />
                {selectedProject.stipend}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepOne = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Informasi Pribadi
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Lengkapi informasi kontak dan pendidikanmu.
        </p>
      </div>

      <div>
        <label htmlFor="fullName" className={labelClass}>
          Nama Lengkap *
        </label>
        <input
          id="fullName"
          className={inputClass}
          value={form.fullName}
          onChange={(event) =>
            updateField("fullName", event.target.value)
          }
          placeholder="Masukkan nama lengkap"
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email *
        </label>
        <input
          id="email"
          type="email"
          className={inputClass}
          value={form.email}
          onChange={(event) =>
            updateField("email", event.target.value)
          }
          placeholder="nama@email.com"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Nomor Telepon *
        </label>
        <input
          id="phone"
          type="tel"
          className={inputClass}
          value={form.phone}
          onChange={(event) =>
            updateField("phone", event.target.value)
          }
          placeholder="Contoh: 081234567890"
          autoComplete="tel"
        />
      </div>

      <div>
        <label htmlFor="university" className={labelClass}>
          Universitas *
        </label>
        <input
          id="university"
          className={inputClass}
          value={form.university}
          onChange={(event) =>
            updateField("university", event.target.value)
          }
          placeholder="Nama universitas"
        />
      </div>

      <div>
        <label htmlFor="studyProgram" className={labelClass}>
          Program Studi *
        </label>
        <input
          id="studyProgram"
          className={inputClass}
          value={form.studyProgram}
          onChange={(event) =>
            updateField("studyProgram", event.target.value)
          }
          placeholder="Contoh: Pendidikan Fisika"
        />
      </div>

      <div>
        <label htmlFor="semester" className={labelClass}>
          Semester *
        </label>
        <select
          id="semester"
          className={inputClass}
          value={form.semester}
          onChange={(event) =>
            updateField("semester", event.target.value)
          }
        >
          <option value="">Pilih semester</option>
          {Array.from({ length: 14 }, (_, index) => index + 1).map(
            (semester) => (
              <option key={semester} value={String(semester)}>
                Semester {semester}
              </option>
            )
          )}
        </select>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Motivasi dan Pengalaman
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Ceritakan alasanmu melamar dan pengalaman yang relevan.
        </p>
      </div>

      <div>
        <label htmlFor="motivation" className={labelClass}>
          Motivasi Melamar *
        </label>
        <textarea
          id="motivation"
          rows={5}
          className={inputClass}
          value={form.motivation}
          onChange={(event) =>
            updateField("motivation", event.target.value)
          }
          placeholder="Jelaskan alasanmu tertarik pada proyek ini (minimal 30 karakter)."
        />
        <p className="mt-1 text-xs text-slate-400">
          {form.motivation.trim().length} karakter
        </p>
      </div>

      <div>
        <label htmlFor="experience" className={labelClass}>
          Pengalaman Relevan
        </label>
        <textarea
          id="experience"
          rows={4}
          className={inputClass}
          value={form.relevantExperience}
          onChange={(event) =>
            updateField("relevantExperience", event.target.value)
          }
          placeholder="Ceritakan pengalaman organisasi, proyek, kursus, atau pekerjaan yang relevan."
        />
      </div>

      <div>
        <label htmlFor="portfolio" className={labelClass}>
          URL Portofolio
        </label>
        <input
          id="portfolio"
          type="url"
          className={inputClass}
          value={form.portfolioUrl}
          onChange={(event) =>
            updateField("portfolioUrl", event.target.value)
          }
          placeholder="https://..."
        />
      </div>

      <div>
        <label htmlFor="linkedin" className={labelClass}>
          URL LinkedIn
        </label>
        <input
          id="linkedin"
          type="url"
          className={inputClass}
          value={form.linkedinUrl}
          onChange={(event) =>
            updateField("linkedinUrl", event.target.value)
          }
          placeholder="https://www.linkedin.com/in/..."
        />
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Periksa Lamaranmu
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Periksa kembali informasi sebelum mengirim lamaran.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 p-5">
        <div className="mb-4 flex items-center gap-2">
          <UserRound size={19} className="text-blue-700" />
          <h3 className="font-bold text-slate-900">
            Informasi Pribadi
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ReviewField label="Nama" value={form.fullName} />
          <ReviewField label="Email" value={form.email} />
          <ReviewField label="Telepon" value={form.phone} />
          <ReviewField label="Universitas" value={form.university} />
          <ReviewField label="Program Studi" value={form.studyProgram} />
          <ReviewField label="Semester" value={form.semester} />
        </div>

        <button
          type="button"
          onClick={() => goToStep(1)}
          className="mt-4 text-sm font-semibold text-blue-700 hover:underline"
        >
          Ubah informasi pribadi
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 p-5">
        <div className="mb-4 flex items-center gap-2">
          <FileText size={19} className="text-blue-700" />
          <h3 className="font-bold text-slate-900">
            Motivasi dan Pengalaman
          </h3>
        </div>

        <ReviewField label="Motivasi" value={form.motivation} />
        <div className="mt-4">
          <ReviewField
            label="Pengalaman Relevan"
            value={form.relevantExperience || "-"}
          />
        </div>
        <div className="mt-4">
          <ReviewField
            label="Portofolio"
            value={form.portfolioUrl || "-"}
          />
        </div>
        <div className="mt-4">
          <ReviewField
            label="LinkedIn"
            value={form.linkedinUrl || "-"}
          />
        </div>

        <button
          type="button"
          onClick={() => goToStep(2)}
          className="mt-4 text-sm font-semibold text-blue-700 hover:underline"
        >
          Ubah motivasi dan pengalaman
        </button>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
        Pastikan informasi yang kamu kirim benar. Setelah lamaran
        tersimpan, kamu dapat melihat statusnya melalui dashboard.
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="py-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <CheckCircle2 size={44} />
      </div>

      <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
        {submitError
          ? "Lamaran Sudah Tercatat"
          : "Lamaran Berhasil Dikirim!"}
      </h2>

      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
        {submitError ||
          `Lamaranmu untuk ${selectedProject?.title ?? "proyek ini"} telah tercatat di InternSpace.`}
      </p>

      {submittedApplicationId && (
        <div className="mx-auto mt-5 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            ID Lamaran
          </p>
          <p className="mt-1 break-all font-mono text-sm font-bold text-slate-800">
            {submittedApplicationId}
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleViewApplications}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
        >
          <ClipboardCheck size={17} />
          Lihat Dashboard
        </button>

        <button
          type="button"
          onClick={handleReturnToProjects}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Jelajahi Proyek Lain
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );

  if (!currentUser || userRole !== "student") {
    return (
      <div className="min-h-[60vh] bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <UserRound size={28} />
          </div>
          <h1 className="mt-5 text-xl font-bold text-slate-900">
            Masuk sebagai Mahasiswa
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Kamu perlu masuk menggunakan akun mahasiswa sebelum mengirim
            lamaran proyek.
          </p>
          <button
            type="button"
            onClick={() => setCurrentView("login_student")}
            className="mt-6 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Masuk Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={handleBack}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          {stepNumber === 1 ? "Kembali ke Detail Proyek" : "Kembali"}
        </button>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 px-6 py-7 text-white sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                <ClipboardCheck size={25} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                  InternSpace
                </p>
                <h1 className="mt-1 text-xl font-extrabold sm:text-2xl">
                  Formulir Lamaran Proyek
                </h1>
              </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-blue-100">
              Lengkapi data secara bertahap sebelum mengirim lamaran.
            </p>
          </div>

          <div className="p-5 sm:p-8">
            {/* INDIKATOR LANGKAH */}
            <div className="mb-8 grid grid-cols-3 gap-3">
              {[
                { number: 1, label: "Informasi" },
                { number: 2, label: "Pengalaman" },
                { number: 3, label: "Konfirmasi" },
              ].map((step) => {
                const active = stepNumber === step.number;
                const complete = stepNumber > step.number;

                return (
                  <div key={step.number} className="min-w-0">
                    <div
                      className={`flex h-9 items-center justify-center rounded-xl text-sm font-bold ${
                        active
                          ? "bg-blue-700 text-white"
                          : complete
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {complete ? (
                        <CheckCircle2 size={19} />
                      ) : (
                        step.number
                      )}
                    </div>
                    <p
                      className={`mt-2 truncate text-center text-xs font-semibold ${
                        active ? "text-blue-700" : "text-slate-500"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {renderProjectSummary()}

            <div className="mt-7">
              {currentStepView === "apply_success" ? (
                renderSuccess()
              ) : (
                <>
                  {renderErrors()}

                  {currentStepView === "apply_step1" && renderStepOne()}
                  {currentStepView === "apply_step2" && renderStepTwo()}
                  {currentStepView === "apply_step3" && renderStepThree()}

                  {submitError && (
                    <div
                      role="alert"
                      className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800"
                    >
                      {submitError}
                    </div>
                  )}

                  <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <ArrowLeft size={16} />
                      Kembali
                    </button>

                    {currentStepView === "apply_step3" ? (
                      <button
                        type="button"
                        disabled={isSubmitting || !selectedProject}
                        onClick={() => handleSubmit()}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <>
                            <LoaderCircle
                              size={17}
                              className="animate-spin"
                            />
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Kirim Lamaran
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                      >
                        Lanjutkan
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewField: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
      {value || "-"}
    </p>
  </div>
);

export default ApplicationWizard;
