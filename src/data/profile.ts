export type ContactLink = {
  label: string;
  href: string;
  note?: string;
};

export const profile = {
  name: "Takuya Ishida",
  nameJa: "石田 拓也",
  title: "Full Stack Engineer",
  tagline: "Building products people enjoy using.",
  buildNumber: "0061",
};

// TODO: 公開前に実際の URL / メールアドレスに差し替えてください。
// Resume PDF は public/resume.pdf に配置すると /resume.pdf で配信されます。
export const contactLinks: ContactLink[] = [
  { label: "GitHub", href: "https://github.com/ishida-takuya", note: "@ishida-takuya" },
  { label: "Zenn", href: "https://zenn.dev/ishida_takuya", note: "articles" },
  { label: "Qiita", href: "https://qiita.com/ishida-takuya", note: "posts" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ishida-takuya", note: "profile" },
  { label: "Email", href: "mailto:contact@example.com", note: "contact@example.com" },
  { label: "Resume PDF", href: "/resume.pdf", note: "download" },
];
