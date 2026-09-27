"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  FileXls,
  ChartBar,
  Chats,
  ClipboardText,
  CheckCircle,
} from "@phosphor-icons/react";
import { tasks, type TaskId } from "./data";
import { AggregateDemo, OtherDemo } from "./Demos";
import { contactConfig } from "./config";
import { BASE_PATH } from "@/config/site";
import s from "./tour.module.css";
const steps = ["困りごとを見つける", "体験する", "費用を確認", "導入・相談"];
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
          しごとの自動化マップ
        </Link>
        <span className={s.owner}>
          石田 卓也 <small>業務自動化</small>
        </span>
        <button onClick={() => openContact("相談")} className={s.textButton}>
          直接相談する <ArrowRight />
        </button>
      </header>
      <main id="tour-main" ref={main} tabIndex={-1} className={s.main}>
        {step === 0 && (
          <section className={s.map} aria-label="困りごとの入口">
            <div className={s.intro}>
              <h1>気になる業務から、できることと費用をご案内します。</h1>
              <p>
                人物にカーソルを合わせるか、タップして困りごとを見てみましょう。
              </p>
            </div>
            <div className={s.scene}>
              <Image
                src={`${BASE_PATH}/business/office.webp`}
                alt="集計に悩む担当者、請求書を確認する担当者、問い合わせに対応する担当者がいるオフィス"
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
                        クリックして解決策を見る <ArrowRight />
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
                aria-label={`${selected.label}の解決策`}
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
                <p className={s.problem}>{selected.problem}</p>
                <h2>{selected.title}</h2>
                <p>{selected.solution}</p>
                <div className={s.solutionIcons} aria-hidden="true">
                  <FileXls size={64} />
                  <ArrowRight size={32} />
                  {task === "inquiry" ? (
                    <Chats size={64} />
                  ) : task === "invoice" ? (
                    <ClipboardText size={64} />
                  ) : (
                    <ChartBar size={64} />
                  )}
                </div>
                <p className={s.note}>
                  今のファイルや業務のルールに合わせて作ります。
                </p>
                <button className={s.primary} onClick={() => navigate(1)}>
                  体験する <ArrowRight />
                </button>
              </div>
            )}
          </section>
        )}
        <section hidden={step !== 1} aria-label="自動化を体験する">
          <div hidden={task !== "aggregate"}>
            <AggregateDemo onComplete={finish} />
          </div>
          <div hidden={task !== "invoice"}>
            <OtherDemo task="invoice" onComplete={finish} />
          </div>
          <div hidden={task !== "inquiry"}>
            <OtherDemo task="inquiry" onComplete={finish} />
          </div>
        </section>
        {step === 2 && (
          <section className={s.slide}>
            <h1>
              {selected.demo} <span>｜費用の目安</span>
            </h1>
            <div className={s.pricing}>
              <div>
                <h2>買い切り</h2>
                <p className={s.price}>
                  10<span>万円〜</span>
                  <small>（税別）</small>
                </p>
                <p>必要な機能を、あなたの業務に合わせて。</p>
                <div className={s.simple}>
                  <p>もっとシンプルな機能なら</p>
                  <strong>
                    3万円〜<small>（税別）</small>
                  </strong>{" "}
                  のご案内もあります。
                </div>
              </div>
              <div className={s.terms}>
                <section>
                  <h2>保守サポートは任意</h2>
                  <p>ご希望の場合は、別途費用がかかります。</p>
                </section>
                <section>
                  <h2>ご要望に合わせて調整</h2>
                  <p>
                    独自の要件やカスタマイズの内容により、金額が増減する場合があります。
                  </p>
                </section>
              </div>
            </div>
            <p className={s.note}>
              外部サービスを利用する場合、その利用料は別途かかります。
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
                  body: "普段の作業をお聞かせください。",
                },
                {
                  icon: ClipboardText,
                  title: "範囲と費用を決める",
                  body: "内容とお見積もりを確認してから着手。",
                },
                {
                  icon: CheckCircle,
                  title: "作って、確認する",
                  body: "実際に触って確認し、手順書とともにお渡し。",
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
                  <p>自社でも使えるか、具体的に相談したい</p>
                  <button
                    className={s.primary}
                    onClick={() => openContact("相談")}
                  >
                    この内容で相談する <ArrowRight />
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
      <nav className={s.steps} aria-label="ご案内のステップ">
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
      </nav>
      <footer className={s.footer}>
        <Link href="/business/profile">プロフィール</Link>
        <Link href="/business/privacy">プライバシーポリシー</Link>
        <Link href="/business/legal">特定商取引法に基づく表記</Link>
      </footer>
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
  const ready = /^[a-zA-Z0-9]+$/.test(contactConfig.formId);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ready || status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("_gotcha")) return;
    setStatus("sending");
    const controller = new AbortController();
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
        "送信を確認できませんでした。入力内容は残っています。時間をおいて再度お試しください。",
      );
    } finally {
      clearTimeout(timer);
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
      <h2>{kind === "質問" ? "気になる点を質問する" : "この内容で相談する"}</h2>
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
