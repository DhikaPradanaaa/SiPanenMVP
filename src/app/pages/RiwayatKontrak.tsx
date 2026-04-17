import { MobileLayout } from "../components/MobileLayout";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { FileText, Calendar, MapPin, Package, User, Building2, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useState } from "react";

export function RiwayatKontrak() {
  const [activeTab, setActiveTab] = useState("semua");

  const contracts = [
    {
      id: "KTR-001",
      komoditas: "Padi",
      petani: "Ahmad Sutrisno",
      pembeli: "PT Beras Nusantara",
      jenisUsuaha: "Perusahaan Pangan",
      volume: "24 Ton",
      lokasi: "Subang, Jawa Barat",
      tanggalPanen: "15 Mei 2026",
      hargaKesepakatan: "Rp 6.500/kg",
      totalNilai: "Rp 156.000.000",
      status: "active",
      tanggalKontrak: "1 Maret 2026",
    },
    {
      id: "KTR-002",
      komoditas: "Jagung",
      petani: "Budi Santoso",
      pembeli: "CV Mitra Tani",
      jenisUsuaha: "Distributor",
      volume: "18 Ton",
      lokasi: "Kediri, Jawa Timur",
      tanggalPanen: "18 Maret 2026",
      hargaKesepakatan: "Rp 4.800/kg",
      totalNilai: "Rp 86.400.000",
      status: "completed",
      tanggalKontrak: "10 Februari 2026",
    },
    {
      id: "KTR-003",
      komoditas: "Cabai Merah",
      petani: "Siti Nurhaliza",
      pembeli: "PT Agro Fresh Indonesia",
      jenisUsuaha: "Perusahaan Pangan",
      volume: "8 Ton",
      lokasi: "Garut, Jawa Barat",
      tanggalPanen: "20 April 2026",
      hargaKesepakatan: "Rp 35.000/kg",
      totalNilai: "Rp 280.000.000",
      status: "active",
      tanggalKontrak: "25 Februari 2026",
    },
  ];

  const filteredContracts = activeTab === "semua" 
    ? contracts 
    : contracts.filter(c => c.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return { text: "Aktif", gradient: "from-emerald-600 to-emerald-500" };
      case "completed":
        return { text: "Selesai", gradient: "from-emerald-500 to-emerald-600" };
      case "cancelled":
        return { text: "Dibatalkan", gradient: "from-red-500 to-red-600" };
      default:
        return { text: status, gradient: "from-zinc-600 to-zinc-700" };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return Clock;
      case "completed":
        return CheckCircle2;
      case "cancelled":
        return XCircle;
      default:
        return FileText;
    }
  };

  return (
    <MobileLayout title="Riwayat Kontrak" showBackButton={false}>
      <div className="px-6 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-white border-emerald-200 p-4">
            <div className="text-3xl font-bold text-zinc-900 mb-1">
              {contracts.length}
            </div>
            <div className="text-xs text-zinc-400">Total Kontrak</div>
          </Card>
          <Card className="bg-white border-emerald-200 p-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-1">
              {contracts.filter(c => c.status === "active").length}
            </div>
            <div className="text-xs text-zinc-400">Aktif</div>
          </Card>
          <Card className="bg-white border-emerald-200 p-4">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent mb-1">
              {contracts.filter(c => c.status === "completed").length}
            </div>
            <div className="text-xs text-zinc-400">Selesai</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full grid grid-cols-3 bg-white border border-emerald-200 p-1 rounded-xl">
            <TabsTrigger 
              value="semua"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg font-semibold"
            >
              Semua
            </TabsTrigger>
            <TabsTrigger 
              value="active"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg font-semibold"
            >
              Aktif
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg font-semibold"
            >
              Selesai
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Contracts List */}
        <div className="space-y-4">
          {filteredContracts.map((contract) => {
            const statusBadge = getStatusBadge(contract.status);
            const StatusIcon = getStatusIcon(contract.status);
            
            return (
              <Card key={contract.id} className="bg-white border-emerald-200 p-6 hover:border-emerald-400 transition-all duration-200">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black text-lg">{contract.id}</h3>
                      <p className="text-sm text-zinc-400">{contract.komoditas}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold bg-gradient-to-r ${statusBadge.gradient} text-white shadow-lg`}>
                    <StatusIcon className="w-3 h-3" strokeWidth={2.5} />
                    {statusBadge.text}
                  </span>
                </div>

                {/* Contract Details */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="text-zinc-400">Petani: </span>
                      <span className="text-black font-semibold">{contract.petani}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="text-zinc-400">Pembeli: </span>
                      <span className="text-black font-semibold">{contract.pembeli}</span>
                      <span className="text-zinc-500"> ({contract.jenisUsuaha})</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-zinc-300">{contract.lokasi}</div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Package className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-zinc-400">
                      Volume: <span className="font-bold text-black">{contract.volume}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-zinc-400">
                      Panen: <span className="font-bold text-black">{contract.tanggalPanen}</span>
                    </div>
                  </div>
                </div>

                {/* Price Info */}
                <div className="pt-5 border-t border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Harga Kesepakatan</p>
                      <p className="text-sm font-bold text-zinc-300">{contract.hargaKesepakatan}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-500 mb-1">Total Nilai Kontrak</p>
                      <p className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">{contract.totalNilai}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredContracts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-white border border-emerald-200 rounded-3xl flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-zinc-600" />
            </div>
            <h3 className="font-bold text-black mb-2 text-lg">Tidak Ada Kontrak</h3>
            <p className="text-sm text-zinc-400 text-center">
              Kontrak Anda akan muncul di sini
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}