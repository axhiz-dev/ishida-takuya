"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { FEATURES, ROUTES } from "@/config/site";
import { useChapters } from "@/lib/useChapters";
import { PlaceholderNotice } from "@/components/common/PlaceholderNotice";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./engineer.module.css";

const CHAPTERS = ROUTES.engineer.sections;
const CHAPTER_IDS = CHAPTERS.map((c) => c.id);

/**
 * 畳んである <details>（事例・根拠の表）を印刷時だけ開く。
 *
 * CSS だけでは閉じた <details> の中身を出せない（ブラウザが
 * content-visibility で隠すため）。紙は畳めないので、
 * 印刷の直前に開いて、終わったら元に戻す。
 */
const openDetailsForPrint = () => {
  for (const el of document.querySelectorAll("details")) {
    el.dataset.wasOpen = String(el.open);
    el.open = true;
  }
};

const restoreDetailsAfterPrint = () => {
  for (const el of document.querySelectorAll("details")) {
    el.open = el.dataset.wasOpen === "true";
    delete el.dataset.wasOpen;
  }
};

/**
 * ナビと進行レールを持つ外枠。
 *
 * 章の現在地は 1 箇所（useChapters）で決めて、ナビとレールの両方に配る。
 * 別々に観測すると表示がずれる。
 */
export function EngineerShell({ name, children }: { name: string; children: ReactNode }) {
  const activeId = useChapters(CHAPTER_IDS);
  const activeIndex = Math.max(
    0,
    CHAPTERS.findIndex((c) => c.id === activeId),
  );

  // ブラウザの印刷（Cmd+P など）から入ってきた場合もここで拾う
  useEffect(() => {
    window.addEventListener("beforeprint", openDetailsForPrint);
    window.addEventListener("afterprint", restoreDetailsAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", openDetailsForPrint);
      window.removeEventListener("afterprint", restoreDetailsAfterPrint);
    };
  }, []);

  return (
    <>
      {/* N10 · スクロールすると畳まるナビ。
          章が進むほど data-condensed が効いて薄く小さくなる。 */}
      <header className={styles.nav} data-condensed={activeIndex > 0 || undefined}>
        <div className={styles.navBrand}>
          <Link href={ROUTES.gate.path} className={styles.wordmark}>
            {name}
          </Link>
          <PlaceholderNotice />
        </div>

        <div className={styles.navActions}>
          <ThemeToggle />
          {FEATURES.pdfExport ? (
            <button
              type="button"
              className={styles.print}
              onClick={() => {
                openDetailsForPrint();
                window.print();
              }}
            >
              PDF
            </button>
          ) : null}
        </div>
      </header>

      {/* 左端の進行レール。章番号と現在地を持つ。
          参考サイトが眉ラベルで各章に付けていた役目を、
          ここに集約している（Hallmark は眉ラベルの多用を禁じているため）。 */}
      <nav className={styles.rail} aria-label="章の一覧">
        <ol className={styles.railList}>
          {CHAPTERS.map((chapter) => {
            const isActive = chapter.id === activeId;
            return (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  className={styles.railItem}
                  data-active={isActive || undefined}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className={styles.railNo}>{chapter.no}</span>
                  <span className={styles.railLabel}>{chapter.label}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* レイアウトの実グリッドに揃えた縦線。
          このページが何本の柱の上に組まれているかを見せるだけの線なので、
          装飾ではあるが「グリッドを見せる」という意味を持っている。 */}
      <div className={styles.gridLines} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      {children}
    </>
  );
}
