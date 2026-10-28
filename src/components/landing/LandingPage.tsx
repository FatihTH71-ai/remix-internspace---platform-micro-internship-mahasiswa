
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Briefcase,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building,
  GraduationCap,
  Award,
  Star,
  Users,
  Compass
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    projects,
    setCurrentView,
    setSelectedProjectId,
    userRole
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All',
    'Tech & Programming',
    'Graphic & Design',
    'Video & Animation',
    'Digital Marketing',
    'Engineering'
  ];

  const filteredProjects = projects.filter(p => {
    const matchCategory =
      activeCategory === 'All' || p.category === activeCategory;

    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.company.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100/60 pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-sky-200">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
            Start & earn <br />
            <span className="text-blue-900">
              real-work experience here
            </span>
          </h1>

          <p className="text-sm sm:text-base text-blue-950 font-medium max-w-2xl mx-auto">
            Find your micro-internship projects to improve work environment
            exposure, build a validated digital portfolio, and accelerate
            your career.
          </p>

          {/* Search Box */}
          <form
            onSubmit={e => {
              e.preventDefault();
              setCurrentView('projects_list');
            }}
            className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl border border-white/60 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center flex-1 w-full px-3 py-1.5">
              <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search projects, skills (e.g. React, Market Research)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Projects</span>
            </button>
          </form>

          {/* Hero Photos */}
          <div className="pt-6 grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            <div className="rounded-xl overflow-hidden shadow-md border-2 border-white aspect-[4/3] bg-sky-200">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80"
                alt="Students collaborating"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="rounded-xl overflow-hidden shadow-md border-2 border-white aspect-[4/3] bg-sky-200">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80"
                alt="Student presenting project"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="rounded-xl overflow-hidden shadow-md border-2 border-white aspect-[4/3] bg-sky-200">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80"
                alt="Company discussion"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 flex items-center gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Featured Micro-Internship Projects
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Proyek taktis berdurasi 2–6 minggu, fleksibel dengan jadwal kuliah Anda
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('projects_list')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>Lihat Semua Proyek</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={project.companyLogo}
                        alt={project.company}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm"
                        referrerPolicy="no-referrer"
                      />

                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {project.company}
                        </p>
                      </div>
                    </div>

                    {project.isFeatured && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.skillsRequired.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-1 text-slate-500 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{project.duration}</span>
                      <span>·</span>
                      <span>{project.location}</span>
                    </div>
                    <p className="font-bold text-blue-600">
                      {project.stipend}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setCurrentView('project_detail');
                    }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              Tidak ada proyek yang cocok.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Coba kata kunci atau kategori yang berbeda.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('All');
              }}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </section>

      {/* Why Choose InternSpace */}
      <section className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Mengapa Memilih InternSpace?
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Berdasarkan hasil survei 100+ mahasiswa ULBI Bandung, platform ini
              dirancang khusus untuk mengatasi keterbatasan magang konvensional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                Fleksibel (2–6 Minggu)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menghilangkan kendala durasi magang konvensional yang sering
                berbenturan dengan jadwal perkuliahan.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                Skill Matching Cerdas
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pencocokan proyek berdasarkan kompetensi, minat, dan tools yang
                dikuasai mahasiswa.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                Portofolio Digital Otomatis
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hasil proyek tersimpan sebagai portofolio digital yang siap
                dibagikan kepada perekrut industri.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                Sertifikat & Rating Resmi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dapatkan evaluasi kualitas, komunikasi, dan ketepatan waktu,
                beserta sertifikat digital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-xl font-bold text-slate-900">
            Apa Kata Pengguna Kami?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pengalaman mahasiswa dan mitra industri di InternSpace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>

            <p className="text-xs text-slate-700 italic leading-relaxed">
              &quot;Sebagai mahasiswa semester 6 yang sibuk skripsi dan kuliah,
              program micro internship 3 minggu di TechNova memberikan saya
              pengalaman riil memegang proyek riset pasar tanpa mengorbankan
              kuliah.&quot;
            </p>

            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Fatih"
                className="w-9 h-9 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Fatih Alfaluza
                </h4>
                <p className="text-[11px] text-slate-500">
                  Mahasiswa S1 Bisnis Digital, ULBI
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>

            <p className="text-xs text-slate-700 italic leading-relaxed">
              &quot;InternSpace sangat membantu UMKM kami mendapatkan talenta
              muda yang kompeten untuk menyelesaikan redesign landing page
              dalam hitungan minggu. Seleksinya cepat dan hasilnya berkualitas!&quot;
            </p>

            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="Sarah Jenkins"
                className="w-9 h-9 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Sarah Jenkins
                </h4>
                <p className="text-[11px] text-slate-500">
                  Product Manager, TechNova Solutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Siap Memulai Pengalaman Nyata?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
            Bergabunglah bersama mahasiswa dan perusahaan lainnya untuk
            membangun pengalaman serta portofolio profesional.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('login_student')}
              className="px-6 py-2.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              Masuk sebagai Mahasiswa
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('login_company')}
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl border border-blue-400/30 transition-colors"
            >
              Daftar sebagai Perusahaan
            </button>
          </div>

          {userRole !== 'guest' && (
            <p className="pt-1 text-xs text-blue-100">
              Anda sedang menggunakan akun demo. Untuk keluar, gunakan menu
              profil di Navbar.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
