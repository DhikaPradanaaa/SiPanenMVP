// ══════════════════════════════════════════
//  Gemini AI Client — SiPanen
//  Model fallback: 2.5-flash → 2.0-flash-lite → 2.0-flash
// ══════════════════════════════════════════

const GEMINI_MODELS = [
  "gemini-2.5-flash",       // Prioritas utama — paling baru & stabil
  "gemini-2.0-flash-lite",  // Fallback — kuota gratis lebih besar
  "gemini-2.0-flash",       // Fallback terakhir
];

const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

// ── Data interface ─────────────────────────
export interface DataPanen {
  komoditas: string;
  luas_lahan?: number;
  tanggal_tanam?: string;
  estimasi_panen?: string;
  volume_estimasi?: number; // kg — dibagi 1000 untuk Ton
  lokasi?: string;
  status?: string;
}

// ── System prompt builder ──────────────────
export function buildSystemPrompt(dataPanen: DataPanen[]): string {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let lahanContext = "";
  if (dataPanen.length > 0) {
    lahanContext =
      "\n\nDATA LAHAN AKTIF PETANI INI:\n" +
      dataPanen
        .map(
          (d, i) =>
            `${i + 1}. ${d.komoditas}` +
            (d.luas_lahan ? ` | Luas: ${d.luas_lahan} Ha` : "") +
            (d.tanggal_tanam ? ` | Tanam: ${d.tanggal_tanam}` : "") +
            (d.estimasi_panen ? ` | Est. Panen: ${d.estimasi_panen}` : "") +
            (d.volume_estimasi
              ? ` | Est. Volume: ${(d.volume_estimasi / 1000).toFixed(1)} Ton`
              : "") +
            (d.lokasi ? ` | Lokasi: ${d.lokasi}` : "") +
            (d.status ? ` | Status: ${d.status}` : "")
        )
        .join("\n");
  } else {
    lahanContext = "\n\nPetani belum memiliki data lahan yang tercatat.";
  }

  return `Kamu adalah AI Asisten Tani SiPanen yang cerdas dan berpengalaman.

Hari ini: ${today}
${lahanContext}

PANDUAN RESPONS:
- Gunakan bahasa Indonesia yang ramah dan mudah dipahami petani
- Jika ditanya tentang data lahan di atas, berikan analisis spesifik
- Berikan rekomendasi praktis yang bisa langsung diterapkan
- Topik: prediksi panen, pupuk, hama/penyakit, cuaca, irigasi, harga pasar
- Format: singkat tapi informatif, gunakan poin-poin jika perlu`;
}

// ── Send message with multi-turn & fallback ─
export async function sendToGemini(
  message: string,
  history: { role: "user" | "model"; text: string }[],
  dataPanen: DataPanen[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    return "⚠️ API Key Gemini belum dikonfigurasi. Tambahkan VITE_GEMINI_API_KEY di file .env lalu restart server.";
  }

  const systemPrompt = buildSystemPrompt(dataPanen);

  // Simulasi system prompt via turn pertama user→model
  const contents = [
    { role: "user", parts: [{ text: "Kamu adalah siapa?" }] },
    {
      role: "model",
      parts: [{ text: systemPrompt + "\n\nSaya siap membantu!" }],
    },
    // History percakapan sebelumnya (multi-turn)
    ...history.map((h) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }],
    })),
    // Pesan terbaru
    { role: "user", parts: [{ text: message }] },
  ];

  const requestBody = {
    contents,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  };

  let lastError = "";

  for (const model of GEMINI_MODELS) {
    const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${apiKey}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 429) {
        lastError = `Rate limit pada ${model}`;
        continue;
      }
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        lastError = (err as any)?.error?.message || `HTTP ${response.status}`;
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        lastError = "Respons kosong dari model";
        continue;
      }

      return text; // ✅ Sukses
    } catch (err: any) {
      lastError = err.message || "Network error";
      continue;
    }
  }

  throw new Error(lastError || "Semua model Gemini tidak tersedia.");
}
