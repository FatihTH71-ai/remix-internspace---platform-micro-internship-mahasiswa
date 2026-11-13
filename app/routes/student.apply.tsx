import { useState } from "react";
import { Link } from "@remix-run/react";
import { CheckCircle2, FileText, User, ArrowRight, ArrowLeft, Send } from "lucide-react";

export default function StudentApplyFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [formData, setFormData] = useState({
    fullName: "Anisa Aulia Rita Putri",
    email: "anisa.aulia@student.ulbi.ac.id",
    phone: "081298765432",
    university: "Universitas Logistik dan Bisnis Internasional",
    major: "S1 Bisnis Digital",
    portfolioUrl: "https://behance.net/anisaaulia",
    experience: "Memiliki pengalaman perancangan mockup UI/UX dan penyusunan BMC proyek InternSpace.",
    coverLetter: "Saya sangat tertarik dengan posisi Micro-internship ini karena sesuai dengan latar belakang studi saya...",
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Step Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
        {[
          { num: 1, label: "Informasi Pribadi" },
          { num: 2, label: "Portofolio Digital" },
          { num: 3, label: "Review Pengajuan" },
          { num: 4, label: "Konfirmasi" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= s.num ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
            }`}>
              {s.num}
            </div>
            <span className={`text-xs font-medium hidden md:inline ${step >= s.num ? "text-slate-800" : "text-slate-400"}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Pengisian Informasi Pribadi */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Informasi Pribadi Mahasiswa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email Mahasiswa</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Perguruan Tinggi / Universitas</label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Program Studi</label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button onClick={() => setStep(2)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center gap-2">
              Lanjut ke Portofolio <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Halaman Pengalaman dan Portofolio */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Pengalaman & Portofolio Digital
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tautan Portofolio (Figma / Drive / GitHub / Web)</label>
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Ringkasan Pengalaman</label>
              <textarea
                rows={3}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Pesan Pengantar (Cover Letter)</label>
              <textarea
                rows={3}
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="px-4 py-2 border border-slate-300 text-slate-600 font-semibold text-xs rounded-lg flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
            <button onClick={() => setStep(3)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center gap-2">
              Review Pengajuan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Halaman Review Pengajuan */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-sm">
          <h2 className="text-lg font-bold text-slate-800">Review Pengajuan Lamaran</h2>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <p><strong>Nama Lengkap:</strong> {formData.fullName}</p>
            <p><strong>Perguruan Tinggi:</strong> {formData.university} - {formData.major}</p>
            <p><strong>Link Portofolio:</strong> <a href={formData.portfolioUrl} className="text-blue-600 underline">{formData.portfolioUrl}</a></p>
            <p><strong>Cover Letter:</strong> {formData.coverLetter}</p>
          </div>
          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(2)} className="px-4 py-2 border border-slate-300 text-slate-600 font-semibold text-xs rounded-lg flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Edit Data
            </button>
            <button onClick={() => setStep(4)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg flex items-center gap-2">
              <Send className="w-4 h-4" /> Kirim Lamaran
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Halaman Konfirmasi Pengajuan */}
      {step === 4 && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800">Lamaran Berhasil Dikirim!</h2>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Lamaran Anda telah diterima oleh mitra perusahaan. Pantau status pengajuan secara berkala di Dashboard Anda.
          </p>
          <div className="pt-4">
            <Link to="/student" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg inline-block">
              Kembali ke Dashboard Mahasiswa
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
