import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  FileBarChart,
  ShoppingCart,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MapPin,
  Calendar,
  Download,
  Lock,
  Crown,
  Star,
  CheckCircle2,
  BarChart3,
  Leaf,
  Globe,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// ── MOCK DATA ──

const laporanKatalog = [
  {
    id: "RPT-001",
    title: "Proyeksi Produksi Padi Nasional 2026-2027",
    kategori: "Proyeksi Jangka Panjang",
    harga: "Rp 350K",
    rating: 4.9,
    reviews: 124,
    desc: "Analisis komprehensif produksi padi di 15 provinsi sentra utama dengan model prediksi AI. Mencakup dampak cuaca, tren harga, dan rekomendasi kebijakan.",
    highlights: ["15 provinsi", "Prediksi 18 bulan", "Model AI v3.2"],
    preview: {
      summary: "Produksi padi nasional diprediksi meningkat 4.2% YoY di 2026, mencapai 32.8 juta ton GKG. Jawa Barat dan Jawa Timur tetap menjadi kontributor terbesar.",
      chartData: [
        { q: "Q1'26", val: 8200 },
        { q: "Q2'26", val: 7800 },
        { q: "Q3'26", val: 8500 },
        { q: "Q4'26", val: 8300 },
        { q: "Q1'27", val: 8800 },
        { q: "Q2'27", val: 8100 },
      ],
    },
    popular: true,
  },
  {
    id: "RPT-002",
    title: "Tren Harga Komoditas Hortikultura Q1-Q2 2026",
    kategori: "Tren Komoditas",
    harga: "Rp 250K",
    rating: 4.7,
    reviews: 89,
    desc: "Analisis pergerakan harga cabai, bawang merah, tomat, dan 8 komoditas hortikultura lainnya. Termasuk faktor musiman dan prediksi harga.",
    highlights: ["11 komoditas", "Analisis musiman", "Prediksi 6 bulan"],
    preview: {
      summary: "Harga cabai merah diprediksi melonjak 18-25% menjelang Ramadan 2026 (Mar-Apr) akibat penurunan produksi di Jawa Tengah dan Sumatera.",
      chartData: [
        { q: "Jan", val: 38000 },
        { q: "Feb", val: 42000 },
        { q: "Mar*", val: 52000 },
        { q: "Apr*", val: 48000 },
        { q: "Mei*", val: 35000 },
        { q: "Jun*", val: 32000 },
      ],
    },
    popular: false,
  },
  {
    id: "RPT-003",
    title: "Analisis Wilayah Pertanian Sulawesi Selatan",
    kategori: "Analisis Wilayah",
    harga: "Rp 200K",
    rating: 4.8,
    reviews: 56,
    desc: "Deep-dive ke potensi pertanian Sulawesi Selatan meliputi mapping lahan, produktivitas per kabupaten, dan peluang investasi agribisnis.",
    highlights: ["24 kabupaten", "Mapping lahan", "Peluang investasi"],
    preview: {
      summary: "Sulawesi Selatan memiliki potensi peningkatan produktivitas padi 12% dengan adopsi teknologi irigasi modern di 8 kabupaten prioritas.",
      chartData: [
        { q: "Bone", val: 320 },
        { q: "Wajo", val: 280 },
        { q: "Soppeng", val: 245 },
        { q: "Sidrap", val: 230 },
        { q: "Pinrang", val: 210 },
        { q: "Luwu", val: 180 },
      ],
    },
    popular: false,
  },
  {
    id: "RPT-004",
    title: "Laporan Rantai Pasok Jagung Indonesia 2026",
    kategori: "Rantai Pasok",
    harga: "Rp 300K",
    rating: 4.6,
    reviews: 43,
    desc: "Analisis end-to-end rantai pasok jagung dari petani hingga industri pakan. Identifikasi bottleneck dan rekomendasi efisiensi.",
    highlights: ["End-to-end analysis", "10 provinsi", "Rekomendasi efisiensi"],
    preview: {
      summary: "Ineffisiensi logistik menyebabkan 15% loss di rantai pasok jagung. Digitalisasi titik pengumpulan dapat menghemat Rp 480M/tahun secara nasional.",
      chartData: [
        { q: "Petani", val: 100 },
        { q: "Pengepul", val: 92 },
        { q: "Gudang", val: 88 },
        { q: "Transport", val: 85 },
        { q: "Industri", val: 85 },
      ],
    },
    popular: false,
  },
];

const kategoriFilter = ["Semua", "Proyeksi Jangka Panjang", "Tren Komoditas", "Analisis Wilayah", "Rantai Pasok"];

export function AnalyticReport() {
  const navigate = useNavigate();
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filtered = selectedKategori === "Semua" ? laporanKatalog : laporanKatalog.filter((l) => l.kategori === selectedKategori);
  const previewItem = laporanKatalog.find((l) => l.id === previewId);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F5FCEF]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-emerald-200">
        <button onClick={() => navigate("/premium")} className="p-1.5 hover:bg-emerald-50 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-zinc-800" />
        </button>
        <div className="flex-1">
          <h1 className="text-zinc-800 font-bold text-sm">Analytic Report Premium</h1>
          <p className="text-amber-600 text-[10px] font-medium">Laporan Analitik Berbasis Data AI</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/15 border border-amber-500/30 rounded-full">
          <Crown className="w-3 h-3 text-amber-400" />
          <span className="text-[9px] text-amber-400 font-bold">PREMIUM</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#F5FCEF]">
        {/* Intro */}
        <div className="px-5 pt-5 pb-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <FileBarChart className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-700 font-bold text-xs mb-1">Laporan Analitik Profesional</h4>
                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  Laporan mendalam yang dihasilkan oleh AI SiPanen, mencakup proyeksi produksi, tren komoditas, dan analisis wilayah untuk keputusan bisnis yang lebih baik.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Kategori Filter */}
        <div className="px-5 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {kategoriFilter.map((k) => (
              <button
                key={k}
                onClick={() => setSelectedKategori(k)}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold border whitespace-nowrap transition-all ${
                  selectedKategori === k
                    ? "bg-amber-100 text-amber-600 border-amber-300"
                    : "bg-white text-zinc-500 border-emerald-200"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Report Cards */}
        <div className="px-5 pb-8 space-y-3">
          {filtered.map((l, i) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`bg-white border rounded-2xl overflow-hidden ${
                l.popular ? "border-amber-300" : "border-emerald-200"
              }`}
            >
              {l.popular && (
                <div className="bg-gradient-to-r from-amber-100 to-amber-50 px-4 py-1.5 flex items-center gap-1.5 border-b border-amber-200">
                  <Star className="w-3 h-3 text-amber-400" />
                  <span className="text-[9px] text-amber-400 font-bold">BEST SELLER</span>
                </div>
              )}

              <div className="p-4">
                {/* Title & Kategori */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 mr-3">
                    <span className="text-[9px] text-emerald-400 font-medium">{l.kategori}</span>
                    <h3 className="text-zinc-900 font-bold text-sm leading-snug mt-0.5">{l.title}</h3>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-emerald-600 font-bold text-sm">{l.harga}</div>
                    <div className="flex items-center gap-0.5 justify-end mt-0.5">
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span className="text-zinc-400 text-[9px]">{l.rating} ({l.reviews})</span>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-500 text-[11px] leading-relaxed mb-3">{l.desc}</p>

                {/* Highlights */}
                <div className="flex gap-2 mb-3">
                  {l.highlights.map((h, j) => (
                    <span key={j} className="text-[9px] px-2 py-0.5 bg-emerald-50 text-zinc-500 rounded-full border border-emerald-200">
                      {h}
                    </span>
                  ))}
                </div>

                {/* Preview Section */}
                <AnimatePresence>
                  {previewId === l.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-emerald-50 rounded-xl p-4 mb-3 border border-emerald-200">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span className="text-amber-400 text-[10px] font-bold">PREVIEW RINGKASAN</span>
                        </div>
                        <p className="text-zinc-600 text-[11px] leading-relaxed mb-3">{l.preview.summary}</p>

                        {/* Preview Chart */}
                        <div className="h-28 mb-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={l.preview.chartData}>
                              <defs>
                                <linearGradient id={`prev-${l.id}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="q" tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} />
                              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #d1fae5", borderRadius: 12, fontSize: 11, color: "#18181b" }} />
                              <Area type="monotone" dataKey="val" stroke="#f59e0b" fill={`url(#prev-${l.id})`} strokeWidth={2} dot={{ r: 2.5, fill: "#f59e0b" }} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="flex items-center gap-1.5 text-[9px] text-zinc-600">
                          <Lock className="w-3 h-3" />
                          <span>Data lengkap tersedia setelah pembelian</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewId(previewId === l.id ? null : l.id)}
                    className="flex-1 h-10 bg-white border border-emerald-200 text-zinc-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:border-emerald-300"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {previewId === l.id ? "Tutup Preview" : "Preview"}
                  </button>
                  <button className="flex-1 h-10 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Beli Laporan
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}