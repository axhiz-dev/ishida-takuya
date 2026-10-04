"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Chats,
  ClipboardText,
  CheckCircle,
} from "@phosphor-icons/react";
import { tasks, type TaskId } from "./data";
import { SkillDemo } from "./SkillDemo";
import { pricing } from "./skillScenarios";
import { contactConfig } from "./config";
import { BASE_PATH } from "@/config/site";
import s from "./tour.module.css";
const steps = ["困りごとを見つける", "体験する", "進め方と費用", "導入・相談"];
export default function BusinessTour() {
  const [step, setStep] = useState(0),
    [task, setTask] = useState<TaskId>("aggregate"),
    [opened, setOpened] = useState(false),
    [hovered, setHovered] = useState<TaskId | null>(null),
    [completed, setCompleted] = useState<TaskId[]>([]),
    [contact, setContact] = useState<"相談" | "質問" | null>(null);
  const main = useRef<HTMLElement>(null),
    drawer = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    lastFocus = useRef<HTMLElement | null>(null);
  const selected = tasks.find((t) => t.id === task)!;
  function navigate(to: number) {
    setStep(to);
    setOpened(false);
    requestAnimationFrame(() => {
      main.current?.focus();
      main.current?.scrollTo({ top: 0 });
    });
  }
  function finish() {
    setCompleted((c) => (c.includes(task) ? c : [...c, task]));
    navigate(2);
  }
  function openContact(kind: "相談" | "質問") {
    lastFocus.current = document.activeElement as HTMLElement;
    setContact(kind);
  }
  useEffect(() => {
    if (contact) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [contact]);
  useEffect(() => {
    if (opened) drawer.current?.focus({ preventScroll: true });
  }, [opened]);
  function closeDrawer() {
    setOpened(false);
    requestAnimationFrame(() =>
      document.getElementById(`task-${task}`)?.focus(),
    );
  }
  return (
    <div className={s.shell}>
      <a className={s.skip} href="#tour-main">
        本文へ移動
      </a>
      <header className={s.header}>
        <Link href="/" className={s.brand}>
          しごとのAI活用ガイド
        </Link>
        <span className={s.owner}>
          石田 卓也 <small>AI活用・伴走支援</small>
        </span>
        <button onClick={() => openContact("相談")} className={s.textButton}>
          直接相談する <ArrowRight />
        </button>
      </header>
      <main id="tour-main" ref={main} tabIndex={-1} className={s.main}>
        {step === 0 && (
          <section className={s.map} aria-label="困りごとの入口">
            <div className={s.intro}>
              <h1>いつもの仕事を、AIに任せる手順に。</h1>
              <p>気になる業務を選んで、AIとの会話を体験してみませんか。</p>
            </div>
            <div className={s.scene}>
              <Image
                src={`${BASE_PATH}/business/office.webp`}
                alt="集計に悩む担当者、書類を確認する担当者、問い合わせに対応する担当者がいるオフィス"
                fill
                sizes="100vw"
                priority
                className={s.office}
              />
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className={s.hotspot}
                  style={{ left: `${t.x}%`, top: `${t.y}%` }}
                  onMouseEnter={() => setHovered(t.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <button
                    id={`task-${t.id}`}
                    onFocus={() => setHovered(t.id)}
                    onBlur={() => setHovered(null)}
                    onClick={() => {
                      setTask(t.id);
                      setOpened(true);
                      setHovered(null);
                    }}
                    aria-expanded={opened && task === t.id}
                    aria-controls="task-detail"
                  >
                    <Plus weight="bold" />
                    {t.label}
                  </button>
                  {hovered === t.id && !opened && (
                    <div className={s.bubble}>
                      <strong>{t.problem}</strong>
                      <p>{t.detail}</p>
                      <span>
                        この担当者の困りごとを見る <ArrowRight />
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {opened && (
              <div
                id="task-detail"
                ref={drawer}
                tabIndex={-1}
                className={s.drawer}
                role="region"
                aria-label={`${selected.label}の困りごと`}
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeDrawer();
                }}
              >
                <button
                  className={s.close}
                  aria-label="詳細を閉じる"
                  onClick={closeDrawer}
                >
                  <X />
                </button>
                <small className={s.eyebrow}>{selected.label}</small>
                <h2>{selected.situation}</h2>
                <blockquote className={s.workerQuote}>{selected.quote}</blockquote>
                <ul className={s.frustrations}>
                  {selected.frustrations.map((item) => (
                    <li key={item.title}>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </li>
                  ))}
                </ul>
                <p className={s.wish}>{selected.wish}</p>
                <p className={s.note}>
                  この困りごとをAIに相談したら？ 次の画面で、会話しながら仕事の手順をつくる流れを体験できます。
                </p>
                <button className={s.primary} onClick={() => navigate(1)}>
                  AIに相談する流れを見る <ArrowRight />
                </button>
              </div>
            )}
          </section>
        )}
        <section hidden={step !== 1} aria-label="AIとの会話を体験する">
          <div hidden={task !== "aggregate"}>
            <SkillDemo
              task="aggregate"
              active={step === 1 && task === "aggregate"}
              onComplete={finish}
                onExit={() => navigate(0)}
            />
          </div>
          <div hidden={task !== "invoice"}>
            <SkillDemo
              task="invoice"
              active={step === 1 && task === "invoice"}
              onComplete={finish}
                onExit={() => navigate(0)}
            />
          </div>
          <div hidden={task !== "inquiry"}>
            <SkillDemo
              task="inquiry"
              active={step === 1 && task === "inquiry"}
              onComplete={finish}
                onExit={() => navigate(0)}
            />
          </div>
        </section>
        {step === 2 && (
          <section className={s.slide}>
            <h1>進め方と費用</h1>
            <p>一緒に作り、社内で使い続けられる形に。</p>
            <div className={s.supportPricing}>
              <div className={s.recommended}>
                <span className={s.eyebrow}>おすすめ</span>
                <h2>AI活用・自動化の伴走支援</h2>
                <p className={s.price}>
                  <span>月</span>
                  {pricing.accompaniment}
                  <span>万円〜</span>
                  <small>（税別）</small>
                </p>
                <p>普段の仕事を、繰り返し使えるAIの手順に。</p>
                <ul>
                  <li>月1回〜の打ち合わせ・チャット相談</li>
                  <li>業務に合う指示文・スキルづくりと見本での確認</li>
                  <li>社内ルールの整備・使いながらの改善</li>
                </ul>
                <p className={s.note}>
                  3か月から。社内の担当者さまを1名お決めください。
                </p>
              </div>
              <div>
                <h2>自動化ツールの実装</h2>
                <p className={s.price}>
                  {pricing.implementation}
                  <span>万円〜</span>
                  <small>（税別・要お見積もり）</small>
                </p>
                <p>業務が決まっていて、すぐ形にしたい方へ。</p>
                <ul>
                  <li>御社のファイル形式・手順に合わせて作成</li>
                  <li>手順書とあわせて納品</li>
                  <li>納品後の修正・保守は別途ご相談</li>
                </ul>
              </div>
            </div>
            <details className={s.supportDetails}>
              <summary>なぜ伴走支援がおすすめなのか</summary>
              <p>
                業務もAIツールも変わり続けます。社内で手順を直したり広げたりできる状態を、一緒に目指します。見本で確かめ、実際に使いながら改善していきます。
              </p>
            </details>
            <div className={s.diagnosis}>
              <div>
                <h2>まずは90分の業務診断から</h2>
                <p>AIに任せられそうな業務と注意点を整理します。</p>
                <small>
                  {pricing.diagnosis === null
                    ? "単発・料金はお問い合わせください"
                    : `単発 ${pricing.diagnosis}万円（税別）`}
                </small>
              </div>
              <button className={s.primary} onClick={() => openContact("相談")}>
                診断について相談する
                <ArrowRight />
              </button>
            </div>
            <p className={s.note}>
              AIツールなど外部サービスは御社でのご契約となり、利用料は別途かかります。表示は目安で、内容により変わります。
            </p>
            <div className={s.actions}>
              <button className={s.textButton} onClick={() => navigate(1)}>
                <ArrowLeft />
                体験に戻る
              </button>
              <button className={s.primary} onClick={() => navigate(3)}>
                導入の流れ・相談へ <ArrowRight />
              </button>
            </div>
          </section>
        )}
        {step === 3 && (
          <section className={s.slide}>
            <h1>導入の流れ・ご相談</h1>
            <div className={s.process}>
              {[
                {
                  icon: Chats,
                  title: "相談する",
                  body: "今の業務と、困っていることをお聞かせください。",
                },
                {
                  icon: ClipboardText,
                  title: "進め方を決める",
                  body: "伴走支援か実装か、範囲と費用を確認してから始めます。",
                },
                {
                  icon: CheckCircle,
                  title: "一緒に形にする",
                  body: "見本を動かしながら、社内で回せる状態を目指します。",
                },
              ].map((p, i) => (
                <div key={p.title}>
                  <small>{i + 1}</small>
                  <p.icon size={52} />
                  <h2>{p.title}</h2>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
            <div className={s.consult}>
              <span className={s.eyebrow}>選んだ内容：{selected.demo}</span>
              <h2>今の状況に合わせて、お選びください。</h2>
              <div className={s.choices}>
                <div>
                  <p>まずは業務診断を受けてみたい</p>
                  <button
                    className={s.primary}
                    onClick={() => openContact("相談")}
                  >
                    診断について相談する <ArrowRight />
                  </button>
                </div>
                <div>
                  <p>費用や対応範囲など、先に確認したい</p>
                  <button
                    className={s.secondary}
                    onClick={() => openContact("質問")}
                  >
                    まずは質問する <ArrowRight />
                  </button>
                </div>
              </div>
              <p className={s.note}>選んだ業務はフォームに引き継がれます。</p>
            </div>
            <button className={s.textButton} onClick={() => navigate(2)}>
              <ArrowLeft />
              費用に戻る
            </button>
          </section>
        )}
      </main>
      {step !== 1 && <nav className={s.steps} aria-label="ご案内のステップ">
        {steps.map((label, i) => (
          <button
            key={label}
            data-multiline
            aria-current={step === i ? "step" : undefined}
            disabled={i > 1 && !completed.includes(task)}
            onClick={() => navigate(i)}
          >
            <span>{i + 1}</span>
            <strong>{label}</strong>
          </button>
        ))}
      </nav>}
      {step !== 1 && <footer className={s.footer}>
        <Link href="/business/profile">プロフィール</Link>
        <Link href="/business/privacy">プライバシーポリシー</Link>
        <Link href="/business/legal">特定商取引法に基づく表記</Link>
      </footer>}
      <dialog
        ref={dialog}
        className={s.dialog}
        onCancel={() => setContact(null)}
        onClose={() => {
          setContact(null);
          lastFocus.current?.focus();
        }}
      >
        <button
          className={s.close}
          aria-label="フォームを閉じる"
          onClick={() => setContact(null)}
        >
          <X />
        </button>
        {contact && (
          <ContactForm
            key={contact + task}
            kind={contact}
            task={selected.demo}
          />
        )}
      </dialog>
    </div>
  );
}
function ContactForm({ kind, task }: { kind: string; task: string }) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const sending = useRef(false);
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => pending.current?.abort(), []);
  const ready = /^[a-zA-Z0-9]+$/.test(contactConfig.formId);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ready || sending.current) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("_gotcha")) return;
    sending.current = true;
    setStatus("sending");
    const controller = new AbortController();
    pending.current = controller;
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(
        `https://formspree.io/f/${contactConfig.formId}`,
        {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
          signal: controller.signal,
        },
      );
      if (!response.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage(
        "送信を確認できませんでした。入力内容は残っています。受付済みの可能性もあります。時間をおいて再度お試しください。",
      );
    } finally {
      clearTimeout(timer);
      sending.current = false;
      pending.current = null;
    }
  }
  if (status === "success")
    return (
      <div className={s.success} role="status">
        <CheckCircle size={52} />
        <h2>お問い合わせを受け付けました</h2>
        <p>内容を確認のうえ、ご入力のメールアドレスへご連絡します。</p>
      </div>
    );
  return (
    <form onSubmit={submit} className={s.form}>
      <h2>
        {kind === "質問" ? "気になる点を質問する" : "診断について相談する"}
      </h2>
      <p className={s.eyebrow}>{task}</p>
      <input type="hidden" name="業務" value={task} />
      <input type="hidden" name="種別" value={kind} />
      <label>
        会社名（任意）
        <input name="company" autoComplete="organization" maxLength={120} />
      </label>
      <label>
        お名前
        <input name="name" required autoComplete="name" maxLength={80} />
      </label>
      <label>
        メールアドレス
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          maxLength={254}
        />
      </label>
      <label>
        {kind === "質問" ? "確認したいこと" : "相談したいこと"}
        <textarea
          name="message"
          required
          rows={4}
          maxLength={5000}
          placeholder={
            kind === "質問"
              ? "料金や対応できる範囲など、お気軽にどうぞ。"
              : "今の作業や、こうなったら嬉しいということを教えてください。"
          }
        />
      </label>
      <div className={s.honeypot} aria-hidden="true">
        <input name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>
      <label className={s.consent}>
        <input type="checkbox" required />
        <span>
          <Link href="/business/privacy" target="_blank">
            プライバシーポリシー
          </Link>
          を確認しました
        </span>
      </label>
      <p className={s.note}>
        送信内容はFormspreeを通じて受付担当者へ届きます。
      </p>
      {!ready && (
        <p className={s.notice}>
          現在、問い合わせ窓口を準備しています。送信受付の開始までお待ちください。
        </p>
      )}
      {status === "error" && <p role="alert">{message}</p>}
      <button className={s.primary} disabled={!ready || status === "sending"}>
        {status === "sending" ? "送信中…" : "送信する"}
        <ArrowRight />
      </button>
    </form>
  );
}
