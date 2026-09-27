export type TaskId = "aggregate" | "invoice" | "inquiry";
export const tasks = [
  {
    id: "aggregate" as const,
    label: "集計・転記",
    problem: "毎月、同じような集計を作っている…",
    detail: "ファイルを開いて、コピーして、また確認。",
    title: "毎月の集計、まとめて自動化できます。",
    solution:
      "形式の違う売上明細をひとつに。顧客名の照合や重複チェックまで行い、確認が必要な箇所だけを残します。",
    demo: "月次売上の取りまとめ",
    x: 22,
    y: 28,
  },
  {
    id: "invoice" as const,
    label: "請求書づくり",
    problem: "請求書を1件ずつ作って、確認して…",
    detail: "宛名と明細を転記するだけで、月末が終わる。",
    title: "取引明細から、請求書をまとめて作成。",
    solution:
      "顧客ごとに明細をまとめ、宛名や金額を反映。請求書を確認し、PDFで保存するところまで体験できます。",
    demo: "請求書の一括作成",
    x: 52,
    y: 22,
  },
  {
    id: "inquiry" as const,
    label: "問い合わせ対応",
    problem: "一次対応が遅れて、取りこぼしているかも…",
    detail: "担当者への連絡も、返信の確認も、手作業。",
    title: "届いた問い合わせを、対応につなげます。",
    solution:
      "問い合わせを一覧にまとめ、決めたルールで担当を振り分け。一次返信の下書きと、未対応の確認をひとつの画面に。",
    demo: "問い合わせの受付と振り分け",
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
      return includeUnknown || row.customer !== "みなと企画";
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
