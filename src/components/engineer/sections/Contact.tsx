"use client";

import { Reveal } from "../ui/Reveal";
import { MagneticButton } from "../ui/MagneticButton";
import { SocialIcon, socialKind } from "../ui/SocialIcon";
import { profile } from "@/content";

export function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          {/* 回転コニックグラデーションの枠 */}
          <div
            className="relative rounded-3xl p-px"
            style={{
              background:
                "conic-gradient(from var(--angle), rgba(34,211,238,0.6), rgba(139,122,246,0.6), rgba(232,121,249,0.6), rgba(34,211,238,0.6))",
              animation: "border-rotate 10s linear infinite",
            }}
          >
            <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-gradient-to-b from-surface to-bg-alt px-8 py-16 text-center sm:px-16">
              <div
                aria-hidden="true"
                data-print="hide"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(139,122,246,0.15),transparent_70%)]"
              />

              <div className="relative">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-cyan">
                  Get in touch
                </p>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-5xl">
                  一緒に、良いものを
                  <br />
                  <span className="text-gradient">作りませんか。</span>
                </h2>
                <p className="mx-auto mt-6 max-w-xl leading-relaxed text-ink-muted">
                  お仕事のご依頼・ご相談、技術的なお話など、お気軽にご連絡ください。
                  通常 1〜2 営業日以内に返信します。
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <MagneticButton
                    href={`mailto:${profile.email}`}
                    ariaLabel="メールで連絡する"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-fuchsia px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-violet/25"
                  >
                    <SocialIcon kind="mail" />
                    メールで連絡する
                  </MagneticButton>

                  <div data-print="hide" className="flex items-center gap-3">
                    {profile.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        aria-label={link.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-ink-muted transition-all hover:-translate-y-0.5 hover:border-brand-violet/50 hover:text-ink"
                      >
                        <SocialIcon kind={socialKind(link.href)} />
                      </a>
                    ))}
                  </div>
                </div>

                <p className="mt-8 font-mono text-sm text-ink-faint">{profile.email}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
