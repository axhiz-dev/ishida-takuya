"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { contactConfig } from "../tour/config";
import s from "./chat.module.css";

import { owner } from "@/config/owner";
import support from "./support.module.css";

export default function Consultation({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
    consent: false,
    honeypot: "",
  });
  const [review, setReview] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const pending = useRef<AbortController | null>(null);
  const locked = useRef(false);
  useEffect(() => () => pending.current?.abort(), []);
  const ready = /^[a-zA-Z0-9]+$/.test(contactConfig.formId);
  async function send() {
    if (locked.current) return;
    if (!values.consent || values.honeypot) {
      setValidationError("入力内容を確認できませんでした。お名前・メールアドレスと同意を確認して、もう一度お試しください。");
      setValues((current) => ({ ...current, honeypot: "" }));
      setReview(false);
      return;
    }
    if (!ready) {
      setStatus("error");
      return;
    }
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
            参考に見た事例: reference || "なし",
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
  const emailBody = `石田様\n無料相談を希望します。\n\nお名前：${values.name}\nメール：${values.email}\n相談したいこと：${values.message || "普段の仕事について、相談しながら整理したい"}\n${reference ? `参考に見た事例：${reference}\n` : ""}`;
  const emailHref = `mailto:${owner.email}?subject=${encodeURIComponent("AI活用の無料相談")}&body=${encodeURIComponent(emailBody)}`;
  async function copyMessage() {
    try { await navigator.clipboard.writeText(emailBody); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }
  if (status === "success") return <div className={s.notice} role="status"><h2>無料相談のお申し込みを受け付けました</h2><p>内容を確認し、{owner.responseTime}を目安にメールでご連絡します。日程を調整して、初回30分の相談を行います。</p><p>この時点で有料の支援が始まることはありません。</p></div>;
  return (
    <section className={s.contact} aria-label="相談フォーム">
      <div className={support.contactIntro}>
        <h2>いつもの仕事について、<br />聞かせてください。</h2>
        <p>初回30分の無料相談です。何をAIに任せるか、まだ整理できていなくても大丈夫です。</p>
        <ol className={support.contactSteps}><li>1 メールで日程調整</li><li>2 無料相談・30分</li><li>3 支援内容・期間・費用をご提案</li></ol>
        <p className={s.subtext}>有料の支援は、ご提案に合意いただいてから始めます。{owner.responseTime}を目安にメールでご連絡します。</p>
        {!ready && <p className={s.notice}>現在はメールでお申し込みを受け付けています。下の入力内容からメールを作成できます。<br /><a className={support.textLink} href={`mailto:${owner.email}?subject=${encodeURIComponent("AI活用の無料相談")}`}>直接メールする：{owner.email}</a></p>}
      </div>
      {reference && <p className={s.subtext}>参考に見た事例：{reference}<br />事例と違う仕事でもご相談いただけます。</p>}
      {!review ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            // Read the submitted controls as well as React state: browser autofill
            // can update inputs without dispatching React's change event.
            const confirmed = {
              name: String(data.get("name") ?? "").trim(),
              email: String(data.get("email") ?? "").trim(),
              message: String(data.get("message") ?? ""),
              consent: data.get("consent") === "on",
              honeypot: String(data.get("_gotcha") ?? ""),
            };
            setValues({ ...confirmed, honeypot: "" });
            if (confirmed.honeypot || !confirmed.consent) {
              setValidationError("入力内容を確認できませんでした。お名前・メールアドレスと同意を確認して、もう一度お試しください。");
              return;
            }
            setValidationError("");
            setStatus("idle");
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
              placeholder="普段の仕事や、時間がかかっていることなど。まだまとまっていなくても大丈夫です。"
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
              aria-label="この項目は空欄のままにしてください"
              data-lpignore="true"
              data-1p-ignore
              value={values.honeypot}
              onChange={(e) =>
                setValues({ ...values, honeypot: e.target.value })
              }
            />
          </div>
          <label className={s.consent}>
            <input
              type="checkbox"
              name="consent"
              required
              checked={values.consent}
              onChange={(e) =>
                setValues({ ...values, consent: e.target.checked })
              }
            />
            <span>
              <Link href="/business/privacy" target="_blank" rel="noopener noreferrer">
                個人情報の取り扱い
              </Link>
              を確認しました
            </span>
          </label>
          {validationError && <p role="alert" className={s.notice}>{validationError}</p>}
          <button type="submit" className={s.neutralButton}>
            {ready ? "相談内容を確認する" : "メールに載せる内容を確認する"}
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
              <dd>{values.message || "普段の仕事について、相談しながら整理したい"}</dd>
            </div>
          </dl>
          <p className={s.subtext}>
            {ready ? "この内容で無料相談を申し込みます。送信後、メールで日程を調整します。" : "メールアプリを開いたあと、内容を確認して送信してください。この画面からは送信されません。"}
          </p>
          {status === "sending" && <p role="status" className={s.subtext}>送信しています。このままお待ちください。</p>}
          {status === "error" && (
            <p role="alert" className={s.notice}>
              送信を確認できませんでした。入力内容は残っています。受付済みの可能性もあります。時間をおいて再度お試しいただくか、<a href={emailHref}>メールでご連絡ください</a>。
            </p>
          )}
          {copied && <p role="status">相談内容をコピーしました。{owner.email} 宛てのメールに貼り付けて送信してください。</p>}
          {copyError && <p role="alert">コピーできませんでした。下の文章を選択してコピーし、{owner.email} へお送りください。</p>}
          {!ready && <details><summary>メールアプリが開かない場合</summary><p>宛先：{owner.email}</p><textarea aria-label="メールで送る相談内容" readOnly value={emailBody} rows={8} /></details>}
          <div className={s.formActions}>
            {ready ? <button type="button" className={`${s.neutralButton} ${s.submitButton}`} disabled={status === "sending"} aria-busy={status === "sending"} onClick={send}>{status === "sending" && <span className={s.submitSpinner} aria-hidden="true" />}{status === "sending" ? "送信中…" : "この内容で無料相談を申し込む"}</button> : <a className={support.primary} href={emailHref}>メールアプリで開く</a>}
            {!ready && <button onClick={copyMessage}>{copied ? "相談内容をコピーしました" : "相談内容をコピー"}</button>}
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
