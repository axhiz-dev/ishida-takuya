# 内容の更新のしかた

このサイトの中身はすべて `src/content/` にある TypeScript ファイルです。
**ここを書き換えて `main` に push すれば、GitHub Actions が自動でビルドして公開します。**
管理画面もデータベースもありません。

公開先: https://axhiz-dev.github.io/ishida-takuya/

---

## どのファイルに何が入っているか

| ファイル | 中身 | 出るページ |
| --- | --- | --- |
| `src/content/profile.ts` | 氏名・肩書き・状況・要約・連絡先・最終更新日 | 全ページ |
| `src/content/career.ts` | 職務経歴（会社・期間・役割・成果） | `/engineer` |
| `src/content/skills.ts` | スキル一覧（習熟度・年数・根拠） | `/engineer` |
| `src/content/cases.ts` | 深掘り事例（課題・打ち手・判断・結果） | `/engineer` |
| `src/content/business.ts` | 提供内容・進め方・お客様の声・費用・FAQ | `/business` |
| `src/config/site.ts` | サイト全体の定数と機能フラグ | 全ページ |

型は `src/content/types.ts` にあります。必須項目を書き忘れると
**ビルドが落ちて公開されない**ので、間違ったまま公開されることはありません。

---

## よくある更新

### 経歴を 1 社増やす

`src/content/career.ts` の配列の**先頭**に追加します（新しい順に並べる決まり）。

```ts
{
  id: "atarashii-kaisha",              // 他と重複しない英字
  company: "株式会社◯◯",
  companyNote: "何をしている会社かを 1 行で。読み手は社名を知りません。",
  period: { from: "2026-08", to: "present" },   // 在籍中は "present"
  role: "テックリード",
  teamSize: 6,                          // 任意
  context: "どういう状況に置かれていたか。成果の意味はここで決まります。",
  responsibilities: ["担当したこと", "担当したこと"],
  outcomes: [
    { label: "やったこと" },                          // 数字がないならこれでよい
    { label: "やったこと", value: "12 画面", note: "前提や出どころ" },
  ],
  stack: ["TypeScript", "React"],
},
```

### 最終更新日を変える

`src/content/profile.ts` の `updatedAt` を `"YYYY-MM-DD"` 形式で更新します。
画面のレールと、印刷したときのヘッダに出ます。

### 顔写真を入れる

1. 画像を `public/photo.jpg` に置く
2. `src/content/profile.ts` の `photo` を `"/photo.jpg"` にする

未設定のあいだは、`/business` にモノグラムの枠と「写真は準備中です」が出ます。
それらしいストック画像を置くより、無いことを明示するほうが信用を損ないません。

### 「ダミーです」の帯を消す

`src/config/site.ts` の `IS_PLACEHOLDER_CONTENT` を `false` にします。

---

## 書くときの約束ごと

### 数字は、確認できたものだけ

`outcomes[].value` は**任意**です。「p95 を 40% 改善」のような未確認の数字を
埋めるくらいなら、`value` を省略して質的に書いてください。
数字のない行としてそのまま表示されます。

作られた数字は読み手にすぐ見抜かれ、書いてあること全部の信用が落ちます。
数字の入っていない欄は正直さであって、欠陥ではありません。

### スキルには根拠を添える

`evidence`（どこで使ったか）のないレベル表は、読み手にとって情報量がほぼゼロです。
`level` は自己申告なので、必ず裏づけとセットにしてください。

- `1` 触れたことがある
- `2` 業務で使える
- `3` 主戦場
- `4` 設計と技術判断ができる

### 事例は「なぜそうしたか」が本体

`problem` → `approach` → `reasoning` → `result` の順に出ます。
採用側がいちばん見ているのは `reasoning` です。ここが薄いと
経歴書は「やったことリスト」で終わります。

### 見出しの改行は自分で決められる

`/business` のヒーローの宣言（`businessIntro.statement`）は**配列**です。
1 要素が 1 行になります。和文は自動折り返しに任せると文節の途中で折れるため、
ここだけ行を明示的に持っています。

---

## 手元で確認する

```bash
npm install
npm run dev          # http://localhost:3000
```

公開されるものと同じ形（静的書き出し）を確認するとき:

```bash
npm run build:export
npx serve out
```

E2E とスクリーンショット:

```bash
npm run test:e2e
# screenshots/ に各ページのキャプチャと職務経歴の PDF が出ます
```

---

## PDF として保存する

`/engineer` の左レール（狭い画面では上部）にある「PDFで保存」を押すと、
ブラウザの印刷ダイアログが開きます。送信先で「PDF として保存」を選んでください。

印刷時は A4・白黒前提のレイアウトに切り替わります。レールと注意書きは消え、
代わりに氏名・連絡先・サイト URL・最終更新日のヘッダが 1 行入ります。
文字は画像化されないので、PDF 上でも検索とコピーができます。
