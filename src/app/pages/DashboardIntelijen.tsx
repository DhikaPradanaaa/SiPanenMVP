import { MobileLayout } from "../components/MobileLayout";
import { Card } from "../components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Package, MapPin } from "lucide-react";

export function DashboardIntelijen() {
  const productionData = [
    { minggu: "Minggu 1", padi: 45, jagung: 32, cabai: 18 },
    { minggu: "Minggu 2", padi: 52, jagung: 38, cabai: 22 },
    { minggu: "Minggu 3", padi: 68, jagung: 45, cabai: 28 },
    { minggu: "Minggu 4", padi: 75, jagung: 50, cabai: 32 },
  ];

  const regionData = [
    { name: "Jawa Barat", value: 35 },
    { name: "Jawa Timur", value: 28 },
    { name: "Jawa Tengah", value: 22 },
    { name: "Lainnya", value: 15 },
  ];

  const COLORS = ["#10b981", "#22c55e", "#4ade80", "#86efac"];

  const upcomingHarvest = [
    { komoditas: "Padi", volume: "156 Ton", wilayah: "Subang, Jawa Barat", minggu: 1 },
    { komoditas: "Jagung", volume: "124 Ton", wilayah: "Kediri, Jawa Timur", minggu: 1 },
    { komoditas: "Cabai", volume: "45 Ton", wilayah: "Garut, Jawa Barat", minggu: 2 },
  ];

  return (
    <MobileLayout title="Intelijen Pasokan" showBackButton={false}>
      <div className="px-6 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-white border-emerald-200 p-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-1">412</div>
            <div className="text-xs text-zinc-400">Total Ton</div>
            <div className="text-xs text-emerald-400 mt-1 font-medium">+12% minggu ini</div>
          </Card>
          <Card className="bg-white border-emerald-200 p-4">
            <div className="text-3xl font-bold text-black mb-1">24</div>
            <div className="text-xs text-zinc-400">Wilayah Aktif</div>
            <div className="text-xs text-emerald-400 mt-1 font-medium">3 provinsi</div>
          </Card>
          <Card className="bg-white border-emerald-200 p-4">
            <div className="text-3xl font-bold text-black mb-1">8</div>
            <div className="text-xs text-zinc-400">Panen Minggu Ini</div>
            <div className="text-xs text-emerald-400 mt-1 font-medium">Siap kontrak</div>
          </Card>
        </div>

        {/* Production Forecast Chart */}
        <Card className="bg-white border-emerald-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-black">Prediksi Produksi 4 Minggu</h3>
          </div>
          <div className="bg-white/80 border border-emerald-200 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={productionData}>
                <defs>
                  <linearGradient id="colorPadi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorJagung" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="minggu" tick={{ fill: '#71717a', fontSize: 11 }} stroke="#3f3f46" />
                <YAxis tick={{ fill: '#71717a', fontSize: 11 }} stroke="#3f3f46" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: '1px solid #3f3f46',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="padi" stroke="#10b981" strokeWidth={3} fill="url(#colorPadi)" name="Padi (Ton)" />
                <Line type="monotone" dataKey="jagung" stroke="#059669" strokeWidth={3} fill="url(#colorJagung)" name="Jagung (Ton)" />
                <Line type="monotone" dataKey="cabai" stroke="#34d399" strokeWidth={3} name="Cabai (Ton)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-5 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
              <span className="text-xs text-zinc-300 font-medium">Padi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-600 rounded-full shadow-lg shadow-emerald-600/50"></div>
              <span className="text-xs text-zinc-300 font-medium">Jagung</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
              <span className="text-xs text-zinc-300 font-medium">Cabai</span>
            </div>
          </div>
        </Card>

        {/* Region Distribution */}
        <Card className="bg-white border-emerald-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-black">Distribusi Produksi per Wilayah</h3>
          </div>
          <div className="bg-white/80 border border-emerald-200 rounded-xl p-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: '1px solid #3f3f46',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {regionData.map((region, index) => (
              <div key={region.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: COLORS[index], boxShadow: `0 0 10px ${COLORS[index]}50` }}></div>
                <span className="text-xs text-zinc-300 font-medium">{region.name} ({region.value}%)</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Harvest */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Package className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-black">Panen Mendatang</h3>
          </div>
          <div className="space-y-3">
            {upcomingHarvest.map((item, index) => (
              <Card key={index} className="bg-white border-emerald-200 p-5 hover:border-emerald-400 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-black mb-2">{item.komoditas}</h4>
                    <p className="text-sm text-zinc-400 mb-3">{item.wilayah}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">{item.volume}</span>
                      <span className="text-xs text-zinc-500">Minggu {item.minggu}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                    item.minggu === 1 
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white" 
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}>
                    {item.minggu === 1 ? "Segera" : "Mendatang"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}