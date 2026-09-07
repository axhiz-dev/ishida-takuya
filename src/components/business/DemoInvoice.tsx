"use client";

import { useId, useState } from "react";
import type { Demo } from "@/content";
import { downloadBlob } from "@/lib/download";
import { DemoShell } from "./DemoShell";
import {
  buildInvoiceZip,
  roundTax,
  saveInvoice,
  subtotalOf,
  TAX_RATE,
  type InvoiceItem,
} from "./invoicePdf";
import styles from "./business.module.css";

const CODE = `// 顧客リストから全件分の請求書を作って ZIP にまとめる（抜粋）
const entries = [];
for (const [i, customer] of customers.entries()) {
  const pdf = renderInvoice({
    no: \`\${yyyymm}-\${String(i + 1).padStart(3, "0")}\`,
    to: customer.to,
    items: [{ name: customer.item, qty: 1, price: customer.price }],
    issuedOn, dueOn,
  });
  entries.push({ name: \`請求書_\${no}_\${customer.to}.pdf\`, data: pdf });
}

download(createZip(entries), \`請求書_\${yyyymm}.zip\`);`;

/** よくある請求のかたち。触る人が自分の請求に近いものを選べればいい。 */
const PRESETS: { id: string; label: string; to: string; items: InvoiceItem[] }[] = [
  {
    id: "retainer",
    label: "毎月の保守",
    to: "株式会社サンプル商会",
    items: [{ name: "システム保守（月額）", qty: 1, price: 30000 }],
  },
  {
    id: "delivery",
    label: "制作物の納品",
    to: "サンプル工業株式会社",
    items: [
      { name: "業務システム開発一式", qty: 1, price: 300000 },
      { name: "操作マニュアル作成", qty: 1, price: 40000 },
      { name: "導入時の説明会", qty: 2, price: 15000 },
    ],
  },
  {
    id: "hourly",
    label: "時間単価の作業",
    to: "サンプル物流株式会社",
    items: [
      { name: "追加改修（3 月分）", qty: 12, price: 15000 },
      { name: "打ち合わせ", qty: 2, price: 15000 },
    ],
  },
];

/**
 * まとめて作るほうのサンプル。
 * 継続課金は 1 社 1 行になるので、数量は持たせていない。
 */
type Customer = { to: string; item: string; price: number };

const CUSTOMERS: Customer[] = [
  { to: "株式会社サンプル商会", item: "システム保守（月額）", price: 30000 },
  { to: "サンプル工業株式会社", item: "システム保守（月額）", price: 50000 },
  { to: "サンプル物流株式会社", item: "受注データ連携（月額）", price: 80000 },
  { to: "有限会社サンプル製作所", item: "システム保守（月額）", price: 30000 },
  { to: "サンプル建設株式会社", item: "日報集計（月額）", price: 45000 },
  { to: "株式会社サンプル食品", item: "システム保守（月額）", price: 30000 },
  { to: "サンプル印刷株式会社", item: "見積書作成（月額）", price: 35000 },
  { to: "株式会社サンプル電機", item: "在庫連携（月額）", price: 60000 },
  { to: "サンプル運輸株式会社", item: "配車表作成（月額）", price: 55000 },
  { to: "株式会社サンプル薬品", item: "システム保守（月額）", price: 30000 },
];

const TERMS = [
  { id: "next-end", label: "翌月末", months: 1 },
  { id: "after-next-end", label: "翌々月末", months: 2 },
  { id: "this-end", label: "今月末", months: 0 },
] as const;

const yen = new Intl.NumberFormat("ja-JP");
const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const endOfMonth = (from: Date, add: number) =>
  new Date(from.getFullYear(), from.getMonth() + add + 1, 0);

export function DemoInvoice({ demo }: { demo: Demo }) {
  const id = useId();
  const today = new Date();

  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [to, setTo] = useState(PRESETS[1]!.to);
  const [items, setItems] = useState<InvoiceItem[]>(PRESETS[1]!.items);
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [issuedOn, setIssuedOn] = useState(iso(today));
  const [dueOn, setDueOn] = useState(iso(endOfMonth(today, 1)));
  const [progress, setProgress] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const yyyymm = issuedOn.replace(/-/g, "").slice(0, 6);
  const numberFor = (index: number) => `${yyyymm}-${String(index + 1).padStart(3, "0")}`;

  const subtotal = subtotalOf(items);
  const tax = roundTax(subtotal);
  const total = subtotal + tax;

  const bulkSubtotal = customers.reduce((sum, customer) => sum + customer.price, 0);
  const bulkTotal = bulkSubtotal + roundTax(bulkSubtotal);

  const update = (index: number, patch: Partial<InvoiceItem>) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const updateCustomer = (index: number, patch: Partial<Customer>) =>
    setCustomers((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const applyTerm = (months: number) => setDueOn(iso(endOfMonth(new Date(issuedOn), months)));

  const makeOne = async () => {
    setBusy(true);
    try {
      await saveInvoice({ no: numberFor(0), to, issuedOn, dueOn, items });
    } finally {
      setBusy(false);
    }
  };

  const makeAll = async () => {
    setBusy(true);
    setProgress(0);
    try {
      const blob = await buildInvoiceZip(
        customers.map((customer, index) => ({
          no: numberFor(index),
          to: customer.to,
          issuedOn,
          dueOn,
          items: [{ name: customer.item, qty: 1, price: customer.price }],
        })),
        setProgress,
      );

      downloadBlob(blob, `請求書_${yyyymm}.zip`);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  return (
    <DemoShell demo={demo} code={CODE}>
      <div className={styles.invoice}>
        <div className={styles.chartSwitch} role="group" aria-label="作り方">
          <button
            type="button"
            className={styles.chartSwitchItem}
            aria-pressed={mode === "single"}
            onClick={() => setMode("single")}
          >
            1 件つくる
          </button>
          <button
            type="button"
            className={styles.chartSwitchItem}
            aria-pressed={mode === "bulk"}
            onClick={() => setMode("bulk")}
          >
            {customers.length} 件まとめてつくる
          </button>
        </div>

        {/* 日付は 1 件でもまとめてでも共通。締めと支払サイトは請求単位ではなく月単位で決まる。 */}
        <div className={styles.invoiceHead}>
          {mode === "single" ? (
            <p className={styles.formField}>
              <label htmlFor={`${id}-to`}>請求先</label>
              <input id={`${id}-to`} type="text" value={to} onChange={(e) => setTo(e.target.value)} />
            </p>
          ) : null}

          <p className={styles.formField}>
            <label htmlFor={`${id}-issued`}>請求日</label>
            <input
              id={`${id}-issued`}
              type="date"
              value={issuedOn}
              onChange={(e) => setIssuedOn(e.target.value)}
            />
          </p>

          <p className={styles.formField}>
            <label htmlFor={`${id}-due`}>支払期日</label>
            <input
              id={`${id}-due`}
              type="date"
              value={dueOn}
              onChange={(e) => setDueOn(e.target.value)}
            />
            <span className={styles.terms2}>
              {TERMS.map((term) => (
                <button
                  key={term.id}
                  type="button"
                  className={styles.termChip}
                  onClick={() => applyTerm(term.months)}
                >
                  {term.label}
                </button>
              ))}
            </span>
          </p>
        </div>

        {mode === "single" ? (
          <>
            <div className={styles.presets} role="group" aria-label="請求のかたち">
              <span className={styles.presetsLabel}>近いものを選ぶ</span>
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={styles.chipGhost}
                  onClick={() => {
                    setTo(preset.to);
                    setItems(preset.items);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <table className={styles.demoTable}>
              <thead>
                <tr>
                  <th scope="col">
                    <span className={styles.visuallyHidden}>行の削除</span>
                  </th>
                  <th scope="col">品目</th>
                  <th scope="col">数量</th>
                  <th scope="col">単価</th>
                  <th scope="col">金額</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <button
                        type="button"
                        className={styles.rowRemove}
                        aria-label={`${index + 1} 行目「${item.name || "未入力"}」を削除`}
                        disabled={items.length === 1}
                        onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                      >
                        ×
                      </button>
                    </td>
                    <td>
                      <input
                        type="text"
                        aria-label={`${index + 1} 行目の品目`}
                        value={item.name}
                        onChange={(e) => update(index, { name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        aria-label={`${index + 1} 行目の数量`}
                        value={item.qty}
                        onChange={(e) => update(index, { qty: Number(e.target.value) })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        aria-label={`${index + 1} 行目の単価`}
                        value={item.price}
                        onChange={(e) => update(index, { price: Number(e.target.value) })}
                      />
                    </td>
                    <td className={styles.demoNumeric}>{yen.format(item.qty * item.price)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={4}>
                    {Math.round(TAX_RATE * 100)}% 対象
                  </th>
                  <td className={styles.demoNumeric}>{yen.format(subtotal)}</td>
                </tr>
                <tr>
                  <th scope="row" colSpan={4}>
                    消費税
                  </th>
                  <td className={styles.demoNumeric}>{yen.format(tax)}</td>
                </tr>
                <tr>
                  <th scope="row" colSpan={4}>
                    合計
                  </th>
                  <td className={styles.demoNumeric}>{yen.format(total)}</td>
                </tr>
              </tfoot>
            </table>

            <div className={styles.dropzoneActions}>
              <button
                type="button"
                className={styles.chipGhost}
                onClick={() => setItems((prev) => [...prev, { name: "", qty: 1, price: 0 }])}
              >
                行を足す
              </button>
              <button type="button" className={styles.chip} onClick={() => void makeOne()} disabled={busy}>
                {busy ? "作成しています…" : "請求書を作る"}
                <span aria-hidden="true">↓</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.demoStatus}>
              毎月おなじ相手に請求している場合は、この一覧を更新するだけで済みます。
            </p>

            <table className={styles.demoTable}>
              <thead>
                <tr>
                  <th scope="col">
                    <span className={styles.visuallyHidden}>行の削除</span>
                  </th>
                  <th scope="col">番号</th>
                  <th scope="col">請求先</th>
                  <th scope="col">品目</th>
                  <th scope="col">金額（税抜）</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={index}>
                    <td>
                      <button
                        type="button"
                        className={styles.rowRemove}
                        aria-label={`${customer.to} の行を削除`}
                        disabled={customers.length === 1}
                        onClick={() => setCustomers((prev) => prev.filter((_, i) => i !== index))}
                      >
                        ×
                      </button>
                    </td>
                    <td className={styles.demoMuted}>{numberFor(index)}</td>
                    <td>
                      <input
                        type="text"
                        aria-label={`${index + 1} 件目の請求先`}
                        value={customer.to}
                        onChange={(e) => updateCustomer(index, { to: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        aria-label={`${index + 1} 件目の品目`}
                        value={customer.item}
                        onChange={(e) => updateCustomer(index, { item: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        aria-label={`${index + 1} 件目の金額`}
                        value={customer.price}
                        onChange={(e) => updateCustomer(index, { price: Number(e.target.value) })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={4}>
                    {customers.length} 件・合計（消費税込み）
                  </th>
                  <td className={styles.demoNumeric}>{yen.format(bulkTotal)}</td>
                </tr>
              </tfoot>
            </table>

            <div className={styles.dropzoneActions}>
              <button
                type="button"
                className={styles.chipGhost}
                onClick={() =>
                  setCustomers((prev) => [...prev, { to: "", item: "", price: 0 }])
                }
              >
                行を足す
              </button>
              <button type="button" className={styles.chip} onClick={() => void makeAll()} disabled={busy}>
                {progress !== null
                  ? `${progress} / ${customers.length} 件目…`
                  : `${customers.length} 件まとめて作る`}
                <span aria-hidden="true">↓</span>
              </button>
            </div>
          </>
        )}

        <p className={styles.dropzoneNote}>
          {mode === "single"
            ? `請求書番号 ${numberFor(0)}`
            : `請求書番号 ${numberFor(0)} 〜 ${numberFor(customers.length - 1)} を自動で振り、ZIP にまとめます`}
          ／ 適格請求書（インボイス）の記載事項を満たす形で出力します。
        </p>
      </div>
    </DemoShell>
  );
}
