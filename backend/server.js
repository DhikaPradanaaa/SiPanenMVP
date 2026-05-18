const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database setup
const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        lokasi TEXT,
        jenisUsaha TEXT,
        role TEXT,
        foto TEXT
      )`,
      (err) => {
        if (err) console.error("Error creating users table: " + err.message);
      }
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS plants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        komoditas TEXT NOT NULL,
        tanggalTanam TEXT NOT NULL,
        luasLahan REAL NOT NULL,
        lokasi TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) console.error("Error creating plants table: " + err.message);
      }
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        role TEXT,
        kategori TEXT NOT NULL,
        pesan TEXT NOT NULL,
        rating INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) console.error("Error creating feedback table: " + err.message);
      }
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS komunitas_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        nama TEXT NOT NULL,
        foto TEXT,
        lokasi TEXT,
        konten TEXT NOT NULL,
        foto_post TEXT,
        likes INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) console.error("Error creating komunitas_posts table: " + err.message);
      }
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS komunitas_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        userId TEXT,
        nama TEXT NOT NULL,
        konten TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) console.error("Error creating komunitas_comments table: " + err.message);
      }
    );
  }
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Routes

// 1. Register User
app.post("/api/register", (req, res) => {
  const { nama, email, password, lokasi, jenisUsaha, role } = req.body;
  if (!nama || !email || !password || !role) {
    return res.status(400).json({ error: "Data registrasi tidak lengkap." });
  }

  const sql = `INSERT INTO users (nama, email, password, lokasi, jenisUsaha, role, foto) VALUES (?, ?, ?, ?, ?, ?, NULL)`;
  const params = [nama, email, password, lokasi, jenisUsaha, role];

  db.run(sql, params, function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "Email sudah digunakan." });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: "Registrasi berhasil" });
  });
});

// 2. Get User Profile
app.get("/api/user/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT id, nama, email, lokasi, jenisUsaha, role, foto FROM users WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "User tidak ditemukan" });
    res.json(row);
  });
});

// 3. Upload Photo
app.post("/api/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Tidak ada file yang diunggah" });
  }
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// 4. Update User Profile
app.put("/api/user/:id", (req, res) => {
  const { id } = req.params;
  const { nama, email, lokasi, jenisUsaha, foto } = req.body;

  const sql = `UPDATE users SET nama = ?, email = ?, lokasi = ?, jenisUsaha = ?, foto = ? WHERE id = ?`;
  const params = [nama, email, lokasi, jenisUsaha, foto, id];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "User tidak ditemukan" });
    res.json({ message: "Profil berhasil diperbarui" });
  });
});

// 5. Add Plant Data
app.post("/api/plants", (req, res) => {
  const { userId, komoditas, tanggalTanam, luasLahan, lokasi } = req.body;
  if (!userId || !komoditas || !tanggalTanam || !luasLahan || !lokasi) {
    return res.status(400).json({ error: "Data tanam tidak lengkap." });
  }

  const sql = `INSERT INTO plants (user_id, komoditas, tanggalTanam, luasLahan, lokasi) VALUES (?, ?, ?, ?, ?)`;
  const params = [userId, komoditas, tanggalTanam, luasLahan, lokasi];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: "Data tanam berhasil disimpan" });
  });
});

// 6. Get AI Predictions (Simulated Expert System)
app.get("/api/predictions/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = `SELECT * FROM plants WHERE user_id = ? ORDER BY createdAt DESC`;
  db.all(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const baseDurations = {
      padi: 100,
      jagung: 90,
      kedelai: 85,
      cabai: 80,
      tomat: 75,
      bawang: 65,
    };

    const yieldPerHectare = {
      padi: 6.5,
      jagung: 5.0,
      kedelai: 3.0,
      cabai: 10.0,
      tomat: 15.0,
      bawang: 10.0,
    };

    const predictions = rows.map(plant => {
      const duration = baseDurations[plant.komoditas.toLowerCase()] || 90;
      const weatherDeviation = (plant.id % 11) - 5; 
      const totalDays = duration + weatherDeviation;
      
      const plantDate = new Date(plant.tanggalTanam);
      const harvestDate = new Date(plantDate);
      harvestDate.setDate(plantDate.getDate() + totalDays);
      
      const today = new Date();
      const diffTime = harvestDate.getTime() - today.getTime();
      let daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (daysLeft < 0) daysLeft = 0;

      let progress = Math.round(((totalDays - daysLeft) / totalDays) * 100);
      if (progress > 100) progress = 100;
      if (progress < 0) progress = 0;

      const baseYield = yieldPerHectare[plant.komoditas.toLowerCase()] || 5.0;
      const accuracy = 90 + (plant.lokasi.length % 9); 
      const estVolume = (plant.luasLahan * baseYield * (accuracy/100)).toFixed(1);

      return {
        id: plant.id,
        komoditas: plant.komoditas.charAt(0).toUpperCase() + plant.komoditas.slice(1),
        varietas: "Varietas Unggul",
        luas: `${plant.luasLahan} Ha`,
        lokasiDetail: plant.lokasi,
        lokasi: plant.lokasi, // for backward compatibility with PrediksiPanen.tsx
        tanggalTanam: plantDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        prediksiPanen: harvestDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        hariTersisa: daysLeft, // for backward compatibility
        sisaHari: daysLeft,
        estimasiVolume: `${estVolume} Ton`, // for backward compatibility
        estimasiHasil: `${estVolume} Ton`,
        estimasiPerHa: `${baseYield.toFixed(1)} Ton/Ha`,
        akurasi: accuracy, // for backward compatibility
        confidence: accuracy,
        status: daysLeft <= 7 ? "ready" : "on-track", // for backward compatibility
        fase: daysLeft <= 7 ? "Siap Panen" : progress > 50 ? "Pertumbuhan" : "Fase Awal",
        progress: progress, // for backward compatibility
        faseProgress: progress,
        kesehatan: accuracy > 92 ? "Baik" : "Perlu Perhatian",
        kesehatanScore: accuracy - 2,
        risikoGagal: 100 - accuracy,
        phases: [
          { nama: "Semai", selesai: progress > 10 },
          { nama: "Vegetatif", selesai: progress > 40 },
          { nama: "Reproduktif", selesai: progress > 70 },
          { nama: "Pematangan", selesai: progress > 90 },
          { nama: "Panen", selesai: progress >= 100 },
        ],
        rekomendasi: [
          { tipe: daysLeft <= 7 ? "urgent" : "info", text: daysLeft <= 7 ? "Panen segera dalam beberapa hari ke depan untuk kualitas optimal." : "Kondisi tanaman terpantau normal berdasarkan analisis AI." },
          { tipe: "tip", text: "Pantau terus kondisi kelembaban tanah." }
        ],
        growthData: [
          { minggu: "M1", tinggi: Math.round(progress * 0.1) },
          { minggu: "M2", tinggi: Math.round(progress * 0.4) },
          { minggu: "M3", tinggi: Math.round(progress * 0.8) },
          { minggu: "M4", tinggi: Math.round(progress) },
        ]
      };
    });

    res.json(predictions);
  });
});

// ── FEEDBACK ROUTES ──

// POST feedback
app.post("/api/feedback", (req, res) => {
  const { userId, role, kategori, pesan, rating } = req.body;
  if (!kategori || !pesan || !rating) {
    return res.status(400).json({ error: "Data feedback tidak lengkap." });
  }
  const sql = `INSERT INTO feedback (userId, role, kategori, pesan, rating) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [userId || null, role || null, kategori, pesan, rating], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: "Feedback berhasil dikirim" });
  });
});

// GET all feedback (for admin/debug)
app.get("/api/feedback", (req, res) => {
  db.all(`SELECT * FROM feedback ORDER BY createdAt DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ── KOMUNITAS ROUTES ──

// GET all posts
app.get("/api/komunitas", (req, res) => {
  db.all(`SELECT * FROM komunitas_posts ORDER BY createdAt DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new post (with optional image)
const uploadPost = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads/")),
    filename: (req, file, cb) => {
      const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, "post-" + suffix + path.extname(file.originalname));
    },
  }),
});

app.post("/api/komunitas", uploadPost.single("foto_post"), (req, res) => {
  const { userId, nama, foto, lokasi, konten } = req.body;
  if (!nama || !konten) {
    return res.status(400).json({ error: "Nama dan konten wajib diisi." });
  }
  const foto_post = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;
  const sql = `INSERT INTO komunitas_posts (userId, nama, foto, lokasi, konten, foto_post) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [userId || null, nama, foto || null, lokasi || null, konten, foto_post], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: "Post berhasil dibuat" });
  });
});

// POST like toggle
app.post("/api/komunitas/:id/like", (req, res) => {
  const { id } = req.params;
  const { increment } = req.body; // true = like, false = unlike
  const sql = increment
    ? `UPDATE komunitas_posts SET likes = likes + 1 WHERE id = ?`
    : `UPDATE komunitas_posts SET likes = MAX(0, likes - 1) WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Like diperbarui" });
  });
});

// GET comments for a post
app.get("/api/komunitas/:id/comments", (req, res) => {
  const { id } = req.params;
  db.all(`SELECT * FROM komunitas_comments WHERE post_id = ? ORDER BY createdAt ASC`, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST a comment
app.post("/api/komunitas/:id/comments", (req, res) => {
  const { id } = req.params;
  const { userId, nama, konten } = req.body;
  if (!nama || !konten) {
    return res.status(400).json({ error: "Nama dan konten komentar wajib diisi." });
  }
  const sql = `INSERT INTO komunitas_comments (post_id, userId, nama, konten) VALUES (?, ?, ?, ?)`;
  db.run(sql, [id, userId || null, nama, konten], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: "Komentar berhasil ditambahkan" });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
