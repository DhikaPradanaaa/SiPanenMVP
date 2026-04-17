import { MobileLayout } from "../components/MobileLayout";
import { Card } from "../components/ui/card";
import { Calendar, TrendingUp, Package, AlertCircle, CheckCircle2, Leaf, Sparkles } from "lucide-react";

export function PrediksiPanen() {
  const predictions = [
    {
      id: 1,
      komoditas: "Padi",
      lokasi: "Subang, Jawa Barat",
      tanggalTanam: "15 Feb 2026",
      prediksiPanen: "15 Mei 2026",
      hariTersisa: 65,
      estimasiVolume: "24 Ton",
      akurasi: 94,
      status: "on-track",
      progress: 75,
    },
    {
      id: 2,
      komoditas: "Jagung",
      lokasi: "Kediri, Jawa Timur",
      tanggalTanam: "10 Jan 2026",
      prediksiPanen: "18 Maret 2026",
      hariTersisa: 7,
      estimasiVolume: "18 Ton",
      akurasi: 96,
      status: "ready",
      progress: 95,
    },
    {
      id: 3,
      komoditas: "Cabai",
      lokasi: "Garut, Jawa Barat",
      tanggalTanam: "20 Feb 2026",
      prediksiPanen: "20 April 2026",
      hariTersisa: 40,
      estimasiVolume: "8 Ton",
      akurasi: 91,
      status: "on-track",
      progress: 60,
    },
  ];

  return (
    <MobileLayout title="Prediksi Panen" showBackButton>
      <div className="px-6 py-6">
        {/* Info Alert */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 mb-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Prediksi AI</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Sistem menganalisis data cuaca, historis panen, dan kondisi tanah untuk prediksi akurat.
              </p>
            </div>
          </div>
        </div>

        {/* Predictions List */}
        <div className="space-y-4">
          {predictions.map((pred) => (
            <Card key={pred.id} className="bg-white border-emerald-200 p-6 hover:border-emerald-400 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-1">{pred.komoditas}</h3>
                    <p className="text-sm text-zinc-400">{pred.lokasi}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                  pred.status === "ready" 
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white" 
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}>
                  {pred.status === "ready" ? "Siap Panen" : "Dalam Proses"}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-zinc-400 font-medium">Progress Pertumbuhan</span>
                  <span className="text-sm font-bold text-black">{pred.progress}%</span>
                </div>
                <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${pred.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white/80 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-zinc-400">Prediksi Panen</span>
                  </div>
                  <p className="font-bold text-black mb-1">{pred.prediksiPanen}</p>
                  <p className="text-xs text-emerald-400 font-medium">{pred.hariTersisa} hari lagi</p>
                </div>

                <div className="bg-white/80 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-zinc-400">Est. Volume</span>
                  </div>
                  <p className="font-bold text-black mb-1">{pred.estimasiVolume}</p>
                  <p className="text-xs text-zinc-400">Akurasi {pred.akurasi}%</p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="pt-4 border-t border-emerald-100">
                {pred.status === "ready" ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Tanaman siap dipanen</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Pantau terus perkembangan tanaman</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}