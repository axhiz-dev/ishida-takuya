# HRBrain five initiative stories QA

final result: passed

## Scope and source
- User approved applying the existing graph-parts diagram language to all five initiatives and requested this order: グラフパーツ → ユニットリーダー → AI駆動開発 → Slack MCP → テンプレート機能.
- Visual reference: `/workspace/scratch/8410e71dce3f/generated_images/exec-7779806d-43a0-4abe-85f9-1771e904c054.png` (1036 × 1518); upper product-engineering section is the approved pattern.
- User's new template emphasis: voluntary feature proposal and completed PoC, leading to sales/CS proposal activity. The resulting copy describes additional proposals, not a measured revenue increase.
- Existing site framing, tabs, typeface and technical-topic diagram remain in place. Each initiative supplies its own context, three actions, outcome/current state and personal contribution to the shared diagram component.

## Evidence and normalization
- Cloud preview: `http://terminal.local:4173/engineer/`. Cloud Chrome DOM confirmed requested tab order and all four new diagram headings. Tab switching and the settled template diagram were inspected.
- Static browser screenshots: `/tmp/initiative-{0..4}-1440.png`, captured at 1440 × 1000 CSS px, device scale 1. Focus outlines on the disclosure in these captures reflect the keyboard verification state.
- Mobile screenshots: `/tmp/initiative-{0..4}-375.png` at 375 × 1000 CSS px, scale 1. All five slides at 320 / 375 / 414 / 768px were checked for overflow and disclosure operation.
- Combined comparisons: `/tmp/initiative-comparison-{0..4}.png`. Approved source section and each implementation were normalized to 980px width, placed side by side, and inspected. The reference supplies layout/style; the four new stories intentionally have new content and icons.
- Final balanced-heading captures: `/tmp/initiative-{0..4}-final.png`.

## Findings and fidelity surfaces
No remaining actionable P0/P1/P2 findings.
- Fonts/typography: same Japanese site font, 20–22px initiative heading, navy bold action labels and readable secondary copy. Result headings use balanced wrapping to avoid orphan final characters.
- Layout/spacing: context on the left, connected three-step action sequence in the center, outcome/current state on the right. Template story has two input nodes; connector position adapts to node count. On narrow screens the stages stack with downward connectors.
- Colors/tokens: existing paper, ink, navy and light-blue tokens retained. Existing contrast E2E passed.
- Image/icon fidelity: editable HTML content with Phosphor icons, matching the previously approved visual language. No rasterized text or added decorative image assets. Decorative icons are hidden from assistive technology; headings and ordered lists preserve meaning.
- Copy/content: leadership emphasizes decision structure and cross-team planning; AI development emphasizes quality-first prioritization and Skills/E2E; Slack MCP covers adoption conditions through ongoing operation; template covers self-initiated proposal, PoC and sales/CS adoption. Ongoing work is not presented as a completed speed/revenue improvement.

## Iterations and verification
- Initial combined review found an orphan final character in a narrow outcome column. Added balanced wrapping, then captured the final built slides again.
- All five tabs and disclosures passed at desktop and four narrow widths, including Enter to open/close each disclosure and ArrowRight tab navigation.
- Static browser page errors: none.
- Existing engineer E2E: 15 passed, including responsive overflow, headings, contrast, print visibility, all-initiative print content and seven-page A4 PDF export.
- Lint, typecheck and static export passed. Final static export repeated after the wrapping adjustment.

## Follow-up polish
- P3: exact connector curvature and individual icon shapes differ from the generated mock; existing icon library and responsive connector layout are retained.
- Physical devices and non-Chromium browser engines were not checked locally.

---

# Dashboard migration diagrams QA

final result: passed

## Scope and visual truth
- Selected reference: revised first Product Design option, `/workspace/scratch/8410e71dce3f/generated_images/exec-7779806d-43a0-4abe-85f9-1771e904c054.png` (1036 × 1518).
- The approved placement separates the two diagrams: specification/consensus in the HRBrain initiative carousel, technical migration in Tech Topics. The global mock page title is intentionally not added to the existing resume.
- Browser preview: `http://terminal.local:4173/engineer/`, cloud Chrome. Checked product diagram, details disclosure, initiative tabs, technical-topic navigation and technical disclosure.
- Local static browser captures at 1440 × 1000 CSS px, device scale 1: `/tmp/migration-product-desktop.png` (974 × 645) and `/tmp/migration-tech-desktop.png` (976 × 864).
- Combined evidence: `/tmp/migration-product-comparison.png` and `/tmp/migration-tech-comparison.png`. Corresponding source sections and rendered components normalized to 980px width, then placed side by side. No browser/device chrome in the component comparisons.
- Mobile evidence: `/tmp/migration-product-mobile.png`, `/tmp/migration-tech-mobile.png`, 375 × 900 CSS viewport. Additional 320 / 414 / 768px checks passed without horizontal overflow.

## Findings and required surfaces
No outstanding actionable P0/P1/P2 issues.
- Typography: existing Japanese site font retained. Visual initiative/topic headings enlarged to 20–22px; diagram labels and explanatory text remain readable. Nested headings follow the existing H4/H5 initiative and H3/H4 topic hierarchy.
- Spacing/layout: matches the selected three-viewpoint → three-step specification review → agreed scope map. Technical section retains three causally ordered rows. Existing carousel/card framing is intentional. Narrow screens stack the stages and rotate flow arrows downward.
- Tokens: existing offwhite, navy, light-blue and ink colors retained. Contrast E2E passed.
- Assets: Phosphor icons used for people, calendar, steps, database, document and arrows. No rasterized diagram text. All labels are selectable HTML, with decorative icons hidden from assistive technology.
- Copy: approved product and technical narratives preserved. The generated mock's incorrect “期間を分割” is corrected to “データを分割して取得”. Implementation is explicitly ongoing; improvement effects are not claimed as measured outcomes.

## Comparison and verification history
- Initial browser capture: diagram headings were too close to the old small-card type scale. Enlarged visual headings and key node labels before the final combined comparison.
- Existing carousel review: taller diagrams would have left excess space in shorter inactive slides. Inactive slides now have zero block height and `inert`, while keeping their horizontal carousel slot. Static browser verification measured 645px for the diagram slide and 232px for the template slide.
- Post-fix desktop and mobile combined/cropped evidence reviewed. No clipping, overlapping connectors or unreadable labels found. Differences from the full standalone mock are the intentional existing-page section placement and framing.
- Cloud browser disclosures and tab switching passed; static browser keyboard disclosure check passed.
- App console: no page errors in static browser capture. Cloud logs contain unrelated extension metadata errors; no application error associated with these changes.
- Lint, typecheck, static export and 15 existing engineer-related E2E tests passed, including contrast, responsive layout, print and seven-page A4 PDF output.

## Follow-up polish
- P3: icon outlines and connector curvature differ slightly from the generated mock to use the site's existing icon library and responsive HTML layout.
- Physical devices and browser engines other than Chromium were not tested locally.

---

# Business profile banner QA

final result: passed

## Scope and evidence
- Visual target: selected second Image Gen banner, preserved as `public/images/business/ishida-profile-banner.webp` (1774 × 887 source pixels).
- Browser-rendered evidence: `docs/qa/business-profile-banner-desktop.jpg` (1363 × 936 pixels / CSS viewport).
- State: `/business/#about`, self-introduction dialog open, banner rendered at 680 × 340 CSS pixels.
- Combined comparison: `docs/qa/business-profile-banner-comparison.png`. Top: original selected design normalized to 680 × 340; bottom: browser banner crop at the same size. Browser screenshot density 1; no device frame. This comparison also provides a focused view of all banner lettering and portrait details.
- Standalone `/business/profile/` visually checked in the same browser.

## Findings
No actionable P0/P1/P2 differences in the verified desktop state.
- Typography: selected artwork retained, including headline wraps, name and role. The actual H2 remains available to assistive technology; the image alternative describes identity and role.
- Spacing: exact 2:1 banner ratio, no crop/stretch, 32px gap before existing introduction. Old duplicate avatar/name row removed.
- Colors: selected ivory/sage/forest artwork retained without approximation.
- Images: full original generated banner converted to WebP at quality 90, not cut from a screenshot. Real uploaded portrait is used for business avatars. Desktop banner ~103KB, mobile ~78KB, avatar ~31KB.
- Copy: headline, name, role and existing introduction preserved.

## Interactions and logs
- Open self-introduction from business navigation: passed.
- Self-introduction → free consultation form: passed (no submission).
- Close dialog → original conversation → reopen self-introduction: passed.
- Banner image loaded successfully (natural asset and rendered dimensions verified).
- No application errors associated with this change. Browser logs contain extension metadata errors and an existing Next.js smooth-scroll warning; these are unrelated to the banner.

## Comparison history
Initial combined comparison passed; no visual corrections required.

## Residual verification gaps
- Mobile artwork inspected directly; square variant selected via `<picture>` at viewport widths ≤480px, with intrinsic dimensions to avoid layout shift. Mobile browser viewport, real devices and Safari/Firefox were not tested in this run.
- Artwork lettering is raster content; future wording edits require updating both banner assets. Accessible H2 and alt text must be updated alongside them.

## Implementation checklist
- [x] Selected desktop artwork and mobile variant installed.
- [x] Banner shared by dialog and standalone profile page.
- [x] Accessible heading/identity retained.
- [x] Typecheck, lint and static export passed.
- [x] Browser evidence and combined comparison reviewed.
