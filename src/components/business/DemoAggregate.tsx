"use client";

import { useId, useRef, useState } from "react";
import type { Demo } from "@/content";
import { DemoShell } from "./DemoShell";
import { AggregateChart, type ChartKind, type Slice } from "./AggregateChart";
import styles from "./business.module.css";

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

/** サンプル。手元にファイルがない人がここで止まらないように置く。 */
const SAMPLE: Row[] = [
  { 拠点: "東京", 担当: "佐藤", 商品: "A-100", 数量: 12, 金額: 144000 },
  { 拠点: "東京", 担当: "鈴木", 商品: "B-200", 数量: 5, 金額: 75000 },
  { 拠点: "大阪", 担当: "田中", 商品: "A-100", 数量: 8, 金額: 96000 },
  { 拠点: "大阪", 担当: "高橋", 商品: "C-300", 数量: 20, 金額: 180000 },
  { 拠点: "福岡", 担当: "伊藤", 商品: "B-200", 数量: 3, 金額: 45000 },
  { 拠点: "福岡", 担当: "渡辺", 商品: "A-100", 数量: 15, 金額: 180000 },
];

const yen = new Intl.NumberFormat("ja-JP");

export function DemoAggregate({ demo }: { demo: Demo }) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [source, setSource] = useState("");
  const [groupBy, setGroupBy] = useState("");
  const [sumBy, setSumBy] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [kind, setKind] = useState<ChartKind>("column");

  const columns = rows?.[0] ? Object.keys(rows[0]) : [];

  /** 数値として集計できる列だけを合計の候補にする。 */
  const numericColumns = columns.filter((column) =>
    rows?.some((row) => row[column] !== "" && !Number.isNaN(Number(row[column]))),
  );

  const load = async (files: FileList | File[]) => {
    const list = [...files];
    if (list.length === 0) return;

    setBusy(true);
    setError("");
    try {
      // 1MB 近いので初期表示には載せない。触られたときに初めて取りに行く。
      const XLSX = await import("xlsx");
      const collected: Row[] = [];

      for (const file of list) {
        const book = XLSX.read(await file.arrayBuffer());
        for (const name of book.SheetNames) {
          const sheet = book.Sheets[name];
          if (sheet) collected.push(...XLSX.utils.sheet_to_json<Row>(sheet));
        }
      }

      if (collected.length === 0 || !collected[0]) {
        setError("表として読める中身が見つかりませんでした。1 行目が見出しになっているか確認してください。");
        return;
      }

      apply(collected, `${list.length} ファイル`);
    } catch {
      setError("このファイルは読めませんでした。xlsx か csv でお試しください。");
    } finally {
      setBusy(false);
    }
  };

  const apply = (next: Row[], label: string) => {
    const keys = Object.keys(next[0] ?? {});
    const numeric = keys.filter((key) =>
      next.some((row) => row[key] !== "" && !Number.isNaN(Number(row[key]))),
    );
    setRows(next);
    setSource(label);
    setGroupBy(keys.find((key) => !numeric.includes(key)) ?? keys[0] ?? "");
    setSumBy(numeric[numeric.length - 1] ?? "");
    setError("");
  };

  const totals = (() => {
    if (!rows || !groupBy || !sumBy) return [];
    const map = new Map<string, number>();
    for (const row of rows) {
      const key = String(row[groupBy] ?? "（空欄）").trim() || "（空欄）";
      map.set(key, (map.get(key) ?? 0) + (Number(row[sumBy]) || 0));
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  })();

  /* 上位だけを残して、あふれた分は「その他」に畳む。
     色を作り足すと、色覚特性のある人には見分けられない色ができる。 */
  const fold = (rows: [string, number][], cap: number): Slice[] => {
    if (rows.length <= cap) return rows.map(([label, value]) => ({ label, value }));
    const head = rows.slice(0, cap - 1);
    const rest = rows.slice(cap - 1).reduce((sum, [, value]) => sum + value, 0);
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
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "集計.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DemoShell demo={demo} code={CODE}>
      <div
        className={styles.dropzone}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void load(event.dataTransfer.files);
        }}
      >
        <p className={styles.dropzoneLead}>ここにエクセルをドラッグ＆ドロップ</p>

        <input
          ref={inputRef}
          id={`${id}-file`}
          type="file"
          multiple
          accept=".xlsx,.xls,.csv"
          className={styles.visuallyHidden}
          onChange={(event) => event.target.files && void load(event.target.files)}
        />

        <div className={styles.dropzoneActions}>
          <button type="button" className={styles.chipGhost} onClick={() => inputRef.current?.click()}>
            ファイルを選ぶ
          </button>
          <button type="button" className={styles.chipGhost} onClick={() => apply(SAMPLE, "サンプル 3 拠点")}>
            試すファイルがない方はこちら
          </button>
        </div>

        <p className={styles.dropzoneNote}>
          ファイルはこのブラウザの中だけで処理されます。どこにも送信されません。
        </p>
      </div>

      {busy ? <p className={styles.demoStatus}>読み込んでいます…</p> : null}
      {error ? <p className={styles.demoError}>{error}</p> : null}

      {rows ? (
        <div className={styles.demoResult}>
          <p className={styles.demoStatus}>
            {source}から {yen.format(rows.length)} 行を読みました。
          </p>

          <div className={styles.demoControls}>
            <p className={styles.formField}>
              <label htmlFor={`${id}-group`}>どの列でまとめますか</label>
              <select id={`${id}-group`} value={groupBy} onChange={(event) => setGroupBy(event.target.value)}>
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </p>

            <p className={styles.formField}>
              <label htmlFor={`${id}-sum`}>どの列を合計しますか</label>
              <select id={`${id}-sum`} value={sumBy} onChange={(event) => setSumBy(event.target.value)}>
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
        </div>
      ) : null}
    </DemoShell>
  );
}
