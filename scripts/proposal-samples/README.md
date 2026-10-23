# 提案書に埋め込むサイト画面

あおば商事・こはるオフィスは架空の企業。実在企業のサイトの問題点や制作実績を主張するものではありません。`site.html`で現状・改善案のWebページを実装し、Playwrightで撮影しています。スライドは編集可能なPowerPointとして生成し、同じモデルから書き出した画像をチャット内で表示します。

生成コマンド（リポジトリルート）:

```sh
PLAYWRIGHT_CHROMIUM_PATH=/path/to/chromium node scripts/render-proposal-sites.mjs
```

出力: `public/business/proposals/`の12枚。スクリーンショットは現在のサイトの仮の画面と改善案。事例の社名・人数・内容はデモ用の仮原稿です。

写真はサイト画面の背景・事例のイメージとして使用。実在する納品実績の写真ではありません。

- office.jpg: Craig Lovelidge, Unsplash. https://unsplash.com/photos/an-empty-conference-room-with-desks-and-chairs-bV5dFLEYecM
  https://images.unsplash.com/photo-1637665599155-abfcf9fc3f78
- meeting.jpg: Slidebean, Unsplash. https://unsplash.com/photos/empty-meeting-room-6MtJ-y1hzTs
  https://images.unsplash.com/photo-1572025442811-aa5146a780fb

両方とも取得時点（2026-10-23 JST）にFree to use under the Unsplash Licenseと表示。https://unsplash.com/license

## PowerPointとプレビューの再生成

`src/components/business/chat/proposalSlides.json`と`estimateData.json`を更新後、次の手順で再生成します。PPTXとプレビューを両方更新してください。見積表は編集可能なPowerPointの表です。

CodexのPresentationsランタイムとNoto Sans JPフォントが必要です。フォントの取得元: https://github.com/google/fonts/tree/main/ofl/notosansjp （SIL Open Font License）。`PROPOSAL_FONT_PATH`には取得したNotoSansJP.ttfを指定します。

```sh
PROPOSAL_FONT_PATH=/path/to/NotoSansJP.ttf \
PROPOSAL_BUILD_DIR=/tmp/proposal-decks-new \
"$CODEX_PRIMARY_RUNTIME_NODE" scripts/build-proposal-decks.mjs
cp /tmp/proposal-decks-new/output/* public/business/proposals/
```

ビルド先は毎回未使用のディレクトリを指定します。出力はcurrent.pptx（4ページ）、past.pptx（3ページ）、各スライドのPNG（1920×1080）。構造・寸法・表の合計を検証後、全ページを目視確認します。日本語表示にはNoto Sans JPを使用しているため、PowerPoint側でも同フォントを利用するとレイアウトを再現できます。
