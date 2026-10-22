"use client";

import { useState } from "react";
import Image from "next/image";
import { BASE_PATH } from "@/config/site";
import { proposalSlides } from "./proposalSlides";
import g from "./growth.module.css";

export default function ProposalDeck({ variant = "current" }: { variant?: "current" | "past" }) {
  const [index, setIndex] = useState(0);
  const slides = proposalSlides[variant];
  const slide = slides[index] ?? slides[0]!;
  const customer = variant === "past" ? "こはるオフィス" : "あおば商事";
  return <div className={g.deck}>
    <article className={g.slide} role="group" aria-label={`提案資料 ${index + 1}ページ目`} aria-live="polite">
      <div className={g.slideBrand}><strong>MIDORI DESIGN</strong><span>{customer}様 / Webサイト改修のご提案</span></div>
      <h3 className={g.slideTitle}><span>{String(index + 1).padStart(2, "0")}</span>{slide.title}</h3>
      <div className={g.slideComparison}>
        {(["before", "after"] as const).map(state => {
          const src = `${BASE_PATH}/business/proposals/${variant}-${slide.topic}-${state}.jpg`;
          const before = state === "before";
          return <section key={state} className={before ? g.before : g.after}>
            <h4>{before ? "現状の課題" : "改善のご提案"}</h4>
            <a className={`${g.screenLink} ${slide.topic === "mobile" ? g.mobileScreen : ""}`} href={src} target="_blank" rel="noopener noreferrer" aria-label={`${before ? "現状" : "改善案"}の画面を拡大（新しいタブ）`}>
              <Image unoptimized loading="eager" src={src} width={slide.topic === "mobile" ? 780 : 2000} height={slide.topic === "mobile" ? 1060 : 1240} alt={`${customer}の${slide.topic === "mobile" ? "スマホ表示" : slide.topic === "contact" ? "サービスページ" : "事例一覧"}：${before ? "改修前" : "改善案"}`} />
              <span>画面を拡大 ↗</span>
            </a>
            <p>{before ? slide.problem : slide.proposal}</p>
          </section>;
        })}
      </div>
      <section className={g.slideScope}><h4>変更する内容</h4><ul>{slide.changes.map(change => <li key={change}>{change}</li>)}</ul></section>
      <p className={g.slideConfirmation}><strong>確認事項</strong>{slide.confirmation}</p>
      <footer className={g.slideFooter}><span>{customer}様　Webサイト改修</span><span>{index + 1} / {slides.length}</span></footer>
    </article>
    <div className={g.deckNavigation} role="group" aria-label="提案資料のページ切り替え">
      <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>前へ</button>
      <span>{index + 1} / {slides.length}</span>
      <button type="button" disabled={index === slides.length - 1} onClick={() => setIndex(index + 1)}>次へ</button>
    </div>
  </div>;
}
