"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { FileXls, User } from "@phosphor-icons/react";
import { BASE_PATH } from "@/config/site";
import s from "./chat.module.css";
import WorkbookPreview from "./WorkbookPreview";

export function Guide({ children, title = false }: { children: ReactNode; title?: boolean }) {
  return <div className={s.guide}>
    <Image src={`${BASE_PATH}/images/business/chat-guide.png`} alt="" width={52} height={52} className={s.mascot} />
    <div className={s.guideText}>{title ? <h1>{children}</h1> : children}</div>
  </div>;
}

export function UserMessage({ children, attachments = false }: { children: ReactNode; attachments?: boolean }) {
  const [preview, setPreview] = useState(false);
  return <div className={s.userMessage} aria-label="ユーザーの発言">
    <div className={s.userBubble}>
      <p>{children}</p>
      {attachments && <div className={s.attachments}>
        <span>添付したExcel · 架空のサンプルデータ</span>
        <button type="button" onClick={() => setPreview(true)} aria-haspopup="dialog">
          <FileXls size={28} weight="duotone" aria-hidden="true" />
          <span><strong>月末集計サンプル.xlsx</strong><small>売上データ・入金明細 · クリックしてプレビュー</small></span>
        </button>
      </div>}
    </div>
    <User size={23} weight="fill" aria-hidden="true" />
    {preview && <WorkbookPreview onClose={() => setPreview(false)} />}
  </div>;
}

// Each turn owns its timers so navigating away cancels pending animation.
export default function ChatTurn({ user, attachments = false, children }: { user: string; attachments?: boolean; children: ReactNode }) {
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<"user" | "bot" | "ready">("user");
  const root = useRef<HTMLDivElement>(null);
  const response = useRef<HTMLDivElement>(null);
  const skipped = useRef(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => { setLength(user.length); setPhase("ready"); };
    if (media.matches) { finish(); return; }
    let count = 0;
    let reply: ReturnType<typeof setTimeout>;
    const timer = setInterval(() => {
      if (skipped.current) { clearInterval(timer); return; }
      count = Math.min(count + 1, user.length);
      setLength(count);
      if (count === user.length) {
        clearInterval(timer);
        setPhase("bot");
        reply = setTimeout(() => { if (!skipped.current) setPhase("ready"); }, 900);
      }
    }, 45);
    const changed = () => { if (media.matches) { clearInterval(timer); clearTimeout(reply); finish(); } };
    media.addEventListener("change", changed);
    root.current?.scrollIntoView({ block: "start" });
    return () => { clearInterval(timer); clearTimeout(reply); media.removeEventListener("change", changed); };
  }, [user]);
  useEffect(() => {
    if (phase === "ready") response.current?.scrollIntoView({ block: "nearest" });
  }, [phase]);
  return <div ref={root} className={s.turn} data-chat-turn>
    <UserMessage attachments={attachments && phase !== "user"}>
      <span aria-hidden="true">{user.slice(0, length)}{phase === "user" && <span className={s.cursor}>▍</span>}</span>
      <span className={s.srOnly}>{user}</span>
    </UserMessage>
    {phase !== "ready" ? <div role="status" className={s.turnStatus}>
      {phase === "user" ? "ユーザーが入力中…" : <Guide><span className={s.typing}>入力中<span>…</span></span></Guide>}
      <button onClick={() => { skipped.current = true; setLength(user.length); setPhase("ready"); }}>すぐに表示</button>
    </div> : <div ref={response} className={s.botResponse}>{children}</div>}
  </div>;
}
