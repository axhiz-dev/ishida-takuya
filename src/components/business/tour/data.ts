export type TaskId = "aggregate" | "invoice" | "inquiry";
export const tasks = [
  {
    id: "aggregate" as const,
    label: "売上日報",
    problem: "毎朝、同じ集計と確認を繰り返している…",
    detail: "送料・返品・重複。その判断も毎回手作業。",
    title: "いつもの判断を、AIの仕事の手順に。",
    solution:
      "売上明細と過去の日報をもとに、AIと会話しながら集計ルールを整理。見本で確かめ、毎朝使えるスキルにする体験です。",
    demo: "売上日報のスキルづくり",
    situation: "朝、日報を出したいのに。",
    quote: "「また数字が合わない。今日も確認だけで朝が終わりそう…」",
    frustrations: [
      { title: "まず、ファイルを集めるところから。", body: "店舗・通販・代理店のExcelを開いて、昨日の売上をひとつずつ貼り付ける。" },
      { title: "合計が合わず、明細に戻る。", body: "送料は含める？ 返品は引いた？ 同じ明細が二重に入っていないか、また見直す。" },
      { title: "数字をまとめても、まだ終わらない。", body: "「先週より下がったのはどこ？」と聞かれる前に、販売先や商品ごとの差を調べる。" },
    ],
    wish: "集計と確認の準備ができていれば、売上の変化を見ることに時間を使えるのに。",
    x: 22,
    y: 28,
  },
  {
    id: "invoice" as const,
    label: "経費の確認",
    problem: "領収書の転記と規程の確認に追われている…",
    detail: "読みにくい金額、上限超過、重複の確認。",
    title: "確認すべきところがわかる、AIの手順に。",
    solution:
      "領収書と経費規程を見ながら、AIに任せる部分と人が判断する部分を会話で整理。確認用の一覧を作るスキルにします。",
    demo: "経費確認のスキルづくり",
    situation: "締め日前、領収書が次々に届く。",
    quote: "「入力を進めたいのに、また本人に確認しないと…」",
    frustrations: [
      { title: "写真を拡大しても、金額が読めない。", body: "日付・支払先・金額をExcelへ転記。読めないものは本人に連絡して、返事を待つ。" },
      { title: "この会食費、通していいんだっけ？", body: "規程を開いて上限を確認。超えているけれど、事前承認があったかは別に聞かないとわからない。" },
      { title: "この領収書、さっきも見た気がする。", body: "二重申請かもしれないので、過去の一覧を検索。確認のたびに転記の手が止まる。" },
    ],
    wish: "転記よりも、確認が必要な申請に時間を使いたい。締め日前に慌てず終えられたら。",
    x: 52,
    y: 22,
  },
  {
    id: "inquiry" as const,
    label: "問い合わせ対応",
    problem: "担当の判断も、返信の下書きも毎回手作業…",
    detail: "返金や苦情は、勝手に返信してほしくない。",
    title: "御社の対応方針を、AIの手順に。",
    solution:
      "過去の返信と対応ルールから、担当候補と返信の下書きを準備するスキルへ。人への確認が必要な条件も一緒に決めます。",
    demo: "問い合わせ対応のスキルづくり",
    situation: "返信している間にも、次の問い合わせ。",
    quote: "「前にも同じ返事を書いたはず。どこにあったっけ…」",
    frustrations: [
      { title: "似た問い合わせでも、毎回いちから。", body: "過去のメールを探し、案内文をコピー。注文内容や名前を間違えないように書き直す。" },
      { title: "誰に確認すればいいかで、止まる。", body: "配送は出荷担当、返金は責任者。内容を読み分けて転送し、返事が来たか追いかける。" },
      { title: "急いでいても、そのまま返せない。", body: "返金や納期を約束していないか、すでに聞いたことを聞き直していないか、送信前に読み返す。" },
    ],
    wish: "担当の振り分けと下書きまでそろっていれば、お客様にどう対応するかに集中できるのに。",
    x: 83,
    y: 32,
  },
];
export type Sale = {
  id: string;
  source: string;
  customer: string;
  date: string;
  amount: number;
};
export const sales: Sale[] = [
  {
    id: "A-1041",
    source: "営業部.xlsx",
    customer: "青葉商事",
    date: "2026/09/01",
    amount: 120000,
  },
  {
    id: "A-1042",
    source: "営業部.xlsx",
    customer: "青葉商事",
    date: "2026/09/15",
    amount: 48000,
  },
  {
    id: "A-1042",
    source: "営業部.xlsx",
    customer: "青葉商事",
    date: "2026/09/15",
    amount: 48000,
  },
  {
    id: "E-2001",
    source: "EC売上.csv",
    customer: "（株）青葉商事",
    date: "2026-09-10",
    amount: 32000,
  },
  {
    id: "E-2002",
    source: "EC売上.csv",
    customer: "北斗デザイン",
    date: "2026-09-12",
    amount: 86000,
  },
  {
    id: "P-3001",
    source: "代理店.xlsx",
    customer: "株式会社北斗デザイン",
    date: "2026/09/20",
    amount: 64000,
  },
  {
    id: "P-3002",
    source: "代理店.xlsx",
    customer: "みなと企画",
    date: "2026/09/22",
    amount: 72000,
  },
];
export const customerMaster = [
  {
    name: "株式会社青葉商事",
    aliases: ["青葉商事", "（株）青葉商事", "株式会社青葉商事"],
  },
  {
    name: "株式会社北斗デザイン",
    aliases: ["北斗デザイン", "株式会社北斗デザイン"],
  },
];
export function normalizeCustomer(name: string) {
  return customerMaster.find((c) => c.aliases.includes(name))?.name ?? name;
}
export function aggregateSales(
  keepDuplicate: boolean,
  includeUnknown: boolean,
) {
  const seen = new Set<string>();
  const rows = sales
    .filter((row) => {
      const key = `${row.source}:${row.id}`;
      if (!keepDuplicate && seen.has(key)) return false;
      seen.add(key);
      return (
        includeUnknown ||
        customerMaster.some((c) => c.aliases.includes(row.customer))
      );
    })
    .map((row) => ({ ...row, customer: normalizeCustomer(row.customer) }));
  const totals = Object.entries(
    rows.reduce<Record<string, number>>((acc, row) => {
      acc[row.customer] = (acc[row.customer] ?? 0) + row.amount;
      return acc;
    }, {}),
  ).map(([customer, amount]) => ({ customer, amount }));
  return {
    rows,
    totals,
    total: rows.reduce((sum, row) => sum + row.amount, 0),
  };
}
export const yen = (value: number) =>
  new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(
    value,
  );
export const inquiries = [
  {
    id: 1,
    from: "山田様",
    subject: "導入について相談したい",
    body: "月末の集計作業について、一度お話を伺えますか？",
    category: "導入相談",
    team: "営業担当",
    reply:
      "お問い合わせありがとうございます。現在の集計作業について、詳しくお伺いできればと思います。お打ち合わせの候補日をお知らせください。",
  },
  {
    id: 2,
    from: "佐藤様",
    subject: "請求内容を確認したい",
    body: "先月の請求書について、明細を確認したいです。",
    category: "請求",
    team: "経理担当",
    reply:
      "お問い合わせありがとうございます。請求内容を担当者が確認いたします。対象の請求書番号をお知らせいただけますでしょうか。",
  },
  {
    id: 3,
    from: "鈴木様",
    subject: "その他のお問い合わせ",
    body: "担当の方に確認したいことがあります。",
    category: "その他",
    team: "受付担当",
    reply:
      "お問い合わせありがとうございます。内容を確認のうえ、担当者よりご連絡いたします。",
  },
];
