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

const baseUrl = "https://komiku-api-v1.vercel.app";

const endpoints = [
  {
    method: "GET",
    path: "/rekomendasi",
    description: "Latest rekomendasi manga",
    params: "-",
    sample: "/rekomendasi",
  },
  {
    method: "GET",
    path: "/terbaru",
    description: "Fresh chapter releases",
    params: "-",
    sample: "/terbaru",
  },
  {
    method: "GET",
    path: "/pustaka",
    description: "Home library highlights",
    params: "-",
    sample: "/pustaka",
  },
  {
    method: "GET",
    path: "/berwarna",
    description: "Colored manga selection",
    params: "-",
    sample: "/berwarna",
  },
  {
    method: "GET",
    path: "/komik-populer",
    description: "Popular Komiku titles",
    params: "-",
    sample: "/komik-populer",
  },
  {
    method: "GET",
    path: "/detail-komik/:slug",
    description: "Manga metadata by slug",
    params: "slug",
    sample: "/detail-komik/one-piece",
  },
  {
    method: "GET",
    path: "/baca-chapter/:slug/:chapter",
    description: "Chapter images by slug",
    params: "slug, chapter",
    sample: "/baca-chapter/one-piece/chapter-1",
  },
  {
    method: "GET",
    path: "/search",
    description: "Search Komiku by keyword",
    params: "q",
    sample: "/search?q=one-piece",
  },
  {
    method: "GET",
    path: "/genre-all",
    description: "List of available genres",
    params: "-",
    sample: "/genre-all",
  },
  {
    method: "GET",
    path: "/genre-detail/:slug",
    description: "Manga within a genre",
    params: "slug",
    sample: "/genre-detail/action",
  },
  {
    method: "GET",
    path: "/genre-rekomendasi",
    description: "Featured genre picks",
    params: "-",
    sample: "/genre-rekomendasi",
  },
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
    .map((endpoint) => {
      const examplePath = endpoint.sample || endpoint.path;
      const exampleUrl = `${baseUrl}${examplePath}`;
      return `
        <tr class="border-b border-white/5 hover:bg-white/5 transition">
          <td class="p-4"><span class="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-300">${endpoint.method}</span></td>
          <td class="p-4 text-slate-100 font-semibold">${endpoint.path}</td>
          <td class="p-4 text-slate-300">${endpoint.description}</td>
          <td class="p-4 text-slate-400 text-sm">${endpoint.params}</td>
          <td class="p-4 text-slate-300">
            <a href="${exampleUrl}" target="_blank" rel="noreferrer" class="text-emerald-300 hover:text-emerald-200 underline-offset-4">${exampleUrl}</a>
          </td>
        </tr>
      `;
    })
    .join("");

  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Komiku Rest API Docs</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 min-h-screen text-white antialiased">
      <div class="relative isolate overflow-hidden">
        <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_rgba(2,6,23,1))]"></div>
        <header class="max-w-6xl mx-auto px-6 py-16 text-center space-y-6">
          <p class="text-sm uppercase tracking-[0.4em] text-emerald-300/70">Komiku Rest API</p>
          <h1 class="text-4xl md:text-5xl font-bold">Docs & Playground</h1>
          <p class="text-slate-300 max-w-3xl mx-auto">
            Explore the public endpoints served from <span class="text-white font-semibold">komiku-api-v1.vercel.app</span>.
            Every response is scraped in real time from <span class="text-white font-semibold">komiku.id</span> with rate-limiting & CORS protection enabled by default.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a href="${baseUrl}" target="_blank" rel="noreferrer" class="px-6 py-3 bg-emerald-500 text-slate-900 font-semibold rounded-full shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition">Open Base URL</a>
            <button id="copyBaseUrl" class="px-6 py-3 border border-white/20 rounded-full text-sm tracking-wide hover:border-white/60 transition">Copy Base URL</button>
          </div>
          <div class="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm text-slate-200">
            <span class="text-slate-400">Base URL</span>
            <span class="font-mono text-emerald-300">${baseUrl}</span>
          </div>
        </header>
      </div>

      <main class="max-w-6xl mx-auto px-6 pb-20 space-y-16">
        <section class="grid gap-8 md:grid-cols-2">
          <article class="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
            <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Quick Start</p>
            <h2 class="text-2xl font-semibold">Fetch in JavaScript</h2>
            <p class="text-slate-300">Copy-paste the snippet below to consume any endpoint in your frontend or Node.js app.</p>
            <pre class="bg-slate-900 rounded-xl p-5 text-sm overflow-auto"><code>fetch("${baseUrl}/rekomendasi")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
</code></pre>
          </article>
          <article class="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
            <p class="text-sm uppercase tracking-[0.3em] text-slate-400">CLI</p>
            <h2 class="text-2xl font-semibold">Curl Example</h2>
            <p class="text-slate-300">Ideal for quick debugging or building integrations from the terminal.</p>
            <pre class="bg-slate-900 rounded-xl p-5 text-sm overflow-auto"><code>curl "${baseUrl}/detail-komik/one-piece" \
  -H "Accept: application/json"</code></pre>
          </article>
        </section>

        <section class="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div class="p-8 border-b border-white/10 flex flex-col gap-2">
            <p class="text-sm uppercase tracking-[0.3em] text-slate-400">Endpoints</p>
            <h2 class="text-3xl font-semibold">Public Routes</h2>
            <p class="text-slate-300 text-sm">All routes currently expose GET responses with JSON payloads.</p>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm min-w-[720px]">
              <thead class="bg-white/5 text-slate-400 uppercase text-xs tracking-[0.3em]">
                <tr>
                  <th class="p-4">Method</th>
                  <th class="p-4">Endpoint</th>
                  <th class="p-4">Description</th>
                  <th class="p-4">Params</th>
                  <th class="p-4">Example</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </section>

        <section class="grid gap-8 md:grid-cols-2">
          <article class="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-white/10 rounded-3xl p-8 space-y-4">
            <h3 class="text-2xl font-semibold text-white">Response Preview</h3>
            <p class="text-slate-200 text-sm">Actual payload shape may vary per endpoint, but generally contains title, metadata, and chapter arrays.</p>
            <pre class="bg-slate-900/80 rounded-2xl p-5 text-xs md:text-sm overflow-auto"><code>{
  "title": "One Piece",
  "status": "Ongoing",
  "genres": ["Action", "Adventure"],
  "chapters": [
    {
      "chapter": "1096",
      "url": "https://komiku.id/one-piece/"
    }
  ]
}</code></pre>
          </article>
          <article class="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
            <h3 class="text-2xl font-semibold">Operational Notes</h3>
            <ul class="space-y-3 text-slate-300 text-sm">
              <li>• Rate limiting via <code class="bg-slate-900 px-1 rounded">middleware/rateLimiter.js</code> shields public deployments.</li>
              <li>• Global error handlers keep the server alive on unexpected failures.</li>
              <li>• CORS headers are wide open to support browser-based apps and demos.</li>
              <li>• Deploy-ready on Vercel/Render/Fly.io; no persistent storage required.</li>
            </ul>
          </article>
        </section>
      </main>

      <footer class="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        Built with Express + Tailwind. Source available on GitHub.
      </footer>

      <script>
        const copyBtn = document.getElementById("copyBaseUrl");
        if (copyBtn) {
          copyBtn.addEventListener("click", async () => {
            try {
              await navigator.clipboard.writeText("${baseUrl}");
              copyBtn.textContent = "Copied!";
              setTimeout(() => (copyBtn.textContent = "Copy Base URL"), 1500);
            } catch (err) {
              copyBtn.textContent = "Copy failed";
              setTimeout(() => (copyBtn.textContent = "Copy Base URL"), 1500);
            }
          });
        }
      </script>
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
