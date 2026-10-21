"use client";

import { useState } from "react";
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
  "proposal-draft": "商談メモからの提案のたたき台", "proposal-revised": "社長の判断を反映した提案", "proposal-reuse": "次の商談での使い方",
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

function ProposalDraft({ onOpen }: { onOpen: OpenDocument }) {
  return <>
    <h3 className={s.artifactLead}>商談メモから作った、最初の案</h3>
    <dl className={g.facts}>
      <div><dt>目的</dt><dd>食堂ひよりの、昼の客席の暑さを改善したい。</dd></div>
      <div><dt>たたき台</dt><dd>希望の2台買い替えを起点に、現行と同程度の機種を比較する。</dd></div>
      <div><dt>未確認</dt><dd>冷えない席・時間帯、使い方、設備の状態。機種・台数はまだ決めない。</dd></div>
    </dl>
    <p className={g.change}>過去のカフェの提案では、「窓際だけ暑い」と分かって提案の順序を変えています。</p>
    <GrowthDocuments ids={["past-proposals"]} onOpen={onOpen} />
  </>;
}

function ProposalRevised({ onOpen }: { onOpen: OpenDocument }) {
  return <>
    <h3 className={s.artifactLead}>社長の判断で、提案が変わる</h3>
    <p className={g.change}>「2台の買い替え」から「窓側と設備の状態を確認して、必要な更新範囲を比較」へ。</p>
    <dl className={g.facts}>
      <div><dt>分かったこと</dt><dd>15〜17時、窓側だけ冷えにくい。ほかの席は問題なし。</dd></div>
      <div><dt>社員が次に聞く</dt><dd>清掃履歴・機種・使用年数・写真。現地確認の段取りも相談する。</dd></div>
      <div><dt>社長に確認</dt><dd>機種・台数・工事条件・金額。日差しの影響は仮説として残す。</dd></div>
    </dl>
    <GrowthDocuments ids={["proposal"]} onOpen={onOpen} />
  </>;
}

function ReusePreview({ sales, onOpen }: { sales: boolean; onOpen: OpenDocument }) {
  return <>
    <h3 className={s.artifactLead}>次回は、この一言から</h3>
    <code className={s.skillPrompt}>{sales ? "sales-prospectで、小規模な美容室の候補と提案を考えて" : "proposal-partnerで、この商談メモから提案と次の質問を考えて"}</code>
    {sales ? <p className={g.change}>次の候補の見本：美容室iroha（都内2店舗）。席まわりの道具を取り出しやすくする収納を、施工事例と合わせて提案。</p>
      : <p className={g.change}>例えば「厨房も暑い」という次の相談では、客席と厨房のどちらの話かを聞き返すところから。前の商談の結論は当てはめません。</p>}
    <details className={g.rules}>
      <summary>スキルに残すルールを見る</summary>
      <ul className={s.skillDetails}>
        {sales ? <>
          <li>自社の強み：狭い空間の収納、小ロットの造作家具。首都圏・20〜100万円。</li>
          <li>1〜3店舗を優先し、全国チェーンは対象外。規模や予算が不明なら確認事項に残す。</li>
          <li>情報の記載と提案の仮説を分け、候補ごとに施工事例を選ぶ。</li>
          <li>写真と寸法から相談。無料の現地調査や納期は約束しない。連絡先・文面は送信前に人が確認。</li>
        </> : <>
          <li>新しい商談メモ、過去の提案書、商品資料、社長の判断基準を使う。</li>
          <li>目的、冷えない席と時間、使い方、設備の状態を確認。足りない情報は社員に聞き返す。</li>
          <li>事実と仮説、提案、次の質問、社長の判断が必要な点を分ける。</li>
          <li>原因や機種・台数・工事条件・金額・効果は、確認する前に確約しない。</li>
        </>}
      </ul>
    </details>
    {sales && <GrowthDocuments ids={["research"]} onOpen={onOpen} />}
    <p className={s.sampleNote}>スキル保存・AI実行の見本です。実際の保存や実行は行いません。</p>
  </>;
}

export default function GrowthArtifact({ sample, onOpenDocument }: { sample: GrowthSample; onOpenDocument: OpenDocument }) {
  return <section className={`${s.artifact} ${g.preview}`} aria-label={sampleLabels[sample]} data-growth-sample={sample} data-static-preview>
    <span className={s.badge}>架空のデータによるサンプル体験</span>
    {sample === "sales-draft" && <SalesDraft onOpen={onOpenDocument} />}
    {sample === "sales-revised" && <SalesRevised onOpen={onOpenDocument} />}
    {sample === "proposal-draft" && <ProposalDraft onOpen={onOpenDocument} />}
    {sample === "proposal-revised" && <ProposalRevised onOpen={onOpenDocument} />}
    {(sample === "sales-reuse" || sample === "proposal-reuse") && <ReusePreview sales={sample === "sales-reuse"} onOpen={onOpenDocument} />}
  </section>;
}
