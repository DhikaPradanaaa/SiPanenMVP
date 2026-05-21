import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  FileSignature,
  Shield,
  Lock,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Eye,
  ChevronRight,
  Fingerprint,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Users,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";

// ── MOCK DATA ──

const kontrakList = [
  {
    id: "SC-2026-0412",
    petani: "Pak Suharto",
    pembeli: "PT Agro Nusantara",
    komoditas: "Padi IR-64",
    volume: "8.5 Ton",
    harga: "Rp 6.200/kg",
    nilaiTotal: "Rp 52.7Jt",
    biayaLayanan: "Rp 25.000",
    tanggalBuat: "20 Mar 2026",
    tanggalPanen: "28 Mar 2026",
    status: "Aktif" as const,
    enkripsi: "AES-256",
    hash: "0x7a3b...f92d",
    verifikasi: ["Identitas petani ✓", "Identitas pembeli ✓", "Validasi komoditas ✓", "Harga pasar terverifikasi ✓"],
    progress: 75,
    milestones: [
      { label: "Kontrak Dibuat", done: true, date: "20 Mar" },
      { label: "Kedua Pihak Setuju", done: true, date: "21 Mar" },
      { label: "Panen & Pengiriman", done: false, date: "28 Mar" },
      { label: "Pembayaran Selesai", done: false, date: "~30 Mar" },
    ],
  },
  {
    id: "SC-2026-0398",
    petani: "Bu Siti Aminah",
    pembeli: "CV Makmur Jaya",
    komoditas: "Padi Ciherang",
    volume: "12 Ton",
    harga: "Rp 6.050/kg",
    nilaiTotal: "Rp 72.6Jt",
    biayaLayanan: "Rp 25.000",
    tanggalBuat: "15 Mar 2026",
    tanggalPanen: "22 Mar 2026",
    status: "Selesai" as const,
    enkripsi: "AES-256",
    hash: "0x4c1e...a84b",
    verifikasi: ["Identitas petani ✓", "Identitas pembeli ✓", "Validasi komoditas ✓", "Pembayaran terverifikasi ✓"],
    progress: 100,
    milestones: [
      { label: "Kontrak Dibuat", done: true, date: "15 Mar" },
      { label: "Kedua Pihak Setuju", done: true, date: "16 Mar" },
      { label: "Panen & Pengiriman", done: true, date: "22 Mar" },
      { label: "Pembayaran Selesai", done: true, date: "24 Mar" },
    ],
  },
  {
    id: "SC-2026-0356",
    petani: "Pak Joko",
    pembeli: "PT FoodTech Indo",
    komoditas: "Jagung BISI-18",
    volume: "5 Ton",
    harga: "Rp 4.800/kg",
    nilaiTotal: "Rp 24.0Jt",
    biayaLayanan: "Rp 25.000",
    tanggalBuat: "10 Mar 2026",
    tanggalPanen: "15 Apr 2026",
    status: "Dibatalkan" as const,
    enkripsi: "AES-256",
    hash: "0x9f2a...c31e",
    verifikasi: ["Identitas petani ✓", "Identitas pembeli ✓", "Validasi gagal — volume tidak sesuai"],
    progress: 25,
    milestones: [
      { label: "Kontrak Dibuat", done: true, date: "10 Mar" },
      { label: "Dibatalkan Pembeli", done: true, date: "12 Mar" },
    ],
  },
];

const securityFeatures = [
  { icon: Lock, title: "Enkripsi AES-256", desc: "Data kontrak dienkripsi end-to-end" },
  { icon: Fingerprint, title: "Validasi Digital", desc: "Identitas terverifikasi multi-layer" },
  { icon: ShieldCheck, title: "Hash Integrity", desc: "Setiap kontrak memiliki hash unik" },
  { icon: FileCheck, title: "Audit Trail", desc: "Riwayat perubahan tercatat permanen" },
];

const statusConfig: Record<string, { bg: string; text: string; border: string; icon: typeof CheckCircle2 }> = {
  Aktif: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", icon: Clock },
  Selesai: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30", icon: CheckCircle2 },
  Dibatalkan: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", icon: XCircle },
};

export function SmartContract() {
  const navigate = useNavigate();
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const selected = kontrakList.find((k) => k.id === selectedContract);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F5FCEF]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-emerald-200">
        <button onClick={() => navigate("/premium", { replace: true })} className="p-1.5 hover:bg-emerald-50 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-zinc-800" />
        </button>
        <div className="flex-1">
          <h1 className="text-zinc-800 font-bold text-sm">Smart Contract</h1>
          <p className="text-violet-600 text-[10px] font-medium">Kontrak Digital Aman & Terverifikasi</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#F5FCEF]">
        {/* Security Features */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-violet-600" />
            <span className="text-zinc-900 font-bold text-sm">Keamanan Kontrak</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {securityFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i }}
                  className="bg-white border border-emerald-200 rounded-xl p-3"
                >
                  <Icon className="w-4 h-4 text-violet-600 mb-1.5" />
                  <div className="text-zinc-900 text-[11px] font-bold">{f.title}</div>
                  <div className="text-zinc-400 text-[9px]">{f.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Biaya Info */}
        <div className="px-5 pb-4">
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-violet-700 font-bold text-xs mb-1">Biaya Layanan Kontrak</h4>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Biaya pembuatan kontrak digital <strong className="text-violet-700">Rp 25.000/kontrak</strong>. Termasuk enkripsi data, validasi digital kedua pihak, dan penyimpanan permanen.
              </p>
            </div>
          </div>
        </div>

        {/* Create Form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-5 pb-4 overflow-hidden"
            >
              <div className="bg-white border border-violet-300 rounded-2xl p-5">
                <h3 className="text-zinc-900 font-bold text-sm mb-4 flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-violet-400" />
                  Buat Kontrak Baru
                </h3>
                <div className="space-y-3">
                  <input placeholder="Nama Petani" className="w-full h-11 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-violet-500" />
                  <input placeholder="Nama Pembeli / Perusahaan" className="w-full h-11 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-violet-500" />
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Komoditas" className="h-11 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-violet-500" />
                    <input placeholder="Volume (Ton)" className="h-11 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-violet-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Harga/kg" className="h-11 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-xs placeholder:text-zinc-400 focus:outline-none focus:border-violet-500" />
                    <input type="date" className="h-11 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-xs focus:outline-none focus:border-violet-500" />
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3 flex items-center justify-between">
                    <span className="text-zinc-500 text-[11px]">Biaya Layanan</span>
                    <span className="text-violet-600 font-bold text-xs">Rp 25.000</span>
                  </div>
                  <button className="w-full h-11 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Buat Kontrak Digital
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contract List */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span className="text-zinc-900 font-bold text-sm">Daftar Kontrak</span>
            <span className="text-zinc-500 text-[10px]">({kontrakList.length})</span>
          </div>

          <div className="space-y-3">
            {kontrakList.map((k, i) => {
              const sc = statusConfig[k.status];
              const StatusIcon = sc.icon;
              const isExpanded = selectedContract === k.id;

              return (
                <motion.div
                  key={k.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                    isExpanded ? "border-violet-300" : "border-emerald-200"
                  }`}
                >
                  {/* Contract Header */}
                  <button
                    onClick={() => setSelectedContract(isExpanded ? null : k.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-500 text-[9px] font-mono">{k.id}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold flex items-center gap-1 ${sc.bg} ${sc.text} ${sc.border}`}>
                        <StatusIcon className="w-2.5 h-2.5" />
                        {k.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-zinc-900 text-xs font-bold">{k.petani}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-violet-400" />
                      <span className="text-zinc-900 text-xs font-bold">{k.pembeli}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-[10px]">{k.komoditas} • {k.volume}</span>
                      <span className="text-emerald-600 font-bold text-xs">{k.nilaiTotal}</span>
                    </div>

                    {/* Progress */}
                    <div className="mt-3 w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${k.progress}%` }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className={`h-full rounded-full ${
                          k.status === "Dibatalkan" ? "bg-red-500" : k.status === "Selesai" ? "bg-blue-500" : "bg-emerald-500"
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-emerald-100 space-y-3">
                          {/* Details */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-emerald-50 rounded-xl p-3">
                              <div className="text-zinc-500 text-[9px]">Harga Satuan</div>
                              <div className="text-zinc-900 text-xs font-bold">{k.harga}</div>
                            </div>
                            <div className="bg-emerald-50 rounded-xl p-3">
                              <div className="text-zinc-500 text-[9px]">Biaya Kontrak</div>
                              <div className="text-violet-600 text-xs font-bold">{k.biayaLayanan}</div>
                            </div>
                          </div>

                          {/* Milestones */}
                          <div>
                            <div className="text-zinc-500 text-[10px] mb-2 font-medium">Milestone Kontrak</div>
                            <div className="space-y-2">
                              {k.milestones.map((m, j) => (
                                <div key={j} className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    m.done
                                      ? k.status === "Dibatalkan" && j === k.milestones.length - 1
                                        ? "bg-red-100"
                                        : "bg-emerald-100"
                                      : "bg-zinc-100"
                                  }`}>
                                    {m.done ? (
                                      k.status === "Dibatalkan" && j === k.milestones.length - 1
                                        ? <XCircle className="w-3 h-3 text-red-400" />
                                        : <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Clock className="w-3 h-3 text-zinc-600" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <span className={`text-[11px] ${m.done ? "text-zinc-700" : "text-zinc-400"}`}>{m.label}</span>
                                  </div>
                                  <span className="text-zinc-400 text-[9px]">{m.date}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Security Indicators */}
                          <div className="bg-emerald-50/50 rounded-xl p-3">
                            <div className="flex items-center gap-1.5 mb-2">
                              <Lock className="w-3 h-3 text-violet-400" />
                              <span className="text-violet-700 text-[10px] font-bold">Keamanan</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-zinc-500">Enkripsi</span>
                                <span className="text-emerald-600 font-mono">{k.enkripsi}</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-zinc-500">Hash Kontrak</span>
                                <span className="text-zinc-500 font-mono">{k.hash}</span>
                              </div>
                            </div>
                            <div className="mt-2 space-y-1">
                              {k.verifikasi.map((v, j) => (
                                <div key={j} className="flex items-center gap-1.5">
                                  <ShieldCheck className={`w-3 h-3 ${v.includes("gagal") ? "text-red-400" : "text-emerald-400"}`} />
                                  <span className={`text-[9px] ${v.includes("gagal") ? "text-red-400" : "text-zinc-400"}`}>{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Tombol Pembayaran */}
                          {k.status === "Aktif" && (
                            <div className="pt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/pembayaran/${k.id}`);
                                }}
                                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                              >
                                <DollarSign className="w-4 h-4" />
                                Bayar Kontrak Ini
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="px-5 pb-8">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total Kontrak", value: "47", color: "text-zinc-900" },
              { label: "Aktif", value: "12", color: "text-emerald-600" },
              { label: "Selesai", value: "32", color: "text-blue-600" },
            ].map((s, i) => (
              <div key={i} className="bg-white border border-emerald-200 rounded-xl p-3 text-center">
                <div className={`font-bold text-lg ${s.color}`}>{s.value}</div>
                <div className="text-zinc-500 text-[9px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}