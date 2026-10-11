"use client";

import { useEffect, useState } from "react";
import { Guide } from "./ChatTurn";
import s from "./chat.module.css";

const lines = [
  "AIって、自分の仕事にも使えるの？",
  "まずは、いつもの仕事がどう変わるか、サンプルで体験してみてください。",
  "そこから、あなたの仕事での使い方を一緒に考えましょう。",
] as const;
const total = lines.join("").length;
const seenKey = "business-welcome-seen-v1";

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

export default function WelcomeIntro() {
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
      const endOfLine = count === lines[0].length || count === lines[0].length + lines[1].length;
      timer = setTimeout(tick, endOfLine ? 260 : 35);
    };
    const changed = () => { if (media.matches) finish(); };
    media.addEventListener("change", changed);
    timer = setTimeout(tick, 300);
    return () => { clearTimeout(timer); media.removeEventListener("change", changed); };
  }, []);

  let offset = 0;
  const content = lines.map((text) => {
    const visible = Math.max(0, Math.min(text.length, length - offset));
    const active = length >= offset && length < offset + text.length;
    offset += text.length;
    return <Reveal key={text} text={text} length={visible} active={active} />;
  });
  return <div className={s.welcomeIntro} data-welcome-phase={length === total ? "ready" : "streaming"}>
    <Guide title>{content[0]}</Guide>
    <div className={s.indent}>
      <p className={s.welcomeLead}>{content[1]}</p>
      <p className={s.welcomeFollowup}>{content[2]}</p>
    </div>
  </div>;
}
