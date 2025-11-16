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
  });
});

app.get("/docs", (req, res) => {
  const rows = endpoints
    .map(
      (endpoint) => `
        <tr class="border-b">
          <td class="p-4 text-slate-900 font-semibold">${endpoint.path}</td>
          <td class="p-4 text-slate-700">${endpoint.description}</td>
          <td class="p-4 text-slate-700">${endpoint.params}</td>
        </tr>
      `
    )
    .join("");

  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Komiku Rest API Docs</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 min-h-screen text-white">
      <div class="max-w-5xl mx-auto px-4 py-16 space-y-10">
        <div class="space-y-3 text-center">
          <p class="text-lg uppercase tracking-[0.4em] text-slate-400">Komiku Rest API</p>
          <h1 class="text-4xl font-bold text-white">API Documentation</h1>
          <p class="text-slate-300">
            Fresh scraping-powered endpoints that mirror komiku.id content, protected
            with rate limiting and CORS middleware.
          </p>
        </div>

        <div class="bg-slate-900/60 border border-white/10 rounded-2xl shadow-2xl">
          <div class="p-6 border-b border-white/10">
            <h2 class="text-2xl font-semibold">Endpoints</h2>
            <p class="text-slate-400 text-sm">Hit any route with GET to receive JSON responses.</p>
          </div>
          <div class="overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-slate-950/60 text-slate-300 text-sm uppercase tracking-[0.2em]">
                <tr>
                  <th class="p-4">Path</th>
                  <th class="p-4">Description</th>
                  <th class="p-4">Params</th>
                </tr>
              </thead>
              <tbody class="bg-white/5 text-sm">${rows}</tbody>
            </table>
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-3">
          <article class="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-3">
            <h3 class="text-lg font-semibold">Environment</h3>
            <p class="text-sm text-slate-300">
              Node.js v18+ is required (see <code class="bg-slate-800 rounded px-1">package.json</code>).
              The app is stateless and works in serverless environments or on-premises servers.
            </p>
          </article>
          <article class="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-3">
            <h3 class="text-lg font-semibold">Security</h3>
            <p class="text-sm text-slate-300">
              Rate limiting prevents abuse. CORS headers allow public frontends to consume the API.
            </p>
          </article>
          <article class="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-3">
            <h3 class="text-lg font-semibold">Usage</h3>
            <p class="text-sm text-slate-300">
              Run <code class="bg-slate-800 rounded px-1">npm run dev</code> for development with nodemon or
              <code class="bg-slate-800 rounded px-1">npm start</code> for production.
            </p>
          </article>
        </div>
      </div>
    </body>
  </html>`;

  res.type("html").send(html);
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
