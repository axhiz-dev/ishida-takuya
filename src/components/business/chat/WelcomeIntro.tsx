"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ResponseReadyContext } from "./ChatTurn";
import comic from "../../../../public/images/business/work-comic.png";
import s from "./chat.module.css";

const seenKey = "business-welcome-seen-v3";
const panels = [
  { x: 12, text: "部長が資料を渡す。「これ、いつもの感じでやっておいて！」" },
  { x: 670, text: "資料と連絡の確認に追われる担当者。『いつもの』がけっこう大変なんだよな…" },
  { x: 1326, text: "AI君が声をかける。「その準備、ぼくも手伝えそうです」" },
];

export default function WelcomeIntro({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState(0);
  const [current, setCurrent] = useState(0);
  const strip = useRef<HTMLDivElement>(null);
  const manual = useRef(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    try { seen = sessionStorage.getItem(seenKey) === "true"; } catch { /* Storage is optional. */ }
    if (media.matches || seen) { setStage(4); return; }
    const timers = [180, 2380, 4580, 5580].map((delay, i) => setTimeout(() => { if (!manual.current) setStage(i + 1); }, delay));
    const changed = () => {
      if (media.matches) { timers.forEach(clearTimeout); setStage(4); }
    };
    media.addEventListener("change", changed);
    return () => { timers.forEach(clearTimeout); media.removeEventListener("change", changed); };
  }, []);
  useEffect(() => {
    if (stage === 4) {
      try { sessionStorage.setItem(seenKey, "true"); } catch { /* Storage is optional. */ }
    }
    if (stage > 0 && stage < 4 && window.matchMedia("(max-width: 680px)").matches && strip.current) {
      const panel = strip.current.children[stage - 1] as HTMLElement;
      strip.current.scrollTo({ left: panel.offsetLeft - strip.current.offsetLeft, behavior: "smooth" });
    }
  }, [stage]);
  // Manual reading takes priority over the timed sequence.
  const finish = () => { manual.current = true; setStage(4); };
  const showPanel = (index: number) => {
    finish();
    const panel = strip.current?.children[index] as HTMLElement | undefined;
    if (panel && strip.current) strip.current.scrollTo({ left: panel.offsetLeft - strip.current.offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return <ResponseReadyContext.Provider value={stage === 4}>
    <div className={s.welcomeIntro} data-welcome-phase={stage === 4 ? "ready" : "streaming"}>
      <div className={s.comicHeading}>
        <h1>『いつもの仕事』って結構大変…</h1>
        {stage < 4 && <button className={s.comicSkip} onClick={finish}>まとめて見る</button>}
      </div>
      <div className={s.comicStrip} ref={strip} onTouchStart={finish} onPointerDown={finish} onKeyDown={finish}
        onScroll={() => {
          if (!strip.current) return;
          const width = strip.current.children[0]?.getBoundingClientRect().width ?? 1;
          setCurrent(Math.min(2, Math.round(strip.current.scrollLeft / (width + 12))));
        }}>
        {panels.map((panel, i) => <div key={i} className={s.comicPanel} data-comic-visible={stage > i} aria-hidden={stage <= i}>
          <Image src={comic} alt={panel.text} loading="eager" priority={i === 0} sizes="(max-width: 680px) 1100px, 1000px" className={s.comicArt} style={{ left: `${-panel.x / 648 * 100}%` }} />
        </div>)}
      </div>
      <nav className={s.comicPages} aria-label="漫画のコマ">
        {panels.map((_, i) => <button key={i} onClick={() => showPanel(i)} aria-label={`${i + 1}コマ目を見る`} aria-current={current === i ? "step" : undefined}><span /></button>)}
      </nav>
      <p className={s.comicInvitation} data-comic-visible={stage === 4}>いつもの仕事がどう変わるか、サンプルで体験してみてください。</p>
    </div>
    {children}
  </ResponseReadyContext.Provider>;
}
