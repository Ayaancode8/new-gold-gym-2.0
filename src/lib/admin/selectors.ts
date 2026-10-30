import { addDays, daysBetween, formatDate, money } from "./calendar";
import type { AdminData, AdminState, Audience, FeePeriod, Member, ReminderRecipient } from "./types";

export type Register = Pick<AdminData, "members" | "periods" | "receipts" | "attendance" | "batches">;
export function balance(data: Register, period: FeePeriod): number {
  return period.charge - data.receipts.filter(r => r.periodKey === period.key && !r.voidedAt).reduce((sum,r) => sum + r.amount, 0);
}
export function feeStatus(data: Register, period: FeePeriod, today: string): string {
  return period.charge === 0 ? "Fee waived" : balance(data,period) === 0 ? "Paid" : period.dueOn < today ? "Overdue" : "Pending";
}
export function unpaidPeriods(data: Register, key: string): FeePeriod[] { return data.periods.filter(p => p.memberKey === key && balance(data,p) > 0).sort((a,b)=>a.dueOn.localeCompare(b.dueOn)); }
export function visits(data: Register, key: string, from: string, through: string) { return data.attendance.filter(a => a.memberKey === key && !a.removedAt && a.date >= from && a.date <= through); }
export function activity(data: Register, member: Member, today: string) {
  const last = data.attendance.filter(a=>a.memberKey===member.key && !a.removedAt && a.date<=today).sort((a,b)=>b.date.localeCompare(a.date))[0]?.date;
  const days = daysBetween(last ?? member.joinedOn,today);
  return { last, days, label: days >= 8 ? "Inactive" : !last ? "New · no visits" : days >= 4 ? "Infrequent" : "Active" };
}
export function monthPeriods(data: Register, month: string) { return data.periods.filter(p=>p.dueOn.startsWith(month) && !data.members.find(m=>m.key===p.memberKey)?.archivedOn); }
export function periodSummary(data:Register,periods:FeePeriod[],today:string){
  const groups=[...new Set(periods.map(p=>p.memberKey))].map(key=>periods.filter(p=>p.memberKey===key));
  return {paid:groups.filter(group=>group.some(p=>p.charge>0)&&group.every(p=>balance(data,p)===0)).length,pending:groups.filter(group=>group.some(p=>balance(data,p)>0)).length,overdue:groups.filter(group=>group.some(p=>balance(data,p)>0&&p.dueOn<today)).length};
}
export function overview(data: Register, today: string) {
  const members = data.members.filter(m=>!m.archivedOn);
  const present = members.filter(m=>visits(data,m.key,today,today).length).length;
  const periods = monthPeriods(data,today.slice(0,7));
  return { total: members.length, present, notMarked: members.length-present, ...periodSummary(data,periods,today) };
}
export function recipientReason(data: Register, member: Member, period: FeePeriod, today: string, ignoreBatch?: string): string {
  if (member.archivedOn) return "Member archived";
  if (balance(data,period)<=0) return "Paid while queued";
  if (!/^\+[1-9]\d{7,14}$/.test(member.phone)) return "Invalid or missing phone";
  if (!member.reminderConsent) return "No reminder permission";
  if (data.batches.some(b=>b.key!==ignoreBatch && b.date===today && b.recipients.some(r=>r.memberKey===member.key && r.periodKey===period.key && ["sent","queued","failed"].includes(r.status)))) return "Already sent or queued today";
  return "";
}
export function reminderAudience(data: Register, audience: Audience, today: string): ReminderRecipient[] {
  return data.members.filter(m=>!m.archivedOn).flatMap(member=>{
    const period=unpaidPeriods(data,member.key)[0]; if(!period)return [];
    const matches=audience==="overdue" ? period.dueOn<today : period.dueOn>=today && period.dueOn<=addDays(today,Number(audience)); if(!matches)return [];
    const reason=recipientReason(data,member,period,today);
    return [{memberKey:member.key,periodKey:period.key,phone:member.phone,message:reminderMessage(data,member,period),status:reason?"excluded" as const:"ready" as const,reason,attempts:0,sentOn:null}];
  });
}
export function reminderMessage(data:Register,member:Member,period:FeePeriod){return `Hi ${member.name}, your New Gold Gym fee of ${money(balance(data,period))} (member ID ${member.id}) is due ${formatDate(period.dueOn)}. If you have already paid, please contact the owner so we can check your record. Reply STOP to opt out of fee reminders.`;}
export function toState(data: AdminData, today: string): AdminState { return { revision:data.revision,today,members:data.members,periods:data.periods,receipts:data.receipts,attendance:data.attendance,batches:data.batches }; }
