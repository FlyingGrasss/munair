import { ImageResponse } from "next/og";

import { getCommitteeDesign, INSTAGRAM_SIZE } from "@/design/instagram/data";
import { getInstagramFonts } from "@/design/instagram/fonts";
import { CommitteeSlide } from "@/design/instagram/render";

export const contentType = "image/png";
export const size = INSTAGRAM_SIZE;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; slide: string }> },
) {
  const { slug, slide: slideParam } = await params;
  const design = getCommitteeDesign(slug);
  const slide = Number.parseInt(slideParam, 10);

  if (!design || !Number.isInteger(slide) || slide < 1 || slide > 3) {
    return new Response("Design not found", { status: 404 });
  }

  const fonts = await getInstagramFonts();
  const assetBaseUrl = new URL("/", _request.url).origin;

  return new ImageResponse(<CommitteeSlide design={design} slide={slide} assetBaseUrl={assetBaseUrl} />, {
    ...INSTAGRAM_SIZE,
    fonts,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
