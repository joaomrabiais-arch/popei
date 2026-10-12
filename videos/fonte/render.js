// Gera os MP4 a partir de animacao.html. Uso: node render.js <pasta_saida> [cena ...] [--stills]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const FPS = 30;
(async () => {
  const [out, ...rest] = process.argv.slice(2);
  const stills = rest.includes('--stills');
  const scenes = rest.filter(a => !a.startsWith('--'));
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage();
  await p.goto('file://' + path.join(__dirname, 'animacao.html'));
  await p.evaluate(() => document.fonts.ready);
  const frame = (s, t) => p.evaluate(([s, t]) => { render(s, t); return document.getElementById('c').toDataURL('image/jpeg', 0.93).split(',')[1]; }, [s, t]);
  for (const s of scenes) {
    const dur = await p.evaluate(s => duration(s), s);
    if (stills) {
      for (const t of [1, 4, 7.5, 10.5]) require('fs').writeFileSync(`${out}/${s}_${t}.jpg`, Buffer.from(await frame(s, t), 'base64'));
      continue;
    }
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '20', '-c:a', 'aac', '-movflags', '+faststart',
      `${out}/${s}.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < dur * FPS; i++) ff.stdin.write(Buffer.from(await frame(s, i / FPS), 'base64'));
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    console.log('ok', s);
  }
  await b.close();
})();
