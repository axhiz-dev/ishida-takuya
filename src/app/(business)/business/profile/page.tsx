import type { Metadata } from "next";
import { about, profile, profilePage } from "@/content";
import { owner } from "@/config/owner";
import { Fillable } from "@/components/common/Fillable";
import { Portrait } from "@/components/business/Portrait";
import { SubPage } from "@/components/business/SubPage";
import styles from "@/components/business/business.module.css";

export const metadata: Metadata = {
  title: `プロフィール — ${profile.name}`,
  description: "業務の自動化を請け負っている石田卓也の経歴と、やること・やらないこと。",
};

export default function ProfilePage() {
  return (
    <SubPage title="プロフィール" lede={profilePage.lead}>
      <section className={styles.section}>
        <div className={styles.about}>
          <Portrait
            photo={profile.photo}
            name={profile.name}
            role="業務自動化"
            location={owner.businessHours}
          />

          <div className={styles.aboutBody}>
            {about.career.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>{about.motive}</p>
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
