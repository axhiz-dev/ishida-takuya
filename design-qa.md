# Business chat design QA — 2026-10-10

**final result: blocked**

## Evidence

- Visual truth: `docs/design/business-chat/reference-chat.png` (1487×1058), `reference-line.png` (1254×1254, six-scene storyboard), `reference-faq.png` (1584×1056, two-scene storyboard).
- Browser-rendered implementation: `docs/design/business-chat/implemented-aggregate.jpg` (1364×944 viewport, CSS viewport at browser default density).
- Local preview opened in cloud browser: `/business/` through terminal.local:4173.
- Reference and implementation were opened together in one image-comparison tool result. Different viewport heights are explicitly acknowledged; review compares the corresponding aggregate initial state, not exact pixel identity. No claim of exact same-viewport QA.
- Full view plus readable detail of the mascot, sample tables, answer rows and composer inspected in the joint comparison.

## Findings and iteration history

1. [P2, fixed] Initial desktop composition put the last answer rows below the fold. Reduced desktop vertical margins, sheet padding, and choice row padding, with a short-height desktop rule. Recaptured evidence now shows all three choices and the pinned composer simultaneously.
2. [P3] Generated target has more table columns. Implementation intentionally reduces columns and uses an XLS document icon from the existing Phosphor library. The task and highlighted mismatch remain clear.
3. [Pending verification] Full LINE completion, consultation flow, narrow screen visual QA, and the final FAQ breakdown change need browser verification.

## Required surfaces

- Typography: locally bundled Noto Sans JP, restrained weights, readable hierarchy; no remote font requests. Desktop compared; mobile not visually verified.
- Spacing: centered chat column, assistant avatar gutter, grouped choices and bottom menu match the selected visual structure. Short-height fix captured.
- Color: white surface, charcoal copy, pale sage hover, light blue user bubbles, amber discrepancy. Automated contrast coverage retained but not executed successfully locally.
- Assets: newly generated transparent mascot, no screenshot crop; no custom SVG/CSS approximation. Existing Phosphor library supplies standard icons. Avatar sharp at display size.
- Copy: sample status, no live LINE/AI connection, provisional pricing, unavailable submission are explicit. Business copy remains adjustable.

## Interaction checks completed in cloud browser

- Entry renders and starts from a short typing indication.
- Excel initial scene opens.
- FAQ list and monthly-cost answer open; return restores the aggregate scene.
- LINE starts, staff reply and unsubmitted-person reminder scenes work.
- Console log check: browser-extension metadata errors only; no application errors observed in checked log window.

## Blockers / test limitations

- Cloud-browser automatic approval review subsequently refused further actions because of a usage limit. No alternative browser route was used to bypass that refusal.
- Local Playwright browsers unavailable; browser download returned invalid/truncated archives. E2E attempts failed before test execution, not assertions.
- Isolated contact test server also hit environment `uv_interface_addresses` failure in `serve`; contact tests did not execute locally.
- Typecheck, lint and export do not substitute for the remaining browser QA. Keep PR draft pending CI and final manual visual review.

## Implementation checklist

- [x] Integrate selected design in existing /business route.
- [x] Fix desktop overflow found during visual QA.
- [x] Add state-preserving FAQ and consultation path.
- [x] Update existing E2E/contact suites for new interface.
- [ ] Run suites successfully in CI.
- [ ] Complete mobile/LINE/contact visual QA and update final result.
- [ ] Configure and verify real inquiry delivery before opening reception.

## 2026-10-11 — finance-checker体験とスクロール修正

- `npm run typecheck` / `npm run lint` / `npm run build:export`: 成功。
- Chromium 141 Headless Shellで、静的exportに対する `business-conversation` / `business-welcome` / `demo` の16件が成功。
- 320px・390px・1440pxで、コードなしExcelの確認 → 同一取引先の確認 → 3万円の差額 → 社内担当者へのGmail下書き → finance-checker作成 → 相談フォームへの引き継ぎを確認。
- ページ外の縦・横溢れがなく、会話内をスクロールしてもヘッダーが画面上端に残る。外側のアプリは `overflow: clip` とし、スクリーンリーダー用の非表示テキストを原点に配置して外側のスクロール領域を増やさない。
- 表・説明を含む回答全体の表示完了後、999msでは選択肢なし、1000msで表示を確認。回答を省略した場合も同様。回答完了時は読み位置を自動移動しない。画面を離れると遅延タイマーが解除される。
- 390pxのメール本文・最終案内を目視確認。キャプチャ: `docs/design/business-finance-skill/mobile-mail.png` / `mobile-close.png`。
- 添付ExcelのセルとプレビューJSONの一致、コード列の削除、230,000円 − 200,000円 = 30,000円を確認。
- Gmail・スキル保存はサンプル演出。実接続・実メール送信は行わない。問い合わせ受信設定は既存の準備中状態を継続。
- 今回は実機・Safari・Firefox・実受信は未確認。上記の過去のローカルブラウザー未実行の記録に対し、今回の対象16件は実行済み。
