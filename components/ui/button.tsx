import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-5 text-sm font-bold tracking-[0.02em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        primary: "border-[var(--red)] bg-[var(--red)] text-white hover:bg-[#c90030]",
        secondary: "border-[var(--border)] bg-transparent text-current hover:border-[var(--red)] hover:text-[var(--red)]",
        light: "border-[#2e2e2e] bg-[#2e2e2e] text-white hover:bg-[#171717]",
        quiet: "border-transparent bg-transparent text-current hover:bg-black/5",
        danger: "border-red-700 bg-red-700 text-white hover:bg-red-800",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;
type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, type = "button", variant, ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant }), className)} {...props} />;
}

export function ButtonLink({ className, variant, ...props }: ButtonLinkProps) {
  return <a className={cn(buttonVariants({ variant }), className)} {...props} />;
}
