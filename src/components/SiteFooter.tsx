import { profile } from "../data/profile";

export default function SiteFooter() {
  return (
    <footer className="print-hidden mt-20 border-t border-line">
      <div className="mx-auto max-w-4xl px-6 py-8 text-xs text-ink-faint">
        <p>
          © {new Date().getFullYear()} {profile.nameJa} ({profile.nameEn})
        </p>
      </div>
    </footer>
  );
}
