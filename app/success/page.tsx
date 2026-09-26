import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Application received", robots: "noindex" };

export default function SuccessPage() {
  return <div className="site-container grid min-h-[70svh] place-items-center py-20 text-center"><div className="max-w-xl"><span className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--red)] text-white"><Check className="size-8" /></span><p className="eyebrow mt-7 text-[var(--red)]">Application received</p><h1 className="mt-4 font-display text-6xl leading-none">Thank you for applying.</h1><p className="mt-6 leading-7 text-[var(--muted)]">Your verified application has been delivered to the MUNAIR team.</p><Link href="/" className={`${buttonVariants({ variant: "light" })} mt-8`}>Return home</Link></div></div>;
}
