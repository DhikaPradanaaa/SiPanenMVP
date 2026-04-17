import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Code2,
  Server,
  Key,
  Shield,
  Zap,
  CheckCircle2,
  Copy,
  ExternalLink,
  Crown,
  Star,
  Clock,
  BarChart3,
  Globe,
  Lock,
  Activity,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Terminal,
  Cpu,
} from "lucide-react";

// ── MOCK DATA ──

const apiPlans = [
  {
    id: "starter",
    name: "Starter",
    price: "Rp 2.5Jt",
    period: "/bulan",
    desc: "Untuk startup & integrasi sederhana",
    rateLimit: "1,000 req/hari",
    features: [
      "Prediksi panen per komoditas",
      "Data harga pasar real-time",
      "Webhook notifikasi dasar",
      "1 API Key",
      "Email support",
    ],
    color: "from-zinc-600 to-zinc-500",
    popular: false,
  },
  {
    id: "business",
    name: "Business",
    price: "Rp 7.5Jt",
    period: "/bulan",
    desc: "Untuk perusahaan logistik & perbankan",
    rateLimit: "10,000 req/hari",
    features: [
      "Semua fitur Starter",
      "Prediksi produksi per wilayah",
      "Data cuaca & anomali",
      "Analisis rantai pasok",
      "5 API Keys",
      "Priority support 24/7",
      "SLA 99.5% uptime",
    ],
    color: "from-emerald-600 to-emerald-500",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Untuk korporasi & lembaga pemerintah",
    rateLimit: "Unlimited",
    features: [
      "Semua fitur Business",
      "Custom endpoints",
      "Batch data processing",
      "White-label solutions",
      "Unlimited API Keys",
      "Dedicated infra",
      "SLA 99.9% uptime",
      "Dedicated account manager",
    ],
    color: "from-amber-600 to-amber-500",
    popular: false,
  },
];

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/predictions/{commodity}",
    desc: "Prediksi panen berdasarkan komoditas",
    response: `{
  "commodity": "padi",
  "region": "jawa_barat",
  "predicted_harvest": "2026-04-15",
  "yield_estimate_ton": 8500,
  "confidence": 0.94,
  "weather_risk": "low"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/market/prices",
    desc: "Harga pasar komoditas real-time",
    response: `{
  "commodity": "cabai_merah",
  "price_per_kg": 45000,
  "trend": "up",
  "change_7d": "+8.7%",
  "forecast_30d": 52000
}`,
  },
  {
    method: "GET",
    path: "/api/v1/regions/{id}/production",
    desc: "Data produksi per wilayah",
    response: `{
  "region": "sulawesi_selatan",
  "total_area_ha": 125000,
  "active_farmers": 34200,
  "commodities": ["padi", "jagung"],
  "production_ytd_ton": 285000
}`,
  },
  {
    method: "POST",
    path: "/api/v1/webhooks/subscribe",
    desc: "Daftar webhook notifikasi",
    response: `{
  "webhook_id": "wh_abc123",
  "url": "https://your-app.com/hook",
  "events": ["harvest_ready", "price_alert"],
  "status": "active"
}`,
  },
];

const usageStats = [
  { label: "Request Hari Ini", value: "2,847", max: "10,000", persen: 28 },
  { label: "Request Bulan Ini", value: "68,420", max: "300,000", persen: 23 },
  { label: "Latency Rata-rata", value: "142ms", max: "", persen: 0 },
  { label: "Uptime", value: "99.97%", max: "", persen: 0 },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  PUT: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  DELETE: "bg-red-500/15 text-red-400 border-red-500/30",
};

export function ApiIntegration() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "docs" | "plans">("overview");
  const [expandedEndpoint, setExpandedEndpoint] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F5FCEF]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-emerald-200">
        <button onClick={() => navigate("/premium")} className="p-1.5 hover:bg-emerald-50 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-zinc-800" />
        </button>
        <div className="flex-1">
          <h1 className="text-zinc-800 font-bold text-sm">API Integration</h1>
          <p className="text-cyan-600 text-[10px] font-medium">Integrasi Data untuk Mitra Bisnis</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-cyan-500/15 border border-cyan-500/30 rounded-full">
          <Code2 className="w-3 h-3 text-cyan-400" />
          <span className="text-[9px] text-cyan-400 font-bold">API</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex bg-white border border-emerald-200 rounded-xl p-1">
          {([
            { key: "overview" as const, label: "Overview" },
            { key: "docs" as const, label: "Dokumentasi" },
            { key: "plans" as const, label: "Paket Lisensi" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === t.key ? "bg-cyan-500 text-white" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#F5FCEF]">
        <AnimatePresence mode="wait">
          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Intro */}
              <div className="px-5 pt-3 pb-4">
                <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <Server className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-cyan-700 font-bold text-xs mb-1">SiPanen Data API</h4>
                      <p className="text-zinc-500 text-[11px] leading-relaxed">
                        Akses data prediksi panen, harga komoditas, dan analisis wilayah secara programatis. Dirancang untuk integrasi dengan sistem logistik, perbankan, dan asuransi pertanian.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Key */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span className="text-zinc-900 font-bold text-sm">API Key Anda</span>
                </div>
                <div className="bg-white border border-emerald-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 bg-emerald-50 rounded-lg px-3 py-2.5 font-mono text-[11px] text-zinc-500 overflow-hidden">
                      sk_live_SiPn_****************************a7f3
                    </div>
                    <button
                      onClick={() => handleCopy("YOUR_API_KEY_HERE")}
                      className="w-10 h-10 bg-white border border-emerald-200 rounded-lg flex items-center justify-center hover:border-emerald-300 transition-colors"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-[9px]">
                    <div className="flex items-center gap-1 text-emerald-400">
                      <Activity className="w-3 h-3" />
                      <span>Aktif</span>
                    </div>
                    <span className="text-zinc-400">Paket: Business</span>
                    <span className="text-zinc-400">Dibuat: 1 Mar 2026</span>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span className="text-zinc-900 font-bold text-sm">Penggunaan API</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {usageStats.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * i }}
                      className="bg-white border border-emerald-200 rounded-xl p-3"
                    >
                      <div className="text-zinc-500 text-[9px] mb-1">{s.label}</div>
                      <div className="text-zinc-900 font-bold text-sm">{s.value}</div>
                      {s.max && (
                        <>
                          <div className="text-zinc-600 text-[8px] mb-1">dari {s.max}</div>
                          <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${s.persen}%` }}
                              transition={{ delay: 0.3, duration: 0.6 }}
                              className="h-full bg-cyan-500 rounded-full"
                            />
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Features */}
              <div className="px-5 pb-8">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Shield, label: "OAuth 2.0", color: "text-emerald-400" },
                    { icon: Zap, label: "< 200ms", color: "text-amber-400" },
                    { icon: Globe, label: "REST API", color: "text-cyan-400" },
                  ].map((f, i) => (
                    <div key={i} className="bg-white border border-emerald-200 rounded-xl p-3 text-center">
                      <f.icon className={`w-5 h-5 ${f.color} mx-auto mb-1.5`} />
                      <span className="text-zinc-600 text-[10px] font-medium">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── DOCS TAB ── */}
          {activeTab === "docs" && (
            <motion.div
              key="docs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="px-5 pt-3 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span className="text-zinc-900 font-bold text-sm">API Endpoints</span>
                </div>
                <p className="text-zinc-400 text-[10px] mb-4">Base URL: <span className="text-cyan-600 font-mono">https://api.sipanen.id/v1</span></p>
              </div>

              <div className="px-5 pb-8 space-y-3">
                {endpoints.map((ep, i) => {
                  const isExpanded = expandedEndpoint === i;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="bg-white border border-emerald-200 rounded-2xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedEndpoint(isExpanded ? null : i)}
                        className="w-full p-4 text-left"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[9px] px-2 py-0.5 rounded border font-bold font-mono ${methodColors[ep.method]}`}>
                            {ep.method}
                          </span>
                          <span className="text-zinc-300 text-[10px] font-mono flex-1 truncate">{ep.path}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />}
                        </div>
                        <p className="text-zinc-500 text-[10px]">{ep.desc}</p>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-1 border-t border-emerald-100">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                  <Terminal className="w-3 h-3 text-cyan-400" />
                                  <span className="text-cyan-400 text-[9px] font-bold">RESPONSE EXAMPLE</span>
                                </div>
                                <button
                                  onClick={() => handleCopy(ep.response)}
                                  className="text-[9px] text-zinc-500 flex items-center gap-1 hover:text-zinc-400"
                                >
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </button>
                              </div>
                              <pre className="bg-emerald-50 rounded-xl p-3 text-[9px] font-mono text-zinc-600 overflow-x-auto leading-relaxed" style={{ scrollbarWidth: "none" }}>
                                {ep.response}
                              </pre>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {/* Auth Example */}
                <div className="bg-white border border-emerald-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-cyan-400" />
                    <span className="text-zinc-900 font-bold text-xs">Autentikasi</span>
                  </div>
                  <p className="text-zinc-400 text-[10px] mb-3 leading-relaxed">
                    Kirim API key Anda di header <span className="text-cyan-600 font-mono">Authorization</span>:
                  </p>
                  <pre className="bg-emerald-50 rounded-xl p-3 text-[9px] font-mono text-zinc-600 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
{`curl -H "Authorization: Bearer sk_live_SiPn_***"
     https://api.sipanen.id/v1/predictions/padi`}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PLANS TAB ── */}
          {activeTab === "plans" && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="px-5 pt-3 pb-8"
            >
              <div className="text-center mb-5">
                <h2 className="text-zinc-900 font-bold text-lg mb-1">Paket Lisensi API</h2>
                <p className="text-zinc-500 text-xs">Pilih sesuai volume integrasi Anda</p>
              </div>

              <div className="space-y-4">
                {apiPlans.map((plan, i) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className={`relative bg-white border rounded-2xl p-5 ${
                      plan.popular ? "border-cyan-400 shadow-lg shadow-cyan-500/10" : "border-emerald-200"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-full">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-white" />
                          <span className="text-[10px] text-white font-bold">REKOMENDASI</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-1 mt-1">
                      <div>
                        <h3 className="text-zinc-900 font-bold text-lg">{plan.name}</h3>
                        <p className="text-zinc-500 text-[10px]">{plan.desc}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-600 font-bold text-xl">{plan.price}</div>
                        {plan.period && <span className="text-zinc-600 text-[10px]">{plan.period}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mb-3 mt-2">
                      <Cpu className="w-3 h-3 text-zinc-500" />
                      <span className="text-zinc-500 text-[10px]">Rate limit: <strong className="text-zinc-700">{plan.rateLimit}</strong></span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {plan.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                          <span className="text-zinc-700 text-[11px]">{f}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      className={`w-full h-11 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        plan.popular
                          ? "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                          : "bg-emerald-50 border border-emerald-200 text-zinc-600 hover:border-emerald-300"
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      {plan.id === "enterprise" ? "Hubungi Sales" : "Aktivasi Sekarang"}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}