"use client";

import { useState } from "react";
import ProposalDeck from "./ProposalDeck";
import type { GrowthSample } from "./growthScenarios";
import type { GrowthDocumentId } from "./growthDocuments";
import { GrowthDocuments } from "./GrowthDocumentPreview";
import s from "./chat.module.css";
import g from "./growth.module.css";

type OpenDocument = (id: GrowthDocumentId) => void;
const candidates = [
  { name: "ホテルKOTO", reason: "都内で1施設。荷物預かりに対応。", idea: "ロビーの荷物置き場を、空間に合わせた収納に。" },
  { name: "全国ホテルチェーンA", reason: "全国で50施設を運営。", idea: "客室家具の更新を検討。ただし、発注条件や案件規模は要確認。" },
];
const sampleLabels: Record<GrowthSample, string> = {
  "sales-draft": "営業先と提案のたたき台", "sales-revised": "修正した営業先と提案", "sales-reuse": "次の営業での使い方",
  "proposal-notes": "議事録から整理した提案の材料", "proposal-draft": "自社のデザインで作った提案資料", "proposal-reuse": "会議から提案までの流れ",
};

function SalesDraft({ onOpen }: { onOpen: OpenDocument }) {
  const [selected, setSelected] = useState(0);
  const candidate = candidates[selected];
  if (!candidate) return null;
  return <>
    <h3 className={s.artifactLead}>営業先と、提案の切り口</h3>
    <div className={g.candidates} role="group" aria-label="営業先の見本を選ぶ">
      {candidates.map((item, index) => <button type="button" key={item.name} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.name}</button>)}
    </div>
    <dl className={g.facts}>
      <div><dt>選んだ理由</dt><dd>{candidate.reason}</dd></div>
      <div><dt>提案</dt><dd>{candidate.idea}</dd></div>
      <div><dt>まだ分からないこと</dt><dd>困っていること、予算、導入予定、発注窓口。</dd></div>
    </dl>
    <GrowthDocuments ids={["research"]} onOpen={onOpen} />
  </>;
}

function SalesRevised({ onOpen }: { onOpen: OpenDocument }) {
  return <>
    <h3 className={s.artifactLead}>ホテルKOTOへの提案メール案</h3>
    <p className={g.change}>1〜3店舗を優先。全国チェーンは対象外。写真と寸法から相談する。</p>
    <div className={s.mailBody}>{`件名：ロビーの荷物置き場について、造作収納のご相談

ホテルKOTO ご担当者様

店舗向けのオーダー家具を製作しております。施設案内で、チェックイン前のお荷物をお預かりしていると拝見しました。

もし保管場所や動線でお困りでしたら、荷物置き場1か所から収納をご相談いただけます。狭い店内に壁面収納を設けた施工事例をご紹介します。

まず写真とおおよその寸法、今の使い方を伺い、対応できそうであればお打ち合わせできればと思います。`}</div>
    <GrowthDocuments ids={["work"]} onOpen={onOpen} />
    <p className={s.sampleNote}>文面の見本です。無料の現地調査や納期は約束せず、送信前に人が確認します。</p>
  </>;
}

function ProposalNotes() {
  const groups = [
    { title: "お客さんの課題", items: ["スマホで読みにくい", "問い合わせ先が分からない", "事例が古い"] },
    { title: "提案すること", items: ["スマホに合わせて文字と配置を見直す", "問い合わせボタンを見つけやすくする", "最近の事例を3件掲載する"] },
    { title: "まだ決まっていないこと", items: ["予算", "公開時期", "掲載する文章と写真"] },
  ];
  return <div className={g.noteGroups}>{groups.map(group => <section key={group.title}>
    <h3>{group.title}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
  </section>)}</div>;
}

function ProposalReuse() {
  return <>
    <p className={s.skillPrompt}>この議事録から、いつもの型で提案資料を作って</p>
    <details className={g.rules}><summary>スキルに残すルールを見る</summary><ul className={s.skillDetails}>
      <li>今回の提案書と同じデザインで、1ページに1つの課題と改善案をまとめる。</li>
      <li>現状と改善案の画面を並べ、変える場所と内容を具体的に書く。</li>
      <li>新しい議事録と自社のサービス案内を使う。過去のお客さんの情報は引き継がない。</li>
      <li>足りない情報は確認事項に残す。金額・納期・効果を勝手に決めない。</li>
    </ul></details>
  </>;
}

function ReusePreview({ onOpen }: { onOpen: OpenDocument }) {
  return <>
    <h3 className={s.artifactLead}>次回は、この一言から</h3>
    <code className={s.skillPrompt}>sales-prospectで、小規模な美容室の候補と提案を考えて</code>
    <p className={g.change}>次の候補の見本：美容室iroha（都内2店舗）。席まわりの道具を取り出しやすくする収納を、施工事例と合わせて提案。</p>
    <details className={g.rules}>
      <summary>スキルに残すルールを見る</summary>
      <ul className={s.skillDetails}>
        <li>自社の強み：狭い空間の収納、小ロットの造作家具。首都圏・20〜100万円。</li>
        <li>1〜3店舗を優先し、全国チェーンは対象外。規模や予算が不明なら確認事項に残す。</li>
        <li>情報の記載と提案の仮説を分け、候補ごとに施工事例を選ぶ。</li>
        <li>写真と寸法から相談。無料の現地調査や納期は約束しない。連絡先・文面は送信前に人が確認。</li>
      </ul>
    </details>
    <GrowthDocuments ids={["research"]} onOpen={onOpen} />
    <p className={s.sampleNote}>スキル保存・AI実行の見本です。実際の保存や実行は行いません。</p>
  </>;
}

export default function GrowthArtifact({ sample, onOpenDocument }: { sample: GrowthSample; onOpenDocument: OpenDocument }) {
  return <section className={`${s.artifact} ${g.preview} ${sample.startsWith("proposal-") ? g.proposalArtifact : ""}`} aria-label={sampleLabels[sample]} data-growth-sample={sample} data-static-preview>
    {sample.startsWith("sales-") && <span className={s.badge}>架空のデータによるサンプル体験</span>}
    {sample === "sales-draft" && <SalesDraft onOpen={onOpenDocument} />}
    {sample === "sales-revised" && <SalesRevised onOpen={onOpenDocument} />}
    {sample === "proposal-notes" && <ProposalNotes />}
    {sample === "proposal-draft" && <ProposalDeck />}
    {sample === "sales-reuse" && <ReusePreview onOpen={onOpenDocument} />}
    {sample === "proposal-reuse" && <ProposalReuse />}
  </section>;
}
