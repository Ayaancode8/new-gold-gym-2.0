const randomUUID = () => globalThis.crypto.randomUUID();
import { addDays, inMonth, isMembershipDate, renewalMatches, scheduleOn, shiftMonth, validDate } from "./calendar";
import { balance, recipientReason, reminderAudience, reminderMessage } from "./selectors";
import type { AdminCommand, AdminData, Member, MemberInput } from "./types";

export class AdminError extends Error {
  constructor(message: string, public status = 422, public field?: string) { super(message); this.name = "AdminError"; }
}
function requireValue(condition: unknown, message: string, field?: string): asserts condition { if (!condition) throw new AdminError(message,422,field); }
function date(value: unknown, field: string): asserts value is string { requireValue(validDate(value) && value >= "1900-01-01", "Enter a valid date.", field); }
function text(value: unknown, field: string, max=160): asserts value is string { requireValue(typeof value === "string" && value.trim().length > 0 && value.length<=max, `Enter ${field === "reason" ? "a correction reason" : "a valid " + field}.`,field); }
function memberByKey(data: AdminData,key: unknown): Member { const member=data.members.find(m=>m.key===key); if(!member)throw new AdminError("Member not found.",404); return member; }
function validateMember(data: AdminData, values: MemberInput, today: string, existing?: Member) {
  requireValue(values && typeof values==="object","Enter member information.");
  text(values.name,"name"); text(values.id,"id",32);
  requireValue(/^[a-zA-Z0-9_-]+$/.test(values.id),"Use letters, numbers, hyphens or underscores for the ID.","id");
  requireValue(!data.members.some(m=>m.id.toLowerCase()===values.id.toLowerCase() && m.key!==existing?.key),"That member ID is already in use.","id");
  requireValue(typeof values.phone === "string" && /^\+[1-9]\d{7,14}$/.test(values.phone),"Include a valid country code, for example +92.","phone");
  date(values.joinedOn,"joinedOn"); requireValue(values.joinedOn<=today,"Joining date cannot be in the future.","joinedOn");
  requireValue(Number.isSafeInteger(values.monthlyFee) && values.monthlyFee>=0 && values.monthlyFee<=100000000,"Enter a monthly fee from Rs. 0 to Rs. 1,000,000.","monthlyFee");
  requireValue(typeof values.reminderConsent === "boolean","Choose a reminder preference.","reminderConsent");
  if(!existing){date(values.firstUnpaidOn,"firstUnpaidOn");requireValue(values.firstUnpaidOn>=values.joinedOn,"The first unpaid date must be on or after joining.","firstUnpaidOn");requireValue(inMonth(values.firstUnpaidOn.slice(0,7),Number(values.joinedOn.slice(8)))===values.firstUnpaidOn,"Choose a date on the member's monthly renewal schedule.","firstUnpaidOn");requireValue(values.firstUnpaidOn<=shiftMonth(today,12),"Choose a first unpaid date within the next year.","firstUnpaidOn");}
  if(existing && values.joinedOn!==existing.joinedOn){
    requireValue(!data.attendance.some(a=>a.memberKey===existing.key && !a.removedAt && a.date<values.joinedOn),"This date would exclude recorded attendance. Correct those records first.","joinedOn");
    requireValue(!data.periods.some(p=>p.memberKey===existing.key && p.posted && p.dueOn<values.joinedOn),"This date would exclude posted fee periods. Keep the original joining date.","joinedOn");
  }
}

/** Persist due charges and project the next month's renewals. Posted charges never change. */
export function ensurePeriods(data: AdminData,today: string): boolean {
  let changed=false;
  for(const member of data.members){
    let month=member.firstUnpaidOn.slice(0,7);
    const until=shiftMonth(today,1).slice(0,7);
    for(let count=0;month<=until && count<2400;count++){
      const schedule=scheduleOn(member,inMonth(month,31));
      const dueOn=inMonth(month,schedule.day);
      const eligible=dueOn>=member.firstUnpaidOn && member.intervals.some(i=>dueOn>=(i.feesFrom??i.from) && (!i.through || dueOn<=i.through));
      if(eligible){
        let period=data.periods.find(p=>p.memberKey===member.key && p.dueOn===dueOn);
        if(!period){period={key:`${member.key}:${dueOn}`,memberKey:member.key,dueOn,through:addDays(shiftMonth(dueOn,1,schedule.day),-1),charge:schedule.amount,posted:dueOn<=today};data.periods.push(period);changed=true;}
        else if(!period.posted && period.dueOn<=today){period.posted=true;changed=true;}
      }
      month=shiftMonth(month+"-01",1,1).slice(0,7);
    }
  }
  return changed;
}

function attendanceDate(member: Member,selected: unknown,time: unknown,today: string){
  date(selected,"date");requireValue(selected<=today,"Attendance cannot be in the future.","date");requireValue(isMembershipDate(member,selected),"Choose a date within this member's membership.","date");requireValue(typeof time==="string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(time),"Enter a valid check-in time.","time");
}
export function applyCommand(data: AdminData, command: AdminCommand, today: string, now=new Date().toISOString()): { target?: string } {
  requireValue(command && typeof command==="object" && typeof command.type==="string","Choose a valid action.");
  let target=""; let reason: string | undefined;
  switch(command.type){
    case "member.add": {
      validateMember(data,command.values,today);const v=command.values;target=randomUUID();
      data.members.push({key:target,...v,name:v.name.trim(),archivedOn:null,intervals:[{from:v.joinedOn,through:null}],schedules:[{from:v.joinedOn,day:Number(v.joinedOn.slice(8)),amount:v.monthlyFee}]}); break;
    }
    case "member.edit": {
      const m=memberByKey(data,command.key);validateMember(data,command.values,today,m);const v=command.values;
      if(m.monthlyFee!==v.monthlyFee || m.joinedOn!==v.joinedOn){
        const future=data.periods.filter(p=>p.memberKey===m.key && p.posted).sort((a,b)=>b.through.localeCompare(a.through))[0];
        const lastLocked=future&&future.through>today?future.through:today;
        let effective=inMonth(lastLocked.slice(0,7),Number(v.joinedOn.slice(8)));
        if(effective<=lastLocked)effective=shiftMonth(effective,1,Number(v.joinedOn.slice(8)));
        m.schedules=m.schedules.filter(s=>s.from<effective);m.schedules.push({from:effective,day:Number(v.joinedOn.slice(8)),amount:v.monthlyFee});
        data.periods=data.periods.filter(p=>p.memberKey!==m.key || p.posted);
      }
      if(v.joinedOn!==m.joinedOn)m.intervals[0].from=v.joinedOn;
      Object.assign(m,{id:v.id,name:v.name.trim(),phone:v.phone,joinedOn:v.joinedOn,monthlyFee:v.monthlyFee,reminderConsent:v.reminderConsent});target=m.key;break;
    }
    case "member.archive": {
      const m=memberByKey(data,command.key);requireValue(!m.archivedOn,"This member is already archived.");m.archivedOn=today;
      const interval=m.intervals.find(i=>!i.through);if(interval)interval.through=today;
      data.periods=data.periods.filter(p=>p.memberKey!==m.key || p.posted || p.dueOn<=today);target=m.key;break;
    }
    case "member.restore": {
      const m=memberByKey(data,command.key);requireValue(m.archivedOn,"This member is already current.");date(command.nextDueOn,"nextDueOn");requireValue(command.nextDueOn>=today && command.nextDueOn<=shiftMonth(today,12),"Review a next fee date from today through the next year.","nextDueOn");requireValue(renewalMatches(m,command.nextDueOn),"Choose a date on the renewal schedule.","nextDueOn");m.archivedOn=null;m.intervals.push({from:today,through:null,feesFrom:command.nextDueOn});target=m.key;break;
    }
    case "attendance.mark": {
      const m=memberByKey(data,command.memberKey);requireValue(!m.archivedOn,"Restore this member before marking attendance.");attendanceDate(m,command.date,command.time,today);
      const duplicate=data.attendance.find(a=>a.memberKey===m.key && a.date===command.date && !a.removedAt);requireValue(!duplicate,`Already marked present${duplicate ? " at "+duplicate.time : ""}.`,"date");
      target=randomUUID();data.attendance.push({key:target,memberKey:m.key,date:command.date,time:command.time,removedAt:null});break;
    }
    case "attendance.correct":case "attendance.remove":case "attendance.undo": {
      const a=data.attendance.find(a=>a.key===command.key);requireValue(a,"Attendance record not found.");
      if(command.type==="attendance.remove"){requireValue(!a.removedAt,"This check-in was already removed.");a.removedAt=now;}
      else { const m=memberByKey(data,a.memberKey);const selected=command.type==="attendance.correct"?command.date:a.date;const time=command.type==="attendance.correct"?command.time:a.time;attendanceDate(m,selected,time,today);requireValue(!data.attendance.some(other=>other.key!==a.key && !other.removedAt && other.memberKey===a.memberKey && other.date===selected),"This member already has a check-in on that date.","date");if(command.type==="attendance.undo")requireValue(a.removedAt,"This check-in is already present.");else requireValue(!a.removedAt,"This check-in was removed. Refresh the register.");Object.assign(a,{date:selected,time,removedAt:null});}
      target=a.key;break;
    }
    case "payment.record": {
      const p=data.periods.find(p=>p.key===command.periodKey);requireValue(p,"Fee period not found. Refresh the payment list.");
      const outstanding=balance(data,p);requireValue(outstanding>0,"This fee is already settled.","amount");requireValue(Number.isSafeInteger(command.amount) && command.amount>0 && command.amount<=outstanding,"Enter an amount greater than zero and no more than the outstanding balance.","amount");date(command.paidOn,"paidOn");requireValue(command.paidOn<=today,"Payment date cannot be in the future.","paidOn");p.posted=true;target=randomUUID();data.receipts.push({key:target,memberKey:p.memberKey,periodKey:p.key,amount:command.amount,paidOn:command.paidOn,createdAt:now,voidedAt:null,reason:null});break;
    }
    case "payment.void": {
      const r=data.receipts.find(r=>r.key===command.key);requireValue(r,"Receipt not found.");requireValue(!r.voidedAt,"This receipt was already voided.");text(command.reason,"reason",500);r.voidedAt=now;r.reason=command.reason.trim();target=r.key;reason=r.reason;break;
    }
    case "reminder.create": {
      requireValue(["3","7","overdue"].includes(command.audience),"Choose a reminder audience.");target=randomUUID();const recipients=reminderAudience(data,command.audience,today);requireValue(recipients.some(r=>r.status==="ready"),"No eligible recipients. Review exclusions or choose another audience.");data.batches.push({key:target,audience:command.audience,date:today,createdAt:now,recipients:recipients.map(r=>({...r,status:r.status==="ready"?"queued":"excluded"}))});break;
    }
    case "reminder.process":case "reminder.retry": {
      const batch=data.batches.find(b=>b.key===command.key);requireValue(batch,"Reminder batch not found.");
      if(command.type==="reminder.retry"){
        for(const r of batch.recipients.filter(r=>r.status==="failed")){r.status="queued";r.reason="";}
      }else{
        const r=batch.recipients.find(r=>r.status==="queued");
        if(r){const m=memberByKey(data,r.memberKey);const p=data.periods.find(p=>p.key===r.periodKey);const excluded=p?recipientReason(data,m,p,today,batch.key):"Fee period no longer available";r.attempts++;
          if(excluded){r.status="skipped";r.reason=excluded;}
          else if(Number(m.id)%17===0 && r.attempts===1){r.status="failed";r.reason="Simulated connection failure. Safe to retry.";}
          else {r.status="sent";r.sentOn=today;r.reason="Simulated send · delivery not confirmed";r.phone=m.phone;r.message=reminderMessage(data,m,p!);}
        }
      } target=batch.key;break;
    }
    default:throw new AdminError("Unknown action.",400);
  }
  ensurePeriods(data,today);data.audit.push({at:now,action:command.type,target,...(reason?{reason}:{})});return {target};
}
