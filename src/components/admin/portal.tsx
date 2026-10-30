"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { formatDate } from "@/lib/admin/calendar";
import type { AdminCommand, AdminState } from "@/lib/admin/types";
import { AdminContext, FormIssue } from "./context";
import { AnalyticsScreen } from "./analytics-screen";
import { MemberForm, MembersScreen, ProfileScreen } from "./member-screens";
import { PaymentScreen, PaymentsScreen } from "./payment-screens";
import { AttendanceScreen, OverviewScreen } from "./register-screens";
import { ReminderResults, RemindersScreen } from "./reminder-screens";
import { Empty, Icon, Modal, type IconName } from "./primitives";
import styles from "./admin.module.css";

declare global { interface Window { __newGoldLeaveGuard?: (event: PopStateEvent) => void } }

const destinations:{path:string;label:string;icon:IconName}[]=[{path:"/admin",label:"Overview",icon:"overview"},{path:"/admin/attendance",label:"Attendance",icon:"attendance"},{path:"/admin/members",label:"Members",icon:"members"},{path:"/admin/payments",label:"Payments",icon:"payments"},{path:"/admin/analytics",label:"Analytics",icon:"analytics"}];
const secondary:{path:string;label:string;icon:IconName}[]=[{path:"/admin/inactive",label:"Inactive members",icon:"clock"},{path:"/admin/archived",label:"Archived members",icon:"archive"},{path:"/admin/reminders",label:"Fee reminders",icon:"chat"}];

export function AdminPortal({initialState,initialError}:{initialState:AdminState|null;initialError?:string}){
  const [data,setData]=useState(initialState);const ref=useRef(data);ref.current=data;
  const [message,setMessage]=useState("");const [loadError,setLoadError]=useState(initialError??"");const [dirty,setDirty]=useState(false);const [pendingHref,setPendingHref]=useState("");const [refreshing,setRefreshing]=useState(false);
  const [lastInitial,setLastInitial]=useState(initialState);
  if(initialState!==lastInitial){setLastInitial(initialState);if(!dirty&&initialState&&(!data||initialState.revision>data.revision||initialState.today!==data.today))setData(initialState);if(initialError)setLoadError(initialError);}
  const submissions=useRef(new Map<string,string>());const pathname=usePathname();const router=useRouter();
  const notify=useCallback((message:string)=>setMessage(message),[]);
  const refresh=useCallback(async()=>{const response=await fetch("/api/admin/state",{cache:"no-store"});const result=await response.json();if(response.status===401){router.replace("/admin/login?next="+encodeURIComponent(window.location.pathname+window.location.search));return;}if(!response.ok)throw new FormIssue(result.error);ref.current=result;setData(result);setLoadError("");},[router]);
  const mutate=useCallback(async(command:AdminCommand,success?:string,submissionId?:string)=>{
    const key=JSON.stringify(command);const id=submissionId??submissions.current.get(key)??crypto.randomUUID();submissions.current.set(key,id);
    let response:Response;try{response=await fetch("/api/admin/actions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({revision:ref.current!.revision,submissionId:id,command})});}catch{await refresh().catch(()=>{});throw new FormIssue("The connection was interrupted. Review the latest record and retry your save.");}
    const result=await response.json();
    if(response.status===401){router.replace("/admin/login?next="+encodeURIComponent(window.location.pathname+window.location.search));throw new FormIssue("Please log in to continue.");}
    if(!response.ok){if(response.status===409)await refresh().catch(()=>{});throw new FormIssue(result.error,result.field);}
    ref.current=result.state;setData(result.state);submissions.current.delete(key);if(success)notify(success);return {target:result.target as string|undefined};
  },[notify,refresh,router]);
  useEffect(()=>{if(!message)return;const timeout=setTimeout(()=>setMessage(""),6000);return()=>clearTimeout(timeout);},[message]);
  useEffect(()=>{const update=()=>{if(!dirty&&document.visibilityState==="visible")refresh().catch(e=>setLoadError(e.message));};const timer=setInterval(update,60000);window.addEventListener("focus",update);document.addEventListener("visibilitychange",update);return()=>{clearInterval(timer);window.removeEventListener("focus",update);document.removeEventListener("visibilitychange",update);};},[refresh,dirty]);
  useEffect(()=>{
    if(!dirty)return;
    const unload=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue="";};
    const click=(e:MouseEvent)=>{const link=(e.target as HTMLElement).closest("a");if(!link||e.defaultPrevented||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||link.target==="_blank")return;const url=new URL(link.href);if(url.origin===window.location.origin&&url.pathname+url.search!==window.location.pathname+window.location.search){e.preventDefault();e.stopPropagation();setPendingHref(url.pathname+url.search+url.hash);}};
    const formURL=window.location.pathname+window.location.search;const formHistoryState=window.history.state;
    const back=(e:PopStateEvent)=>{const destination=window.location.pathname+window.location.search;if(destination===formURL)return;e.stopImmediatePropagation();window.history.pushState(formHistoryState,"",formURL);setPendingHref(destination);};
    window.addEventListener("beforeunload",unload);window.__newGoldLeaveGuard=back;document.addEventListener("click",click,true);return()=>{window.removeEventListener("beforeunload",unload);if(window.__newGoldLeaveGuard===back)delete window.__newGoldLeaveGuard;document.removeEventListener("click",click,true);};
  },[dirty]);
  const context=useMemo(()=>data?{data,mutate,refresh,notify,setDirty}:null,[data,mutate,refresh,notify]);
  const active=pathname.startsWith("/admin/payments")?"Payments":pathname.startsWith("/admin/attendance")?"Attendance":pathname.startsWith("/admin/analytics")?"Analytics":pathname==="/admin"?"Overview":"Members";
  const focused=pathname.startsWith("/admin/reminders")||pathname.includes("/new")||pathname.endsWith("/edit")||pathname.endsWith("/record");
  async function logout(){if(dirty){setPendingHref("logout");return;}await fetch("/api/admin/logout",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});router.replace("/admin/login");router.refresh();}
  const nav=(side=false)=><nav aria-label={side?"Admin sidebar":"Admin navigation"} className={side?styles.sideNav:styles.bottomNav}>{destinations.map(d=><Link href={d.path} key={d.path} aria-current={active===d.label?"page":undefined}><span><Icon name={d.icon}/></span>{d.label}</Link>)}</nav>;
  let screen:ReactNode=null;
  if(data){const segments=pathname.split("/").filter(Boolean).slice(1).map(value=>{try{return decodeURIComponent(value);}catch{return value;}});const key=segments[1];
    if(!segments.length)screen=<OverviewScreen/>;
    else if(segments[0]==="attendance")screen=<AttendanceScreen/>;
    else if(segments[0]==="members"){
      const member=data.members.find(m=>m.key===key);
      if(!key)screen=<MembersScreen/>;else if(key==="new")screen=<MemberForm key="new"/>;else if(member)screen=segments[2]==="edit"?<MemberForm member={member} key={member.key}/>:<ProfileScreen member={member}/>;
    }else if(segments[0]==="payments"){
      const period=data.periods.find(p=>p.key===key);screen=!key?<PaymentsScreen/>:period?<PaymentScreen period={period} record={segments[2]==="record"} key={`${period.key}-${segments[2]??"details"}`}/>:null;
    }else if(segments[0]==="analytics")screen=<AnalyticsScreen/>;
    else if(segments[0]==="inactive")screen=<MembersScreen mode="inactive"/>;
    else if(segments[0]==="archived")screen=<MembersScreen mode="archived"/>;
    else if(segments[0]==="reminders"){
      if(key==="batches"){const batch=data.batches.find(b=>b.key===segments[2]);screen=batch?<ReminderResults batch={batch}/>:null;}
      else screen=<RemindersScreen review={key==="review"}/>;
    }
  }
  return <AdminContext.Provider value={context}><div className={`${styles.app} ${focused?styles.focused:""}`}><a className={styles.skipLink} href="#admin-main">Skip to content</a><aside className={styles.sidebar}><Link href="/admin" className={styles.sideBrand}><Image src="/brand/logo.svg" width={184} height={56} alt="New Gold Gym 2.0" priority/></Link>{nav(true)}<nav aria-label="More admin tools" className={styles.secondaryNav}>{secondary.map(d=><Link href={d.path} key={d.path} aria-current={pathname.startsWith(d.path)?"page":undefined}><Icon name={d.icon}/>{d.label}</Link>)}</nav><p className={styles.sideFoot}>Asia/Karachi<br/><br/>Owner workspace<br/>Sample register</p></aside><div className={styles.workspace}><header className={styles.header}><Link href="/admin" className={styles.mobileBrand}><Image src="/brand/logo.svg" width={184} height={56} alt="New Gold Gym 2.0" priority/></Link><span className={styles.desktopOnly}>Gym administration</span><div className={styles.headerActions}>{data&&<time className={styles.desktopOnly}>{formatDate(data.today,{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</time>}<details className={styles.ownerMenu}><summary>Owner</summary><div><button disabled={refreshing} onClick={async()=>{setRefreshing(true);try{await refresh();notify("Register refreshed.");}catch(e){setLoadError((e as Error).message);}finally{setRefreshing(false);}}}>{refreshing?"Refreshing…":"Refresh records"}</button><button onClick={logout}>Log out</button></div></details></div></header><main id="admin-main" className={styles.main}>{loadError&&<div className={styles.formError} role="alert">{loadError}<button className={styles.secondary} onClick={()=>refresh().catch(e=>setLoadError(e.message))}>Try again</button></div>}{data?(screen??<Empty title="Record not found"><Link href="/admin/members">Return to members</Link></Empty>):!loadError?<p role="status">Opening the register…</p>:null}</main><footer className={styles.footer}><span>New Gold Gym 2.0</span><span>Sample register · Asia/Karachi</span></footer></div>{!focused&&nav()} {message&&<div role="status" aria-live="polite" className={styles.toast}><span>{message}</span><button aria-label="Dismiss notification" onClick={()=>setMessage("")}><Icon name="close" size={18}/></button></div>}{pendingHref&&<Modal title="Discard unsaved changes?" onClose={()=>setPendingHref("")}><p>Your edits have not been saved. Keep editing or discard them to leave this page.</p><div className={styles.dialogActions}><button className={styles.secondary} onClick={()=>setPendingHref("")}>Keep editing</button><button className={styles.primary} onClick={()=>{const next=pendingHref;setDirty(false);setPendingHref("");if(next==="logout"){fetch("/api/admin/logout",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"}).then(()=>{router.replace("/admin/login");router.refresh();});}else router.push(next);}}>Discard changes</button></div></Modal>}</div></AdminContext.Provider>;
}
