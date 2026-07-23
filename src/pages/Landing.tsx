import { Link } from "react-router-dom";
import { profile } from "../data/profile";

const panels = [
  {
    to: "/engineer",
    eyebrow: "For Recruiters & Agents",
    title: "採用ご担当者さまへ",
    description:
      "職務経歴・プロジェクト・スキルをまとめた経歴書ページ。技術タグで案件を絞り込めます。",
    cta: "職務経歴を見る",
    dark: false,
  },
  {
    to: "/business",
    eyebrow: "For Business Partners",
    title: "事業者さまへ",
    description:
      "これまでの実績と、お力になれることを、専門用語を使わずにご紹介するページです。",
    cta: "実績・できることを見る",
    dark: true,
  },
];

export default function Landing() {
  return (
    <main className="bg-grid flex min-h-svh flex-col">
      {/* 名前 */}
      <div className="px-6 pt-20 pb-12 text-center sm:pt-28 sm:pb-16">
        <p className="intro intro-1 text-[11px] font-semibold tracking-[0.35em] text-accent uppercase">
          {profile.nameEn}
        </p>
        <h1 className="intro intro-2 mt-4 text-5xl font-bold tracking-tight sm:text-7xl">
          {profile.nameJa}
        </h1>
        <p className="intro intro-3 mt-4 text-sm tracking-wide text-ink-soft">
          {profile.title}
        </p>
        <div className="intro intro-4 mx-auto mt-7 h-px w-12 bg-accent" />
      </div>

      {/* スプリットパネル */}
      <div className="intro intro-5 flex flex-1 flex-col gap-px border-t border-line bg-line sm:flex-row">
        {panels.map((panel) => (
          <Link
            key={panel.to}
            to={panel.to}
            className={`group flex flex-1 basis-0 flex-col justify-between p-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-12 sm:hover:flex-[1.5] ${
              panel.dark
                ? "bg-accent text-white hover:bg-[#22436e]"
                : "bg-paper hover:bg-white"
            }`}
          >
            <p
              className={`text-[10px] font-semibold tracking-[0.25em] uppercase ${
                panel.dark ? "text-white/60" : "text-ink-faint"
              }`}
            >
              {panel.eyebrow}
            </p>
            <div className="py-10 sm:py-16">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {panel.title}
              </h2>
              <p
                className={`mt-4 max-w-sm text-xs leading-relaxed sm:text-sm ${
                  panel.dark ? "text-white/75" : "text-ink-soft"
                }`}
              >
                {panel.description}
              </p>
            </div>
            <p
              className={`flex items-center gap-2 text-xs font-semibold sm:text-sm ${
                panel.dark ? "text-white" : "text-accent"
              }`}
            >
              {panel.cta}
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </p>
          </Link>
        ))}
      </div>

      <p className="border-t border-line px-6 py-4 text-center text-[11px] text-ink-faint">
        © {new Date().getFullYear()} {profile.nameJa} ({profile.nameEn})
      </p>
    </main>
  );
}
