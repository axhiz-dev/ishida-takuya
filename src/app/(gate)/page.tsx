import Link from "next/link";
import { profile } from "@/content";
import { engineerCareer, engineerHero, engineerSkills } from "@/content/engineer";
import { ROUTES } from "@/config/site";
import { engineeringYears, topSkillNames } from "@/lib/derive";

/**
 * 入口。1 画面で完結させる。
 *
 * ここに来た人がやることは「どちらのページを見るか」を選ぶことだけなので、
 * 情報は名前・肩書・行き先 2 つに絞る。パネルは hover で広がる。
 */
export default function GatePage() {
  // /engineer と同じ 1 つのデータから出す。手で書くと 2 画面でずれる。
  const years = engineeringYears(engineerCareer);
  const core = topSkillNames(engineerSkills).slice(0, 3);

  const panels = [
    {
      href: ROUTES.engineer.path,
      label: "採用・技術の方へ",
      title: "職務経歴",
      body: "担当してきたプロジェクト・技術スタック・スキル。技術タグで案件を絞り込めます。PDF でも出せます。",
      meta: `${years} 年 / ${core.join(" · ")}`,
      cta: "職務経歴を見る",
      dark: false,
    },
    {
      href: ROUTES.business.path,
      label: "お仕事のご相談の方へ",
      title: "業務の自動化",
      body: "エクセルへの打ち直しや、毎月おなじ書類を作る作業をなくします。",
      meta: "買い切り 10 万円から / 相談は無料",
      cta: "ご案内を見る",
      dark: true,
    },
  ];

  return (
    <main className="bg-grid flex min-h-svh flex-col">
      <div className="px-6 pt-20 pb-12 text-center sm:pt-28 sm:pb-16">
        <p className="intro intro-1 text-[11px] font-semibold tracking-[0.35em] text-accent uppercase">
          {profile.nameLatin}
        </p>
        <h1 className="intro intro-2 mt-4 text-5xl font-bold tracking-tight sm:text-7xl">
          {profile.name}
        </h1>
        <p className="intro intro-3 mt-4 text-sm tracking-wide text-ink-soft">{engineerHero.role}</p>
        <div className="intro intro-4 mx-auto mt-7 h-px w-12 bg-accent" />
      </div>

      <div className="intro intro-5 flex flex-1 flex-col gap-px border-t border-line bg-line sm:flex-row">
        {panels.map((panel) => (
          <Link
            key={panel.href}
            href={panel.href}
            className={`group flex flex-1 basis-0 flex-col justify-between p-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-12 sm:hover:flex-[1.5] ${
              panel.dark ? "bg-accent text-white hover:bg-[#22436e]" : "bg-paper hover:bg-white"
            }`}
          >
            <p
              className={`text-[11px] font-semibold tracking-[0.2em] ${
                panel.dark ? "text-white/75" : "text-ink-faint"
              }`}
            >
              {panel.label}
            </p>
            <div className="py-10 sm:py-16">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{panel.title}</h2>
              <p
                className={`mt-4 max-w-sm text-xs leading-relaxed sm:text-sm ${
                  panel.dark ? "text-white/80" : "text-ink-soft"
                }`}
              >
                {panel.body}
              </p>
              <p
                className={`mt-4 font-mono text-[11px] ${panel.dark ? "text-white/75" : "text-ink-faint"}`}
              >
                {panel.meta}
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
        © {new Date().getFullYear()} {profile.name} ({profile.nameLatin})
      </p>
    </main>
  );
}
