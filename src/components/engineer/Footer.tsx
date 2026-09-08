import Link from "next/link";
import { profile } from "@/content";
import { ROUTES } from "@/config/site";
import { formatDate } from "@/lib/derive";
import { SocialIcon, isExternal, socialKind } from "./ui/SocialIcon";

export function Footer() {
  const year = new Date().getFullYear();
  const links = [
    ...profile.links,
    { label: "Email", href: `mailto:${profile.email}` },
  ];

  return (
    <footer className="border-t border-white/5 bg-bg-alt">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="font-display text-lg font-bold">
            <span className="text-gradient">{profile.nameLatin}</span>
          </p>
          <p className="mt-1 max-w-md text-sm text-ink-muted">
            {ROUTES.engineer.description}
          </p>
          {/* 事業側の相手が迷い込んだときの逃げ道。1 行だけ置く。 */}
          <p className="mt-3 text-sm text-ink-faint">
            開発のご依頼・ご相談は{" "}
            <Link
              href={ROUTES.business.path}
              className="text-ink-muted underline underline-offset-4 transition-colors hover:text-brand-cyan"
            >
              こちらのページ
            </Link>
            へ。
          </p>
        </div>

        <div data-print="hide" className="flex items-center gap-3">
          {links.map((link) => {
            const external = isExternal(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-label={link.label}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-muted transition-all hover:-translate-y-0.5 hover:border-brand-violet/50 hover:text-ink"
              >
                <SocialIcon kind={socialKind(link.href)} />
              </a>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/5">
        <p className="mx-auto max-w-6xl px-6 py-5 text-center text-xs text-ink-faint sm:text-left">
          © {year} {profile.name}
          <span aria-hidden="true"> · </span>
          最終更新 <time dateTime={profile.updatedAt}>{formatDate(profile.updatedAt)}</time>
          <span aria-hidden="true"> · </span>
          Built with Next.js · Deployed on GitHub Pages
        </p>
      </div>
    </footer>
  );
}
