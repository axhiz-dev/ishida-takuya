"use client";

import { useId, useState } from "react";
import { contact } from "@/content";
import styles from "./business.module.css";

/**
 * お問い合わせ。
 *
 * サーバーを持たないので、入力内容はメールの下書きとして開く。
 * 「送信しました」と出して実際は届いていない、という最悪の状態を避けるため、
 * ボタンの文言も「メールを作成する」にしてある。何が起きるか先に書く。
 */
export function ContactForm({ email }: { email: string }) {
  const id = useId();
  const [values, setValues] = useState<Record<string, string>>({});

  const set = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const compose = (event: React.FormEvent) => {
    event.preventDefault();

    const body = contact.fields
      .map((field) => `${field.label}：${values[field.name] ?? ""}`)
      .join("\n");

    const subject = values.company
      ? `お問い合わせ（${values.company}）`
      : "お問い合わせ";

    window.location.href =
      `mailto:${email}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className={styles.form} onSubmit={compose}>
      {contact.fields.map((field) => {
        const fieldId = `${id}-${field.name}`;
        return (
          <p key={field.name} className={styles.formField} data-wide={field.type === "textarea" || undefined}>
            <label htmlFor={fieldId}>
              {field.label}
              {field.required ? <span className={styles.formRequired}>必須</span> : null}
            </label>

            {field.type === "textarea" ? (
              <textarea
                id={fieldId}
                rows={3}
                required={field.required}
                value={values[field.name] ?? ""}
                onChange={(event) => set(field.name, event.target.value)}
              />
            ) : field.type === "select" ? (
              <select
                id={fieldId}
                value={values[field.name] ?? ""}
                onChange={(event) => set(field.name, event.target.value)}
              >
                <option value="">選択してください</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={fieldId}
                type={field.type}
                required={field.required}
                value={values[field.name] ?? ""}
                onChange={(event) => set(field.name, event.target.value)}
              />
            )}
          </p>
        );
      })}

      <div className={styles.formActions}>
        <button type="submit" className={`${styles.chip} ${styles.chipLarge}`}>
          {contact.submitLabel}
          <span aria-hidden="true">→</span>
        </button>
        <p className={styles.formNote}>{contact.submitNote}</p>
        <p className={styles.formNote}>
          フォームを使わずに、直接{" "}
          <a className={styles.textLink} href={`mailto:${email}`}>
            {email}
          </a>{" "}
          へお送りいただいても構いません。
        </p>
      </div>
    </form>
  );
}
