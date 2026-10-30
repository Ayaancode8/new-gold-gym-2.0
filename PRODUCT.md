# New Gold Gym 2.0

This project contains the public New Gold Gym 2.0 website and the owner admin portal implemented from the approved Penpot designs. Prospective members can see the gym, compare memberships, read supplied reviews and prepare a WhatsApp enquiry. The public visitor mode is Persuade; the admin mode is Operate. The admin portal at `/admin/` is a public browser demo with fictional records saved in localStorage and a confirmed reset control. WhatsApp reminders are explicitly simulated. The application exports to static files for Cloudflare Pages; no remote database is required.

## Confirmed content

- Prices are PKR per month: Basic 1,500; Trainer Basic 5,000; Trainer Advanced 10,000. Both trainer plans include gym access.
- Admission costs PKR 1,000 once, separate from monthly membership.
- Basic membership has no trainer and allows flexible attendance. Do not interpret this as 24/7 opening.
- The poster's 24/7 opening-hours statement is outdated. It is excluded from the website design.
- WhatsApp enquiries use `+92 333 1267175` (`https://wa.me/923331267175`). The encoded draft preserves the selected plan, monthly price and separate admission fee. Sending remains the visitor’s action in WhatsApp. Address remains `Address to be confirmed`; hours remain `Contact us for current timings.`
- Ayaan Afridi, 5/5: “Good environment and professional trainers....new gold gym is much more better than the old one really satisfied do join 👍🏻 …”
- T.A Bhatti, 3/5: “Well equipped, Properly managed but very crowded in evening hours”
- Niaz Ahmed, 5/5, and Kabir Khan, 4/5: rating-only entries, with no invented review text.
- Do not add trainer credentials, session counts, dietary services, popularity labels, or membership statistics without confirmation.

## Approved design

Use the supplied SVG logo, the original seven-color charcoal/gold/cream palette, Teko mobile and desktop main headings, Barlow Condensed prices, and Inter Tight body/labels. The native inactive-star color is scoped to ratings. Keep the complete original hero artwork in its 2:1 ratio with website copy outside the image. Reuse all three supplied interior photographs, served as optimized local WebP derivatives; photo viewers preserve the complete image. Fonts are self-hosted.

Desktop hero descriptions use Inter Tight 500 at 18px with 1.55 line-height. Desktop header/footer navigation uses Inter Tight 500 at 16px; primary and secondary buttons use Inter Tight 600 at 16px. The hero image caption uses Inter Tight 400 at 15px with 1.5 line-height.

Below 1024px, Discover, Gym, Plans and Reviews are four focused destinations with persistent bottom tabs and header contact. Hash links support direct entry, browser history, refresh and resizing. Mobile main titles use Teko 53px/500 in a 48px line box, with a smaller treatment below 360px. Mobile retains 20px insets, 16px panel corners, 12px control corners and 24px sheet top corners. At 1024px and above, desktop main headings use the same Teko 500 face as mobile, at the existing desktop display sizes. The long desktop homepage retains the split hero, asymmetric gallery, comparable plans and reviews, with compact 4px controls/cards and centered 8px dialogs.

Plan/contact sheets and complete-image photo viewers are accessible native dialogs with Tab wrapping, focus restoration, Escape/backdrop/Close/Done dismissal and scroll lock. Mobile sheets implement drag dismissal and cancellation; reduced-motion alternatives avoid travel and disable dragging. Tab changes crossfade over 120ms. Shared non-bouncy springs govern sheet movement. No enquiry message is sent automatically.

Implementation sources are `src/components/public-website.tsx`, its CSS module, `src/app/globals.css`, `src/data/gym.ts` and `src/lib/motion.ts`. The finished captures, quality bar, review and validation evidence are in `.impeccable/review/public/`. The recorded validation run passed 17 meaningful Playwright tests, lint, typecheck and production build; after the footer-only alignment correction, the production build, lint, typecheck, raster provenance scan, all 13 review captures and the targeted desktop Playwright test passed again. The full 17-test pass remains the earlier behavioral validation.

## Penpot artifact and design history

- Connected file ID: `61fd668e-ca9f-8100-8008-dcc8d00fd746` (original file name: New File 12).
- Desktop page: `61fd668e-ca9f-8100-8008-dcc8d00fd747`; homepage board: `bd493c6e-9966-8077-8008-dcd382183401`.
- Current Mobile page: `bd493c6e-9966-8077-8008-dcdb64774c50`.
- Discover: `bd493c6e-9966-8077-8008-dcddca0a26dc`; Gym: `bd493c6e-9966-8077-8008-dcddf2df200b`; Plans: `bd493c6e-9966-8077-8008-dcde3fff79bd`; Reviews: `bd493c6e-9966-8077-8008-dcde6161bf7e`.
- Mobile — Previous page: `bd493c6e-9966-8077-8008-dcd102101507`; original long-page board: `bd493c6e-9966-8077-8008-dcd464c6f8e9`.
- Research page: `bd493c6e-9966-8077-8008-dcd1020816a4`.
- Components page: `bd493c6e-9966-8077-8008-dcd102124d4a`.
- Editable native elements, image fills, 38 reusable components, 7 library colors, 8 typography styles, and 17 tokens are saved in the file.
- Historical native prototype evidence: the mobile prototype has 35 wired actions: cross-tab navigation, header contact shortcuts, photo viewers, selected-plan sheets, and dismiss controls. All targets are at least 44px in both dimensions. Tab changes dissolve over 120ms; bottom sheets slide up over 240ms. Those native transition timings and gesture annotations describe the design prototype; implemented website behavior is recorded above.
- Desktop and the previous mobile design retain their original menu/enquiry overlays and annotated section-scroll targets. The current mobile design uses actual screen navigation.
- Current mobile previews use the `design-previews/mobile-app-` prefix. Previous website previews remain available. The public website is now implemented. A native app build and deployment remain outside this delivery. The implemented admin application is documented below.

## Owner admin design — October 30, 2026

The owner surface is on **Admin — Mobile** (`4898fb4f-5a75-803a-8008-de1754a1ad81`) in the same connected Penpot file. Seven main 390×844 screens cover Overview, Attendance, Members, Payments, Analytics, Member Profile and Inactive Members. Supporting boards add member entry/editing, payment recording and correction, archive/history, three reminder audiences, recipient lists, result examples and a 29-state validation/recovery reference. There are 31 native boards in total. Public website designs are retained.

All admin H1 headings use **Teko, 53px, weight 500**, per the latest user instruction. Body text and data use Inter Tight. The existing seven-color palette, vector logo and mobile control/panel language remain in use. Public website typography is unchanged.

Members has a labeled Add Member action and WhatsApp reminder action. Member entry requires a unique ID, name, phone with country code, joining date and monthly fee. Fee-reminder permission is recorded separately. Joining date anchors monthly renewal; a first unpaid date supports existing members. Short months clamp to their last day without changing the original renewal day. Fee status derives from the balance for each fee period and recorded payments, not from joining date or attendance alone. Overdue starts after the local due date passes. Correction voids mistaken payments while keeping their history; partial payments and older unpaid fees remain visible.

The owner chooses **Within 3 days**, **Within 7 days**, or **All overdue** for WhatsApp reminders. The first two include today, exclude already-overdue members, and use the earliest unpaid fee date. On October 30 the windows are Oct 30–Nov 2 and Oct 30–Nov 6. The week group includes the 3-day group. One audience is selected per send, with duplicate protection across overlapping batches. Recipient previews expose excluded phone/permission records, and result examples distinguish sent, failed and skipped. Someone who pays while queued is skipped; retries include failures only.

All records, phones, attendance figures, fees and message results are synthetic examples anchored to October 30, 2026, Asia/Karachi. Overview remains 126 current members, 43 present, 83 not marked, 91 October fees paid and 35 unpaid, including 12 overdue. Reminder samples cover upcoming November fees too: 3-day group 28 members/26 ready; 7-day group 49/47 ready; overdue group 12/11 ready. Exclusions are explicit. Ahmed's profile has 22 visits and 8 days without a visit through Oct 30; Oct 31 is upcoming. The illustrative Rs. 3,000 fee does not change public website prices.

The native prototype has 122 navigation/overlay links. These are visual designs with selected example flows: no database, actual form submission, ledger engine or WhatsApp delivery is implemented. No real messages have been sent. Actual messaging requires a connected WhatsApp Business integration, approved templates and recipient permission. The public website contact remains a placeholder.

The overview entry board is `4898fb4f-5a75-803a-8008-de183aee58ef`. Native IDs and exports are in `design-previews/admin-mobile-manifest.json`; detailed billing, date, audience and correction rules are in `design-previews/admin-mobile-rules.md`. Preview files use the `admin-mobile-` prefix.

## Owner admin desktop design — October 30, 2026

**Admin — Desktop** (`4898fb4f-5a75-803a-8008-de3243329ea7`) extends the mobile admin feature set in the same Penpot file. Its 47 editable root boards comprise 32 application screens at 1440×1000, 14 focused dialogs and a 29-state recovery reference. Desktop uses persistent side navigation, wider member/payment tables, paired task/detail panels, two-column forms and side-by-side charts/calendar information. The incumbent palette, vector brand, Teko 53px/500 root titles and Inter Tight supporting text are retained.

The desktop entry board is `4898fb4f-5a75-803a-8008-de33da7213c6`. The [desktop manifest](design-previews/admin-desktop-manifest.json) records native board IDs, 359 prototype links, structural checks and 17 final previews; [desktop handoff rules](design-previews/admin-desktop-rules.md) retain the existing billing, attendance and reminder acceptance rules. The 31 mobile admin boards, public pages and native library inventory remain unchanged. This is an editable design with selected prototype paths; no live database, forms, fee calculations or message delivery is implemented.

## Current browser demo implementation

The complete site now uses Next.js static export. `/admin/` opens the demo directly and `/admin/login/` introduces it without requesting credentials. Hash navigation preserves new record routes, filters, direct links, refresh and browser history on static hosting.

The register starts with 126 fictional members, anchored to the current date in Asia/Karachi. Members, attendance, fee periods, receipt/void history and simulated reminders persist in this browser's localStorage. Each browser and origin has separate data. Demo → Reset demo data opens a confirmation before replacing that register with fresh sample records. Existing local server records and credentials are never imported or exported.

The established billing, attendance, correction, archive/restore, analytics and reminder rules remain active. Web Locks serialize supported-browser tab writes; revision checks reject stale submissions and submission IDs prevent duplicate saves. Storage failures keep the form available, and corrupt browser data has an explicit reset path. Reminders are simulated and no WhatsApp messages are sent.

The mobile-first design and desktop layout from 1024px are retained. A persistent demo notice explains the fictional records, browser-only saving and reset entry point. Cloudflare build settings and local preview commands are in DEPLOYMENT.md and README.md. Historical Penpot prototypes and their example values above remain design evidence.
