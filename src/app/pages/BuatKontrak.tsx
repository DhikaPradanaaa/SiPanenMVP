import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { MobileLayout } from "../components/MobileLayout";
import { ArrowLeft, FileSignature, ShieldCheck, DollarSign, Calendar, ChevronRight, Upload } from "lucide-react";

export function BuatKontrak() {
  const navigate = useNavigate();
  const location = useLocation();
  const petaniData = location.state?.petani;

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/premium/kontrak");
    }, 1500);
  };

  return (
    <MobileLayout title="Buat Kontrak" showBottomNav={false}>
      <div className="flex flex-col min-h-screen bg-[#F5FCEF] pb-20">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-emerald-200 sticky top-0 z-10">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-emerald-50 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-800" />
          </button>
          <div className="flex-1">
            <h1 className="text-zinc-800 font-bold text-base">Buat Kontrak</h1>
            <p className="text-emerald-600 text-[10px] font-medium">Smart Contract & Pengadaan</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 pt-6 pb-8">
          <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-5 border-b border-emerald-50 pb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <FileSignature className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-zinc-900 font-bold text-sm">Detail Perjanjian</h2>
                <p className="text-zinc-500 text-[11px]">Silakan lengkapi form kontrak di bawah</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Petani */}
              <div>
                <label className="block text-zinc-700 text-xs font-bold mb-1.5">Nama Petani</label>
                <input
                  type="text"
                  required
                  defaultValue={petaniData?.nama || ""}
                  className="w-full h-11 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="Masukkan nama petani"
                />
              </div>

              {/* Komoditas */}
              <div>
                <label className="block text-zinc-700 text-xs font-bold mb-1.5">Komoditas</label>
                <input
                  type="text"
                  required
                  defaultValue={petaniData?.komoditas || ""}
                  className="w-full h-11 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  placeholder="Contoh: Padi IR-64"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Volume */}
                <div>
                  <label className="block text-zinc-700 text-xs font-bold mb-1.5">Volume (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    defaultValue={petaniData?.volume?.replace(/[^0-9.]/g, "") || ""}
                    className="w-full h-11 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="Contoh: 10"
                  />
                </div>
                {/* Harga */}
                <div>
                  <label className="block text-zinc-700 text-xs font-bold mb-1.5">Harga/kg (Rp)</label>
                  <input
                    type="number"
                    required
                    defaultValue={petaniData?.harga?.replace(/[^0-9]/g, "") || ""}
                    className="w-full h-11 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="Contoh: 6500"
                  />
                </div>
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 text-xs font-bold mb-1.5">Mulai Berlaku</label>
                  <input
                    type="date"
                    required
                    className="w-full h-11 px-3 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-zinc-700 text-xs font-bold mb-1.5">Berakhir Pada</label>
                  <input
                    type="date"
                    required
                    className="w-full h-11 px-3 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Ketentuan */}
              <div>
                <label className="block text-zinc-700 text-xs font-bold mb-1.5">Ketentuan Tambahan</label>
                <textarea
                  rows={3}
                  className="w-full p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                  placeholder="Opsional: masukkan ketentuan atau catatan khusus"
                />
              </div>

              {/* Upload Dokumen */}
              <div>
                <label className="block text-zinc-700 text-xs font-bold mb-1.5">Dokumen Pendukung (Opsional)</label>
                <div className="w-full h-24 border-2 border-dashed border-emerald-200 bg-emerald-50/50 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-emerald-50 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] text-zinc-500">Upload PDF atau Foto</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      Terbitkan Kontrak
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
