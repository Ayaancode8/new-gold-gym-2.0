import { addDays, daysBetween, inMonth, shiftMonth } from "./calendar";
import { ensurePeriods } from "./domain";
import type { AdminData, Member } from "./types";

/** Fictional register. Renewals and receipts, rather than counters, drive the demo. */
export function seedData(today = "2026-10-30"): AdminData {
  const data: AdminData={schemaVersion:1,revision:0,members:[],periods:[],receipts:[],attendance:[],batches:[],audit:[],submissions:[]};
  const named=[
    ["Ahmed Khan","0142",12],["Ali Raza","0078",8],["Hassan","0214",1],
    ["Hamza Ali","0143",4],["Bilal","0091",21],["Zain Ahmed","0206",4],
    ["Usman Tariq","0186",30],["Omar Farooq","0119",19],["Fahad Ali","0181",12],
  ] as const;
  const first=["Saad","Danish","Ibrahim","Adeel","Taimur","Arslan","Haris","Rafay","Sami","Imran","Talha","Waqas"];
  const last=["Malik","Khan","Ahmed","Shah","Butt","Sheikh","Iqbal","Hussain","Raza","Ali"];
  const overdue=new Set([3,4,7,91,92,93,94,95,96,97,98,99]);
  const month=today.slice(0,7);const day=Number(today.slice(8));
  for(let i=0;i<126;i++){
    const example=named[i];const id=example?.[1]??String(300+i).padStart(4,"0");
    let dueDay: number=example?.[2]??(i%27)+1;
    if(overdue.has(i))dueDay=Math.max(1,Math.min(dueDay,day-1));
    else if(i>=100 && i<=122)dueDay=day+(i%2===0 && day<31?1:0);
    const joinedOn=shiftMonth(inMonth(month,dueDay),i===5?-1:-2,dueDay);
    const member: Member={key:`demo-${id}`,id,name:example?.[0]??`${first[i%first.length]} ${last[Math.floor(i/first.length)%last.length]}`,phone:`+92300000${id}`,joinedOn,monthlyFee:300000,firstUnpaidOn:inMonth(month,dueDay),reminderConsent:true,archivedOn:null,intervals:[{from:joinedOn,through:null}],schedules:[{from:joinedOn,day:dueDay,amount:300000}]};
    if(i===101)member.phone="";
    if(i===103 || i===98)member.reminderConsent=false;
    data.members.push(member);
  }
  ensurePeriods(data,today);
  for(let i=0;i<data.members.length;i++){
    const m=data.members[i];const p=data.periods.find(p=>p.memberKey===m.key && p.dueOn.startsWith(month));
    if(p && !overdue.has(i) && !(i>=100 && i<=122)){
      p.posted=true;data.receipts.push({key:`receipt-${m.id}`,memberKey:m.key,periodKey:p.key,amount:p.charge,paidOn:i===0?inMonth(month,Math.min(day,3)):i===1?inMonth(month,Math.min(day,5)):addDays(today,-Math.min(day-1,i%12)),createdAt:today+"T10:00:00.000Z",voidedAt:null,reason:null});
    }
    const monthStart=month+"-01";const elapsed=daysBetween(monthStart,today)+1;
    let count=i===0?22:i===1?20:i===2?17:i===3?9:i===4?5:i===5?0:8+i%15;
    count=Math.min(count,elapsed);
    let available=Array.from({length:elapsed},(_,n)=>addDays(monthStart,n)).filter(d=>d>=m.joinedOn);
    if(i===3)available=available.filter(d=>d<=inMonth(month,Math.min(15,day)));
    if(i===4)available=available.filter(d=>d<=inMonth(month,Math.min(22,day)));
    if(i===7)available=available.filter(d=>d<=inMonth(month,Math.min(19,day)));
    // Exactly 43 current members have a check-in on the seed date.
    const todayVisit=i<46 && ![3,4,5,7].includes(i) || i===46;
    const selected=available.filter(d=>d!==today).sort((a,b)=>{
      const score=(s:string)=>(Number(s.slice(8))*7+i*3)%37;return score(a)-score(b);
    }).slice(0,Math.max(0,count-(todayVisit?1:0)));
    if(todayVisit)selected.push(today);
    for(const date of selected)data.attendance.push({key:`attendance-${m.id}-${date}`,memberKey:m.key,date,time:i===0?"18:34":i===1?"18:51":i===2?"19:05":`${String(16+i%6).padStart(2,"0")}:${String(i*7%60).padStart(2,"0")}`,removedAt:null});
  }
  return data;
}
