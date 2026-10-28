import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Search,
  Plus,
  ShieldCheck,
  Star,
  FolderGit2,
  Users,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const PartnerCompanies: React.FC = () => {
  const { companies, setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const industries = ['All', 'Software & Technology', 'Financial Technology', 'CleanTech & ESG', 'Industrial & Manufacturing'];

  const filtered = companies.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchInd = selectedIndustry === 'All' || c.industry === selectedIndustry;
    return matchSearch && matchInd;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header matching Gambar 4.28 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Gambar 4.28 · Mitra Perusahaan & UMKM
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Partner Companies</h1>
            <p className="text-xs text-slate-500">
              Manage and monitor participating organizations & companies providing micro-internships.
            </p>
          </div>

          <button
            onClick={() => alert('Form pendaftaran kemitraan industri dibuka.')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Invite Company</span>
          </button>
        </div>

        {/* 4 Stat KPI Cards matching Gambar 4.28 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Partner Companies
            </span>
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">142</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Active Projects
            </span>
            <span className="text-3xl font-extrabold text-blue-600 tabular-nums">328</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Pending Validation
            </span>
            <span className="text-3xl font-extrabold text-amber-600 tabular-nums">12</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Mitra Satisfaction
            </span>
            <div className="flex items-center gap-1 text-emerald-600">
              <span className="text-3xl font-extrabold tabular-nums">High</span>
              <span className="text-xs font-semibold">(4.9/5)</span>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 text-xs">
            {industries.map(ind => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  selectedIndustry === ind
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Companies Cards Grid matching Gambar 4.28 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(comp => (
            <div
              key={comp.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <img
                    src={comp.logo}
                    alt={comp.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                  {comp.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{comp.name}</h3>
                  <p className="text-xs text-slate-500">{comp.industry}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">PROYEK AKTIF</span>
                    <span className="font-bold text-slate-800">{comp.activeProjects} Proyek</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-semibold">TOTAL HIRED</span>
                    <span className="font-bold text-slate-800">{comp.totalHired} Mahasiswa</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{comp.rating}</span>
                </div>

                <button
                  onClick={() => alert(`Membuka profil kemitraan ${comp.name}`)}
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                >
                  <span>Kelola Proyek</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
