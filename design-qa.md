# Business chat design QA

## 2026-10-17 — LINE shift consultation

**Scope and visual truth**
- Selected first displayed ImageGen concept: `exec-ae697be3-7322-4176-89aa-11c8eac34998.png`, captured locally as `screenshots/shift/reference.png` (1487×1058).
- User override: keep example 1's choice design and behavior exactly; adapt the selected concept's conversational flow to the existing chat, rather than copying its green CTA and back button. Reuse the existing mascot, icons, fonts, header, scrolling pane and Choices component.
- Implementation: static export served at `http://127.0.0.1:4175/business/`; captured at 1487×1058 CSS/pixels, density 1. `docs/business-qa/shift-conversation.png` and `docs/business-qa/shift-mobile.png`.
- State: third consultation turn, free-format staff reply and default LAST. Both references show the same four-message LINE example. The implementation retains earlier turns in a scrollable pane, so the preceding manager bubble is above the captured reading position; the mock is a standalone composition. This is intentional to match example 1.

**Comparison evidence**
- Source and implementation opened in one composite input: `screenshots/shift/comparison.jpg` (2974×1058). No density scaling used.
- Focused readable LINE-region comparison opened: `screenshots/shift/detail-comparison.jpg`. Verified all four messages, order, alignment and labels; no extra confirmation after 17時.
- Fonts/typography: existing Zen Kaku Gothic New and existing chat scale retained to match example 1. Mock display headline and enlarged text deliberately not introduced into the scrolling chat.
- Spacing/layout: single-column consultation with embedded LINE artifact preserved. Existing floating Choices dock reused without markup/CSS changes. All content remains reachable by scrolling; dock does not overlay the main pane.
- Colors/tokens: existing white surface, pale-blue user/LINE backgrounds, green staff bubbles and dark-green mascot retained. No new palette or gradients.
- Images/assets: original `chat-guide.png` and Phosphor icons reused; no generated-image text rasterized into the UI, no replacement drawings.
- Copy/content: seven complete manager/AI exchanges define recruitment, free replies, LAST, one reminder, staffing and approvals. Fixed samples are labeled, and actual integration is described as a subsequent step. Final draft has 3 people including one responsible person on each weekend night.

**Findings and history**
- [P2, resolved] Initial LINE bubbles filled 85% of the panel even for short replies (`screenshots/shift/desktop-before.png`). Added `width: fit-content` to existing message styles. Recaptured static build (`desktop-final.png`) and compared full and focused images again; bubbles now follow message length while preserving max-width and mobile wrapping.
- No remaining actionable P0/P1/P2 findings. Responsive screenshots checked at 390×844 (reply sample) and 320×844 (final draft); horizontal document overflow 0, choices remain in viewport.

**Validation**
- TypeScript, scoped ESLint and complete static export (including lint/types) passed.
- In-app browser: seven turns to final draft, conversation history, FAQ round trip, consultation-topic handoff, close/reopen choices and focus restoration, desktop and mobile scrolling. Static export reply flow also checked.
- Browser logs inspected: no errors; development LCP hint for the unchanged welcome illustration only.
- Existing Playwright regression updated for initial consultation, exact LAST reply order, persistent history, final approval and topic handoff. Automated browser suite not run locally; CI is the remaining automated check. Real-device Safari/Android not covered.

**Implementation checklist**
- [x] Reuse example 1 Choices and ChatTurn.
- [x] Keep requested four-message LINE exchange exactly.
- [x] Show rule-setting before bot behavior and preserve conversation history.
- [x] Verify static export and browser interactions; inspect full and focused visual comparisons.

final result: passed

---

## Historical QA — 2026-10-10

## 2026-10-12 monthly report

- Added separate fictional sample 2 (six months, eight customers, 48 sales and 47 payments), monthly revenue/receipts/outstanding, month switcher, customer revenue, trend, issue list and workbook preview/download.
- Finance-checker includes the monthly report as a standard output. Original small sample and reconciliation/mail scenes remain.
- Local typecheck, lint, static export and browser-free monthly aggregation test passed. September revenue 5,360,000, matched receipts 4,300,000, outstanding 1,060,000 and unmatched receipts 150,000 verified; overdue and not-yet-due items separated.
- Spreadsheet source sheets rendered and reviewed. XLSX and preview/report use the same generated JSON source.
- Updated 320/390/1440px conversation E2E and Firefox/WebKit demo flow. Local browser download failed with a truncated archive; browser tests and web visual QA pending CI/manual review. Real-device verification pending.

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
