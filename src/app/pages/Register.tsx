import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, User, Mail, MapPin, Briefcase, Lock, Leaf, Truck, Factory, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import imgLogo from "figma:asset/85b54429ff18534590e2881f120f06f05d1f27bf.png";

type UserRole = "petani" | "distributor" | "perusahaan";

const roleConfig = {
  petani: { label: "Petani", icon: Leaf, gradient: "from-emerald-500 to-emerald-600", dashboard: "/dashboard/petani", placeholder: "Contoh: Padi, Jagung, Cabai" },
  distributor: { label: "Distributor", icon: Truck, gradient: "from-emerald-600 to-emerald-700", dashboard: "/dashboard/distributor", placeholder: "Contoh: Distributor Regional, Logistik" },
  perusahaan: { label: "Perusahaan Pangan", icon: Factory, gradient: "from-emerald-400 to-emerald-500", dashboard: "/dashboard/perusahaan", placeholder: "Contoh: Pabrik Beras, Pengolahan Jagung" },
};

export function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"role" | "form">("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({ nama: "", email: "", password: "", lokasi: "", jenisUsaha: "" });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) navigate(roleConfig[selectedRole].dashboard);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#F5FCEF]">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 bg-white border-b border-emerald-200">
        <button onClick={() => (step === "form" ? setStep("role") : navigate("/home"))} className="p-1 hover:bg-emerald-50 rounded-lg transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-800" />
        </button>
        <img src={imgLogo} alt="SiPanen" className="w-8 h-8 object-contain" />
        <h1 className="text-lg font-bold text-zinc-800 tracking-tight">
          {step === "role" ? "Daftar Akun Baru" : `Daftar sebagai ${selectedRole ? roleConfig[selectedRole].label : ""}`}
        </h1>
      </div>

      <div className="flex-1 px-6 py-6 overflow-y-auto bg-[#F5FCEF]">
        <AnimatePresence mode="wait">
          {step === "role" ? (
            <motion.div key="role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-zinc-500 mb-5">Pilih tipe akun yang ingin Anda daftarkan:</p>
              <div className="space-y-3">
                {(Object.entries(roleConfig) as [UserRole, typeof roleConfig.petani][]).map(([key, role]) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => { setSelectedRole(key); setStep("form"); }}
                      className="w-full flex items-center gap-4 p-5 bg-white border border-emerald-200 rounded-2xl hover:border-emerald-400 transition-all text-left"
                    >
                      <div className={`w-13 h-13 bg-gradient-to-br ${role.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 p-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-zinc-900">{role.label}</h3>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-600" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="nama" className="text-zinc-700">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                    <Input id="nama" placeholder="Masukkan nama lengkap" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="pl-12 h-14 bg-white border-emerald-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                    <Input id="email" type="email" placeholder="nama@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-12 h-14 bg-white border-emerald-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                    <Input id="password" type="password" placeholder="Minimal 8 karakter" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="pl-12 h-14 bg-white border-emerald-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lokasi" className="text-zinc-700">Lokasi</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                    <Input id="lokasi" placeholder="Kota/Kabupaten" value={formData.lokasi} onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })} className="pl-12 h-14 bg-white border-emerald-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usaha" className="text-zinc-700">{selectedRole === "petani" ? "Komoditas Utama" : "Nama Usaha"}</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                    <Input id="usaha" placeholder={selectedRole ? roleConfig[selectedRole].placeholder : ""} value={formData.jenisUsaha} onChange={(e) => setFormData({ ...formData, jenisUsaha: e.target.value })} className="pl-12 h-14 bg-white border-emerald-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl" required />
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-200 mt-4">
                  Daftar Sekarang
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <p className="text-zinc-500">
            Sudah punya akun?{" "}
            <button onClick={() => navigate("/login")} className="text-emerald-600 font-semibold hover:text-emerald-500 transition-colors">Masuk</button>
          </p>
        </div>
      </div>
    </div>
  );
}