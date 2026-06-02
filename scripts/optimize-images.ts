#!/usr/bin/env bun
import { readdir, stat, rename, unlink, writeFile, access } from "node:fs/promises";
import { join, extname, relative } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const PUBLIC_DIR = join(ROOT, "public");
const MARKER = ".optimized";
const MAX_WIDTH = 2400;
const PNG_QUALITY = 80;
const JPG_QUALITY = 82;
const WEBP_QUALITY = 82;

const SKIP_DIRS = new Set(["fonts"]);
const IMG_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

type Stat = { file: string; before: number; after: number };

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      out.push(...(await walk(full)));
    } else if (IMG_EXTS.has(extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

async function isMarked(file: string) {
  try { await access(file + MARKER); return true; } catch { return false; }
}

async function optimizeOne(file: string): Promise<Stat | null> {
  if (await isMarked(file)) return null;
  const before = (await stat(file)).size;
  const ext = extname(file).toLowerCase();
  const tmp = file + ".tmp";

  let pipeline = sharp(file, { failOn: "none" }).rotate();
  const meta = await sharp(file).metadata();
  if (meta.width && meta.width > MAX_WIDTH) pipeline = pipeline.resize({ width: MAX_WIDTH });

  if (ext === ".png") {
    pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: WEBP_QUALITY });
  } else {
    pipeline = pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true });
  }

  await pipeline.withMetadata({}).toFile(tmp);
  const after = (await stat(tmp)).size;

  if (after < before) {
    await rename(tmp, file);
  } else {
    await unlink(tmp);
  }
  await writeFile(file + MARKER, "");
  return { file: relative(ROOT, file), before, after: Math.min(before, after) };
}

const human = (b: number) => (b / 1024 / 1024).toFixed(2) + " MB";

const files = await walk(PUBLIC_DIR);
console.log(`Found ${files.length} images. Optimizing...\n`);

let totalBefore = 0, totalAfter = 0, processed = 0, skipped = 0;
for (const f of files) {
  const r = await optimizeOne(f);
  if (!r) { skipped++; continue; }
  processed++;
  totalBefore += r.before;
  totalAfter += r.after;
  const pct = ((1 - r.after / r.before) * 100).toFixed(0);
  console.log(`  ${r.file}: ${human(r.before)} → ${human(r.after)} (-${pct}%)`);
}

console.log(`\nProcessed: ${processed}, skipped (already optimized): ${skipped}`);
console.log(`Total: ${human(totalBefore)} → ${human(totalAfter)} (saved ${human(totalBefore - totalAfter)})`);
