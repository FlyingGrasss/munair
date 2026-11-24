import { ImageResponse } from "next/og";

import { getCommitteeDesign, INSTAGRAM_SIZE, SLIDES_PER_COMMITTEE, STAY_TUNED } from "@/design/instagram/data";
import { getInstagramFonts } from "@/design/instagram/fonts";
import { CommitteeSlide } from "@/design/instagram/render";
import { StayTunedPost } from "@/design/instagram/stay-tuned";

export const contentType = "image/png";
export const size = INSTAGRAM_SIZE;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string; slide: string }> },
) {
  const { slug, slide: slideParam } = await params;
  const slide = Number.parseInt(slideParam, 10);
  const fonts = await getInstagramFonts();
  const assetBaseUrl = new URL("/", request.url).origin;
  const headers = { "Cache-Control": "no-store" };

  if (slug === STAY_TUNED.slug) {
    if (slide !== 1) return new Response("Design not found", { status: 404 });

    return new ImageResponse(<StayTunedPost assetBaseUrl={assetBaseUrl} />, {
      ...INSTAGRAM_SIZE,
      fonts,
      headers,
    });
  }

  const design = getCommitteeDesign(slug);

  if (!design || !Number.isInteger(slide) || slide < 1 || slide > SLIDES_PER_COMMITTEE) {
    return new Response("Design not found", { status: 404 });
  }

  return new ImageResponse(<CommitteeSlide design={design} slide={slide} assetBaseUrl={assetBaseUrl} />, {
    ...INSTAGRAM_SIZE,
    fonts,
    headers,
  });
}
