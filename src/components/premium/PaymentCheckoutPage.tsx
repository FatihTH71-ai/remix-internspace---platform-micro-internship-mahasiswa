import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Building,
  Smartphone,
  Upload,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  FileText,
  Copy,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentCheckoutPageProps {
  isSuccessView?: boolean;
}

export const PaymentCheckoutPage: React.FC<PaymentCheckoutPageProps> = ({ isSuccessView = false }) => {
  const {
    currentUser,
    pendingPaymentPlan,
    completePayment,
    setCurrentView
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'va' | 'ewallet'>('va');
  const [selectedBank, setSelectedBank] = useState('BCA');
  const [uploadedReceipt, setUploadedReceipt] = useState<string | null>('bukti_transfer_bca_35rb.jpg');
  const [isCopied, setIsCopied] = useState(false);

  const plan = pendingPaymentPlan || {
    name: 'InternSpace Student Premium',
    price: 35000,
    type: 'student' as const
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(plan.price);

  const handleCopyVa = () => {
    navigator.clipboard.writeText('88019183240019');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {
      // ignore
    }
    completePayment();
  };

  // SUCCESS VIEW: Gambar 4.20
  if (isSuccessView) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border-4 border-blue-100 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              Gambar 4.20 · Status Pembayaran
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Payment Successful</h2>
            <p className="text-xs text-slate-500">
              Transaksi Anda telah berhasil diverifikasi oleh Admin InternSpace.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-400">Transaction ID</span>
              <span className="font-mono font-bold text-slate-800">INV-IS-2026-9921</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-400">Paket Layanan</span>
              <span className="font-semibold text-slate-800">{plan.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-400">Total Dibayar</span>
              <span className="font-bold text-blue-600">{formattedPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status Akun</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Premium Active</span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setCurrentView('projects_list')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Explore Premium Projects
            </button>
            <button
              onClick={() => setCurrentView('student_dashboard')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Kuitansi pembayaran digital telah dikirimkan ke email terdaftar Anda.
          </p>
        </div>
      </div>
    );
  }

  // CHECKOUT VIEW: Gambar 4.19
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <button
          onClick={() => setCurrentView('premium')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Pilihan Paket</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              Gambar 4.19 · Checkout Layanan
            </span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Secure Checkout</h1>
            <p className="text-xs text-slate-500">
              Pembayaran manual melalui Virtual Account atau E-Wallet dengan verifikasi admin.
            </p>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>256-bit Enkripsi Aman</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Payment Form & Methods (Gambar 4.19) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Payment Method Selector */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pilih Metode Pembayaran
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('va')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    paymentMethod === 'va'
                      ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Building className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Virtual Account</h4>
                    <p className="text-[10px] text-slate-500">BCA, Mandiri, BNI, BRI</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ewallet')}
                  className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    paymentMethod === 'ewallet'
                      ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">E-Wallet & QRIS</h4>
                    <p className="text-[10px] text-slate-500">GoPay, OVO, ShopeePay</p>
                  </div>
                </button>
              </div>

              {/* Payment Details Accordion */}
              {paymentMethod === 'va' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex gap-2">
                    {['BCA', 'Mandiri', 'BNI', 'BRI'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          selectedBank === bank
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Nomor Virtual Account ({selectedBank})
                      </span>
                      <span className="font-mono text-sm font-bold text-slate-900 tracking-wider">
                        88019183240019
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyVa}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Atas nama: <strong>PT INTERNSPACE DIGITAL ULBI</strong>
                  </p>
                </div>
              )}

              {paymentMethod === 'ewallet' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
                  <span className="text-xs font-bold text-slate-800">Scan QRIS Nasional</span>
                  <div className="w-36 h-36 bg-white border border-slate-300 rounded-xl mx-auto flex items-center justify-center p-2 shadow-2xs">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=INTERNSPACE-PREMIUM-PAYMENT-2026"
                      alt="QRIS Payment"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Bisa di-scan menggunakan GoPay, OVO, Dana, LinkAja, atau Mobile Banking.</p>
                </div>
              )}

            </div>

            {/* Upload Bukti Pembayaran matching Bab 1.4 item 7 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Unggah Bukti Transfer / Pembayaran
              </h3>
              
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {uploadedReceipt || 'Upload struk bukti transfer'}
                    </p>
                    <p className="text-[10px] text-slate-400">JPG, PNG atau PDF maks 5MB</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setUploadedReceipt('bukti_transfer_bank_sukses.png')}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold whitespace-nowrap"
                >
                  Pilih Berkas
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Admin akan memverifikasi bukti pembayaran manual ini dalam waktu 5-15 menit.</span>
              </div>
            </div>

          </div>

          {/* Right: Order Summary Sidebar matching Gambar 4.19 */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">{plan.name}</span>
                  <span className="font-semibold text-slate-900">{formattedPrice}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Biaya Administrasi</span>
                  <span className="font-semibold text-slate-900">Rp 0 (Gratis)</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Pajak (PPN 11%)</span>
                  <span className="text-slate-400">Termasuk</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-900">Total Tagihan</span>
                <span className="text-xl font-extrabold text-blue-600">{formattedPrice}</span>
              </div>

              <button
                type="button"
                onClick={handleConfirmPayment}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Konfirmasi Pembayaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-slate-400 text-center leading-relaxed">
                Dengan melanjutkan, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi InternSpace.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
