import Image from "next/image";
import styles from "./business.module.css";

type Props = {
  photo?: string;
  name: string;
  role: string;
  location: string;
};

/**
 * 顔写真。
 *
 * 用意がないあいだは、それらしいストック画像を置かずに
 * モノグラムの枠を出す。中身のない写真を置くほうが信用を損なう。
 * profile.photo にパスを入れれば、そのまま差し替わる。
 */
export function Portrait({ photo, name, role, location }: Props) {
  return (
    <figure className={styles.portrait}>
      <div className={styles.portraitFrame}>
        {photo ? (
          <Image
            src={photo}
            alt={`${name}の写真`}
            width={720}
            height={900}
            className={styles.portraitImage}
            priority
          />
        ) : (
          <span className={styles.monogram} aria-hidden="true">
            IT
          </span>
        )}
      </div>

      <figcaption className={styles.portraitCaption}>
        <span className={styles.portraitName}>{name}</span>
        <span>
          {role} ／ {location}
        </span>
        {photo ? null : <span className={styles.portraitNote}>写真は準備中です</span>}
      </figcaption>
    </figure>
  );
}
