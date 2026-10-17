import type { Metadata } from "next";
import Link from "next/link";
import { SubPage } from "@/components/business/SubPage";
import SelfIntroduction from "@/components/business/chat/SelfIntroduction";
import s from "@/components/business/chat/support.module.css";
export const metadata: Metadata = { title: "自己紹介 — 石田 卓也", description: "大切にしたいことに、もっと時間を使ってほしい。AI活用支援を始めた理由と、石田卓也の自己紹介。" };
export default function ProfilePage() {
  return <SubPage title="自己紹介"><SelfIntroduction /><div className={s.panelCta}><Link href="/business#contact" className={s.primary} data-multiline>自分の仕事について相談する</Link></div></SubPage>;
}
