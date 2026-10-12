// Servidor estático mínimo para pré-visualizar e testar site/ (sem dependências).
// Uso: node tests/serve.js [porta]   →  http://localhost:4173
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..", "site");
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".webp": "image/webp", ".mp4": "video/mp4", ".xml": "application/xml", ".txt": "text/plain", ".webmanifest": "application/manifest+json" };
function start(port = 4173) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    const file = path.join(ROOT, path.normalize(p));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404, { "Content-Type": TYPES[".html"] });
      return fs.createReadStream(path.join(ROOT, "404.html")).pipe(res);
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((r) => server.listen(port, () => r(server)));
}
if (require.main === module) start(+process.argv[2] || 4173).then(() => console.log("http://localhost:" + (+process.argv[2] || 4173)));
module.exports = { start, ROOT };
