"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { engineerNow, type NowInitiative } from "@/content/engineer";
import { formatDotPeriod } from "@/lib/derive";
import { Reveal } from "./Reveal";
import { Tag } from "./Tag";

/**
 * 現職での取り組み。主張のカードと、取り組みを 1 枚ずつ見せるカルーセル。
 *
 * 縦に全件並べると次の節までが長く、どこまで続くか分からなくなるので、
 * 1 枚のパネルに収めてタブで件数と名前を先に見せる。
 * 紙では ResumeDocument が全件を縦に並べるので、ここは画面専用。
 */

const beatLabel = (initiative: NowInitiative) =>
  initiative.status === "ongoing" ? "現在" : "やりきった結果";

function Slide({ initiative, index, active }: { initiative: NowInitiative; index: number; active: boolean }) {
  const ongoing = initiative.status === "ongoing";
  return (
    <article
      id={`now-slide-${index}`}
      role="tabpanel"
      aria-labelledby={`now-tab-${index}`}
      aria-hidden={!active}
      data-testid="now-slide"
      className="w-full shrink-0 snap-start px-5 py-6 sm:px-6"
    >
      <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
        <span
          className={`self-center rounded-[3px] border px-1.5 text-[10px] font-bold tracking-[0.1em] ${
            ongoing ? "border-[#b7dcc9] bg-[#f1f9f5] text-[#2a6f51]" : "border-line text-ink-faint"
          }`}
        >
          {ongoing ? "進行中" : "リリース済"}
        </span>
        <h4 className="text-[17px] font-bold">{initiative.title}</h4>
        <p className="text-[11px] text-ink-faint">
          {initiative.role} ・ {formatDotPeriod(initiative.period)}
        </p>
      </div>

      <div className="mt-4 grid gap-2.5 md:grid-cols-[1fr_1.25fr_1fr] md:gap-0">
        <p className="now-beat text-[13px] leading-[1.8]">
          <span className="now-beat-label text-ink-faint">状況</span>
          {initiative.situation}
        </p>
        <p className="now-beat now-beat-take text-[13px] leading-[1.8] font-medium">
          <span className="now-beat-label text-accent">取りに行ったこと</span>
          {initiative.action}
        </p>
        <p className="now-beat text-[13px] leading-[1.8]">
          <span className="now-beat-label text-[#2a6f51]">{beatLabel(initiative)}</span>
          {initiative.outcome}
        </p>
      </div>

      {initiative.tech.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {initiative.tech.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      )}
    </article>
  );
}

function InitiativeCarousel({ initiatives }: { initiatives: NowInitiative[] }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // ボタンで動かしている最中はスクロール位置から index を拾い直さない。
  // スムーズスクロールの途中で連打されても行き先がずれないようにするため。
  const targetRef = useRef<number | null>(null);
  const last = initiatives.length - 1;

  const go = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    targetRef.current = i;
    setIndex(i);
    track.scrollTo({ left: i * track.clientWidth });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (targetRef.current !== null) {
      if (i === targetRef.current) targetRef.current = null;
      return;
    }
    if (i !== index) setIndex(i);
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const next = event.key === "ArrowRight" ? index + 1 : event.key === "ArrowLeft" ? index - 1 : null;
    if (next === null || next < 0 || next > last) return;
    event.preventDefault();
    go(next);
    tabRefs.current[next]?.focus();
  };

  const arrowClass =
    "grid size-8 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-35 disabled:hover:border-line disabled:hover:text-ink";

  return (
    <div
      aria-roledescription="carousel"
      aria-label="HRBrainでの取り組み"
      className="mt-5 overflow-hidden rounded-md border border-line bg-white"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-b border-line bg-paper px-4 py-3.5 sm:px-5">
        <div role="tablist" aria-label="取り組みを選ぶ" onKeyDown={onTabKeyDown} className="flex flex-wrap gap-1.5">
          {initiatives.map((initiative, i) => {
            const selected = i === index;
            return (
              <button
                key={initiative.title}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`now-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`now-slide-${i}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => go(i)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  selected
                    ? "border-accent bg-accent text-white"
                    : "border-line bg-white text-ink-soft hover:border-accent hover:text-accent"
                }`}
              >
                {initiative.status === "ongoing" && (
                  <span
                    aria-hidden
                    className={`size-1.5 rounded-full ${selected ? "bg-[#9be0bf]" : "bg-[#2f7d5b]"}`}
                  />
                )}
                {initiative.tab}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <p aria-live="polite" className="mr-1 font-mono text-xs text-ink-faint">
            <span className="font-semibold text-ink">{index + 1}</span> / {initiatives.length}
          </p>
          <button type="button" aria-label="前の取り組み" disabled={index === 0} onClick={() => go(index - 1)} className={arrowClass}>
            ←
          </button>
          <button type="button" aria-label="次の取り組み" disabled={index === last} onClick={() => go(index + 1)} className={arrowClass}>
            →
          </button>
        </div>
      </div>

      <div ref={trackRef} onScroll={onScroll} className="now-track flex snap-x snap-mandatory overflow-x-auto">
        {initiatives.map((initiative, i) => (
          <Slide key={initiative.title} initiative={initiative} index={i} active={i === index} />
        ))}
      </div>
    </div>
  );
}

export function NowSection() {
  const now = engineerNow;
  return (
    <>
      <Reveal>
        <div className="relative overflow-hidden rounded-md border border-line bg-white px-6 pt-8 pb-6 sm:px-7">
          <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-accent" />
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-xl font-bold">{now.company}</h3>
            <span className="now-live inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-[10px] font-bold tracking-[0.12em] text-accent">
              NOW
            </span>
          </div>
          <p className="mt-4 text-[clamp(15px,4.4vw,21px)] leading-[1.6] font-bold sm:text-[26px]">
            {now.thesis.map((line, i) => (
              <span key={line} className="block">
                {i === now.thesis.length - 1 ? <span className="now-mark">{line}</span> : line}
              </span>
            ))}
          </p>
          <p className="mt-3.5 max-w-2xl text-sm leading-[1.9] text-ink-soft">{now.description}</p>
          <dl className="mt-5 flex flex-wrap gap-x-7 gap-y-2 border-t border-dashed border-line pt-4 text-xs">
            <div className="flex gap-2">
              <dt className="text-[11px] text-ink-faint">期間</dt>
              <dd className="font-mono">{formatDotPeriod(now.period)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 text-[11px] text-ink-faint">役割</dt>
              <dd>{now.role}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 text-[11px] text-ink-faint">チーム</dt>
              <dd>{now.team}</dd>
            </div>
          </dl>
        </div>
      </Reveal>

      <Reveal>
        <InitiativeCarousel initiatives={now.initiatives} />
        <p className="mt-5 text-xs text-ink-faint">
          それぞれの技術的な中身は
          <a href="#topics" className="mx-1 text-accent underline underline-offset-2">
            技術トピック
          </a>
          にまとめています。
        </p>
      </Reveal>
    </>
  );
}
