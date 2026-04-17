import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Sprout,
  Brain,
  BarChart3,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Zap,
  Globe,
  TrendingUp,
  Leaf,
  Satellite,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import imgLogo from "figma:asset/85b54429ff18534590e2881f120f06f05d1f27bf.png";

// ── DATA ──

const heroImages = [
  "https://images.unsplash.com/photo-1558534949-0a442809cb33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjByaWNlJTIwcGFkZHklMjBmaWVsZCUyMGdyZWVufGVufDF8fHx8MTc3MzQ2MjE0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1760299092548-f6c6c867cc2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBoYXJ2ZXN0aW5nJTIwY3JvcCUyMGZpZWxkfGVufDF8fHx8MTc3MzQ2MjE0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1738598665806-7ecc32c3594c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYWdyaWN1bHR1cmUlMjB0ZWNobm9sb2d5JTIwc2Vuc29yfGVufDF8fHx8MTc3MzQ2MjE0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
];

const stats = [
  { value: "15K+", label: "Petani Aktif" },
  { value: "98.5%", label: "Akurasi AI" },
  { value: "2.4M", label: "Ton Terprediksi" },
  { value: "340+", label: "Distributor" },
];

const features = [
  { icon: Brain, title: "Prediksi AI Canggih", desc: "Machine learning menganalisis data cuaca, tanah, dan historis untuk prediksi panen dengan akurasi tinggi." },
  { icon: Satellite, title: "Peta Prediksi Real-time", desc: "Visualisasi peta interaktif menampilkan zona panen, distribusi produksi, dan analisis wilayah." },
  { icon: BarChart3, title: "Dashboard Intelijen", desc: "Pantau tren pasokan, distribusi produksi, dan insight pasar dalam satu dashboard terpadu." },
  { icon: Users, title: "Marketplace Kontrak", desc: "Hubungkan petani langsung dengan distributor dan perusahaan pangan melalui kontrak panen." },
  { icon: Globe, title: "Jangkauan Nasional", desc: "Mencakup seluruh wilayah pertanian Indonesia dengan data lokasi yang komprehensif." },
  { icon: ShieldCheck, title: "Data Terverifikasi", desc: "Sistem validasi multi-layer memastikan keakuratan dan keandalan data pertanian." },
];

const userTypes = [
  { icon: Leaf, title: "Petani", desc: "Input data tanam, dapatkan prediksi panen, dan jual hasil panen langsung ke distributor.", benefits: ["Prediksi waktu panen optimal", "Akses marketplace kontrak", "Rekomendasi tanam AI"] },
  { icon: TrendingUp, title: "Distributor", desc: "Pantau pasokan real-time, buat kontrak langsung, dan optimalkan rantai distribusi.", benefits: ["Peta pasokan real-time", "Kontrak langsung petani", "Analisis tren pasokan"] },
  { icon: Zap, title: "Perusahaan Pangan", desc: "Akses intelijen pasokan, prediksi ketersediaan bahan baku, dan amankan kontrak.", benefits: ["Intelijen pasokan nasional", "Prediksi ketersediaan", "Manajemen kontrak"] },
];

const steps = [
  { num: "01", title: "Daftar Akun", desc: "Pilih peran Anda sebagai petani, distributor, atau perusahaan pangan." },
  { num: "02", title: "Input Data", desc: "Masukkan data tanam, lokasi, dan komoditas Anda ke dalam sistem." },
  { num: "03", title: "Dapatkan Prediksi", desc: "AI menganalisis data dan memberikan prediksi panen yang akurat." },
  { num: "04", title: "Hubungkan & Jual", desc: "Temukan mitra bisnis dan buat kontrak panen di marketplace." },
];

const TOTAL_SLIDES = 5;
const AUTO_PLAY_DELAY = 6000;
const SWIPE_THRESHOLD = 50;

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
};

// ── CONFETTI PARTICLE ──

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
  opacity: number;
  shape: "circle" | "square" | "strip";
}

function ConfettiEffect({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (!active) return;

    const colors = [
      "#10b981", "#34d399", "#6ee7b7", "#a7f3d0",
      "#059669", "#047857", "#ffffff", "#d1fae5",
    ];
    const shapes: ConfettiParticle["shape"][] = ["circle", "square", "strip"];

    const newParticles: ConfettiParticle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      size: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      velocityX: (Math.random() - 0.5) * 3,
      velocityY: 2 + Math.random() * 4,
      rotationSpeed: (Math.random() - 0.5) * 15,
      opacity: 0.8 + Math.random() * 0.2,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 3500);
    return () => clearTimeout(timer);
  }, [active]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden max-w-md mx-auto">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: `${p.y}vh`,
            rotate: p.rotation,
            opacity: p.opacity,
          }}
          animate={{
            x: `${p.x + p.velocityX * 20}vw`,
            y: "110vh",
            rotate: p.rotation + p.rotationSpeed * 40,
            opacity: [p.opacity, p.opacity, 0],
          }}
          transition={{ duration: 2.5 + Math.random() * 1.5, ease: "easeIn" }}
          style={{
            position: "absolute",
            width: p.shape === "strip" ? p.size * 0.4 : p.size,
            height: p.shape === "strip" ? p.size * 2.5 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "strip" ? 2 : 2,
          }}
        />
      ))}
    </div>
  );
}

// ── MAIN COMPONENT ──

export function HeroLanding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Auto-play
  const [autoPlayActive, setAutoPlayActive] = useState(true);
  const autoPlayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Swipe
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  // Background image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Pause auto-play on user interaction, resume after 8s of inactivity
  const pauseAutoPlay = useCallback(() => {
    setAutoPlayActive(false);
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    interactionTimeout.current = setTimeout(() => {
      setAutoPlayActive(true);
    }, 8000);
  }, []);

  // Auto-play slide advancement
  useEffect(() => {
    if (!autoPlayActive) return;
    if (currentSlide >= TOTAL_SLIDES - 1) return;

    autoPlayTimer.current = setTimeout(() => {
      setDirection(1);
      setCurrentSlide((prev) => Math.min(prev + 1, TOTAL_SLIDES - 1));
    }, AUTO_PLAY_DELAY);

    return () => {
      if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
    };
  }, [autoPlayActive, currentSlide]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
      if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    };
  }, []);

  const goNext = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES - 1) {
      pauseAutoPlay();
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, pauseAutoPlay]);

  const goBack = useCallback(() => {
    if (currentSlide > 0) {
      pauseAutoPlay();
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide, pauseAutoPlay]);

  const goToSlide = useCallback(
    (idx: number) => {
      pauseAutoPlay();
      setDirection(idx > currentSlide ? 1 : -1);
      setCurrentSlide(idx);
    },
    [currentSlide, pauseAutoPlay]
  );

  // Swipe handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isSwiping.current = true;
    },
    []
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isSwiping.current) return;
      isSwiping.current = false;

      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      // Only horizontal swipes (ignore vertical scrolling)
      if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaY) > Math.abs(deltaX)) return;

      if (deltaX < 0 && currentSlide < TOTAL_SLIDES - 1) {
        // Swipe left → next
        goNext();
      } else if (deltaX > 0 && currentSlide > 0) {
        // Swipe right → back
        goBack();
      }
    },
    [currentSlide, goNext, goBack]
  );

  // Confetti + navigate
  const handleDaftarClick = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => {
      navigate("/register");
    }, 1200);
  }, [navigate]);

  const slideLabels = ["Beranda", "Statistik", "Fitur", "Peran", "Mulai"];

  // ─── SLIDE 0: HERO ───
  const SlideHero = () => (
    <div className="flex-1 flex flex-col justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 rounded-full mb-6 self-start"
      >
        <Zap className="w-4 h-4 text-emerald-600" />
        <span className="text-xs text-emerald-700 font-medium">Platform Intelijen Pertanian #1</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-4xl font-bold text-zinc-900 mb-4 leading-tight tracking-tight"
      >
        Prediksi Panen
        <br />
        <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
          Lebih Cerdas
        </span>
        <br />
        dengan AI
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="text-zinc-500 mb-8 leading-relaxed"
      >
        Hubungkan petani, distributor, dan perusahaan pangan dalam satu ekosistem cerdas berbasis kecerdasan buatan.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex gap-3"
      >
        <button
          onClick={() => navigate("/register")}
          className="flex-1 flex items-center justify-center gap-2 h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all duration-300"
        >
          Mulai Sekarang
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );

  // ─── SLIDE 1: STATS ───
  const SlideStats = () => (
    <div className="flex-1 flex flex-col justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
          <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] text-emerald-600 font-medium">DAMPAK NYATA</span>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          Dipercaya oleh{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
            Ribuan Pengguna
          </span>
        </h2>
        <p className="text-sm text-zinc-500">Data real-time dari seluruh Indonesia</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
            className="bg-white/80 backdrop-blur-md border border-emerald-200 rounded-2xl p-5 text-center hover:border-emerald-400 transition-all"
          >
            <div className="text-emerald-600 font-bold text-2xl mb-1">{s.value}</div>
            <div className="text-zinc-500 text-xs">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-white/60 backdrop-blur-md border border-emerald-200 rounded-2xl p-5"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-zinc-900 font-bold">+42%</div>
            <div className="text-xs text-zinc-500">Peningkatan efisiensi panen</div>
          </div>
        </div>
        <div className="w-full bg-emerald-100 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "82%" }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );

  // ─── SLIDE 2: FEATURES ───
  const SlideFeatures = () => (
    <div className="flex-1 flex flex-col px-6 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-3">
          <Brain className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] text-emerald-600 font-medium">FITUR UNGGULAN</span>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          Teknologi untuk{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
            Pertanian Modern
          </span>
        </h2>
      </motion.div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-2" style={{ scrollbarWidth: "none" }}>
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
              className="flex items-start gap-4 p-4 bg-white border border-emerald-200 rounded-2xl"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-zinc-900 mb-0.5">{f.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // ─── SLIDE 3: ROLES ───
  const SlideRoles = () => (
    <div className="flex-1 flex flex-col px-6 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-center mb-5"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-3">
          <Users className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] text-emerald-600 font-medium">TIGA PERAN</span>
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-1">Satu Platform, Tiga Peran</h2>
        <p className="text-xs text-zinc-500">Dirancang untuk setiap pemangku kepentingan</p>
      </motion.div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-2" style={{ scrollbarWidth: "none" }}>
        {userTypes.map((u, i) => {
          const Icon = u.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
              className="relative overflow-hidden bg-white border border-emerald-200 rounded-2xl p-5"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-zinc-900">{u.title}</h3>
                </div>
                <p className="text-xs text-zinc-500 mb-3 leading-relaxed">{u.desc}</p>
                <div className="space-y-1.5">
                  {u.benefits.map((b, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-zinc-700">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // ─── SLIDE 4: CTA ───
  const SlideCTA = () => (
    <div className="flex-1 flex flex-col justify-center px-6">
      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span className="text-xs text-emerald-600 font-medium">4 LANGKAH MUDAH</span>
        </div>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-white border border-emerald-300 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-600 font-bold text-xs">{s.num}</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-zinc-900">{s.title}</h4>
                <p className="text-[11px] text-zinc-500">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="relative bg-white border border-emerald-200 rounded-3xl p-7 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_60%)]" />
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative text-center">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-48 h-48 rounded-2xl flex items-center justify-center mx-auto -mb-4"
          >
            <img src={imgLogo} alt="SiPanen" className="w-full h-full object-contain scale-110" />
          </motion.div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Siap Bertransformasi?</h2>
          <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
            Bergabung dengan ribuan pengguna SiPanen.
          </p>
          <button
            onClick={handleDaftarClick}
            className="group w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all duration-300 mb-3 active:scale-[0.97]"
          >
            <Sparkles className="w-5 h-5 group-hover:animate-spin" />
            Daftar Gratis
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2.5 text-sm text-zinc-400 font-medium hover:text-zinc-700 transition-colors"
          >
            Sudah punya akun? <span className="text-emerald-600">Masuk</span>
          </button>
        </div>
      </motion.div>
    </div>
  );

  const slides = [SlideHero, SlideStats, SlideFeatures, SlideRoles, SlideCTA];

  return (
    <div
      className="flex flex-col min-h-screen max-w-md mx-auto bg-[#F5FCEF] overflow-y-auto overflow-x-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Confetti Overlay */}
      <ConfettiEffect active={showConfetti} />

      {/* Background Image */}
      <div className="absolute inset-0 max-w-md mx-auto">
        {heroImages.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: currentImage === i ? 1 : 0 }}
          >
            <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-[#F5FCEF]/85 to-white/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(16,185,129,0.08),transparent_60%)]" />
      </div>

      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <img src={imgLogo} alt="SiPanen" className="w-10 h-10 object-contain" />
          <div className="flex flex-col">
            <span className="text-zinc-800 font-bold text-sm leading-tight">SiPanen</span>
            <span className="text-emerald-600 text-[8px] font-medium leading-tight">Intelijen Pertanian</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Auto-play indicator */}
          {autoPlayActive && currentSlide < TOTAL_SLIDES - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5"
            >
              <div className="relative w-5 h-5">
                <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" fill="none" stroke="#d1fae5" strokeWidth="2" />
                  <motion.circle
                    cx="10" cy="10" r="8"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={50.26}
                    initial={{ strokeDashoffset: 50.26 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: AUTO_PLAY_DELAY / 1000, ease: "linear" }}
                    key={`auto-${currentSlide}`}
                  />
                </svg>
              </div>
            </motion.div>
          )}
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-xs text-emerald-700 border border-emerald-400/50 bg-white/60 backdrop-blur-sm rounded-xl hover:bg-emerald-50 transition-all"
          >
            Masuk
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col overflow-y-auto overflow-x-hidden"
          >
            {slides[currentSlide]()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Swipe Hint (only on first slide, fades after 3s) */}
      {currentSlide === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4, times: [0, 0.1, 0.7, 1] }}
          className="relative z-20 flex items-center justify-center gap-2 pb-2"
        >
          <motion.div
            animate={{ x: [-8, 8, -8] }}
            transition={{ repeat: 2, duration: 1.2, ease: "easeInOut" }}
            className="text-zinc-500 text-[10px] flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Geser untuk navigasi
            <ArrowRight className="w-3 h-3" />
          </motion.div>
        </motion.div>
      )}

      {/* Bottom Navigation Controls */}
      <div className="relative z-20 px-6 pb-6 pt-3 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {slideLabels.map((label, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="group flex flex-col items-center gap-1.5"
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === i
                    ? "w-8 bg-emerald-400 shadow-md shadow-emerald-500/40"
                    : i < currentSlide
                    ? "w-4 bg-emerald-600/60"
                    : "w-3 bg-emerald-200"
                }`}
              />
              <span
                className={`text-[9px] transition-all ${
                  currentSlide === i ? "text-emerald-700 font-medium" : "text-zinc-400"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Nav Buttons */}
        <div className="flex items-center gap-3">
          {currentSlide > 0 ? (
            <button
              onClick={goBack}
              className="w-14 h-14 flex items-center justify-center bg-white border border-emerald-200 rounded-2xl hover:border-emerald-300 transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-500" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-14 h-14 flex items-center justify-center bg-white border border-emerald-200 rounded-2xl hover:border-emerald-300 transition-all active:scale-95"
            >
              <span className="text-xs text-zinc-500 font-medium">Login</span>
            </button>
          )}

          {currentSlide < TOTAL_SLIDES - 1 ? (
            <button
              onClick={goNext}
              className="flex-1 flex items-center justify-center gap-2 h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all duration-300 active:scale-[0.98]"
            >
              Selanjutnya
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleDaftarClick}
              className="flex-1 flex items-center justify-center gap-2 h-14 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all duration-300 active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5" />
              Daftar Sekarang
            </button>
          )}
        </div>
      </div>
    </div>
  );
}