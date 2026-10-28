import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, AlertTriangle, Info, ArrowLeft, Trash2, X } from 'lucide-react';

export const SystemAlertModal: React.FC = () => {
  const { alerts, clearAlerts, setCurrentView, userRole } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header matching Gambar 4.29 */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                Gambar 4.29
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">System Alerts</h2>
            </div>
          </div>

          <button
            onClick={() => setCurrentView(userRole === 'admin' ? 'admin_dashboard' : 'student_dashboard')}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts List matching Gambar 4.29 exactly */}
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 text-xs">
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    alert.type === 'warning'
                      ? 'bg-rose-500'
                      : alert.type === 'success'
                      ? 'bg-emerald-500'
                      : 'bg-blue-600'
                  }`}
                />
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">{alert.title}</h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{alert.timeAgo}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{alert.detail}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <span>Semua notifikasi sistem telah dibersihkan.</span>
            </div>
          )}
        </div>

        {/* Clear All Alerts Button matching Gambar 4.29 */}
        <div className="pt-2">
          <button
            onClick={clearAlerts}
            disabled={alerts.length === 0}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Alerts</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            onClick={() => setCurrentView(userRole === 'admin' ? 'admin_dashboard' : 'student_dashboard')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Kembali ke Halaman Sebelumnya
          </button>
        </div>

      </div>
    </div>
  );
};
