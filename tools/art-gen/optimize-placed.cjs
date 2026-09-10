const { readdirSync, readFileSync, writeFileSync, statSync } = require('fs');
const { join } = require('path');
const sharp = require('sharp');

const root = join(__dirname, '..', '..');
const artTs = readFileSync(join(root, 'app', 'src', 'assets', 'art.ts'), 'utf8');
const names = [...artTs.matchAll(/kr-[a-z0-9-]+\.png/g)].map((m) => m[0]);
const unique = [...new Set(names)];
const dir = join(root, 'app', 'assets', 'art');

(async () => {
  let saved = 0;
  for (const name of unique) {
    const path = join(dir, name);
    const before = statSync(path).size;
    const buf = await sharp(path)
      .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9, effort: 10 })
      .toBuffer();
    if (buf.length < before) {
      writeFileSync(path, buf);
      saved += before - buf.length;
      console.log(`${name} ${(before / 1024).toFixed(0)}k → ${(buf.length / 1024).toFixed(0)}k`);
    } else {
      console.log(`${name} kept ${(before / 1024).toFixed(0)}k`);
    }
  }
  const folder = readdirSync(dir)
    .filter((f) => f.endsWith('.png'))
    .reduce((n, f) => n + statSync(join(dir, f)).size, 0);
  console.log(`optimised ${unique.length} placed files, saved ${(saved / 1024 / 1024).toFixed(1)} MB`);
  console.log(`folder now ${(folder / 1024 / 1024).toFixed(1)} MB`);
})();
