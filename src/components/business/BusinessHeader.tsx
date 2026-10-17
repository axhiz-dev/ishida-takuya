"use client";
import Link from "next/link";
import { ChatCircle } from "@phosphor-icons/react";
import type { BusinessPanel } from "./chat/supportContent";
import s from "./chat/chat.module.css";

export default function BusinessHeader({ onHome, onOpen }: { onHome?: () => void; onOpen?: (panel: BusinessPanel) => void }) {
  return <header className={s.header}>
    {onHome ? <button onClick={onHome} className={s.brand} aria-label="最初の画面に戻る">石田 卓也</button> : <Link href="/business" className={s.brand}>石田 卓也</Link>}
    <span className={s.service}>AI導入・活用の伴走支援</span>
    <nav aria-label="ご案内">
      {onOpen ? <><button onClick={() => onOpen("pricing")}>支援内容・費用</button><button onClick={() => onOpen("about")}>自己紹介</button><button onClick={() => onOpen("contact")}><ChatCircle size={21} aria-hidden="true" />相談する</button></> : <><Link href="/business#pricing">支援内容・費用</Link><Link href="/business#about">自己紹介</Link><Link href="/business#contact">相談する</Link></>}
    </nav>
  </header>;
}
