"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { contactConfig } from "../tour/config";
import s from "./chat.module.css";

export default function Consultation({
  topic,
  concern,
}: {
  topic: string;
  concern: string;
}) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
    consent: false,
    honeypot: "",
  });
  const [review, setReview] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const pending = useRef<AbortController | null>(null);
  const locked = useRef(false);
  useEffect(() => () => pending.current?.abort(), []);
  const ready = /^[a-zA-Z0-9]+$/.test(contactConfig.formId);
  async function send() {
    if (!ready || locked.current || !values.consent || values.honeypot) return;
    locked.current = true;
    setStatus("sending");
    const controller = new AbortController();
    pending.current = controller;
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(
        `https://formspree.io/f/${contactConfig.formId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            message: values.message,
            _gotcha: values.honeypot,
            業務: topic,
            困っていること: concern,
          }),
          signal: controller.signal,
        },
      );
      if (!response.ok) throw new Error("send failed");
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timer);
      pending.current = null;
      locked.current = false;
    }
  }
  if (status === "success")
    return (
      <div className={s.notice} role="status">
        <h2>お問い合わせを受け付けました</h2>
        <p>内容を確認のうえ、ご入力のメールアドレスへご連絡します。</p>
      </div>
    );
  return (
    <section className={s.contact} aria-label="相談フォーム">
      {!ready && (
        <p className={s.notice}>
          現在、問い合わせ窓口を準備しています。内容の入力・確認はできますが、まだ送信されません。
        </p>
      )}
      <dl className={s.summary}>
        <div>
          <dt>相談したい仕事</dt>
          <dd>{topic}</dd>
        </div>
        {concern && (
          <div>
            <dt>困っていること</dt>
            <dd>{concern}</dd>
          </div>
        )}
      </dl>
      {!review ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setReview(true);
          }}
        >
          <label>
            お名前
            <input
              name="name"
              required
              autoComplete="name"
              maxLength={80}
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </label>
          <label>
            メールアドレス
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              maxLength={254}
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </label>
          <label>
            相談したいこと（任意）
            <textarea
              name="message"
              rows={3}
              maxLength={5000}
              placeholder="今の作業や、こうなったら嬉しいことなど。"
              value={values.message}
              onChange={(e) =>
                setValues({ ...values, message: e.target.value })
              }
            />
          </label>
          <div className={s.honeypot} aria-hidden="true">
            <input
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              value={values.honeypot}
              onChange={(e) =>
                setValues({ ...values, honeypot: e.target.value })
              }
            />
          </div>
          <label className={s.consent}>
            <input
              type="checkbox"
              required
              checked={values.consent}
              onChange={(e) =>
                setValues({ ...values, consent: e.target.checked })
              }
            />
            <span>
              <Link href="/business/privacy" target="_blank">
                個人情報の取り扱い
              </Link>
              を確認しました
            </span>
          </label>
          <button type="submit" className={s.neutralButton}>
            相談内容を確認する
          </button>
        </form>
      ) : (
        <div>
          <p className={s.reviewHeading} role="status">
            相談内容をまとめました。まだ送信されていません。
          </p>
          <dl className={s.summary}>
            <div>
              <dt>お名前</dt>
              <dd>{values.name}</dd>
            </div>
            <div>
              <dt>メール</dt>
              <dd>{values.email}</dd>
            </div>
            <div>
              <dt>相談内容</dt>
              <dd>{values.message || "体験で選んだ内容について相談したい"}</dd>
            </div>
          </dl>
          <p className={s.subtext}>
            受付開始後はFormspreeを通じて送信します。内容を確認し、支援の進め方と費用をご案内します。
          </p>
          {status === "error" && (
            <p role="alert" className={s.notice}>
              送信を確認できませんでした。入力内容は残っています。受付済みの可能性もあります。時間をおいて再度お試しください。
            </p>
          )}
          <div className={s.formActions}>
            <button
              className={s.neutralButton}
              disabled={!ready || status === "sending"}
              onClick={send}
            >
              {status === "sending"
                ? "送信中…"
                : ready
                  ? "この内容で相談を送信"
                  : "送信受付は準備中"}
            </button>
            <button
              disabled={status === "sending"}
              onClick={() => setReview(false)}
            >
              戻って修正
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
