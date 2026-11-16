import { Star, MessageSquare, Building } from "lucide-react";

export default function StudentFeedback() {
  const reviews = [
    {
      id: "rev-1",
      projectName: "UI/UX Redesign Landing Page",
      company: "PT Logistik Indonesia",
      rating: 5,
      feedback: "Hasil pengerjaan sangat rapi, komunikasi aktif, dan penyelesaian tugas tepat waktu sesuai brief proyek.",
      date: "14 Maret 2026",
    },
    {
      id: "rev-2",
      projectName: "SEO Content Writing",
      company: "Media Tech Bandung",
      rating: 4,
      feedback: "Artikel yang ditulis memiliki struktur yang baik dan riset kata kunci yang cukup akurat.",
      date: "25 Januari 2026",
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Rating & Feedback Perusahaan</h1>
        <p className="text-slate-500 text-xs mt-1">Ulasan dan penilaian dari mitra perusahaan untuk proyek yang telah Anda selesaikan.</p>
      </div>

      <div className="space-y-4">
        {reviews.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-800">{item.projectName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Building className="w-3.5 h-3.5" /> {item.company}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-700">{item.rating}.0 / 5.0</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5" />
              <p className="text-xs text-slate-700 leading-relaxed italic">"{item.feedback}"</p>
            </div>

            <p className="text-[11px] text-slate-400 text-right">Diberikan pada {item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
