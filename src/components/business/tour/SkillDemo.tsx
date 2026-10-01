"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowCounterClockwise,
  User,
  Sparkle,
  FileXls,
  FileText,
  CheckCircle,
  Clock,
  BookmarkSimple,
} from "@phosphor-icons/react";
import { skillScenarios } from "./skillScenarios";
import { yen, type TaskId } from "./data";
import s from "./skillDemo.module.css";

import {
  rawSales,
  reportRows,
  total,
  previous,
  lastWeek,
  products,
  duplicateCount,
  unknownCount,
} from "./skillSamples";
function Pie() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current,
      context = el?.getContext("2d");
    if (!el || !context) return;
    const style = getComputedStyle(el);
    context.clearRect(0, 0, 240, 240);
    let angle = -Math.PI / 2;
    products.forEach((p, i) => {
      const end = angle + (p.amount / total) * Math.PI * 2;
      context.beginPath();
      context.moveTo(120, 120);
      context.arc(120, 120, 108, angle, end);
      context.closePath();
      context.fillStyle = style
        .getPropertyValue(i ? "--tour-muted" : "--tour-accent")
        .trim();
      context.fill();
      context.lineWidth = 3;
      context.strokeStyle = style.getPropertyValue("--tour-paper").trim();
      context.stroke();
      angle = end;
    });
  }, []);
  return (
    <canvas
      ref={canvas}
      width={240}
      height={240}
      role="img"
      aria-label={`商品別売上：${products.map((p) => `${p.name}${yen(p.amount)}、${((p.amount / total) * 100).toFixed(1)}%`).join("。")}`}
    />
  );
}
export function SkillDemo({
  task,
  onComplete,
  onExit,
  active = true,
}: {
  task: TaskId;
  onComplete: () => void;
  onExit: () => void;
  active?: boolean;
}) {
  const scenario = skillScenarios[task];
  const [scene, setScene] = useState(0),
    [file, setFile] = useState(0),
    [verified, setVerified] = useState<boolean[]>([false, false, false]);
  const [saved, setSaved] = useState(false),
    [time, setTime] = useState("08:00"),
    [playing, setPlaying] = useState(false),
    [arrived, setArrived] = useState(false);
  const focus = useRef<HTMLHeadingElement>(null);
  const current = scenario.scenes[Math.min(scene, 6)]!;
  useEffect(() => {
    if (!playing || !active) return;
    const delay = matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 900;
    const timer = setTimeout(() => {
      setArrived(true);
      setPlaying(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [playing, active]);
  function go(next: number) {
    setScene(next);
    requestAnimationFrame(() => {
      focus.current?.focus({ preventScroll: true });
      focus.current?.closest("main")?.scrollTo({ top: 0, behavior: "instant" });
      if (window.innerWidth < 1100) window.scrollTo({ top: 0, behavior: "instant" });
    });
  }
  function advance() {
    if (scene === 6) setSaved(true);
    go(scene + 1);
  }
  const checkLabels =
    task === "aggregate"
      ? [
          "売上合計と返品の扱いを見本で確認した",
          "重複候補・未登録の商品を確認用に残す",
          "コメントは数字で確認できる変化に限る",
        ]
      : task === "invoice"
        ? [
            "読み取り内容を元の領収書と比べた",
            "上限超過・重複候補を確認用に残す",
            "承認・却下は担当者が行う",
          ]
        : [
            "個別の返金・納期を約束していない",
            "受け取った情報を聞き直していない",
            "送信前に担当者が確認する",
          ];
  function reset() {
    setVerified([false, false, false]);
    setSaved(false);
    setArrived(false);
    setPlaying(false);
    setTime("08:00");
    setFile(0);
    go(0);
  }
  return (
    <div className={s.demo} data-testid={`skill-demo-${task}`}>
      <div className={s.heading}>
        <div>
          <button className={s.exit} onClick={onExit}><ArrowLeft />業務を選び直す</button>
          <h1 ref={focus} tabIndex={-1}>
            AIと一緒に、{scenario.title}の手順をつくる
          </h1>
        </div>
        <span className={s.badge}>見本の体験</span>
      </div>
      {scene < 7 ? (
        <div className={s.workspace} key={scene}>
          <div className={s.conversation} aria-label="担当者とAIの会話">
            {current.messages.map((message, i) => (
              <article
                className={`${s.message} ${message.role === "user" ? s.human : s.assistant}`}
                key={i}
              >
                <div className={s.avatar} aria-hidden="true">
                  {message.role === "user" ? (
                    <User weight="fill" />
                  ) : (
                    <Sparkle weight="fill" />
                  )}
                </div>
                <div className={s.bubble}>
                  <span className={s.speaker}>
                    {message.role === "user" ? "担当者" : "AI"}
                  </span>
                  {message.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {scene === 0 && (
                    <div className={s.attachments}>
                      {scenario.files.map((name, index) => (
                        <button
                          key={name}
                          onClick={() => setFile(index)}
                          aria-pressed={file === index}
                        >
                          <FileText />
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
            {scene > 0 && (
              <details className={s.history}>
                <summary>ここまでの会話を読む</summary>
                {scenario.scenes.slice(0, scene).flatMap((c, index) =>
                  c.messages.map((m, j) => (
                    <div key={`${index}-${j}`}>
                      <strong>{m.role === "ai" ? "AI" : "担当者"}</strong>
                      {m.paragraphs.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  )),
                )}
              </details>
            )}
          </div>
          <aside className={s.artifact} aria-label="会話に関連する見本資料">
            <div className={s.artifactHead}>
              <h2>
                {current.artifact === "files"
                  ? "一緒に確認する資料"
                  : current.artifact === "questions"
                    ? "AIが確認している箇所"
                    : current.artifact === "verify"
                      ? "見本で、手順を確かめる"
                      : current.artifact === "report"
                        ? task === "aggregate" ? "日報の見本" : task === "invoice" ? "経費の確認一覧の見本" : "一次返信の下書きの見本"
                        : scene === 6
                          ? "繰り返し使える、御社の仕事の手順"
                          : "会話から、仕事の手順ができていく"}
              </h2>
              <span className={s.badge}>{scene === 6 ? "保存前" : "見本"}</span>
            </div>
            {(current.artifact === "files" ||
              current.artifact === "questions") && (
              <FilePreview
                task={task}
                file={file}
                questions={current.artifact === "questions"}
              />
            )}
            {(current.artifact === "rules" || current.artifact === "skill") && (
              <div className={s.document}>
                <h3>
                  {scenario.title}
                  {scene === 6 ? "をつくるスキル" : "の作り方"}
                </h3>
                {scenario.rules.slice(0, scene === 6 ? 4 : 3).map((rule) => (
                  <section key={rule.title}>
                    <h4>{rule.title}</h4>
                    <p>{rule.body}</p>
                  </section>
                ))}
                <p className={s.callout}>
                  {scene === 6
                    ? "会話で決めた条件を、次回も使えます。"
                    : "判断が必要なものを、勝手に確定しない。"}
                </p>
              </div>
            )}
            {(current.artifact === "report" ||
              current.artifact === "verify") && (
              <>
                <Report task={task} />
                {current.artifact === "verify" && (
                  <fieldset className={s.checks}>
                    <legend>見本を見て、確認する</legend>
                    {checkLabels.map((label, i) => (
                      <label key={label}>
                        <input
                          type="checkbox"
                          checked={verified[i]}
                          onChange={(e) =>
                            setVerified((old) =>
                              old.map((v, index) =>
                                index === i ? e.target.checked : v,
                              ),
                            )
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </fieldset>
                )}
              </>
            )}
          </aside>
        </div>
      ) : (
        <div className={s.workspace}>
          <div className={s.routine}>
            <BookmarkSimple size={38} />
            <p className={s.eyebrow}>
              {saved ? "手順を保存する体験が完了しました" : "手順の見本"}
            </p>
            <h2>明日の朝も、この手順で。</h2>
            <p>
              会話で決めた内容を、繰り返し使う仕事の手順に。資料の置き場所や権限を確認し、定期実行を設定すると、毎朝の準備を任せられます。
            </p>
            <label htmlFor={`time-${task}`}>
              平日の実行時刻（体験用）
              <select
                id={`time-${task}`}
                value={time}
                required
                onChange={(e) => {
                  setTime(e.target.value);
                  setArrived(false);
                  setPlaying(false);
                }}
              >
                {Array.from({ length: 48 }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`).map(value => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <button
              className={s.primary}
              disabled={!time || playing}
              onClick={() => {
                setArrived(false);
                setPlaying(true);
              }}
            >
              <Clock />
              {playing
                ? "翌朝へ…"
                : arrived
                  ? "もう一度、翌朝を見る"
                  : "翌朝を体験する"}
              <ArrowRight />
            </button>
            <p className={s.disclaimer}>
              この画面では保存・定期実行・外部への送信は行いません。
            </p>
          </div>
          <aside className={s.artifact} aria-live="polite">
            <div className={s.artifactHead}>
              <h2>
                {arrived ? `翌朝 ${time} のイメージ` : "次の朝、何が変わる？"}
              </h2>
              <span className={s.badge}>見本</span>
            </div>
            {arrived ? (
              <div className={s.reveal}>
                <p className={s.callout}>
                  <CheckCircle />
                  {scenario.routine}
                </p>
                <Report task={task} />
              </div>
            ) : (
              <div className={s.waiting}>
                <Clock size={56} />
                <h3>決めた手順で、下書きまで。</h3>
                <p>
                  左の「翌朝を体験する」を押すと、繰り返し使う場面を見られます。
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
      <div className={s.controls}>
        <button
          className={s.secondary}
          disabled={scene === 0}
          onClick={() => go(scene - 1)}
        >
          <ArrowLeft />
          戻る
        </button>
        <span role="status" className={s.progress}>
          {scene < 7 ? `${scene + 1} / 7` : "毎朝の活用"}
        </span>
        {scene < 7 ? (
          <button
            className={s.primary}
            disabled={scene === 5 && !verified.every(Boolean)}
            onClick={advance}
          >
            {current.next}
            <ArrowRight />
          </button>
        ) : (
          <button className={s.primary} onClick={onComplete}>
            伴走支援と費用を見る
            <ArrowRight />
          </button>
        )}
      </div>
      <div className={s.footnote}>
        <span>
          見本の会話・データです。AIの実行や実ファイルの読み取りは行いません。
        </span>
        {scene > 0 && (
          <button onClick={reset}>
            <ArrowCounterClockwise />
            最初から見る
          </button>
        )}
      </div>
    </div>
  );
}
function FilePreview({
  task,
  file,
  questions,
}: {
  task: TaskId;
  file: number;
  questions: boolean;
}) {
  const source = questions ? "通販" : ["店舗", "通販", "代理店"][file];
  const rows = rawSales.filter((r) => r.source === source);
  if (task === "aggregate")
    return (
      <div className={s.document}>
        <h3>
          <FileXls />
          {questions ? "通販.xlsx" : skillScenarios[task].files[file]}
        </h3>
        {questions || file < 3 ? (
          <>
            <div className={s.tableScroll}>
              <table>
                <caption>
                  {questions
                    ? "通販の見本：金額は送料込み・税込"
                    : `${source}の見本：${source === "代理店" ? "税抜" : "税込"}金額`}
                </caption>
                <thead>
                  <tr>
                    {["注文番号", "商品", "金額", "送料"].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      {[
                        row.id,
                        row.product,
                        row.amount.toLocaleString("ja-JP"),
                        row.shipping.toLocaleString("ja-JP"),
                      ].map((cell, j) => (
                        <td
                          key={j}
                          className={
                            questions && (j === 3 || (j === 0 && i < 2))
                              ? s.highlight
                              : undefined
                          }
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={s.callout}>
              {source === "通販"
                ? "E-102は別の商品。E-104は同じ商品・金額のため、2行とも確認用に残します。"
                : source === "店舗"
                  ? "マイナスの明細は、受け付けた返品です。"
                  : "商品一覧にない「新商品」は、確認用に残します。"}
            </p>
            <p>店舗は税込、代理店は税抜。集計前に、金額の扱いをそろえます。</p>
          </>
        ) : file === 3 ? (
          <>
            <h4>商品名の対応表</h4>
            <p>マグ / マグカップ → マグ</p>
            <p>皿 / プレート → 皿</p>
            <p className={s.callout}>一覧にない商品名は、人に確認します。</p>
          </>
        ) : (
          <>
            <p>前日：{yen(previous)}</p>
            <p>先週の同じ曜日：{yen(lastWeek)}</p>
            <p>比較は、同じ税抜・送料除外の条件で行います。</p>
          </>
        )}
      </div>
    );
  if (task === "invoice")
    return (
      <div className={s.document}>
        <h3>{skillScenarios[task].files[file]}</h3>
        <p>申請者：佐藤さん</p>
        <p>支払先：青葉ダイニング</p>
        <p>申請額：8,800円 / 会食費の上限：5,000円</p>
        <p className={s.callout}>
          上限を超えていますが、事前承認の有無は不明です。
        </p>
        <h4>もう1件の見本</h4>
        <p>金額の一部が読めません。推測せず、元の領収書を確認します。</p>
      </div>
    );
  return (
    <div className={s.document}>
      <h3>{skillScenarios[task].files[file]}</h3>
      <h4>商品が割れていました。返品できますか？</h4>
      <p>
        注文番号はE-102です。届いたマグが割れていました。交換ではなく返金を希望します。
      </p>
      <p className={s.callout}>
        「不具合」と「返金」の両方を含む問い合わせです。
      </p>
      <h4>過去の返信</h4>
      <p>
        個別対応で返金を約束した例があります。別の問い合わせに、そのまま使ってよいとは限りません。
      </p>
    </div>
  );
}
function Report({ task }: { task: TaskId }) {
  if (task !== "aggregate")
    return (
      <div className={s.document}>
        <span className={s.badge}>AIの下書き・見本</span>
        <h3>{task === "invoice" ? "経費の確認一覧" : "一次返信の下書き"}</h3>
        {task === "invoice" ? (
          <>
            <p>佐藤さん / 8,800円 / 会食費（候補）</p>
            <p className={s.callout}>
              要確認：規程の上限超過。事前承認の有無を確認。
            </p>
            <p>鈴木さん / 金額未確定</p>
            <p className={s.callout}>要確認：領収書の金額が不鮮明。</p>
          </>
        ) : (
          <>
            <p>
              ご連絡ありがとうございます。注文E-102の商品に破損があったとのこと、申し訳ございません。返金のご希望を含め、担当者が確認いたします。
            </p>
            <p className={s.callout}>
              担当候補：受付担当。破損と返金の両方について確認が必要なため。
            </p>
          </>
        )}
        <p>
          内容を確認してから、担当者が{task === "invoice" ? "承認" : "送信"}
          します。
        </p>
      </div>
    );
  return (
    <div className={s.document}>
      <span className={s.badge}>AIの下書き・見本</span>
      <h3>今日の売上日報</h3>
      <div className={s.report}>
        <div>
          <p>確認済み売上・税抜</p>
          <strong>{yen(total)}</strong>
          <p>
            前日比 +{((total / previous - 1) * 100).toFixed(1)}%<br />
            先週の同じ曜日比 +{((total / lastWeek - 1) * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <Pie />
          <ul>
            {products.map((p) => (
              <li key={p.name}>
                {p.name} {yen(p.amount)}（
                {((p.amount / total) * 100).toFixed(1)}%）
              </li>
            ))}
          </ul>
        </div>
      </div>
      <details>
        <summary>集計の内訳を確認する</summary>
        <table>
          <thead>
            <tr>
              <th>販売先</th>
              <th>商品</th>
              <th>税抜売上</th>
            </tr>
          </thead>
          <tbody>
            {reportRows.map((r, i) => (
              <tr key={i}>
                <td>{r.source}</td>
                <td>{r.product}</td>
                <td>{yen(r.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <p className={s.callout}>
        先週の同じ曜日より売上が25%増えています。増加の理由は、この数字だけでは判断できません。
      </p>
      <p className={s.disclaimer}>
        未確認：重複候補{duplicateCount}組・商品名不明{unknownCount}
        件。合計には含めず、確認用に残しています。
      </p>
    </div>
  );
}
