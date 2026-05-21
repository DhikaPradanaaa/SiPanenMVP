import { useParams, useNavigate } from "react-router";
import { MobileLayout } from "../components/MobileLayout";
import {
  CheckCircle2,
  Circle,
  ShieldCheck,
  FileText,
  Truck,
  PackageCheck,
  Wallet,
  ArrowLeft,
} from "lucide-react";

export function StatusKontrak() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simulasi ID kontrak default jika tidak ada
  const contractId = id || "KTR-9901-XYZ";

  const timelineSteps = [
    {
      id: 1,
      title: "Kesepakatan Dibuat",
      description: "Kontrak disetujui untuk 10 Ton Padi.",
      icon: FileText,
      status: "completed",
    },
    {
      id: 2,
      title: "Dana Diamankan",
      description: "Dana Rp 65.000.000 telah ditahan oleh sistem Smart Contract SiPanen.",
      icon: ShieldCheck,
      status: "completed",
      highlight: true,
    },
    {
      id: 3,
      title: "Menunggu Panen & Pengiriman",
      description: "Petani sedang memproses pesanan Anda.",
      icon: Truck,
      status: "pending",
    },
    {
      id: 4,
      title: "Konfirmasi Penerimaan",
      description: "Distributor menerima dan memverifikasi barang.",
      icon: PackageCheck,
      status: "pending",
    },
    {
      id: 5,
      title: "Dana Dicairkan",
      description: "Uang otomatis masuk ke dompet petani.",
      icon: Wallet,
      status: "pending",
    },
  ];

  return (
    <MobileLayout title="Status Kontrak" showBottomNav={false}>
      <div className="bg-emerald-600 px-6 pt-6 pb-10 text-white rounded-b-[2.5rem] shadow-lg relative">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 hover:bg-white/30 transition"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-8 h-8 text-emerald-200" />
          <h2 className="text-2xl font-bold">Smart Contract</h2>
        </div>
        <p className="text-emerald-100 text-sm opacity-90">
          ID: {contractId}
        </p>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-emerald-900/5 border border-emerald-50 mb-6">
          <h3 className="text-lg font-bold text-zinc-800 mb-6 border-b border-zinc-100 pb-4">
            Resi Pengiriman Kontrak
          </h3>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-emerald-200 before:to-transparent">
            {timelineSteps.map((step, index) => {
              const isCompleted = step.status === "completed";
              const isLast = index === timelineSteps.length - 1;

              return (
                <div key={step.id} className="relative flex items-start gap-4">
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-4 border-white ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                  </div>
                  <div className="pt-1 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={`text-sm font-bold ${
                          isCompleted ? "text-zinc-900" : "text-zinc-500"
                        }`}
                      >
                        {step.title}
                      </h4>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-300" />
                      )}
                    </div>
                    <p
                      className={`text-xs ${
                        isCompleted ? "text-zinc-600" : "text-zinc-400"
                      } ${step.highlight ? "font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg mt-2 border border-emerald-100 flex items-start gap-2" : ""}`}
                    >
                      {step.highlight && <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />}
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full h-12 mb-8 bg-zinc-100 text-zinc-700 font-bold rounded-xl shadow-sm hover:bg-zinc-200 transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    </MobileLayout>
  );
}
