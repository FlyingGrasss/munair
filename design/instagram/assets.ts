import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";

const dragon = readFileSync(join(process.cwd(), "design", "instagram", "assets", "dragon.svg"), "utf8")
  .replaceAll('fill="#ebebeb"', 'fill="#8ab7da"')
  .replaceAll('stroke="none"', 'stroke="none"');

export const DRAGON_SVG_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(dragon).toString("base64")}`;
