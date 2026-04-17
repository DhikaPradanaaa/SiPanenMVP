import { MobileLayout } from "../components/MobileLayout";
import { Card } from "../components/ui/card";
import { Bell, TrendingUp, AlertCircle, CheckCircle2, ShoppingBag, Clock } from "lucide-react";

export function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "harvest-alert",
      title: "Prediksi Panen Segera",
      message: "Wilayah Kediri, Jawa Timur diprediksi akan panen dalam 7 hari. Volume estimasi: 18 Ton jagung.",
      time: "2 jam lalu",
      read: false,
      icon: TrendingUp,
      gradient: "from-emerald-600 to-emerald-500",
    },
    {
      id: 2,
      type: "contract",
      title: "Kontrak Baru Dibuat",
      message: "Ahmad Sutrisno membuat kontrak untuk 24 Ton padi. Lihat detail kontrak.",
      time: "5 jam lalu",
      read: false,
      icon: ShoppingBag,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      id: 3,
      type: "harvest-ready",
      title: "Wilayah Siap Panen",
      message: "3 wilayah baru diprediksi siap panen dalam 14 hari. Cek peta prediksi untuk detail.",
      time: "1 hari lalu",
      read: true,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      id: 4,
      type: "weather-alert",
      title: "Peringatan Cuaca",
      message: "Potensi hujan lebat di wilayah Subang dalam 3 hari. Pantau perkembangan tanaman.",
      time: "1 hari lalu",
      read: true,
      icon: AlertCircle,
      gradient: "from-emerald-600 to-emerald-700",
    },
    {
      id: 5,
      type: "prediction-update",
      title: "Update Prediksi Panen",
      message: "AI memperbarui prediksi panen cabai di Garut. Estimasi waktu maju 3 hari.",
      time: "2 hari lalu",
      read: true,
      icon: TrendingUp,
      gradient: "from-emerald-500 to-emerald-600",
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <MobileLayout title="Notifikasi" showBackButton={false}>
      <div className="px-6 py-6">
        {/* Summary */}
        {unreadCount > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Bell className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">
                  {unreadCount} Notifikasi Baru
                </h3>
                <p className="text-sm text-zinc-400">
                  Ada pembaruan penting untuk Anda
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <Card 
                key={notif.id} 
                className={`bg-white border-emerald-200 p-5 transition-all duration-200 ${
                  !notif.read ? 'border-emerald-500/30 bg-emerald-500/5' : 'hover:border-zinc-700'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${notif.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-bold ${!notif.read ? 'text-white' : 'text-zinc-300'}`}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full flex-shrink-0 mt-1.5 shadow-lg shadow-emerald-400/50"></div>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 mb-3 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Clock className="w-3 h-3" />
                      <span>{notif.time}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State if needed */}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-white border border-emerald-200 rounded-3xl flex items-center justify-center mb-6">
              <Bell className="w-12 h-12 text-zinc-600" />
            </div>
            <h3 className="font-bold text-white mb-2 text-lg">Tidak Ada Notifikasi</h3>
            <p className="text-sm text-zinc-400 text-center max-w-xs">
              Anda akan menerima notifikasi tentang prediksi panen dan kontrak di sini
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}