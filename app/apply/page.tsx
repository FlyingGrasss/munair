import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Applications",
  robots: { index: false, follow: false },
};

export default function ApplyIndex() { redirect("/#applications"); }
