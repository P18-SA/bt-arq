// Importa las fotos de la web anterior (repo bmtarq) a public/obras/<slug>/ y regenera photos.ts.
// Uso: node scripts/import-photos.mjs ../bmtarq
// Busca en el repo la carpeta de cada proyecto (campo `source` de content.ts, p. ej. "obra-nueva/casa-carrasco"),
// toma 00.jpg como portada y slider/*.jpg como galería. Copia los archivos originales, sin recomprimir,
// y avisa cuando una foto mide menos de 1600 px de ancho (se verá blanda en pantallas grandes).
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "../bmtarq");
const repo = path.resolve(import.meta.dirname, "..");
const content = fs.readFileSync(path.join(repo, "src/components/site/content.ts"), "utf8");

const slugify = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const entries = [...content.matchAll(/name: "([^"]+)"[\s\S]*?source: "([^"]+)"/g)].map((m) => ({ slug: slugify(m[1]), source: m[2] }));

const IMG = /\.(jpe?g|png|webp|avif)$/i;
function findDir(dir, tail, depth = 0) {
  if (depth > 6) return null;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name === "node_modules" || e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (full.replaceAll("\\", "/").toLowerCase().endsWith(tail.toLowerCase())) return full;
    const hit = findDir(full, tail, depth + 1);
    if (hit) return hit;
  }
  return null;
}

// Ancho de un JPEG leyendo el marcador SOF, sin dependencias
function jpegWidth(file) {
  const b = fs.readFileSync(file);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) return null;
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return b.readUInt16BE(i + 7);
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

const manifest = {};
for (const { slug, source } of entries) {
  const dir = findDir(root, source);
  if (!dir) { console.warn(`— sin carpeta: ${source}`); continue; }
  const cover = fs.readdirSync(dir).filter((f) => IMG.test(f)).sort();
  const sliderDir = path.join(dir, "slider");
  const slider = fs.existsSync(sliderDir) ? fs.readdirSync(sliderDir).filter((f) => IMG.test(f)).sort().map((f) => path.join("slider", f)) : [];
  const files = [...cover, ...slider];
  if (!files.length) { console.warn(`— sin fotos: ${source}`); continue; }
  const out = path.join(repo, "public/obras", slug);
  fs.mkdirSync(out, { recursive: true });
  manifest[slug] = files.map((f, i) => {
    const ext = path.extname(f).toLowerCase();
    const name = `${String(i).padStart(2, "0")}${ext}`;
    const src = path.join(dir, f);
    fs.copyFileSync(src, path.join(out, name));
    const w = /jpe?g/.test(ext) ? jpegWidth(src) : null;
    if (w && w < 1600) console.warn(`  ! ${slug}/${name}: ${w}px de ancho, conviene una versión en alta`);
    return `/obras/${slug}/${name}`;
  });
  console.log(`✓ ${slug}: ${files.length} fotos`);
}

fs.writeFileSync(
  path.join(repo, "src/components/site/photos.ts"),
  `// Generado por scripts/import-photos.mjs. No editar a mano.\n// Slug del proyecto -> fotos en orden (la primera es la portada).\nexport const photos: Record<string, string[]> = ${JSON.stringify(manifest, null, 2)};\n`,
);
console.log(`\n${Object.keys(manifest).length}/${entries.length} proyectos con fotos.`);
