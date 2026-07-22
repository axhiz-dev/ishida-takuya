import { Link } from "react-router-dom";
import { profile } from "../data/profile";

const cards = [
  {
    to: "/engineer",
    eyebrow: "For Recruiters & Agents",
    title: "採用ご担当者さまへ",
    description: "職務経歴・スキル・希望条件をまとめた経歴書ページです。",
    cta: "職務経歴を見る",
  },
  {
    to: "/business",
    eyebrow: "For Business Partners",
    title: "事業者さまへ",
    description: "これまでの実績と、お力になれることをご紹介するページです。",
    cta: "実績・できることを見る",
  },
];

export default function Landing() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-16">
      <p className="text-[11px] font-semibold tracking-[0.3em] text-accent uppercase">
        {profile.nameEn}
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        {profile.nameJa}
      </h1>
      <p className="mt-3 text-sm text-ink-soft">{profile.title}</p>
      <div className="mt-6 h-px w-10 bg-accent" />

      <div className="mt-12 grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group rounded-md border border-line bg-white p-6 transition hover:border-accent hover:shadow-sm"
          >
            <p className="text-[10px] font-semibold tracking-[0.2em] text-ink-faint uppercase">
              {card.eyebrow}
            </p>
            <h2 className="mt-2 text-lg font-bold tracking-tight group-hover:text-accent">
              {card.title}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              {card.description}
            </p>
            <p className="mt-5 text-xs font-medium text-accent">
              {card.cta} →
            </p>
          </Link>
        ))}
      </div>

      <p className="mt-12 text-xs text-ink-faint">
        © {new Date().getFullYear()} {profile.nameJa}
      </p>
    </main>
  );
}
