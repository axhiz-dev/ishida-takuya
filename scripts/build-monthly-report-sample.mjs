import fs from 'node:fs/promises';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

// Run with @oai/artifact-tool in the Codex primary runtime, from a temporary
// directory with its node_modules symlink. Pass the repository samples path.
const output = process.argv[2];
if (!output) throw new Error('Pass the output samples directory');
const previewDir = process.argv[3];
const customers = [
  ['山田商事', ['山田商事', '山田商事 株式会社'], '営業部 鈴木さん'],
  ['田中工業', ['田中工業', '㈱田中工業'], '営業部 佐藤さん'],
  ['青葉製作所', ['青葉製作所', '株式会社 青葉製作所'], '営業部 高橋さん'],
  ['東和物流', ['東和物流', '東和物流 株式会社'], '営業部 伊藤さん'],
  ['さくら企画', ['さくら企画', '㈱さくら企画'], '営業部 小林さん'],
  ['北斗商会', ['北斗商会', '株式会社 北斗商会'], '営業部 渡辺さん'],
  ['みなと設備', ['みなと設備', 'みなと設備 株式会社'], '営業部 加藤さん'],
  ['光洋印刷', ['光洋印刷', '㈱光洋印刷'], '営業部 吉田さん'],
].map(([name, names, owner]) => ({ name, names, owner }));
const amounts = [
  [850000,650000,580000,420000,350000,280000,190000,180000],
  [920000,710000,600000,480000,390000,300000,230000,210000],
  [900000,690000,650000,500000,360000,320000,250000,230000],
  [1020000,800000,750000,560000,440000,340000,280000,260000],
  [1080000,820000,810000,600000,470000,360000,300000,280000],
  [1240000,960000,900000,650000,530000,420000,350000,310000],
];
const sales = [], payments = [];
for (let m = 0; m < 6; m++) for (let c = 0; c < 8; c++) {
  const month = `2026-${String(m + 4).padStart(2, '0')}`;
  const invoice = `INV-${m + 4}-${c + 1}`;
  const amount = amounts[m][c];
  sales.push({ month, invoice, name: customers[c].name, amount, due: m === 5 && c === 6 ? '2026-10-10' : `${month}-25` });
  const paid = m === 5 && (c === 4 || c === 6) ? 0 : m === 5 && c === 1 ? amount - 180000 : amount;
  if (paid) payments.push({ id: `PAY-${m + 4}-${c + 1}`, date: `${month}-24`, invoice, name: customers[c].names[1], amount: paid });
}
payments.push({ id: 'PAY-9-UNKNOWN', date: '2026-09-28', invoice: '', name: 'アオバ', amount: 150000 });
const sample = { customers, sales, payments };
await fs.writeFile(`${output}/monthly-report.json`, JSON.stringify(sample, null, 2) + '\n');

const workbook = Workbook.create();
const definitions = [
  { name: '売上データ', headers: ['売上月', '請求番号', '取引先名', '金額（税込円）', '入金期限'], rows: sales.map(row => [new Date(`${row.month}-01T00:00:00Z`), row.invoice, row.name, row.amount, new Date(`${row.due}T00:00:00Z`)]), dates: ['A2:A49', 'E2:E49'], amount: 'D2:D49' },
  { name: '入金明細', headers: ['入金日', '入金番号', '請求番号', '取引先名', '金額（税込円）'], rows: payments.map(row => [new Date(`${row.date}T00:00:00Z`), row.id, row.invoice, row.name, row.amount]), dates: ['A2:A48'], amount: 'E2:E48' },
  { name: '確認済み対応', headers: ['取引先', '確認済みの表記', '社内担当者'], rows: customers.map(row => [row.name, row.names.join(' ／ '), row.owner]), dates: [] },
];
for (const def of definitions) {
  const sheet = workbook.worksheets.add(def.name);
  const cols = String.fromCharCode(64 + def.headers.length);
  sheet.showGridLines = false;
  sheet.getRange(`A1:${cols}${def.rows.length + 1}`).values = [def.headers, ...def.rows];
  sheet.getUsedRange().format.font = { name: 'Noto Sans JP', size: 11 };
  sheet.getUsedRange().format.rowHeight = 24;
  sheet.getUsedRange().format.columnWidth = 22;
  sheet.getUsedRange().format.horizontalAlignment = 'left';
  sheet.getRange(`A1:${cols}1`).format = { fill: '#263848', font: { name: 'Noto Sans JP', bold: true, color: '#FFFFFF', size: 11 } };
  sheet.getRange(`A1:${cols}1`).format.horizontalAlignment = 'center';
  if (def.name === '入金明細') {
    sheet.getRange('A1:C48').format.columnWidth = 24;
    sheet.getRange('D1:D48').format.columnWidth = 32;
  }
  if (def.name === '確認済み対応') sheet.getRange('B1:B9').format.columnWidth = 55;
  for (const range of def.dates) sheet.getRange(range).setNumberFormat('yyyy-mm-dd');
  if (def.name === '売上データ') sheet.getRange('A2:A49').setNumberFormat('yyyy-mm');
  if (def.amount) {
    sheet.getRange(def.amount).setNumberFormat('#,##0');
    sheet.getRange(def.amount).format.horizontalAlignment = 'right';
  }
  sheet.freezePanes.freezeRows(1);
  sheet.getRange(`G1`).values = [['AIが生成した架空の確認用データ。実際の取引ではありません。']];
  sheet.getRange('G1').format.columnWidth = 85;
}
workbook.recalculate();
console.log((await workbook.inspect({ kind: 'table', range: '売上データ!A42:E49', tableMaxRows: 8, tableMaxCols: 5, maxChars: 2200 })).ndjson);
if (previewDir) for (const def of definitions) {
  const png = await workbook.render({ sheetName: def.name, range: def.name === '確認済み対応' ? 'A1:C9' : 'A1:E9', scale: 1.5, format: 'png' });
  await fs.writeFile(`${previewDir}/${def.name}.png`, new Uint8Array(await png.arrayBuffer()));
}
await (await SpreadsheetFile.exportXlsx(workbook)).save(`${output}/monthly-report.xlsx`);
await fs.rm(`${output}/monthly-report.xlsx.inspect.ndjson`, { force: true });
console.log('Exported 48 sales, 47 payments, 8 confirmed mappings');
