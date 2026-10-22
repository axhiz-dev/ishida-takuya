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
      followup: "いつものデザインや書き方に合わせたいので、過去の提案書はありますか？ 自社のサービス案内もあれば、対応できる範囲に沿って作れます。",
      choiceLabel: "参考資料を渡す",
      next: "この過去の提案書とサービス案内を使って作って",
    },
    {
      user: "この過去の提案書とサービス案内を使ってください。今回も、画面を見ながら課題と改善案が分かる資料にしてほしいです。",
      documents: ["past-proposals", "product-guide"],
      replies: ["過去の提案書と同じ型で、3つの課題を1ページずつまとめました。現状と改善案の画面を並べ、どこを変えるのかを書いています。予算や公開時期は、次回の確認事項として残しました。"],
      sample: "proposal-draft",
      choiceLabel: "次回もこの型で作る",
      next: "次からは、会議の議事録を渡すだけでここまで作りたい",
    },
    {
      user: "このデザインと書き方をスキルにして、次からはWeb会議の議事録を渡すだけで、提案資料まで作ってほしいです。",
      replies: ["はい。この型をスキルにまとめます。次回は議事録を添えて、こう頼めば大丈夫です。"],
      sample: "proposal-reuse",
      choiceLabel: "あなたの仕事でも",
      next: "自分の仕事について相談する",
    },
  ],
};
