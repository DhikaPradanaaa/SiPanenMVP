const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Gagal membuka database:", err.message);
  } else {
    db.all("SELECT id, nama, email, role, lokasi, jenisUsaha FROM users", [], (err, rows) => {
      if (err) {
        console.error("Gagal mengambil data:", err.message);
      } else {
        console.log("\n=== Data Pengguna di Database ===");
        console.table(rows);
        console.log("=================================\n");
      }
      db.close();
    });
  }
});
