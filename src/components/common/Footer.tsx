import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                is.
              </div>
              <span className="font-bold text-base text-slate-900 tracking-tight">
                internspace
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Platform micro internship berbasis website yang menghubungkan mahasiswa dengan perusahaan dan UMKM untuk menyelesaikan proyek kerja taktis jangka pendek fleksibel, membangun portofolio tervalidasi, dan menerbitkan sertifikat digital otomatis.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              <p>Program Studi S1 Bisnis Digital</p>
              <p>Sekolah Bisnis dan Manajemen</p>
              <p>Universitas Logistik dan Bisnis Internasional (ULBI) Bandung, 2026</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Untuk Mahasiswa
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => setCurrentView('projects_list')} className="hover:text-blue-600 transition-colors">
                  Cari Proyek Singkat
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('student_dashboard')} className="hover:text-blue-600 transition-colors">
                  Dashboard & Portofolio
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('certificate')} className="hover:text-blue-600 transition-colors">
                  Sertifikat Digital
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('premium')} className="hover:text-blue-600 transition-colors">
                  Premium Student
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Untuk Perusahaan
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => setCurrentView('login_company')} className="hover:text-blue-600 transition-colors">
                  Publikasi Micro Internship
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('candidate_profile')} className="hover:text-blue-600 transition-colors">
                  Workspace & Evaluasi
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('partner_companies')} className="hover:text-blue-600 transition-colors">
                  Direktori Mitra Industri
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('premium')} className="hover:text-blue-600 transition-colors">
                  Featured Project & Iklan
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Sistem & Admin
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => setCurrentView('admin_dashboard')} className="hover:text-blue-600 transition-colors">
                  Admin Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin_control')} className="hover:text-blue-600 transition-colors">
                  Validasi Proyek
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('students_directory')} className="hover:text-blue-600 transition-colors">
                  Database Mahasiswa
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('system_alert')} className="hover:text-blue-600 transition-colors">
                  System Alerts
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <p>© 2026 InternSpace. All rights reserved. Proyek Integrasi 2 S1 Bisnis Digital ULBI.</p>
          <div className="flex items-center gap-4">
            <span>Penulis: Anisa Aulia Rita Putri (183240002) & Fatih Alfaluza (183240019)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
