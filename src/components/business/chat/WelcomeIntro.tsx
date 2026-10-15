"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Guide, ResponseReadyContext } from "./ChatTurn";
import s from "./chat.module.css";

const heading = "毎回やっているけれど、毎回ちょっと大変。";
const total = heading.length;
const seenKey = "business-welcome-seen-v2";

// The hidden remainder reserves the final line wrapping throughout the animation.
function Reveal({ text, length, active }: { text: string; length: number; active: boolean }) {
  return <>
    <span className={s.srOnly}>{text}</span>
    <span aria-hidden="true" className={s.welcomeLine}>
      <span className={active ? s.welcomeCursor : undefined}>{text.slice(0, length)}</span>
      <span className={s.unrevealed}>{text.slice(length)}</span>
    </span>
  </>;
}

export default function WelcomeIntro({ children }: { children: ReactNode }) {
  const [length, setLength] = useState(0);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    let count = 0;
    const finish = () => {
      clearTimeout(timer);
      setLength(total);
      try { sessionStorage.setItem(seenKey, "true"); } catch { /* Storage is optional. */ }
    };
    let seen = false;
    try { seen = sessionStorage.getItem(seenKey) === "true"; } catch { /* Storage is optional. */ }
    if (media.matches || seen) { finish(); return; }
    const tick = () => {
      count++;
      setLength(count);
      if (count >= total) { finish(); return; }
      timer = setTimeout(tick, 35);
    };
    const changed = () => { if (media.matches) finish(); };
    media.addEventListener("change", changed);
    timer = setTimeout(tick, 300);
    return () => { clearTimeout(timer); media.removeEventListener("change", changed); };
  }, []);

  return <ResponseReadyContext.Provider value={length === total}><div className={s.welcomeIntro} data-welcome-phase={length === total ? "ready" : "streaming"}>
    <Guide title><Reveal text={heading} length={length} active={length < total} /></Guide>
    <div className={s.indent}>
      <p className={s.welcomeQuestion}>そんな仕事、ありませんか？</p>
      <div className={s.welcomeScenes}>
        <p>あちこちの資料を開いて、数字を写して、間違いがないか確かめる。</p>
        <p>返事が来ていない人に連絡して、変更があればまた調整する。</p>
        <p>前にも似た対応をしたはずなのに、探すところから始める。</p>
      </div>
      <p className={s.welcomeReflection}>一つひとつは小さくても、気づけば時間が過ぎている。<br />「もう少し楽になったら」と思いながら、いつものやり方で続けている。</p>
      <p className={s.welcomePossibility}>その仕事の一部を、AIに任せられるとしたら。</p>
      <p className={s.welcomeFollowup}>まずは身近な例で、どこまで任せられるのか見てみませんか。</p>
    </div>
  </div>{children}</ResponseReadyContext.Provider>;
}
