import { useState } from "react";
import { Link } from "@remix-run/react";
import { PlusCircle, CheckCircle2 } from "lucide-react";

export default function CompanyCreateProject() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Post Proyek Micro-Internship Baru</h1>
        <p className="text-slate-500 text-xs mt-1">Publikasikan proyek singkat untuk dikerjakan oleh mahasiswa bertalenta.</p>
      </div>

      {submitted ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4 shadow-sm">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800">Proyek Berhasil Dipublikasikan!</h2>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Proyek Anda telah terdaftar dan dapat dilihat oleh seluruh mahasiswa di katalog proyek InternSpace.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button onClick={() => setSubmitted(false)} className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg">
              Buat Proyek Lagi
            </button>
            <Link to="/company/projects" className="px-5 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-lg">
              Kelola Proyek
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Proyek *</label>
            <input
              type="text"
              required
              placeholder="Contoh: UI/UX Redesign Landing Page Mobile App"
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Proyek *</label>
              <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white">
                <option>Design & UI/UX</option>
                <option>Web & Software Development</option>
                <option>Content Writing & SEO</option>
                <option>Digital Marketing</option>
                <option>Data Analysis</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Durasi Proyek *</label>
              <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white">
                <option>1 Minggu</option>
                <option>2 Minggu</option>
                <option>3 Minggu</option>
                <option>4 Minggu</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Insentif / Uang Saku (Rp) *</label>
              <input
                type="text"
                required
                placeholder="Contoh: 1.500.000"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Keahlian yang Dibutuhkan (Pisahkan koma) *</label>
              <input
                type="text"
                required
                placeholder="Figma, Wireframing, UI Design"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi & Brief Pekerjaan *</label>
            <textarea
              rows={4}
              required
              placeholder="Jelaskan detail tugas, ekspektasi output, serta kualifikasi pelamar..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Publiskan Proyek
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
