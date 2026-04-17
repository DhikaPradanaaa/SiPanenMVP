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
    estimasiPanen: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Data tanam berhasil disimpan!");
    setTimeout(() => navigate("/dashboard"), 1500);
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

          <div className="space-y-2">
            <Label htmlFor="estimasiPanen" className="text-zinc-700">Estimasi Masa Panen (Hari)</Label>
            <div className="relative">
              <Calendar className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
              <Input
                id="estimasiPanen"
                type="number"
                placeholder="Contoh: 90"
                value={formData.estimasiPanen}
                onChange={(e) => setFormData({ ...formData, estimasiPanen: e.target.value })}
                className="pl-12 h-14 bg-white border-emerald-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                required
              />
            </div>
            <p className="text-xs text-zinc-500">Sistem akan mengoptimalkan prediksi berdasarkan data historis</p>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-200 mt-6"
          >
            Simpan Data Tanam
          </Button>
        </form>
      </div>
    </MobileLayout>
  );
}