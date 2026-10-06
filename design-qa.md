# /business design QA — 2026-10-07

final result: passed

## Evidence and scope

- Source visual truth: `docs/business-qa/renewal-approved.jpg` (approved four-panel board).
- Browser-rendered evidence: `docs/business-qa/renewal-hero-final.jpg`, `renewal-examples.jpg`, `renewal-proposal.jpg`, `renewal-pricing.jpg`.
- Cloud Chromium CSS viewport: 1363×936; returned screenshot pixels: 1348×926. The browser capture excludes its scrollbar/frame edge. No image was stretched.
- Source panel crops: hero 674×511, list 672×512, conversation 674×462, pricing 672×462. The board is a presentation composite, not an exact CSS viewport specification. Normalize with proportional containment; compare composition and type hierarchy rather than treating board text sizes as literal CSS pixels.
- Full-view comparisons: `docs/business-qa/renewal-comparison-hero-final.jpg`, `renewal-comparison-examples.jpg`, `renewal-comparison-proposal.jpg`, `renewal-comparison-pricing.jpg`. Reference and implementation are combined in the same input.
- Focused regions: chat controls, hero stage rows, pricing and form were inspected at full-resolution in the browser, where 16px body text and the relevant labels were readable.

## Findings and fixes

- P2, opening a conversation retained the list's scroll position, hiding its heading. Fixed by focusing the new heading and scrolling the examples section into view after the render. Post-fix conversation evidence is `renewal-proposal.jpg`; title, messages, back link and progression controls are visible together.
- No remaining actionable P0/P1/P2 mismatch in the captured desktop states.

## Required fidelity surfaces

- Fonts: locally bundled Noto Serif JP headings and Noto Sans JP body reproduce the serif/sans hierarchy. Production body text is 14–18px, rather than enlarging text to match a scaled presentation board. Navigation and explanatory paragraphs remain readable.
- Layout: split photo/stage hero, divider-based three-row list, isolated two-message conversation and two-column pricing/form. No simultaneous document/checklist next to the conversation. Extra support/profile sections provide the agreed service details without crowding these screens.
- Colors: forest green, warm ivory and pale sage use renewal tokens. No red, pixel aesthetic or old office illustrations.
- Assets: separately generated 1536×1024 photograph exported to a 181KB WebP; no mockup crop used as a production asset. Phosphor icons provide consistent stroke weight.
- Copy: approved moderate text quantity, corrected natural Japanese, explicit 4 weeks / 1 person / 1 workflow / 55,000 yen including tax. Mock conversation and generated proposal are labeled as examples.

## Primary interactions checked in cloud browser

Header links; list → conversation; next → answer → draft; back to list; pricing details expand/collapse; unconfigured form disabled with existing email fallback. No application console errors observed; extension metadata errors came from `chrome-extension://`, outside the application.

## Verification limits

Local lint, TypeScript and static export passed. Automated mobile, form-delivery mocks and Firefox/WebKit checks are in CI. Local browser installation/startup failed in this execution environment before page setup; this is not a passing E2E result. Real Formspree delivery, physical devices and final operator information remain release checks, not completed claims.

## Follow-up polish

The generated production photo has a different candid framing from the mock. Brand name remains the approved temporary descriptor. No new customer claims or profile credentials were invented.
