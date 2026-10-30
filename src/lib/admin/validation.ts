import { validDate } from "./calendar";
import type { AdminData } from "./types";

export function storageValid(data: unknown): data is AdminData {
  try{
    if(!data || typeof data!=="object")return false;const d=data as AdminData;
    if(d.schemaVersion!==1 || !Number.isSafeInteger(d.revision) || d.revision<0)return false;
    if(![d.members,d.periods,d.receipts,d.attendance,d.batches,d.audit,d.submissions].every(Array.isArray))return false;
    const amount=(v:unknown)=>Number.isSafeInteger(v)&&Number(v)>=0;
    const key=(v:unknown)=>typeof v==="string"&&v.length>0;
    const unique=(items:{key:string}[])=>new Set(items.map(i=>i.key)).size===items.length;
    if(![d.members,d.periods,d.receipts,d.attendance,d.batches].every(unique))return false;
    if(new Set(d.members.map(m=>m.id.toLowerCase())).size!==d.members.length)return false;
    if(!d.members.every(m=>key(m.key)&&key(m.id)&&key(m.name)&&typeof m.phone==="string"&&validDate(m.joinedOn)&&validDate(m.firstUnpaidOn)&&amount(m.monthlyFee)&&typeof m.reminderConsent==="boolean"&&(m.archivedOn===null||validDate(m.archivedOn))&&m.schedules.length>0&&m.schedules.every(s=>validDate(s.from)&&Number.isInteger(s.day)&&s.day>=1&&s.day<=31&&amount(s.amount))&&m.intervals.length>0&&m.intervals.every(i=>validDate(i.from)&&(i.through===null||validDate(i.through)&&i.through>=i.from)&&(!i.feesFrom||validDate(i.feesFrom)))))return false;
    const members=new Set(d.members.map(m=>m.key));const periods=new Map(d.periods.map(p=>[p.key,p]));
    if(!d.periods.every(p=>key(p.key)&&members.has(p.memberKey)&&validDate(p.dueOn)&&validDate(p.through)&&p.through>=p.dueOn&&amount(p.charge)&&typeof p.posted==="boolean"))return false;
    if(!d.receipts.every(r=>key(r.key)&&members.has(r.memberKey)&&periods.get(r.periodKey)?.memberKey===r.memberKey&&amount(r.amount)&&r.amount>0&&validDate(r.paidOn)&&Number.isFinite(Date.parse(r.createdAt))&&(r.voidedAt===null||Number.isFinite(Date.parse(r.voidedAt)))&&(r.reason===null||typeof r.reason==="string")))return false;
    if(d.periods.some(p=>d.receipts.filter(r=>r.periodKey===p.key&&!r.voidedAt).reduce((sum,r)=>sum+r.amount,0)>p.charge))return false;
    if(!d.attendance.every(a=>key(a.key)&&members.has(a.memberKey)&&validDate(a.date)&&/^([01]\d|2[0-3]):[0-5]\d$/.test(a.time)&&(a.removedAt===null||Number.isFinite(Date.parse(a.removedAt)))))return false;
    const live=d.attendance.filter(a=>!a.removedAt).map(a=>a.memberKey+":"+a.date);if(new Set(live).size!==live.length)return false;
    return d.batches.every(b=>key(b.key)&&["3","7","overdue"].includes(b.audience)&&validDate(b.date)&&Array.isArray(b.recipients)&&b.recipients.every(r=>members.has(r.memberKey)&&key(r.periodKey)&&typeof r.message==="string"&&["ready","excluded","queued","sent","failed","skipped"].includes(r.status)&&Number.isInteger(r.attempts)&&r.attempts>=0))&&d.submissions.every(s=>key(s.id))&&d.audit.every(a=>typeof a.action==="string"&&typeof a.target==="string");
  }catch{return false;}
}
