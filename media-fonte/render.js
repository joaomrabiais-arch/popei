// Gera as imagens e os vídeos do produto usados em site/assets/. Uso: node media-fonte/render.js
// Precisa de Playwright e ffmpeg. CHROMIUM_PATH opcional.
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const OUT = path.join(__dirname, "..", "site", "assets");
const NAMES = { s1: "produto", s2: "beneficios", s3: "antes-depois", s4: "deposito", s5: "pack-3", s6: "comparacao", s7: "antes", s8: "depois", ad1: "anuncio-recargas", ad2: "anuncio-pelos", ad3: "anuncio-pack" };
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const p = await b.newPage({ viewport: { width: 1600, height: 1200 } });
  await p.goto("file://" + path.join(__dirname, "imagens-pt.html"));
  await p.evaluate(() => document.fonts.ready);
  for (const [id, name] of Object.entries(NAMES))
    await p.locator("#" + id).screenshot({ path: path.join(OUT, "img", "produto", name + ".jpg"), type: "jpeg", quality: 80 });
  // vídeos 720x1280 (mais leves para a web)
  await p.goto("file://" + path.join(__dirname, "animacao.html"));
  await p.evaluate(() => document.fonts.ready);
  for (const [scene, name] of [["sofa", "video-sofa"], ["fita", "video-fita"], ["sitios", "video-sitios"]]) {
    const dur = await p.evaluate((s) => duration(s), scene);
    const file = path.join(OUT, "video", name + ".mp4");
    const ff = spawn("ffmpeg", ["-y", "-v", "error", "-f", "image2pipe", "-framerate", "30", "-i", "-", "-vf", "scale=720:1280", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "24", "-preset", "medium", "-an", "-movflags", "+faststart", file], { stdio: ["pipe", "inherit", "inherit"] });
    for (let i = 0; i < dur * 30; i++) {
      const data = await p.evaluate(([s, t]) => { render(s, t); return document.getElementById("c").toDataURL("image/jpeg", 0.9).split(",")[1]; }, [scene, i / 30]);
      ff.stdin.write(Buffer.from(data, "base64"));
    }
    ff.stdin.end(); await new Promise((r) => ff.on("close", r));
    await new Promise((r) => spawn("ffmpeg", ["-y", "-v", "error", "-ss", "4", "-i", file, "-frames:v", "1", "-vf", "scale=540:-1", "-q:v", "5", path.join(OUT, "video", name + ".jpg")]).on("close", r));
  }
  await b.close();
})();
