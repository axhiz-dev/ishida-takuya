"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY, engineerThemeAttr, type EngineerTheme } from "@/lib/theme";
import styles from "./ThemeToggle.module.css";

/**
 * ダーク / ライトの切り替え。
 *
 * 初期値は <head> の同期スクリプトが既に <html data-theme> に確定させているので、
 * ここではその値を読むだけ。自前で「既定はダーク」と決め打つと、
 * スクリプトが決めた値と食い違って一瞬ちらつく。
 */
export function ThemeToggle() {
  // サーバ側では確定しないので、マウントまでは押せない状態にしておく。
  const [theme, setTheme] = useState<EngineerTheme | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "engineer-light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: EngineerTheme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = engineerThemeAttr(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // プライベートモード等で保存できなくても、その場の切り替えは効かせる
    }
  };

  const isLight = theme === "light";
  const pending = theme === null;

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      disabled={pending}
      aria-pressed={pending ? undefined : isLight}
      aria-label={isLight ? "ダークテーマに切り替える" : "ライトテーマに切り替える"}
      title={isLight ? "ダークテーマに切り替える" : "ライトテーマに切り替える"}
    >
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      <span className={styles.text} aria-hidden="true">
        {pending ? "—" : isLight ? "Light" : "Dark"}
      </span>
    </button>
  );
}
