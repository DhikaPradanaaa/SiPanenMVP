import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Home, BarChart3, ShoppingBag, Bell, FileText, ArrowLeft,
  Leaf, TrendingUp, ClipboardList, CreditCard,
  Truck, Warehouse, MapPin, Receipt,
  Factory, Users, ShieldCheck, LineChart, FileCheck,
  LogOut, User,
} from "lucide-react";
import imgLogo from "figma:asset/85b54429ff18534590e2881f120f06f05d1f27bf.png";
import { FeedbackButton } from "./FeedbackButton";

type UserRole = "petani" | "distributor" | "perusahaan";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  showBottomNav?: boolean;
  role?: UserRole;
}

const navConfig: Record<UserRole, { path: string; icon: typeof Home; label: string }[]> = {
  petani: [
    { path: "/dashboard/petani", icon: Home, label: "Beranda" },
    { path: "/dashboard/petani?tab=harga", icon: TrendingUp, label: "Harga" },
    { path: "/dashboard/petani?tab=panen", icon: Leaf, label: "Panen" },
    { path: "/dashboard/petani?tab=marketplace", icon: ShoppingBag, label: "Pasar" },
    { path: "/komunitas", icon: Users, label: "Komunitas" },
  ],
  distributor: [
    { path: "/dashboard/distributor", icon: Home, label: "Beranda" },
    { path: "/dashboard/distributor?tab=marketplace", icon: ShoppingBag, label: "Marketplace" },
    { path: "/dashboard/distributor?tab=gudang", icon: Warehouse, label: "Gudang" },
    { path: "/dashboard/distributor?tab=logistik", icon: Truck, label: "Logistik" },
    { path: "/dashboard/distributor?tab=laporan", icon: Receipt, label: "Laporan" },
  ],
  perusahaan: [
    { path: "/dashboard/perusahaan", icon: Home, label: "Beranda" },
    { path: "/dashboard/perusahaan?tab=pemasok", icon: Users, label: "Pemasok" },
    { path: "/dashboard/perusahaan?tab=po", icon: FileCheck, label: "PO" },
    { path: "/dashboard/perusahaan?tab=qc", icon: ShieldCheck, label: "QC" },
    { path: "/dashboard/perusahaan?tab=prediksi", icon: LineChart, label: "Prediksi" },
  ],
};

export function MobileLayout({
  children,
  title,
  showBackButton = false,
  showBottomNav = true,
  role,
}: MobileLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const fullPath = location.pathname + location.search;

  const navItems = role ? navConfig[role] : navConfig.petani;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F5FCEF]">
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-emerald-200">
          <div className="flex items-center gap-2.5">
            {showBackButton ? (
              <button onClick={() => navigate(-1)} className="p-1 hover:bg-emerald-50 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-zinc-800" />
              </button>
            ) : (
              <img src="/logo.png" alt="SiPanen" className="w-8 h-8 object-contain" />
            )}
            <h1 className="text-lg font-bold text-zinc-800 tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-1">
            {role && (
              <button
                onClick={() => navigate(`/profile?role=${role}`)}
                className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                title="Profil"
              >
                <User className="w-4.5 h-4.5 text-white" />
              </button>
            )}
            <button
              onClick={() => navigate("/login")}
              className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Keluar"
            >
              <LogOut className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 bg-[#F5FCEF]">
        {children}
      </div>

      {/* Feedback FAB */}
      <FeedbackButton role={role} />

      {/* Bottom Navigation */}
      {showBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 border-t border-emerald-200 px-1 py-2.5 backdrop-blur-lg">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path.includes("?")
                ? fullPath === item.path
                : location.pathname === item.path && !location.search;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all duration-200 min-w-0 ${
                    isActive
                      ? "text-emerald-600 bg-emerald-100"
                      : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}