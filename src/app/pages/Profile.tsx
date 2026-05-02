import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  ArrowLeft, User, Mail, MapPin, Phone, Briefcase, Shield, Crown,
  ChevronRight, Bell, Globe, Moon, LogOut, Camera, Edit3, Star,
  Lock, HelpCircle, FileText, Heart, Settings, CreditCard, Leaf,
  Truck, Factory, CheckCircle2, AlertTriangle, Sparkles, Award,
  ToggleLeft, ToggleRight,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// ── ROLE-SPECIFIC PROFILE DATA ──

type UserRole = "petani" | "distributor" | "perusahaan";

interface ProfileData {
  nama: string;
  email: string;
  phone: string;
  lokasi: string;
  foto: string;
  role: UserRole;
  roleLabel: string;
  bergabung: string;
  isPremium: boolean;
  planName: string;
  verified: boolean;
  bio: string;
  stats: { label: string; value: string }[];
  businessInfo: { label: string; value: string; icon: typeof User }[];
}

const profileDataMap: Record<UserRole, ProfileData> = {
  petani: {
    nama: "Pak Suharto",
    email: "suharto@email.com",
    phone: "+62 812-3456-7890",
    lokasi: "Subang, Jawa Barat",
    foto: "https://images.unsplash.com/photo-1629719581652-bff2d1febf0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwZmFybWVyJTIwcG9ydHJhaXQlMjBmaWVsZHxlbnwxfHx8fDE3NzU4Mjc2MzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    role: "petani",
    roleLabel: "Petani",
    bergabung: "Januari 2025",
    isPremium: true,
    planName: "Premium Pro",
    verified: true,
    bio: "Petani padi & palawija berpengalaman 15 tahun di Subang, Jawa Barat.",
    stats: [
      { label: "Lahan Aktif", value: "4.8 Ha" },
      { label: "Total Panen", value: "32 Ton" },
      { label: "Transaksi", value: "28" },
      { label: "Rating", value: "4.8" },
    ],
    businessInfo: [
      { label: "Komoditas Utama", value: "Padi, Jagung, Cabai", icon: Leaf },
      { label: "Luas Total Lahan", value: "6.3 Hektar", icon: MapPin },
      { label: "Pengalaman", value: "15 Tahun", icon: Award },
      { label: "Sertifikasi", value: "Organik LSPO", icon: Shield },
    ],
  },
  distributor: {
    nama: "Ahmad Fadillah",
    email: "ahmad.f@agronusa.co.id",
    phone: "+62 821-9876-5432",
    lokasi: "Bekasi, Jawa Barat",
    foto: "https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NTgyNzYzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    role: "distributor",
    roleLabel: "Distributor",
    bergabung: "Maret 2024",
    isPremium: true,
    planName: "Business",
    verified: true,
    bio: "Direktur Operasional PT Agro Nusantara, distributor komoditas pangan Jawa Barat.",
    stats: [
      { label: "Stok Gudang", value: "128 Ton" },
      { label: "Armada", value: "12 Unit" },
      { label: "Mitra Petani", value: "86" },
      { label: "Rating", value: "4.7" },
    ],
    businessInfo: [
      { label: "Perusahaan", value: "PT Agro Nusantara", icon: Briefcase },
      { label: "Gudang", value: "3 Lokasi (Bekasi, Bandung, Surabaya)", icon: Truck },
      { label: "Area Operasi", value: "Jawa Barat, Jawa Timur", icon: MapPin },
      { label: "Lisensi", value: "SIUP & NIB Verified", icon: Shield },
    ],
  },
  perusahaan: {
    nama: "Diana Kusumawardani",
    email: "diana.k@indofood.co.id",
    phone: "+62 811-2233-4455",
    lokasi: "Jakarta Selatan, DKI Jakarta",
    foto: "https://images.unsplash.com/photo-1765005204058-10418f5123c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjB3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3NTgyNzYzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    role: "perusahaan",
    roleLabel: "Perusahaan",
    bergabung: "September 2024",
    isPremium: true,
    planName: "Enterprise",
    verified: true,
    bio: "VP Supply Chain PT Indofood, mengelola pengadaan bahan baku pangan skala nasional.",
    stats: [
      { label: "Pemasok Aktif", value: "24" },
      { label: "PO Bulan Ini", value: "8" },
      { label: "Total Nilai", value: "Rp 2.4M" },
      { label: "QC Rate", value: "96.2%" },
    ],
    businessInfo: [
      { label: "Perusahaan", value: "PT Indofood Sukses Makmur", icon: Factory },
      { label: "Divisi", value: "Supply Chain & Procurement", icon: Briefcase },
      { label: "Cakupan", value: "Nasional (34 Provinsi)", icon: Globe },
      { label: "Sertifikasi", value: "ISO 22000, HACCP", icon: Shield },
    ],
  },
};

const roleIcons: Record<UserRole, typeof Leaf> = {
  petani: Leaf,
  distributor: Truck,
  perusahaan: Factory,
};

const roleColors: Record<UserRole, { gradient: string; badge: string; light: string }> = {
  petani: {
    gradient: "from-emerald-500 to-emerald-600",
    badge: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    light: "bg-emerald-50",
  },
  distributor: {
    gradient: "from-blue-500 to-blue-600",
    badge: "bg-blue-500/15 text-blue-600 border-blue-500/30",
    light: "bg-blue-50",
  },
  perusahaan: {
    gradient: "from-violet-500 to-violet-600",
    badge: "bg-violet-500/15 text-violet-600 border-violet-500/30",
    light: "bg-violet-50",
  },
};

export function Profile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`http://localhost:5001/api/user/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) setUserData(data);
        })
        .catch(err => console.error("Error fetching user", err));
    }
  }, []);

  const role = userData?.role || (searchParams.get("role") || "petani") as UserRole;
  
  const baseProfile = profileDataMap[role as UserRole] || profileDataMap["petani"];
  const profile = userData ? {
    ...baseProfile,
    nama: userData.nama,
    email: userData.email,
    lokasi: userData.lokasi,
    foto: userData.foto || baseProfile.foto,
    role: userData.role,
    roleLabel: userData.role === "petani" ? "Petani" : userData.role === "distributor" ? "Distributor" : "Perusahaan",
  } : baseProfile;

  const colors = roleColors[role as UserRole] || roleColors["petani"];
  const RoleIcon = roleIcons[role as UserRole] || roleIcons["petani"];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url && userData) {
        const userId = localStorage.getItem("userId");
        if(userId) {
            await fetch(`http://localhost:5001/api/user/${userId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...userData, foto: data.url})
            });
            setUserData({...userData, foto: data.url});
        }
      }
    } catch(err) {
      console.error("Upload failed", err);
    }
  };

  const [notifEnabled, setNotifEnabled] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    nama: profile.nama,
    email: profile.email,
    phone: profile.phone,
    lokasi: profile.lokasi,
    bio: profile.bio,
  });

  useEffect(() => {
    setEditForm({
      nama: profile.nama,
      email: profile.email,
      phone: profile.phone,
      lokasi: profile.lokasi,
      bio: profile.bio,
    });
  }, [profile.nama, profile.email]);

  const dashboardPath = `/dashboard/${role}`;

  const menuSections = [
    {
      title: "Pengaturan Akun",
      items: [
        { icon: Edit3, label: "Edit Profil", action: () => setShowEditModal(true), color: "text-emerald-500" },
        { icon: Lock, label: "Ubah Password", action: () => {}, color: "text-blue-500" },
        { icon: CreditCard, label: "Langganan & Pembayaran", action: () => navigate("/premium/subscription"), color: "text-amber-500" },
        { icon: Shield, label: "Keamanan Akun", action: () => {}, color: "text-violet-500" },
      ],
    },
    {
      title: "Preferensi",
      items: [
        { icon: Bell, label: "Notifikasi", toggle: true, color: "text-emerald-500" },
        { icon: Globe, label: "Bahasa", value: "Indonesia", action: () => {}, color: "text-blue-500" },
      ],
    },
    {
      title: "Lainnya",
      items: [
        { icon: HelpCircle, label: "Pusat Bantuan", action: () => {}, color: "text-emerald-500" },
        { icon: FileText, label: "Syarat & Ketentuan", action: () => {}, color: "text-zinc-400" },
        { icon: Heart, label: "Beri Rating", action: () => {}, color: "text-red-400" },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F5FCEF]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-emerald-200">
        <button onClick={() => navigate(dashboardPath)} className="p-1.5 hover:bg-emerald-50 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-zinc-800" />
        </button>
        <h1 className="text-zinc-800 font-bold flex-1">Profil Saya</h1>
        <button onClick={() => setShowEditModal(true)} className="p-2 hover:bg-emerald-50 rounded-xl transition-colors">
          <Settings className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Card */}
        <div className="px-5 pt-6 pb-4">
          <div className="bg-white border border-emerald-200 rounded-3xl overflow-hidden">
            {/* Banner */}
            <div className={`h-24 bg-gradient-to-r ${colors.gradient} relative`}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 right-4 w-20 h-20 border border-white/30 rounded-full" />
                <div className="absolute bottom-0 left-8 w-16 h-16 border border-white/20 rounded-full" />
              </div>
              {profile.isPremium && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full">
                  <Crown className="w-3 h-3 text-amber-300" />
                  <span className="text-[9px] text-white font-bold">{profile.planName}</span>
                </div>
              )}
            </div>

            {/* Avatar & Info */}
            <div className="px-5 pb-5 -mt-12">
              <div className="relative w-24 h-24 mb-3">
                <ImageWithFallback
                  src={profile.foto}
                  alt={profile.nama}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-emerald-200 rounded-xl flex items-center justify-center shadow-sm hover:bg-emerald-50 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-emerald-500" />
                </button>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoUpload} />
                {profile.verified && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>

              <h2 className="text-zinc-900 font-bold text-xl mb-0.5">{profile.nama}</h2>
              <p className="text-zinc-500 text-sm mb-3">{profile.bio}</p>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${colors.badge}`}>
                  <RoleIcon className="w-3 h-3" />
                  {profile.roleLabel}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                  <Star className="w-3 h-3 text-amber-400" />
                  Bergabung {profile.bergabung}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-5 mb-5">
          <div className="grid grid-cols-4 gap-2">
            {profile.stats.map((s, i) => (
              <div key={i} className="bg-white border border-emerald-200 rounded-2xl p-3 text-center">
                <div className="text-zinc-900 font-bold text-lg">{s.value}</div>
                <div className="text-zinc-500 text-[9px] leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="px-5 mb-5">
          <h3 className="text-zinc-900 font-bold text-sm mb-3">Informasi Kontak</h3>
          <div className="bg-white border border-emerald-200 rounded-2xl divide-y divide-emerald-100">
            {[
              { icon: Mail, label: "Email", value: profile.email },
              { icon: Phone, label: "Telepon", value: profile.phone },
              { icon: MapPin, label: "Lokasi", value: profile.lokasi },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-zinc-400 text-[10px]">{item.label}</div>
                  <div className="text-zinc-900 text-sm truncate">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Info */}
        <div className="px-5 mb-5">
          <h3 className="text-zinc-900 font-bold text-sm mb-3">Informasi Bisnis</h3>
          <div className="bg-white border border-emerald-200 rounded-2xl divide-y divide-emerald-100">
            {profile.businessInfo.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <div className={`w-9 h-9 ${colors.light} rounded-xl flex items-center justify-center`}>
                  <item.icon className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-zinc-400 text-[10px]">{item.label}</div>
                  <div className="text-zinc-900 text-sm">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Sections */}
        {menuSections.map((section, si) => (
          <div key={si} className="px-5 mb-5">
            <h3 className="text-zinc-900 font-bold text-sm mb-3">{section.title}</h3>
            <div className="bg-white border border-emerald-200 rounded-2xl divide-y divide-emerald-100">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  onClick={"toggle" in item ? () => setNotifEnabled(!notifEnabled) : item.action}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-emerald-50/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <span className="text-zinc-900 text-sm flex-1">{item.label}</span>
                  {"toggle" in item ? (
                    notifEnabled ? (
                      <ToggleRight className="w-7 h-7 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-zinc-300" />
                    )
                  ) : "value" in item ? (
                    <span className="text-zinc-400 text-xs">{item.value}</span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-300" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className="px-5 mb-10">
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-red-200 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar dari Akun
          </button>
        </div>

        {/* App version */}
        <div className="text-center pb-8">
          <p className="text-zinc-300 text-[10px]">SiPanen v2.1.0</p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 animate-slide-up">
            <div className="w-10 h-1 bg-zinc-200 rounded-full mx-auto mb-5" />
            <h3 className="text-zinc-900 font-bold text-lg mb-5">Edit Profil</h3>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {[
                { label: "Nama Lengkap", key: "nama" as const, icon: User },
                { label: "Email", key: "email" as const, icon: Mail },
                { label: "No. Telepon", key: "phone" as const, icon: Phone },
                { label: "Lokasi", key: "lokasi" as const, icon: MapPin },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-zinc-500 text-xs mb-1.5 block">{field.label}</label>
                  <div className="relative">
                    <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      value={editForm[field.key]}
                      onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>
              ))}
              <div>
                <label className="text-zinc-500 text-xs mb-1.5 block">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3.5 border border-emerald-200 rounded-xl text-zinc-600 font-bold text-sm hover:bg-emerald-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
