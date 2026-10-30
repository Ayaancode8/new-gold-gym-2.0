export type DateOnly = string;
export type Audience = "3" | "7" | "overdue";
export interface MembershipInterval { from: DateOnly; through: DateOnly | null; feesFrom?: DateOnly }
export interface FeeSchedule { from: DateOnly; day: number; amount: number }
export interface Member {
  key: string; id: string; name: string; phone: string; joinedOn: DateOnly;
  monthlyFee: number; firstUnpaidOn: DateOnly; reminderConsent: boolean;
  archivedOn: DateOnly | null; intervals: MembershipInterval[]; schedules: FeeSchedule[];
}
export interface FeePeriod { key: string; memberKey: string; dueOn: DateOnly; through: DateOnly; charge: number; posted: boolean }
export interface Receipt { key: string; memberKey: string; periodKey: string; amount: number; paidOn: DateOnly; createdAt: string; voidedAt: string | null; reason: string | null }
export interface Attendance { key: string; memberKey: string; date: DateOnly; time: string; removedAt: string | null }
export interface ReminderRecipient {
  memberKey: string; periodKey: string; phone: string; message: string;
  status: "ready" | "excluded" | "queued" | "sent" | "failed" | "skipped";
  reason: string; attempts: number; sentOn: DateOnly | null;
}
export interface ReminderBatch { key: string; audience: Audience; createdAt: string; date: DateOnly; recipients: ReminderRecipient[] }
export interface AuditEntry { at: string; action: string; target: string; reason?: string }
export interface AdminData {
  schemaVersion: 1; revision: number; members: Member[]; periods: FeePeriod[];
  receipts: Receipt[]; attendance: Attendance[]; batches: ReminderBatch[];
  audit: AuditEntry[]; submissions: {id:string;target?:string}[];
}
export type AdminState = Pick<AdminData, "revision" | "members" | "periods" | "receipts" | "attendance" | "batches"> & { today: DateOnly };
export interface MemberInput { id: string; name: string; phone: string; joinedOn: string; monthlyFee: number; firstUnpaidOn: string; reminderConsent: boolean }
export type AdminCommand =
  | { type: "member.add"; values: MemberInput }
  | { type: "member.edit"; key: string; values: MemberInput }
  | { type: "member.archive"; key: string }
  | { type: "member.restore"; key: string; nextDueOn: string }
  | { type: "attendance.mark"; memberKey: string; date: string; time: string }
  | { type: "attendance.correct"; key: string; date: string; time: string }
  | { type: "attendance.remove" | "attendance.undo"; key: string }
  | { type: "payment.record"; periodKey: string; amount: number; paidOn: string }
  | { type: "payment.void"; key: string; reason: string }
  | { type: "reminder.create"; audience: Audience }
  | { type: "reminder.process" | "reminder.retry"; key: string };
export interface ActionRequest { revision: number; submissionId: string; command: AdminCommand }
