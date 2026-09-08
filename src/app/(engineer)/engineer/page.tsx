import { profile } from "@/content";
import { engineerHero } from "@/content/engineer";
import { ROUTES, SITE_URL } from "@/config/site";
import { formatDate } from "@/lib/derive";
import { ScrollProgress } from "@/components/engineer/ScrollProgress";
import { Navbar } from "@/components/engineer/Navbar";
import { Footer } from "@/components/engineer/Footer";
import { Hero } from "@/components/engineer/sections/Hero";
import { About } from "@/components/engineer/sections/About";
import { Career } from "@/components/engineer/sections/Career";
import { Skills } from "@/components/engineer/sections/Skills";
import { Projects } from "@/components/engineer/sections/Projects";
import { Contact } from "@/components/engineer/sections/Contact";

/**
 * 職務経歴のページ。
 *
 * 公開中の https://axhiz-dev.github.io/ishida-takuya/ の構成を
 * そのまま /engineer に置いている。節の並びは
 * src/content/engineer.ts の engineerNav が持つ。
 */
export default function EngineerPage() {
  return (
    <>
      <a className="skip-link" href="#hero">
        本文へ移動
      </a>

      <ScrollProgress />
      <Navbar />

      <main>
        {/* 紙に落としたときだけ出るヘッダ。画面では出さない。
            誰の何という書類なのかが 1 枚目に必ず載るようにする。 */}
        <div
          data-print="only"
          data-testid="print-head"
          aria-hidden="true"
          className="mb-6 border-b border-black pb-2 text-xs"
        >
          <p>
            {profile.name}（{profile.nameLatin}）／ {engineerHero.role}
          </p>
          <p>
            {profile.email} ／ {SITE_URL}
            {ROUTES.engineer.path} ／ 最終更新 {formatDate(profile.updatedAt)}
          </p>
        </div>

        <Hero />
        <About />
        <Career />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
