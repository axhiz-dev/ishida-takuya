"use client";

import { useId, useState } from "react";
import type { Demo } from "@/content";
import { DemoShell } from "./DemoShell";
import styles from "./business.module.css";

type Item = { name: string; qty: number; price: number };

const CODE = `// 明細から請求書を組んで PDF にする（抜粋）
const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
const tax = Math.floor(subtotal * 0.1);   // 端数は会社ごとに違うので設定にする

drawInvoice(ctx, { no, to, issuedOn, dueOn, items, subtotal, tax });

const pdf = new jsPDF({ unit: "mm", format: "a4" });
pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
pdf.save(\`請求書_\${no}_\${to}.pdf\`);`;

/**
 * よくある請求のかたち。実務では会社ごとにこのどれかに寄る。
 * 触る人が自分の請求に近いものを選べれば、説明しなくても伝わる。
 */
const PRESETS: { id: string; label: string; to: string; items: Item[] }[] = [
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

/** 支払サイト。「翌月末」が中小の取引でいちばん多い。 */
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
const ja = (value: string) => {
  const [y, m, d] = value.split("-");
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`;
};

/** A4 を mm で考えて、描くときだけ倍率をかける。 */
const MM = 8;
const PAGE = { w: 210, h: 297 };

export function DemoInvoice({ demo }: { demo: Demo }) {
  const id = useId();
  const today = new Date();

  const [to, setTo] = useState(PRESETS[1]!.to);
  const [items, setItems] = useState<Item[]>(PRESETS[1]!.items);
  const [issuedOn, setIssuedOn] = useState(iso(today));
  const [dueOn, setDueOn] = useState(iso(endOfMonth(today, 1)));
  const [busy, setBusy] = useState(false);

  // 連番。手で採番するとかならず飛ぶので、実物では通し番号を持つ。
  const invoiceNo = `${issuedOn.replace(/-/g, "").slice(0, 6)}-001`;

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + tax;

  const update = (index: number, patch: Partial<Item>) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setTo(preset.to);
    setItems(preset.items);
  };

  const applyTerm = (months: number) => setDueOn(iso(endOfMonth(new Date(issuedOn), months)));

  const generate = async () => {
    setBusy(true);
    try {
      // 和文を PDF に埋めるにはフォントを同梱する必要があり、数 MB になる。
      // ここでは canvas にブラウザのフォントで描いてから画像として貼っている。
      await document.fonts.ready;

      const canvas = document.createElement("canvas");
      canvas.width = PAGE.w * MM;
      canvas.height = PAGE.h * MM;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const family =
        getComputedStyle(document.documentElement).getPropertyValue("--font-jp-sans").trim() ||
        "sans-serif";
      const font = (size: number, weight = 400) => `${weight} ${size * MM}px ${family}, sans-serif`;
      const at = (mm: number) => mm * MM;

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#111";
      ctx.strokeStyle = "#111";
      ctx.textBaseline = "alphabetic";

      ctx.font = font(9, 600);
      ctx.textAlign = "center";
      ctx.fillText("請 求 書", at(105), at(28));

      ctx.textAlign = "left";
      ctx.font = font(4.5);
      ctx.fillText(`${to}　御中`, at(20), at(48));
      ctx.lineWidth = 0.4 * MM;
      ctx.beginPath();
      ctx.moveTo(at(20), at(51));
      ctx.lineTo(at(95), at(51));
      ctx.stroke();

      // 発行者。適格請求書は登録番号の記載が要る（2023 年 10 月から）。
      ctx.textAlign = "right";
      ctx.font = font(3.2);
      ctx.fillText(`請求書番号　${invoiceNo}`, at(190), at(42));
      ctx.fillText(`請求日　　　${ja(issuedOn)}`, at(190), at(48));
      ctx.fillText(`支払期日　　${ja(dueOn)}`, at(190), at(54));
      ctx.font = font(3.6);
      ctx.fillText("石田 卓也", at(190), at(64));
      ctx.font = font(3.2);
      ctx.fillText("登録番号 T0000000000000", at(190), at(70));

      ctx.textAlign = "left";
      ctx.font = font(3.6);
      ctx.fillText("ご請求金額", at(20), at(68));
      ctx.font = font(7, 600);
      ctx.fillText(`¥ ${yen.format(total)} －`, at(20), at(80));
      ctx.lineWidth = 0.6 * MM;
      ctx.beginPath();
      ctx.moveTo(at(20), at(84));
      ctx.lineTo(at(105), at(84));
      ctx.stroke();

      // ── 明細 ──
      let y = 104;
      const cols = { name: 20, qty: 120, price: 150, amount: 190 };

      ctx.font = font(3.2, 600);
      ctx.fillText("品目", at(cols.name), at(y));
      ctx.textAlign = "right";
      ctx.fillText("数量", at(cols.qty), at(y));
      ctx.fillText("単価", at(cols.price), at(y));
      ctx.fillText("金額", at(cols.amount), at(y));

      ctx.lineWidth = 0.3 * MM;
      ctx.beginPath();
      ctx.moveTo(at(20), at(y + 3));
      ctx.lineTo(at(190), at(y + 3));
      ctx.stroke();

      ctx.font = font(3.2);
      for (const item of items) {
        y += 9;
        ctx.textAlign = "left";
        ctx.fillText(item.name, at(cols.name), at(y));
        ctx.textAlign = "right";
        ctx.fillText(yen.format(item.qty), at(cols.qty), at(y));
        ctx.fillText(yen.format(item.price), at(cols.price), at(y));
        ctx.fillText(yen.format(item.qty * item.price), at(cols.amount), at(y));

        ctx.strokeStyle = "#ccc";
        ctx.beginPath();
        ctx.moveTo(at(20), at(y + 3));
        ctx.lineTo(at(190), at(y + 3));
        ctx.stroke();
        ctx.strokeStyle = "#111";
      }

      // ── 合計。税率ごとに区分して書くのも適格請求書の要件。 ──
      y += 15;
      const line = (label: string, value: number, weight = 400) => {
        ctx.font = font(3.4, weight);
        ctx.textAlign = "right";
        ctx.fillText(label, at(155), at(y));
        ctx.fillText(`¥ ${yen.format(value)}`, at(190), at(y));
        y += 9;
      };
      line("10% 対象", subtotal);
      line("消費税", tax);
      line("合計", total, 600);

      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, PAGE.w, PAGE.h);
      pdf.save(`請求書_${invoiceNo}_${to}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DemoShell demo={demo} code={CODE}>
      <div className={styles.invoice}>
        <div className={styles.presets} role="group" aria-label="請求のかたち">
          <span className={styles.presetsLabel}>近いものを選ぶ</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={styles.chipGhost}
              onClick={() => applyPreset(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className={styles.invoiceHead}>
          <p className={styles.formField}>
            <label htmlFor={`${id}-to`}>請求先</label>
            <input id={`${id}-to`} type="text" value={to} onChange={(e) => setTo(e.target.value)} />
          </p>

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
            {/* 日付を数えるのは手間なので、支払サイトから引けるようにする */}
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
                10% 対象
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
          <button type="button" className={styles.chip} onClick={() => void generate()} disabled={busy}>
            {busy ? "作成しています…" : "請求書を作る"}
            <span aria-hidden="true">↓</span>
          </button>
        </div>

        <p className={styles.dropzoneNote}>
          請求書番号 {invoiceNo} ／ 適格請求書（インボイス）の記載事項を満たす形で出力します。
        </p>
      </div>
    </DemoShell>
  );
}
