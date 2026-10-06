"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { owner } from "@/config/owner";
import { contactConfig } from "../tour/config";
import s from "./renewal.module.css";

export default function ConsultationForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const sending = useRef(false);
  const pending = useRef<AbortController | null>(null);
  useEffect(() => () => pending.current?.abort(), []);
  const ready = /^[a-zA-Z0-9]+$/.test(contactConfig.formId);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!ready || sending.current || !form.reportValidity()) return;
    const data = new FormData(form);
    if (data.get("_gotcha")) return;
    sending.current = true;
    setStatus("sending");
    const controller = new AbortController();
    pending.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`https://formspree.io/f/${contactConfig.formId}`, {
        method: "POST", body: data, headers: { Accept: "application/json" }, signal: controller.signal,
      });
      if (!response.ok) throw new Error("delivery failed");
      setStatus("success");
    } catch {
      if (pending.current === controller) setStatus("error");
    } finally {
      clearTimeout(timeout);
      sending.current = false;
      pending.current = null;
    }
  }
  if (status === "success") return <div className={s.formPanel} role="status">
    <CheckCircle size={40} aria-hidden="true" />
    <h3>お問い合わせを受け付けました</h3>
    <p>まずはご入力のメールアドレスへご連絡します。Slackをご希望の場合は、その際にご案内します。</p>
  </div>;
  return <form className={s.formPanel} onSubmit={submit} aria-labelledby="consultation-title">
    <h3 id="consultation-title">無料相談 20分</h3>
    <p>相談したい仕事を伺い、支援内容と進め方をご案内します。</p>
    <label htmlFor="contact-name">お名前</label>
    <input id="contact-name" name="name" autoComplete="name" required maxLength={80} placeholder="山田 太郎" />
    <label htmlFor="contact-email">メールアドレス</label>
    <input id="contact-email" type="email" name="email" autoComplete="email" required maxLength={254} placeholder="taro@example.com" />
    <label htmlFor="contact-message">相談したい仕事</label>
    <textarea id="contact-message" name="message" required rows={3} maxLength={5000} placeholder="例：提案書の作成、会議メモの整理など" />
    <fieldset className={s.radioGroup}><legend>連絡方法</legend>
      <label><input type="radio" name="contact_method" value="Slack" defaultChecked />Slack</label>
      <label><input type="radio" name="contact_method" value="メール" />メール</label>
    </fieldset>
    <input type="hidden" name="_subject" value="AI活用・伴走支援の無料相談" />
    <div className={s.honeypot} aria-hidden="true"><input name="_gotcha" tabIndex={-1} autoComplete="off" /></div>
    <label className={s.consent}><input name="privacy_consent" type="checkbox" value="確認済み" required /><span><Link href="/business/privacy" target="_blank" rel="noopener noreferrer">プライバシーポリシー</Link>を確認しました</span></label>
    {status === "error" && <p className={s.notice} role="alert">送信を確認できませんでした。入力内容は残っています。受付済みの可能性もあります。時間をおいて再度お試しください。</p>}
    {!ready && <p className={s.notice}>フォームの受付は準備中です。お急ぎの場合は<a href={`mailto:${owner.email}`}>メールでご相談ください</a>。</p>}
    <button className={s.primary} type="submit" disabled={!ready || status === "sending"}>{status === "sending" ? "送信中…" : "無料相談を申し込む"}<ArrowRight size={20} aria-hidden="true" /></button>
    <p className={s.finePrint}>初回のご案内はメールでお送りします。フォーム送信にはFormspreeを利用します。</p>
  </form>;
}
