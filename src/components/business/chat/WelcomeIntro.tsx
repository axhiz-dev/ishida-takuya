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
  const [mobile, setMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const strip = useRef<HTMLDivElement>(null);
  const manual = useRef(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const viewport = window.matchMedia("(max-width: 680px)");
    setMobile(viewport.matches);
    setReducedMotion(media.matches);
    let seen = false;
    try { seen = sessionStorage.getItem(seenKey) === "true"; } catch { /* Storage is optional. */ }
    let timers: ReturnType<typeof setTimeout>[] = [];
    const start = () => {
      timers.forEach(clearTimeout);
      manual.current = false;
      setStage(0);
      strip.current?.scrollTo({ left: 0, behavior: "instant" });
      setCurrent(0);
      timers = [180, 2380, 4580, 6780].map((delay, i) => setTimeout(() => { if (!manual.current) setStage(i + 1); }, delay));
    };
    if (media.matches || (seen && !viewport.matches)) setStage(4);
    else start();
    const changed = () => {
      setReducedMotion(media.matches);
      if (media.matches) { timers.forEach(clearTimeout); setStage(4); }
    };
    const resized = () => {
      setMobile(viewport.matches);
      if (viewport.matches && !media.matches) start();
    };
    media.addEventListener("change", changed);
    viewport.addEventListener("change", resized);
    return () => { timers.forEach(clearTimeout); media.removeEventListener("change", changed); viewport.removeEventListener("change", resized); };
  }, []);
  useEffect(() => {
    if (stage === 4) {
      try { sessionStorage.setItem(seenKey, "true"); } catch { /* Storage is optional. */ }
    }
    if (stage > 0 && stage < 4 && window.matchMedia("(max-width: 680px)").matches && strip.current) {
      const panel = strip.current.children[stage - 1] as HTMLElement;
      strip.current.scrollTo({ left: panel.getBoundingClientRect().left - strip.current.getBoundingClientRect().left + strip.current.scrollLeft, behavior: "smooth" });
    }
  }, [stage]);
  // Manual reading takes priority over the timed sequence.
  const stopAuto = () => { manual.current = true; setStage(4); };
  const showPanel = (index: number) => {
    stopAuto();
    const panel = strip.current?.children[index] as HTMLElement | undefined;
    if (panel && strip.current) strip.current.scrollTo({ left: panel.getBoundingClientRect().left - strip.current.getBoundingClientRect().left + strip.current.scrollLeft, behavior: reducedMotion ? "instant" : "smooth" });
  };
  const finish = () => { if (mobile) showPanel(2); else stopAuto(); };
  const complete = stage === 4 && (!mobile || current === 2 || reducedMotion);
  return <ResponseReadyContext.Provider value={complete}>
    <div className={s.welcomeIntro} data-welcome-phase={complete ? "ready" : "streaming"}>
      <div className={s.comicHeading}>
        <h1>『いつもの仕事』って結構大変…</h1>
        {stage < 4 && <button className={s.comicSkip} onClick={finish}>まとめて見る</button>}
      </div>
      <div className={s.comicStrip} ref={strip}
        onPointerDown={(event) => { pointerStart.current = { x: event.clientX, y: event.clientY }; }}
        onPointerMove={(event) => {
          const start = pointerStart.current;
          if (start && Math.abs(event.clientX - start.x) > 12 && Math.abs(event.clientX - start.x) > Math.abs(event.clientY - start.y)) stopAuto();
        }}
        onPointerUp={() => { pointerStart.current = null; }}
        onPointerCancel={() => { pointerStart.current = null; }}
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
      <p className={s.comicInvitation} data-comic-visible={complete} aria-hidden={!complete}>いつもの仕事がどう変わるか、サンプルで体験してみてください。</p>
    </div>
    {children}
  </ResponseReadyContext.Provider>;
}
