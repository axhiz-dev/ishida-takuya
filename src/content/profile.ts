import type { Profile } from "./types";

export const profile: Profile = {
  name: "石田 拓也",
  nameLatin: "Takuya Ishida",
  role: "ソフトウェアエンジニア",
  // mark は text に含まれる短い語を指す。画面で一番大きい声はここ 1 箇所だけ。
  headline: {
    text: "手ざわりのいい画面を、ちゃんと動く形でつくります。",
    mark: "手ざわり",
  },
  lede: "プロダクトの見た目と、それを支える設計の両方をやります。フロントエンドが主戦場です。",
  location: "東京",

  status: {
    label: "転職活動中",
    detail: "カジュアルな情報交換も歓迎です。",
  },

  summary: [
    "Web アプリケーションの設計・実装を軸に 9 年。直近 4 年はフロントエンドのリードとして、設計方針の決定とチームのレビューを担当。",
    "TypeScript / React を中心に、要件の詰めから運用・改善までを一貫して担当してきました。",
    "「速く出す」と「あとで直せる」の折り合いをつけるのが得意です。技術的負債は、返す前提で意図的に借りるものだと考えています。",
    "デザイナーと直接やりとりして UI の詳細を詰める仕事を好みます。この経歴書自体もその一例です。",
  ],

  links: [
    { label: "GitHub", href: "https://github.com/axhiz-dev" },
    { label: "X", href: "https://x.com/" },
    { label: "ブログ", href: "https://example.com/blog", note: "技術記事" },
  ],

  email: "axhiz.ozi@gmail.com",

  // 顔写真を置いたらここにパスを書く（例: "/photo.jpg"）。
  // 未設定の間はモノグラムが代わりに出る。
  photo: undefined,

  updatedAt: "2026-07-24",
};
