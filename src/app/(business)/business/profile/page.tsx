import type { Metadata } from "next";
import { profile, profilePage } from "@/content";
import { owner } from "@/config/owner";
import { Fillable } from "@/components/common/Fillable";
import { Portrait } from "@/components/business/Portrait";
import { SubPage } from "@/components/business/SubPage";
import styles from "@/components/business/business.module.css";

export const metadata: Metadata = {
  title: `プロフィール — ${profile.name}`,
  description: "AI活用・自動化の伴走支援を行う石田卓也のプロフィールと、支援の進め方。",
};

export default function ProfilePage() {
  return (
    <SubPage title="プロフィール" lede={profilePage.lead}>
      <section className={styles.section}>
        <div className={styles.about}>
          <Portrait
            photo={profile.photo}
            name={profile.name}
            role="AI活用・伴走支援"
            location={owner.businessHours}
          />

          <div className={styles.aboutBody}>
            <p>業務の資料と判断ルールを整理し、見本で確かめながら、社内で使えるAIの手順を一緒につくります。</p>
          </div>
        </div>
      </section>

      {profilePage.sections.map((section) => (
        <section key={section.heading} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.heading}</h2>
          {"asList" in section && section.asList ? (
            <ul className={styles.promises}>
              {section.body.map((line) => (
                <li key={line} className={styles.promise}>
                  {line}
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.aboutBody}>
              {section.body.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          )}
        </section>
      ))}

      <section className={styles.section}>
        <p className={styles.sectionClosing}>{profilePage.closing}</p>
      </section>

      <section className={styles.section} aria-labelledby="basics">
        <h2 id="basics" className={styles.sectionTitle}>
          基本情報
        </h2>

        <dl className={styles.aboutFacts}>
          {[
            { label: "氏名", value: owner.name },
            { label: "所在地", value: owner.address },
            { label: "対応時間", value: owner.businessHours },
            { label: "対応地域", value: owner.area },
            { label: "電話番号", value: owner.phone },
          ].map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>
                <Fillable value={fact.value} />
              </dd>
            </div>
          ))}
          <div>
            <dt>メール</dt>
            <dd>
              <a className={styles.textLink} href={`mailto:${owner.email}`}>
                {owner.email}
              </a>
            </dd>
          </div>
        </dl>
      </section>
    </SubPage>
  );
}
