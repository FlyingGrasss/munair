"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const DialogRoot = Dialog.Root;
export const DialogTrigger = Dialog.Trigger;
export const DialogClose = Dialog.Close;

type DialogContentProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "drawer";
};

export function DialogContent({ title, description, children, className, id, variant = "default" }: DialogContentProps) {
  const isDrawer = variant === "drawer";

  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/65 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
      <Dialog.Viewport className={cn(
        "fixed inset-0 z-[60] overflow-y-auto",
        isDrawer ? "flex items-stretch justify-end p-0 sm:p-4" : "grid place-items-center p-4",
      )}>
        <Dialog.Popup
          id={id}
          className={cn(
            "relative w-full max-w-lg rounded-xl border border-[var(--border)] bg-[#f7f2ef] p-6 text-[var(--ink)] shadow-[0_24px_80px_rgba(0,0,0,.28)] outline-none transition data-ending-style:scale-[.98] data-ending-style:opacity-0 data-starting-style:scale-[.98] data-starting-style:opacity-0 motion-reduce:transition-none",
            isDrawer && "h-[100dvh] w-[min(88vw,25rem)] max-w-none overflow-y-auto rounded-none border-y-0 border-r-0 border-l border-white/10 bg-[var(--charcoal)] p-6 text-white data-ending-style:translate-x-full data-ending-style:scale-100 data-starting-style:translate-x-full data-starting-style:scale-100 sm:h-[calc(100dvh-2rem)] sm:w-[min(25rem,calc(100vw-2rem))] sm:rounded-xl sm:border",
            className,
          )}
        >
          <Dialog.Title className="pr-10 font-display text-3xl leading-none">{title}</Dialog.Title>
          {description ? <Dialog.Description className={cn("mt-3 text-sm leading-6", isDrawer ? "text-white/60" : "text-[var(--muted)]")}>{description}</Dialog.Description> : null}
          <Dialog.Close aria-label="Close dialog" className={cn(
            "absolute right-4 top-4 grid size-10 place-items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--red)]",
            isDrawer ? "text-white/65 hover:bg-white/10 hover:text-white" : "text-[var(--muted)] hover:bg-black/5",
          )}>
            <X aria-hidden="true" size={19} />
          </Dialog.Close>
          <div className="mt-6">{children}</div>
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  );
}
