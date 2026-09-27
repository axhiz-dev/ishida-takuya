"use client";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  FileXls,
  DownloadSimple,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import {
  aggregateSales,
  customerMaster,
  inquiries,
  sales,
  yen,
  type TaskId,
} from "./data";
import { downloadBlob } from "@/lib/download";
import s from "./tour.module.css";
const stages = ["ファイル確認", "統合・照合", "要確認", "レポート"];
export function AggregateDemo({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0),
    [file, setFile] = useState("営業部.xlsx"),
    [progress, setProgress] = useState(0);
  const [duplicate, setDuplicate] = useState(""),
    [unknown, setUnknown] = useState("");
  const [view, setView] = useState("customer");
  useEffect(() => {
    if (phase !== 1) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setInterval(
      () => setProgress((p) => p + 1),
      reduced ? 30 : 650,
    );
    return () => clearInterval(timer);
  }, [phase]);
  useEffect(() => {
    if (phase === 1 && progress >= 3) setPhase(2);
  }, [phase, progress]);
  const result = aggregateSales(duplicate === "keep", unknown === "include");
  const display =
    view === "customer"
      ? result.totals.map((r) => ({ label: r.customer, amount: r.amount }))
      : Object.entries(
          result.rows.reduce<Record<string, number>>((a, r) => {
            a[r.source] = (a[r.source] ?? 0) + r.amount;
            return a;
          }, {}),
        ).map(([label, amount]) => ({ label, amount }));
  const files = ["営業部.xlsx", "EC売上.csv", "代理店.xlsx", "顧客マスタ.xlsx"];
  return (
    <div className={s.demo}>
      <div className={s.demoTop}>
        <h1>
          月次売上の取りまとめ <small>見本データ</small>
        </h1>
        <ol className={s.miniSteps}>
          {stages.map((v, i) => (
            <li key={v} aria-current={phase === i ? "step" : undefined}>
              {i < phase ? <CheckCircle /> : <span>{i + 1}</span>}
              {v}
            </li>
          ))}
        </ol>
      </div>
      {phase === 0 && (
        <div className={s.demoBody}>
          <p>
            まずは、毎月届くファイルを開いてみてください。列名や取引先の表記が少しずつ違います。
          </p>
          <div className={s.tabs} role="tablist" aria-label="サンプルファイル">
            {files.map((f) => (
              <button
                role="tab"
                aria-selected={file === f}
                key={f}
                onClick={() => setFile(f)}
              >
                <FileXls />
                {f}
              </button>
            ))}
          </div>
          <div className={s.tableScroll} role="tabpanel" aria-label={file}>
            <table>
              <thead>
                <tr>
                  {(file === "顧客マスタ.xlsx"
                    ? ["正式名称", "登録済みの表記"]
                    : file === "EC売上.csv"
                      ? ["注文ID", "購入者", "注文日", "売上金額"]
                      : ["伝票番号", "取引先", "日付", "金額"]
                  ).map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {file === "顧客マスタ.xlsx"
                  ? customerMaster.map((c) => (
                      <tr key={c.name}>
                        <td>{c.name}</td>
                        <td>{c.aliases.join(" / ")}</td>
                      </tr>
                    ))
                  : sales
                      .filter((r) => r.source === file)
                      .map((r, i) => (
                        <tr key={i}>
                          <td>{r.id}</td>
                          <td>{r.customer}</td>
                          <td>{r.date}</td>
                          <td>{yen(r.amount)}</td>
                        </tr>
                      ))}
              </tbody>
            </table>
          </div>
          <p className={s.note}>
            3つの明細と顧客マスタを照合します。見本は7行。本番では実際のファイル形式とルールに合わせます。
          </p>
          <div className={s.actions}>
            <button
              className={s.primary}
              onClick={() => {
                setProgress(0);
                setPhase(1);
              }}
            >
              統合・照合をはじめる <ArrowRight />
            </button>
          </div>
        </div>
      )}
      {phase === 1 && (
        <div className={s.processing} role="status" aria-live="polite">
          <FileXls size={64} />
          <h2>
            {
              [
                "列名と日付の形式を揃えています",
                "顧客マスタと照合しています",
                "重複・未登録の取引を確認しています",
              ][Math.min(progress, 2)]
            }
          </h2>
          <div className={s.progress}>
            <span
              style={{ width: `${(Math.min(progress + 1, 3) / 3) * 100}%` }}
            />
          </div>
          <p>営業部.xlsx・EC売上.csv・代理店.xlsx</p>
        </div>
      )}
      {phase === 2 && (
        <div className={s.demoBody}>
          <p className={s.notice}>
            <CheckCircle />
            統合・照合が完了しました。確認が必要なのは、次の2件です。
          </p>
          <div className={s.tableScroll}>
            <table><thead><tr><th>元ファイル</th><th>取引先</th><th>確認内容</th><th>状態</th></tr></thead><tbody>
              <tr><td>営業部.xlsx</td><td>青葉商事</td><td>同じ伝票番号が2件</td><td>{duplicate ? '確認済み' : '要確認'}</td></tr>
              <tr><td>代理店.xlsx</td><td>みなと企画</td><td>顧客マスタに未登録</td><td>{unknown ? '確認済み' : '要確認'}</td></tr>
            </tbody></table>
          </div>
          <div className={`${s.review} ${s.aggregateReview}`}>
            <div>
              <small>01 / 重複した伝票</small>
              <h2>青葉商事の A-1042 が2件あります</h2>
              <p>営業部.xlsx ／ 2026/09/15 ／ 各 {yen(48000)}</p>
              <fieldset>
                <legend>この2件をどう扱いますか？</legend>
                <label>
                  <input
                    type="radio"
                    name="duplicate"
                    value="remove"
                    checked={duplicate === "remove"}
                    onChange={(e) => setDuplicate(e.target.value)}
                  />
                  1件として集計
                </label>
                <label>
                  <input
                    type="radio"
                    name="duplicate"
                    value="keep"
                    checked={duplicate === "keep"}
                    onChange={(e) => setDuplicate(e.target.value)}
                  />
                  別取引として両方残す
                </label>
              </fieldset>
            </div>
            <div>
              <small>02 / マスタにない取引先</small>
              <h2>みなと企画が未登録です</h2>
              <p>代理店.xlsx ／ P-3002 ／ {yen(72000)}</p>
              <fieldset>
                <legend>今回の集計に含めますか？</legend>
                <label>
                  <input
                    type="radio"
                    name="unknown"
                    checked={unknown === "include"}
                    onChange={() => setUnknown("include")}
                  />
                  この名称で含める
                </label>
                <label>
                  <input
                    type="radio"
                    name="unknown"
                    checked={unknown === "exclude"}
                    onChange={() => setUnknown("exclude")}
                  />
                  保留して除外する
                </label>
              </fieldset>
            </div>
          </div>
          <p className={s.note}>
            表記ゆれは登録済みルールで統一済み。不明な取引は自動で確定しません。
          </p>
          <div className={s.actions}>
            <button className={s.secondary} onClick={() => setPhase(0)}>
              元ファイルを見る
            </button>
            <button
              className={s.primary}
              disabled={!duplicate || !unknown}
              onClick={() => setPhase(3)}
            >
              確認してレポートを作成 <ArrowRight />
            </button>
          </div>
        </div>
      )}
      {phase === 3 && (
        <div className={s.demoBody}>
          <div className={s.resultTop}>
            <h2>
              <CheckCircle /> 集計できました
            </h2>
            <div className={s.tabs}>
              <button
                aria-pressed={view === "customer"}
                onClick={() => setView("customer")}
              >
                取引先別
              </button>
              <button
                aria-pressed={view === "source"}
                onClick={() => setView("source")}
              >
                元ファイル別
              </button>
            </div>
          </div>
          <div className={s.report}>
            <div className={s.bars} aria-label="売上の比較">
              {display.map((r) => (
                <div key={r.label}>
                  <span>{r.label}</span>
                  <meter
                    min={0}
                    max={Math.max(...display.map((v) => v.amount))}
                    value={r.amount}
                  >
                    {yen(r.amount)}
                  </meter>
                  <strong>{yen(r.amount)}</strong>
                </div>
              ))}
            </div>
            <div>
              <p>売上合計</p>
              <strong className={s.total}>{yen(result.total)}</strong>
              <p>{result.rows.length}件を集計</p>
              <p className={s.note}>
                重複：{duplicate === "keep" ? "両方を集計" : "1件を除外"}
                <br />
                未登録：{unknown === "include" ? "含める" : "保留して除外"}
              </p>
            </div>
          </div>
          <div className={s.actions}>
            <button className={s.secondary} onClick={() => setPhase(2)}>
              確認内容を変更
            </button>
            <button
              className={s.secondary}
              onClick={() =>
                downloadBlob(
                  new Blob(
                    [
                      "\uFEFF取引先,売上\n" +
                        result.totals
                          .map((r) => `${r.customer},${r.amount}`)
                          .join("\n"),
                    ],
                    { type: "text/csv;charset=utf-8" },
                  ),
                  "月次売上.csv",
                )
              }
            >
              <DownloadSimple />
              CSVを保存
            </button>
            <button className={s.primary} onClick={onComplete}>
              この自動化の費用を見る <ArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export function OtherDemo({
  task,
  onComplete,
}: {
  task: Exclude<TaskId, "aggregate">;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState(0),
    [selected, setSelected] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [drafts, setDrafts] = useState(inquiries.map((i) => i.reply));
  useEffect(() => {
    if (phase !== 1) return;
    const timer = setTimeout(
      () => setPhase(2),
      matchMedia("(prefers-reduced-motion: reduce)").matches ? 20 : 1400,
    );
    return () => clearTimeout(timer);
  }, [phase]);
  const invoice = task === "invoice";
  const totals = aggregateSales(false, true).totals;
  const current = totals[selected]!;
  async function pdf() {
    setBusy(true);
    setError("");
    try {
      const { saveInvoice } = await import("../invoicePdf");
      await saveInvoice({
        sample: true,
        no: `DEMO-${selected + 1}`,
        to: current.customer,
        issuedOn: "2026-09-30",
        dueOn: "2026-10-31",
        items: [{ name: "月次取引明細 一式", qty: 1, price: current.amount }],
      });
    } catch {
      setError("PDFの作成に失敗しました。もう一度お試しください。");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={s.demo}>
      <div className={s.demoTop}>
        <h1>
          {invoice ? "請求書の一括作成" : "問い合わせの受付と振り分け"}{" "}
          <small>見本データ</small>
        </h1>
        <span>
          {phase === 0
            ? "1 入力を確認"
            : phase === 1
              ? "2 処理中"
              : "3 結果を確認"}
        </span>
      </div>
      {phase === 1 ? (
        <div className={s.processing} role="status">
          <FileXls size={64} />
          <h2>
            {invoice
              ? "顧客別に明細をまとめ、請求書を作成しています"
              : "受付内容を分類し、担当と返信の下書きを準備しています"}
          </h2>
        </div>
      ) : (
        <div className={s.demoBody}>
          {phase === 0 ? (
            <>
              <p>
                {invoice
                  ? "取引先ごとの明細から、請求書をまとめて作成します。"
                  : "フォームから届いた問い合わせです。種別に応じたルールで整理します。"}
              </p>
              <div className={s.tableScroll}>
                <table>
                  <thead>
                    <tr>
                      <th>{invoice ? "取引先" : "差出人"}</th>
                      <th>
                        {invoice ? "売上明細の合計（税別）" : "問い合わせ内容"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice
                      ? totals.map((r) => (
                          <tr key={r.customer}>
                            <td>{r.customer}</td>
                            <td>{yen(r.amount)}</td>
                          </tr>
                        ))
                      : inquiries.map((r) => (
                          <tr key={r.id}>
                            <td>{r.from}</td>
                            <td>
                              {r.subject}
                              <br />
                              <small>{r.body}</small>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
              <div className={s.actions}>
                <button className={s.primary} onClick={() => setPhase(1)}>
                  {invoice ? "請求書をまとめて作成" : "受付・振り分けを実行"}{" "}
                  <ArrowRight />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={s.tabs}>
                {(invoice
                  ? totals.map((r) => r.customer)
                  : inquiries.map((r) => r.from)
                ).map((v, i) => (
                  <button
                    key={v}
                    aria-pressed={selected === i}
                    onClick={() => setSelected(i)}
                  >
                    {v}
                  </button>
                ))}
              </div>
              {invoice ? (
                <div className={s.invoice}>
                  <small>見本・実際の請求書ではありません</small>
                  <h2>請求書</h2>
                  <h3>{current.customer} 御中</h3>
                  <p>月次取引明細 一式</p>
                  <dl>
                    <div>
                      <dt>小計</dt>
                      <dd>{yen(current.amount)}</dd>
                    </div>
                    <div>
                      <dt>消費税（10%）</dt>
                      <dd>{yen(current.amount * 0.1)}</dd>
                    </div>
                    <div>
                      <dt>ご請求金額</dt>
                      <dd>{yen(current.amount * 1.1)}</dd>
                    </div>
                  </dl>
                  <button className={s.secondary} disabled={busy} onClick={pdf}>
                    <DownloadSimple />
                    見本PDFを保存
                  </button>
                  {error && <p role="alert">{error}</p>}
                </div>
              ) : (
                <div className={s.review}>
                  <div>
                    <small>未対応 / {inquiries[selected]!.category}</small>
                    <h2>{inquiries[selected]!.subject}</h2>
                    <p>{inquiries[selected]!.body}</p>
                    <p className={s.notice}>
                      担当：{inquiries[selected]!.team}
                    </p>
                    <p className={s.note}>
                      フォームの種別によるルールベースの振り分けです。
                    </p>
                  </div>
                  <div>
                    <label htmlFor="reply">一次返信の下書き</label>
                    <textarea
                      id="reply"
                      rows={5}
                      value={drafts[selected]}
                      onChange={(e) =>
                        setDrafts((v) =>
                          v.map((d, i) =>
                            i === selected ? e.target.value : d,
                          ),
                        )
                      }
                    />
                    <p className={s.note}>
                      実際には送信しません。内容を確認してから返信する設計です。
                    </p>
                  </div>
                </div>
              )}
              <div className={s.actions}>
                <button className={s.secondary} onClick={() => setPhase(0)}>
                  <ArrowCounterClockwise />
                  入力に戻る
                </button>
                <button className={s.primary} onClick={onComplete}>
                  この自動化の費用を見る <ArrowRight />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
