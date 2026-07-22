# ishida-takuya — 自己紹介ポートフォリオサイト

石田 卓也の自己紹介サイト。閲覧者に応じてURLでページを切り替えます。

| URL | 対象 | 内容 |
| --- | --- | --- |
| `/` | — | 入口ページ（2つのページへの誘導のみ） |
| `/engineer` | 採用担当・エージェント | 職務経歴書として使えるページ。PDF出力可 |
| `/business` | 事業者・提案相手 | 実績・できること・人となりを伝えるページ |

## 技術構成

- Vite + React + TypeScript（フロントエンドのみ、バックエンドなし）
- Tailwind CSS v4
- GitHub Actions → GitHub Pages で自動デプロイ

## 更新のしかた（経歴書の更新 = git push）

コンテンツはすべて `src/data/` のTypeScriptファイルにあります。
**編集して main に push すれば、自動でサイトに反映されます。**

| ファイル | 内容 |
| --- | --- |
| `src/data/constants.ts` | 希望年収・Offers診断額・稼働条件などの定数 |
| `src/data/profile.ts` | 名前・肩書・職務要約・リンク・メールアドレス |
| `src/data/career.ts` | 職務経歴（本業 `careers` / 副業 `sideWorks`） |
| `src/data/skills.ts` | スキルと経験年数 |
| `src/data/projects.ts` | ビジネス向けの実績事例・できること・人となり |

各データの形は `src/data/types.ts` の型定義を参照。型に合わない編集をするとビルドが落ちるので、壊れたままデプロイされる心配はありません。

> `// TODO:` コメントを付けた箇所（在籍期間・GitHub URLなど）は推定で入れているので、確認・修正してください。

## 開発

```bash
npm install
npm run dev      # http://localhost:5173/ishida-takuya/
npm run build    # 型チェック + ビルド（dist/ に出力、404.html も生成）
npm run preview  # ビルド結果の確認
```

## 初回デプロイの設定（1回だけ必要）

GitHub リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に変更してください。
以後、main への push のたびに `.github/workflows/deploy.yml` が自動でビルド・公開します。

公開URL: `https://axhiz-dev.github.io/ishida-takuya/`

## PDF出力（職務経歴書）

`/engineer` ページ右下の「PDF出力」ボタン → ブラウザの印刷ダイアログで「PDFに保存」。
A4向けに余白・改ページを最適化した印刷用スタイルが適用されます。

## メモ

- `index.html` に `<meta name="robots" content="noindex">` を入れており、検索エンジンには載りません（年収などを載せているため）。検索に載せたい場合はこの行を削除してください。
- SPAのため、ビルド時に `index.html` を `404.html` へコピーして GitHub Pages 上での直接URLアクセス（`/engineer` など）に対応しています。
