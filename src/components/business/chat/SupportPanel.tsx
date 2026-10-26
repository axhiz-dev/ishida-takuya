"use client";
import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import processComic from "../../../../public/images/business/support-process.webp";
import { X, ArrowRight, ArrowDown } from "@phosphor-icons/react";
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
  return <dialog ref={dialog} className={s.panel} aria-labelledby="support-heading" onClose={() => { if (document.activeElement === document.body) document.getElementById("business-conversation")?.focus({ preventScroll: true }); }} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
    <div className={s.panelHeader}><h1 id="support-heading" ref={heading} tabIndex={-1}>{title}</h1><button onClick={onClose} className={s.close} aria-label="案内を閉じて元の画面に戻る"><X size={23} /></button></div>
    {panel !== "contact" && <nav className={s.sectionNav} aria-label="支援のご案内">{supportSections.map((section) => <button key={section.id} aria-current={panel === section.id ? "page" : undefined} onClick={() => onOpen(section.id)}>{section.label}</button>)}</nav>}
    <div ref={body} className={s.panelBody} onScroll={() => { if (panel && body.current) positions.current[panel] = body.current.scrollTop; }}>
      <section hidden={panel !== "pricing"} aria-label="支援内容・費用">
        <p className={s.pricingIntro}>この例のように、仕事に合わせたAIの手順や仕組みを、一緒に作ることも、制作を任せることもできます。</p>
        <div className={s.priceGrid}>
          <article className={s.priceCard}>
            <span className={s.tag}>自分で作れるようになりたい方へ</span>
            <h2>AI活用の伴走支援</h2>
            <p className={s.price}>1か月<span>{supportPricing.accompaniment}万円</span><small>（税別）</small></p>
            <p>実際の仕事を題材に、AIへの頼み方や仕組みの考え方を学びながら、一緒に作ります。</p>
            <ul><li>オンライン相談：30分×全4回</li><li>チャット相談：原則2営業日以内に返信</li><li>まずは1つの業務をテーマに</li></ul>
            <p className={s.note}>週1回を目安に、ご自身で試した内容を一緒に確認します。</p>
          </article>
          <article className={s.priceCard}>
            <span className={s.tag}>時間がない・制作を任せたい方へ</span>
            <h2>仕組みづくり・受託開発</h2>
            <p className={s.price}><span>{supportPricing.implementation}万円〜</span><small>（税別・要見積もり）</small></p>
            <p>やりたいことや仕事のルールを伺い、こちらで制作します。作る時間が取れない方に。</p>
            <ul><li>仕事の手順や資料に合わせた制作</li><li>動作確認と、使い方のご案内</li><li>手順書とあわせてお渡し</li></ul>
            <p className={s.note}>納品後の修正・保守は含みません。必要に応じて別途ご相談いただけます。</p>
          </article>
        </div>
        <details className={s.planExample}>
          <summary>たとえば、毎月のExcel照合を楽にしたい場合</summary>
          <div className={s.exampleGrid}>
            <div><h3>伴走支援なら</h3><p>照合ルールの整理やAIへの伝え方を一緒に考えます。ご自身で操作して試し、翌月の変更にも対応できることを目指します。</p></div>
            <div><h3>制作を任せるなら</h3><p>Excelの形式や照合ルールを伺い、こちらで制作・動作確認を行います。出来上がりをご確認いただき、使い方とあわせてお渡しします。</p></div>
          </div>
        </details>
        <div className={s.costNote}><h2>外部サービスの利用料について</h2><p>AIの有料プランやLINEなどの利用料は別途必要です。必要な契約・費用の見込みと、追加費用が発生する条件は、ご依頼前にご案内します。</p></div>
      </section>
      <section hidden={panel !== "process"} aria-label="相談から利用開始まで">
        <ol className={s.process}>{consultationSteps.map((step, index) => <li key={step.title}>
          <div className={s.processCopy}>
            <span className={s.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
            <h2>{step.title}</h2><p>{step.body}</p>
            <p className={s.result}><strong>{step.result}</strong></p>
          </div>
          <div className={s.processComic}>
            <Image src={processComic} alt={[
              "普段の仕事について、資料を見ながら相談している場面",
              "支援の内容と費用をまとめた提案を一緒に確認している場面",
              "AIと作った見本を、画面で一緒に確かめている場面",
              "仕事で使いながら、手順を調整している場面",
            ][index] ?? "支援の進め方の漫画"} width={processComic.width} height={processComic.height} style={{ left: index % 2 ? "-100%" : "0", top: index >= 2 ? "-100%" : "0" }} sizes="(max-width: 680px) 160px, 480px" />
          </div>
          {index < consultationSteps.length - 1 && <ArrowDown className={s.processArrow} size={30} weight="light" aria-hidden="true" />}
        </li>)}</ol>
      </section>
      <section hidden={panel !== "faq"} aria-label="よくある質問">
        <h2 className={s.sectionTitle}>気になることを、先に。</h2><p className={s.lead}>質問を押すと、その場で回答を読めます。</p>
        {supportFaqs.map((group) => <section key={group.category} className={s.faqGroup}><h3>{group.category}</h3>{group.items.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</section>)}
      </section>
      <div hidden={panel !== "about"}><SelfIntroduction /></div>
      <div hidden={panel !== "contact"}><Consultation reference={reference} /></div>
      {panel !== "contact" && <div className={s.panelCta}><p>AIに何を頼めるか、まだ分からなくても大丈夫です。</p><button className={s.primary} data-multiline onClick={() => onOpen("contact")}>自分の仕事について相談する <ArrowRight size={18} aria-hidden="true" /></button><small>初回30分・無料。メールで日程を調整します。</small></div>}
    </div>
  </dialog>;
}
