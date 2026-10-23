"use client";

import { useState } from "react";
import Image from "next/image";
import { BASE_PATH } from "@/config/site";
import decks from "./proposalSlides.json";
import pricing from "./estimateData.json";
import s from "./chat.module.css";
import g from "./growth.module.css";

export default function ProposalDeck({ variant = "current" }: { variant?: "current" | "past" }) {
  const [index, setIndex] = useState(0);
  const count = variant === "current" ? 4 : 3;
  const customer = variant === "past" ? "こはるオフィス" : "あおば商事";
  const slide = decks[variant][index];
  const title = slide?.title ?? "概算お見積もり";
  const src = `${BASE_PATH}/business/proposals/${variant}-slide-${index + 1}.png`;
  return <div className={g.deck}>
    <div className={g.deckFile}><span>{customer}様へのご提案.pptx</span><a href={`${BASE_PATH}/business/proposals/${variant}.pptx`} download={`${customer}様へのご提案.pptx`}>PowerPointをダウンロード</a></div>
    <div className={g.slideCanvas} role="group" aria-label={`提案資料 ${index + 1}ページ目`} aria-live="polite">
      <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`${title}を拡大（新しいタブ）`}>
        <Image unoptimized loading="eager" src={src} width={1920} height={1080} alt={`${customer}様へのご提案 ${index + 1}ページ目：${title}`} />
      </a>
      <div className={s.srOnly}>
        <h3>{title}</h3>
        {slide ? <><p>現状の課題：{slide.problem}</p><p>ご提案：{slide.proposal}</p><p>{slide.scope}</p></> : <><ul>{pricing.estimate.map(row => <li key={row.sourceId}>{row.label}：{row.quantity}、{row.amount.toLocaleString("ja-JP")}円</li>)}</ul><p>合計 {pricing.estimate.reduce((sum, row) => sum + row.amount, 0).toLocaleString("ja-JP")}円（税別）</p>{pricing.assumptions.map(line => <p key={line}>{line}</p>)}</>}
      </div>
    </div>
    <div className={g.deckNavigation} role="group" aria-label="提案資料のページ切り替え">
      <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>前へ</button>
      <span>{index + 1} / {count}</span>
      <button type="button" disabled={index === count - 1} onClick={() => setIndex(index + 1)}>次へ</button>
    </div>
    <a className={g.deckEnlarge} href={src} target="_blank" rel="noopener noreferrer">スライドを拡大して見る ↗</a>
  </div>;
}
