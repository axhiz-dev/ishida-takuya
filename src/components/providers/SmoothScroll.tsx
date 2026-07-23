"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/scroll";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const lenis = new Lenis({ autoRaf: true, lerp: 0.12 });
    setLenis(lenis);
    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
