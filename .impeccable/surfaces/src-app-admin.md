# Owner administration

Target: `src/app/admin`; related: `src/components/admin`, `src/lib/admin`.
Mode: Operate. Audience: the gym owner on a phone at the reception desk, then desktop.

## Direction contract

THESIS: A readable digital register; every action retains its member, date and balance context.

OWN-WORLD: Inherit the approved Penpot Admin Mobile and Desktop boards: charcoal, gold, cream, native vector brand, Teko 53px/500 titles, Inter Tight data, soft controls and flat surfaces.

STORY: The owner checks today's register, records attendance and fees, manages members and reviews simulated reminder batches.

FIRST VIEWPORT: At 390×844, logo/Demo header, Overview title, member and attendance/fee summaries, Add attendance, inactive-member shortcut and five safe-area tabs. Overview has no recent attendance section. At 1440×1000, 232px sidebar, 80px header, summaries across and contextual panels.

FORM: Exact approved Penpot composition, implemented code-first; no concept seed applies to this specified design.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance


## Mobile navigation — November 3, 2026

The persistent bottom bar is Overview, Attendance, Members, Payments and More, including on member forms, payment entry and reminder screens. More is a full page at `/admin/#/more` with Analytics, Fee reminders, Inactive members and Archived members in that order. All four supporting sections select More; member and payment details select their respective daily section. Desktop keeps its original sidebar.

Labeled return links preserve the originating route, filters, pagination and scroll through browser history state, separately from demo records. Editing returns through the member profile; successful payment entry opens payment details with its original register context. Direct entries use canonical parent fallbacks. Unsaved changes are protected for tabs, return links, Cancel and browser history, with Keep editing and Discard changes choices.

## Apple-inspired polish — November 3, 2026

Retain the gym identity and operational layouts. Desktop top chrome is sticky; top/bottom bars and Demo menu have restrained frosted materials with opaque accessibility fallbacks. Forms/data panels remain solid. Shared fields, spacing, fine-pointer hover, press feedback and table hierarchy are consistent; mobile payment dates and actions use separate grid cells. Admin dialog motion is reversible and non-bouncy, with immediate release of native modality on dismissal and an inert visual exit. Focus indicators remain on controls rather than outlining the entire main region. Evidence: `.impeccable/review/admin-apple/`.
