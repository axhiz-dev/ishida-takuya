/**
 * 請求書 1 枚を PDF のバイト列にする。
 *
 * 和文を PDF に埋め込むにはフォントの同梱が要り、数 MB になる。
 * ここでは canvas にブラウザのフォントで描いてから画像として貼っている。
 * 文字は選択できなくなるが、この用途では紙に出せることを優先した。
 *
 * 1 件でも 10 件でもここを通す。描き方が 2 つあると必ずずれる。
 */

export type InvoiceItem = { name: string; qty: number; price: number };

export type Invoice = {
  /** 通し番号。手で採番すると必ず飛ぶので機械で振る。 */
  no: string;
  to: string;
  issuedOn: string;
  dueOn: string;
  items: InvoiceItem[];
};

/** 発行者。実際に使うときはここを書き換える。 */
export const ISSUER = {
  name: "石田 卓也",
  /** 適格請求書には登録番号の記載が要る（2023 年 10 月から）。 */
  registration: "登録番号 T0000000000000",
} as const;

/** 消費税。端数の扱いは会社ごとに違うので、ここ 1 か所に閉じてある。 */
export const TAX_RATE = 0.1;
export const roundTax = (amount: number) => Math.floor(amount * TAX_RATE);

export const subtotalOf = (items: InvoiceItem[]) =>
  items.reduce((sum, item) => sum + item.qty * item.price, 0);

const yen = new Intl.NumberFormat("ja-JP");

const ja = (value: string) => {
  const [y, m, d] = value.split("-");
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`;
};

/** A4 を mm で考えて、描くときだけ倍率をかける。 */
const MM = 8;
const PAGE = { w: 210, h: 297 };

function draw(ctx: CanvasRenderingContext2D, invoice: Invoice, family: string) {
  const font = (size: number, weight = 400) => `${weight} ${size * MM}px ${family}, sans-serif`;
  const at = (mm: number) => mm * MM;

  const subtotal = subtotalOf(invoice.items);
  const tax = roundTax(subtotal);
  const total = subtotal + tax;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, PAGE.w * MM, PAGE.h * MM);
  ctx.fillStyle = "#111";
  ctx.strokeStyle = "#111";
  ctx.textBaseline = "alphabetic";

  ctx.font = font(9, 600);
  ctx.textAlign = "center";
  ctx.fillText("請 求 書", at(105), at(28));

  ctx.textAlign = "left";
  ctx.font = font(4.5);
  ctx.fillText(`${invoice.to}　御中`, at(20), at(48));
  ctx.lineWidth = 0.4 * MM;
  ctx.beginPath();
  ctx.moveTo(at(20), at(51));
  ctx.lineTo(at(95), at(51));
  ctx.stroke();

  ctx.textAlign = "right";
  ctx.font = font(3.2);
  ctx.fillText(`請求書番号　${invoice.no}`, at(190), at(42));
  ctx.fillText(`請求日　　　${ja(invoice.issuedOn)}`, at(190), at(48));
  ctx.fillText(`支払期日　　${ja(invoice.dueOn)}`, at(190), at(54));
  ctx.font = font(3.6);
  ctx.fillText(ISSUER.name, at(190), at(64));
  ctx.font = font(3.2);
  ctx.fillText(ISSUER.registration, at(190), at(70));

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
  for (const item of invoice.items) {
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
  line(`${Math.round(TAX_RATE * 100)}% 対象`, subtotal);
  line("消費税", tax);
  line("合計", total, 600);
}

/** 和文が豆腐にならないよう、フォントが載りきってから描く。 */
async function ready(): Promise<string> {
  await document.fonts.ready;
  return (
    getComputedStyle(document.documentElement).getPropertyValue("--font-jp-sans").trim() ||
    "sans-serif"
  );
}

function canvasFor(invoice: Invoice, family: string): HTMLCanvasElement | null {
  const canvas = document.createElement("canvas");
  canvas.width = PAGE.w * MM;
  canvas.height = PAGE.h * MM;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  draw(ctx, invoice, family);
  return canvas;
}

/** 1 件を保存する。 */
export async function saveInvoice(invoice: Invoice): Promise<void> {
  const family = await ready();
  const canvas = canvasFor(invoice, family);
  if (!canvas) return;

  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, PAGE.w, PAGE.h);
  pdf.save(`請求書_${invoice.no}_${invoice.to}.pdf`);
}

/**
 * まとめて作って ZIP にする。
 *
 * 1 枚ごとに await を挟んでいるのは、10 枚ぶんの canvas を一度に
 * 抱えるとメモリを食うのと、進捗を出すため。速さより、
 * 「何件目まで進んだか」が見えることを優先している。
 */
export async function buildInvoiceZip(
  invoices: Invoice[],
  onProgress?: (done: number) => void,
): Promise<Blob> {
  const family = await ready();
  const { jsPDF } = await import("jspdf");
  const { createZip } = await import("@/lib/zip");

  const entries: { name: string; data: Uint8Array<ArrayBuffer> }[] = [];

  for (const [index, invoice] of invoices.entries()) {
    const canvas = canvasFor(invoice, family);
    if (!canvas) continue;

    const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, PAGE.w, PAGE.h);
    entries.push({
      name: `請求書_${invoice.no}_${invoice.to}.pdf`,
      data: new Uint8Array(pdf.output("arraybuffer")),
    });

    onProgress?.(index + 1);
    // 1 枚ごとに描画を返して、ボタンの表示が固まらないようにする
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return createZip(entries);
}
