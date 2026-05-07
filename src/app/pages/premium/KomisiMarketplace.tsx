import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Percent,
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  FileText,
  Eye,
  Calendar,
  Filter,
  Download,
  ChevronRight,
  CheckCircle2,
  Clock,
  Leaf,
  Users,
  BarChart3,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area, LineChart, Line } from "recharts";

// ── MOCK DATA ──

const summaryStats = [
  { label: "Total Transaksi", value: "Rp 2.84M", sub: "Bulan ini", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Komisi Platform", value: "Rp 1.73Jt", sub: "Rp 5.000 tetap", icon: Percent, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Jumlah Transaksi", value: "347", sub: "+23% vs bulan lalu", icon: ShoppingCart, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Petani Aktif", value: "1,284", sub: "Terhubung marketplace", icon: Users, color: "text-violet-400", bg: "bg-violet-500/10" },
];

const transaksiHarian = [
  { hari: "Sen", nilai: 420, komisi: 10.5 },
  { hari: "Sel", nilai: 380, komisi: 9.5 },
  { hari: "Rab", nilai: 510, komisi: 12.75 },
  { hari: "Kam", nilai: 460, komisi: 11.5 },
  { hari: "Jum", nilai: 390, komisi: 9.75 },
  { hari: "Sab", nilai: 340, komisi: 8.5 },
  { hari: "Min", nilai: 280, komisi: 7.0 },
];

const riwayatTransaksi = [
  { id: "TRX-20260326-001", petani: "Pak Suharto", pembeli: "PT Agro Nusantara", komoditas: "Padi", volume: "8.5 Ton", nilai: "Rp 52.7Jt", komisi: "Rp 5.000", rate: "Flat", status: "Selesai", tanggal: "26 Mar 2026" },
  { id: "TRX-20260325-004", petani: "Bu Siti Aminah", pembeli: "CV Makmur Jaya", komoditas: "Padi", volume: "12 Ton", nilai: "Rp 72.6Jt", komisi: "Rp 5.000", rate: "Flat", status: "Selesai", tanggal: "25 Mar 2026" },
  { id: "TRX-20260325-002", petani: "Pak Joko", pembeli: "PT FoodTech Indo", komoditas: "Jagung", volume: "5 Ton", nilai: "Rp 24.0Jt", komisi: "Rp 5.000", rate: "Flat", status: "Diproses", tanggal: "25 Mar 2026" },
  { id: "TRX-20260324-007", petani: "Pak Agus", pembeli: "PT Segar Makmur", komoditas: "Cabai", volume: "2.5 Ton", nilai: "Rp 112.5Jt", komisi: "Rp 5.000", rate: "Flat", status: "Selesai", tanggal: "24 Mar 2026" },
  { id: "TRX-20260324-003", petani: "Bu Wati", pembeli: "CV Tani Bersama", komoditas: "Kedelai", volume: "3 Ton", nilai: "Rp 37.5Jt", komisi: "Rp 5.000", rate: "Flat", status: "Selesai", tanggal: "24 Mar 2026" },
];

const komisiPerKomoditas = [
  { name: "Padi", komisi: 28.5 },
  { name: "Cabai", komisi: 18.2 },
  { name: "Jagung", komisi: 12.8 },
  { name: "Kedelai", komisi: 7.4 },
  { name: "B.Merah", komisi: 4.3 },
];

const statusColors: Record<string, string> = {
  Selesai: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Diproses: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Menunggu: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

export function KomisiMarketplace() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("semua");

  const filtered = filter === "semua" ? riwayatTransaksi : riwayatTransaksi.filter((t) => t.status === filter);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F5FCEF]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-emerald-200">
        <button onClick={() => navigate("/premium")} className="p-1.5 hover:bg-emerald-50 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-zinc-800" />
        </button>
        <div className="flex-1">
          <h1 className="text-zinc-800 font-bold text-sm">Komisi Marketplace</h1>
          <p className="text-blue-600 text-[10px] font-medium">Laporan Transaksi & Komisi Platform</p>
        </div>
        <button className="p-2 hover:bg-emerald-50 rounded-xl transition-colors">
          <Download className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#F5FCEF]">
        {/* Summary Stats */}
        <div className="px-5 pt-5 pb-4 grid grid-cols-2 gap-2.5">
          {summaryStats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="bg-white border border-emerald-200 rounded-2xl p-4"
              >
                <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className="text-zinc-900 font-bold text-lg">{s.value}</div>
                <div className="text-zinc-500 text-[10px]">{s.label}</div>
                <div className="text-zinc-400 text-[9px] mt-0.5">{s.sub}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Transaksi Harian Chart */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span className="text-zinc-900 font-bold text-sm">Transaksi Minggu Ini</span>
          </div>
          <div className="bg-white border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-zinc-500 text-[10px]">Nilai (Jt)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-zinc-500 text-[10px]">Komisi (Jt)</span>
              </div>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transaksiHarian}>
                  <XAxis dataKey="hari" tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #d1fae5", borderRadius: 12, fontSize: 11, color: "#18181b" }} />
                  <Bar dataKey="nilai" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="komisi" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Komisi per Komoditas */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="text-zinc-900 font-bold text-sm">Komisi per Komoditas (Jt)</span>
          </div>
          <div className="bg-white border border-emerald-200 rounded-2xl p-4">
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={komisiPerKomoditas} layout="vertical">
                  <XAxis type="number" tick={{ fill: "#52525b", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill: "#a1a1aa", fontSize: 10 }} axisLine={false} tickLine={false} width={55} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #d1fae5", borderRadius: 12, fontSize: 11, color: "#18181b" }} formatter={(v: number) => [`Rp ${v}Jt`, "Komisi"]} />
                  <Bar dataKey="komisi" fill="#10b981" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transparansi Info */}
        <div className="px-5 pb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-blue-700 font-bold text-xs mb-1">Transparansi Komisi Platform</h4>
                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  SiPanen menerapkan komisi tetap <strong className="text-blue-700">Rp 5.000</strong> dari setiap transaksi berhasil. Komisi otomatis dipotong saat pembayaran dan ditampilkan secara transparan di laporan ini.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="px-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="text-zinc-900 font-bold text-sm">Riwayat Transaksi</span>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {["semua", "Selesai", "Diproses", "Menunggu"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold border whitespace-nowrap transition-all ${
                  filter === f
                    ? "bg-emerald-100 text-emerald-600 border-emerald-300"
                    : "bg-white text-zinc-500 border-emerald-200 hover:border-emerald-300"
                }`}
              >
                {f === "semua" ? "Semua" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="px-5 pb-8 space-y-2.5">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="bg-white border border-emerald-200 rounded-2xl p-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-[9px] font-mono">{t.id}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${statusColors[t.status]}`}>{t.status}</span>
              </div>

              {/* Petani → Pembeli */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1">
                  <div className="text-zinc-500 text-[9px]">Petani</div>
                  <div className="text-zinc-900 text-xs font-bold">{t.petani}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-500" />
                <div className="flex-1 text-right">
                  <div className="text-zinc-500 text-[9px]">Pembeli</div>
                  <div className="text-zinc-900 text-xs font-bold">{t.pembeli}</div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-2 mb-3 bg-emerald-50/80 rounded-xl p-3">
                <div>
                  <div className="text-zinc-500 text-[9px]">Komoditas</div>
                  <div className="text-zinc-900 text-[11px] font-medium">{t.komoditas}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[9px]">Volume</div>
                  <div className="text-zinc-900 text-[11px] font-medium">{t.volume}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[9px]">Tanggal</div>
                  <div className="text-zinc-900 text-[11px] font-medium">{t.tanggal}</div>
                </div>
              </div>

              {/* Value & Commission */}
              <div className="flex items-center justify-between pt-2 border-t border-emerald-100">
                <div>
                  <div className="text-zinc-500 text-[9px]">Nilai Transaksi</div>
                  <div className="text-zinc-900 font-bold text-sm">{t.nilai}</div>
                </div>
                <div className="text-right">
                  <div className="text-zinc-500 text-[9px]">Komisi ({t.rate})</div>
                  <div className="text-amber-600 font-bold text-sm">{t.komisi}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}