"use client";

import { useState } from "react";
import styles from "./business.module.css";

export type Slice = { label: string; value: number };
export type ChartKind = "column" | "bar" | "donut" | "line";

const yen = new Intl.NumberFormat("ja-JP");

/** 系列色は 6 つで固定。足りなくなったら色を作らず「その他」に畳む。 */
const SERIES = 6;

/* 目盛りは「切りのいい数」で刻む。データの最大値をそのまま上端にすると
   0.87 みたいな軸が出て、読む側が計算させられる。 */
function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exp = Math.floor(Math.log10(value));
  const base = 10 ** exp;
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (value <= base * step) return base * step;
  }
  return base * 10;
}

/** 長い和文のラベルは軸で潰れるので、その場で詰める。 */
function clip(label: string, max: number): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

const W = 720;
const H = 340;

export function AggregateChart({
  data,
  kind,
  valueLabel,
}: {
  data: Slice[];
  kind: ChartKind;
  /** 合計している列の名前。単位の代わりに軸の見出しに出す。 */
  valueLabel: string;
}) {
  const [hover, setHover] = useState<{ x: number; y: number; slice: Slice } | null>(null);

  if (data.length === 0) return null;

  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  const max = niceMax(Math.max(...data.map((slice) => slice.value), 0));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ratio * max);

  /** ツールチップは SVG ではなく HTML で重ねる。SVG 内に置くと文字が縮む。 */
  const tip = (slice: Slice, x: number, y: number) => ({
    onPointerEnter: () => setHover({ x: (x / W) * 100, y: (y / H) * 100, slice }),
    onPointerLeave: () => setHover(null),
  });

  return (
    <figure className={styles.chart}>
      <div className={styles.chartBox}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${valueLabel}の集計結果`}>
          {kind === "column" ? <Column data={data} max={max} ticks={ticks} tip={tip} /> : null}
          {kind === "bar" ? <Bar data={data} max={max} tip={tip} /> : null}
          {kind === "line" ? <Line data={data} max={max} ticks={ticks} tip={tip} /> : null}
          {kind === "donut" ? <Donut data={data} total={total} tip={tip} /> : null}
        </svg>

        {hover ? (
          <div
            className={styles.chartTip}
            style={{ left: `${hover.x}%`, top: `${hover.y}%` }}
            role="status"
          >
            <span className={styles.chartTipLabel}>{hover.slice.label}</span>
            <span className={styles.chartTipValue}>{yen.format(hover.slice.value)}</span>
            {total > 0 ? (
              <span className={styles.chartTipShare}>
                全体の {Math.round((hover.slice.value / total) * 100)}%
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* 構成比は色で区別するので凡例が要る。棒は 1 系列なので出さない。 */}
      {kind === "donut" ? (
        <ul className={styles.chartLegend}>
          {data.map((slice, index) => (
            <li key={slice.label}>
              <span
                className={styles.chartSwatch}
                style={{ background: `var(--chart-${(index % SERIES) + 1})` }}
                aria-hidden="true"
              />
              {slice.label}
              <span className={styles.chartLegendValue}>{yen.format(slice.value)}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <figcaption className={styles.chartCaption}>
        {valueLabel}の合計 {yen.format(total)}／{data.length} 項目
      </figcaption>
    </figure>
  );
}

/* ── 大小をくらべる：1 色。順位を色で塗り分けない ────────── */

type Tip = (slice: Slice, x: number, y: number) => object;

function Column({
  data,
  max,
  ticks,
  tip,
}: {
  data: Slice[];
  max: number;
  ticks: number[];
  tip: Tip;
}) {
  const pad = { top: 20, right: 16, bottom: 46, left: 66 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const slot = plotW / data.length;
  const width = Math.min(slot - 6, 64); // 隣とのすき間を必ず空ける

  return (
    <>
      <Grid ticks={ticks} max={max} pad={pad} plotW={plotW} plotH={plotH} />
      {data.map((slice, index) => {
        const height = max > 0 ? (slice.value / max) * plotH : 0;
        const x = pad.left + slot * index + (slot - width) / 2;
        const y = pad.top + plotH - height;
        return (
          <g key={slice.label} {...tip(slice, x + width / 2, y)}>
            <rect
              x={x}
              y={y}
              width={width}
              height={Math.max(height, 2)}
              rx={4}
              fill="var(--color-accent)"
            />
            <text x={x + width / 2} y={H - 26} className={styles.chartAxis} textAnchor="middle">
              {clip(slice.label, 6)}
            </text>
          </g>
        );
      })}
    </>
  );
}

/* 項目名が長い・数が多いときはこちら。和文は横に寝かせたほうが読める。 */
function Bar({ data, max, tip }: { data: Slice[]; max: number; tip: Tip }) {
  const pad = { top: 12, right: 72, bottom: 12, left: 148 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const slot = plotH / data.length;
  const height = Math.min(slot - 6, 34);

  return (
    <>
      {data.map((slice, index) => {
        const width = max > 0 ? (slice.value / max) * plotW : 0;
        const y = pad.top + slot * index + (slot - height) / 2;
        return (
          <g key={slice.label} {...tip(slice, pad.left + width, y)}>
            <text
              x={pad.left - 12}
              y={y + height / 2 + 4}
              className={styles.chartAxis}
              textAnchor="end"
            >
              {clip(slice.label, 11)}
            </text>
            <rect
              x={pad.left}
              y={y}
              width={Math.max(width, 2)}
              height={height}
              rx={4}
              fill="var(--color-accent)"
            />
            <text
              x={pad.left + width + 10}
              y={y + height / 2 + 4}
              className={styles.chartValue}
            >
              {yen.format(slice.value)}
            </text>
          </g>
        );
      })}
    </>
  );
}

/* ── 時系列のときだけ出す ──────────────────────────── */

function Line({
  data,
  max,
  ticks,
  tip,
}: {
  data: Slice[];
  max: number;
  ticks: number[];
  tip: Tip;
}) {
  const pad = { top: 20, right: 24, bottom: 46, left: 66 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const step = data.length > 1 ? plotW / (data.length - 1) : 0;
  const at = (index: number, value: number) => ({
    x: pad.left + step * index + (data.length > 1 ? 0 : plotW / 2),
    y: pad.top + plotH - (max > 0 ? (value / max) * plotH : 0),
  });
  const points = data.map((slice, index) => at(index, slice.value));

  return (
    <>
      <Grid ticks={ticks} max={max} pad={pad} plotW={plotW} plotH={plotH} />
      <polyline
        points={points.map((point) => `${point.x},${point.y}`).join(" ")}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((slice, index) => {
        const point = points[index]!;
        return (
          <g key={slice.label} {...tip(slice, point.x, point.y)}>
            {/* 白い縁を挟んで、線と点が重なっても粒が見えるようにする */}
            <circle cx={point.x} cy={point.y} r={5} fill="var(--color-accent)"
              stroke="var(--color-paper)" strokeWidth={2} />
            <text x={point.x} y={H - 26} className={styles.chartAxis} textAnchor="middle">
              {clip(slice.label, 7)}
            </text>
          </g>
        );
      })}
    </>
  );
}

/* ── 構成比 ─────────────────────────────────────── */

function Donut({ data, total, tip }: { data: Slice[]; total: number; tip: Tip }) {
  const cx = W / 2;
  const cy = H / 2;
  const outer = 128;
  const inner = 76;

  let angle = -Math.PI / 2;

  return (
    <>
      {data.map((slice, index) => {
        const sweep = total > 0 ? (slice.value / total) * Math.PI * 2 : 0;
        const from = angle;
        const to = angle + sweep;
        angle = to;

        const point = (radius: number, a: number) =>
          `${cx + radius * Math.cos(a)},${cy + radius * Math.sin(a)}`;
        const large = sweep > Math.PI ? 1 : 0;
        const mid = (from + to) / 2;

        return (
          <g key={slice.label} {...tip(slice, cx + 96 * Math.cos(mid), cy + 96 * Math.sin(mid))}>
            <path
              d={`M ${point(outer, from)} A ${outer} ${outer} 0 ${large} 1 ${point(outer, to)}
                  L ${point(inner, to)} A ${inner} ${inner} 0 ${large} 0 ${point(inner, from)} Z`}
              fill={`var(--chart-${(index % SERIES) + 1})`}
              stroke="var(--color-paper)"
              strokeWidth={2}
            />
            {/* 5% 未満は文字が入らないので置かない（凡例と表で読める） */}
            {sweep > 0.32 ? (
              <text
                x={cx + 102 * Math.cos(mid)}
                y={cy + 102 * Math.sin(mid) + 4}
                className={styles.chartSliceLabel}
                textAnchor="middle"
              >
                {Math.round((slice.value / total) * 100)}%
              </text>
            ) : null}
          </g>
        );
      })}
      <text x={cx} y={cy - 4} className={styles.chartAxis} textAnchor="middle">
        合計
      </text>
      <text x={cx} y={cy + 20} className={styles.chartCenter} textAnchor="middle">
        {yen.format(total)}
      </text>
    </>
  );
}

/* ── 目盛り。前に出ないよう細く薄く ───────────────── */

function Grid({
  ticks,
  max,
  pad,
  plotW,
  plotH,
}: {
  ticks: number[];
  max: number;
  pad: { top: number; left: number };
  plotW: number;
  plotH: number;
}) {
  return (
    <g aria-hidden="true">
      {ticks.map((tick) => {
        const y = pad.top + plotH - (max > 0 ? (tick / max) * plotH : 0);
        return (
          <g key={tick}>
            <line
              x1={pad.left}
              x2={pad.left + plotW}
              y1={y}
              y2={y}
              stroke="var(--chart-grid)"
              strokeWidth={1}
            />
            <text x={pad.left - 10} y={y + 4} className={styles.chartAxis} textAnchor="end">
              {tick >= 10000 ? `${Math.round(tick / 10000)}万` : yen.format(Math.round(tick))}
            </text>
          </g>
        );
      })}
    </g>
  );
}
