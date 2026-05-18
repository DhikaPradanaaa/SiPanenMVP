import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { MobileLayout } from "../components/MobileLayout";
import {
  Factory, Users, ShieldCheck, LineChart, FileCheck, Star,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Package, AlertTriangle, CheckCircle2, XCircle, Clock,
  Plus, ChevronRight, Calendar, CreditCard, FileText,
  BarChart3, Truck, Eye, RefreshCw, Crown,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area, LineChart as ReLineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

// ── MOCK DATA ──

const summaryStats = [
  { label: "Pemasok Aktif", value: "24", icon: Users, color: "text-emerald-400" },
  { label: "PO Aktif", value: "8", icon: FileCheck, color: "text-blue-400" },
  { label: "Stok Bahan Baku", value: "86%", icon: Package, color: "text-emerald-400" },
  { label: "QC Rate", value: "96.2%", icon: ShieldCheck, color: "text-emerald-400" },
];

const pemasok = [
  { id: 1, nama: "PT Agro Nusantara", rating: 4.8, onTime: "98%", reject: "1.2%", komoditas: ["Padi", "Jagung"], totalTransaksi: "Rp 2.4M", status: "Aktif" },
  { id: 2, nama: "CV Makmur Jaya", rating: 4.5, onTime: "92%", reject: "3.1%", komoditas: ["Padi", "Kedelai"], totalTransaksi: "Rp 1.8M", status: "Aktif" },
  { id: 3, nama: "UD Tani Sejahtera", rating: 4.2, onTime: "88%", reject: "4.5%", komoditas: ["Cabai", "Bawang"], totalTransaksi: "Rp 950Jt", status: "Aktif" },
  { id: 4, nama: "PT Sumber Tani", rating: 3.8, onTime: "82%", reject: "6.8%", komoditas: ["Jagung"], totalTransaksi: "Rp 620Jt", status: "Review" },
];

const purchaseOrders = [
  { id: "PO-2026-001", distributor: "PT Agro Nusantara", komoditas: "Padi", volume: "50 Ton", nilai: "Rp 310.000.000", status: "Proses", deadline: "5 Apr 2026", progress: 65 },
  { id: "PO-2026-002", distributor: "CV Makmur Jaya", komoditas: "Kedelai", volume: "20 Ton", nilai: "Rp 250.000.000", status: "Baru", deadline: "15 Apr 2026", progress: 10 },
  { id: "PO-2026-003", distributor: "PT Agro Nusantara", komoditas: "Jagung", volume: "30 Ton", nilai: "Rp 150.000.000", status: "Selesai", deadline: "20 Mar 2026", progress: 100 },
  { id: "PO-2026-004", distributor: "UD Tani Sejahtera", komoditas: "Cabai", volume: "5 Ton", nilai: "Rp 225.000.000", status: "Proses", deadline: "8 Apr 2026", progress: 40 },
];

const qcResults = [
  { id: "QC-001", po: "PO-2026-001", komoditas: "Padi", kadarAir: "13.2%", standar: "≤14%", kualitas: "Grade A", hasil: "Lolos", tanggal: "24 Mar 2026", volume: "15 Ton" },
  { id: "QC-002", po: "PO-2026-003", komoditas: "Jagung", kadarAir: "12.8%", standar: "≤13%", kualitas: "Grade A", hasil: "Lolos", tanggal: "19 Mar 2026", volume: "30 Ton" },
  { id: "QC-003", po: "PO-2026-004", komoditas: "Cabai", kadarAir: "-", standar: "Fisik", kualitas: "Grade B", hasil: "Reject (15%)", tanggal: "23 Mar 2026", volume: "2 Ton" },
  { id: "QC-004", po: "PO-2026-001", komoditas: "Padi", kadarAir: "15.1%", standar: "≤14%", kualitas: "Reject", hasil: "Reject", tanggal: "22 Mar 2026", volume: "5 Ton" },
];

const prediksiSuplai = [
  { bulan: "Apr", padi: 85, jagung: 72, cabai: 45, kedelai: 60 },
  { bulan: "Mei", padi: 90, jagung: 68, cabai: 55, kedelai: 58 },
  { bulan: "Jun", padi: 78, jagung: 80, cabai: 70, kedelai: 52 },
  { bulan: "Jul", padi: 70, jagung: 85, cabai: 65, kedelai: 48 },
  { bulan: "Ags", padi: 65, jagung: 75, cabai: 50, kedelai: 55 },
];

const kebutuhanProduksi = [
  { komoditas: "Padi", kebutuhan: "120 Ton/bln", stokSekarang: "105 Ton", aman: true, cukupSampai: "28 Apr" },
  { komoditas: "Jagung", kebutuhan: "60 Ton/bln", stokSekarang: "42 Ton", aman: false, cukupSampai: "15 Apr" },
  { komoditas: "Kedelai", kebutuhan: "25 Ton/bln", stokSekarang: "18 Ton", aman: false, cukupSampai: "18 Apr" },
  { komoditas: "Cabai", kebutuhan: "8 Ton/bln", stokSekarang: "6.5 Ton", aman: true, cukupSampai: "22 Apr" },
];

const kontrakPembayaran = [
  { id: "INV-001", distributor: "PT Agro Nusantara", nilai: "Rp 310.000.000", termin: "Net 30", jatuhTempo: "5 Mei 2026", status: "Belum Bayar" },
  { id: "INV-002", distributor: "CV Makmur Jaya", nilai: "Rp 250.000.000", termin: "Net 60", jatuhTempo: "15 Jun 2026", status: "Belum Bayar" },
  { id: "INV-003", distributor: "PT Agro Nusantara", nilai: "Rp 150.000.000", termin: "Net 30", jatuhTempo: "20 Apr 2026", status: "Lunas" },
];

export function DashboardPerusahaan() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = searchParams.get("tab") || "beranda";

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedPemasok, setSelectedPemasok] = useState<any>(null);
  const [orderForm, setOrderForm] = useState({ komoditas: "", volume: "", deadline: "" });

  const TabBeranda = () => (
    <div>
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-2xl font-bold text-zinc-900">PT FoodTech Indonesia</h2>
          <button onClick={() => navigate("/profile?role=perusahaan")} className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
            <Factory className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-zinc-500 text-sm">Jakarta, Indonesia</p>
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

      {/* Kebutuhan Alert */}
      {kebutuhanProduksi.filter(k => !k.aman).length > 0 && (
        <div className="px-6 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-600 font-bold text-sm">Peringatan Stok Bahan Baku</span>
            </div>
            {kebutuhanProduksi.filter(k => !k.aman).map((k, i) => (
              <div key={i} className="text-red-700 text-xs mt-1">
                {k.komoditas}: Stok cukup sampai {k.cukupSampai} ({k.stokSekarang}/{k.kebutuhan})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Pemasok */}
      <div className="px-6 mb-6">
        <h3 className="text-zinc-900 font-bold mb-3">Top Pemasok</h3>
        {pemasok.slice(0, 3).map((p) => (
          <div key={p.id} className="flex items-center justify-between py-3 border-b border-emerald-100 last:border-0">
            <div>
              <div className="text-zinc-900 font-medium text-sm">{p.nama}</div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="text-amber-400">★ {p.rating}</span>
                <span>On-time: {p.onTime}</span>
              </div>
            </div>
            <span className="text-emerald-600 font-bold text-xs">{p.totalTransaksi}</span>
          </div>
        ))}
      </div>

      {/* Invoice Pending */}
      <div className="px-6 mb-6">
        <h3 className="text-zinc-900 font-bold mb-3">Invoice Pending</h3>
        {kontrakPembayaran.filter(k => k.status !== "Lunas").map((k) => (
          <div key={k.id} className="flex items-center justify-between py-3 border-b border-emerald-100 last:border-0">
            <div>
              <div className="text-zinc-900 font-medium text-sm">{k.distributor}</div>
              <div className="text-zinc-500 text-xs">{k.termin} • {k.jatuhTempo}</div>
            </div>
            <div className="text-red-400 font-bold text-sm">{k.nilai}</div>
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
              <p className="text-zinc-500 text-xs leading-relaxed">Laporan analitik, API integration & kontrak digital</p>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );

  const TabPemasok = () => (
    <div className="px-6 pt-5">
      <h2 className="text-xl font-bold text-zinc-900 mb-1">Manajemen Pemasok</h2>
      <p className="text-zinc-500 text-sm mb-5">Rating kinerja distributor terdaftar</p>

      <div className="space-y-3">
        {pemasok.map((p) => (
          <div key={p.id} className="bg-white border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-zinc-900 font-bold text-sm">{p.nama}</h3>
              <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${
                p.status === "Aktif" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"
              }`}>{p.status}</span>
            </div>

            {/* Rating Bar */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.floor(p.rating) ? "text-amber-400 fill-amber-400" : "text-zinc-700"}`} />
                ))}
              </div>
              <span className="text-zinc-900 font-bold text-sm">{p.rating}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
                <div className="text-zinc-500 text-[9px]">On-Time</div>
                <div className="text-emerald-400 font-bold text-sm">{p.onTime}</div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
                <div className="text-zinc-500 text-[9px]">Reject Rate</div>
                <div className={`font-bold text-sm ${parseFloat(p.reject) > 5 ? "text-red-400" : "text-emerald-400"}`}>{p.reject}</div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
                <div className="text-zinc-500 text-[9px]">Total</div>
                <div className="text-zinc-900 font-bold text-sm">{p.totalTransaksi}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {p.komoditas.map((k, i) => (
                <span key={i} className="text-[10px] px-2 py-1 bg-emerald-50 rounded-lg text-zinc-500">{k}</span>
              ))}
            </div>

            {/* Action */}
            <div className="mt-4 pt-3 border-t border-emerald-100 flex justify-end">
              <button 
                onClick={() => { setSelectedPemasok(p); setShowOrderModal(true); }}
                className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-colors"
              >
                Buat Order / PO
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TabPO = () => (
    <div className="px-6 pt-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Purchase Orders</h2>
          <p className="text-zinc-500 text-sm">Kelola PO massal</p>
        </div>
        <button 
          onClick={() => navigate("?tab=pemasok")}
          className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="space-y-3">
        {purchaseOrders.map((po) => (
          <div key={po.id} className="bg-white border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-600 font-bold text-xs">{po.id}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${
                po.status === "Selesai" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                po.status === "Proses" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                "bg-amber-500/20 text-amber-400 border-amber-500/30"
              }`}>{po.status}</span>
            </div>
            <h3 className="text-zinc-900 font-bold text-sm mb-1">{po.distributor}</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <div className="text-zinc-500 text-[10px]">Komoditas</div>
                <div className="text-zinc-900 text-sm">{po.komoditas}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Volume</div>
                <div className="text-zinc-900 text-sm">{po.volume}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Deadline</div>
                <div className="text-zinc-900 text-sm">{po.deadline}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-500 text-xs">Progress</span>
              <span className="text-zinc-900 text-xs font-bold">{po.progress}%</span>
            </div>
            <div className="w-full bg-emerald-100 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all ${po.progress === 100 ? "bg-emerald-500" : "bg-blue-500"}`} style={{ width: `${po.progress}%` }} />
            </div>
            <div className="text-emerald-600 font-bold text-sm mt-3">{po.nilai}</div>
          </div>
        ))}
      </div>

      {/* Pembayaran */}
      <h3 className="text-zinc-900 font-bold mt-8 mb-3">Kontrak & Pembayaran</h3>
      <div className="space-y-3">
        {kontrakPembayaran.map((k) => (
          <div key={k.id} className="bg-white border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-xs font-medium">{k.id}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${
                k.status === "Lunas" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"
              }`}>{k.status}</span>
            </div>
            <div className="text-zinc-900 font-bold text-sm">{k.distributor}</div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-zinc-500 text-xs">{k.termin} • {k.jatuhTempo}</div>
              <div className={`font-bold text-sm ${k.status === "Lunas" ? "text-emerald-400" : "text-red-400"}`}>{k.nilai}</div>
            </div>
            {k.status !== "Lunas" && (
              <button className="w-full h-9 mt-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold rounded-xl">
                Proses Pembayaran
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const TabQC = () => (
    <div className="px-6 pt-5">
      <h2 className="text-xl font-bold text-zinc-900 mb-1">Kontrol Kualitas</h2>
      <p className="text-zinc-500 text-sm mb-5">Hasil uji kualitas bahan baku</p>

      {/* QC Summary */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 text-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <div className="text-emerald-400 font-bold text-lg">{qcResults.filter(q => q.hasil === "Lolos").length}</div>
          <div className="text-zinc-500 text-[9px]">Lolos</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3.5 text-center">
          <XCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
          <div className="text-red-400 font-bold text-lg">{qcResults.filter(q => q.hasil.includes("Reject")).length}</div>
          <div className="text-zinc-500 text-[9px]">Reject</div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-3.5 text-center">
          <ShieldCheck className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <div className="text-blue-400 font-bold text-lg">96.2%</div>
          <div className="text-zinc-500 text-[9px]">Pass Rate</div>
        </div>
      </div>

      <div className="space-y-3">
        {qcResults.map((q) => {
          const isReject = q.hasil.includes("Reject");
          return (
            <div key={q.id} className={`bg-white border rounded-2xl p-4 ${isReject ? "border-red-300" : "border-emerald-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-medium">{q.id} • {q.po}</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${
                  isReject ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                }`}>{q.hasil}</span>
              </div>
              <h3 className="text-zinc-900 font-bold text-sm mb-2">{q.komoditas} • {q.volume}</h3>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-zinc-500 text-[9px]">Kadar Air</div>
                  <div className={`text-sm font-medium ${isReject && q.kadarAir !== "-" ? "text-red-400" : "text-zinc-900"}`}>{q.kadarAir}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[9px]">Standar</div>
                  <div className="text-zinc-900 text-sm">{q.standar}</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[9px]">Grade</div>
                  <div className={`text-sm font-medium ${q.kualitas === "Reject" ? "text-red-400" : "text-emerald-400"}`}>{q.kualitas}</div>
                </div>
              </div>
              {isReject && (
                <button className="w-full h-9 mt-3 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" /> Proses Retur
                </button>
              )}
              <div className="text-zinc-600 text-[10px] mt-2">{q.tanggal}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const TabPrediksi = () => (
    <div className="px-6 pt-5">
      <h2 className="text-xl font-bold text-zinc-900 mb-1">Prediksi Suplai</h2>
      <p className="text-zinc-500 text-sm mb-5">Forecasting ketersediaan bahan baku</p>

      {/* Kebutuhan Produksi */}
      <h3 className="text-zinc-900 font-bold mb-3">Kebutuhan Produksi</h3>
      <div className="space-y-3 mb-6">
        {kebutuhanProduksi.map((k, i) => (
          <div key={i} className={`bg-white border rounded-2xl p-4 ${k.aman ? "border-emerald-200" : "border-red-300"}`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-zinc-900 font-bold text-sm">{k.komoditas}</h4>
              <span className={`text-[9px] px-2 py-0.5 rounded-full border font-medium ${
                k.aman ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"
              }`}>{k.aman ? "Aman" : "Kritis"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-zinc-500 text-[9px]">Kebutuhan</div>
                <div className="text-zinc-900 text-sm">{k.kebutuhan}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[9px]">Stok</div>
                <div className={`text-sm font-bold ${k.aman ? "text-emerald-400" : "text-red-400"}`}>{k.stokSekarang}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[9px]">Cukup Sampai</div>
                <div className="text-zinc-900 text-sm">{k.cukupSampai}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Forecast Chart */}
      <h3 className="text-zinc-900 font-bold mb-3">Tren Ketersediaan Suplai (%)</h3>
      <div className="bg-white border border-emerald-200 rounded-2xl p-4 mb-6">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={prediksiSuplai}>
              <XAxis dataKey="bulan" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #d1fae5", borderRadius: 12, color: "#18181b", fontSize: 12 }} />
              <Line type="monotone" dataKey="padi" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} name="Padi" />
              <Line type="monotone" dataKey="jagung" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: "#3b82f6" }} name="Jagung" />
              <Line type="monotone" dataKey="cabai" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: "#ef4444" }} name="Cabai" />
              <Line type="monotone" dataKey="kedelai" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} name="Kedelai" />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
          {[
            { color: "bg-emerald-500", label: "Padi" },
            { color: "bg-blue-500", label: "Jagung" },
            { color: "bg-red-500", label: "Cabai" },
            { color: "bg-amber-500", label: "Kedelai" },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded ${l.color}`} />
              <span className="text-zinc-500 text-[10px]">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <LineChart className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-600 font-bold text-sm">AI Insight</span>
        </div>
        <p className="text-emerald-800 text-xs leading-relaxed">
          Berdasarkan tren saat ini, stok <strong>Jagung</strong> dan <strong>Kedelai</strong> diprediksi akan mengalami penurunan signifikan di bulan Juli-Agustus. Disarankan untuk membuat PO tambahan sebelum 15 April untuk mengamankan suplai.
        </p>
      </div>
    </div>
  );

  const renderTab = () => {
    switch (tab) {
      case "pemasok": return <TabPemasok />;
      case "po": return <TabPO />;
      case "qc": return <TabQC />;
      case "prediksi": return <TabPrediksi />;
      default: return <TabBeranda />;
    }
  };

  return (
    <MobileLayout title="Dashboard Perusahaan" showBottomNav role="perusahaan">
      {renderTab()}

      {/* Order Modal */}
      {showOrderModal && selectedPemasok && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Buat Purchase Order</h3>
            <p className="text-sm text-zinc-500 mb-5">Ke: {selectedPemasok.nama}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Komoditas</label>
                <select 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  value={orderForm.komoditas}
                  onChange={(e) => setOrderForm({...orderForm, komoditas: e.target.value})}
                >
                  <option value="">Pilih Komoditas</option>
                  {selectedPemasok.komoditas.map((k: string) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Volume (Ton)</label>
                <input 
                  type="number" 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: 10"
                  value={orderForm.volume}
                  onChange={(e) => setOrderForm({...orderForm, volume: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Deadline Pengiriman</label>
                <input 
                  type="date" 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
                  value={orderForm.deadline}
                  onChange={(e) => setOrderForm({...orderForm, deadline: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowOrderModal(false)}
                className="flex-1 py-3 bg-zinc-100 text-zinc-600 font-bold rounded-xl text-sm"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  alert("Order PO berhasil dikirim ke distributor!");
                  setShowOrderModal(false);
                  setOrderForm({komoditas: "", volume: "", deadline: ""});
                }}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/30"
              >
                Kirim PO
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
}