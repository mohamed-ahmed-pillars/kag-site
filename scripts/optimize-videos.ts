#!/usr/bin/env bun
import { readdir, stat, rename, unlink, writeFile, access } from "node:fs/promises";
import { join, extname, relative } from "node:path";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";

if (!ffmpegPath) throw new Error("ffmpeg-static binary not found");
ffmpeg.setFfmpegPath(ffmpegPath);

const ROOT = new URL("..", import.meta.url).pathname;
const PUBLIC_DIR = join(ROOT, "public");
const MARKER = ".optimized";
const CRF = 26;
const MAX_BITRATE = "3000k";
const MAX_WIDTH = 1920;

type Stat = { file: string; before: number; after: number };

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (extname(entry.name).toLowerCase() === ".mp4") {
      out.push(full);
    }
  }
  return out;
}

async function isMarked(file: string) {
  try { await access(file + MARKER); return true; } catch { return false; }
}

function transcode(input: string, output: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .videoCodec("libx264")
      .outputOptions([
        `-crf ${CRF}`,
        "-preset slow",
        `-maxrate ${MAX_BITRATE}`,
        "-bufsize 6000k",
        "-pix_fmt yuv420p",
        "-movflags +faststart",
        `-vf scale='min(${MAX_WIDTH},iw)':'-2'`,
      ])
      .noAudio()
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .save(output);
  });
}

async function optimizeOne(file: string): Promise<Stat | null> {
  if (await isMarked(file)) return null;
  const before = (await stat(file)).size;
  const tmp = file + ".tmp.mp4";
  process.stdout.write(`  ${relative(ROOT, file)}: encoding... `);
  await transcode(file, tmp);
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
console.log(`Found ${files.length} videos. Optimizing (this takes a while)...\n`);

let totalBefore = 0, totalAfter = 0, processed = 0, skipped = 0;
for (const f of files) {
  const r = await optimizeOne(f);
  if (!r) { skipped++; console.log(`  ${relative(ROOT, f)}: already optimized`); continue; }
  processed++;
  totalBefore += r.before;
  totalAfter += r.after;
  const pct = ((1 - r.after / r.before) * 100).toFixed(0);
  console.log(`${human(r.before)} → ${human(r.after)} (-${pct}%)`);
}

console.log(`\nProcessed: ${processed}, skipped (already optimized): ${skipped}`);
console.log(`Total: ${human(totalBefore)} → ${human(totalAfter)} (saved ${human(totalBefore - totalAfter)})`);
