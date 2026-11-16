import { Award, Download, ExternalLink, ShieldCheck } from "lucide-react";

export default function StudentCertificates() {
  const certificates = [
    {
      id: "cert-01",
      title: "Micro-Internship UI/UX Redesign",
      company: "PT Logistik Indonesia",
      issueDate: "12 Maret 2026",
      credentialId: "CERT-IS-2026-0091",
    },
    {
      id: "cert-02",
      title: "Digital Marketing & Content Strategy",
      company: "Media Tech Bandung",
      issueDate: "20 Januari 2026",
      credentialId: "CERT-IS-2026-0043",
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Sertifikat Digital</h1>
        <p className="text-slate-500 text-xs mt-1">Daftar sertifikat resmi hasil penyelesaian proyek micro-internship di platform InternSpace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-600 font-semibold">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Terverifikasi Sistem</span>
                <span className="text-slate-400 font-normal">{cert.issueDate}</span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg">{cert.title}</h3>
              <p className="text-xs text-slate-500">Pemberi Sertifikat: <strong className="text-slate-700">{cert.company}</strong></p>
              <p className="text-[11px] text-slate-400 font-mono">ID Kredensial: {cert.credentialId}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <button className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> Unduh PDF
              </button>
              <button className="py-2 px-3 bg-blue-50 text-blue-600 font-semibold text-xs rounded-lg hover:bg-blue-100 flex items-center gap-1">
                Bagikan <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
