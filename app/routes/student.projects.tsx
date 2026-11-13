import { useState } from "react";
import { Link } from "@remix-run/react";
import { Search, Filter, Clock, DollarSign, Tag, Sparkles } from "lucide-react";

export default function StudentProjects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const projects = [
    {
      id: "p1",
      title: "UI/UX Redesign Landing Page E-Commerce",
      company: "PT Logistik Indonesia",
      category: "Design",
      duration: "2 Minggu",
      stipend: "Rp 1.500.000",
      skills: ["Figma", "UI/UX", "Wireframing"],
      isFeatured: true,
    },
    {
      id: "p2",
      title: "Penyusunan Artikel SEO Bisnis Digital",
      company: "Media Tech Bandung",
      category: "Writing",
      duration: "1 Minggu",
      stipend: "Rp 750.000",
      skills: ["Copywriting", "SEO", "Content Strategy"],
      isFeatured: false,
    },
    {
      id: "p3",
      title: "Pengembangan Frontend Dashboard Remix React",
      company: "Startup Inovasi Digital",
      category: "Development",
      duration: "3 Minggu",
      stipend: "Rp 2.500.000",
      skills: ["React", "Tailwind CSS", "TypeScript"],
      isFeatured: true,
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Banner Iklan Promosi */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase flex items-center gap-1 w-max">
            <Sparkles className="w-3.5 h-3.5" /> Mitra Industri Terverifikasi
          </span>
          <h2 className="text-2xl font-bold">Bootcamp & Micro-Internship Eksklusif Telkom & BUMN</h2>
          <p className="text-xs text-blue-100 max-w-xl">Daftar sekarang untuk proyek sertifikasi kompetensi industri langsung dengan mentor senior.</p>
        </div>
        <button className="hidden md:block px-5 py-2.5 bg-white text-blue-700 font-bold rounded-xl text-sm shadow-sm hover:bg-slate-100 transition-colors">
          Pelajari Lebih Lanjut
        </button>
      </div>

      {/* Filter & Pencarian */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari posisi atau keahlian (contoh: Figma, SEO)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {["Semua", "Design", "Development", "Writing", "Marketing"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Daftar Kartu Proyek */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">{proj.category}</span>
                <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {proj.duration}</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 line-clamp-2">{proj.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{proj.company}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {proj.skills.map((s, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Uang Saku / Insentif</p>
                <p className="text-sm font-bold text-slate-800">{proj.stipend}</p>
              </div>
              <Link
                to="/student/apply"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Apply Proyek
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
