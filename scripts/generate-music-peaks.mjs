import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const MUSIC_DIR = path.join(process.cwd(), "public", "music");
const PEAKS_DIR = path.join(MUSIC_DIR, "peaks");
const BAR_COUNT = 400;
const SAMPLE_RATE = 3000;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: options.encoding ?? null,
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 64 * 1024 * 1024,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    const stderr =
      typeof result.stderr === "string"
        ? result.stderr
        : result.stderr?.toString("utf8");
    throw new Error(
      `${command} exited with code ${result.status}\n${stderr ?? ""}`.trim()
    );
  }

  return result.stdout;
}

function formatDurationLabel(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function getDurationSeconds(filePath) {
  const stdout = run("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    filePath,
  ], { encoding: "utf8" });

  return Number.parseFloat(stdout.toString().trim());
}

function getNormalizedPeaks(filePath, barCount) {
  const rawAudio = run("ffmpeg", [
    "-v",
    "error",
    "-i",
    filePath,
    "-ac",
    "1",
    "-ar",
    String(SAMPLE_RATE),
    "-f",
    "f32le",
    "pipe:1",
  ]);

  const buffer = rawAudio.buffer.slice(
    rawAudio.byteOffset,
    rawAudio.byteOffset + rawAudio.byteLength
  );
  const samples = new Float32Array(buffer);
  const bucketSize = Math.max(1, Math.ceil(samples.length / barCount));
  const peaks = [];

  for (let index = 0; index < barCount; index += 1) {
    const start = index * bucketSize;
    const end = Math.min(start + bucketSize, samples.length);
    let max = 0;

    for (let sampleIndex = start; sampleIndex < end; sampleIndex += 1) {
      const value = Math.abs(samples[sampleIndex]);
      if (value > max) {
        max = value;
      }
    }

    peaks.push(max);
  }

  const maxPeak = Math.max(...peaks, 1e-6);
  return peaks.map((peak) => Math.max(4, Math.round((peak / maxPeak) * 100)));
}

function ensurePeaksDir() {
  fs.mkdirSync(PEAKS_DIR, { recursive: true });
}

function main() {
  ensurePeaksDir();

  const audioFiles = fs
    .readdirSync(MUSIC_DIR)
    .filter((fileName) => fileName.endsWith(".mp3"))
    .sort();

  const manifest = {
    generatedAt: new Date().toISOString(),
    sampleRate: SAMPLE_RATE,
    barCount: BAR_COUNT,
    tracks: {},
  };

  for (const fileName of audioFiles) {
    const filePath = path.join(MUSIC_DIR, fileName);
    const durationSeconds = getDurationSeconds(filePath);
    const durationLabel = formatDurationLabel(durationSeconds);
    const peaks = getNormalizedPeaks(filePath, BAR_COUNT);
    const trackData = {
      fileName,
      src: `/music/${fileName}`,
      durationSeconds,
      durationLabel,
      peaks,
    };

    manifest.tracks[fileName] = trackData;
    fs.writeFileSync(
      path.join(PEAKS_DIR, `${path.parse(fileName).name}.json`),
      `${JSON.stringify(trackData, null, 2)}\n`,
      "utf8"
    );

    console.log(`Generated peaks for ${fileName} (${durationLabel})`);
  }

  fs.writeFileSync(
    path.join(PEAKS_DIR, "index.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  console.log(`Wrote manifest to ${path.join(PEAKS_DIR, "index.json")}`);
}

main();
