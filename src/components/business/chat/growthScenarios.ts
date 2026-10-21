import type { Experience } from "./content";
import type { GrowthDocumentId } from "./growthDocuments";

export type GrowthExperience = Extract<Experience, "prospecting" | "proposal">;
export type GrowthSample = "sales-draft" | "sales-revised" | "sales-reuse" | "proposal-notes" | "proposal-draft" | "proposal-revised" | "proposal-reuse";
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
      user: "Web会議が終わりました。この議事録から、お客さんへの提案資料まで作れますか？ 相談内容はホームページのリニューアルです。",
      documents: ["meeting"],
      replies: ["まず、お客さんが困っていることと、今回提案することを整理しました。会議で決まっていない金額や公開日は、確認事項として残しています。"],
      sample: "proposal-notes",
      choiceLabel: "提案資料にする",
      next: "過去の提案書を参考に、うちのデザインで作って",
    },
    {
      user: "この過去の提案書とサービス案内を使って、うちのデザインで4ページにまとめてください。",
      documents: ["past-proposals", "product-guide"],
      replies: ["紺色の見出し、緑のアクセント、短い文章を引き継いで作りました。議事録の『どこから問い合わせればいいか分からない』という声を、問い合わせボタンの改善につなげています。"],
      sample: "proposal-draft",
      choiceLabel: "自社らしい書き方に整える",
      next: "会社紹介より、お客さんの課題と提案を先にして",
    },
    {
      user: "うちは会社紹介より、お客さんの課題と提案を先に伝えたいです。『導線を最適化』も『問い合わせボタンを見つけやすく』にしてください。",
      replies: ["課題 → 改善案 → 進め方 → 会社紹介の順に直しました。専門用語を減らし、お客さんが『何が変わるか』を想像できる資料にしています。下の見本で4ページとも確認できます。"],
      sample: "proposal-revised",
      choiceLabel: "次の商談につなげる",
      next: "次からは、会議の議事録を渡すだけでここまで作りたい",
    },
    {
      user: "このデザインと書き方を覚えて、次からはWeb会議の議事録を渡すだけで、提案資料まで作ってほしいです。",
      replies: ["今回の型を、次も使えるスキルにまとめる見本です。目指すのは、Web会議の議事録から自社らしい提案資料まで下書きがそろい、営業は内容を確認して、お客さんへの提案に進める流れです。"],
      sample: "proposal-reuse",
      choiceLabel: "あなたの仕事でも",
      next: "自分の仕事について相談する",
    },
  ],
};
