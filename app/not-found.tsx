import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default function NotFound() { return <div className="site-container grid min-h-[65svh] place-items-center py-20 text-center"><div><p className="eyebrow text-[var(--red)]">404</p><h1 className="mt-3 font-display text-7xl">Page not found.</h1><Link href="/" className={`${buttonVariants({ variant: "light" })} mt-8`}>Return home</Link></div></div>; }
