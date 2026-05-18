import { Sprout, TrendingUp, Calendar, Package, Plus, Map, BarChart2, Sparkles } from "lucide-react";


export function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: "Wilayah Masa Tanam", value: "24", icon: Map, gradient: "from-emerald-500 to-emerald-600" },
    { label: "Prediksi Panen (7 hari)", value: "8", icon: Calendar, gradient: "from-emerald-400 to-emerald-500" },
    { label: "Total Estimasi Produksi", value: "156 Ton", icon: Package, gradient: "from-emerald-600 to-emerald-700" },
  ];

  const recentActivities = [
    {
      id: 1,
      komoditas: "Padi",
      lokasi: "Subang, Jawa Barat",
      status: "Masa Tanam",
      estimasiPanen: "15 Mei 2026",
      image: "https://images.unsplash.com/photo-1730127564699-9673611b2398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcGFkZHklMjBmaWVsZCUyMGZhcm18ZW58MXx8fHwxNzczMTI0MTMzfDA&ixlib=rb-4.1.0&q=80&w=400"
    },
    {
      id: 2,
      komoditas: "Jagung",
      lokasi: "Kediri, Jawa Timur",
      status: "Siap Panen",
      estimasiPanen: "18 Maret 2026",
      image: "https://images.unsplash.com/photo-1649251037465-72c9d378acb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JuJTIwZmllbGQlMjBoYXJ2ZXN0fGVufDF8fHx8MTc3MzE5NzIwMHww&ixlib=rb-4.1.0&q=80&w=400"
    },
    {
      id: 3,
      komoditas: "Cabai",
      lokasi: "Garut, Jawa Barat",
      status: "Masa Tanam",
      estimasiPanen: "20 April 2026",
      image: "https://images.unsplash.com/photo-1771684512112-77cdac82a1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBmYXJtJTIwcGxhbnRhdGlvbnxlbnwxfHx8fDE3NzMxOTcyMDF8MA&ixlib=rb-4.1.0&q=80&w=400"
    },
  ];

  return (
    <MobileLayout showBottomNav>
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 px-6 pt-8 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.15),transparent_50%)]"></div>
        
        <div className="relative flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">SiPanen</h1>
            <p className="text-emerald-100 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Selamat datang kembali!
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center">
            <img src="/logo.png" alt="SiPanen" className="w-14 h-14 object-contain" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="relative grid grid-cols-3 gap-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-emerald-100 leading-tight">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-6">
        <h2 className="font-bold text-zinc-900 mb-4 text-lg">Aksi Cepat</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/input-data")}
            className="flex flex-col items-center gap-3 p-5 bg-white border border-emerald-200 rounded-2xl hover:border-emerald-400 transition-all duration-200 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-zinc-600 group-hover:text-zinc-900 transition-colors">Input Data Tanam</span>
          </button>

          <button
            onClick={() => navigate("/prediksi-panen")}
            className="flex flex-col items-center gap-3 p-5 bg-white border border-emerald-200 rounded-2xl hover:border-emerald-400 transition-all duration-200 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <TrendingUp className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-zinc-600 group-hover:text-zinc-900 transition-colors">Prediksi Panen</span>
          </button>

          <button
            onClick={() => navigate("/peta-prediksi")}
            className="flex flex-col items-center gap-3 p-5 bg-white border border-emerald-200 rounded-2xl hover:border-emerald-400 transition-all duration-200 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <Map className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-zinc-600 group-hover:text-zinc-900 transition-colors">Peta Prediksi</span>
          </button>

          <button
            onClick={() => navigate("/intelijen-pasokan")}
            className="flex flex-col items-center gap-3 p-5 bg-white border border-emerald-200 rounded-2xl hover:border-emerald-400 transition-all duration-200 group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
              <BarChart2 className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-zinc-600 group-hover:text-zinc-900 transition-colors">Intelijen Pasokan</span>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="px-6 pb-6">
        <h2 className="font-bold text-zinc-900 mb-4 text-lg">Aktivitas Terbaru</h2>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <Card key={activity.id} className="bg-white border-emerald-200 p-4 hover:border-emerald-400 transition-all duration-200">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <ImageWithFallback
                    src={activity.image}
                    alt={activity.komoditas}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-zinc-900 mb-1">{activity.komoditas}</h3>
                  <p className="text-sm text-zinc-500 mb-3">{activity.lokasi}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                      activity.status === "Siap Panen" 
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white" 
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {activity.status}
                    </span>
                    <span className="text-xs text-zinc-500">{activity.estimasiPanen}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}