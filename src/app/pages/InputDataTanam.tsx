import { Calendar, MapPin, Ruler, Sprout } from "lucide-react";
import imgLogo from "figma:asset/85b54429ff18534590e2881f120f06f05d1f27bf.png";
import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileLayout } from "../components/MobileLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

export function InputDataTanam() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    komoditas: "",
    tanggalTanam: "",
    luasLahan: "",
    lokasi: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.komoditas) {
      alert("Mohon pilih jenis komoditas terlebih dahulu.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Silakan login terlebih dahulu");
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId })
      });
      if (res.ok) {
        toast.success("Data tanam berhasil disimpan!");
        setTimeout(() => navigate("/prediksi-panen"), 500);
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menyimpan data");
        toast.error(data.error || "Gagal menyimpan data");
      }
    } catch (err) {
      alert("Gagal menghubungi server");
      toast.error("Gagal menghubungi server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout title="Input Data Tanam" showBackButton>
      <div className="px-6 py-6">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 mb-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
              <img src={imgLogo} alt="SiPanen" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 mb-2">Catat Aktivitas Tanam</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Masukkan detail data tanam untuk mendapatkan prediksi panen yang akurat dari AI kami.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-zinc-700">Jenis Komoditas</Label>
            <Select value={formData.komoditas} onValueChange={(value) => setFormData({ ...formData, komoditas: value })}>
              <SelectTrigger className="h-14 bg-white border-emerald-200 text-zinc-900 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl">
                <SelectValue placeholder="Pilih komoditas" />
              </SelectTrigger>
              <SelectContent className="bg-white border-emerald-200 text-zinc-900">
                <SelectItem value="padi">Padi</SelectItem>
                <SelectItem value="jagung">Jagung</SelectItem>
                <SelectItem value="kedelai">Kedelai</SelectItem>
                <SelectItem value="cabai">Cabai</SelectItem>
                <SelectItem value="tomat">Tomat</SelectItem>
                <SelectItem value="bawang">Bawang Merah</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tanggalTanam" className="text-zinc-700">Tanggal Tanam</Label>
            <div className="relative">
              <Calendar className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
              <Input
                id="tanggalTanam"
                type="date"
                value={formData.tanggalTanam}
                onChange={(e) => setFormData({ ...formData, tanggalTanam: e.target.value })}
                className="pl-12 h-14 bg-white border-emerald-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="luasLahan" className="text-zinc-700">
              Luas Lahan (Hektar)
            </Label>
            <div className="relative">
              <Ruler className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
              <Input
                id="luasLahan"
                type="number"
                step="0.1"
                placeholder="Contoh: 2.5"
                value={formData.luasLahan}
                onChange={(e) => setFormData({ ...formData, luasLahan: e.target.value })}
                className="pl-12 h-14 bg-white border-emerald-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lokasi" className="text-zinc-700">Lokasi Lahan</Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
              <Input
                id="lokasi"
                placeholder="Desa/Kecamatan/Kabupaten"
                value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                className="pl-12 h-14 bg-white border-emerald-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-200 mt-6"
          >
            {isLoading ? "Menyimpan..." : "Simpan Data Tanam"}
          </Button>
        </form>
      </div>
    </MobileLayout>
  );
}