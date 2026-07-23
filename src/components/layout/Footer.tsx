import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { SocialIcon } from "@/components/ui/SocialIcon";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-bg-alt">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="font-display text-lg font-bold">
            <span className="text-gradient">{profile.nameEn}</span>
          </p>
          <p className="mt-1 text-sm text-ink-muted">{site.description}</p>
        </div>

        <div className="flex items-center gap-3">
          {profile.socials.map((s) => (
            <a
              key={s.kind}
              href={s.href}
              aria-label={s.label}
              target={s.kind === "mail" ? undefined : "_blank"}
              rel={s.kind === "mail" ? undefined : "noopener noreferrer"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ink-muted transition-all hover:-translate-y-0.5 hover:border-brand-violet/50 hover:text-ink"
            >
              <SocialIcon kind={s.kind} />
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5">
        <p className="mx-auto max-w-6xl px-6 py-5 text-center text-xs text-ink-faint sm:text-left">
          © {year} {profile.name}. Built with Next.js · Deployed on GitHub Pages.
        </p>
      </div>
    </footer>
  );
}
