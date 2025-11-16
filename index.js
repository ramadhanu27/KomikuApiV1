const express = require("express");

// Tambahkan penanganan error global
process.on("uncaughtException", (err) => {
  console.error("Ada error yang tidak tertangkap:", err);
  // Tidak exit process agar aplikasi tetap berjalan
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Tidak exit process agar aplikasi tetap berjalan
});

const app = express();
const port = process.env.PORT || 3005;
const rateLimiter = require("./middleware/rateLimiter");
const path = require("path");

const endpoints = [
  { path: "/rekomendasi", description: "Latest rekomendasi manga", params: "None" },
  { path: "/terbaru", description: "Fresh chapter releases", params: "None" },
  { path: "/pustaka", description: "Home library highlights", params: "None" },
  { path: "/berwarna", description: "Colored manga selection", params: "None" },
  { path: "/komik-populer", description: "Popular Komiku titles", params: "None" },
  { path: "/detail-komik/:slug", description: "Manga metadata by slug", params: "slug" },
  { path: "/baca-chapter/:slug/:chapter", description: "Chapter images by slug", params: "slug, chapter" },
  { path: "/search", description: "Search Komiku by keyword", params: "q" },
  { path: "/genre-all", description: "List of available genres", params: "None" },
  { path: "/genre-detail/:slug", description: "Manga within a genre", params: "slug" },
  { path: "/genre-rekomendasi", description: "Featured genre picks", params: "None" },
];

// Serve static files from docs folder
app.use(express.static(path.join(__dirname, "docs")));

app.use(rateLimiter);

// Middleware for CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

const rekomendasiRoute = require("./routes/rekomendasi");
const terbaruRoute = require("./routes/terbaru");
const pustakaRouter = require("./routes/pustaka");
const komikPopulerRoute = require("./routes/komik-populer");
const detailKomikRoute = require("./routes/detail-komik");
const bacaChapterRoute = require("./routes/baca-chapter");
const searchRoute = require("./routes/search");
const berwarnaRoute = require("./routes/berwarna");
const genreAll = require("./routes/genre-all");
const genreDetail = require("./routes/genre-detail");
const genreRekomendasi = require("./routes/genre-rekomendasi");

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Komiku Rest API",
    version: "1.0.0",
    endpoints: endpoints.map((endpoint) => endpoint.path),
    docs: "Visit /docs for interactive documentation",
  });
});

app.use("/rekomendasi", rekomendasiRoute);
app.use("/terbaru", terbaruRoute);
app.use("/pustaka", pustakaRouter);
app.use("/komik-populer", komikPopulerRoute);
app.use("/detail-komik", detailKomikRoute);
app.use("/baca-chapter", bacaChapterRoute);
app.use("/search", searchRoute);
app.use("/berwarna", berwarnaRoute);
app.use("/genre-all", genreAll);
app.use("/genre-rekomendasi", genreRekomendasi);
app.use("/genre", genreDetail);

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});

module.exports = app;
