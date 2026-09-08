"use client";

import { useId, useState } from "react";
import type { Demo } from "@/content";
import { downloadBlob } from "@/lib/download";
import { DemoShell } from "./DemoShell";
import { AggregateChart, type ChartKind, type Slice } from "./AggregateChart";
import styles from "./business.module.css";

type Row = Record<string, string | number>;

const CODE = `// 複数ファイルを読んで 1 つにまとめ、指定の列で集計する（抜粋）
const rows = [];
for (const file of files) {
  const book = XLSX.read(await file.arrayBuffer());
  for (const name of book.SheetNames) {
    rows.push(...XLSX.utils.sheet_to_json(book.Sheets[name]));
  }
}

const totals = new Map();
for (const row of rows) {
  const key = String(row[groupBy] ?? "（空欄）").trim();
  totals.set(key, (totals.get(key) ?? 0) + Number(row[sumBy] ?? 0));
}`;

/**
 * 見本のデータ。
 *
 * ファイルを置いてもらう作りにはしていない。実際の業務のファイルを
 * よそのサイトに入れるのは、気にする人のほうが多い。
 * 送信していないと書いても、その一行を信じてもらう前提の作りは弱い。
 *
 * 月別のものを混ぜてあるのは、日付の列を選んだときに
 * 折れ線が使えるようになることを見せるため。
 */
const SAMPLES: { id: string; label: string; note: string; rows: Row[] }[] = [
  {
    id: "branch",
    label: "拠点別の売上",
    note: "3 拠点・6 件",
    rows: [
      { 拠点: "東京", 担当: "佐藤", 商品: "A-100", 数量: 12, 金額: 144000 },
      { 拠点: "東京", 担当: "鈴木", 商品: "B-200", 数量: 5, 金額: 75000 },
      { 拠点: "大阪", 担当: "田中", 商品: "A-100", 数量: 8, 金額: 96000 },
      { 拠点: "大阪", 担当: "高橋", 商品: "C-300", 数量: 20, 金額: 180000 },
      { 拠点: "福岡", 担当: "伊藤", 商品: "B-200", 数量: 3, 金額: 45000 },
      { 拠点: "福岡", 担当: "渡辺", 商品: "A-100", 数量: 15, 金額: 180000 },
    ],
  },
  {
    id: "monthly",
    label: "月別の売上",
    note: "12 か月・折れ線が使えます",
    rows: [
      { 年月: "2026-01", 区分: "保守", 金額: 620000 },
      { 年月: "2026-02", 区分: "保守", 金額: 640000 },
      { 年月: "2026-03", 区分: "受託", 金額: 980000 },
      { 年月: "2026-04", 区分: "保守", 金額: 700000 },
      { 年月: "2026-05", 区分: "保守", 金額: 710000 },
      { 年月: "2026-06", 区分: "受託", 金額: 1240000 },
      { 年月: "2026-07", 区分: "保守", 金額: 760000 },
      { 年月: "2026-08", 区分: "保守", 金額: 745000 },
      { 年月: "2026-09", 区分: "受託", 金額: 1080000 },
      { 年月: "2026-10", 区分: "保守", 金額: 790000 },
      { 年月: "2026-11", 区分: "保守", 金額: 810000 },
      { 年月: "2026-12", 区分: "受託", 金額: 1360000 },
    ],
  },
  {
    id: "hours",
    label: "担当者別の作業時間",
    note: "5 名・手作業の集計に月 4 時間",
    rows: [
      { 担当: "佐藤", 作業: "受注入力", 時間: 32 },
      { 担当: "鈴木", 作業: "請求書作成", 時間: 18 },
      { 担当: "田中", 作業: "受注入力", 時間: 27 },
      { 担当: "高橋", 作業: "在庫確認", 時間: 12 },
      { 担当: "渡辺", 作業: "請求書作成", 時間: 21 },
    ],
  },
];

/** 系列色は 6 つしかないので、構成比はここで畳む。棒は軸が読める範囲まで。 */
const CAP: Record<ChartKind, number> = { donut: 6, column: 12, bar: 12, line: 24 };

/**
 * 折れ線は時間の変化にしか使えない。拠点別の売上を線でつなぐと、
 * 拠点と拠点のあいだに中間の値があるように見えてしまう。
 * なので「まとめる列」が日付らしいときだけ選べるようにする。
 */
const DATE_LIKE = /^\d{4}[-/年.]\s*\d{1,2}([-/月.]\s*\d{1,2})?日?$|^\d{1,2}月$/;

function looksLikeDate(labels: string[]): boolean {
  if (labels.length < 2) return false;
  const hits = labels.filter((label) => DATE_LIKE.test(label.trim())).length;
  return hits / labels.length >= 0.8;
}

const yen = new Intl.NumberFormat("ja-JP");

/** その列を数として集計できるか。 */
const numericIn = (rows: Row[], keys: string[]) =>
  keys.filter((key) => rows.some((row) => row[key] !== "" && !Number.isNaN(Number(row[key]))));

export function DemoAggregate({ demo }: { demo: Demo }) {
  const id = useId();
  const [sampleId, setSampleId] = useState(SAMPLES[0]!.id);
  const [kind, setKind] = useState<ChartKind>("column");
  const [override, setOverride] = useState<{ group?: string; sum?: string }>({});

  const sample = SAMPLES.find((candidate) => candidate.id === sampleId) ?? SAMPLES[0]!;
  const rows = sample.rows;
  const columns = Object.keys(rows[0] ?? {});
  const numericColumns = numericIn(rows, columns);

  // 見本を切り替えたら列の指定は捨てる。前の列名は次の見本に無い。
  const groupBy =
    override.group && columns.includes(override.group)
      ? override.group
      : (columns.find((column) => !numericColumns.includes(column)) ?? columns[0] ?? "");
  const sumBy =
    override.sum && numericColumns.includes(override.sum)
      ? override.sum
      : (numericColumns[numericColumns.length - 1] ?? "");

  const totals = (() => {
    if (!groupBy || !sumBy) return [] as [string, number][];
    const map = new Map<string, number>();
    for (const row of rows) {
      const key = String(row[groupBy] ?? "（空欄）").trim() || "（空欄）";
      map.set(key, (map.get(key) ?? 0) + (Number(row[sumBy]) || 0));
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  })();

  /* 上位だけを残して、あふれた分は「その他」に畳む。
     色を作り足すと、色覚特性のある人には見分けられない色ができる。 */
  const fold = (source: [string, number][], cap: number): Slice[] => {
    if (source.length <= cap) return source.map(([label, value]) => ({ label, value }));
    const head = source.slice(0, cap - 1);
    const rest = source.slice(cap - 1).reduce((sum, [, value]) => sum + value, 0);
    return [...head.map(([label, value]) => ({ label, value })), { label: "その他", value: rest }];
  };

  const dated = looksLikeDate(totals.map(([label]) => label));
  const activeKind: ChartKind = kind === "line" && !dated ? "column" : kind;

  const chartData = fold(
    // 折れ線は時間順、それ以外は大きい順。並べ替えの基準が違う。
    activeKind === "line" ? [...totals].sort((a, b) => a[0].localeCompare(b[0], "ja")) : totals,
    CAP[activeKind],
  );

  const downloadCsv = () => {
    const csv = [`${groupBy},${sumBy}`, ...totals.map(([key, value]) => `${key},${value}`)].join("\n");
    // Excel が UTF-8 と判断できるよう BOM を付ける。付けないと日本語が化ける。
    downloadBlob(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }), "集計.csv");
  };

  return (
    <DemoShell demo={demo} code={CODE}>
      <div className={styles.chartSwitch} role="group" aria-label="見本のデータ">
        {SAMPLES.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            className={styles.chartSwitchItem}
            aria-pressed={candidate.id === sample.id}
            onClick={() => {
              setSampleId(candidate.id);
              setOverride({});
            }}
          >
            {candidate.label}
          </button>
        ))}
      </div>

      <p className={styles.demoStatus}>
        {sample.note}／{yen.format(rows.length)} 行を読み込んだところです。
      </p>

      <div className={styles.demoControls}>
        <p className={styles.formField}>
          <label htmlFor={`${id}-group`}>どの列でまとめますか</label>
          <select
            id={`${id}-group`}
            value={groupBy}
            onChange={(event) => setOverride((prev) => ({ ...prev, group: event.target.value }))}
          >
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </p>

        <p className={styles.formField}>
          <label htmlFor={`${id}-sum`}>どの列を合計しますか</label>
          <select
            id={`${id}-sum`}
            value={sumBy}
            onChange={(event) => setOverride((prev) => ({ ...prev, sum: event.target.value }))}
          >
            {numericColumns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </p>
      </div>

      <div className={styles.chartSwitch} role="group" aria-label="グラフの種類">
        {(
          [
            ["column", "縦棒"],
            ["bar", "横棒"],
            ["donut", "構成比"],
            ["line", "折れ線"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={styles.chartSwitchItem}
            aria-pressed={activeKind === value}
            /* 日付でない列を折れ線にすると嘘のグラフになるので押させない */
            disabled={value === "line" && !dated}
            title={value === "line" && !dated ? "日付の列でまとめたときに使えます" : undefined}
            onClick={() => setKind(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <AggregateChart data={chartData} kind={activeKind} valueLabel={sumBy} />

      <table className={styles.demoTable}>
        <thead>
          <tr>
            <th scope="col">{groupBy}</th>
            <th scope="col">{sumBy}</th>
          </tr>
        </thead>
        <tbody>
          {totals.map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td className={styles.demoNumeric}>{yen.format(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" className={styles.chip} onClick={downloadCsv}>
        CSV でダウンロード
        <span aria-hidden="true">↓</span>
      </button>
    </DemoShell>
  );
}
