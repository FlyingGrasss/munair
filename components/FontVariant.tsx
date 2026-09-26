"use client";

import { useEffect } from "react";

const variants = new Set(["current", "dm", "bodoni"]);

export default function FontVariant() {
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("font");
    if (value && variants.has(value)) document.documentElement.dataset.font = value;
    else delete document.documentElement.dataset.font;
  }, []);

  return null;
}
