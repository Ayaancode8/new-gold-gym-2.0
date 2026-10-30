# New Gold Gym Admin Features

Last updated: October 30, 2026

The admin area helps the gym owner manage members, record attendance, track monthly fees, identify members who stop visiting, and send WhatsApp fee reminders to the right people.

This document describes the feature set represented in the **Admin — Mobile** and **Admin — Desktop** designs and implemented in the owner portal at `/admin`. Member management, attendance, fee calculations and receipts persist in temporary server-side JSON. WhatsApp audience/review/results/retry flows use explicitly labeled simulations; real message delivery is not configured. Names, phone numbers, figures and message results are demonstration data. Local setup and storage recovery are documented in [README.md](README.md).

## Contents

- [Main navigation](#main-navigation)
- [Dashboard and overview](#dashboard-and-overview)
- [Members](#members)
- [Member profile](#member-profile)
- [Attendance](#attendance)
- [Monthly fees and payments](#monthly-fees-and-payments)
- [WhatsApp fee reminders](#whatsapp-fee-reminders)
- [Attendance analytics](#attendance-analytics)
- [Inactive members](#inactive-members)
- [Validation and recovery](#validation-and-recovery)
- [Information the features retain](#information-the-features-retain)
- [Mobile experience](#mobile-experience)
- [Feature verification checklist](#feature-verification-checklist)
- [Design references](#design-references)

## Main navigation

The owner moves between five main tabs:

| Tab | Main purpose |
| --- | --- |
| Overview | Check the gym's daily attendance and monthly fee position at a glance. |
| Attendance | Find a member, record a visit, and review or correct attendance. |
| Members | Add and manage members, open profiles, and start WhatsApp fee reminders. |
| Payments | Review fee periods, record payments, and correct payment mistakes. |
| Analytics | Compare member attendance and identify busy weekdays. |

Member profiles, inactive-member lists, archived members, entry forms, payment details and reminder screens open from these main areas. Supporting screens provide back or cancel actions.

## Dashboard and overview

### Summary figures

The first screen gives the owner a quick picture of the gym. The demonstration dashboard contains:

| Summary | Example | Meaning |
| --- | --- | --- |
| Total members | 126 | Current members; archived members are managed separately. |
| Present today | 43 | Unique members whose attendance has been recorded today. |
| Not marked today | 83 | Current members without a check-in today. |
| October fees paid | 91 | Members whose fee for the displayed monthly fee view is paid. |
| Fees pending | 35 | Members with unpaid fees in that view, including overdue fees. |

Overdue members are included in the unpaid count. They are not added again as a separate group when calculating totals. Attendance figures describe recorded visits, not a live count of people physically inside the gym.

### Recent attendance

The dashboard shows recent check-ins with:

- Member name.
- Unique member ID.
- Attendance status.
- Check-in time.

Date controls provide **Today**, **Yesterday**, a recent date such as **Oct 28**, and a date-selection control. These controls support reviewing the attendance history without searching through a paper register. The dashboard's daily summary cards remain explicitly labeled for today; historical attendance views must identify their selected date clearly.

### Quick actions

- **Add attendance** opens the attendance area.
- A member link opens the member's profile.
- **Review inactive members** opens the list of members who have been away for eight days or more.

## Members

### Member list

The Members tab is the central member directory. Each row shows the member's identity, attendance and fee information:

- Name and unique member ID.
- Phone number, masked in list examples.
- Joining date.
- Attendance count for the month.
- Fee status, such as Paid, Pending or Overdue.

The directory includes name/ID search, activity filters, visible paging, access to archived members, an **Add member** button and a **Send WhatsApp reminders** button.

IDs distinguish members with the same name. A shared family phone number does not merge two members or their payment records.

### Add a member

The Add Member form contains:

| Field | Required | Purpose and behavior |
| --- | --- | --- |
| Full name | Yes | Identifies the member in attendance, payments, profiles and reminders. |
| Member ID | Yes | Must be unique. Store it as text so an ID such as `0142` keeps its leading zero. |
| Monthly fee | Yes | Sets the monthly charge in rupees. A zero-fee membership is treated as fee-waived. |
| WhatsApp phone number | Yes | Includes the country code, such as `+92`, for future message delivery. |
| Joined on | Yes | Records when membership began and establishes the monthly renewal day. |
| First unpaid fee date | Yes | Identifies the opening unpaid fee period, particularly when entering an existing member. |
| Fee-reminder permission | Separate preference | Records whether the member agreed to receive WhatsApp fee reminders. It must not be assumed from the presence of a phone number. |

For a newly joining member, the first fee is due on the joining date. When entering an existing member, the owner sets the first unpaid fee date after checking their previous payments. This opening value avoids inventing historical payment receipts or charging already-settled periods again.

The form explains the renewal day and provides **Add member** and **Cancel** actions. Required information and validation problems should be shown beside the relevant fields.

### Edit a member

The Edit Member screen allows corrections to member details, including name, ID, phone, joining date, monthly fee and reminder preference.

- An ID change must still satisfy uniqueness and retain the member's existing history.
- A phone change must retain the country code and be checked before future reminders.
- The next fee date is calculated from unpaid fee periods and payment records.
- Changes to future renewal dates or fees must not silently rewrite posted charges or receipts.
- Leaving unsaved changes requires an explicit decision to keep editing or discard them.

### Archive and restore

Archiving handles a member who has left without deleting their records.

- Remove the member from current-member lists and counts.
- Pause future monthly fees.
- Exclude the member from automatic reminder audiences.
- Preserve past attendance, payment history and any outstanding balance.
- Keep historical records available for correction.

The owner sees a confirmation before archiving. An Archived Members view shows the archived profile, balance and a **Restore member** action. Restoration keeps the history and requires reviewing the next fee date before future charges resume.

Archiving is separate from inactivity. A member who has not visited recently remains a current member unless the owner archives them.

## Member profile

Opening a member displays their details in one place:

- Full name and member ID.
- Joining date.
- Monthly fee.
- Fee status.
- Next unpaid fee due date.
- Attendance for the displayed month.
- Access to member editing and payment details.

### Attendance calendar

The calendar shows the member's pattern of visits during the month:

- Filled marks identify days attended.
- Outlined marks identify elapsed days without a visit.
- A legend explains both treatments.
- Upcoming dates remain unfilled and are identified as upcoming.

Dates before the member joined and dates after today must not count as absent. The demonstration profile for Ahmed Khan, ID `0142`, shows **22 attended days and 8 days without a visit through October 30**. October 31 remains upcoming.

Long names must remain available in full in the profile. Wrapping a large heading must move the content below it instead of covering fields or shrinking the required heading size.

## Attendance

### Find and mark a member

The attendance area supports manual entry by member ID or name.

1. Select the attendance date.
2. Enter the member ID or search by name.
3. Check the matched name and ID.
4. Select **Mark present**.

The matched-member preview reduces the chance of recording a visit against the wrong person. Check-in time is retained with the attendance record.

If an ID is unknown, the owner can search again or add the member first. An attendance entry must not silently create an unidentified or duplicate member.

### Daily list and history

The attendance view provides:

- A selected-date control.
- Present and not-marked groups with counts.
- Search within the day's attendance.
- Member names, IDs and check-in times.
- Access to a member profile.
- A correction action beside a check-in.

The owner can review yesterday, earlier days or another selected date, and add a valid past check-in when a visit was missed.

### Duplicate and date protection

- Allow one check-in per member per local calendar date.
- If the member is already present, show their existing check-in time instead of adding a second visit.
- Block future attendance dates.
- Block dates before membership began or outside the membership period.
- Require restoration for a current check-in against an archived member; retain access to historical corrections.

Attendance dates and displayed times follow the gym's local timezone, **Asia/Karachi**.

### Correct or remove attendance

The correction screen identifies the member and allows the owner to adjust the attendance date or check-in time.

Removing a check-in requires confirmation. The recovery design includes an Undo state. Saving a correction, removing an entry or restoring it must update the daily and monthly attendance figures without creating a duplicate visit.

## Monthly fees and payments

### How joining dates determine fee deadlines

Each member renews monthly on the day they joined:

| Joining date | Following fee dates |
| --- | --- |
| August 12 | September 12, October 12, November 12. |
| September 4 | October 4, November 4, December 4. |
| August 31 | September 30, October 31, November 30. |

When a month does not contain the original day, use its last day. Return to the original joining-day number in later months. For example, September 30 must not permanently change a 31st renewal into a 30th renewal.

The due date remains payable throughout that local calendar date. A fee due October 30 becomes overdue on October 31 if a balance remains.

**The joining date establishes the schedule; payment records establish whether the fee has been paid.** A member's attendance does not prove payment or cancel the fee.

### Fee status and balance

For a fee period:

```text
Remaining balance = charged amount - valid, non-voided payments
```

| Status | Meaning |
| --- | --- |
| Paid | The charged fee has been settled. |
| Pending | A positive balance remains and the due date is today or later. |
| Overdue | A positive balance remains and the due date has passed. |
| Partly paid | Some payment has been received, but a balance remains. That balance can also be overdue. |
| Fee waived | The charge for the period is zero; no payment receipt or overdue fee is created for that zero charge. |

Changing a future monthly fee to zero does not erase an older unpaid balance. Paying a later period does not clear an earlier missed period.

### Payments list

The Payments tab shows the selected monthly fee view with:

- Paid and unpaid member totals.
- All, Paid, Pending and Overdue filters.
- An overdue warning.
- Member name and ID.
- Fee amount and status.
- Payment date or fee due date.
- **Record payment** for outstanding fees.
- **Details / correct** for paid records.
- Visible paging.

The example October view has **91 paid and 35 unpaid**, with **12 overdue included in the 35 unpaid**.

### Record a payment

The payment form shows the selected member and fee period before the owner records money received. It includes:

- Member name and ID.
- Fee period, such as October 4–November 3.
- Outstanding amount for that period.
- Amount received.
- Actual payment date.
- Remaining balance after the proposed payment.

Allow partial payments. Reject zero, negative or over-balance payment amounts, and reject future payment dates. A fully paid period must not accept a duplicate receipt. Early payment is distinct from the fee's due date: paying an October 12 fee on October 3 is valid.

The save state disables repeated submission. If saving fails, preserve the entered information and allow a safe retry. If another update changed the balance, refresh it before accepting another payment.

### Correct a payment marked paid by mistake

The owner can open the paid fee's details and select **Mark unpaid / correct**.

The confirmation shows the member, fee period, amount that will become outstanding and a correction reason. Confirming the correction:

- Voids the mistaken payment entry.
- Retains the original receipt and correction history.
- Recalculates the remaining balance and fee status.
- Updates the payment summaries.
- Restores overdue status when the unpaid due date has passed.
- Keeps unrelated valid payments intact.

If money is received later, the owner records a new payment. The voided entry is not overwritten or counted again.

In the example, voiding Ahmed's Rs. 3,000 payment restores his October 12 fee as **18 days overdue on October 30**. The example summary changes from 91 paid/35 unpaid to **90 paid/36 unpaid**, including **13 overdue**.

### Payment history

Payment details distinguish:

- The fee period being paid.
- The date money was received.
- Amount received and remaining balance.
- The next unpaid fee date.
- Original receipts and voided entries.
- Correction history.

This history lets the owner explain a member's balance without relying on a single paid/unpaid checkbox.

## WhatsApp fee reminders

### Start from Members

The Members tab contains **Send WhatsApp reminders**. The owner starts a batch, chooses the audience, reviews recipients and the message, then confirms sending. The intended website sends individual messages automatically for that batch.

The current design is owner-triggered. A recurring daily schedule is not part of this feature set.

### Three recipient groups

Recipient selection uses each current member's **earliest unpaid fee date**.

| Audience | Who is included | Example when today is October 30, 2026 |
| --- | --- | --- |
| Within 3 days | Members with unpaid fees due from today through three days ahead, inclusive. | October 30–November 2. |
| Within 7 days | Members with unpaid fees due from today through seven days ahead, inclusive. | October 30–November 6. |
| All overdue | Members whose earliest unpaid fee date is before today. | Due before October 30. |

Upcoming groups include fees due today and exclude members already overdue. The 3-day group is included within the 7-day group. The owner chooses one group per batch.

A paid badge for October does not automatically exclude someone whose next November fee is approaching. Likewise, a later paid period does not hide an older overdue balance.

### Recipient eligibility and exclusions

Before sending, check that each recipient:

- Is a current member.
- Has an unpaid balance relevant to the selected audience.
- Has a valid phone number with country code.
- Has recorded permission for fee reminders.
- Has not opted out.
- Has not already received or been queued for the same protected reminder that day.

Excluded members remain visible with a reason, such as a missing phone or missing permission. New member entry requires a phone number; existing incomplete records can still need correction before they qualify for reminders. A valid number format does not guarantee that the number is available on WhatsApp; delivery failures are shown in the result screen.

Shared phone numbers keep separate member IDs and balances. Duplicate protection must not merge two family members simply because they use the same phone.

### Audience counts

The preview distinguishes total matching members, members ready to message and excluded members. Demonstration values are:

| Audience | Matching members | Ready | Excluded |
| --- | ---: | ---: | ---: |
| Within 3 days | 28 | 26 | 2 |
| Within 7 days | 49 | 47 | 2 |
| All overdue | 12 | 11 | 1 |

These reminder counts can differ from October's unpaid total because the upcoming date ranges extend into November.

### Recipient and message preview

Before confirming, the owner can review:

- Selected audience and exact date range.
- Matching, ready and excluded counts.
- Member names and IDs.
- Masked phone numbers in the list.
- Unpaid balance and due date.
- Inclusion or exclusion status and reason.
- Paging through the recipient list.
- A personalised message example.

The message contains the member's name, ID, unpaid fee amount and due date. It tells the member to contact the owner if they already paid and includes an opt-out instruction. Message examples must use the selected member's own details.

### Sending, duplicate prevention and results

Recheck eligibility, balance and reminder permission immediately before sending. If a member pays while the batch is queued, skip their message. Sending a reminder never marks the fee paid.

Duplicate protection covers both repeated clicks and overlapping 3-day/7-day batches for the same member and unpaid fee that day. A later reminder at a different lead time can be sent on a later day.

Results distinguish:

| Result | Meaning |
| --- | --- |
| Sent | The message was sent; this does not by itself confirm delivery. |
| Failed | Sending failed, with a reason that the owner can review. |
| Skipped | A queued recipient no longer qualified, for example because they paid. |
| Excluded | The member did not qualify for the batch before sending began. |

The result view offers a failed-only retry. Successful messages must not be sent again during that retry. Balances and permission are checked again before a retry.

Actual delivery requires a connected WhatsApp Business integration and an approved message template. Missing setup/template and opt-out states are included in the design. The existing implementation notes link to the [WhatsApp Business Messaging Policy](https://whatsappbusiness.com/policy/).

## Attendance analytics

### Ranked member attendance

The main attendance comparison is a horizontal ranked bar chart:

- Highest attendance appears at the top.
- Lowest attendance appears at the bottom.
- Each row shows the member's name and number of attended days.
- Members with zero visits remain visible with a zero value and an empty bar.

The example ranking includes 22, 20, 17, 9, 5 and 0 days. Counting unique attended dates prevents duplicate check-ins from inflating the ranking.

Period controls provide **This week**, **This month**, **Last month** and **Custom**.

### Attendance by weekday

A second chart helps the owner see which weekdays are busiest. The current example shows average daily visits by weekday for October, with a numeric value above every column.

Empty periods provide a clear no-attendance state and a way to change the period. Zero values must not disappear from the display.

## Inactive members

The inactive-member view identifies current members who have not visited recently. It shows:

- Member name and ID.
- Last visit date, or a Never visited label.
- Days since the last visit, or days since joining when no visit exists.
- Attendance count for the month.

The list places the longest absence first.

| Activity category | Rule |
| --- | --- |
| Active | Visited within the last 3 days. |
| Infrequent | Last visit was 4–7 days ago. |
| Inactive | No visit for 8 or more days. |
| New with no visits | No visit yet and fewer than 8 days since joining; not immediately classified inactive. |

Inactivity does not automatically archive the member, cancel their fees or prove that they owe money. Attendance activity and fee status are separate features.

## Validation and recovery

The design includes 29 reference states covering common mistakes, missing data and interrupted actions.

| # | Case | Expected feature behavior |
| ---: | --- | --- |
| 1 | Duplicate member ID | Identify the existing member and ask for a unique ID. |
| 2 | Invalid member form | Explain missing name/phone, invalid fee or future joining date beside the fields. |
| 3 | Attendance already marked | Show the existing time and block a second check-in that day. |
| 4 | Unknown member | Offer another search or Add Member before recording attendance. |
| 5 | Invalid attendance date | Reject future dates and dates outside membership. |
| 6 | Fee already paid | Block a duplicate receipt and offer payment details/correction. |
| 7 | Partial payment | Retain and display the outstanding remainder. |
| 8 | Multiple unpaid periods | Keep each period's debt; a later payment does not settle an earlier fee. |
| 9 | Invalid payment amount | Reject zero, negative or over-balance amounts. |
| 10 | Saving in progress | Disable repeated submission. |
| 11 | Save failure | Preserve input and allow a safe retry. |
| 12 | Concurrent record change | Refresh the latest balance before accepting a payment. |
| 13 | No members | Explain how to add the first member. |
| 14 | No search matches | Offer another search or clearing filters. |
| 15 | No attendance for a date | State that no visits were recorded and offer valid past entry. |
| 16 | No chart data | Keep zero/no-attendance information visible and allow changing the period. |
| 17 | New member without visits | Show their joining context without prematurely marking them inactive. |
| 18 | Archived member | Require restoration for current check-ins while preserving historical editing. |
| 19 | Unsaved changes | Offer Keep editing and Discard changes. |
| 20 | Fee-waived membership | Avoid overdue zero-fee periods while retaining any older debt. |
| 21 | Month-end joining date | Clamp short months and return to the original renewal day afterward. |
| 22 | Reminder recipient not ready | Expose missing/invalid phone or missing permission instead of silently sending. |
| 23 | Failed reminder retry | Retry failures only and recheck payment/permission. |
| 24 | WhatsApp setup missing | Require the messaging integration and approved template before sending. |
| 25 | Reminder opt-out | Retain the member and balance, but exclude their reminders. |
| 26 | Long member name | Keep the ID visible and make the full name available in the profile. |
| 27 | Shared phone | Confirm the number without combining separate members or fees. |
| 28 | Overlapping reminder batches | Prevent duplicate reminders across the 3-day and 7-day groups. |
| 29 | Attendance removed | Recalculate counts and offer Undo without duplicating the restored visit. |

These states describe intended website behavior. The Penpot examples demonstrate the interface; they do not perform live validation, database updates or message delivery.

## Information the features retain

The feature set depends on the following information. This is a product-level record summary, not an implemented database schema.

| Record | Information retained |
| --- | --- |
| Member | Stable identity, unique displayed ID, name, phone, joining date, monthly fee, opening unpaid date, reminder preference and archive state. |
| Attendance | Member reference, attendance date and check-in time. |
| Fee period | Member reference, period dates, charged amount and due date; balance derived from valid payments. |
| Payment | Member and fee-period references, received amount, actual payment date, and correction/void history. |
| Reminder batch | Audience, reference date/range, included and excluded recipients, and the message/template context. |
| Reminder result | Member/fee reference, sent/failed/skipped state, failure or skip reason, and duplicate-prevention history. |

## Mobile experience

- Persistent five-tab navigation on the main screens.
- Readable stacked rows, search and paging for member and payment lists.
- Labeled actions for member entry, attendance, payments and reminders.
- Required-field marks, helper text, explicit dates and fee periods.
- Touch targets of at least 44 × 44 pixels for wired controls.
- Status text and chart values alongside color, so meaning does not depend on color alone.
- **Teko, 53px, weight 500** for all admin H1 headings.
- Inter Tight for supporting text, forms and numerical data.
- Long headings wrap with space below them; list names use a compact treatment while keeping the ID visible.

## Feature verification checklist

The following scenarios define important checks for the eventual website implementation:

- Add a member with a unique ID, valid phone, joining date and monthly fee.
- Preserve `0142` as `0142`; reject another member using that ID.
- Separate reminder permission from required contact details.
- Renew an August 12 membership on each subsequent 12th.
- Renew an August 31 membership on September 30, then October 31.
- Keep a fee due today out of Overdue until the next local date.
- Keep a partial balance and older missed fees outstanding.
- Correct a mistaken payment without deleting its history or unrelated receipts.
- Block a second attendance entry on the same date and restore a removed entry only once.
- Exclude calendar dates before joining and after today from absence totals.
- Keep a new, never-visited member out of Inactive until eight days have passed.
- Match the 3-day, 7-day and overdue audiences to their displayed date ranges.
- Prevent duplicates when the owner sends both upcoming reminder groups on the same day.
- Exclude missing phone, missing permission, opt-out, archived and zero-balance records.
- Skip a recipient who pays while messages are queued.
- Retry failed messages without resending successful ones.
- Distinguish sent from delivered and preserve visible reasons for failures or exclusions.

The completed design was checked for screen dimensions, heading consistency, text containment, navigation targets and visual collisions. Those checks validate the design, not a running website.

## Design references

- [Main admin screens](design-previews/admin-mobile-contact-sheet.png).
- [Members, forms and payment corrections](design-previews/admin-mobile-members-billing.png).
- [Three WhatsApp reminder audiences](design-previews/admin-mobile-reminder-audiences.png).
- [Recipient review and message results](design-previews/admin-mobile-reminder-delivery.png).
- [Attendance and archive controls](design-previews/admin-mobile-supporting-controls.png).
- [Validation and recovery examples](design-previews/admin-mobile-admin-states.png).
- [Detailed billing and audience rules](design-previews/admin-mobile-rules.md).
- [Product context](PRODUCT.md).

Attendance-register upload and OCR scanning remain a possible future extension. They are not included in the current admin feature set.
