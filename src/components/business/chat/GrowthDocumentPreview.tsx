"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { FileText, CaretRight, X } from "@phosphor-icons/react";
import { growthDocuments, type GrowthDocumentId } from "./growthDocuments";
import EstimateHistory from "./EstimateHistory";
import ProposalDeck from "./ProposalDeck";
import s from "./chat.module.css";
import g from "./growth.module.css";

export function GrowthDocuments({ ids, onOpen }: { ids: GrowthDocumentId[]; onOpen: (id: GrowthDocumentId) => void }) {
  return <div className={g.documents} aria-label="この会話で使う資料">
    {ids.map((id) => {
      const doc = growthDocuments[id];
      return <button key={id} type="button" onClick={() => onOpen(id)} aria-haspopup="dialog" aria-label={`${doc.title}を見る`}>
        <FileText size={24} weight="duotone" aria-hidden="true" />
        <span><strong>{doc.title}</strong><small>{doc.description}</small></span>
        <CaretRight size={16} aria-hidden="true" />
      </button>;
    })}
  </div>;
}

export default function GrowthDocumentPreview({ documentId, onClose }: { documentId: GrowthDocumentId; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const doc = growthDocuments[documentId];
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => { trigger?.focus({ preventScroll: true }); };
  }, [documentId]);
  return createPortal(<dialog ref={dialog} className={`${s.workbookPreview} ${g.documentDialog}`} aria-labelledby={titleId}
    onClose={onClose}
    onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
    <div className={s.previewSurface}>
      <header className={`${s.previewHeader} ${g.documentHeader}`}>
        <FileText size={28} aria-hidden="true" />
        <div><h2 id={titleId}>{doc.title}</h2><p>資料プレビュー · 架空のサンプルデータ</p></div>
        <button type="button" autoFocus aria-label="資料を閉じる" onClick={() => dialog.current?.close()}><X size={22} /></button>
      </header>
      <article className={g.documentBody}>
        {documentId === "estimate-history" ? <EstimateHistory /> : documentId === "past-proposals" ? <ProposalDeck variant="past" /> : documentId === "proposal" ? <ProposalDeck /> : doc.sections.map((section) => <section key={section.heading}>
          <h3>{section.heading}</h3>
          {section.paragraphs?.map((text) => <p key={text}>{text}</p>)}
          {section.rows && <dl className={g.facts}>{section.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
        </section>)}
      </article>
      <p className={s.sampleNote}>会社・商談・金額・調査内容はすべて架空です。</p>
    </div>
  </dialog>, document.body);
}
