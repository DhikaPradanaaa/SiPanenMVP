import { useState } from "react";
import { MessageSquarePlus, X, Star, Send, CheckCircle2, ChevronDown } from "lucide-react";

const CATEGORIES = ["Bug / Error", "Saran Fitur", "Pujian", "Lainnya"];

interface FeedbackButtonProps {
  role?: string;
  /** If true, renders as an inline menu-item button instead of a FAB */
  inline?: boolean;
}

export function FeedbackButton({ role, inline = false }: FeedbackButtonProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [kategori, setKategori] = useState(CATEGORIES[0]);
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCatMenu, setShowCatMenu] = useState(false);

  const reset = () => {
    setRating(0);
    setHoverRating(0);
    setKategori(CATEGORIES[0]);
    setPesan("");
    setSuccess(false);
    setShowCatMenu(false);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(reset, 300);
  };

  const handleSubmit = async () => {
    if (!rating || !pesan.trim()) return;
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      await fetch("http://localhost:5001/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: role || null, kategori, pesan: pesan.trim(), rating }),
      });
      setSuccess(true);
      setTimeout(() => handleClose(), 2000);
    } catch {
      alert("Gagal mengirim feedback. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const triggerButton = inline ? (
    <button
      id="btn-feedback-inline"
      onClick={() => setOpen(true)}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-emerald-50/50 transition-colors"
    >
      <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
        <MessageSquarePlus className="w-4 h-4 text-rose-500" />
      </div>
      <span className="text-zinc-900 text-sm flex-1">Kirim Umpan Balik</span>
    </button>
  ) : (
    <button
      id="btn-feedback-fab"
      onClick={() => setOpen(true)}
      className="fixed bottom-24 right-4 z-40 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all duration-200"
      title="Kirim Umpan Balik"
    >
      <MessageSquarePlus className="w-5 h-5 text-white" />
    </button>
  );

  return (
    <>
      {triggerButton}

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl animate-slide-up">
            {/* Handle */}
            <div className="w-10 h-1 bg-zinc-200 rounded-full mx-auto mb-5" />

            {success ? (
              /* Success State */
              <div className="flex flex-col items-center py-6 gap-3">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-zinc-900 font-bold text-lg">Terima Kasih!</h3>
                <p className="text-zinc-500 text-sm text-center">
                  Umpan balik Anda telah diterima dan akan segera kami tinjau.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-zinc-900 font-bold text-lg">Kirim Umpan Balik</h3>
                    <p className="text-zinc-400 text-xs mt-0.5">Bantu kami memperbaiki SiPanen</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 bg-zinc-100 rounded-xl flex items-center justify-center hover:bg-zinc-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>

                {/* Rating Stars */}
                <div className="mb-5">
                  <label className="text-zinc-500 text-xs mb-2 block">Penilaian Keseluruhan</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(s)}
                        className="transition-transform hover:scale-125 active:scale-95"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            s <= (hoverRating || rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-zinc-200 fill-zinc-200"
                          }`}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="text-xs text-zinc-400 self-end mb-1 ml-1">
                        {["", "Sangat Buruk", "Buruk", "Cukup", "Baik", "Sangat Baik"][rating]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="mb-5 relative">
                  <label className="text-zinc-500 text-xs mb-2 block">Kategori</label>
                  <button
                    onClick={() => setShowCatMenu(!showCatMenu)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm"
                  >
                    <span>{kategori}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showCatMenu ? "rotate-180" : ""}`} />
                  </button>
                  {showCatMenu && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-emerald-200 rounded-xl shadow-lg z-10 overflow-hidden">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c}
                          onClick={() => { setKategori(c); setShowCatMenu(false); }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-emerald-50 ${
                            c === kategori ? "text-emerald-600 font-bold bg-emerald-50" : "text-zinc-700"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="text-zinc-500 text-xs mb-2 block">Pesan</label>
                  <textarea
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    placeholder="Ceritakan pengalaman atau saran Anda..."
                    rows={4}
                    className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  id="btn-feedback-submit"
                  onClick={handleSubmit}
                  disabled={loading || !rating || !pesan.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-pulse">Mengirim...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Umpan Balik
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
