import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Crown,
  BarChart3,
  Percent,
  FileSignature,
  FileBarChart,
  Code2,
  ChevronRight,
  Sparkles,
  Shield,
  Star,
  Zap,
  Lock,
} from "lucide-react";

const premiumFeatures = [
  {
    id: "subscription",
    path: "/premium/subscription",
    icon: BarChart3,
    title: "Subscription Intelligence",
    desc: "Peta sebaran produksi real-time, analisis tren panen, dan peringatan anomali cuaca.",
    badge: "Populer",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    price: "Mulai Rp 299K/bln",
    users: "Distributor • Pemerintah",
  },
  {
    id: "komisi",
    path: "/premium/komisi",
    icon: Percent,
    title: "Komisi Marketplace",
    desc: "Ringkasan transaksi marketplace, total nilai dan komisi platform secara transparan.",
    badge: "Otomatis",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    price: "2.5% per transaksi",
    users: "Semua Pengguna",
  },
  {
    id: "kontrak",
    path: "/premium/kontrak",
    icon: FileSignature,
    title: "Smart Contract",
    desc: "Kontrak digital aman antara petani dan pembeli dengan enkripsi dan validasi digital.",
    badge: "Aman",
    badgeColor: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    price: "Rp 25K/kontrak",
    users: "Petani • Distributor • Perusahaan",
  },
  {
    id: "analitik",
    path: "/premium/analitik",
    icon: FileBarChart,
    title: "Analytic Report Premium",
    desc: "Laporan proyeksi produksi jangka panjang, tren komoditas, dan analisis wilayah.",
    badge: "Premium",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    price: "Mulai Rp 150K/laporan",
    users: "Perusahaan • Pemerintah",
  },
  {
    id: "api",
    path: "/premium/api",
    icon: Code2,
    title: "API Integration",
    desc: "Akses data prediksi panen via API untuk mitra logistik, perbankan, dan asuransi.",
    badge: "Enterprise",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    price: "Mulai Rp 2.5Jt/bln",
    users: "Mitra Bisnis • Enterprise",
  },
];

const highlights = [
  { icon: Shield, label: "Enkripsi End-to-End", color: "text-emerald-400" },
  { icon: Zap, label: "Real-time Data", color: "text-amber-400" },
  { icon: Star, label: "99.9% Uptime SLA", color: "text-blue-400" },
];

export function PremiumHub() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F5FCEF]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-emerald-200">
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-emerald-50 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-zinc-800" />
        </button>
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <Crown className="w-4.5 h-4.5 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-zinc-800 font-bold text-sm leading-tight">Layanan Premium</h1>
            <p className="text-amber-600 text-[10px] font-medium">SiPanen Business Suite</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full">
          <Lock className="w-3 h-3 text-amber-400" />
          <span className="text-[9px] text-amber-400 font-bold">PRO</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#F5FCEF]">
        {/* Hero Banner */}
        <div className="px-5 pt-5 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-white border border-emerald-200 rounded-2xl p-5"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(245,158,11,0.06),transparent_60%)]" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-600 text-xs font-bold">MONETISASI & PREMIUM</span>
              </div>
              <h2 className="text-zinc-900 font-bold text-lg mb-2">Tingkatkan Bisnis Pertanian Anda</h2>
              <p className="text-zinc-500 text-xs leading-relaxed mb-4">
                Akses data lanjutan, integrasi sistem, dan layanan premium untuk distributor, perusahaan pangan, pemerintah, dan mitra bisnis.
              </p>
              {/* Highlights */}
              <div className="flex gap-2">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full">
                    <h.icon className={`w-3 h-3 ${h.color}`} />
                    <span className="text-[9px] text-zinc-600 font-medium">{h.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="px-5 space-y-3 pb-8">
          {premiumFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.button
                key={f.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.35 }}
                onClick={() => navigate(f.path)}
                className="w-full text-left relative overflow-hidden bg-white border border-emerald-200 rounded-2xl p-5 hover:border-emerald-300 transition-all duration-200 active:scale-[0.98] group"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(16,185,129,0.03),transparent_50%)]" />
                <div className="relative">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-zinc-900 font-bold text-sm">{f.title}</h3>
                        <span className="text-zinc-400 text-[10px]">{f.users}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${f.badgeColor}`}>
                      {f.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-zinc-500 text-xs leading-relaxed mb-3">{f.desc}</p>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600 text-xs font-bold">{f.price}</span>
                    <div className="flex items-center gap-1 text-zinc-400 group-hover:text-emerald-600 transition-colors">
                      <span className="text-[10px] font-medium">Lihat Detail</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}