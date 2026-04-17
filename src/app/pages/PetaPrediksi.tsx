import { MobileLayout } from "../components/MobileLayout";
import { Card } from "../components/ui/card";
import { MapPin, TrendingUp, AlertTriangle, Map } from "lucide-react";

export function PetaPrediksi() {
  const regions = [
    { id: 1, name: "Subang", province: "Jawa Barat", lat: 30, lng: 25, volume: "High", days: 65, color: "emerald" },
    { id: 2, name: "Kediri", province: "Jawa Timur", lat: 45, lng: 60, volume: "High", days: 7, color: "red" },
    { id: 3, name: "Garut", province: "Jawa Barat", lat: 65, lng: 35, volume: "Medium", days: 40, color: "light-emerald" },
    { id: 4, name: "Klaten", province: "Jawa Tengah", lat: 50, lng: 45, volume: "Medium", days: 55, color: "light-emerald" },
    { id: 5, name: "Magelang", province: "Jawa Tengah", lat: 40, lng: 50, volume: "High", days: 14, color: "dark-emerald" },
  ];

  const getMarkerColor = (color: string) => {
    switch (color) {
      case "red": return "bg-red-500 shadow-red-500/50";
      case "dark-emerald": return "bg-emerald-600 shadow-emerald-600/50";
      case "light-emerald": return "bg-emerald-400 shadow-emerald-400/50";
      case "emerald": return "bg-emerald-500 shadow-emerald-500/50";
      default: return "bg-zinc-500";
    }
  };

  const getMarkerSize = (volume: string) => {
    return volume === "High" ? "w-4 h-4" : "w-3 h-3";
  };

  const getLegendColor = (label: string) => {
    if (label.includes("1-7")) return "bg-red-500 shadow-red-500/50";
    if (label.includes("8-14")) return "bg-emerald-600 shadow-emerald-600/50";
    if (label.includes("15-45")) return "bg-emerald-400 shadow-emerald-400/50";
    return "bg-emerald-500 shadow-emerald-500/50";
  };

  return (
    <MobileLayout title="Peta Prediksi Panen" showBackButton>
      <div className="px-6 py-6">
        {/* Legend */}
        <Card className="bg-white border-emerald-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-zinc-900">Keterangan Peta</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Panen 1-7 hari", color: "1-7" },
              { label: "Panen 8-14 hari", color: "8-14" },
              { label: "Panen 15-45 hari", color: "15-45" },
              { label: "Panen > 45 hari", color: "> 45" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-3 h-3 ${getLegendColor(item.label)} rounded-full shadow-lg`}></div>
                <span className="text-sm text-zinc-300">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-zinc-600 rounded-full shadow-lg"></div>
                <span className="text-xs text-zinc-400">Produksi Tinggi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-zinc-600 rounded-full shadow-lg"></div>
                <span className="text-xs text-zinc-400">Produksi Sedang</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Map Visualization */}
        <Card className="bg-white border-emerald-200 p-5 mb-6">
          <h3 className="font-bold text-black mb-4">Peta Wilayah Jawa</h3>
          <div className="relative bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-200 overflow-hidden" style={{ height: "300px" }}>
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full" style={{
                backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Ambient Glow Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.1),transparent_50%)]"></div>

            {/* Region Markers */}
            {regions.map((region) => (
              <div
                key={region.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${region.lng}%`, top: `${region.lat}%` }}
              >
                <div className={`${getMarkerColor(region.color)} ${getMarkerSize(region.volume)} rounded-full shadow-2xl animate-pulse`}></div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 hidden group-hover:block z-10">
                  <div className="bg-white border border-emerald-200 text-zinc-900 text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                    <div className="font-bold">{region.name}</div>
                    <div className="text-zinc-400">{region.days} hari</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Region Details */}
        <div>
          <h3 className="font-bold text-black mb-4 text-lg">Detail Wilayah Prediksi</h3>
          <div className="space-y-3">
            {regions.map((region) => (
              <Card key={region.id} className="bg-white border-emerald-200 p-5 hover:border-emerald-400 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${getMarkerColor(region.color).split(' ')[0]} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <MapPin className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-black mb-1">{region.name}</h4>
                        <p className="text-sm text-zinc-400">{region.province}</p>
                      </div>
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                        region.volume === "High" 
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white" 
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        {region.volume === "High" ? "Produksi Tinggi" : "Produksi Sedang"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-300">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold">{region.days} hari</span>
                      </div>
                      {region.days <= 7 && (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                          <span className="text-xs text-red-400 font-medium">Segera Panen</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}