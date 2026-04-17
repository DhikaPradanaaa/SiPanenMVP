import { useState } from "react";
import { useNavigate } from "react-router";
import { Sprout, Mail, Lock, Leaf, Truck, Factory, ArrowLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import imgLogo from "figma:asset/85b54429ff18534590e2881f120f06f05d1f27bf.png";

type UserRole = "petani" | "distributor" | "perusahaan" | null;

const roles = [
  {
    id: "petani" as const,
    label: "Petani",
    desc: "Kelola lahan, prediksi panen, dan jual hasil panen",
    icon: Leaf,
    gradient: "from-emerald-500 to-emerald-600",
    dashboard: "/dashboard/petani",
  },
  {
    id: "distributor" as const,
    label: "Distributor",
    desc: "Pengadaan, gudang, logistik, dan manajemen pesanan",
    icon: Truck,
    gradient: "from-emerald-600 to-emerald-700",
    dashboard: "/dashboard/distributor",
  },
  {
    id: "perusahaan" as const,
    label: "Perusahaan Pangan",
    desc: "Pengadaan skala besar, QC, dan prediksi suplai",
    icon: Factory,
    gradient: "from-emerald-400 to-emerald-500",
    dashboard: "/dashboard/perusahaan",
  },
];

export function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"role" | "credentials">("role");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const role = roles.find((r) => r.id === selectedRole);
    if (role) navigate(role.dashboard);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#F5FCEF]">
      {/* Header */}
      <div className="flex flex-col items-center justify-center pt-12 pb-8 px-6">
        <button onClick={() => navigate("/home")} className="relative -mb-20">
          <div className="relative w-64 h-64 flex items-center justify-center scale-110">
            <img src={imgLogo} alt="SiPanen" className="w-full h-full object-contain" />
          </div>
        </button>
        <h1 className="relative z-10 text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-2">
          SiPanen
        </h1>
        <p className="text-zinc-500 text-center text-sm font-medium">Masa Depan Pangan dalam Satu Genggaman</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        <AnimatePresence mode="wait">
          {step === "role" ? (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-zinc-900 font-bold text-lg mb-1">Masuk Sebagai</h2>
              <p className="text-zinc-500 text-sm mb-5">Pilih tipe akun Anda</p>

              <div className="space-y-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        setSelectedRole(role.id);
                        setTimeout(() => setStep("credentials"), 200);
                      }}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 text-left ${isSelected
                          ? "bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                          : "bg-white border-emerald-200 hover:border-emerald-300"
                        }`}
                    >
                      <div className={`w-13 h-13 bg-gradient-to-br ${role.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 p-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-zinc-900 mb-0.5">{role.label}</h3>
                        <p className="text-xs text-zinc-500">{role.desc}</p>
                      </div>
                      <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isSelected ? "text-emerald-500" : "text-zinc-400"}`} />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => setStep("role")}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-700 transition-colors mb-5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Ganti tipe akun</span>
              </button>

              {/* Selected Role Badge */}
              {selectedRole && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl mb-6">
                  {(() => {
                    const role = roles.find((r) => r.id === selectedRole)!;
                    const Icon = role.icon;
                    return (
                      <>
                        <div className={`w-10 h-10 bg-gradient-to-br ${role.gradient} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-emerald-600 font-bold text-sm">{role.label}</div>
                          <div className="text-xs text-zinc-500">{role.desc}</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-14 bg-white border-emerald-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 h-14 bg-white border-emerald-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-200"
                >
                  Masuk
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <p className="text-zinc-500">
            Belum punya akun?{" "}
            <button onClick={() => navigate("/register")} className="text-emerald-600 font-semibold hover:text-emerald-500 transition-colors">
              Daftar Sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}