import { useEffect, useRef, type ReactNode } from "react";

/**
 * スクロールで表示領域に入ったらフェードインさせるラッパー。
 * stagger を指定すると直下の子要素が順に浮かび上がる。
 */
export default function Reveal({
  children,
  className = "",
  stagger = false,
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${stagger ? "stagger" : "reveal"} ${className}`}>
      {children}
    </div>
  );
}
