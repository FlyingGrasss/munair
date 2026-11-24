import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type InstagramFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500 | 700;
  style: "normal";
};

let fontsPromise: Promise<InstagramFont[]> | null = null;

async function readFont(name: string, file: string, weight: 400 | 500 | 700): Promise<InstagramFont> {
  const buffer = await readFile(join(process.cwd(), "public", "fonts", file));
  const data = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
  return { name, data, weight, style: "normal" };
}

export function getInstagramFonts() {
  fontsPromise ??= Promise.all([
    readFont("DM Sans", "dm-sans-400.woff", 400),
    readFont("DM Sans", "dm-sans-500.woff", 500),
    readFont("DM Sans", "dm-sans-700.woff", 700),
    readFont("DM Serif Display", "dm-serif-display.woff", 400),
    readFont("Ricordo", "ricordo-extralight.ttf", 400),
    readFont("Ricordo", "ricordo-medium.ttf", 500),
    readFont("Ricordo", "ricordo-black.ttf", 700),
  ]);
  return fontsPromise;
}
