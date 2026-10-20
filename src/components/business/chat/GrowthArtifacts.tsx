"use client";

import { useState } from "react";
import type { GrowthSample } from "./growthScenarios";
import s from "./chat.module.css";
import g from "./growth.module.css";

const candidates = [
  {
    name: "ホテルKOTO",
    status: "優先候補",
    fact: "施設案内の見本：都内で1施設を運営。チェックイン前の荷物預かりに対応。",
    idea: "ロビーの限られた空間に合わせた、荷物の一時保管用の造作収納。",
    check: "今の保管方法、困っていること、寸法、導入予定・予算は未確認。",
    work: "狭い店内の壁面収納の施工事例",
  },
  {
    name: "美容室nagi",
    status: "優先候補",
    fact: "店舗案内の見本：都内で2店舗を運営。小さな店内と個室席を紹介。",
    idea: "席まわりの道具を取り出しやすくする、寸法に合わせた収納。",
    check: "収納の不足、改装予定、発注窓口、予算は未確認。",
    work: "小ロットのカウンター下収納の施工事例",
  },
  {
    name: "全国ホテルチェーンA",
    status: "対象外",
    fact: "企業案内の見本：全国で50施設を運営。",
    idea: "客室の家具更新は考えられるが、今回の受注条件に合うか確認が必要。",
    check: "全国チェーンは対象外、という社長の判断で除外。",
    work: "選定を見送る",
  },
];

function CandidatePreview({ qualified }: { qualified: boolean }) {
  const [selected, setSelected] = useState(0);
  const visible = qualified ? candidates.slice(0, 2) : candidates;
  const candidate = visible[selected];
  return <>
    <h3 className={s.artifactLead}>{qualified ? "受注条件に合わせて絞った営業先" : "営業先と提案の切り口"}</h3>
    <div className={g.candidates} role="group" aria-label="営業先の見本を選ぶ">
      {visible.map((item, index) => <button type="button" key={item.name} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.name}</button>)}
    </div>
    <h4 className={g.title}>{candidate.name}</h4>
    <dl className={g.facts}>
      <div><dt>情報の記載</dt><dd>{candidate.fact}</dd></div>
      <div><dt>提案の仮説</dt><dd>{candidate.idea}</dd></div>
      <div><dt>確認したいこと</dt><dd>{candidate.check}</dd></div>
      {qualified && <div><dt>添える施工事例</dt><dd>{candidate.work}</dd></div>}
    </dl>
    {qualified && <p className={g.change}>選び方を修正：1〜3店舗を優先。全国チェーンAは対象外。運営規模が不明なら要確認。</p>}
    <p className={s.sampleNote}>会社・記載内容はすべて架空です。実在する営業先の調査結果ではありません。</p>
  </>;
}

function SalesMail({ revised }: { revised: boolean }) {
  return <>
    <h3 className={s.artifactLead}>ホテルKOTOへの初回メール案</h3>
    <dl className={g.facts}>
      <div><dt>件名</dt><dd>ロビーの荷物置き場について、造作収納のご相談</dd></div>
      <div><dt>添える事例</dt><dd>狭い店内の壁面収納 · 小ロット製作</dd></div>
    </dl>
    <div className={s.mailBody}>{`ホテルKOTO ご担当者様

店舗向けのオーダー家具を製作しております。
施設案内で、チェックイン前のお荷物をお預かりしていると拝見しました。

もし保管場所や動線でお困りでしたら、空間に合わせた収納をご提案できるかもしれません。限られた店内に収納を設けた施工事例をご紹介します。

${revised ? "ロビー全体の改装ではなく、荷物置き場1か所からご相談いただけます。まずは写真とおおよその寸法、今の使い方を伺い、対応できそうであればお打ち合わせできればと思います。" : "ご関心があれば、無料で現地を拝見してから、収納の案をご提案できればと思います。"}

ご検討の予定がございましたら、お聞かせいただけますと幸いです。`}</div>
    {revised && <p className={g.change}>社長の修正を反映：写真と寸法から相談。無料の現地調査や納期を約束しない。</p>}
    <p className={s.sampleNote}>架空の会社に向けた文面の見本です。メールの送信・下書き保存は行いません。</p>
  </>;
}

function ProposalPreview({ revised }: { revised: boolean }) {
  return <>
    <h3 className={s.artifactLead}>{revised ? "飲食店向け ご提案書の見本" : "最初の提案のたたき台"}</h3>
    <dl className={g.facts}>
      <div><dt>お客さんの目的</dt><dd>昼の客席の暑さを改善したい。古いエアコン2台の買い替えを相談。</dd></div>
      <div><dt>分かっていること</dt><dd>{revised ? "15〜17時、西日の当たる窓側だけ冷えにくい。ほかの席は問題なし。入口の開閉は少ない。" : "昼の客席が冷えにくい。機種・金額は未定。"}</dd></div>
      <div><dt>提案の方向</dt><dd>{revised ? "窓側の環境と設備の状態を確認し、買い替えの範囲と候補を比較する。" : "現行と同程度の機種で2台の更新を検討。具体的な機種は確認後に選ぶ。"}</dd></div>
      <div><dt>未確認・仮説</dt><dd>{revised ? "清掃状況、設備情報、現地の状態は未確認。日差しの影響は仮説であり、原因とは断定しない。" : "冷えにくい席や時間帯、広さ、現在の設備の状態は未確認。"}</dd></div>
    </dl>
    {revised && <>
      <div className={g.change}>社長の判断を反映：すぐに2台の買い替えを前提にせず、必要な確認から進める。</div>
      <h4 className={g.title}>社内用 · 次の打ち合わせ</h4>
      <ul className={s.skillDetails}>
        <li><strong>社員が確認</strong>：清掃履歴・機種・使用年数・写真を伺い、現地確認の段取りを相談する。</li>
        <li><strong>社長に相談</strong>：機種・台数・工事条件・金額。確認前に確約しない。</li>
        <li><strong>お客さんへの案内</strong>：確認結果を踏まえて候補と見積もりを比較する。電気代の削減額や改善効果は未算定。</li>
      </ul>
    </>}
    <p className={s.sampleNote}>架空の商談による提案の見本です。実際の機種選定や工事判断には専門担当者の確認が必要です。</p>
  </>;
}

function SkillPreview({ sales }: { sales: boolean }) {
  return <>
    <h3 className={s.artifactLead}>{sales ? "sales-prospect" : "proposal-partner"}</h3>
    <ul className={s.skillDetails}>
      {sales ? <>
        <li><strong>自社の強み</strong>：限られた空間に合わせた造作家具、小ロット製作。</li>
        <li><strong>受注条件</strong>：首都圏・20〜100万円。1〜3店舗を優先し、全国チェーンは対象外。</li>
        <li><strong>候補の根拠</strong>：確認したページと記載を残し、提案の仮説と分ける。運営規模・発注窓口・予算が不明なら要確認。</li>
        <li><strong>提案の準備</strong>：候補ごとに施工事例を選び、1か所からの相談を提案。写真と寸法から確認し、無料の現地調査や納期は約束しない。</li>
        <li><strong>人が確認</strong>：営業先と連絡先、提案文、添える事例。連絡は確認後に行う。</li>
      </> : <>
        <li><strong>使う材料</strong>：新しい商談メモ、確認済みの商品資料、過去の提案書、社長の判断基準。</li>
        <li><strong>考える順序</strong>：お客さんの目的、使用状況、現状の課題を確認してから提案する。</li>
        <li><strong>確認の観点</strong>：冷えない席・時間帯、日差し、入口の開閉、清掃状況。不足があれば社員に聞き返す。</li>
        <li><strong>提案の形</strong>：事実と仮説、次に聞くこと、提案案、社長の判断が必要な点を分ける。</li>
        <li><strong>確約しないこと</strong>：原因、機種・台数、工事条件、金額、電気代の削減額。確認してから案内する。</li>
      </>}
    </ul>
    <h4 className={g.title}>次回の頼み方</h4>
    <code className={s.skillPrompt}>{sales ? "sales-prospectで、小規模な美容室の候補と提案を考えて" : "proposal-partnerで、この商談メモから次の質問と提案を考えて"}</code>
    <p className={g.change}>{sales ? "引き継ぐもの：得意な仕事・受注条件・選び方・提案のルール。業種ごとの候補はその都度確認する。" : "引き継ぐもの：社長が確認する観点と、判断が必要な点。前の商談の結論を、そのまま次の相手には当てはめない。"}</p>
    <p className={s.sampleNote}>スキルにまとめる流れの見本です。この画面ではAIへの接続・スキルの保存や実行は行いません。</p>
  </>;
}

export default function GrowthArtifact({ sample }: { sample: GrowthSample }) {
  return <section className={`${s.artifact} ${g.preview}`} aria-label={`営業・提案の見本：${sample}`} data-growth-sample={sample} data-static-preview>
    <span className={s.badge}>架空のデータによるサンプル体験</span>
    {sample === "materials" && <>
      <h3 className={s.artifactLead}>営業の材料をそろえる</h3>
      <dl className={g.facts}>
        <div><dt>施工事例</dt><dd>狭い店内の壁面収納、小ロットのカウンター下収納。</dd></div>
        <div><dt>会社案内</dt><dd>寸法に合わせた造作家具の設計・製作。事例から使える強みを整理。</dd></div>
        <div><dt>これから決める</dt><dd>受けたい案件の規模、地域、営業先の条件。</dd></div>
      </dl>
    </>}
    {(sample === "candidates" || sample === "qualified") && <CandidatePreview qualified={sample === "qualified"} />}
    {(sample === "outreach" || sample === "revised-outreach") && <SalesMail revised={sample === "revised-outreach"} />}
    {sample === "meeting" && <>
      <h3 className={s.artifactLead}>社員が持ち帰った商談メモ</h3>
      <div className={s.mailBody}>飲食店から、古いエアコン2台の買い替え相談。昼の客席が冷えにくい。機種と金額は未定。</div>
      <dl className={g.facts}>
        <div><dt>一緒に使う材料</dt><dd>過去の提案書、商品資料、社長が商談で聞いていること。</dd></div>
        <div><dt>目指す形</dt><dd>商品の見積もりだけでなく、使い方に合う提案と次の質問を用意する。</dd></div>
      </dl>
    </>}
    {sample === "first-proposal" && <ProposalPreview revised={false} />}
    {sample === "judgment" && <>
      <h3 className={s.artifactLead}>社長の「まず、ここを聞く」を残す</h3>
      <dl className={g.facts}>
        <div><dt>場所と時間</dt><dd>どの席が、いつ冷えない？ → 全体の問題か、特定の場所の問題かを分ける。</dd></div>
        <div><dt>使い方と環境</dt><dd>日差しや入口の開閉は？ → 機器以外の影響も確認する。</dd></div>
        <div><dt>設備の状態</dt><dd>清掃履歴や現在の機種は？ → 買い替えを決める前に現状を確かめる。</dd></div>
        <div><dt>判断を保留</dt><dd>原因が不明なら、機種・台数・効果を確約しない。</dd></div>
      </dl>
    </>}
    {sample === "revised-proposal" && <ProposalPreview revised />}
    {(sample === "sales-skill" || sample === "proposal-skill") && <SkillPreview sales={sample === "sales-skill"} />}
  </section>;
}
