import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const AUDIO_EXT = [".mp3", ".m4a", ".ogg", ".wav", ".webm"];

function getMusicDir(): string | null {
  const cwd = process.cwd();
  const candidates = [
    process.env.MUSIC_DIR,
    path.join(cwd, "apps", "web", "public", "music"),
    path.join(cwd, "public", "music"),
  ].filter(Boolean) as string[];

  for (const dir of candidates) {
    const resolved = path.resolve(dir);
    if (fs.existsSync(resolved)) return resolved;
  }
  return null;
}

export async function GET() {
  try {
    const musicDir = getMusicDir();
    if (!musicDir) {
      return NextResponse.json({ tracks: [] });
    }

    const files = fs.readdirSync(musicDir);
    const tracks = files
      .filter((f) => AUDIO_EXT.some((ext) => f.toLowerCase().endsWith(ext)))
      .map((f) => {
        const basename = path.basename(f, path.extname(f));
        return {
          src: `/music/${encodeURIComponent(f)}`,
          title: basename.replace(/[-_]/g, " "),
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json({ tracks });
  } catch (err) {
    console.error("[api/music]", err);
    return NextResponse.json({ tracks: [] });
  }
}
