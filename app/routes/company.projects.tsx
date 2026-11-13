import { useState } from "react";
import { Check, X, ExternalLink } from "lucide-react";

export default function CompanyProjects() {
  const [applicants, setApplicants] = useState([
    {
      id: "app-1",
      name: "Anisa Aulia Rita Putri",
      university: "ULBI - S1 Bisnis Digital",
      portfolio: "https://behance.net/anisaaulia",
      project: "UI/UX Redesign Landing Page",
      status: "Menunggu Seleksi",
    },
    {
      id: "app-2",
      name: "Fatih Al-Faluza",
      university: "ULBI - S1 Bisnis Digital",
      portfolio: "https://github.com/fatih",
      project: "UI/UX Redesign Landing Page",
      status: "Diterima",
    },
  ]);

  const handleStatusChange = (id: string, newStatus: string) => {
    setApplicants(
      applicants.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Kelola Pelamar Proyek</h1>
        <p className="text-slate-500 text-xs mt-1">Review berkas portofolio mahasiswa dan lakukan seleksi peserta proyek.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4">Nama Pelamar</th>
              <th className="p-4">Proyek Target</th>
              <th className="p-4">Portofolio</th>
              <th className="p-4">Status Seleksi</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applicants.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-4">
                  <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                  <p className="text-[11px] text-slate-400">{item.university}</p>
                </td>
                <td className="p-4 font-medium text-slate-700">{item.project}</td>
                <td className="p-4">
                  <a href={item.portfolio} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline flex items-center gap-1">
                    Lihat Berkas <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    item.status === "Diterima" ? "bg-emerald-100 text-emerald-700" :
                    item.status === "Ditolak" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button
                    onClick={() => handleStatusChange(item.id, "Diterima")}
                    className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                    title="Terima Pelamar"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleStatusChange(item.id, "Ditolak")}
                    className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg"
                    title="Tolak Pelamar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
