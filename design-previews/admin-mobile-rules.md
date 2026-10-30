# Admin rules and edge-case coverage

These are design and implementation acceptance rules, not implemented database or messaging functionality. All people, phones, counts, receipts and delivery results in the Penpot file are synthetic examples. The reference date is October 30, 2026 in Asia/Karachi.

## Members and monthly fees

- Add Member is a labeled action in Members. Name, unique member ID, international phone number, joining date and monthly fee are required. IDs remain strings so leading zeros survive. Shared family phones warn rather than merge members.
- Joining date sets the monthly renewal day. August 12 renews September 12, October 12, and so on. A 31st renewal uses the last day of a shorter month, then returns to the original 31st anchor. Do not chain renewals from the shortened date.
- Joining date alone does not prove nonpayment. Each fee period retains its charged amount and payment entries; unpaid means its remaining balance is greater than zero. Attendance does not affect whether a fee is paid.
- A due date is payable through that local calendar date. Overdue starts on the next date. Zero-fee periods are waived; changing future fees does not erase old debt or rewrite receipts.
- First unpaid fee date is an opening value when adding existing members with older joining dates. It must follow the joining-date renewal schedule. It records the opening boundary, not fabricated historical receipts. The next unpaid date on Edit Member is calculated from fee periods and receipts, not an arbitrary paid/unpaid toggle.
- Paying a later period never clears an earlier unpaid period. A partial payment leaves the remainder unpaid. Record Payment shows the selected period, outstanding amount, actual payment date and remaining balance. Reject zero, negative and over-balance receipts; future payment dates are invalid.
- Correcting a mistaken payment voids its entry and retains its reason/history. Recalculate the period balance and all summaries. Repaid fees get a new receipt rather than overwriting the voided entry. Existing unrelated payments stay intact.
- Editing a name, phone, ID, joining date or future fee must retain record identity and existing attendance/receipt history. Joining-date/fee changes preview future renewal changes; posted fee periods do not silently move.
- Archive preserves old records and outstanding debt while pausing future fees and removing the member from current-member counts and automatic reminder audiences. Historical corrections remain available. Restoring requires reviewing the next fee date.

## WhatsApp audiences

The owner chooses one audience per send. Eligibility uses the earliest unpaid due date for each current member, not an October-only paid badge.

| Audience | Date rule | October 30 example | Synthetic total / ready / excluded |
| --- | --- | --- | --- |
| Within 3 days | Today through today + 3 days, inclusive | Oct 30–Nov 2 | 28 / 26 / 2 |
| Within 7 days | Today through today + 7 days, inclusive | Oct 30–Nov 6 | 49 / 47 / 2 |
| All overdue | Earliest unpaid date is before today | Before Oct 30 | 12 / 11 / 1 |

The 3-day audience is a subset of the 7-day audience. Members already overdue are shown in Overdue rather than the upcoming groups. A member is unique by ID within a batch; overlapping 3-day and 7-day batches do not duplicate the same member/fee reminder that day. A later reminder at another lead time can be sent on a later day.

Require a valid phone and recorded fee-reminder permission. Show exclusions and reasons, and allow fixes before sending. Opt-outs, archived members and zero balances are excluded. A shared phone does not merge two member IDs or their balances.

The review shows the exact recipients, date range, count and a message personalised with name, member ID, unpaid balance and due date. Recheck payment balance and permission immediately before each send; skip members who paid while queued. Sending does not mark a fee paid. Results distinguish sent, failed and skipped; sent does not mean delivered. Retry failures only and preserve successful-send IDs to prevent duplicates.

Actual automatic delivery requires a connected WhatsApp Business integration and approved templates. Permission and template states follow the [WhatsApp Business Messaging Policy](https://whatsappbusiness.com/policy/). No messages are sent by the Penpot prototype.

## Attendance and recovery

Allow one check-in per member per local date. Search results identify the member by name and ID. Unknown IDs offer Add Member; duplicate check-ins display the existing time. Prevent future dates and dates outside the membership period. Past check-ins can be corrected without creating a second visit.

Removal needs confirmation and an Undo state, and recalculates daily/monthly counts. Calendar dates before joining and after today do not count as absent. A never-visited member becomes inactive only after eight days since joining; a new member with no visits is not immediately inactive.

The native reference board contains 29 compact state examples: duplicate ID; invalid form; duplicate attendance; unknown member; invalid date; already-paid fee; partial payment; multiple unpaid periods; amount validation; saving; save failure with preserved input; concurrent update; no members; no search results; no attendance; zero-visit chart; new member; archived member; unsaved changes; waived fee; month-end renewal; invalid/unpermitted reminder recipient; failed-only retry; missing WhatsApp setup/template; opt-out; long name; shared phone; overlapping reminder duplicate; attendance removed with Undo. Lists have visible paging and member/payment dates are explicit.

Main screens and state examples remain editable native Penpot elements. Navigation illustrates selected flows; inputs, validation, ledger updates, retries and delivery still need application implementation.

## Typography and long content

Every admin H1 is Teko 53px/500; secondary headings and body/data remain Inter Tight. Do not shrink H1s to fit a long name. List names should use a compact ellipsis treatment with the ID kept visible; full names remain available in the member profile, where wrapped headings must push subsequent content and allow scrolling. The native Archived members example demonstrates a two-line H1 with the following content repositioned.

## Verification

All 31 native exports match their dimensions. The revision has 122 valid navigation/overlay links, no wired target below 44×44px, no detected root/text-parent overflow, and 31 of 31 H1s at Teko 53px/500. Fourteen calendar/audience boundary examples were checked separately as design-rule acceptance examples; this does not verify a backend implementation. Independent visual review returned ship with no material fixes.
