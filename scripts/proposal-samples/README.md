# 提案書に埋め込むサイト画面

あおば商事・こはるオフィスは架空の企業。実在企業のサイトの問題点や制作実績を主張するものではありません。`site.html`で現状・改善案のWebページを実装し、Playwrightで撮影しています。スライドもHTMLとして実装し、文章を選択できる状態を維持しています。

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
