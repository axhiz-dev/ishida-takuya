# Build Log

> This is not a resume. It is my build log.

石田拓也のインタラクティブ・デベロッパーポートフォリオ。
「一人のエンジニアの人生を、一つのデスクトップアプリとして開けたら」というコンセプトで設計しています。

## Stack

- Next.js (App Router) + TypeScript
- TailwindCSS v4
- Framer Motion(Fade / Slide / Reveal / Folder Open / Commit Append)
- Lenis(スムーズスクロール)
- Geist / Inter / JetBrains Mono

## Development

```bash
npm install
npm run dev
```

http://localhost:3000 で起動します。

## Content

サイトの全コンテンツは `src/data/` に集約されています。

| ファイル | 内容 |
| --- | --- |
| `src/data/profile.ts` | 名前・肩書き・Contact リンク(**要差し替え**) |
| `src/data/builds.ts` | Build 一覧(Featured / Archive / Current) |
| `src/data/commits.ts` | Build History の commit |
| `src/data/journey.ts` | Journey の節点 |
| `src/data/tech.ts` | Tech Map |
| `src/data/lessons.ts` | Lessons / Career Snapshot |

Resume PDF は `public/resume.pdf` に配置してください。

## Shortcuts

- `Ctrl/⌘ + K` — Command Palette
- `J / K` — 次・前の Build
- `Enter` — 選択中の Build を開く
- `Esc` — 閉じる
- `?` — ショートカット一覧

あとは……コンソールを見てみてください :)
