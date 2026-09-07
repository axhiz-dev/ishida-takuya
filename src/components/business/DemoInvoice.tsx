"use client";

import { useId, useState } from "react";
import type { Demo } from "@/content";
import { DemoShell } from "./DemoShell";
import styles from "./business.module.css";

type Item = { name: string; qty: number; price: number };

const CODE = `// 明細から請求書を組んで PDF にする（抜粋）
const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
const tax = Math.floor(subtotal * 0.1);

drawInvoice(ctx, { to, items, subtotal, tax, total: subtotal + tax });

const pdf = new jsPDF({ unit: "mm", format: "a4" });
pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
pdf.save(\`請求書_\${to}.pdf\`);`;

const INITIAL: Item[] = [
  { name: "Web サイト保守", qty: 1, price: 50000 },
  { name: "コンテンツ更新作業", qty: 3, price: 12000 },
  { name: "サーバー利用料", qty: 1, price: 8000 },
];

const yen = new Intl.NumberFormat("ja-JP");

/** A4 を mm で考えて、描くときだけ倍率をかける。 */
const MM = 8;
const PAGE = { w: 210, h: 297 };

export function DemoInvoice({ demo }: { demo: Demo }) {
  const id = useId();
  const [to, setTo] = useState("株式会社サンプル商会");
  const [items, setItems] = useState<Item[]>(INITIAL);
  const [busy, setBusy] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + tax;

  const update = (index: number, patch: Partial<Item>) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const generate = async () => {
    setBusy(true);
    try {
      // 和文を PDF に埋めるにはフォントを同梱する必要があり、数 MB になる。
      // ここでは canvas にブラウザのフォントで描いてから画像として貼っている。
      // 文字は選択できなくなるが、この用途では紙に出せることを優先した。
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
      ctx.textBaseline = "alphabetic";

      ctx.font = font(9, 600);
      ctx.textAlign = "center";
      ctx.fillText("請 求 書", at(105), at(30));

      ctx.textAlign = "left";
      ctx.font = font(4.5);
      ctx.fillText(`${to}　御中`, at(20), at(50));
      ctx.beginPath();
      ctx.moveTo(at(20), at(53));
      ctx.lineTo(at(95), at(53));
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 0.4 * MM;
      ctx.stroke();

      const today = new Date();
      ctx.textAlign = "right";
      ctx.font = font(3.2);
      ctx.fillText(
        `${today.getFullYear()} 年 ${today.getMonth() + 1} 月 ${today.getDate()} 日`,
        at(190),
        at(45),
      );
      ctx.fillText("石田 卓也", at(190), at(53));
      ctx.fillText("業務自動化", at(190), at(59));

      ctx.textAlign = "left";
      ctx.font = font(3.6);
      ctx.fillText("ご請求金額", at(20), at(70));
      ctx.font = font(7, 600);
      ctx.fillText(`¥ ${yen.format(total)} －`, at(20), at(82));
      ctx.beginPath();
      ctx.moveTo(at(20), at(86));
      ctx.lineTo(at(105), at(86));
      ctx.lineWidth = 0.6 * MM;
      ctx.stroke();

      // ── 明細 ──
      let y = 105;
      const cols = { name: 20, qty: 120, price: 145, amount: 190 };

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
        y += 10;
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

      // ── 合計 ──
      y += 16;
      const line = (label: string, value: number, weight = 400) => {
        ctx.font = font(3.4, weight);
        ctx.textAlign = "right";
        ctx.fillText(label, at(155), at(y));
        ctx.fillText(`¥ ${yen.format(value)}`, at(190), at(y));
        y += 9;
      };
      line("小計", subtotal);
      line("消費税（10%）", tax);
      line("合計", total, 600);

      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, PAGE.w, PAGE.h);
      pdf.save(`請求書_${to}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DemoShell demo={demo} code={CODE}>
      <div className={styles.invoice}>
        <p className={styles.formField}>
          <label htmlFor={`${id}-to`}>請求先</label>
          <input id={`${id}-to`} type="text" value={to} onChange={(event) => setTo(event.target.value)} />
        </p>

        <table className={styles.demoTable}>
          <thead>
            <tr>
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
                  <input
                    type="text"
                    aria-label={`${index + 1} 行目の品目`}
                    value={item.name}
                    onChange={(event) => update(index, { name: event.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    aria-label={`${index + 1} 行目の数量`}
                    value={item.qty}
                    onChange={(event) => update(index, { qty: Number(event.target.value) })}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    aria-label={`${index + 1} 行目の単価`}
                    value={item.price}
                    onChange={(event) => update(index, { price: Number(event.target.value) })}
                  />
                </td>
                <td className={styles.demoNumeric}>{yen.format(item.qty * item.price)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={3}>
                合計（消費税 10% 込み）
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
      </div>
    </DemoShell>
  );
}
