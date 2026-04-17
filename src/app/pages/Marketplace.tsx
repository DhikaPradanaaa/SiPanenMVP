import { useState } from "react";
import { MobileLayout } from "../components/MobileLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { MapPin, Calendar, Package, User, Plus, CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Marketplace() {
  const [activeTab, setActiveTab] = useState("semua");

  const listings = [
    {
      id: 1,
      komoditas: "Padi",
      petani: "Ahmad Sutrisno",
      lokasi: "Subang, Jawa Barat",
      estimasiVolume: "24 Ton",
      tanggalPanen: "15 Mei 2026",
      harga: "Rp 6.500/kg",
      status: "available",
      verified: true,
      image: "https://images.unsplash.com/photo-1730127564699-9673611b2398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcGFkZHklMjBmaWVsZCUyMGZhcm18ZW58MXx8fHwxNzczMTI0MTMzfDA&ixlib=rb-4.1.0&q=80&w=400"
    },
    {
      id: 2,
      komoditas: "Jagung",
      petani: "Budi Santoso",
      lokasi: "Kediri, Jawa Timur",
      estimasiVolume: "18 Ton",
      tanggalPanen: "18 Maret 2026",
      harga: "Rp 4.800/kg",
      status: "available",
      verified: true,
      image: "https://images.unsplash.com/photo-1649251037465-72c9d378acb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JuJTIwZmllbGQlMjBoYXJ2ZXN0fGVufDF8fHx8MTc3MzE5NzIwMHww&ixlib=rb-4.1.0&q=80&w=400"
    },
    {
      id: 3,
      komoditas: "Cabai Merah",
      petani: "Siti Nurhaliza",
      lokasi: "Garut, Jawa Barat",
      estimasiVolume: "8 Ton",
      tanggalPanen: "20 April 2026",
      harga: "Rp 35.000/kg",
      status: "contracted",
      verified: true,
      image: "https://images.unsplash.com/photo-1771684512112-77cdac82a1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGUlMjBmYXJtJTIwcGxhbnRhdGlvbnxlbnwxfHx8fDE3NzMxOTcyMDF8MA&ixlib=rb-4.1.0&q=80&w=400"
    },
  ];

  const filteredListings = activeTab === "semua" 
    ? listings 
    : listings.filter(l => l.status === activeTab);

  return (
    <MobileLayout title="Marketplace Kontrak" showBackButton={false}>
      <div className="px-6 py-6">
        {/* Add Listing Button */}
        <Button 
          className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 mb-6 transition-all duration-200"
          onClick={() => {}}
        >
          <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
          Posting Penawaran Panen
        </Button>

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
              value="available"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg font-semibold"
            >
              Tersedia
            </TabsTrigger>
            <TabsTrigger 
              value="contracted"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg font-semibold"
            >
              Terkontrak
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Listings */}
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="bg-white border-emerald-200 overflow-hidden hover:border-emerald-400 transition-all duration-200">
              <div className="relative h-48">
                <ImageWithFallback
                  src={listing.image}
                  alt={listing.komoditas}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                {listing.verified && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold shadow-lg">
                    <CheckCircle2 className="w-3 h-3" />
                    Terverifikasi
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md border border-emerald-200 px-4 py-2 rounded-xl">
                  <span className="text-sm font-bold text-zinc-900">{listing.komoditas}</span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent mb-1">{listing.harga}</h3>
                    <p className="text-sm text-zinc-500">Harga estimasi</p>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                    listing.status === "available" 
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white" 
                      : "bg-emerald-50 text-zinc-400 border border-emerald-200"
                  }`}>
                    {listing.status === "available" ? "Tersedia" : "Terkontrak"}
                  </span>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 text-sm text-zinc-700">
                    <User className="w-4 h-4 text-emerald-500" />
                    <span>{listing.petani}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-700">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>{listing.lokasi}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-700">
                    <Package className="w-4 h-4 text-emerald-500" />
                    <span>Est. {listing.estimasiVolume}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-700">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>Panen: {listing.tanggalPanen}</span>
                  </div>
                </div>

                {listing.status === "available" ? (
                  <Button className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-200">
                    Buat Kontrak Pre-Order
                  </Button>
                ) : (
                  <Button className="w-full h-12 bg-emerald-50 text-zinc-400 rounded-xl cursor-not-allowed" disabled>
                    Sudah Terkontrak
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}