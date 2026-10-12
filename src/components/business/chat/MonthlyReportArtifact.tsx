"use client";

import { useContext, useState } from "react";
import { FileXls } from "@phosphor-icons/react";
import { BASE_PATH } from "@/config/site";
import { ResponseReadyContext } from "./ChatTurn";
import { monthlyReport, reportMonths, reportSample } from "./monthlyReport";
import WorkbookPreview from "./WorkbookPreview";
import s from "./chat.module.css";

const yen = (value: number) => `${value.toLocaleString("ja-JP")}円`;
const man = (value: number) => `${(value / 10000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}万`;
export default function MonthlyReportArtifact() {
  const ready = useContext(ResponseReadyContext);
  const [month, setMonth] = useState(reportMonths.at(-1)!);
  const [preview, setPreview] = useState(false);
  const report = monthlyReport(month);
  const trend = reportMonths.map(item => ({ month: item, sales: monthlyReport(item).sales }));
  const maxSales = Math.max(...trend.map(item => item.sales));
  const ranked = [...report.rows].sort((a, b) => b.amount - a.amount);
  const maxCustomerSales = ranked[0]?.amount || 1;
  const unmatchedTotal = report.unmatched.reduce((sum, row) => sum + row.amount, 0);
  return <section className={`${s.artifact} ${s.monthlyReport}`} aria-label="月次レポートのサンプル">
    <span className={s.badge}>サンプル2 · AIが作成した架空の確認用データ</span>
    <div className={s.reportHeading}>
      <div><h3>売上・入金 月次レポート</h3><p>{report.asOf} 時点</p></div>
      <label>対象月<select aria-label="レポートの対象月" value={month} disabled={!ready} onChange={event => setMonth(event.target.value)}>
        {reportMonths.map(item => <option key={item} value={item}>{item.replace("-", "年")}月</option>)}
      </select></label>
    </div>
    <dl className={s.reportMetrics}>
      <div><dt>売上</dt><dd>{yen(report.sales)}</dd><small>{report.change === null ? "前月データなし" : `前月比 ${report.change >= 0 ? "+" : ""}${(report.change * 100).toFixed(1)}%`}</small></div>
      <div><dt>照合済みの入金</dt><dd>{yen(report.paid)}</dd><small>対象月の売上に対する入金</small></div>
      <div><dt>未入金残高</dt><dd>{yen(report.sales - report.paid)}</dd><small>{report.outstanding.length}件 · 期限前を含む</small></div>
    </dl>
    <div className={s.reportCharts}>
      <div className={s.reportChart}><h4>半年の売上推移 <small>万円</small></h4>
        <div className={s.trendBars} role="img" aria-label={trend.map(item => `${item.month}: ${yen(item.sales)}`).join("、")}>
          {trend.map(item => <div key={item.month}><span>{man(item.sales)}</span><div className={s.trendTrack}><i data-selected={item.month === month} style={{ height: `${item.sales / maxSales * 100}%` }} /></div><small>{Number(item.month.slice(5))}月</small></div>)}
        </div>
      </div>
      <div className={s.reportChart}><h4>取引先別の売上 <small>万円</small></h4>
        <ul className={s.customerBars}>{ranked.map(row => <li key={row.invoice}><div><span>{row.customer}</span><strong>{man(row.amount)}</strong></div><div className={s.customerTrack} aria-hidden="true"><i style={{ width: `${row.amount / maxCustomerSales * 100}%` }} /></div></li>)}</ul>
      </div>
    </div>
    <div className={s.reportSummary}><strong>今月の確認ポイント</strong>
      <p>売上{yen(report.sales)}のうち、{yen(report.paid)}を入金確認済みです。{report.overdue.length ? `期限を迎えた未入金は${report.overdue.length}件。担当者への確認が必要です。` : "期限を迎えた未入金はありません。"}{report.unmatched.length > 0 && `照合できない入金${yen(unmatchedTotal)}は、入金済み額に含めていません。`}</p>
    </div>
    <h4>確認・対応が必要なもの</h4>
    <ul className={s.reportIssues}>
      {report.outstanding.map(row => <li key={row.invoice}><div><strong>{row.customer}</strong><span>{yen(row.outstanding)}</span></div><p>{row.due <= report.asOf ? "期限到来 · 差額の理由と入金予定を確認" : "期限前 · 入金予定を確認"}</p><small>期限 {row.due} ／ {row.owner}</small></li>)}
      {report.unmatched.map(row => <li key={row.id}><div><strong>{row.name}</strong><span>{yen(row.amount)}</span></div><p>照合先が不明 · 経理担当が取引先を確認</p><small>入金日 {row.date} ／ 売上への割り当ては保留</small></li>)}
    </ul>
    {!report.outstanding.length && !report.unmatched.length && <p className={s.sampleNote}>確認が必要なものはありません。</p>}
    <div className={s.reportSource}>
      <button disabled={!ready} onClick={() => setPreview(true)} aria-haspopup="dialog"><FileXls size={23} aria-hidden="true" /><span>月次レポート確認用サンプル2.xlsx<small>半年分・{reportSample.sales.length}件の売上 · 元データを見る</small></span></button>
      <a href={`${BASE_PATH}/samples/monthly-report.xlsx`} download>Excelをダウンロード</a>
    </div>
    <p className={s.sampleNote}>全件が架空のデータです。サンプル1の実績を増やしたものではありません。金額は税込。入金は各対象月末まで、売上との照合ができたものだけを集計しています。</p>
    {preview && <WorkbookPreview variant="report" onClose={() => setPreview(false)} />}
  </section>;
}
