import { engineerCareer } from "@/content/engineer";
import { engineeringYears } from "@/lib/derive";
import { EngineerScreen } from "@/components/engineer/EngineerScreen";
import { ResumeDocument } from "@/components/engineer/ResumeDocument";

/**
 * 職務経歴のページ。
 *
 * 画面版（EngineerScreen）と紙版（ResumeDocument）はマークアップが別で、
 * engineer.css の @media print が data-print 属性を見て出し分ける。
 * 中身はどちらも src/content/engineer.ts から描く。
 */
export default function EngineerPage() {
  // 入口ページと同じ 1 つのデータから出す。手で書くと 2 画面でずれる。
  const years = engineeringYears(engineerCareer);

  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <EngineerScreen years={years} />
      <ResumeDocument />
    </>
  );
}
