"use client";
import { useLayoutEffect, useRef } from "react";
import { X, ArrowRight } from "@phosphor-icons/react";
import SelfIntroduction from "./SelfIntroduction";
import Consultation from "./Consultation";
import { consultationSteps, supportFaqs, supportPricing, supportSections, type BusinessPanel } from "./supportContent";
import s from "./support.module.css";

type Props = { panel: BusinessPanel | null; reference: string; onOpen: (panel: BusinessPanel) => void; onClose: () => void };
export default function SupportPanel({ panel, reference, onOpen, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const positions = useRef<Partial<Record<BusinessPanel, number>>>({});
  useLayoutEffect(() => {
    if (panel && !dialog.current?.open) dialog.current?.showModal();
    if (!panel && dialog.current?.open) dialog.current.close();
    if (panel && body.current) {
      body.current.scrollTop = positions.current[panel] ?? 0;
      heading.current?.focus({ preventScroll: true });
    }
  }, [panel]);
  const title = panel === "contact" ? "無料相談" : supportSections.find((section) => section.id === panel)?.label ?? "ご案内";
  return <dialog ref={dialog} className={s.panel} aria-labelledby="support-heading" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
    <div className={s.panelHeader}><h1 id="support-heading" ref={heading} tabIndex={-1}>{title}</h1><button onClick={onClose} className={s.close} aria-label="案内を閉じて元の画面に戻る"><X size={23} /></button></div>
    {panel !== "contact" && <nav className={s.sectionNav} aria-label="支援のご案内">{supportSections.map((section) => <button key={section.id} aria-current={panel === section.id ? "page" : undefined} onClick={() => onOpen(section.id)}>{section.label}</button>)}</nav>}
    <div ref={body} className={s.panelBody} onScroll={() => { if (panel && body.current) positions.current[panel] = body.current.scrollTop; }}>
      <section hidden={panel !== "pricing"} aria-label="支援内容・費用">
        <p className={s.eyebrow}>仕事に合わせて、選べる支援</p><h2 className={s.sectionTitle}>一緒に使えるようになる。<br />仕組みづくりを任せる。</h2>
        <p className={s.lead}>まずは今の仕事を伺い、合う進め方をご提案します。</p>
        <div className={s.priceGrid}>
          <article className={s.priceCard}><span className={s.tag}>使い方を身につけたい方へ</span><h3>AI活用の伴走支援</h3><p className={s.price}>月<span>{supportPricing.accompaniment}万円〜</span><small>（税別）</small></p><p>普段の仕事を、繰り返し使えるAIの手順に。</p><ul><li>打ち合わせ・チャットでのご相談</li><li>業務に合う指示文・スキルづくり</li><li>見本での動作確認と、使いながらの改善</li></ul><p className={s.note}>打ち合わせの頻度・相談の範囲・支援期間は、ご提案時に決めます。</p></article>
          <article className={s.priceCard}><span className={s.tag}>制作を任せたい方へ</span><h3>仕組みづくり・受託開発</h3><p className={s.price}><span>{supportPricing.implementation}万円〜</span><small>（税別・要見積もり）</small></p><p>対象の仕事を決めて、使える仕組みに。</p><ul><li>ファイル形式や仕事の手順に合わせた制作</li><li>動作確認と、使い方のご案内</li><li>手順書とあわせてお渡し</li></ul><p className={s.note}>納品後の修正・保守は別途ご相談となります。</p></article>
        </div>
        <div className={s.costNote}><h3>外部サービスの利用料について</h3><p>AIの有料プランやLINEなどの利用料は別途必要です。必要な契約・費用の見込みと、追加費用が発生する条件は、ご依頼前にご案内します。</p></div>
        <button className={s.textLink} onClick={() => onOpen("process")}>相談から利用開始までを見る <ArrowRight size={16} /></button>
      </section>
      <section hidden={panel !== "process"} aria-label="相談から利用開始まで">
        <p className={s.eyebrow}>まずは、いつもの仕事の話から</p><h2 className={s.sectionTitle}>整理できていなくても、<br />相談できます。</h2>
        <ol className={s.process}>{consultationSteps.map((step, index) => <li key={step.title}><span className={s.stepNumber}>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.body}</p><p className={s.result}>この段階で分かること・残るもの<br /><strong>{step.result}</strong></p></div></li>)}</ol>
      </section>
      <section hidden={panel !== "faq"} aria-label="よくある質問">
        <h2 className={s.sectionTitle}>気になることを、先に。</h2><p className={s.lead}>質問を押すと、その場で回答を読めます。</p>
        {supportFaqs.map((group) => <section key={group.category} className={s.faqGroup}><h3>{group.category}</h3>{group.items.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</section>)}
      </section>
      <div hidden={panel !== "about"}><SelfIntroduction /></div>
      <div hidden={panel !== "contact"}><Consultation reference={reference} /></div>
      {panel !== "contact" && <div className={s.panelCta}><p>AIに何を頼めるか、まだ分からなくても大丈夫です。</p><button className={s.primary} data-multiline onClick={() => onOpen("contact")}>自分の仕事について相談する <ArrowRight size={18} /></button><small>初回30分・無料。メールで日程を調整します。</small></div>}
    </div>
  </dialog>;
}
