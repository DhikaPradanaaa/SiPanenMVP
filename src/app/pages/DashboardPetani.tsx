import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { MobileLayout } from "../components/MobileLayout";
import {
  Leaf, TrendingUp, TrendingDown, CloudSun, CloudRain, Sun, Droplets,
  Plus, Package, Calendar, ArrowUpRight, ArrowDownRight, CheckCircle2,
  Clock, Truck, CreditCard, BookOpen, ChevronRight, Eye, Minus,
  Sparkles, ThermometerSun, Wind, Brain, MapPin, Users,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";

// ── MOCK DATA ──

const hargaKomoditas = [
  { nama: "Padi (Gabah)", harga: "Rp 6.200/kg", trend: "+3.2%", up: true, data: [{ d: "Sen", v: 5900 }, { d: "Sel", v: 6000 }, { d: "Rab", v: 5950 }, { d: "Kam", v: 6100 }, { d: "Jum", v: 6150 }, { d: "Sab", v: 6200 }] },
  { nama: "Jagung", harga: "Rp 4.800/kg", trend: "-1.5%", up: false, data: [{ d: "Sen", v: 5000 }, { d: "Sel", v: 4950 }, { d: "Rab", v: 4900 }, { d: "Kam", v: 4850 }, { d: "Jum", v: 4820 }, { d: "Sab", v: 4800 }] },
  { nama: "Cabai Merah", harga: "Rp 45.000/kg", trend: "+8.7%", up: true, data: [{ d: "Sen", v: 38000 }, { d: "Sel", v: 40000 }, { d: "Rab", v: 41000 }, { d: "Kam", v: 42000 }, { d: "Jum", v: 44000 }, { d: "Sab", v: 45000 }] },
  { nama: "Bawang Merah", harga: "Rp 35.000/kg", trend: "+2.1%", up: true, data: [{ d: "Sen", v: 33000 }, { d: "Sel", v: 33500 }, { d: "Rab", v: 34000 }, { d: "Kam", v: 34200 }, { d: "Jum", v: 34800 }, { d: "Sab", v: 35000 }] },
  { nama: "Kedelai", harga: "Rp 12.500/kg", trend: "-0.8%", up: false, data: [{ d: "Sen", v: 12800 }, { d: "Sel", v: 12700 }, { d: "Rab", v: 12650 }, { d: "Kam", v: 12600 }, { d: "Jum", v: 12550 }, { d: "Sab", v: 12500 }] },
];

const stokPanen = [
  { id: 1, komoditas: "Padi", luas: "2.5 Ha", estimasiPanen: "28 Mar 2026", volume: "8.5 Ton", status: "Siap Panen", lokasi: "Blok A – Desa Sukamaju" },
  { id: 2, komoditas: "Jagung", luas: "1.8 Ha", estimasiPanen: "15 Apr 2026", volume: "5.2 Ton", status: "Masa Tanam", lokasi: "Blok B – Desa Ciawi" },
  { id: 3, komoditas: "Cabai", luas: "0.5 Ha", estimasiPanen: "20 Apr 2026", volume: "1.8 Ton", status: "Masa Tanam", lokasi: "Blok C – Desa Wanasari" },
];

const marketplaceListings = [
  { id: 1, komoditas: "Padi", petani: "Pak Suharto", lokasi: "Subang", volume: "8.5 Ton", harga: "Rp 6.100/kg", rating: 4.8, image: "https://images.unsplash.com/photo-1730127564699-9673611b2398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcGFkZHklMjBmaWVsZCUyMGZhcm18ZW58MXx8fHwxNzczMTI0MTMzfDA&ixlib=rb-4.1.0&q=80&w=400" },
  { id: 2, komoditas: "Jagung", petani: "Bu Siti", lokasi: "Karawang", volume: "12 Ton", harga: "Rp 4.700/kg", rating: 4.6, image: "https://images.unsplash.com/photo-1649251037465-72c9d378acb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JuJTIwZmllbGQlMjBoYXJ2ZXN0fGVufDF8fHx8MTc3MzE5NzIwMHww&ixlib=rb-4.1.0&q=80&w=400" },
  { id: 3, komoditas: "Cabai Merah", petani: "Pak Agus", lokasi: "Garut", volume: "2.5 Ton", harga: "Rp 44.000/kg", rating: 4.5, image: "https://images.unsplash.com/photo-1771684512112-77cdac82a1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBmYXJtJTIwcGxhbnRhdGlvbnxlbnwxfHx8fDE3NzMxOTcyMDF8MA&ixlib=rb-4.1.0&q=80&w=400" },
];

const myListings = [
  { id: "m1", komoditas: "Padi Unggul", volume: "5 Ton", harga: "Rp 6.200/kg", status: "Tersedia", views: 24 }
];

const tawaranMasuk = [
  { id: "t1", distributor: "PT Agro Nusantara", komoditas: "Padi Unggul", volume: "2 Ton", harga: "Rp 6.300/kg", status: "menunggu", tanggal: "2 Jam yang lalu" },
  { id: "t2", distributor: "CV Makmur Jaya", komoditas: "Padi Unggul", volume: "3 Ton", harga: "Rp 6.100/kg", status: "menunggu", tanggal: "1 Hari yang lalu" },
];

const cuaca = [
  { hari: "Hari Ini", icon: Sun, suhu: "32°C", kondisi: "Cerah", kelembaban: "65%", angin: "12 km/j" },
  { hari: "Besok", icon: CloudSun, suhu: "30°C", kondisi: "Berawan", kelembaban: "72%", angin: "15 km/j" },
  { hari: "Lusa", icon: CloudRain, suhu: "27°C", kondisi: "Hujan Ringan", kelembaban: "85%", angin: "18 km/j" },
];

const tips = [
  "Waktu terbaik menyiram padi: pagi hari sebelum jam 9.",
  "Gunakan pupuk organik untuk meningkatkan kesuburan tanah.",
  "Pantau hama wereng saat musim hujan memasuki fase akhir.",
];

const statusColors: Record<string, string> = {
  "Dibayar": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Diambil": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Uji Kualitas": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Menunggu": "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  "Siap Panen": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Masa Tanam": "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export function DashboardPetani() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tab = searchParams.get("tab") || "beranda";
  const [showAddPanen, setShowAddPanen] = useState(false);
  const [showAddMarketplace, setShowAddMarketplace] = useState(false);
  const [marketTab, setMarketTab] = useState<"katalog" | "saya" | "tawaran">("katalog");
  
  const [formData, setFormData] = useState({
    komoditas: "",
    tanggalTanam: "",
    luasLahan: "",
    lokasi: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSavePanen = async () => {
    if (!formData.komoditas || !formData.tanggalTanam || !formData.luasLahan || !formData.lokasi) {
      alert("Mohon lengkapi semua data lahan (Komoditas, Luas, Tanggal, Lokasi)!");
      return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Silakan login terlebih dahulu");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5001/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId })
      });
      if (res.ok) {
        navigate("/dashboard/petani/ai");
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menyimpan data");
      }
    } catch (err) {
      alert("Gagal menghubungi server");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── BERANDA TAB ───
  const TabBeranda = () => (
    <div>
      {/* Welcome Header */}
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-2xl font-bold text-zinc-900">Halo, Pak Tani!</h2>
          <button onClick={() => navigate("/profile?role=petani")} className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
            <Leaf className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-zinc-500 text-sm">Subang, Jawa Barat</p>
      </div>

      {/* Quick Stats */}
      <div className="px-6 grid grid-cols-3 gap-2.5 mb-6">
        {[
          { label: "Lahan Aktif", value: "4.8 Ha", icon: Leaf },
          { label: "Siap Panen", value: "1", icon: Package },
          { label: "Transaksi", value: "3", icon: CreditCard },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-emerald-200 rounded-2xl p-3.5 text-center">
            <s.icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <div className="text-zinc-900 font-bold text-lg">{s.value}</div>
            <div className="text-zinc-500 text-[10px]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* AI Assistant CTA */}
      <div className="px-6 mb-4">
        <button
          onClick={() => navigate("/dashboard/petani/ai")}
          className="w-full relative overflow-hidden bg-white border border-emerald-300 rounded-2xl p-4 text-left group hover:border-emerald-400 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.12),transparent_60%)]" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-zinc-900 font-bold text-sm">AI Asisten Tani</span>
                <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-bold">BARU</span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">Prediksi panen, monitoring pertumbuhan, cuaca & insight pasar</p>
            </div>
            <ChevronRight className="w-5 h-5 text-emerald-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Komunitas Petani CTA */}
      <div className="px-6 mb-6">
        <button
          onClick={() => navigate("/komunitas")}
          className="w-full relative overflow-hidden bg-white border border-blue-200 rounded-2xl p-4 text-left group hover:border-blue-300 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(59,130,246,0.08),transparent_60%)]" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-zinc-900 font-bold text-sm">Komunitas Petani</span>
                <span className="text-[8px] px-1.5 py-0.5 bg-blue-500/20 text-blue-500 rounded font-bold">1.2K Anggota</span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">Diskusi, tips bertani & berbagi pengalaman sesama petani</p>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Weather */}
      <div className="px-6 mb-6">
        <h3 className="text-zinc-900 font-bold mb-3 flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-emerald-600" /> Cuaca Hari Ini
        </h3>
        <div className="flex gap-2.5">
          {cuaca.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className={`flex-1 rounded-2xl p-3.5 border text-center ${i === 0 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white border-emerald-200"}`}>
                <Icon className={`w-7 h-7 mx-auto mb-2 ${i === 0 ? "text-emerald-600" : "text-zinc-400"}`} />
                <div className="text-zinc-900 font-bold text-sm">{c.suhu}</div>
                <div className="text-zinc-500 text-[10px]">{c.kondisi}</div>
                <div className="text-[9px] text-zinc-600 mt-1">{c.hari}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Harga Terpopuler */}
      <div className="px-6 mb-6">
        <h3 className="text-zinc-900 font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" /> Harga Pasar
        </h3>
        {hargaKomoditas.slice(0, 3).map((k, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-emerald-100 last:border-0">
            <div>
              <div className="text-zinc-900 font-medium text-sm">{k.nama}</div>
              <div className="text-zinc-500 text-xs">{k.harga}</div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold ${k.up ? "text-emerald-600" : "text-red-600"}`}>
              {k.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {k.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="px-6 mb-6">
        <h3 className="text-zinc-900 font-bold mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600" /> Tips Pertanian
        </h3>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-700 leading-relaxed">{tips[Math.floor(Math.random() * tips.length)]}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── HARGA PASAR TAB ───
  const TabHarga = () => (
    <div className="px-6 pt-5">
      <h2 className="text-xl font-bold text-zinc-900 mb-1">Harga Pasar</h2>
      <p className="text-zinc-500 text-sm mb-5">Update harga komoditas hari ini</p>

      <div className="space-y-4">
        {hargaKomoditas.map((k, i) => (
          <div key={i} className="bg-white border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-zinc-900 font-bold">{k.nama}</div>
                <div className="text-emerald-600 font-bold text-lg">{k.harga}</div>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${k.up ? "bg-emerald-500/20 text-emerald-600" : "bg-red-500/20 text-red-600"}`}>
                {k.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {k.trend}
              </div>
            </div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={k.data}>
                  <defs>
                    <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={k.up ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={k.up ? "#10b981" : "#ef4444"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={k.up ? "#10b981" : "#ef4444"} fill={`url(#grad-${i})`} strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── MANAJEMEN PANEN TAB ───
  const TabPanen = () => (
    <div className="px-6 pt-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Panen & Stok</h2>
          <p className="text-zinc-500 text-sm">Kelola data panen Anda</p>
        </div>
        <button onClick={() => setShowAddPanen(!showAddPanen)} className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {showAddPanen && (
        <div className="bg-white border border-emerald-300 rounded-2xl p-5 mb-5">
          <h3 className="text-zinc-900 font-bold mb-4">Tambah Data Panen (AI)</h3>
          <div className="space-y-3">
            <input 
              placeholder="Komoditas (Padi, Jagung, Cabai, dll)" 
              value={formData.komoditas}
              onChange={(e) => setFormData({ ...formData, komoditas: e.target.value })}
              className="w-full h-12 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500" 
            />
            <input 
              placeholder="Luas (Ha)" 
              type="number"
              step="0.1"
              value={formData.luasLahan}
              onChange={(e) => setFormData({ ...formData, luasLahan: e.target.value })}
              className="w-full h-12 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500" 
            />
            <input 
              type="date" 
              value={formData.tanggalTanam}
              onChange={(e) => setFormData({ ...formData, tanggalTanam: e.target.value })}
              className="w-full h-12 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-emerald-500" 
            />
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
              <input
                placeholder="Lokasi lahan (contoh: Blok A – Desa Sukamaju)"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="w-full h-12 pl-10 pr-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <p className="text-xs text-zinc-500 text-center mb-1">Volume akan diprediksi otomatis oleh AI</p>
            <button 
              onClick={handleSavePanen}
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan & Analisis AI"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {stokPanen.map((s) => (
          <div key={s.id} className="bg-white border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-zinc-900 font-bold">{s.komoditas}</h3>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium border ${statusColors[s.status]}`}>{s.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2.5">
              <div>
                <div className="text-zinc-500 text-[10px]">Luas</div>
                <div className="text-zinc-900 text-sm font-medium">{s.luas}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Estimasi</div>
                <div className="text-zinc-900 text-sm font-medium">{s.estimasiPanen}</div>
              </div>
              <div>
                <div className="text-zinc-500 text-[10px]">Volume</div>
                <div className="text-emerald-600 text-sm font-bold">{s.volume}</div>
              </div>
            </div>
            {s.lokasi && (
              <div className="flex items-center gap-1.5 pt-2 border-t border-emerald-100">
                <MapPin className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span className="text-zinc-500 text-[11px]">{s.lokasi}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ─── MARKETPLACE TAB ───
  const TabMarketplace = () => (
    <div className="px-6 pt-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Marketplace</h2>
          <p className="text-zinc-500 text-sm">Jual komoditas & lihat katalog</p>
        </div>
        <button 
          onClick={() => setShowAddMarketplace(!showAddMarketplace)} 
          className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {showAddMarketplace && (
        <div className="bg-white border border-emerald-300 rounded-2xl p-5 mb-5">
          <h3 className="text-zinc-900 font-bold mb-4">Posting Komoditas Baru</h3>
          <div className="space-y-3">
            <input 
              placeholder="Nama Komoditas (misal: Padi IR64)" 
              className="w-full h-12 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500" 
            />
            <div className="flex gap-2">
              <input 
                placeholder="Volume (Ton)" 
                type="number"
                className="w-1/2 h-12 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500" 
              />
              <input 
                placeholder="Harga (Rp/kg)" 
                type="number"
                className="w-1/2 h-12 px-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500" 
              />
            </div>
            <textarea
              placeholder="Deskripsi singkat & detail lokasi..."
              className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500 h-24 resize-none"
            />
            <div className="w-full h-24 bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-xl flex flex-col items-center justify-center text-emerald-500 cursor-pointer hover:bg-emerald-100 transition-colors">
              <span className="text-xs font-bold mt-1">Upload Foto Komoditas</span>
            </div>
            <button 
              onClick={() => {
                alert("Produk berhasil diposting!");
                setShowAddMarketplace(false);
              }}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 mt-2"
            >
              Posting Sekarang
            </button>
          </div>
        </div>
      )}

      {/* Tabs Switcher for Marketplace */}
      <div className="flex bg-white border border-emerald-200 rounded-xl p-1 mb-5">
        <button
          onClick={() => setMarketTab("katalog")}
          className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
            marketTab === "katalog" ? "bg-emerald-500 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Katalog Global
        </button>
        <button
          onClick={() => setMarketTab("saya")}
          className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
            marketTab === "saya" ? "bg-emerald-500 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Tawaran Saya
        </button>
        <button
          onClick={() => setMarketTab("tawaran")}
          className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
            marketTab === "tawaran" ? "bg-emerald-500 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          Tawaran Masuk <span className="ml-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[8px]">2</span>
        </button>
      </div>

      <div className="space-y-4">
        {marketTab === "katalog" && marketplaceListings.map((p) => (
            <div key={p.id} className="bg-white border border-emerald-200 rounded-2xl overflow-hidden hover:border-emerald-400 transition-colors">
              <div className="h-36 w-full relative">
                <img src={p.image} alt={p.komoditas} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-zinc-900 border border-emerald-200/50">
                  {p.komoditas}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md">
                  ★ {p.rating}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-zinc-900 font-bold text-sm">{p.petani}</h3>
                    <div className="flex items-center gap-1 text-zinc-500 text-xs mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-500" /> {p.lokasi}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-600 font-bold">{p.harga}</div>
                    <div className="text-zinc-500 text-[10px] mt-0.5">Est: {p.volume}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {marketTab === "saya" && myListings.map((m) => (
            <div key={m.id} className="bg-white border border-emerald-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-zinc-900 font-bold text-sm">{m.komoditas}</h3>
                <span className="text-[10px] px-2 py-1 bg-emerald-500/10 text-emerald-600 font-bold rounded-md">
                  {m.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-600 mb-3">
                <span>{m.volume}</span>
                <span className="font-bold text-emerald-600 text-sm">{m.harga}</span>
              </div>
              <div className="pt-3 border-t border-emerald-100 flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {m.views} dilihat
                </span>
                <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700">
                  Edit Detail
                </button>
              </div>
            </div>
          ))}

        {marketTab === "tawaran" && tawaranMasuk.map((t) => (
            <div key={t.id} className="bg-white border border-emerald-200 rounded-2xl p-4 hover:border-emerald-400 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-zinc-900 font-bold text-sm">{t.distributor}</h3>
                  <div className="text-zinc-500 text-[10px] mt-0.5">{t.tanggal}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-600 font-bold text-sm">{t.harga}</div>
                  <div className="text-zinc-500 text-[10px] mt-0.5">Permintaan: {t.volume}</div>
                </div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 mb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-500" />
                  <span className="text-zinc-700 text-xs font-medium">Tawaran untuk: {t.komoditas}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => alert(`Tawaran dari ${t.distributor} diterima. Kontrak akan dibuat.`)}
                  className="flex-1 h-10 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Terima Tawaran
                </button>
                <button 
                  onClick={() => alert(`Tawaran dari ${t.distributor} ditolak.`)}
                  className="flex-1 h-10 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors"
                >
                  Tolak
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  // ─── TRANSAKSI TAB ───
  const TabTransaksi = () => (
    <div className="px-6 pt-5">
      <h2 className="text-xl font-bold text-zinc-900 mb-1">Status Transaksi</h2>
      <p className="text-zinc-500 text-sm mb-5">Pelacakan penjualan & pembayaran</p>

      <div className="space-y-3">
        {transaksi.map((t) => (
          <div key={t.id} className="bg-white border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-zinc-900 font-bold text-sm">{t.distributor}</h3>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium border ${statusColors[t.status]}`}>{t.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-zinc-500 text-xs">{t.komoditas} • {t.volume}</div>
                <div className="text-zinc-600 text-[10px] mt-1">{t.tanggal}</div>
              </div>
              <div className="text-emerald-600 font-bold text-sm">{t.total}</div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-1.5">
              {["Menunggu", "Diambil", "Uji Kualitas", "Dibayar"].map((s, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full ${
                  ["Dibayar"].includes(t.status) || (t.status === "Uji Kualitas" && i < 3) || (t.status === "Diambil" && i < 2) || (t.status === "Menunggu" && i < 1)
                    ? "bg-emerald-500"
                    : "bg-emerald-100"
                }`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTab = () => {
    switch (tab) {
      case "harga": return <TabHarga />;
      case "panen": return <TabPanen />;
      case "marketplace": return <TabMarketplace />;
      case "transaksi": return <TabTransaksi />;
      default: return <TabBeranda />;
    }
  };

  return (
    <MobileLayout title="Dashboard Petani" showBottomNav role="petani">
      {renderTab()}
    </MobileLayout>
  );
}