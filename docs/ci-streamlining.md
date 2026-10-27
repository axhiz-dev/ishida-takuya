# CIの重複処理削減

- PRと手動実行はCIを起動。mainへのpushはPagesワークフローが共通CIを呼び出すため、独立したpush CIは起動しない。公開前の検証は維持する。
- 共通CIで静的出力を1回作り、ChromiumとFirefox/WebKitで再利用する。ローカルの通常実行は引き続き自動ビルドする。
- 問い合わせ用の隔離ビルドはテスト専用フォームIDが必要なため維持する。共通CI内のビルドは4回から2回になる。
- 公開用ビルドはbasePathとフォームIDが異なるため維持する。
- 撮影のみの11件は通常テストから分離。Actionsの「Capture screenshots and PDF」を手動実行するか、ローカルで `npx playwright test --config playwright.screenshots.config.ts` を実行する。PDF検証や横溢れ・操作検証は通常CIに残す。
- ブラウザー導入の遅延に備え、共通CIの上限は30分。これは通常所要時間の目標ではない。

`PLAYWRIGHT_REUSE_BUILD=1` は直前に `npm run build:export` が成功した場合のみ指定する。出力がない場合は明示的に失敗する。ブラウザー導入時間のばらつきは残るため、短縮効果はActionsで計測する。
