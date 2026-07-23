import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

const HEADER_OFFSET = -64;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: HEADER_OFFSET, duration: 1 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
