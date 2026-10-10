"use client";

import { createContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
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

// Choices subscribe to completion, including when rendered through a portal.
export const ResponseReadyContext = createContext(true);

function StreamResponse({ children, immediate, onComplete }: { children: ReactNode; immediate: boolean; onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  // Work on text nodes so tables, inline emphasis and icons retain their markup.
  // Restore every node on cleanup before React updates or removes the response.
  useLayoutEffect(() => {
    if (!root.current || immediate) { onComplete(); return; }
    const walker = document.createTreeWalker(root.current, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => node.textContent?.trim() && !node.parentElement?.closest('svg, [aria-hidden="true"]')
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
    });
    const nodes: { node: Text; text: string }[] = [];
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      nodes.push({ node, text: node.data });
      node.data = "";
    }
    const blocks = Array.from(root.current.querySelectorAll<HTMLElement>("p, section, table, dl, li, h1, h2, h3"));
    blocks.forEach((block) => { block.hidden = true; });
    let index = 0;
    let length = 0;
    let cursor: HTMLElement | null = null;
    const timer = setInterval(() => {
      const current = nodes[index];
      if (!current) {
        clearInterval(timer);
        blocks.forEach((block) => { block.hidden = false; });
        cursor?.removeAttribute("data-stream-cursor");
        onComplete();
        return;
      }
      for (let parent = current.node.parentElement; parent && parent !== root.current; parent = parent.parentElement) parent.hidden = false;
      if (cursor !== current.node.parentElement) {
        cursor?.removeAttribute("data-stream-cursor");
        cursor = current.node.parentElement;
        cursor?.setAttribute("data-stream-cursor", "");
      }
      length = Math.min(length + 1, current.text.length);
      current.node.data = current.text.slice(0, length);
      if (length === current.text.length) { index++; length = 0; }
    }, 45);
    return () => {
      clearInterval(timer);
      cursor?.removeAttribute("data-stream-cursor");
      nodes.forEach(({ node, text }) => { node.data = text; });
      blocks.forEach((block) => { block.hidden = false; });
    };
  }, [immediate, onComplete]);
  return <div ref={root} className={s.botResponse}>{children}</div>;
}

// Each turn owns its timers so navigating away cancels pending animation.
export default function ChatTurn({ user, attachments = false, children }: { user: string; attachments?: boolean; children: ReactNode }) {
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<"user" | "thinking" | "streaming" | "ready">("user");
  const [immediate, setImmediate] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const skipped = useRef(false);
  const sendUser = useRef<() => void>(() => {});
  const complete = useRef(() => setPhase("ready")).current;
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => { setImmediate(true); setLength(user.length); setPhase("ready"); };
    if (media.matches) { finish(); return; }
    let count = 0;
    let reply: ReturnType<typeof setTimeout>;
    const timer = setInterval(() => {
      if (skipped.current) { clearInterval(timer); return; }
      count = Math.min(count + 1, user.length);
      setLength(count);
      if (count === user.length) {
        clearInterval(timer);
        setPhase("thinking");
        reply = setTimeout(() => { if (!skipped.current) setPhase("streaming"); }, 2000);
      }
    }, 45);
    sendUser.current = () => {
      clearInterval(timer);
      setLength(user.length);
      setPhase("thinking");
      reply = setTimeout(() => { if (!skipped.current) setPhase("streaming"); }, 2000);
    };
    const changed = () => { if (media.matches) { clearInterval(timer); clearTimeout(reply); finish(); } };
    media.addEventListener("change", changed);
    root.current?.scrollIntoView({ block: "start" });
    return () => { clearInterval(timer); clearTimeout(reply); media.removeEventListener("change", changed); };
  }, [user]);
  useEffect(() => {
    if (phase === "ready") root.current?.lastElementChild?.scrollIntoView({ block: "nearest" });
  }, [phase]);
  return <div ref={root} className={s.turn} data-chat-turn data-phase={phase}>
    <UserMessage attachments={attachments && phase !== "user"}>
      <span aria-hidden="true">{user.slice(0, length)}{phase === "user" && <span className={s.cursor}>▍</span>}</span>
      <span className={s.srOnly}>{user}</span>
    </UserMessage>
    {phase === "user" || phase === "thinking" ? <div role="status" className={s.turnStatus}>
      {phase === "user" ? "ユーザーが入力中…" : <Guide><span className={s.typing}>考え中<span>...</span></span></Guide>}
    </div> : <ResponseReadyContext.Provider value={phase === "ready"}>
      <StreamResponse immediate={immediate} onComplete={complete}>{children}</StreamResponse>
    </ResponseReadyContext.Provider>}
    {phase !== "ready" && <div className={s.turnStatus}>
      {phase === "streaming" && <span role="status" className={s.srOnly}>AIが回答中…</span>}
      {phase === "user"
        ? <button onClick={() => sendUser.current()}>入力を完了して送信</button>
        : <button onClick={() => { skipped.current = true; setImmediate(true); setLength(user.length); setPhase("ready"); }}>回答をすべて表示</button>}
    </div>}
  </div>;
}
