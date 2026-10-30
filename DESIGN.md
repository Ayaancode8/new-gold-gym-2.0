---
name: New Gold Gym 2.0
description: Mobile-first gym identity with compact condensed titles, real photography, and restrained gold.
colors:
  ink: "#171C19"
  gold: "#D8B66A"
  cream: "#F2EDE3"
  muted: "#BAB5AB"
  dark: "#101511"
  surface: "#222923"
  line: "#3C433D"
  rating-empty: "#68716A"
typography:
  mobile-title:
    fontFamily: "Teko, sans-serif"
    fontSize: "53px"
    fontWeight: 500
    lineHeight: "48px"
  mobile-tab:
    fontFamily: "Inter Tight, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.2
  display:
    fontFamily: "Teko, sans-serif"
    fontSize: "96px"
    fontWeight: 500
    lineHeight: 1.04
  headline:
    fontFamily: "Teko, sans-serif"
    fontSize: "64px"
    fontWeight: 500
    lineHeight: 1.04
  title:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.16
  hero-body:
    fontFamily: "Inter Tight, sans-serif"
    fontSize: "18px"
    fontWeight: 500
    lineHeight: 1.55
  navigation:
    fontFamily: "Inter Tight, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.5
  caption:
    fontFamily: "Inter Tight, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  body-large:
    fontFamily: "Inter Tight, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "29px"
  body:
    fontFamily: "Inter Tight, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter Tight, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.25
  admin-title:
    fontFamily: "Teko"
    fontSize: "53px"
    fontWeight: 500
    lineHeight: 1
  admin-body:
    fontFamily: "Inter Tight"
    fontSize: "16px"
    fontWeight: 400
  admin-summary:
    fontFamily: "Inter Tight"
    fontSize: "28px"
    fontWeight: 600
  admin-desktop-summary:
    fontFamily: "Inter Tight"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  mobile-control: "12px"
  mobile-panel: "16px"
  mobile-sheet: "24px"
  compact: "4px"
  enquiry: "8px"
spacing:
  mobile-inset: "20px"
  admin-desktop-inset: "40px"
  step-1: "8px"
  step-2: "16px"
  step-3: "24px"
  step-4: "32px"
  step-6: "48px"
  step-8: "64px"
components:
  mobile-button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.mobile-control}"
    height: "52px"
  mobile-plan:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.cream}"
    rounded: "{rounded.mobile-panel}"
  mobile-review:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.cream}"
    rounded: "{rounded.mobile-panel}"
  mobile-tabs:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    height: "96px"
  mobile-tab-selected:
    textColor: "{colors.gold}"
    typography: "{typography.mobile-tab}"
  mobile-enquiry-sheet:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.compact}"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.compact}"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.compact}"
    height: "56px"
  membership-card:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.compact}"
  review-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.cream}"
    rounded: "{rounded.compact}"
  enquiry-panel:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.enquiry}"
---

# Design System: New Gold Gym 2.0

## Overview

**Creative North Star: "Train with purpose."**

The finished identity pairs forceful condensed headlines with calm, readable supporting copy. Charcoal fields frame the supplied artwork and real interior photographs; gold marks actions, prices, ratings, and the selected destination. The mobile expression is compact, with softly rounded panels and persistent navigation.

This records the shipped public website in `src/components/public-website.tsx`, its CSS module and `src/app/globals.css`, checked against the native Penpot references and finished captures in `.impeccable/review/public/`. Mobile and desktop main headings use Teko; prices use Barlow Condensed; supporting text uses Inter Tight. All fonts and optimized WebP image derivatives are served locally. Native artifact identifiers and design history remain in [PRODUCT.md](PRODUCT.md).

**Key Characteristics:**

- Compact condensed titles with plain sentence-case supporting text.
- Flat charcoal surfaces, restrained gold, and readable cream text.
- Real gym imagery, comparable plan panels, and persistent mobile tabs.

## Colors

Warm gold and cream temper green-leaning charcoal neutrals. The original seven palette primitives remain intact; the native inactive-star color has a scoped rating role.

### Primary

- **Gold:** primary actions, selected mobile tabs, membership prices, filled rating stars, logo accents and the admission divider.

### Neutral

- **Ink:** main backgrounds, desktop dark cards and text on cream.
- **Cream:** prominent text on dark, enquiry sheets and desktop light sections.
- **Muted:** supporting copy and inactive mobile navigation on dark.
- **Dark:** deepest neutral and the basis of the translucent dialog scrim.
- **Surface:** mobile plan/review panels, contact shortcut and bottom navigation; desktop reviews.
- **Line:** restrained dividers and scrollbar thumb.
- **Rating empty:** inactive rating stars only; preserve the explicit numeric rating alongside stars.

**The Readable Gold Rule.** Use gold with ink and cream text on dark. Use ink for body text on cream; gold on cream is reserved for non-text details.

## Typography

**Mobile and Desktop Heading Font:** Teko, medium. **Price Font:** Barlow Condensed, bold. **Body and Label Font:** Inter Tight, regular/medium/semibold. All use sans-serif fallback and self-hosted WOFF2 files.

Mobile main titles use the mobile-title role with a deliberately tight line box. Below 360px they reduce to 48px with a 0.95 line-height. Body explanations generally use the body role; review quotations use 1.45 line-height. Labels are sentence case, with smaller 12px bottom-tab labels. Prices share Barlow Condensed across both layouts, using 36px amounts in mobile plan panels and the larger title-sized amount in desktop cards. Sheet prices use a local intermediate size.

Desktop hero descriptions use the medium-weight hero-body role. Desktop header and footer links use the navigation role; the hero image caption uses the readable caption role. Primary and secondary button labels use the semibold label role at both mobile and desktop sizes.

Desktop hero and major sections use Teko 500 in the display/headline roles, with smaller 56px headings for about/gallery. At 1024–1279px the hero reduces to 80px and the section hierarchy to 56/48px. These are observed responsive steps, not a mathematical ratio. Admin typography below retains its separate scope and native design provenance.

**The Scoped Condensed Type Rule.** Use Teko for mobile and desktop main headings, Barlow Condensed for membership prices, and Inter Tight for body explanations and control labels.

## Layout

The implemented responsive boundary is 1024px. Below it, four hash-addressable destinations share a compact header and fixed bottom navigation. Mobile content has the mobile inset, a maximum width of 640px and bottom clearance for the navigation. The bar uses 64px targets, 8px top space and a bottom safe area of at least 24px. Content can scroll on small viewports and with enlarged text. Below 360px the paired rating-only cards stack; tablet image previews expand between 641px and 1023px.

At and above the boundary, the long desktop homepage uses a centered container capped at 1280px with fluid outer gutters, split hero, asymmetric gallery, three plan columns and two review columns. Section spacing repeatedly uses 24/32/48/64px steps. Header navigation is centered between brand and action; footer navigation occupies the native center band. Desktop cream and charcoal sections alternate. Page strategy stays in `.impeccable/surfaces/src-app-page-tsx.md`.

**The Whole Artwork Rule.** Preserve the supplied hero image at its full 2:1 ratio and place interface copy outside it. Gallery previews may crop; photo viewers preserve each complete image.

## Elevation & Depth

The system is flat and opaque: tonal fields, panel fills, thin dividers and image boundaries establish hierarchy without shadows or blur. Dialogs form a separate layer over a dark translucent scrim. The selected mobile icon uses a subtle gold tonal backing. These state treatments do not establish translucent surface materials.

## Shapes

Mobile actions use the control radius, plan/review cards use the panel radius, and sheets use the sheet radius on top corners with square bottom corners. Desktop actions and cards use compact corners; centered desktop dialogs and photo viewers use the enquiry radius. The supplied vector brand and interface icons retain their original silhouettes.

## Components

### Buttons

Gold actions carry ink Inter Tight semibold labels. Primary and secondary buttons share the 16px/600 label role. Mobile primary actions have a minimum height of 52px; desktop actions have a minimum height of 56px. Contact, dismiss and navigation targets remain at least 44px. Fine-pointer hover changes the primary to cream; on cream sheets it changes to ink with cream text. Secondary desktop actions use a cream outline. Visible focus uses a 2px outline offset by 4px, with ink or cream substituted where the background requires it. Pressed controls scale subtly; reduced motion removes that scale.

### Cards / Containers

Whole mobile membership panels open a plan-specific enquiry sheet. They share a surface fill, cream name, gold price and muted description. Desktop plans are ink cards on cream, with aligned actions. The one-time admission fee remains visually separate from monthly prices. Reviews retain the supplied attribution and quotation; rating-only entries remain explicit and never receive invented prose. Rating stars are vector icons accompanied by numeric ratings.

### Navigation

Discover, Gym, Plans and Reviews are native anchors with hash state, browser history, refresh and responsive-resize continuity. Gold labels and a tonal icon backing identify the selected mobile destination. The changing pane crossfades over 120ms; reduced motion makes the tab change static. Desktop links scroll to the corresponding homepage sections. A skip link appears on keyboard focus, and mobile destination changes focus the new heading.

### Enquiry sheets and photo viewers

Selected-plan sheets retain the plan name, monthly price, description and separate admission fee; the WhatsApp action opens an encoded draft for the configured phone. Contact sheets retain the same action and the unconfirmed location/hours copy. Native `dialog` supplies modality; explicit Tab wrapping, initial dismiss-button focus, Escape/backdrop/Close/Done dismissal, focus restoration and background scroll lock complete the keyboard behavior.

Mobile sheets open with a shared non-bouncy spring and support downward drag dismissal from the handle. Short drags spring back; desktop and reduced-motion modes disable dragging. Reduced motion uses short fade/static alternatives instead of travel. Desktop dialogs are centered with bounded height; mobile sheets scroll within the viewport. Photo viewers use `object-fit: contain` so the complete photograph remains visible, with an accessible close action and caption.

The sidecar previews translate shipped CSS into self-contained snippets; font files must be available in the preview environment. They demonstrate visual primitives and do not reproduce the application's dialog or navigation runtime. Historical Penpot inventory counts describe native design assets, not new code registrations.

## Do's and Don'ts

### Do:

- **Do** preserve the supplied vector logo and the full hero artwork.
- **Do** use ink body text on cream and readable cream text on dark.
- **Do** keep touch targets at least 44px in both dimensions and preserve visible keyboard focus.
- **Do** use the scoped mobile and desktop type, inset and shape roles.
- **Do** preserve comparable membership panels, supplied reviews, and complete-aspect photo viewers.
- **Do** retain reduced-motion alternatives and dismissible, focus-managed dialogs.

### Don't:

- **Don't** use gold as body text on cream.
- **Don't** replace the supplied gym photographs with invented gym imagery.
- **Don't** turn the inactive-star color into a general muted-text color.

Not canonized: one-off image corners, local text sizes and the local desktop feature separator color are component details, not shared tokens. Placeholder address/hours are content awaiting confirmation. No craft-floor defect is promoted into the system.


## Admin — Mobile

Implementation status: the owner portal at `/admin` now implements this design in Next.js, with live forms, server validation, JSON persistence and simulated messaging. Native board counts and prototype-link audits below document the source design; they do not limit the implemented behavior.

### Overview

The delivered owner surface uses Operate mode: compact summaries, readable member rows, explicit attendance and payment labels, and persistent navigation. The 31 editable native boards include seven main destinations, supporting member and payment screens, correction/archive sheets, three reminder audience examples, recipient/result screens, and a reference containing 29 validation and recovery examples. This scope extends the existing identity; public mobile and desktop guidance above remains in force for those surfaces. Evidence is the final `admin-mobile-*.png` exports and [admin manifest](design-previews/admin-mobile-manifest.json). Content truth and implementation acceptance rules remain in [PRODUCT.md](PRODUCT.md) and [admin rules](design-previews/admin-mobile-rules.md).

### Colors

Admin reuses the seven existing palette primitives. Ink is the screen ground; surface fills distinguish panels, fields, and bottom navigation. Cream carries primary text, muted carries secondary information, line separates rows, and gold identifies primary actions, selected filters/tabs, attendance marks, and chart emphasis. Dark remains the deepest incumbent neutral. No new library colors were registered.

**The Labeled State Rule.** Keep meaning visible alongside color: paid/unpaid/overdue, present/not marked, sent/failed/skipped, exclusion reasons, and numeric chart values are explicit text.

### Typography

All 31 root-board H1 headings use `admin-title`: **Teko**, as directly overridden in the finished native artifact and verified by the manifest. This replaces the earlier Barlow Condensed admin title treatment. The public website retains the shipped scoped hierarchy recorded above; this historical admin title override does not change it. Child section titles remain Inter Tight at the observed local sizes (16/18/24px); the root title override does not apply to them.

Supporting copy and numerical data use **Inter Tight**, with regular, medium, and semibold weights (400/500/600). Main data is readable at (14–16px), secondary information at (12–13px); summary numbers use `admin-summary`. Frontmatter admin roles are extracted recurring treatments, not newly registered native typography styles or library tokens. The existing eight library typography styles and 17 tokens remain unchanged; no fallback family is established here.

**The Root Title Rule.** Use the admin Teko role for root H1s and retain Inter Tight for data, forms, labels, and child headings. Allow a long H1 to wrap and move the supporting content below it; Archived members demonstrates the two-line treatment without shrinking the title.

### Layout

Main and supporting screens use the portrait reference size (390×844px) and inherited screen inset. Vertically stacked panels, fields, and divider-separated rows keep the hierarchy compact. The five-tab bottom bar on main destinations retains its height (96px), top space (8px), target height (64px), and bottom safe area (24px). Supporting flows use back/cancel controls rather than requiring persistent tabs on every board. All wired targets meet the minimum (44×44px).

Correction and confirmation overlays have a shared width (390px) and content-specific heights (520/400/360px). The state reference is a separate presentation board (1894×1424px), not an application viewport. Board dimensions do not establish responsive breakpoints or a desktop admin layout.

### Elevation & Depth

Flat tonal layering continues the public identity: surface panels on ink, thin row dividers, and a muted gold backing for the selected tab icon. Overlays provide contextual confirmation/correction layers. No new admin shadow vocabulary or shared motion system is established by these examples.

### Shapes

Admin reuses the mobile control and panel radius tokens, with softly rounded fields, actions, cards, and grouped controls. The supplied vector brand and vector interface icons remain editable native artwork. Circular present marks and outlined absent marks belong to the scoped calendar data treatment; upcoming dates remain unfilled and labeled.

### Components

**Header and navigation.** Main boards carry the existing vector brand and Owner badge. Five labeled tabs select Overview, Attendance, Members, Payments, or Analytics. Member detail and inactive lists stay under Members. Supporting boards use a back target next to the root heading and explicit return/cancel actions.

**Summaries and lists.** Compact panels pair prominent counts with explanatory labels. Rows separate identity/ID from status, amounts, dates, and attendance through alignment and thin dividers. Member and payment lists have visible paging. Archived-member cards keep the outstanding balance and history context visible alongside a restore action.

**Forms and controls.** Surface-filled fields carry persistent labels, required marks, and adjacent helper text. Add/Edit Member covers name, unique ID, international phone, joining date, and monthly fee; fee-reminder permission is a separate labeled checkbox. Opening unpaid-date and renewal context remain explicit. Record Payment pairs the selected fee period with amount, actual payment date, and remaining balance. Gold primary actions and quieter surface secondary actions share the inherited control shape.

**Correction and recovery.** Payment and attendance correction sheets show context, reason/confirmation, and cancel actions. Voided payment history remains distinguishable from a new receipt. The reference includes 29 designed examples spanning validation, saving/failure, concurrency, empty/search results, partial/older balances, month-end renewal, archive, long names, duplicate attendance, and Undo. These native states are design references; the application implements their validation, correction and JSON persistence behavior.

**Reminder audiences and results.** Members exposes a labeled Send WhatsApp reminders action. Audience screens distinguish Within 3 days, Within 7 days, and All overdue, with date ranges and total/ready/excluded counts. Recipient review shows exclusions and reasons; results separate sent, failed, and skipped, with a failed-only retry action. Sent remains explicitly separate from delivered. The historical prototype illustrates overlap, permission checks, queued-payment skips and duplicate protection without sending messages. The running application enforces these rules in its simulated reminder queue.

**Charts and calendar.** Rankings use labeled horizontal bars, including a labeled zero with an empty track. Weekday averages retain numeric labels above all seven columns. The profile calendar has a Present/Absent legend and identifies the upcoming day. These synthetic values and dates are content examples rather than brand tokens.

**The Visible Quantity Rule.** Retain numeric labels for every ranking row and weekday column, including zero; distinguish audience totals, exclusions, ready recipients, and result counts instead of relying on geometry or color.

The refreshed manifest records 31 boards, 1,729 shapes, 779 text layers, and 122 navigation/overlay links, with no broken destinations, undersized targets, or root-containment violations. Existing fills and radius tokens were reused; no native admin library components, colors, typography styles, or tokens were registered. Navigation demonstrates selected example flows. In this historical native artifact, inputs, fee-period calculations, validation, receipts, retries and WhatsApp delivery are static visual examples. The running application now implements forms, calculations, validation, receipt persistence and simulated retries; actual WhatsApp delivery remains unconfigured and no messages were sent.

### Do's and Don'ts

- **Do** preserve the incumbent palette, vector brand, mobile inset, control/panel shapes, and minimum target size.
- **Do** use the scoped Teko root title and Inter Tight data hierarchy; let long root titles wrap with space below.
- **Do** retain field labels, helper text, explicit date/period context, status labels, legends, exclusion reasons, and distinct result categories.
- **Don't** infer a working database, fee engine, live validation, messaging delivery, desktop layout, or newly registered library components from the editable prototype.

Not canonized: synthetic people, phones, fees, dates, receipts, chart values and message outcomes; one-off chart geometry; and business acceptance rules are not universal visual tokens. The sample fee does not revise public membership pricing. The independent final review disposition is SHIP, with no material fixes remaining; no craft-floor defect is promoted into this system.


## Admin — Desktop

Implementation status: the owner portal adapts the same records and workflows at 1024px and above, with a 232px sidebar, 80px header, paired forms/panels, aligned tables and 640px dialogs. Single-owner login and data APIs operate on both layouts. The native artifact inventory below remains source-design evidence.

### Overview

The desktop owner workspace extends the Admin — Mobile identity in Operate mode. Persistent navigation, aligned tables and paired task/detail panels use the wider canvas to keep member identity, dates, balances and actions visible together. The native delivery contains 47 root boards: 32 application screens, 14 dialogs and one reference with 29 recovery examples. Existing mobile admin and public website designs remain intact.

Historical native design evidence is the finished **Admin — Desktop** Penpot page, the [desktop manifest](design-previews/admin-desktop-manifest.json), and 17 final `admin-desktop-*.png` exports. The [contact sheet](design-previews/admin-desktop-contact-sheet.jpg) provides an index. These are editable native designs and selected prototype paths; they do not establish an implemented website.

### Colors

The desktop workspace retains the same seven palette primitives. Dark grounds the sidebar; ink grounds the workspace and fields. Surface distinguishes panels and quieter controls, cream carries primary information, muted carries supporting labels, and line separates rows. Gold identifies primary actions, active navigation/filter labels, attendance marks and chart quantities. The existing Labeled State and Visible Quantity rules apply: status words, exclusion reasons, numeric values and legends remain explicit.

### Typography

Every desktop root H1 retains `admin-title`. Inter Tight carries supporting copy, controls and data in regular, medium and semibold weights (400/500/600). Common body and table text uses (14–16px), supporting labels/helpers use (12–13px), and recurring child headings use (20px). Desktop numerical summaries use the scoped `admin-desktop-summary` treatment. This documents a recurring native treatment; it does not register a new Penpot library style or change the mobile `admin-summary` role.

**The Scoped Type Rule.** Retain the shared admin root title and Inter Tight data hierarchy; use the desktop summary role only in desktop numerical summaries. The public website and mobile summary ramps keep their existing scopes.

### Layout

Application boards use the desktop reference size (1440×1000px). A persistent sidebar (232px) and top header (80px) frame the workspace. Main content begins at x272 and ends at x1400, giving the measured desktop content inset on both sides of the area beside the sidebar. Paired panels commonly have a gap (24px). These are delivered board dimensions and recurring layout measurements, not responsive breakpoints.

Attendance places entry beside the daily register. Member and payment directories expose wider, aligned columns and visible paging. Profiles place member details beside the attendance calendar; analytics places rankings beside weekday averages; member forms use two columns beside renewal context. Payment entry/history and reminder audience/message panels keep the relevant context alongside the task.

Focused dialogs share a width (640px), inner inset (32px) and content-specific heights. The recovery reference (1894×1424px) is a presentation board. All wired controls meet the minimum target size (44×44px).

**The Context Column Rule.** Keep the member ID, fee period, date or audience context visible with its associated action. Wider tables and paired panels serve this relationship rather than spreading a mobile row across the canvas.

### Elevation & Depth

Flat tonal layering continues the incumbent system. Surface panels on ink, a deeper sidebar and thin row rules provide separation. Centered dialogs add a contextual overlay layer. No new shadow vocabulary is established.

### Shapes

Desktop admin reuses the softer control and panel language: controls/fields use the mobile control radius, panels use the mobile panel radius, and dialogs use the existing larger radius (24px). Actions commonly have a height (44px). These scoped admin shapes do not replace the retained public desktop website's compact controls. The native vector brand and interface icons remain editable artwork.

### Components

**Workspace shell.** Five primary destinations—Overview, Attendance, Members, Payments and Analytics—sit above supporting Inactive members, Archived members and Fee reminders links. Active labels use gold on a surface backing. The top header retains date and Owner context; supporting screens keep explicit back/cancel actions.

**Tables and summaries.** Identity, ID, phone, joining date, attendance, period, amount, status and action occupy aligned columns appropriate to the destination. Dividers separate rows; paging remains visible. Summary quantities retain explanatory labels rather than relying on shape or color.

**Forms and correction dialogs.** Fields retain persistent labels, required marks, adjacent helper copy and explicit date/period context. Fee-reminder permission remains a separate checkbox. Payment and attendance correction dialogs show the affected member and record; voided receipts remain distinguishable in history. Archive/restore and unsaved-edit dialogs keep their consequences and return actions visible.

**Reminder review.** Audience screens pair matching/ready/excluded totals with a personalised message. Recipient tables expose inclusion/exclusion reasons. Results distinguish sent, failed and skipped; failed-only retry keeps the selected audience context. These are static examples, not message delivery.

**Charts, calendar and recovery.** Ranked bars and weekday columns retain numeric labels, including zero. The attendance calendar preserves Present/Absent and upcoming-date treatments. The recovery board records 29 validation, empty, saving, failure, correction and Undo examples without creating a new shared state or focus system.

Selected native navigation dissolves (120ms, ease-out); overlays dissolve (160ms, ease-out). These prototype values are scoped evidence, not a complete application motion or reduced-motion specification.

The native structural audit records 3,994 shapes, 1,784 text layers and 359 links, with zero broken destinations, undersized wired controls or root containment violations. Library inventory remains 38 components, seven colors, eight typography styles and 17 tokens; desktop adds no native library registrations. The independent review covered 13 exported views plus the structural manifest. Its one copy-formatting finding affected five layers; all five corrected recaptures were confirmed resolved without visible regression. The final **SHIP** disposition applies to that requested correction, not an independent visual review of all 47 boards.

### Do's and Don'ts

- **Do** preserve the incumbent palette, vector artwork, scoped admin type and explicit status/quantity labels.
- **Do** retain aligned identity/ID columns, visible paging, field labels and adjacent task context.
- **Do** keep controls large enough for the recorded minimum target and keep back/cancel actions visible.
- **Don't** promote desktop board dimensions into responsive breakpoints or replace mobile/public typography and geometry with desktop admin values.
- **Don't** infer live forms, validation, balances, receipts, retries or WhatsApp delivery from the prototype.

Not canonized: synthetic people, fees, dates, attendance values and message outcomes; one-off chart/table geometry; and future business acceptance rules. The corrected literal-backslash-n copy defect is not a system treatment. No new native tokens, library components, hover/focus vocabulary or shared motion system is inferred from these examples.

## Admin — Shipped Application

### Overview

The shipped interface retains the approved palette, vector brand, Teko 53px/500 root and dialog titles, Inter Tight data and flat surfaces. Mobile main destinations retain five tabs; entry and reminder flows use focused back/cancel navigation. The desktop Members toolbar preserves secondary reminders and gold Add member, with search and activity/archive controls in two rows. Member forms pair name/ID, phone/fee and joining/opening dates on desktop, with a narrower renewal-context panel.

Mobile directories and payments page four records; desktop pages six. Mobile analytics shows six ranked members before the seven weekday quantities, with further-ranking pagination below the chart. Inactive rows retain the last visit, days away and visits this month; the thresholds remain explicit. Reminder lists mask phones, messages include opt-out copy, and the simulation disclosure remains visible throughout. Native date, month and time inputs, adjacent validation, empty states, protected edits, accessible confirmation dialogs and notifications extend the static prototype into working flows.

The implementation evidence is `src/app/admin`, `src/components/admin/admin.module.css`, the adjacent TSX screens and `src/lib/admin`; the direction is [Owner administration](.impeccable/surfaces/src-app-admin.md). Native inventories above remain historical evidence. The running single-owner portal has login, server validation, JSON persistence and simulated reminder processing; it has no remote database or real messaging connection. Runtime and storage recovery instructions remain in [README.md](README.md).

Final evidence is the five contact sheets and individual production captures in [.impeccable/review/admin](.impeccable/review/admin/), covering widths (390/1440/1024/768/320px). The [validation record](.impeccable/review/admin/validation.md) reports 39 passing tests, lint, typecheck and production build, with 46 valid captures. The independent [verdict](.impeccable/review/admin/verdict.md) is SHIP for the eight scored fixes only; it does not certify every surface or every behavior.

### Colors

The shipped admin retains the incumbent seven-color palette and supplied vector branding. Gold indicates actions, selected filters, values and field errors; cream carries primary content, muted carries secondary context, and line separates records. Ink fields sit inside surface panels on desktop; mobile fields commonly use surface on ink. Error meaning is conveyed by adjacent text and invalid state, not color alone. No new palette is established.

### Typography

Root headings, login H1 and correction/confirmation dialog titles share `admin-title` (53px/500, line-height 1) with a sans-serif fallback in code. Inter Tight carries UI and tabular numerical data. Child headings use (18px) on mobile and commonly (20px) on desktop; smaller section headings use (16px). Body/control text is generally (14px), field labels (14px), secondary text (12–13px), and mobile tab labels (11px; 10px below 360px). The existing mobile and desktop summary roles remain scoped to their respective layouts.

**The Admin Title Continuity Rule.** Root pages and task dialogs keep the same Teko title role; dialog H2s override the smaller section-heading treatment. Let long titles wrap while preserving their relationship to context and actions.

### Layout

Below (1024px), main destinations retain the five-tab shell with an (80px) header, (20px) horizontal inset and safe-area navigation. Main content reserves (124px) bottom clearance. Focused member/payment entry and reminder flows use back/cancel navigation, omit the mobile header and tabs, and reserve (32px) bottom space. Between (600–1023px), content is capped at (760px). Below (360px), the inset tightens to (16px).

At (1024px) and above, the (232px) sidebar and (80px) header frame content with the existing desktop inset. Paired panels use (24px) gaps; main content caps at (1600px). At (1024–1279px), insets reduce to (24px), panels and table columns tighten, and the Members toolbar wraps without clipping. At wider widths, search, secondary reminders and primary Add member occupy the first toolbar row; activity filters and archive access occupy the second. Desktop member form fields pair Name/ID, Phone/Fee, Joined/First unpaid beside a narrower renewal-context panel; Back to members remains at the top. Overview places Add attendance at the upper-right above the contextual panel.

Directories and payments page four rows on mobile and six on desktop; recipient review pages four rows on mobile. Analytics pages six rankings on both layouts, followed by all seven weekday values on mobile; its pager follows the mobile chart. Archived members remains accessible in the mobile directory paging zone. These are scoped density rules, not a general limit for every register.

**The Focused Task Rule.** Mobile entry and reminder review give the task its own back/cancel path; desktop keeps the workspace context. Preserve the simulation disclosure and message preview in the focused reminder sequence.

### Elevation & Depth

Resting surfaces remain flat, separated by tone and thin dividers. Dialogs use a black translucent backdrop (`rgb(0 0 0 / .68)`); only transient cream-on-ink text notifications use the observed soft shadow (`0 8px 24px rgb(0 0 0 / .2)`). This notification treatment does not establish a raised-card style. Dialog entry uses (160ms ease-out) from a (16px) vertical offset and .7 opacity, with animation removed under reduced motion. Historical prototype dissolves above are separate evidence.

### Shapes

Controls and fields retain the existing control radius (12px), panels the panel radius (16px), and dialogs the sheet radius (24px). Fields generally have a minimum height (48px); action targets retain at least (44px). Mobile primary actions have a minimum height (50px), desktop (44px). Dialogs have a maximum width (640px): bottom sheets on phones, inset sheets from 600px, centered at desktop with (32px) padding and a viewport-constrained scroll area. Their height follows content rather than historical fixed board heights.

### Components

**Owner login.** The existing vector brand leads a single labeled username/password form, clear error text, a busy Log in action and a return link to the public website. The panel is capped at (390px) on mobile and (430px) with surface backing and panel corners on desktop. Login is implemented owner access; the layout does not imply multiple roles.

**Fields and recovery.** Persistent labels and helper/error copy remain adjacent to their fields. Invalid fields gain a gold border; field focus uses a (2px) gold outline offset by (2px). Busy actions disable repeated submission and use state copy; disabled app buttons use .55 opacity. Form-level failures retain visible context and recovery actions. Concurrency and connection/storage failures preserve the entered work for review or retry; empty lists explain the next action. Confirmation dialogs retain member/date/receipt context, close/cancel controls, native focus containment, Escape dismissal and focus restoration. Unsaved changes require an explicit choice before leaving. Notifications offer dismissal and Undo where appropriate, above the mobile tabs or at the lower-right on desktop.

**Status, calendar and charts.** Retain the Labeled State, Visible Quantity and Context Column rules. Inactive rows show last visit, days away and monthly visits alongside the explicit activity thresholds, with new members without visits kept distinct. Ranking and weekday quantities remain readable, including zero; calendar legends distinguish present, absent and upcoming dates.

**Reminder simulation.** Audience and recipient views visibly disclose simulation. List phone numbers remain masked; personalised message previews retain member ID, due date, balance and Reply STOP opt-out copy. Results distinguish simulated sent, failed and skipped states; sent does not mean delivered. Retry remains limited to failures. These are implemented record/recovery flows, with JSON persistence rather than an external messaging service.

### Do's and Don'ts

- **Do** preserve the incumbent palette and vector brand, shared admin root/dialog title role and Inter Tight data hierarchy.
- **Do** retain the approved toolbar order, desktop field pairs, compact paging and labeled quantities across responsive layouts.
- **Do** keep member/date/balance context, adjacent validation, visible focus, cancel/recovery controls and simulation disclosure with the affected action.
- **Don't** substitute historical board dimensions or prototype transitions for the implemented responsive layout and reduced-motion behavior.
- **Don't** describe local JSON persistence as a remote database or simulated reminder results as real message delivery.

Not canonized: fictional records, monetary examples, chart values, dates, message outcomes, one-off chart geometry and advisory detector mismatches are not reusable visual rules. QA screenshots are evidence, not shipping raster assets; no raster assets were created. No craft-floor defect is promoted into this system.
