import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { MobileLayout } from "../components/MobileLayout";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  CheckCircle2,
  Lock,
} from "lucide-react";

export function Pembayaran() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>("va-mandiri");

  const contractId = id || "KTR-9901-XYZ";
  const nominal = "Rp 65.000.000";

  const paymentMethods = [
    {
      category: "Virtual Account",
      icon: CreditCard,
      options: [
        { id: "va-mandiri", name: "Mandiri Virtual Account", logo: "Mandiri" },
        { id: "va-bca", name: "BCA Virtual Account", logo: "BCA" },
        { id: "va-bri", name: "BRI Virtual Account", logo: "BRI" },
      ],
    },
    {
      category: "QRIS",
      icon: QrCode,
      options: [{ id: "qris", name: "QRIS (Scan via Aplikasi App Apapun)", logo: "QRIS" }],
    },
    {
      category: "E-Wallet",
      icon: Smartphone,
      options: [
        { id: "ew-ovo", name: "OVO", logo: "OVO" },
        { id: "ew-dana", name: "DANA", logo: "DANA" },
      ],
    },
  ];

  const handlePayment = () => {
    // Simulasi proses pembayaran, arahkan ke halaman status kontrak
    navigate(`/status-kontrak/${contractId}`);
  };

  return (
    <MobileLayout title="Pembayaran" showBottomNav={false}>
      <div className="bg-emerald-600 px-6 pt-6 pb-12 text-white rounded-b-[2.5rem] shadow-lg relative">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 hover:bg-white/30 transition"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h2 className="text-2xl font-bold mb-1">Total Tagihan</h2>
        <div className="text-4xl font-extrabold tracking-tight mb-2">
          {nominal}
        </div>
        <div className="text-emerald-100 text-sm flex items-center gap-2">
          <span>ID Kontrak: {contractId}</span>
        </div>
      </div>

      <div className="px-6 -mt-8 space-y-4 mb-24">
        {/* Security Banner */}
        <div className="bg-white rounded-2xl p-4 shadow-xl shadow-emerald-900/5 border border-emerald-100 flex items-start gap-3">
          <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0 mt-0.5">
            <Lock className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-800 mb-1">
              Rekening Bersama (Smart Contract)
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Pembayaran Anda aman dan ditahan di Rekening Bersama (Smart
              Contract) SiPanen hingga barang diterima.
            </p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-100">
          <h3 className="text-zinc-800 font-bold mb-4">Metode Pembayaran</h3>

          <div className="space-y-6">
            {paymentMethods.map((group, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 text-zinc-500 mb-3">
                  <group.icon className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {group.category}
                  </span>
                </div>
                <div className="space-y-2">
                  {group.options.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => setSelectedMethod(option.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedMethod === option.id
                          ? "border-emerald-500 bg-emerald-50/50"
                          : "border-zinc-100 bg-white hover:border-emerald-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center font-bold text-zinc-400 text-[10px] border border-zinc-100">
                          {option.logo}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            selectedMethod === option.id
                              ? "text-emerald-900"
                              : "text-zinc-700"
                          }`}
                        >
                          {option.name}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                          selectedMethod === option.id
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-zinc-300"
                        }`}
                      >
                        {selectedMethod === option.id && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-zinc-100 z-50">
        <button
          onClick={handlePayment}
          className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 text-lg hover:shadow-emerald-500/50 transition-all active:scale-[0.98]"
        >
          <ShieldCheck className="w-5 h-5" />
          Bayar Sekarang
        </button>
      </div>
    </MobileLayout>
  );
}
