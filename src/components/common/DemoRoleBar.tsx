
import React, { useState } from 'react';
import { Eye, ChevronDown, X } from 'lucide-react';

export const DemoRoleBar: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [mockup, setMockup] = useState('Gbr 4.25');

  if (!visible) return null;

  return (
    <div className="relative z-50 flex h-12 items-center justify-between gap-3 bg-slate-900 px-4 text-xs text-white sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-600 font-bold">
          IS
        </div>
        <span className="truncate font-semibold">
          Proyek Integrasi 2: InternSpace
        </span>
        <span className="hidden text-slate-400 md:inline">
          · S1 Bisnis Digital ULBI Bandung
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="relative flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2">
          <Eye className="h-4 w-4 text-blue-400" />

          <span className="hidden text-blue-400 sm:inline">
            Mockup Aktif:
          </span>

          <select
            value={mockup}
            onChange={(event) => setMockup(event.target.value)}
            className="max-w-28 cursor-pointer bg-transparent font-semibold text-blue-300 outline-none"
            aria-label="Pilih mockup"
          >
            <option className="bg-slate-900" value="Gbr 4.25">
              Gbr 4.25
            </option>
            <option className="bg-slate-900" value="Gbr 4.24">
              Gbr 4.24
            </option>
            <option className="bg-slate-900" value="Gbr 4.26">
              Gbr 4.26
            </option>
            <option className="bg-slate-900" value="Gbr 4.28">
              Gbr 4.28
            </option>
          </select>

          <ChevronDown className="h-3.5 w-3.5 text-blue-300" />
        </div>

        <button
          type="button"
          onClick={() => setVisible(false)}
          title="Tutup toolbar"
          aria-label="Tutup toolbar"
          className="rounded-md p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
