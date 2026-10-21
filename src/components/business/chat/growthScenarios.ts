import type { Experience } from "./content";
import type { GrowthDocumentId } from "./growthDocuments";

export type GrowthExperience = Extract<Experience, "prospecting" | "proposal">;
export type GrowthSample = "sales-draft" | "sales-revised" | "sales-reuse" | "proposal-draft" | "proposal-revised" | "proposal-reuse";
type GrowthStep = {
  user: string;
  documents?: GrowthDocumentId[];
  replies: string[];
  sample: GrowthSample;
  choiceLabel: string;
  next: string;
};

export const growthScenarios: Record<GrowthExperience, GrowthStep[]> = {
  prospecting: [
    {
      user: "店舗向けのオーダー家具を作っています。施工事例と会社案内を渡すので、飲食店以外の営業先と提案を考えてください。首都圏で20〜100万円の仕事を増やしたいです。",
      documents: ["company", "work"],
      replies: ["狭い空間の収納と、小ロット製作が強みですね。宿泊施設を候補に、選んだ理由と提案をまとめました。自社の売り方に合わせて直してみましょう。"],
      sample: "sales-draft",
      choiceLabel: "自社の条件に合わせる",
      next: "全国チェーンは外して。写真と寸法から相談する形にして",
    },
    {
      user: "全国チェーンは手続きが合わないので外してください。1〜3店舗くらいがいいです。無料の現地調査は約束せず、まず写真と寸法から相談する形にしてください。",
      replies: ["小規模な施設に絞り、ホテルKOTOへの提案を直しました。ロビー全体の改装ではなく、荷物置き場1か所から相談するメールです。"],
      sample: "sales-revised",
      choiceLabel: "次の営業にも使う",
      next: "この選び方をスキルにして、次は美容室で探して",
    },
    {
      user: "この選び方と提案のルールをスキルにしてください。次は小規模な美容室で、同じように候補と提案を考えてほしいです。",
      replies: ["sales-prospectとして残す見本です。次は業種を伝えるだけで、自社の強みや今回の修正を引き継げます。美容室なら、席まわりの収納を切り口に探します。"],
      sample: "sales-reuse",
      choiceLabel: "あなたの仕事でも",
      next: "自分の仕事について相談する",
    },
  ],
  proposal: [
    {
      user: "業務用エアコンを販売しています。社員は頼まれた機種の見積もりで終わりがちです。商談メモと過去の提案書から、お客さんに合う提案を一緒に考えてもらえますか？",
      documents: ["meeting", "past-proposals", "product-guide"],
      replies: ["買い替え相談のたたき台を作りました。過去の事例には、使い方を聞いて提案を変えた例もあります。社長なら、今回どこから確認しますか？"],
      sample: "proposal-draft",
      choiceLabel: "社長の判断を加える",
      next: "冷えない席と時間を先に確認。追加で聞いた内容も反映して",
    },
    {
      user: "すぐ2台の買い替えを勧めず、冷えない席と時間から確認してください。追加で聞くと、15〜17時の窓側だけで、ほかの席は問題なし。清掃状況は未確認です。次に聞くことも残してください。",
      documents: ["followup"],
      replies: ["2台の買い替えを前提にせず、窓側の環境と設備の状態を確認する提案に直しました。社員が次に聞くことと、社長の判断が必要な点も分けています。"],
      sample: "proposal-revised",
      choiceLabel: "社員が次の商談でも使えるようにする",
      next: "この観点をスキルにして、次から社員も使えるようにして",
    },
    {
      user: "この観点をスキルにして、次から社員も使えるようにしてください。新しい商談メモを渡したら、足りない情報を聞き返し、提案と次の質問を考える形がいいです。",
      replies: ["proposal-partnerとして残す見本です。次の商談でも、社長が確認している観点から提案を考えます。前の結論を当てはめず、情報が足りなければ社員に聞き返します。"],
      sample: "proposal-reuse",
      choiceLabel: "あなたの仕事でも",
      next: "自分の仕事について相談する",
    },
  ],
};
