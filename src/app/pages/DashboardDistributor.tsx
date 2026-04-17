import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { MobileLayout } from "../components/MobileLayout";
import {
  Truck, Warehouse, ShoppingBag, Package, TrendingUp, AlertTriangle,
  MapPin, Clock, CheckCircle2, ArrowUpRight, ArrowDownRight, Plus,
  ChevronRight, Eye, Phone, FileText, DollarSign, BarChart3, Users,
  Navigation, CircleDot, ArrowRight, Crown,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";

// ── MOCK DATA ──

const summaryStats = [
  { label: "Stok Gudang", value: "128 Ton", icon: Warehouse, color: "text-emerald-400" },
  { label: "Pesanan Aktif", value: "12", icon: FileText, color: "text-blue-400" },
  { label: "Armada Jalan", value: "5", icon: Truck, color: "text-amber-400" },
  { label: "Margin Bulan Ini", value: "18.4%", icon: TrendingUp, color: "text-emerald-400" },
];

const petaniSiapPanen = [
  { id: 1, nama: "Pak Suharto", lokasi: "Subang", komoditas: "Padi", volume: "8.5 Ton", harga: "Rp 6.100/kg", rating: 4.8 },
  { id: 2, nama: "Bu Siti Aminah", lokasi: "Karawang", komoditas: "Padi", volume: "12 Ton", harga: "Rp 6.050/kg", rating: 4.6 },
  { id: 3, nama: "Pak Joko", lokasi: "Kediri", komoditas: "Jagung", volume: "5 Ton", harga: "Rp 4.700/kg", rating: 4.9 },
  { id: 4, nama: "Pak Agus", lokasi: "Garut", komoditas: "Cabai", volume: "2.5 Ton", harga: "Rp 44.000/kg", rating: 4.5 },
];

const stokGudang = [
  { komoditas: "Padi", stok: 65, kapasitas: 80, satuan: "Ton", status: "Aman" },
  { komoditas: "Jagung", stok: 28, kapasitas: 50, satuan: "Ton", status: "Aman" },
  { komoditas: "Cabai", stok: 5, kapasitas: 20, satuan: "Ton", status: "Menipis" },
  { komoditas: "Bawang Merah", stok: 15, kapasitas: 30, satuan: "Ton", status: "Aman" },
  { komoditas: "Kedelai", stok: 8, kapasitas: 40, satuan: "Ton", status: "Kritis" },
];

const stokMasukKeluar = [
  { bulan: "Jan", masuk: 45, keluar: 38 },
  { bulan: "Feb", masuk: 52, keluar: 48 },
  { bulan: "Mar", masuk: 60, keluar: 55 },
  { bulan: "Apr", masuk: 48, keluar: 42 },
];

const armadaLogistik = [
  { id: "T-01", driver: "Budi S.", rute: "Subang → Gudang Bekasi", status: "Di Perjalanan", eta: "2 jam", muatan: "8 Ton Padi" },
  { id: "T-02", driver: "Andi P.", rute: "Gudang Bekasi → PT Indofood", status: "Loading", eta: "-", muatan: "15 Ton Padi" },
  { id: "T-03", driver: "Cahyo", rute: "Kediri → Gudang Surabaya", status: "Di Perjalanan", eta: "4 jam", muatan: "5 Ton Jagung" },
  { id: "T-04", driver: "Dimas R.", rute: "Garut → Gudang Bandung", status: "Selesai", eta: "-", muatan: "2.5 Ton Cabai" },
  { id: "T-05", driver: "Eko W.", rute: "Gudang Bandung → PT ABC", status: "Menunggu", eta: "-", muatan: "10 Ton Padi" },
];

const pesananMasuk = [
  { id: "PO-001", perusahaan: "PT Indofood", komoditas: "Padi", volume: "15 Ton", deadline: "1 Apr 2026", status: "Proses", nilai: "Rp 93.000.000" },
  { id: "PO-002", perusahaan: "PT ABC Food", komoditas: "Jagung", volume: "10 Ton", deadline: "5 Apr 2026", status: "Baru", nilai: "Rp 50.000.000" },
  { id: "PO-003", perusahaan: "PT Mayora", komoditas: "Bawang Merah", volume: "5 Ton", deadline: "10 Apr 2026", status: "Proses", nilai: "Rp 175.000.000" },
];

const laporanKeuangan = {
  totalBeli: "Rp 856.200.000",
  totalJual: "Rp 1.012.500.000",
  biayaLogistik: "Rp 42.800.000",
  profit: "Rp 113.500.000",
  margin: "18.4%",
  data: [
    { bulan: "Jan", beli: 180, jual: 215, profit: 28 },
    { bulan: "Feb", beli: 220, jual: 260, profit: 32 },
    { bulan: "Mar", beli: 250, jual: 295, profit: 35 },
  ],
};

const statusArmadaColors: Record<string, string> = {
  "Di Perjalanan": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Loading": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Selesai": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Menunggu": "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

const statusPOColors: Record<string, string> = {
  "Proses": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Baru": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Selesai": "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

export function DashboardDistributor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = searchParams.get("tab") || "beranda";

  const TabBeranda = () => (
    <div>
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-2xl font-bold text-zinc-900">PT Agro Nusantara</h2>
          <button onClick={() => navigate("/profile?role=distributor")} className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
            <Truck className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-zinc-500 text-sm">Bekasi, Jawa Barat</p>
      </div>

      <div className="px-6 grid grid-cols-2 gap-2.5 mb-6">
        {summaryStats.map((s, i) => (
          <div key={i} className="bg-white border border-emerald-200 rounded-2xl p-4">
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <div className="text-zinc-900 font-bold text-lg">{s.value}</div>
            <div className="text-zinc-500 text-[10px]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Stok Alert */}
      {stokGudang.filter(s => s.status !== "Aman").length > 0 && (
        <div className="px-6 mb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-amber-600 font-bold text-sm">Peringatan Stok</span>
            </div>
            {stokGudang.filter(s => s.status !== "Aman").map((s, i) => (
              <div key={i} className="text-amber-700 text-xs mt-1">
                {s.komoditas}: {s.stok} {s.satuan} ({s.status})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pesanan Terbaru */}
      <div className="px-6 mb-6">
        <h3 className="text-zinc-900 font-bold mb-3">Pesanan Terbaru</h3>
        {pesananMasuk.slice(0, 2).map((p) => (
          <div key={p.id} className="flex items-center justify-between py-3 border-b border-emerald-100 last:border-0">
            <div>
              <div className="text-zinc-900 font-medium text-sm">{p.perusahaan}</div>
              <div className="text-zinc-500 text-xs">{p.komoditas} • {p.volume}</div>
            </div>
            <div className="text-right">
              <div className="text-emerald-600 font-bold text-sm">{p.nilai}</div>
              <div className="text-zinc-600 text-[10px]">{p.deadline}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Armada Aktif */}
      <div className="px-6 mb-6">
        <h3 className="text-zinc-900 font-bold mb-3">Armada Aktif</h3>
        {armadaLogistik.filter(a => a.status === "Di Perjalanan").map((a) => (
          <div key={a.id} className="bg-white border border-emerald-200 rounded-2xl p-4 mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-900 font-bold text-sm">{a.id} • {a.driver}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${statusArmadaColors[a.status]}`}>{a.status}</span>
            </div>
            <div className="text-zinc-400 text-xs flex items-center gap-1">
              <Navigation className="w-3 h-3" /> {a.rute}
            </div>
            <div className="text-zinc-500 text-[10px] mt-1">ETA: {a.eta} • {a.muatan}</div>
          </div>
        ))}
      </div>

      {/* Premium Services CTA */}
      <div className="px-6 mb-6">
        <button
          onClick={() => navigate("/premium")}
          className="w-full relative overflow-hidden bg-white border border-amber-300 rounded-2xl p-4 text-left group hover:border-amber-400 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(245,158,11,0.06),transparent_60%)]" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25 flex-shrink-0">
              <Crown className="w-6 h-6 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-zinc-900 font-bold text-sm">Layanan Premium</span>
                <span className="text-[8px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded font-bold">PRO</span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">Data intelijen, kontrak digital, laporan analitik & API</p>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );

  const TabPengadaan = () => (
    <div className="px-6 pt-5">
      <h2 className="text-xl font-bold text-zinc-900 mb-1">Pengadaan</h2>
      <p className="text-zinc-500 text-sm mb-5">Cari petani siap panen & buat kontrak</p>

      <div className="space-y-3">
        {petaniSiapPanen.map((p) => (
          <div key={p.id} className="bg-white border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-zinc-900 font-bold text-sm">{p.nama}</h3>
                <div className="flex items-center gap-1 text-zinc-500 text-xs">
                  <MapPin className="w-3 h-3" /> {p.lokasi}
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                ★ {p.rating}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <div className="text-zinc-500 text-[10px]">Komoditas</div>
                <div className="text-zinc-900 text-sm">{p.komoditas}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Volume</div>
                <div className="text-zinc-900 text-sm">{p.volume}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Harga</div>
                <div className="text-emerald-600 text-sm font-bold">{p.harga}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 h-9 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold rounded-xl">
                Buat Kontrak
              </button>
              <button className="h-9 px-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <Phone className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TabGudang = () => (
    <div className="px-6 pt-5">
      <h2 className="text-xl font-bold text-zinc-900 mb-1">Manajemen Gudang</h2>
      <p className="text-zinc-500 text-sm mb-5">Stok masuk, stok keluar, & peringatan</p>

      {/* Inventory Cards */}
      <div className="space-y-3 mb-6">
        {stokGudang.map((s, i) => {
          const pct = Math.round((s.stok / s.kapasitas) * 100);
          const barColor = s.status === "Kritis" ? "bg-red-500" : s.status === "Menipis" ? "bg-amber-500" : "bg-emerald-500";
          return (
            <div key={i} className="bg-white border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-zinc-900 font-bold text-sm">{s.komoditas}</h3>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium border ${
                  s.status === "Kritis" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                  s.status === "Menipis" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                }`}>{s.status}</span>
              </div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-zinc-900 font-bold text-lg">{s.stok} <span className="text-zinc-500 text-xs font-normal">/ {s.kapasitas} {s.satuan}</span></span>
                <span className="text-zinc-400 text-xs">{pct}%</span>
              </div>
              <div className="w-full bg-emerald-100 rounded-full h-2">
                <div className={`${barColor} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Masuk/Keluar */}
      <h3 className="text-zinc-900 font-bold mb-3">Stok Masuk vs Keluar</h3>
      <div className="bg-white border border-emerald-200 rounded-2xl p-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stokMasukKeluar}>
              <XAxis dataKey="bulan" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #d1fae5", borderRadius: 12, color: "#18181b", fontSize: 12 }} />
              <Bar dataKey="masuk" fill="#10b981" radius={[6, 6, 0, 0]} name="Masuk" />
              <Bar dataKey="keluar" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Keluar" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-500" /><span className="text-zinc-500 text-[10px]">Masuk</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-blue-500" /><span className="text-zinc-500 text-[10px]">Keluar</span></div>
        </div>
      </div>
    </div>
  );

  const TabLogistik = () => (
    <div className="px-6 pt-5">
      <h2 className="text-xl font-bold text-zinc-900 mb-1">Logistik & Rute</h2>
      <p className="text-zinc-500 text-sm mb-5">Pelacakan armada & pengiriman</p>

      <div className="space-y-3">
        {armadaLogistik.map((a) => (
          <div key={a.id} className="bg-white border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  a.status === "Di Perjalanan" ? "bg-blue-500/20" :
                  a.status === "Loading" ? "bg-amber-500/20" :
                  a.status === "Selesai" ? "bg-emerald-500/20" : "bg-emerald-50"
                }`}>
                  <Truck className={`w-4 h-4 ${
                    a.status === "Di Perjalanan" ? "text-blue-400" :
                    a.status === "Loading" ? "text-amber-400" :
                    a.status === "Selesai" ? "text-emerald-400" : "text-zinc-500"
                  }`} />
                </div>
                <div>
                  <span className="text-zinc-900 font-bold text-sm">{a.id}</span>
                  <div className="text-zinc-500 text-[10px]">{a.driver}</div>
                </div>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${statusArmadaColors[a.status]}`}>{a.status}</span>
            </div>

            <div className="bg-emerald-50/80 rounded-xl p-3 mb-2">
              <div className="flex items-center gap-2 text-xs">
                <CircleDot className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <span className="text-zinc-600">{a.rute.split("→")[0].trim()}</span>
                <ArrowRight className="w-3 h-3 text-zinc-600 flex-shrink-0" />
                <span className="text-zinc-900 font-medium">{a.rute.split("→")[1]?.trim()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Muatan: {a.muatan}</span>
              {a.eta !== "-" && <span className="text-blue-400 font-medium">ETA: {a.eta}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TabLaporan = () => (
    <div className="px-6 pt-5">
      <h2 className="text-xl font-bold text-zinc-900 mb-1">Laporan Keuangan</h2>
      <p className="text-zinc-500 text-sm mb-5">Analitik margin & pendapatan</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {[
          { label: "Total Beli", value: laporanKeuangan.totalBeli, color: "text-red-400" },
          { label: "Total Jual", value: laporanKeuangan.totalJual, color: "text-emerald-400" },
          { label: "Biaya Logistik", value: laporanKeuangan.biayaLogistik, color: "text-amber-400" },
          { label: "Profit Bersih", value: laporanKeuangan.profit, color: "text-emerald-400" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-emerald-200 rounded-2xl p-4">
            <div className="text-zinc-500 text-[10px] mb-1">{s.label}</div>
            <div className={`${s.color} font-bold text-sm`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Margin Badge */}
      <div className="bg-emerald-100 border border-emerald-200 rounded-2xl p-5 text-center mb-6">
        <div className="text-zinc-400 text-xs mb-1">Profit Margin</div>
        <div className="text-emerald-600 font-bold text-4xl">{laporanKeuangan.margin}</div>
        <div className="flex items-center justify-center gap-1 text-emerald-600 text-xs mt-1">
          <ArrowUpRight className="w-3.5 h-3.5" /> +2.1% dari bulan lalu
        </div>
      </div>

      {/* Chart */}
      <h3 className="text-zinc-900 font-bold mb-3">Tren Keuangan (Juta Rp)</h3>
      <div className="bg-white border border-emerald-200 rounded-2xl p-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={laporanKeuangan.data}>
              <XAxis dataKey="bulan" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #d1fae5", borderRadius: 12, color: "#18181b", fontSize: 12 }} />
              <Bar dataKey="beli" fill="#ef4444" radius={[4, 4, 0, 0]} name="Beli" />
              <Bar dataKey="jual" fill="#10b981" radius={[4, 4, 0, 0]} name="Jual" />
              <Bar dataKey="profit" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-red-500" /><span className="text-zinc-500 text-[10px]">Beli</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-500" /><span className="text-zinc-500 text-[10px]">Jual</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-blue-500" /><span className="text-zinc-500 text-[10px]">Profit</span></div>
        </div>
      </div>
    </div>
  );

  const renderTab = () => {
    switch (tab) {
      case "pengadaan": return <TabPengadaan />;
      case "gudang": return <TabGudang />;
      case "logistik": return <TabLogistik />;
      case "laporan": return <TabLaporan />;
      default: return <TabBeranda />;
    }
  };

  return (
    <MobileLayout title="Dashboard Distributor" showBottomNav role="distributor">
      {renderTab()}
    </MobileLayout>
  );
}