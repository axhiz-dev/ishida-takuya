"use client";

import { useState } from "react";
import g from "./growth.module.css";

const intro = { title: "私たちについて", lead: "MIDORI DESIGN", points: ["企業のホームページ制作を支援", "構成の整理からデザイン・制作まで", "公開後の更新もご相談いただけます"] };
const problem = { title: "問い合わせしやすいホームページへ", lead: "あおば商事様から伺ったこと", points: ["スマホでは文字が小さく、読みにくい", "問い合わせ先が見つけにくい", "最近の事例が掲載されていない"] };
const plan = { title: "まず、この3点を変えます", lead: "今回の改善案", points: ["スマホでも読みやすい文字と配置に", "問い合わせボタンを見つけやすく", "最近の事例を3件掲載"] };
const schedule = { title: "内容を確認して、お見積もりへ", lead: "次の打ち合わせで決めること", points: ["予算と公開希望日を確認", "事例3件の文章・写真の準備を確認", "見積もり合意後、デザイン・制作へ"] };

export default function ProposalDeck({ revised = false }: { revised?: boolean }) {
  const [index, setIndex] = useState(0);
  const slides = revised ? [problem, plan, schedule, { ...intro, title: "ミドリデザインが支援します" }] : [intro, problem, { ...plan, points: ["スマホでも読みやすい文字と配置に", "問い合わせへの導線を最適化", "最近の事例を3件掲載"] }, schedule];
  const slide = slides[index] ?? problem;
  return <div className={g.deck}>
    <div className={g.slide} role="group" aria-label={`提案資料 ${index + 1}ページ目`} aria-live="polite">
      <div className={g.slideBrand}>MIDORI DESIGN <span>あおば商事様へのご提案</span></div>
      <p className={g.slideLead}>{slide.lead}</p>
      <h4 className={g.slideTitle}>{slide.title}</h4>
      <ul className={g.slidePoints}>{slide.points.map((point, i) => <li key={point}><span>{String(i + 1).padStart(2, "0")}</span>{point}</li>)}</ul>
      <div className={g.slideFooter}><span>ホームページ リニューアルのご提案</span><span>{String(index + 1).padStart(2, "0")}</span></div>
    </div>
    <div className={g.deckNavigation} role="group" aria-label="提案資料のページ切り替え">
      <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>前へ</button>
      <span>{index + 1} / {slides.length}</span>
      <button type="button" disabled={index === slides.length - 1} onClick={() => setIndex(index + 1)}>次へ</button>
    </div>
    <p className={g.deckCaption}>自社の色・レイアウトに合わせた資料の見本</p>
  </div>;
}
