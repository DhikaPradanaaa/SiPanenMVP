import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  BarChart3,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CloudRain,
  CheckCircle2,
  Crown,
  Zap,
  Globe,
  Shield,
  Users,
  ChevronDown,
  ChevronUp,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  ThermometerSun,
  Droplets,
  Leaf,
  Star,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell,
} from "recharts";

// ── MOCK DATA ──

const produksiWilayah = [
  { wilayah: "Jawa Barat", produksi: 2850, target: 3000, persen: 95, komoditas: "Padi", trend: "+4.2%" },
  { wilayah: "Jawa Timur", produksi: 3200, target: 3500, persen: 91, komoditas: "Jagung", trend: "+2.8%" },
  { wilayah: "Jawa Tengah", produksi: 1800, target: 2000, persen: 90, komoditas: "Cabai", trend: "-1.5%" },
  { wilayah: "Sulawesi Selatan", produksi: 1200, target: 1500, persen: 80, komoditas: "Padi", trend: "+6.1%" },
  { wilayah: "Sumatera Utara", produksi: 950, target: 1200, persen: 79, komoditas: "Jagung", trend: "+3.3%" },
];

const trendPanen = [
  { bulan: "Jan", padi: 2400, jagung: 1800, cabai: 800 },
  { bulan: "Feb", padi: 2600, jagung: 1700, cabai: 900 },
  { bulan: "Mar", padi: 2850, jagung: 1900, cabai: 750 },
  { bulan: "Apr*", padi: 3100, jagung: 2100, cabai: 850 },
  { bulan: "Mei*", padi: 2900, jagung: 2200, cabai: 1100 },
  { bulan: "Jun*", padi: 2700, jagung: 2000, cabai: 1300 },
];

const anomaliCuaca = [
  { wilayah: "Karawang", tipe: "Curah Hujan Ekstrem", dampak: "Potensi banjir lahan padi 320 Ha", level: "Tinggi", waktu: "2 hari lagi" },
  { wilayah: "Garut", tipe: "Kekeringan Berkepanjangan", dampak: "Risiko gagal panen cabai 45 Ha", level: "Sedang", waktu: "Minggu ini" },
  { wilayah: "Kediri", tipe: "Suhu Ekstrem", dampak: "Perlambatan pertumbuhan jagung", level: "Rendah", waktu: "3-5 hari" },
];

const distribusiKomoditas = [
  { name: "Padi", value: 45, color: "#10b981" },
  { name: "Jagung", value: 25, color: "#3b82f6" },
  { name: "Cabai", value: 15, color: "#ef4444" },
  { name: "Kedelai", value: 10, color: "#f59e0b" },
  { name: "Lainnya", value: 5, color: "#6b7280" },
];

const plans = [
  {
    id: "instansi",
    name: "Subscription Intelligence",
    price: "Rp 3.000.000",
    period: "/Instansi",
    desc: "Akses penuh data intelijen untuk instansi",
    features: [
      "Peta sebaran seluruh Indonesia",
      "Tren panen real-time",
      "Alert anomali cuaca prioritas",
      "Laporan analitik mingguan",
      "Prediksi harga komoditas",
      "Dashboard custom",
      "Priority support 24/7",
    ],
    notIncluded: ["API access"],
    popular: true,
    color: "from-emerald-600 to-emerald-500",
  }
];

const levelColor: Record<string, string> = {
  Tinggi: "bg-red-500/15 text-red-400 border-red-500/30",
  Sedang: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Rendah: "bg-blue-500/15 text-blue-400 border-blue-500/30",
};

export function SubscriptionDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"dashboard" | "plans">("dashboard");
  const [expandedMap, setExpandedMap] = useState(true);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F5FCEF]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-emerald-200">
        <button onClick={() => navigate("/premium")} className="p-1.5 hover:bg-emerald-50 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-zinc-800" />
        </button>
        <div className="flex-1">
          <h1 className="text-zinc-800 font-bold text-sm">Subscription Intelligence</h1>
          <p className="text-emerald-600 text-[10px] font-medium">Dashboard & Paket Berlangganan</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full">
          <Crown className="w-3 h-3 text-emerald-400" />
          <span className="text-[9px] text-emerald-400 font-bold">PRO</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex bg-white border border-emerald-200 rounded-xl p-1">
          {(["dashboard", "plans"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === t
                  ? "bg-emerald-500 text-white"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {t === "dashboard" ? "Dashboard" : "Paket Harga"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#F5FCEF]">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" ? (
            <motion.div
              key="dash"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              {/* ── PETA SEBARAN PRODUKSI ── */}
              <div className="px-5 pt-3 pb-4">
                <button onClick={() => setExpandedMap(!expandedMap)} className="w-full flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-zinc-900 font-bold text-sm">Peta Sebaran Produksi</span>
                  </div>
                  {expandedMap ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </button>

                {expandedMap && (
                  <div className="bg-white border border-emerald-200 rounded-2xl p-5">
                    {/* Mini Map Visualization */}
                    <div className="relative bg-emerald-50 rounded-xl p-4 mb-4 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(16,185,129,0.15),transparent_50%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_40%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(239,68,68,0.08),transparent_35%)]" />
                      {/* Simulated map dots */}
                      <div className="relative h-32 flex items-center justify-center">
                        {[
                          { top: "15%", left: "25%", size: "w-4 h-4", color: "bg-emerald-500", pulse: true },
                          { top: "30%", left: "55%", size: "w-3.5 h-3.5", color: "bg-emerald-400", pulse: true },
                          { top: "45%", left: "35%", size: "w-3 h-3", color: "bg-blue-500", pulse: false },
                          { top: "60%", left: "65%", size: "w-2.5 h-2.5", color: "bg-amber-500", pulse: false },
                          { top: "25%", left: "75%", size: "w-2.5 h-2.5", color: "bg-emerald-400", pulse: false },
                          { top: "70%", left: "20%", size: "w-2 h-2", color: "bg-red-400", pulse: false },
                        ].map((dot, i) => (
                          <div key={i} className="absolute" style={{ top: dot.top, left: dot.left }}>
                            <div className={`${dot.size} ${dot.color} rounded-full ${dot.pulse ? "animate-pulse" : ""} shadow-lg`} />
                            {dot.pulse && <div className={`absolute inset-0 ${dot.color}/30 rounded-full animate-ping`} />}
                          </div>
                        ))}
                        <div className="text-center z-10">
                          <Globe className="w-6 h-6 text-zinc-400 mx-auto mb-1" />
                          <span className="text-zinc-400 text-[9px]">Indonesia • 34 Provinsi</span>
                        </div>
                      </div>
                    </div>

                    {/* Distribusi Komoditas */}
                    <div className="mb-4">
                      <div className="text-zinc-500 text-[10px] mb-2">Distribusi Komoditas Nasional</div>
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-20">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={distribusiKomoditas} dataKey="value" cx="50%" cy="50%" innerRadius={22} outerRadius={36} strokeWidth={0}>
                                {distribusiKomoditas.map((entry, index) => (
                                  <Cell key={index} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-1.5">
                          {distribusiKomoditas.map((d, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                              <span className="text-zinc-600 text-[10px]">{d.name} {d.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Wilayah List */}
                    <div className="space-y-2">
                      {produksiWilayah.map((w, i) => (
                        <div key={i} className="bg-emerald-50/80 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              <span className="text-zinc-900 text-xs font-bold">{w.wilayah}</span>
                            </div>
                            <div className={`flex items-center gap-0.5 text-[10px] font-bold ${w.trend.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}>
                              {w.trend.startsWith("+") ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              {w.trend}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1.5">
                            <span>{w.komoditas} • {w.produksi.toLocaleString()} Ton</span>
                            <span>{w.persen}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${w.persen}%` }}
                              transition={{ delay: 0.1 * i, duration: 0.6 }}
                              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── TREN PANEN ── */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-zinc-900 font-bold text-sm">Analisis Tren Panen</span>
                </div>
                <div className="bg-white border border-emerald-200 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    {[
                      { label: "Padi", color: "#10b981" },
                      { label: "Jagung", color: "#3b82f6" },
                      { label: "Cabai", color: "#ef4444" },
                    ].map((l, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                        <span className="text-zinc-500 text-[10px]">{l.label}</span>
                      </div>
                    ))}
                    <span className="text-zinc-400 text-[9px] ml-auto">*prediksi</span>
                  </div>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendPanen}>
                        <defs>
                          <linearGradient id="gPadi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gJagung" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gCabai" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="bulan" tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #d1fae5", borderRadius: 12, fontSize: 11, color: "#18181b" }} />
                        <Area type="monotone" dataKey="padi" stroke="#10b981" fill="url(#gPadi)" strokeWidth={2} />
                        <Area type="monotone" dataKey="jagung" stroke="#3b82f6" fill="url(#gJagung)" strokeWidth={2} />
                        <Area type="monotone" dataKey="cabai" stroke="#ef4444" fill="url(#gCabai)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* ── ANOMALI CUACA ── */}
              <div className="px-5 pb-8">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-zinc-900 font-bold text-sm">Peringatan Anomali Cuaca</span>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
                <div className="space-y-2.5">
                  {anomaliCuaca.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="bg-white border border-emerald-200 rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CloudRain className="w-4 h-4 text-amber-600" />
                          <span className="text-zinc-900 text-xs font-bold">{a.wilayah}</span>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${levelColor[a.level]}`}>{a.level}</span>
                      </div>
                      <p className="text-zinc-500 text-[11px] mb-1">{a.tipe}</p>
                      <p className="text-zinc-400 text-[10px] mb-2">{a.dampak}</p>
                      <div className="flex items-center gap-1 text-[9px] text-zinc-400">
                        <ThermometerSun className="w-3 h-3" />
                        <span>Estimasi: {a.waktu}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="plans"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="px-5 pt-3 pb-8"
            >
              {/* Plans Header */}
              <div className="text-center mb-5">
                <h2 className="text-zinc-900 font-bold text-lg mb-1">Pilih Paket Berlangganan</h2>
                <p className="text-zinc-500 text-xs">Akses data intelijen sesuai kebutuhan Anda</p>
              </div>

              <div className="space-y-4">
                {plans.map((plan, i) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className={`relative bg-white border rounded-2xl p-5 ${
                      plan.popular ? "border-emerald-500/40 shadow-lg shadow-emerald-500/10" : "border-emerald-200"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-white" />
                          <span className="text-[10px] text-white font-bold">PALING POPULER</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3 mt-1">
                      <div>
                        <h3 className="text-zinc-900 font-bold text-lg">{plan.name}</h3>
                        <p className="text-zinc-500 text-[10px]">{plan.desc}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-600 font-bold text-xl">{plan.price}</div>
                        <span className="text-zinc-400 text-[10px]">{plan.period}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {plan.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span className="text-zinc-300 text-[11px]">{f}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((f, j) => (
                        <div key={j} className="flex items-center gap-2 opacity-40">
                          <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 flex-shrink-0" />
                          <span className="text-zinc-400 text-[11px] line-through">{f}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      className={`w-full h-11 rounded-xl font-bold text-sm transition-all ${
                        plan.popular
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                          : "bg-emerald-50 border border-emerald-200 text-zinc-600 hover:border-emerald-300"
                      }`}
                    >
                      {plan.popular ? "Berlangganan Sekarang" : "Pilih Paket"}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}