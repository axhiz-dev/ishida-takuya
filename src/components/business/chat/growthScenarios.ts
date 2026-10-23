import type { Experience } from "./content";
import type { GrowthDocumentId } from "./growthDocuments";

export type GrowthExperience = Extract<Experience, "prospecting" | "proposal">;
export type GrowthSample = "sales-draft" | "sales-revised" | "sales-reuse" | "proposal-notes" | "proposal-draft" | "proposal-reuse";
type GrowthStep = {
  user: string;
  documents?: GrowthDocumentId[];
  replies: string[];
  sample: GrowthSample;
  followup?: string;
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
      user: "Web会議が終わりました。この議事録から、お客さんへの提案資料まで作れますか？ 相談内容はホームページのリニューアルです。",
      documents: ["meeting"],
      replies: ["はい。議事録から、今回の提案に入れる内容を整理しました。"],
      sample: "proposal-notes",
      followup: "いつものデザインや書き方に合わせたいので、過去の提案書はありますか？ 過去の対応内容と金額が分かる見積一覧もあれば、概算見積まで一緒に作れます。",
      choiceLabel: "参考資料を渡す",
      next: "この過去の提案書と見積一覧で、見積も一緒に作って",
    },
    {
      user: "この過去の提案書と見積一覧を使ってください。画面で課題と改善案を説明できる提案資料に、概算見積も付けてほしいです。",
      documents: ["past-proposals", "estimate-history"],
      replies: ["お客さんに提示するPowerPointを作りました。3つの改善案と、概算見積の全4ページです。"],
      sample: "proposal-draft",
      followup: "概算は17万5,000円（税別）です。見積一覧のE-01・E-03・E-06を参照し、既存のデザイン・フォーム・事例テンプレートを使い、原稿と写真は支給される前提で計算しました。条件が変わる場合は、見積もりも見直します。",
      choiceLabel: "次回もこの型で作る",
      next: "次からは、会議の議事録を渡すだけでここまで作りたい",
    },
    {
      user: "このデザインと書き方をスキルにして、次からはWeb会議の議事録を渡すだけで、提案資料と概算見積まで作ってほしいです。",
      replies: ["/proposal-maker というスキルにまとめました。提案書のデザインと書き方、過去の対応から見積もるルールを引き継ぎます。"],
      sample: "proposal-reuse",
      choiceLabel: "あなたの仕事でも",
      next: "自分の仕事について相談する",
    },
  ],
};
