import React, { useEffect, useMemo, useState } from "react";
import {
  User,
  Star,
  Award,
  Download,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileText,
  ShieldCheck,
  Send,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useApp } from "../../context/AppContext";

interface CompanyHiredWorkspaceProps {
  initialViewMode?: "profile" | "rating" | "certificate";
}

type ViewMode = "profile" | "rating" | "certificate";

export const CompanyHiredWorkspace: React.FC<
  CompanyHiredWorkspaceProps
> = ({ initialViewMode = "profile" }) => {
  const {
    currentUser,
    language,
    userRole,
    applications,
    selectedApplicationId,
    setSelectedApplicationId,
    submitRating,
    setCurrentView,
    setIsChatOpen,
    setActiveChatRecipient,
  } = useApp();

  const isId = language === "id";

  const t = {
    workspace: isId ? "Workspace Proyek" : "Project Workspace",
    profile: isId ? "Profil Lamaran" : "Application Profile",
    rating: isId ? "Penilaian" : "Evaluation",
    certificate: isId ? "Sertifikat Digital" : "Digital Certificate",
    chooseApplication: isId
      ? "Pilih lamaran untuk dilihat"
      : "Choose an application to view",
    noApplication: isId
      ? "Data lamaran belum tersedia"
      : "No application data available",
    noApplicationDescription: isId
      ? "Lamaran yang sesuai dengan akun ini belum tersedia. Kirim lamaran atau kembali ke dashboard."
      : "There are no applications for this account yet. Submit an application or return to the dashboard.",
    dashboard: isId ? "Kembali ke Dashboard" : "Back to Dashboard",
    student: isId ? "Mahasiswa" : "Student",
    company: isId ? "Perusahaan" : "Company",
    project: isId ? "Proyek" : "Project",
    status: isId ? "Status Lamaran" : "Application Status",
    submitted: isId ? "Terkirim" : "Submitted",
    reviewing: isId ? "Sedang ditinjau" : "Under review",
    accepted: isId ? "Diterima" : "Accepted",
    rejected: isId ? "Ditolak" : "Rejected",
    completed: isId ? "Selesai" : "Completed",
    contact: isId ? "Hubungi Perusahaan" : "Contact Company",
    review: isId ? "Beri Penilaian" : "Give Evaluation",
    saveRating: isId ? "Simpan Penilaian" : "Save Evaluation",
    quality: isId ? "Kualitas Hasil Kerja" : "Work Quality",
    communication: isId ? "Komunikasi" : "Communication",
    punctuality: isId ? "Ketepatan Waktu" : "Punctuality",
    feedback: isId ? "Umpan Balik" : "Feedback",
    feedbackPlaceholder: isId
      ? "Tuliskan umpan balik untuk mahasiswa..."
      : "Write feedback for the student...",
    publicFeedback: isId
      ? "Tampilkan umpan balik secara publik"
      : "Make feedback public",
    certificateTitle: isId
      ? "Sertifikat Penyelesaian Proyek"
      : "Project Completion Certificate",
    certificateSubtitle: isId
      ? "Sertifikat ini diberikan atas penyelesaian proyek mikro internship."
      : "This certificate recognizes the completion of a micro-internship project.",
    certificateFor: isId ? "Diberikan kepada" : "Presented to",
    completedProject: isId ? "telah menyelesaikan proyek" : "has completed the project",
    issuedBy: isId ? "Diterbitkan oleh" : "Issued by",
    certificateNote: isId
      ? "Sertifikat prototipe InternSpace"
      : "InternSpace prototype certificate",
    download: isId ? "Cetak / Simpan Sertifikat" : "Print / Save Certificate",
    back: isId ? "Kembali" : "Back",
    next: isId ? "Lanjutkan" : "Continue",
    ratingSaved: isId
      ? "Penilaian berhasil disimpan."
      : "Evaluation saved successfully.",
    chooseRating: isId
      ? "Berikan nilai antara 1 sampai 5 bintang."
      : "Provide a rating from 1 to 5 stars.",
    selectApp: isId ? "Pilih lamaran" : "Select application",
    applicationDetails: isId ? "Detail Lamaran" : "Application Details",
    university: isId ? "Universitas" : "University",
    major: isId ? "Program Studi" : "Major",
    email: isId ? "Email" : "Email",
    motivation: isId ? "Motivasi" : "Motivation",
    experience: isId ? "Pengalaman Relevan" : "Relevant Experience",
    portfolio: isId ? "Portofolio" : "Portfolio",
    openPortfolio: isId ? "Buka Portofolio" : "Open Portfolio",
    sentOn: isId ? "Tanggal Lamaran" : "Application Date",
  };

  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [qualityRating, setQualityRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [timeRating, setTimeRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

  const visibleApplications = useMemo(() => {
    if (!currentUser) return [];

    if (userRole === "admin") {
      return applications;
    }

    if (userRole === "company") {
      return applications.filter(
        (application) =>
          application.companyId === currentUser.id ||
          application.companyName === currentUser.companyName ||
          application.companyName === currentUser.name
      );
    }

    return applications.filter(
      (application) => application.studentId === currentUser.id
    );
  }, [applications, currentUser, userRole]);

  const app = useMemo(() => {
    if (selectedApplicationId) {
      const selected = visibleApplications.find(
        (application) => application.id === selectedApplicationId
      );

      if (selected) return selected;
    }

    return visibleApplications[0] ?? null;
  }, [visibleApplications, selectedApplicationId]);

  useEffect(() => {
    if (app && app.id !== selectedApplicationId) {
      setSelectedApplicationId(app.id);
    }
  }, [app, selectedApplicationId, setSelectedApplicationId]);

  useEffect(() => {
    if (app?.rating) {
      setQualityRating(app.rating.quality);
      setCommRating(app.rating.communication);
      setTimeRating(app.rating.punctuality);
      setFeedbackText(app.rating.feedbackText);
      setIsPublic(app.rating.isPublic);
    } else {
      setQualityRating(5);
      setCommRating(5);
      setTimeRating(5);
      setFeedbackText("");
      setIsPublic(true);
    }
    setSaveMessage("");
  }, [app?.id, app?.rating]);

  const statusLabels: Record<string, string> = {
    submitted: t.submitted,
    reviewing: t.reviewing,
    accepted: t.accepted,
    rejected: t.rejected,
    completed: t.completed,
  };

  const statusClasses: Record<string, string> = {
    submitted: "bg-blue-50 text-blue-700",
    reviewing: "bg-amber-50 text-amber-700",
    accepted: "bg-emerald-50 text-emerald-700",
    rejected: "bg-rose-50 text-rose-700",
    completed: "bg-violet-50 text-violet-700",
  };

  const handleSaveRating = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!app) return;

    submitRating(app.id, {
      quality: qualityRating,
      communication: commRating,
      punctuality: timeRating,
      feedbackText,
      isPublic,
    });

    setSaveMessage(t.ratingSaved);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Animasi bukan fitur wajib.
    }

    setViewMode("certificate");
  };

  const openChat = () => {
    if (!app) return;

    const recipientName =
      userRole === "company" ? app.studentName : app.companyName;

    const recipientId =
      userRole === "company"
        ? app.studentId
        : app.companyId || `company-${app.companyName}`;

    setActiveChatRecipient({
      id: recipientId,
      name: recipientName,
      email:
        userRole === "company" ? app.studentEmail : "",
      role: userRole === "company" ? "student" : "company",
    });

    setIsChatOpen(true);
  };

  const printCertificate = () => {
    window.print();
  };

  if (!currentUser || visibleApplications.length === 0 || !app) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <FileText size={30} />
          </div>

          <h1 className="mt-5 text-xl font-bold text-slate-900">
            {t.noApplication}
          </h1>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            {t.noApplicationDescription}
          </p>

          <button
            type="button"
            onClick={() =>
              setCurrentView(
                userRole === "company"
                  ? "company_dashboard"
                  : userRole === "admin"
                    ? "admin_dashboard"
                    : "student_dashboard"
              )
            }
            className="mt-6 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
          >
            {t.dashboard}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* PEMILIH LAMARAN */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                InternSpace
              </p>
              <h1 className="mt-1 text-xl font-bold text-slate-900">
                {t.workspace}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {t.chooseApplication}
              </p>
            </div>

            {visibleApplications.length > 1 && (
              <select
                value={app.id}
                onChange={(event) => {
                  setSelectedApplicationId(event.target.value);
                  setSaveMessage("");
                }}
                aria-label={t.selectApp}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 sm:max-w-sm"
              >
                {visibleApplications.map((application) => (
                  <option key={application.id} value={application.id}>
                    {application.projectTitle} — {application.studentName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <WorkspaceTab
              active={viewMode === "profile"}
              icon={<User size={16} />}
              label={t.profile}
              onClick={() => setViewMode("profile")}
            />
            <WorkspaceTab
              active={viewMode === "rating"}
              icon={<Star size={16} />}
              label={t.rating}
              onClick={() => setViewMode("rating")}
            />
            <WorkspaceTab
              active={viewMode === "certificate"}
              icon={<Award size={16} />}
              label={t.certificate}
              onClick={() => setViewMode("certificate")}
            />
          </div>
        </section>

        {/* PROFIL LAMARAN */}
        {viewMode === "profile" && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <User size={30} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {app.studentName}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusClasses[app.status] ??
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {statusLabels[app.status] ?? app.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {app.studentMajor}
                    {app.studentUniversity
                      ? ` · ${app.studentUniversity}`
                      : ""}
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <DetailField label={t.project} value={app.projectTitle} />
                    <DetailField label={t.company} value={app.companyName} />
                    <DetailField label={t.email} value={app.studentEmail} />
                    <DetailField
                      label={t.sentOn}
                      value={new Date(app.submittedAt).toLocaleDateString(
                        isId ? "id-ID" : "en-US",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    />
                    <DetailField
                      label={t.university}
                      value={app.studentUniversity || "-"}
                    />
                    <DetailField
                      label={t.major}
                      value={app.studentMajor || "-"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h3 className="text-lg font-bold text-slate-900">
                {t.applicationDetails}
              </h3>

              <div className="mt-5 space-y-5">
                <DetailBlock
                  label={t.motivation}
                  value={app.motivation || "-"}
                />
                <DetailBlock
                  label={t.experience}
                  value={app.relevantExperience || "-"}
                />

                {app.portfolioUrl && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t.portfolio}
                    </p>
                    <a
                      href={app.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block break-all text-sm font-semibold text-blue-700 underline"
                    >
                      {t.openPortfolio}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={openChat}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <MessageSquare size={16} />
                  {t.contact}
                </button>

                {userRole === "company" && (
                  <button
                    type="button"
                    onClick={() => setViewMode("rating")}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                  >
                    <Star size={16} />
                    {t.review}
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* FORM PENILAIAN */}
        {viewMode === "rating" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Star size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t.rating}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {app.studentName} · {app.projectTitle}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveRating} className="space-y-6">
              <RatingRow
                label={t.quality}
                value={qualityRating}
                onChange={setQualityRating}
              />
              <RatingRow
                label={t.communication}
                value={commRating}
                onChange={setCommRating}
              />
              <RatingRow
                label={t.punctuality}
                value={timeRating}
                onChange={setTimeRating}
              />

              <div>
                <label
                  htmlFor="feedback"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  {t.feedback}
                </label>
                <textarea
                  id="feedback"
                  value={feedbackText}
                  onChange={(event) => setFeedbackText(event.target.value)}
                  placeholder={t.feedbackPlaceholder}
                  rows={5}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(event) => setIsPublic(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                {t.publicFeedback}
              </label>

              {saveMessage && (
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {saveMessage}
                </p>
              )}

              <div className="flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setViewMode("profile")}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft size={16} />
                  {t.back}
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  <Send size={16} />
                  {t.saveRating}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* SERTIFIKAT DIGITAL */}
        {viewMode === "certificate" && (
          <section className="space-y-5">
            <div
              id="internspace-certificate"
              className="certificate-print relative overflow-hidden border-4 border-double border-blue-800 bg-white p-6 shadow-sm sm:p-12"
            >
              <div className="pointer-events-none absolute inset-3 border border-blue-100" />

              <div className="relative z-10 mx-auto max-w-3xl text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-700 text-white">
                  <Award size={34} />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-blue-700">
                  INTERNSPACE
                </p>

                <h2 className="mt-5 text-2xl font-bold uppercase tracking-wide text-slate-900 sm:text-4xl">
                  {t.certificateTitle}
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  {t.certificateSubtitle}
                </p>

                <p className="mt-8 text-sm text-slate-500">
                  {t.certificateFor}
                </p>

                <h3 className="mt-2 break-words text-3xl font-bold text-blue-800 sm:text-4xl">
                  {app.studentName}
                </h3>

                <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-amber-400" />

                <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-600">
                  {t.completedProject}
                </p>

                <h4 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">
                  {app.projectTitle}
                </h4>

                <p className="mt-2 text-sm text-slate-500">
                  {t.issuedBy}: <strong>{app.companyName}</strong>
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">
                      {app.companyName}
                    </p>
                    <div className="mx-auto mt-2 w-48 border-t border-slate-300" />
                    <p className="mt-2 text-xs text-slate-500">
                      {t.issuedBy}
                    </p>
                  </div>

                  <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-blue-700 text-blue-800">
                    <ShieldCheck size={26} />
                    <span className="mt-1 text-[8px] font-bold">
                      VERIFIED
                    </span>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-900">
                      {new Date(app.submittedAt).toLocaleDateString(
                        isId ? "id-ID" : "en-US",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <div className="mx-auto mt-2 w-48 border-t border-slate-300" />
                    <p className="mt-2 text-xs text-slate-500">
                      {isId ? "Tanggal penerbitan" : "Issue date"}
                    </p>
                  </div>
                </div>

                <p className="mt-10 text-[10px] text-slate-400">
                  {t.certificateNote} · ID: {app.id}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={() => setViewMode("profile")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft size={16} />
                {t.back}
              </button>

              <button
                type="button"
                onClick={printCertificate}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
              >
                <Download size={17} />
                {t.download}
              </button>
            </div>
          </section>
        )}
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #internspace-certificate,
          #internspace-certificate * {
            visibility: visible;
          }

          #internspace-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            box-shadow: none;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .certificate-print {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

const WorkspaceTab: React.FC<{
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ active, icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
      active
        ? "bg-blue-700 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    {icon}
    {label}
  </button>
);

const DetailField: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1 break-words text-sm font-medium text-slate-800">
      {value || "-"}
    </p>
  </div>
);

const DetailBlock: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </p>
    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
      {value || "-"}
    </p>
  </div>
);

const RatingRow: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
}> = ({ label, value, onChange }) => (
  <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center">
    <span className="text-sm font-semibold text-slate-800">{label}</span>

    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} stars`}
          onClick={() => onChange(star)}
          className="rounded-md p-1 transition hover:scale-110"
        >
          <Star
            size={23}
            className={
              star <= value
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-bold text-slate-600">
        {value}/5
      </span>
    </div>
  </div>
);

export default CompanyHiredWorkspace;