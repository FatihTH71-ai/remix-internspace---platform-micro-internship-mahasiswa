import { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";

export default function CompanyReview() {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Penilaian & Feedback Mahasiswa</h1>
        <p className="text-slate-500 text-xs mt-1">Berikan ulasan performa untuk mahasiswa yang telah menyelesaikan proyek micro-internship.</p>
      </div>

      {submitted ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-3 shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-800">Ulasan Berhasil Terkirim!</h3>
          <p className="text-xs text-slate-500">Rating & feedback Anda telah dicatat dan sertifikat digital untuk mahasiswa otomatis dapat diterbitkan.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Mahasiswa & Proyek</label>
            <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white">
              <option>Anisa Aulia Rita Putri - UI/UX Redesign Landing Page</option>
              <option>Fatih Al-Faluza - SEO Content Writer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bintang Penilaian (Rating)</label>
            <div className="flex gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Evaluasi & Feedback</label>
            <textarea
              rows={4}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tuliskan ulasan hasil kerja, kelebihan, dan aspek peningkatan bagi mahasiswa..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg flex items-center gap-2">
            <Send className="w-4 h-4" /> Kirim Penilaian
          </button>
        </form>
      )}
    </div>
  );
}
