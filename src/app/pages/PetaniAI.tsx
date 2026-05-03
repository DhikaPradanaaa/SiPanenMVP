import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Brain,
  Sprout,
  Leaf,
  CloudRain,
  Sun,
  CloudSun,
  Cloud,
  Droplets,
  Wind,
  ThermometerSun,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CalendarCheck,
  Wheat,
  Target,
  ShieldAlert,
  Lightbulb,
  Zap,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Timer,
  Eye,
  CircleDot,
  RefreshCw,
  Send,
} from "lucide-react";
import { sendToGemini, type DataPanen } from "@/lib/gemini";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

// ══════════════════════════════════════════
//  MOCK DATA — AI-generated predictions
// ══════════════════════════════════════════

const defaultMockLahan = [
  {
    id: 1,
    komoditas: "Padi",
    varietas: "IR-64",
    luas: "2.5 Ha",
    tanggalTanam: "15 Jan 2026",
    lokasiDetail: "Subang, Jawa Barat",
    // AI Predictions
    prediksiPanen: "28 Mar 2026",
    sisaHari: 2,
    estimasiHasil: "8.5 Ton",
    estimasiPerHa: "3.4 Ton/Ha",
    confidence: 94,
    fase: "Siap Panen" as const,
    faseProgress: 98,
    kesehatan: "Baik" as const,
    kesehatanScore: 92,
    risikoGagal: 6,
    // Growth phases
    phases: [
      { nama: "Semai", selesai: true },
      { nama: "Vegetatif", selesai: true },
      { nama: "Reproduktif", selesai: true },
      { nama: "Pematangan", selesai: true },
      { nama: "Panen", selesai: false },
    ],
    rekomendasi: [
      { tipe: "urgent" as const, text: "Panen segera dalam 2 hari untuk kualitas optimal." },
      { tipe: "info" as const, text: "Kadar air gabah sudah mencapai 22% — ideal untuk panen." },
      { tipe: "tip" as const, text: "Jemur gabah 2-3 hari hingga kadar air 14% sebelum dijual." },
    ],
    growthData: [
      { minggu: "M1", tinggi: 8 },
      { minggu: "M2", tinggi: 15 },
      { minggu: "M3", tinggi: 28 },
      { minggu: "M4", tinggi: 42 },
      { minggu: "M5", tinggi: 55 },
      { minggu: "M6", tinggi: 68 },
      { minggu: "M7", tinggi: 78 },
      { minggu: "M8", tinggi: 85 },
      { minggu: "M9", tinggi: 90 },
      { minggu: "M10", tinggi: 92 },
    ],
  },
  {
    id: 2,
    komoditas: "Jagung",
    varietas: "BISI-18",
    luas: "1.8 Ha",
    tanggalTanam: "10 Feb 2026",
    lokasiDetail: "Subang, Jawa Barat",
    prediksiPanen: "15 Apr 2026",
    sisaHari: 20,
    estimasiHasil: "5.2 Ton",
    estimasiPerHa: "2.9 Ton/Ha",
    confidence: 87,
    fase: "Pertumbuhan" as const,
    faseProgress: 56,
    kesehatan: "Perlu Perhatian" as const,
    kesehatanScore: 72,
    risikoGagal: 18,
    phases: [
      { nama: "Semai", selesai: true },
      { nama: "Vegetatif", selesai: true },
      { nama: "Berbunga", selesai: false },
      { nama: "Pengisian", selesai: false },
      { nama: "Panen", selesai: false },
    ],
    rekomendasi: [
      { tipe: "warning" as const, text: "Kelembaban tanah rendah 45% — segera lakukan penyiraman." },
      { tipe: "urgent" as const, text: "Deteksi awal hama penggerek batang — semprot insektisida." },
      { tipe: "tip" as const, text: "Tambahkan pupuk KCl 100 kg/Ha untuk mendukung fase berbunga." },
    ],
    growthData: [
      { minggu: "M1", tinggi: 5 },
      { minggu: "M2", tinggi: 12 },
      { minggu: "M3", tinggi: 22 },
      { minggu: "M4", tinggi: 35 },
      { minggu: "M5", tinggi: 48 },
      { minggu: "M6", tinggi: 56 },
    ],
  },
  {
    id: 3,
    komoditas: "Cabai",
    varietas: "Keriting TM-999",
    luas: "0.5 Ha",
    tanggalTanam: "25 Feb 2026",
    lokasiDetail: "Subang, Jawa Barat",
    prediksiPanen: "20 Apr 2026",
    sisaHari: 25,
    estimasiHasil: "1.8 Ton",
    estimasiPerHa: "3.6 Ton/Ha",
    confidence: 81,
    fase: "Fase Awal" as const,
    faseProgress: 32,
    kesehatan: "Baik" as const,
    kesehatanScore: 88,
    risikoGagal: 12,
    phases: [
      { nama: "Semai", selesai: true },
      { nama: "Vegetatif", selesai: false },
      { nama: "Berbunga", selesai: false },
      { nama: "Berbuah", selesai: false },
      { nama: "Panen", selesai: false },
    ],
    rekomendasi: [
      { tipe: "info" as const, text: "Pertumbuhan normal, lanjutkan perawatan rutin." },
      { tipe: "tip" as const, text: "Pasang mulsa plastik untuk menjaga kelembaban tanah." },
      { tipe: "tip" as const, text: "Pemangkasan tunas air minggu depan untuk hasil optimal." },
    ],
    growthData: [
      { minggu: "M1", tinggi: 3 },
      { minggu: "M2", tinggi: 8 },
      { minggu: "M3", tinggi: 18 },
      { minggu: "M4", tinggi: 32 },
    ],
  },
];

const weatherInsight = {
  hari: [
    { nama: "Hari Ini", icon: "sun", suhu: 32, curahHujan: 0, kelembaban: 65, angin: 12, kondisi: "Cerah" },
    { nama: "Besok", icon: "cloudsun", suhu: 30, curahHujan: 5, kelembaban: 72, angin: 15, kondisi: "Berawan" },
    { nama: "Lusa", icon: "rain", suhu: 27, curahHujan: 25, kelembaban: 85, angin: 18, kondisi: "Hujan" },
    { nama: "Rabu", icon: "rain", suhu: 26, curahHujan: 30, kelembaban: 88, angin: 20, kondisi: "Hujan" },
    { nama: "Kamis", icon: "cloud", suhu: 29, curahHujan: 10, kelembaban: 78, angin: 14, kondisi: "Mendung" },
  ],
  aiAnalysis: [
    { tipe: "warning" as const, text: "Curah hujan tinggi diprediksi Rabu-Kamis (25-30mm). Tunda panen padi hingga Jumat jika memungkinkan." },
    { tipe: "info" as const, text: "Suhu rata-rata minggu ini 28.8°C — ideal untuk pertumbuhan jagung dan cabai." },
    { tipe: "tip" as const, text: "Siapkan drainase tambahan di lahan cabai sebelum hujan datang untuk menghindari genangan." },
  ],
  curahHujanMingguan: [
    { hari: "Sen", mm: 0 },
    { hari: "Sel", mm: 5 },
    { hari: "Rab", mm: 25 },
    { hari: "Kam", mm: 30 },
    { hari: "Jum", mm: 10 },
    { hari: "Sab", mm: 8 },
    { hari: "Min", mm: 3 },
  ],
};

const marketInsight = [
  {
    komoditas: "Padi (Gabah)",
    hargaSekarang: 6200,
    prediksiHarga: 6800,
    trend: "naik" as const,
    persentase: "+9.7%",
    alasan: "Stok nasional menurun 12% menjelang akhir musim panen. Permintaan industri meningkat.",
    saranJual: "Tahan hingga minggu depan untuk harga lebih baik.",
    data: [
      { m: "Jan", h: 5800 },
      { m: "Feb", h: 5900 },
      { m: "Mar", h: 6200 },
      { m: "Apr*", h: 6800 },
    ],
  },
  {
    komoditas: "Jagung",
    hargaSekarang: 4800,
    prediksiHarga: 4500,
    trend: "turun" as const,
    persentase: "-6.3%",
    alasan: "Panen raya jagung di Jawa Timur akan dimulai bulan depan, suplai diperkirakan melimpah.",
    saranJual: "Jual sebelum April untuk menghindari penurunan harga.",
    data: [
      { m: "Jan", h: 5100 },
      { m: "Feb", h: 5000 },
      { m: "Mar", h: 4800 },
      { m: "Apr*", h: 4500 },
    ],
  },
  {
    komoditas: "Cabai Merah",
    hargaSekarang: 45000,
    prediksiHarga: 52000,
    trend: "naik" as const,
    persentase: "+15.6%",
    alasan: "Cuaca buruk mengurangi produksi di sentra cabai Jawa Tengah. Permintaan Ramadan meningkat.",
    saranJual: "Potensi harga puncak di minggu ke-2 April.",
    data: [
      { m: "Jan", h: 32000 },
      { m: "Feb", h: 38000 },
      { m: "Mar", h: 45000 },
      { m: "Apr*", h: 52000 },
    ],
  },
];

// ══════════════════════════════════════════
//  HELPER COMPONENTS
// ══════════════════════════════════════════

const weatherIcons: Record<string, typeof Sun> = {
  sun: Sun,
  cloudsun: CloudSun,
  rain: CloudRain,
  cloud: Cloud,
};

function faseColor(fase: string) {
  switch (fase) {
    case "Siap Panen":
      return { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-400" };
    case "Pertumbuhan":
      return { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30", dot: "bg-blue-400" };
    case "Fase Awal":
      return { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", dot: "bg-amber-400" };
    default:
      return { bg: "bg-zinc-500/15", text: "text-zinc-400", border: "border-zinc-500/30", dot: "bg-zinc-400" };
  }
}

function kesehatanColor(k: string) {
  return k === "Baik"
    ? { bg: "bg-emerald-500/15", text: "text-emerald-400", ring: "stroke-emerald-500" }
    : { bg: "bg-amber-500/15", text: "text-amber-400", ring: "stroke-amber-500" };
}

function rekomendasiIcon(tipe: string) {
  switch (tipe) {
    case "urgent":
      return <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />;
    case "warning":
      return <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />;
    case "info":
      return <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />;
    case "tip":
      return <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />;
    default:
      return <CircleDot className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />;
  }
}

function rekomendasiBg(tipe: string) {
  switch (tipe) {
    case "urgent":
      return "bg-red-500/8 border-red-500/20";
    case "warning":
      return "bg-amber-500/8 border-amber-500/20";
    case "info":
      return "bg-blue-500/8 border-blue-500/20";
    case "tip":
      return "bg-emerald-500/8 border-emerald-500/20";
    default:
      return "bg-zinc-500/8 border-zinc-500/20";
  }
}

// Circular progress ring
function RingProgress({ value, size = 56, strokeWidth = 5, color = "stroke-emerald-500" }: { value: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#27272a" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        className={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      />
    </svg>
  );
}

// ══════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════

export function PetaniAI() {
  const navigate = useNavigate();
  const [lahanAktif, setLahanAktif] = useState<any[]>([]);
  const [isLoadingLahan, setIsLoadingLahan] = useState(true);
  const [selectedLahan, setSelectedLahan] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    crop: true,
    growth: true,
    rekomendasi: true,
    weather: false,
    market: false,
    chat: true,
  });

  // ── Chat state ─────────────────────────────
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke bawah saat pesan baru masuk
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: msg }]);
    setChatLoading(true);

    try {
      // History untuk multi-turn conversation
      const history = chatMessages.map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        text: m.text,
      }));

      // Susun konteks data panen
      const panenContext: DataPanen[] = (lahanAktif.length > 0 ? lahanAktif : defaultMockLahan).map(
        (d: any) => ({
          komoditas: d.komoditas,
          luas_lahan: d.luas_lahan || parseFloat(d.luas),
          tanggal_tanam: d.tanggal_tanam || d.tanggalTanam,
          estimasi_panen: d.estimasi_panen || d.prediksiPanen,
          volume_estimasi: d.volume_estimasi,
          lokasi: d.lokasi || d.lokasiDetail,
          status: d.status || d.fase,
        })
      );

      const reply = await sendToGemini(msg, history, panenContext);
      setChatMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", text: `⚠️ ${err.message || "Tidak dapat terhubung ke AI."}` },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`http://localhost:5001/api/predictions/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setLahanAktif(data);
          } else {
            setLahanAktif(defaultMockLahan);
          }
          setIsLoadingLahan(false);
        })
        .catch(err => {
          console.error("Failed to load AI predictions", err);
          setLahanAktif(defaultMockLahan);
          setIsLoadingLahan(false);
        });
    } else {
      setLahanAktif(defaultMockLahan);
      setIsLoadingLahan(false);
    }
  }, []);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const lahan = lahanAktif[selectedLahan];

  if (isLoadingLahan || !lahan) {
    return <div className="flex items-center justify-center h-screen bg-[#F5FCEF]"><div className="text-emerald-500 font-bold">Memuat AI Asisten...</div></div>;
  }

  const fc = faseColor(lahan.fase);
  const kc = kesehatanColor(lahan.kesehatan);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F5FCEF]">
      {/* ── HEADER ── */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-emerald-200">
        <button
          onClick={() => navigate("/dashboard/petani")}
          className="p-1.5 hover:bg-emerald-50 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-800" />
        </button>
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Brain className="w-4.5 h-4.5 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-black font-bold text-sm leading-tight">AI Asisten Tani</h1>
            <p className="text-emerald-400 text-[10px] font-medium">Prediksi & Analisis Real-time</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-7 h-7 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 flex items-center justify-center"
        >
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
        </motion.div>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex-1 overflow-y-auto bg-[#F5FCEF]">
        {/* AI Status Bar */}
        <div className="px-5 pt-5 pb-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </motion.div>
            <p className="text-emerald-300 text-xs flex-1">
              AI menganalisis <strong>{lahanAktif.length} lahan aktif</strong> Anda. Data diperbarui secara real-time.
            </p>
            <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
          </motion.div>
        </div>

        {/* ── LAHAN SELECTOR ── */}
        <div className="px-5 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {lahanAktif.map((l, i) => {
              const active = selectedLahan === i;
              const lfc = faseColor(l.fase);
              return (
                <button
                  key={l.id}
                  onClick={() => setSelectedLahan(i)}
                  className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 ${active
                    ? "bg-white border-emerald-400 shadow-lg shadow-emerald-500/10"
                    : "bg-white/50 border-emerald-200 hover:border-emerald-300"
                    }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${active ? "bg-gradient-to-br from-emerald-500 to-emerald-600" : "bg-emerald-100"}`}>
                    <Leaf className={`w-4.5 h-4.5 ${active ? "text-white" : "text-emerald-500"}`} />
                  </div>
                  <div className="text-left">
                    <div className={`font-bold text-sm ${active ? "text-zinc-900" : "text-zinc-500"}`}>{l.komoditas}</div>
                    <div className="text-[10px] text-zinc-500">{l.luas} • {l.varietas}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${lfc.dot}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════ */}
        {/*  1. AI CROP PREDICTION                  */}
        {/* ════════════════════════════════════════ */}
        <motion.div
          key={`crop-${lahan.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="px-5 mb-4"
        >
          <button
            onClick={() => toggleSection("crop")}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-black font-bold text-sm">AI Crop Prediction</span>
            </div>
            {expandedSections.crop ? (
              <ChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.crop && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-emerald-200 rounded-2xl p-5 space-y-4">
                  {/* Main Prediction */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <RingProgress
                        value={lahan.confidence}
                        color={lahan.confidence >= 90 ? "stroke-emerald-500" : lahan.confidence >= 80 ? "stroke-blue-500" : "stroke-amber-500"}
                      />
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-zinc-900 font-bold text-sm">{lahan.confidence}%</span>
                        <span className="text-zinc-500 text-[8px]">akurasi</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-zinc-500 text-[10px] mb-0.5">Prediksi Waktu Panen</div>
                      <div className="text-zinc-900 font-bold text-lg">{lahan.prediksiPanen}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Timer className="w-3 h-3 text-emerald-400" />
                        <span className={`text-xs font-bold ${lahan.sisaHari <= 5 ? "text-emerald-600" : "text-zinc-600"}`}>
                          {lahan.sisaHari} hari lagi
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Yield Estimate */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-emerald-50 rounded-xl p-3.5">
                      <div className="text-zinc-500 text-[10px] mb-1">Estimasi Total Hasil</div>
                      <div className="text-emerald-600 font-bold text-xl">{lahan.estimasiHasil}</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3.5">
                      <div className="text-zinc-500 text-[10px] mb-1">Produktivitas</div>
                      <div className="text-zinc-900 font-bold text-xl">{lahan.estimasiPerHa}</div>
                    </div>
                  </div>

                  {/* Info row */}
                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-zinc-400 text-[10px]">Tanam: {lahan.tanggalTanam}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wheat className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-zinc-400 text-[10px]">{lahan.varietas}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ════════════════════════════════════════ */}
        {/*  2. AI GROWTH MONITORING                */}
        {/* ════════════════════════════════════════ */}
        <div className="px-5 mb-4">
          <button
            onClick={() => toggleSection("growth")}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span className="text-black font-bold text-sm">AI Growth Monitoring</span>
            </div>
            {expandedSections.growth ? (
              <ChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.growth && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-emerald-200 rounded-2xl p-5 space-y-4">
                  {/* Status Row */}
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded-full border text-xs font-bold ${fc.bg} ${fc.text} ${fc.border}`}>
                      {lahan.fase}
                    </div>
                    <div className={`px-3 py-1.5 rounded-full border text-xs font-bold ${kc.bg} ${kc.text}`} style={{ borderColor: lahan.kesehatan === "Baik" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)" }}>
                      Kesehatan: {lahan.kesehatanScore}%
                    </div>
                  </div>

                  {/* Phase Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-400 text-[10px]">Fase Pertumbuhan</span>
                      <span className="text-emerald-400 text-[10px] font-bold">{lahan.faseProgress}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-3">
                      {lahan.phases.map((p, i) => (
                        <div key={i} className="flex-1">
                          <motion.div
                            className={`h-2 rounded-full ${p.selesai ? "bg-emerald-500" : "bg-emerald-100"}`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.1 * i, duration: 0.3 }}
                            style={{ transformOrigin: "left" }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      {lahan.phases.map((p, i) => (
                        <div key={i} className="flex flex-col items-center flex-1">
                          <div className={`w-2.5 h-2.5 rounded-full mb-1 ${p.selesai ? "bg-emerald-500" : "bg-zinc-300"}`} />
                          <span className={`text-[8px] text-center leading-tight ${p.selesai ? "text-emerald-600" : "text-zinc-400"}`}>{p.nama}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risiko Gagal Panen */}
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${lahan.risikoGagal > 15
                    ? "bg-amber-500/8 border-amber-500/20"
                    : "bg-emerald-500/8 border-emerald-500/20"
                    }`}>
                    <ShieldAlert className={`w-5 h-5 flex-shrink-0 ${lahan.risikoGagal > 15 ? "text-amber-400" : "text-emerald-400"}`} />
                    <div>
                      <div className="text-[10px] text-zinc-400">Risiko Gagal Panen</div>
                      <div className={`font-bold text-sm ${lahan.risikoGagal > 15 ? "text-amber-400" : "text-emerald-400"}`}>
                        {lahan.risikoGagal}% — {lahan.risikoGagal > 15 ? "Perlu Perhatian" : "Rendah"}
                      </div>
                    </div>
                  </div>

                  {/* Growth Chart */}
                  <div>
                    <div className="text-zinc-400 text-[10px] mb-2">Kurva Pertumbuhan</div>
                    <div className="h-28">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={lahan.growthData}>
                          <defs>
                            <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="minggu" tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 12, fontSize: 11, color: "#fff" }}
                            formatter={(v: number) => [`${v}%`, "Progress"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="tinggi"
                            stroke="#10b981"
                            fill="url(#growthGrad)"
                            strokeWidth={2}
                            dot={{ r: 2.5, fill: "#10b981" }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ════════════════════════════════════════ */}
        {/*  3. AI RECOMMENDATION                   */}
        {/* ════════════════════════════════════════ */}
        <div className="px-5 mb-4">
          <button
            onClick={() => toggleSection("rekomendasi")}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <span className="text-black font-bold text-sm">AI Recommendation</span>
              {lahan.rekomendasi.some((r) => r.tipe === "urgent" || r.tipe === "warning") && (
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            {expandedSections.rekomendasi ? (
              <ChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.rekomendasi && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-2.5">
                  {lahan.rekomendasi.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i, duration: 0.3 }}
                      className={`flex items-start gap-3 p-4 rounded-2xl border ${rekomendasiBg(r.tipe)}`}
                    >
                      {rekomendasiIcon(r.tipe)}
                      <p className="text-zinc-600 text-xs leading-relaxed flex-1">{r.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ════════════════════════════════════════ */}
        {/*  4. AI WEATHER INSIGHT                  */}
        {/* ════════════════════════════════════════ */}
        <div className="px-5 mb-4">
          <button
            onClick={() => toggleSection("weather")}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-emerald-400" />
              <span className="text-black font-bold text-sm">AI Weather Insight</span>
            </div>
            {expandedSections.weather ? (
              <ChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.weather && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-emerald-200 rounded-2xl p-5 space-y-4">
                  {/* 5-day forecast */}
                  <div className="flex gap-2">
                    {weatherInsight.hari.map((h, i) => {
                      const WIcon = weatherIcons[h.icon] || Cloud;
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-xl p-2.5 text-center border ${i === 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"
                            }`}
                        >
                          <div className="text-[9px] text-zinc-500 mb-1.5">{h.nama}</div>
                          <WIcon className={`w-5 h-5 mx-auto mb-1 ${i === 0 ? "text-emerald-400" : "text-zinc-400"}`} />
                          <div className="text-zinc-900 font-bold text-xs">{h.suhu}°</div>
                          <div className="text-[8px] text-zinc-500 mt-0.5">{h.curahHujan}mm</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Detail Row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                      <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                      <div className="text-zinc-900 font-bold text-xs">{weatherInsight.hari[0].kelembaban}%</div>
                      <div className="text-[9px] text-zinc-500">Kelembaban</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                      <Wind className="w-4 h-4 text-zinc-400 mx-auto mb-1" />
                      <div className="text-zinc-900 font-bold text-xs">{weatherInsight.hari[0].angin} km/j</div>
                      <div className="text-[9px] text-zinc-500">Angin</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                      <ThermometerSun className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                      <div className="text-zinc-900 font-bold text-xs">{weatherInsight.hari[0].suhu}°C</div>
                      <div className="text-[9px] text-zinc-500">Suhu</div>
                    </div>
                  </div>

                  {/* Rainfall Chart */}
                  <div>
                    <div className="text-zinc-400 text-[10px] mb-2">Curah Hujan Mingguan (mm)</div>
                    <div className="h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weatherInsight.curahHujanMingguan}>
                          <XAxis dataKey="hari" tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{ background: "#ffffff", border: "1px solid #d1fae5", borderRadius: 12, fontSize: 11, color: "#18181b" }}
                            formatter={(v: number) => [`${v}mm`, "Curah Hujan"]}
                          />
                          <Bar
                            dataKey="mm"
                            radius={[4, 4, 0, 0]}
                            fill="#3b82f6"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* AI Weather Analysis */}
                  <div className="space-y-2">
                    <div className="text-zinc-400 text-[10px] font-medium">Analisis AI</div>
                    {weatherInsight.aiAnalysis.map((a, i) => (
                      <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border ${rekomendasiBg(a.tipe)}`}>
                        {rekomendasiIcon(a.tipe)}
                        <p className="text-zinc-600 text-[11px] leading-relaxed flex-1">{a.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ════���═══════════════════════════════════ */}
        {/*  5. AI MARKET INSIGHT                   */}
        {/* ════════════════════════════════════════ */}
        <div className="px-5 mb-8">
          <button
            onClick={() => toggleSection("market")}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span className="text-black font-bold text-sm">AI Market Insight</span>
            </div>
            {expandedSections.market ? (
              <ChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.market && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-3">
                  {marketInsight.map((m, i) => {
                    const isUp = m.trend === "naik";
                    return (
                      <div key={i} className="bg-white border border-emerald-200 rounded-2xl p-5">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-zinc-900 font-bold text-sm">{m.komoditas}</h4>
                          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${isUp ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"
                            }`}>
                            {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {m.persentase}
                          </div>
                        </div>

                        {/* Prices */}
                        <div className="grid grid-cols-2 gap-2.5 mb-3">
                          <div className="bg-emerald-50 rounded-xl p-3">
                            <div className="text-zinc-500 text-[9px]">Harga Sekarang</div>
                            <div className="text-zinc-900 font-bold text-sm">Rp {m.hargaSekarang.toLocaleString()}/kg</div>
                          </div>
                          <div className={`rounded-xl p-3 ${isUp ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                            <div className="text-zinc-500 text-[9px]">Prediksi April</div>
                            <div className={`font-bold text-sm ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                              Rp {m.prediksiHarga.toLocaleString()}/kg
                            </div>
                          </div>
                        </div>

                        {/* Mini Chart */}
                        <div className="h-16 mb-3">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={m.data}>
                              <defs>
                                <linearGradient id={`mkt-${i}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                                  <stop offset="100%" stopColor={isUp ? "#10b981" : "#ef4444"} stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="m" tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} />
                              <Area
                                type="monotone"
                                dataKey="h"
                                stroke={isUp ? "#10b981" : "#ef4444"}
                                fill={`url(#mkt-${i})`}
                                strokeWidth={2}
                                dot={{ r: 2.5, fill: isUp ? "#10b981" : "#ef4444" }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Analysis */}
                        <div className="bg-emerald-50/60 rounded-xl p-3 mb-2">
                          <div className="flex items-start gap-2">
                            <Brain className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <p className="text-zinc-600 text-[11px] leading-relaxed">{m.alasan}</p>
                          </div>
                        </div>

                        {/* Saran */}
                        <div className={`flex items-start gap-2 p-3 rounded-xl border ${isUp ? "bg-emerald-500/8 border-emerald-500/20" : "bg-amber-500/8 border-amber-500/20"}`}>
                          <Lightbulb className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isUp ? "text-emerald-400" : "text-amber-400"}`} />
                          <p className={`text-[11px] leading-relaxed ${isUp ? "text-emerald-700" : "text-amber-700"}`}>
                            <strong>Saran:</strong> {m.saranJual}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ════════════════════════════════════════ */}
        {/*  6. TANYA AI GEMINI — LIVE CHAT        */}
        {/* ════════════════════════════════════════ */}
        <div className="px-5 mb-8">
          <button
            onClick={() => toggleSection("chat")}
            className="w-full flex items-center justify-between mb-3"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" />
              <span className="text-black font-bold text-sm">Tanya AI Asisten</span>
              <span className="text-[9px] px-2 py-0.5 bg-emerald-500/20 text-emerald-600 rounded-full font-bold border border-emerald-500/30">
                AI SiPanen
              </span>
            </div>
            {expandedSections.chat ? (
              <ChevronUp className="w-4 h-4 text-zinc-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          <AnimatePresence>
            {expandedSections.chat && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-emerald-200 rounded-2xl p-4 flex flex-col gap-3">

                  {/* Quick Prompts — hanya tampil saat belum ada pesan */}
                  {chatMessages.length === 0 && (
                    <div>
                      <p className="text-zinc-400 text-[10px] mb-2 font-medium">Pertanyaan cepat:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Kapan waktu panen terbaik?",
                          "Pupuk apa yang cocok?",
                          "Cara atasi hama wereng?",
                          "Analisis harga jual",
                          "Tips irigasi musim kering",
                        ].map((q) => (
                          <button
                            key={q}
                            onClick={() => setChatInput(q)}
                            className="text-[10px] px-2.5 py-1 bg-emerald-50 border border-emerald-200
                                       text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pesan-pesan */}
                  {chatMessages.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {chatMessages.map((m, i) => (
                        <div key={i} className={`flex shrink-0 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                          {/* Avatar AI */}
                          {m.role === "ai" && (
                            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600
                                            rounded-lg flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                              <Brain className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div
                            className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${m.role === "user"
                              ? "bg-emerald-500 text-white rounded-br-sm"
                              : "bg-emerald-50 text-zinc-700 border border-emerald-100 rounded-bl-sm"
                              }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      ))}

                      {/* Loading dots */}
                      {chatLoading && (
                        <div className="flex justify-start items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600
                                          rounded-lg flex items-center justify-center flex-shrink-0">
                            <Brain className="w-3 h-3 text-white" />
                          </div>
                          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                            <div className="flex gap-1 items-center">
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                              <span className="text-[9px] text-zinc-400 ml-1">AI SiPanen sedang berpikir...</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={chatBottomRef} />
                    </div>
                  )}

                  {/* Input + Send */}
                  <div className="flex gap-2 items-center">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                      placeholder="Tulis pertanyaan pertanian..."
                      className="flex-1 h-11 px-3.5 bg-emerald-50 border border-emerald-200 rounded-xl
                                 text-zinc-900 text-xs placeholder:text-zinc-400
                                 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10"
                    />
                    <button
                      id="chat-send-btn"
                      onClick={sendMessage}
                      disabled={chatLoading || !chatInput.trim()}
                      className="h-11 w-11 flex items-center justify-center
                                 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white
                                 rounded-xl shadow-lg shadow-emerald-500/25
                                 disabled:opacity-40 disabled:cursor-not-allowed
                                 transition-all hover:shadow-emerald-500/40"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}