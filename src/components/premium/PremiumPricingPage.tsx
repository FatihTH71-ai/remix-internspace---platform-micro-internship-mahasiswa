
import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Building2,
  ShieldCheck,
  Star,
  Zap,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

type PlanType = 'student' | 'company';

export const PremiumPricingPage: React.FC = () => {
  const { setCurrentView, setPendingPaymentPlan } = useApp();
  const [activePlanTab, setActivePlanTab] = useState<PlanType>('student');

  const handleSelectPlan = (
    name: string,
    price: number,
    type: PlanType
  ) => {
    setPendingPaymentPlan({ name, price, type });
    setCurrentView('payment_checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* HEADER */}
        <header className="mx-auto max-w-2xl space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Sparkles size={28} />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Accelerate your career & projects with Premium
          </h1>

          <p className="text-sm leading-6 text-slate-600">
            Pilih paket yang dirancang untuk meningkatkan peluang mahasiswa
            atau membantu perusahaan mempercepat proses rekrutmen.
          </p>
        </header>

        {/* PILIH KATEGORI */}
        <div className="flex justify-center">
          <div className="grid w-full max-w-md grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => setActivePlanTab('student')}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition ${
                activePlanTab === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <GraduationCap size={19} />
              Mahasiswa
            </button>

            <button
              type="button"
              onClick={() => setActivePlanTab('company')}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition ${
                activePlanTab === 'company'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 size={19} />
              Perusahaan
            </button>
          </div>
        </div>

        {/* PAKET MAHASISWA */}
        {activePlanTab === 'student' && (
          <section className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
            {/* BASIC */}
            <div className="flex flex-col justify-between space-y-7 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Basic Student
                </span>

                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-slate-900">
                    Rp 0
                  </span>
                  <span className="ml-1 text-xs text-slate-500">
                    / selamanya
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Akses standar untuk mahasiswa yang baru mulai mencari
                  pengalaman kerja singkat.
                </p>

                <div className="mt-6 space-y-4 border-t border-slate-100 pt-5 text-sm text-slate-700">
                  <Feature text="Maksimal 3 lamaran proyek aktif bersamaan" />
                  <Feature text="Pencarian proyek standar" />
                  <Feature text="Portofolio digital standar" />
                  <Feature
                    text="Tanpa badge Prioritas Rekomendasi"
                    included={false}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentView('projects_list')}
                className="w-full rounded-xl bg-slate-100 px-4 py-3.5 text-sm font-bold text-slate-800 transition hover:bg-slate-200"
              >
                Tetap Gunakan Versi Gratis
              </button>
            </div>

            {/* PREMIUM MAHASISWA */}
            <div className="relative flex flex-col justify-between space-y-7 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-7 text-white shadow-xl sm:p-8">
              <div className="absolute right-5 top-5 rounded-full bg-amber-400 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-950">
                Popular
              </div>

              <div>
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-200">
                  <Sparkles size={15} className="text-amber-300" />
                  Premium Student
                </span>

                <div className="mt-4">
                  <span className="text-4xl font-extrabold">
                    Rp 35.000
                  </span>
                  <span className="ml-1 text-xs text-blue-200">
                    / bulan
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-blue-100">
                  Manfaat eksklusif untuk meningkatkan visibilitas profil
                  dan membantu menemukan proyek yang sesuai.
                </p>

                <div className="mt-6 space-y-4 border-t border-white/20 pt-5 text-sm text-blue-50">
                  <Feature
                    text="Priority Candidate untuk tinjauan HR"
                    premium
                  />
                  <Feature text="Lencana Premium pada profil" premium />
                  <Feature
                    text="Lamaran proyek tanpa batas"
                    premium
                  />
                  <Feature
                    text="Rekomendasi proyek berdasarkan keterampilan"
                    premium
                  />
                  <Feature
                    text="Unduh sertifikat resolusi tinggi"
                    premium
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleSelectPlan(
                    'InternSpace Student Premium',
                    35000,
                    'student'
                  )
                }
                className="w-full rounded-xl bg-white px-4 py-3.5 text-sm font-extrabold text-blue-700 shadow-md transition hover:bg-blue-50"
              >
                Upgrade ke Student Premium
              </button>
            </div>
          </section>
        )}

        {/* PAKET PERUSAHAAN */}
        {activePlanTab === 'company' && (
          <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* FREE EMPLOYER */}
            <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Free Employer
                </span>

                <div className="mt-4 text-3xl font-extrabold text-slate-900">
                  Rp 0
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Publikasi satu proyek micro-internship standar.
                </p>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-700">
                  <Feature text="1 slot proyek per bulan" />
                  <Feature text="Review kandidat manual" />
                  <Feature text="Standard chat workspace" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentView('candidate_profile')}
                className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-200"
              >
                Gunakan Akun Standar
              </button>
            </div>

            {/* PREMIUM BUSINESS */}
            <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 text-white shadow-xl">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                    Premium Business
                  </span>
                  <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold">
                    Recommended
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-3xl font-extrabold">
                    Rp 400.000
                  </span>
                  <span className="ml-1 text-xs text-slate-400">
                    / bulan
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Dashboard analytics, verifikasi mitra, dan rekomendasi
                  talenta untuk mendukung proses rekrutmen.
                </p>

                <div className="mt-5 space-y-3 border-t border-slate-800 pt-4 text-sm text-slate-200">
                  <Feature text="Dashboard analytics kandidat" premium />
                  <Feature text="Badge perusahaan terverifikasi" premium />
                  <Feature text="Rekomendasi talenta mahasiswa" premium />
                  <Feature text="Customer support prioritas" premium />
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleSelectPlan(
                    'InternSpace Company Premium',
                    400000,
                    'company'
                  )
                }
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Langganan Rp 400.000 / Bulan
              </button>
            </div>

            {/* ADD-ON */}
            <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Add-on Layanan
                </span>

                <h3 className="mt-4 text-2xl font-extrabold text-slate-900">
                  Featured & Ads
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Promosikan proyek dan brand perusahaan kepada mahasiswa.
                </p>

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-800">
                        Featured Project
                      </span>
                      <span className="text-xs font-bold text-blue-600">
                        Rp 75.000
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Tampil di urutan teratas daftar pencarian proyek.
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-800">
                        Banner Iklan Web
                      </span>
                      <span className="text-xs font-bold text-blue-600">
                        Rp 250.000
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Slot banner iklan untuk promosi mitra.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleSelectPlan(
                    'Featured Project Add-on',
                    75000,
                    'company'
                  )
                }
                className="w-full rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
              >
                Beli Add-on Promosi
              </button>
            </div>
          </section>
        )}

        {/* CATATAN MODEL BISNIS */}
        <section className="mx-auto flex max-w-4xl items-start gap-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-5 sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
            <TrendingUp size={21} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-blue-900">
              Proyeksi Finansial
            </h3>
            <p className="mt-2 text-xs leading-6 text-slate-600">
              Target tahun pertama: 50 Mahasiswa Premium, 5 Perusahaan
              Premium, 2 Featured Project, dan 2 Banner Iklan. Berdasarkan
              proyeksi awal, total omzet bulanan adalah Rp 4.400.000
              dengan estimasi BEP sekitar 3 bulan terhadap RAB pengembangan
              Rp 13.194.995. Angka ini merupakan proyeksi, bukan jaminan
              pendapatan aktual.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

interface FeatureProps {
  text: string;
  included?: boolean;
  premium?: boolean;
}

const Feature: React.FC<FeatureProps> = ({
  text,
  included = true,
  premium = false,
}) => (
  <div className="flex items-start gap-2.5">
    {included ? (
      <CheckCircle2
        size={17}
        className={`mt-0.5 shrink-0 ${
          premium ? 'text-amber-300' : 'text-emerald-500'
        }`}
      />
    ) : (
      <span className="w-[17px] shrink-0 text-center text-slate-400">
        ×
      </span>
    )}
    <span>{text}</span>
  </div>
);

export default PremiumPricingPage;
