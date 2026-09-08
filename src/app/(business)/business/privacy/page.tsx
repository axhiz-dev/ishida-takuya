import type { Metadata } from "next";
import { policyUpdatedAt, privacyIntro, privacySections, profile } from "@/content";
import { Fillable } from "@/components/common/Fillable";
import { SubPage } from "@/components/business/SubPage";
import styles from "@/components/business/business.module.css";

export const metadata: Metadata = {
  title: `プライバシーポリシー — ${profile.name}`,
  description: "お預かりする情報の取り扱いと、このサイトが何をしていないかについて。",
};

export default function PrivacyPage() {
  return (
    <SubPage title="プライバシーポリシー" lede={privacyIntro}>
      {privacySections.map((section) => (
        <section key={section.heading} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.heading}</h2>
          <div className={styles.aboutBody}>
            {section.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>
      ))}

      <p className={styles.policyDate}>
        最終改定日　<Fillable value={policyUpdatedAt} />
      </p>
    </SubPage>
  );
}
