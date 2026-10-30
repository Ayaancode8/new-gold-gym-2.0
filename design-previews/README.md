# New Gold Gym 2.0 — Design previews

The editable design is saved in the connected Penpot file **New File 12**, with Admin — Mobile, the public Mobile app-style design, Desktop, Research, Components, and Mobile — Previous pages. File and page identifiers are recorded in [PRODUCT.md](../PRODUCT.md). The design system is documented in [DESIGN.md](../DESIGN.md).

## Owner admin — mobile

- [Admin feature reference](../ADMIN_FEATURES.md)
- [Seven main screens](admin-mobile-contact-sheet.png)
- [Members and billing controls](admin-mobile-members-billing.png)
- [Three WhatsApp audiences](admin-mobile-reminder-audiences.png)
- [Recipients and results](admin-mobile-reminder-delivery.png)
- [Validation and recovery reference](admin-mobile-admin-states.png)
- [Artifact IDs and scope](admin-mobile-manifest.json) and [billing/audience rules](admin-mobile-rules.md)

Seven main screens are supported by Add/Edit Member, fee-period payment recording, payment reversal/history, archive and attendance-correction designs, and three reminder audience branches. All admin H1s are Teko 53px/500. The Penpot page contains 31 editable boards, including a 29-state reference, with 122 simple navigation/overlay links. Forms, persistence, ledger rules, actual messaging and retries still need application implementation. Records and delivery results are synthetic samples, and no messages have been sent. Public website designs remain separate.

## Current mobile-first design

- [Four-screen overview](mobile-app-overview.png)
- [Discover](mobile-app-discover.png), [Gym](mobile-app-gym.png), [Plans](mobile-app-plans.png), and [Reviews](mobile-app-reviews.png) — each 390 × 844
- [Plan enquiry sheet](mobile-app-enquiry-sheet.png)
- [Enquiry presentation](mobile-app-enquiry-preview.png) — native Plans and sheet exports composited with a scrim; not an additional native board
- [Contact sheet](mobile-app-contact.png)
- [Mobile components](mobile-app-components.png)

The current mobile experience uses persistent bottom tabs, full-photo viewers, compact plan rows, and anchored enquiry sheets. Its 35 wired prototype actions have valid root-level destinations and 44px+ targets. All four screen exports passed containment checks; the independent mobile review found no material fixes. WhatsApp remains mocked. Drag dismissal is an implementation cue; Done and outside tap dismiss the prototype sheets.

## Final exports

- [Desktop homepage](desktop-design.png) — 1440 × 4464
- [Previous mobile website](mobile-design.png) — 390 × 6296
- [Overview](overview.png)
- [Research and decisions](research.png)
- [Components and foundations](components.png)
- [Mobile menu](mobile-menu.png)
- [Selected-plan enquiry preview](mobile-enquiry.png)

Detail crops include the desktop hero, membership section, mobile hero, reviews, and footer.

## Previous website verification

Both homepages have no detected layer containment overflow. All supplied prices and review text were checked structurally. The prototype has 27 wired actions, with valid destinations, at least 44px target dimensions, and no external messaging actions. The independent review's two requested fixes—product-context persistence and separate mobile footer hit areas—were resolved.

WhatsApp is mocked. The address and current opening hours need confirmation. Section navigation scroll targets are annotated for implementation; menu and enquiry overlays are interactive. Website code and deployment are outside this delivery.
