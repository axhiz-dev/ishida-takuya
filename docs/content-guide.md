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
| `src/content/engineer.ts` | 職務経歴・スキル・制作実績・`/engineer` の原稿 | `/engineer` `/`（数字だけ） |
| `src/content/business.ts` | 症状リスト・デモの説明・進め方・お約束・料金・試算・FAQ | `/business` |
| `src/content/legal.ts` | 特商法の表記・プライバシーポリシー | `/business/legal` `/business/privacy` |
| `src/config/owner.ts` | 事業者の情報（住所・電話・登録番号） | 上記すべて |
| `src/config/site.ts` | サイト全体の定数と機能フラグ | 全ページ |

型は `src/content/types.ts` にあります。必須項目を書き忘れると
**ビルドが落ちて公開されない**ので、間違ったまま公開されることはありません。

---

## よくある更新

### 経歴を 1 社増やす

`src/content/engineer.ts` の `engineerCareer` の**先頭**に追加します
（新しい順に並べる決まり）。

```ts
{
  period: { from: "2026-08", to: "present" },   // 在籍中は "present"
  company: "株式会社◯◯",
  companyNote: "何をしている会社かを 1 行で。読み手は社名を知りません。",
  role: "テックリード",
  summary: "何をした期間か。1〜2 文。",
  highlights: ["やったこと", "やったこと"],
  tech: ["TypeScript", "React"],
},
```

画面に出る「2026.08 – 現在」は `period` から組み立てられます。
**表示用の文字列を書く場所はありません。** 手で書けるようにすると、
下で説明する通算年数とずれても誰も気づけないためです。

### 通算年数について

`/` の扉に出る「10 年 / TypeScript · React · Next.js」と、`/engineer` の
About に出る「10 年 / Web 開発の経験」は、**どちらも `engineerCareer` の
在籍期間から計算しています。** 書き換える場所はありません。

「40+ 手掛けたプロジェクト」「15+ 関わったチーム」は導出できないので
`engineerStats` に手で書いてあります。ここは実数に直してください。

### スキルを足す・習熟度を変える

`src/content/engineer.ts` の `engineerSkills` を編集します。
`level` は 0-100 の**主観的な**習熟度で、バーの長さと数値になります。

```ts
{ name: "Svelte", level: 70 },
```

上位 3 つ（`level` の高い順）が `/` の扉に出ます。カテゴリをまたいで
並べ替えるので、フロントエンド以外も上がってきます。

### 制作実績を足す

`src/content/engineer.ts` の `engineerProjects` に追加します。

```ts
{
  title: "◯◯の開発",
  category: "フルスタック / 0→1",
  year: "2026",
  description: "何を作って、何が難しくて、どう解いたか。",
  tech: ["Next.js", "PostgreSQL"],
  accent: "from-cyan-400 to-violet-500",   // カードのグロー（Tailwind のクラス断片）
  links: [{ label: "GitHub", href: "https://..." }],   // 任意
},
```

`links` の `href` が `http` で始まっていれば別タブで開きます。
アイコンはリンク先の URL から自動で決まる（GitHub / X / Zenn / LinkedIn /
メール / それ以外）ので、種別を書く場所はありません。

### 冒頭の宣言と、強調する 1 語を変える

`src/content/profile.ts` の `headline` は 2 つの値を持ちます。

```ts
headline: {
  text: "手ざわりのいい画面を、ちゃんと動く形でつくります。",
  mark: "手ざわり",   // ← text に含まれる短い語。ここだけ背後に色帯が敷かれる
},
```

`mark` が `text` に含まれていなければ帯は出ません（壊れません）。
**画面で一番大きい声は 1 箇所だけ**にするための仕掛けなので、短い語を選んでください。

### `/engineer` の節を足す

`src/content/engineer.ts` の `engineerNav` に 1 行足します。

```ts
{ id: "writing", label: "書いたもの", labelEn: "Writing" },
```

そのうえで `src/app/(engineer)/engineer/page.tsx` に同じ `id` の
`<section>` を追加します。ナビの現在地は `IntersectionObserver` が
拾うので、ほかに触る場所はありません。

### 最終更新日を変える

`src/content/profile.ts` の `updatedAt` を `"YYYY-MM-DD"` 形式で更新します。
ページ下部のマストヘッドと、印刷したときのヘッダに出ます。

### 顔写真を入れる

1. 画像を `public/photo.jpg` に置く
2. `src/content/profile.ts` の `photo` を `"/photo.jpg"` にする

未設定のあいだは、`/business` にモノグラムの枠と「写真は準備中です」が出ます。
それらしいストック画像を置くより、無いことを明示するほうが信用を損ないません。

### 「ダミー」の表示を消す

`src/config/site.ts` の `IS_PLACEHOLDER_CONTENT` を `false` にします。
ナビの中に出ている小さなチップが消えます。

---

## 書くときの約束ごと

### 数字は、確認できたものだけ

`highlights` に「p95 を 40% 改善」のような数字を書くなら、出どころを
言えるものだけにしてください。作られた数字は読み手にすぐ見抜かれ、
書いてあること全部の信用が落ちます。

導出できる数字（通算年数）はコードが計算します。**手で書ける場所を
作っていないのは、2 か所に書くと必ずずれるから**です。

### スキルの数値は主観だと分かる形で

`engineerSkills` の `level` は 0-100 の自己申告です。公開中のサイトが
その形なのでそのまま引き継いでいますが、**根拠のない精度に見える**という
弱点は残ります。数字を疑われたくない場面では、`highlights` 側に
「どこで使ったか」を書いて裏づけてください。

### 見出しの改行は自分で決められる

`/business` のヒーローは行を明示的に持ちます。和文は自動折り返しに
任せると文節の途中で折れるためです。`mark` は `/engineer` と同じ仕組みで、
いずれかの行に含まれる語の背後に帯を敷きます。

```ts
export const hero: BusinessHero = {
  lines: ["画面を見ながら、別の画面に打ち直している。", "その作業は、たいてい自動にできます。"],
  mark: "打ち直している",
  ...
};
```

---

## `/business` の書きぶり

事業側のページは読み手が IT に詳しくない前提なので、決まりごとを
`src/content/types.ts` の「業務自動化」ブロックにも書いてあります。

- 見出しは名詞。文にするのはヒーローだけ
- 抽象名詞を使わない（DX／変革／実現／最適化／伴走／寄り添う は禁止）
- 顧客が実際に口にする言葉で書く（「データ転記の非効率」ではなく「エクセルに打ち直している」）
- 誇張しない。「すべて」ではなく「たいてい」
- 技術名を前面に出さない（買い手にとってリスク要因になる）
- 「〜ではなく、〜します」の対句はページ全体で **1 回まで**
- **断りの文で営業しない。** できないことと値段の話は段落を分ける

導入企業ロゴ・お客様の声・実績件数・受賞歴は**型として持っていません**。
公開できる実績がない段階では、盛るほど信用が下がるためです。

### 金額を変えるとき

料金は `priceTiers` / `priceAddons` / `monitorOffer` の 3 つで完結します。
表示は `amount` の文字列を、試算は `amountYen` の数値を使う二本立てなので、
**表記を変えるときは両方を直してください**（片方だけだと計算がずれます）。

金額を出さない段には `reason` を必ず書きます。空欄のままだと
「高いから書けない」に見えて、そこで読者が止まります。

---

## 見た目について

`/engineer` はダーク固定、`/business` と `/` はそれぞれ地の色が決まっていて、
切り替えは持ちません。`/engineer` は[公開中のサイト](https://axhiz-dev.github.io/ishida-takuya/)の
実装をそのまま持ち込んだもので、ダークの見え方そのものが中身だからです。

**`/engineer` だけ Tailwind で組まれています。** 色を触るときは
`src/styles/engineer.css` の `@theme`、`/` と `/business` は
`src/styles/tokens.css` を見てください。

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

`/engineer` の右上にある「PDF」を押すと、ブラウザの印刷ダイアログが開きます。
送信先で「PDF として保存」を選んでください。

- **ダークで表示していても、紙は必ず白黒で出ます**（印刷時に地と影をまとめて落とし、
  文字を黒に固定しています）
- ナビ・パーティクル・ぼかし・スキルのバー・ウォーターマークは消え、代わりに
  氏名・連絡先・サイト URL・最終更新日のヘッダが 1 行入ります
- 経歴の左右交互の 2 段組は、紙では 1 列に落ちます（交互配置は読み順を壊すため）
- スキルの数値は文字として残ります（紙でバーは意味を持たないため）
- 文字は画像化されないので、PDF 上でも検索とコピーができます（実測 4 ページ）

既存フォーマットの職務経歴書を求められた場合は、この PDF を渡せば足ります。
サイト側はそのぶん自由に作ってあります。

---

## まだ決まっていない項目

住所・電話番号・インボイスの登録番号のように、**本人しか埋められないもの**は
`src/config/owner.ts` に `PLACEHOLDER` として置いてあります。

画面には赤い「未入力」の札が出るので、埋め忘れたまま公開しても気づけます。
さらに E2E が、`IS_PLACEHOLDER_CONTENT` を `false` にした状態で
`PLACEHOLDER` や `［　］` が残っていたら落とします。
**ダミー表示を切るのは「中身が入った」という宣言**、という約束です。

埋める順番はこうなります。

1. `src/config/owner.ts` の住所・電話・登録番号・対応地域
2. `src/content/business.ts` の `about.career`（経歴）
3. `src/content/legal.ts` の `policyUpdatedAt`（最終改定日）
4. `src/content/profile.ts` の `photo`（顔写真のパス）
5. `src/config/site.ts` の `IS_PLACEHOLDER_CONTENT` を `false` に
