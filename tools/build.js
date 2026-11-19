// Monta a app Brota num único ficheiro (app/index.html) a partir dos módulos em app/src/.
// Uso: npm run build
//   app/src/index.html  → esqueleto (head, ecrãs, ícones) com os marcadores /* @css */ e // @js
//   app/src/css/*.css   → estilos, por ordem alfabética
//   app/src/js/*.js     → lógica, por ordem alfabética (o prefixo numérico define a ordem)
const fs = require("fs"), path = require("path");
const SRC = path.join(__dirname, "../app/src"), OUT = path.join(__dirname, "../app/index.html");
const read = (dir) => fs.readdirSync(path.join(SRC, dir)).filter(f => !f.startsWith(".")).sort()
  .map(f => fs.readFileSync(path.join(SRC, dir, f), "utf8").replace(/\s+$/, "")).join("\n");
const tpl = fs.readFileSync(path.join(SRC, "index.html"), "utf8");
if (!tpl.includes("/* @css */") || !tpl.includes("// @js")) throw new Error("O esqueleto precisa dos marcadores /* @css */ e // @js");
const html = tpl.replace("/* @css */", () => read("css")).replace("// @js", () => read("js"));
fs.writeFileSync(OUT, html);
console.log(`app/index.html montado (${(html.length / 1024).toFixed(0)} KB)`);
