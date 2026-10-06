export const service = {
  name: "AI活用・伴走支援",
  price: "55,000円",
  priceExTax: "50,000円",
  duration: "4週間",
  chatDays: "火曜・金曜（祝日は翌営業日）",
} as const;

export type ExampleId = "meeting" | "planning" | "proposal";
export type DemoScene = {
  title: string;
  messages: { speaker: "you" | "ai"; text: string; attachment?: string }[];
  result?: { title: string; lines: string[]; reusable: string };
};
export const examples: { id: ExampleId; title: string; description: string; scenes: DemoScene[] }[] = [
  {
    id: "meeting", title: "会議メモをまとめる",
    description: "決定事項と担当者を整理し、共有用のメモを作ります。",
    scenes: [
      { title: "メモを渡す", messages: [
        { speaker: "you", text: "この会議メモから、決まったことと担当者をまとめてください。決まっていないことは分けてほしいです。", attachment: "打ち合わせメモ.txt" },
        { speaker: "ai", text: "チームに共有するメモですね。「来週まで」とある箇所は具体的な日付が不明です。期限は未確認として残してよいですか？" },
      ] },
      { title: "整理するルールを伝える", messages: [
        { speaker: "you", text: "はい。担当者や期限が書かれていない項目も推測せず「要確認」にしてください。決定事項、次にやること、未決事項の順でまとめてください。" },
        { speaker: "ai", text: "承知しました。担当者と期限はメモに記載された内容だけを使い、確認が必要な項目を最後にまとめます。" },
      ] },
      { title: "共有前に確認する", messages: [], result: {
        title: "打ち合わせの共有メモ",
        lines: ["決定事項｜申込フォームの入力項目を減らす", "次にやること｜田中さんが修正案を作成／期限は要確認", "未決事項｜公開日と告知の担当者", "確認すること｜修正案の期限を田中さんに確認"],
        reusable: "メモにない担当者や期限は推測しない。決定事項・次にやること・未決事項に分けて整理する。",
      } },
    ],
  },
  {
    id: "planning", title: "今日の仕事を整理する",
    description: "AIの質問に答えながら、締切と優先順位を整理します。",
    scenes: [
      { title: "今日の仕事を話す", messages: [
        { speaker: "you", text: "今日は見積書、打ち合わせの準備、請求書の確認があります。どれからやるか一緒に整理したいです。" },
        { speaker: "ai", text: "それぞれの締切と、かかりそうな時間を教えてください。ほかの人があなたの対応を待っている仕事はありますか？" },
      ] },
      { title: "締切と条件を伝える", messages: [
        { speaker: "you", text: "見積書は今日中で1時間。打ち合わせは13時からで、準備は30分。請求書は金曜までで20分です。見積書は先方が待っています。午前中に使えるのは2時間です。" },
        { speaker: "ai", text: "午前中に見積書と打ち合わせの準備を進める案を作ります。請求書の確認は午後に回せます。予備の時間も残します。" },
      ] },
      { title: "今日の段取りを確認する", messages: [], result: {
        title: "今日の仕事の順番",
        lines: ["午前｜見積書を作る（60分）", "午前｜13時の打ち合わせを準備する（30分）", "午前｜修正や連絡のための予備時間（30分）", "午後｜請求書を確認する（20分）"],
        reusable: "締切・所要時間・他の人への影響・使える時間を先に質問する。予定を詰めすぎず予備時間を残す。",
      } },
    ],
  },
  {
    id: "proposal", title: "提案書の下書きを作る",
    description: "過去の提案書と今回の条件をもとに、構成や文章を作ります。",
    scenes: [
      { title: "前回の資料を渡す", messages: [
        { speaker: "you", text: "前回の提案書を参考に、今回の下書きを作りたいです。足りない情報は先に質問してください。", attachment: "前回の提案書.pdf" },
        { speaker: "ai", text: "今回のお客様は何に困っていますか？予算と希望する納期も教えてください。" },
      ] },
      { title: "今回の条件を伝える", messages: [
        { speaker: "you", text: "問い合わせをExcelに転記する手間を減らしたいそうです。予算は20万円、来月末までに使いたいとのこと。前回と同じ構成で、金額や日付は今回の条件に合わせてください。" },
        { speaker: "ai", text: "課題、対応案、費用、日程の順で作ります。利用中のフォームとの連携が必要なので、確認できていない部分は「要確認」とします。" },
      ] },
      { title: "下書きを確認する", messages: [], result: {
        title: "問い合わせ受付の改善提案（下書き）",
        lines: ["課題｜問い合わせ内容をExcelへ手作業で転記している", "対応案｜受付情報を一覧へ反映する方法を検討", "費用｜予算20万円をもとに見積もり／詳細は要確認", "日程｜来月末の利用開始を希望／連携方法の確認後に確定"],
        reusable: "前回の提案書の構成を参考にする。今回の目的・予算・納期を質問し、未確認の条件は断定しない。",
      } },
    ],
  },
];
