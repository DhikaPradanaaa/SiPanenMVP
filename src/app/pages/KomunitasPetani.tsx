import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { MobileLayout } from "../components/MobileLayout";
import {
  Heart, MessageCircle, Send, Plus, X, Image, MapPin,
  Users, Leaf, ChevronDown, CheckCircle2,
} from "lucide-react";

// ── TYPES ──
interface Post {
  id: number;
  userId: string | null;
  nama: string;
  foto: string | null;
  lokasi: string | null;
  konten: string;
  foto_post: string | null;
  likes: number;
  createdAt: string;
}

interface Comment {
  id: number;
  userId: string | null;
  nama: string;
  konten: string;
  createdAt: string;
}

// ── SEED DATA (shown when API is empty) ──
const seedPosts: Post[] = [
  {
    id: -1, userId: null, nama: "Pak Suharto", foto: "https://images.unsplash.com/photo-1629719581652-bff2d1febf0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100",
    lokasi: "Subang, Jawa Barat", konten: "Alhamdulillah padi di Blok A sudah mulai berbunga 🌾 Cuaca kemarin cukup mendukung. Ada yang punya saran cara mengatasi wereng di fase ini?", foto_post: null, likes: 14, createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: -2, userId: null, nama: "Bu Siti Aminah", foto: null,
    lokasi: "Karawang, Jawa Barat", konten: "Jagung saya terkena serangan ulat grayak. Sudah coba semprot pestisida organik tapi belum terlalu efektif. Ada rekomendasinya?", foto_post: "https://images.unsplash.com/photo-1649251037465-72c9d378acb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400", likes: 8, createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: -3, userId: null, nama: "Pak Agus", foto: null,
    lokasi: "Garut, Jawa Barat", konten: "Harga cabai merah di pasar lokal naik jadi Rp 48.000/kg minggu ini. Bagi yang punya stok, ini waktu yang bagus untuk jual! 🌶️", foto_post: null, likes: 22, createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

function Avatar({ foto, nama }: { foto: string | null; nama: string }) {
  if (foto) {
    return <img src={foto} alt={nama} className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-200" />;
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center border-2 border-emerald-200">
      <span className="text-white font-bold text-sm">{nama.charAt(0).toUpperCase()}</span>
    </div>
  );
}

export function KomunitasPetani() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [commentInput, setCommentInput] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);
  const [postForm, setPostForm] = useState({ konten: "", lokasi: "" });
  const [postImage, setPostImage] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const currentUser = {
    nama: localStorage.getItem("userName") || "Petani",
    foto: localStorage.getItem("userFoto") || null,
    lokasi: localStorage.getItem("userLokasi") || "",
    userId: localStorage.getItem("userId") || null,
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/komunitas");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPosts(data);
      } else {
        setPosts(seedPosts);
      }
    } catch {
      setPosts(seedPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleLike = async (post: Post) => {
    const isLiked = likedIds.has(post.id);
    // Optimistic update
    setLikedIds(prev => {
      const next = new Set(prev);
      isLiked ? next.delete(post.id) : next.add(post.id);
      return next;
    });
    setPosts(prev => prev.map(p =>
      p.id === post.id ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p
    ));
    // Skip API for seed posts
    if (post.id < 0) return;
    try {
      await fetch(`http://localhost:5001/api/komunitas/${post.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: !isLiked }),
      });
    } catch { /* silent */ }
  };

  const fetchComments = async (postId: number) => {
    if (postId < 0) { setComments(prev => ({ ...prev, [postId]: [] })); return; }
    try {
      const res = await fetch(`http://localhost:5001/api/komunitas/${postId}/comments`);
      const data = await res.json();
      setComments(prev => ({ ...prev, [postId]: Array.isArray(data) ? data : [] }));
    } catch {
      setComments(prev => ({ ...prev, [postId]: [] }));
    }
  };

  const toggleComments = (postId: number) => {
    if (openComments === postId) {
      setOpenComments(null);
    } else {
      setOpenComments(postId);
      if (!comments[postId]) fetchComments(postId);
    }
    setCommentInput("");
  };

  const handleAddComment = async (postId: number) => {
    const text = commentInput.trim();
    if (!text) return;
    const newComment: Comment = {
      id: Date.now(),
      userId: currentUser.userId,
      nama: currentUser.nama,
      konten: text,
      createdAt: new Date().toISOString(),
    };
    setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newComment] }));
    setCommentInput("");
    if (postId < 0) return;
    try {
      await fetch(`http://localhost:5001/api/komunitas/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.userId, nama: currentUser.nama, konten: text }),
      });
    } catch { /* silent */ }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPostImage(file);
    setPostImagePreview(URL.createObjectURL(file));
  };

  const handleSubmitPost = async () => {
    if (!postForm.konten.trim()) return;
    setPosting(true);
    try {
      const formData = new FormData();
      formData.append("nama", currentUser.nama);
      formData.append("userId", currentUser.userId || "");
      formData.append("foto", currentUser.foto || "");
      formData.append("lokasi", postForm.lokasi || currentUser.lokasi);
      formData.append("konten", postForm.konten.trim());
      if (postImage) formData.append("foto_post", postImage);

      const res = await fetch("http://localhost:5001/api/komunitas", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setPostSuccess(true);
        setTimeout(() => {
          setShowNewPost(false);
          setPostSuccess(false);
          setPostForm({ konten: "", lokasi: "" });
          setPostImage(null);
          setPostImagePreview(null);
          fetchPosts();
        }, 1500);
      }
    } catch {
      alert("Gagal posting. Coba lagi.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <MobileLayout title="Komunitas Petani" showBottomNav role="petani">
      <div className="px-5 pt-5 pb-4">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-4 mb-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 border-2 border-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-2 border-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base">Komunitas Petani</h2>
              <p className="text-white/80 text-xs mt-0.5">Berbagi ilmu & pengalaman bertani</p>
            </div>
          </div>
          <div className="relative flex gap-4 mt-3">
            {[
              { label: "Anggota Aktif", value: "1.2K" },
              { label: "Postingan", value: posts.length.toString() },
              { label: "Diskusi Aktif", value: "84" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-white font-bold text-sm">{s.value}</div>
                <div className="text-white/70 text-[9px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* New Post Button */}
        <button
          id="btn-new-post"
          onClick={() => setShowNewPost(true)}
          className="w-full flex items-center gap-3 bg-white border border-emerald-200 rounded-2xl px-4 py-3 mb-5 hover:border-emerald-400 transition-colors"
        >
          <Avatar foto={currentUser.foto} nama={currentUser.nama} />
          <span className="text-zinc-400 text-sm flex-1 text-left">Bagikan pengalaman bertani Anda...</span>
          <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
        </button>

        {/* Feed */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-emerald-100 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-emerald-100 rounded w-1/3" />
                    <div className="h-2 bg-emerald-50 rounded w-1/4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-zinc-100 rounded w-full" />
                  <div className="h-3 bg-zinc-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const isLiked = likedIds.has(post.id);
              const isOpen = openComments === post.id;
              const postComments = comments[post.id] || [];

              return (
                <div key={post.id} className="bg-white border border-emerald-200 rounded-2xl overflow-hidden">
                  {/* Post Header */}
                  <div className="flex items-start gap-3 p-4">
                    <Avatar foto={post.foto} nama={post.nama} />
                    <div className="flex-1 min-w-0">
                      <div className="text-zinc-900 font-bold text-sm">{post.nama}</div>
                      {post.lokasi && (
                        <div className="flex items-center gap-1 text-zinc-400 text-[10px] mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                          {post.lokasi}
                        </div>
                      )}
                    </div>
                    <span className="text-zinc-400 text-[10px] flex-shrink-0">{timeAgo(post.createdAt)}</span>
                  </div>

                  {/* Content */}
                  <div className="px-4 pb-3">
                    <p className="text-zinc-700 text-sm leading-relaxed">{post.konten}</p>
                  </div>

                  {/* Image (if any) */}
                  {post.foto_post && (
                    <div className="mx-4 mb-3 rounded-xl overflow-hidden border border-emerald-100">
                      <img src={post.foto_post} alt="post" className="w-full object-cover max-h-52" />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 px-4 pb-4 pt-1 border-t border-emerald-50">
                    <button
                      onClick={() => handleLike(post)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${isLiked
                          ? "bg-red-50 text-red-500 border border-red-200"
                          : "bg-zinc-50 text-zinc-500 border border-zinc-200 hover:bg-red-50 hover:text-red-400"
                        }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-red-500" : ""}`} />
                      {post.likes}
                    </button>
                    <button
                      onClick={() => toggleComments(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${isOpen
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-zinc-50 text-zinc-500 border border-zinc-200 hover:bg-emerald-50 hover:text-emerald-500"
                        }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Komentar
                      {postComments.length > 0 && (
                        <span className="bg-emerald-500 text-white px-1.5 py-0.5 rounded-full text-[9px]">
                          {postComments.length}
                        </span>
                      )}
                      <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <div className="flex-1" />
                    <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                  </div>

                  {/* Comments Section */}
                  {isOpen && (
                    <div className="border-t border-emerald-100 bg-emerald-50/50 px-4 py-3">
                      {postComments.length === 0 ? (
                        <p className="text-zinc-400 text-xs text-center py-2">Belum ada komentar. Jadilah yang pertama!</p>
                      ) : (
                        <div className="space-y-3 mb-3">
                          {postComments.map((c) => (
                            <div key={c.id} className="flex items-start gap-2">
                              <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-[10px]">{c.nama.charAt(0)}</span>
                              </div>
                              <div className="flex-1 bg-white rounded-xl px-3 py-2 border border-emerald-100">
                                <div className="text-zinc-700 font-bold text-[11px]">{c.nama}</div>
                                <div className="text-zinc-600 text-xs mt-0.5">{c.konten}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Comment Input */}
                      <div className="flex items-center gap-2">
                        <Avatar foto={currentUser.foto} nama={currentUser.nama} />
                        <div className="flex-1 flex items-center gap-2 bg-white border border-emerald-200 rounded-xl px-3 py-2">
                          <input
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                            placeholder="Tulis komentar..."
                            className="flex-1 text-xs text-zinc-700 bg-transparent outline-none placeholder:text-zinc-400"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-emerald-600 transition-colors"
                          >
                            <Send className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNewPost(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl animate-slide-up">
            <div className="w-10 h-1 bg-zinc-200 rounded-full mx-auto mb-4" />

            {postSuccess ? (
              <div className="flex flex-col items-center py-8 gap-3">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-zinc-900 font-bold text-lg">Post Berhasil!</h3>
                <p className="text-zinc-500 text-sm text-center">Postingan Anda sudah tampil di komunitas.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-zinc-900 font-bold text-base">Buat Postingan Baru</h3>
                  <button onClick={() => setShowNewPost(false)} className="w-8 h-8 bg-zinc-100 rounded-xl flex items-center justify-center">
                    <X className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>

                {/* Author preview */}
                <div className="flex items-center gap-2 mb-4">
                  <Avatar foto={currentUser.foto} nama={currentUser.nama} />
                  <div>
                    <div className="text-zinc-900 font-bold text-sm">{currentUser.nama}</div>
                    <div className="text-zinc-400 text-[10px]">Posting ke Komunitas Petani</div>
                  </div>
                </div>

                {/* Content textarea */}
                <textarea
                  value={postForm.konten}
                  onChange={(e) => setPostForm({ ...postForm, konten: e.target.value })}
                  placeholder="Apa yang ingin Anda bagikan hari ini? Pengalaman, tips bertani, info harga..."
                  rows={4}
                  className="w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-emerald-400 resize-none mb-3"
                />

                {/* Location */}
                <div className="relative mb-3">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
                  <input
                    value={postForm.lokasi}
                    onChange={(e) => setPostForm({ ...postForm, lokasi: e.target.value })}
                    placeholder={`Lokasi (${currentUser.lokasi || "opsional"})`}
                    className="w-full h-11 pl-10 pr-4 bg-emerald-50 border border-emerald-200 rounded-xl text-zinc-900 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Image preview */}
                {postImagePreview && (
                  <div className="relative mb-3 rounded-xl overflow-hidden border border-emerald-200">
                    <img src={postImagePreview} alt="preview" className="w-full object-cover max-h-40" />
                    <button
                      onClick={() => { setPostImage(null); setPostImagePreview(null); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-lg flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-600 font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                    Foto
                  </button>
                  <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <button
                    id="btn-submit-post"
                    onClick={handleSubmitPost}
                    disabled={posting || !postForm.konten.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl text-white font-bold text-sm shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {posting ? (
                      <span className="animate-pulse">Memposting...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Posting
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </MobileLayout>
  );
}
