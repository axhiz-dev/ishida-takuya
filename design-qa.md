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
