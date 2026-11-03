"use client";

import Image from "next/image";
import Link from "./navigation";
import { BEFORE_ADMIN_NAVIGATE, holdAdminRoute, readAdminEntry, rememberAdminScroll, useNavigationEntryKey, usePathname, useRouter, type NavigationRequest } from "./navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { browserStore, DEMO_STORAGE_KEY } from "@/lib/admin/browser-store";
import { AdminError } from "@/lib/admin/domain";
import { formatDate } from "@/lib/admin/calendar";
import type { AdminCommand, AdminState } from "@/lib/admin/types";
import { AdminContext, FormIssue } from "./context";
import { AnalyticsScreen } from "./analytics-screen";
import { MemberForm, MembersScreen, ProfileScreen } from "./member-screens";
import { PaymentScreen, PaymentsScreen } from "./payment-screens";
import { AttendanceScreen, OverviewScreen } from "./register-screens";
import { ReminderResults, RemindersScreen } from "./reminder-screens";
import { Empty, Icon, Modal, PageHeading, type IconName } from "./primitives";
import styles from "./admin.module.css";

declare global { interface Window { __newGoldLeaveGuard?: (event: PopStateEvent) => void } }

const destinations:{path:string;label:string;icon:IconName}[]=[{path:"/admin",label:"Overview",icon:"overview"},{path:"/admin/attendance",label:"Attendance",icon:"attendance"},{path:"/admin/members",label:"Members",icon:"members"},{path:"/admin/payments",label:"Payments",icon:"payments"},{path:"/admin/analytics",label:"Analytics",icon:"analytics"}];
const secondary:{path:string;label:string;icon:IconName}[]=[{path:"/admin/inactive",label:"Inactive members",icon:"clock"},{path:"/admin/archived",label:"Archived members",icon:"archive"},{path:"/admin/reminders",label:"Fee reminders",icon:"chat"}];

const mobileDestinations = [...destinations.slice(0,4), {path:"/admin/more",label:"More",icon:"more" as const}];
const moreDestinations = [destinations[4], secondary[2], secondary[0], secondary[1]];
function MoreScreen(){
  return <><PageHeading title="More" description="More tools for managing your gym."/><nav aria-label="More sections" className={styles.moreSections}>{moreDestinations.map(d=><Link href={d.path} key={d.path}><Icon name={d.icon}/><span>{d.label}</span><Icon name="next"/></Link>)}</nav></>;
}

export function AdminPortal(){
  const [data,setData]=useState<AdminState|null>(null);const ref=useRef(data);ref.current=data;
  const [message,setMessage]=useState("");const [loadError,setLoadError]=useState("");const [dirty,setDirtyState]=useState(false);const [pendingNavigation,setPendingNavigation]=useState<(()=>void)|null>(null);const [refreshing,setRefreshing]=useState(false);
  const [resetOpen,setResetOpen]=useState(false);const [resetError,setResetError]=useState("");
  const dirtyRef=useRef(false);
  const setDirty=useCallback((value:boolean)=>{dirtyRef.current=value;setDirtyState(value);},[]);
  const submissions=useRef(new Map<string,string>());const pathname=usePathname();const router=useRouter();const entryKey=useNavigationEntryKey();
  const notify=useCallback((message:string)=>setMessage(message),[]);
  const refresh=useCallback(async()=>{const result=await browserStore().state();ref.current=result;setData(result);setLoadError("");},[]);
  const mutate=useCallback(async(command:AdminCommand,success?:string,submissionId?:string)=>{
    const key=JSON.stringify(command);const id=submissionId??submissions.current.get(key)??crypto.randomUUID();submissions.current.set(key,id);
    try{
      const result=await browserStore().action({revision:ref.current!.revision,submissionId:id,command});
      ref.current=result.state;setData(result.state);submissions.current.delete(key);if(success)notify(success);return {target:result.target};
    }catch(error){
      if(error instanceof AdminError && error.status===409)await refresh().catch(()=>{});
      throw new FormIssue(error instanceof Error?error.message:"The demo could not be saved.",error instanceof AdminError?error.field:undefined);
    }
  },[notify,refresh]);
  useEffect(()=>{refresh().catch(e=>setLoadError(e.message));},[refresh]);
  useEffect(()=>{const changed=(event:StorageEvent)=>{if((event.key===DEMO_STORAGE_KEY||event.key===null)&&!dirty)refresh().catch(e=>setLoadError(e.message));};window.addEventListener("storage",changed);return()=>window.removeEventListener("storage",changed);},[refresh,dirty]);
  const loaded=!!data;
  useEffect(()=>{
    const previous=window.history.scrollRestoration;window.history.scrollRestoration="manual";
    window.addEventListener("scroll",rememberAdminScroll,{passive:true});
    return()=>{window.history.scrollRestoration=previous;window.removeEventListener("scroll",rememberAdminScroll);};
  },[]);
  useEffect(()=>{
    if(!loaded)return;
    const scrollY=readAdminEntry().scrollY;
    document.getElementById("admin-main")?.focus({preventScroll:true});
    const frame=requestAnimationFrame(()=>window.scrollTo(0,scrollY));
    return()=>cancelAnimationFrame(frame);
  },[entryKey,loaded]);
  useEffect(()=>{if(!message)return;const timeout=setTimeout(()=>setMessage(""),6000);return()=>clearTimeout(timeout);},[message]);
  useEffect(()=>{const update=()=>{if(!dirty&&document.visibilityState==="visible")refresh().catch(e=>setLoadError(e.message));};const timer=setInterval(update,60000);window.addEventListener("focus",update);document.addEventListener("visibilitychange",update);return()=>{clearInterval(timer);window.removeEventListener("focus",update);document.removeEventListener("visibilitychange",update);};},[refresh,dirty]);
  useEffect(()=>{
    if(!dirty)return;
    const unload=(e:BeforeUnloadEvent)=>{if(dirtyRef.current){e.preventDefault();e.returnValue="";}};
    const request=(e:Event)=>{if(!dirtyRef.current)return;e.preventDefault();setPendingNavigation(()=>(e as NavigationRequest).detail.proceed);};
    const formURL=window.location.pathname+window.location.search+window.location.hash;
    const formHistoryState=window.history.state;const formEntry=readAdminEntry();let restoring=false;
    const back=(e:PopStateEvent)=>{
      if(!dirtyRef.current)return;
      if(restoring){restoring=false;holdAdminRoute();return;}
      const destination=window.location.pathname+window.location.search+window.location.hash;
      if(destination===formURL)return;
      e.stopImmediatePropagation();
      const delta=readAdminEntry().index-formEntry.index;
      if(delta!==0){
        restoring=true;holdAdminRoute(formEntry.route);window.history.go(-delta);
        setPendingNavigation(()=>()=>{window.history.go(delta);});
      }else{
        window.history.pushState(formHistoryState,"",formURL);
        setPendingNavigation(()=>()=>router.push(destination,{confirmed:true}));
      }
    };
    window.addEventListener("beforeunload",unload);window.addEventListener(BEFORE_ADMIN_NAVIGATE,request);window.__newGoldLeaveGuard=back;
    return()=>{window.removeEventListener("beforeunload",unload);window.removeEventListener(BEFORE_ADMIN_NAVIGATE,request);if(window.__newGoldLeaveGuard===back)delete window.__newGoldLeaveGuard;holdAdminRoute();};
  },[dirty,router]);
  const context=useMemo(()=>data?{data,mutate,refresh,notify,setDirty}:null,[data,mutate,refresh,notify,setDirty]);
  const active=pathname.startsWith("/admin/payments")?"Payments":pathname.startsWith("/admin/attendance")?"Attendance":pathname.startsWith("/admin/analytics")?"Analytics":pathname==="/admin"?"Overview":"Members";
  const mobileActive=pathname==="/admin/more"||moreDestinations.some(d=>pathname===d.path||pathname.startsWith(d.path+"/"))?"More":active;
  const focused=pathname.startsWith("/admin/reminders")||pathname.includes("/new")||pathname.endsWith("/edit")||pathname.endsWith("/record");
  function exitDemo(){router.push("/");}
  async function resetDemo(){setRefreshing(true);setResetError("");try{const result=await browserStore().reset();ref.current=result;setData(result);setLoadError("");setDirty(false);setResetOpen(false);submissions.current.clear();router.replace("/admin",{root:true,confirmed:true});notify("Demo reset to sample data.");}catch(e){setResetError((e as Error).message);}finally{setRefreshing(false);}}
  const nav=(side=false)=><nav aria-label={side?"Admin sidebar":"Admin navigation"} className={side?styles.sideNav:styles.bottomNav}>{(side?destinations:mobileDestinations).map(d=><Link root href={d.path} key={d.path} aria-current={(side?active:mobileActive)===d.label?"page":undefined}><span><Icon name={d.icon}/></span>{d.label}</Link>)}</nav>;
  let screen:ReactNode=null;
  if(data){const segments=pathname.split("/").filter(Boolean).slice(1).map(value=>{try{return decodeURIComponent(value);}catch{return value;}});const key=segments[1];
    if(!segments.length)screen=<OverviewScreen/>;
    else if(segments[0]==="attendance")screen=<AttendanceScreen/>;
    else if(segments[0]==="members"){
      const member=data.members.find(m=>m.key===key);
      if(!key)screen=<MembersScreen/>;else if(key==="new")screen=<MemberForm key="new"/>;else if(member)screen=segments[2]==="edit"?<MemberForm member={member} key={member.key}/>:<ProfileScreen member={member}/>;
    }else if(segments[0]==="payments"){
      const period=data.periods.find(p=>p.key===key);screen=!key?<PaymentsScreen/>:period?<PaymentScreen period={period} record={segments[2]==="record"} key={`${period.key}-${segments[2]??"details"}`}/>:null;
    }else if(segments[0]==="more")screen=<MoreScreen/>;
    else if(segments[0]==="analytics")screen=<AnalyticsScreen/>;
    else if(segments[0]==="inactive")screen=<MembersScreen mode="inactive"/>;
    else if(segments[0]==="archived")screen=<MembersScreen mode="archived"/>;
    else if(segments[0]==="reminders"){
      if(key==="batches"){const batch=data.batches.find(b=>b.key===segments[2]);screen=batch?<ReminderResults batch={batch}/>:null;}
      else screen=<RemindersScreen review={key==="review"}/>;
    }
  }
  return <AdminContext.Provider value={context}><div className={`${styles.app} ${focused?styles.focused:""}`}><a className={styles.skipLink} href="#admin-main" onClick={e=>{e.preventDefault();document.getElementById("admin-main")?.focus();}}>Skip to content</a><aside className={styles.sidebar}><Link root href="/admin" className={styles.sideBrand}><Image src="/brand/logo.svg" width={184} height={56} alt="New Gold Gym 2.0" priority/></Link>{nav(true)}<nav aria-label="More admin tools" className={styles.secondaryNav}>{secondary.map(d=><Link root href={d.path} key={d.path} aria-current={pathname.startsWith(d.path)?"page":undefined}><Icon name={d.icon}/>{d.label}</Link>)}</nav><p className={styles.sideFoot}>Asia/Karachi<br/><br/>Demo workspace<br/>Saved in this browser</p></aside><div className={styles.workspace}><header className={styles.header}><Link root href="/admin" className={styles.mobileBrand}><Image src="/brand/logo.svg" width={184} height={56} alt="New Gold Gym 2.0" priority/></Link><span className={styles.desktopOnly}>Admin demo</span><div className={styles.headerActions}>{data&&<time className={styles.desktopOnly}>{formatDate(data.today,{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</time>}<details className={styles.ownerMenu}><summary>Demo</summary><div><button disabled={refreshing} onClick={async()=>{setRefreshing(true);try{await refresh();notify("Register refreshed.");}catch(e){setLoadError((e as Error).message);}finally{setRefreshing(false);}}}>{refreshing?"Refreshing…":"Refresh records"}</button><button onClick={()=>{setResetError("");setResetOpen(true);}}>Reset demo data</button><button onClick={exitDemo}>Back to website</button></div></details></div></header><main id="admin-main" tabIndex={-1} className={styles.main}><p className={styles.demoNotice}>Demo · Fictional records. Changes are saved only in this browser. Reset anytime from the Demo menu.</p>{loadError&&<div className={styles.formError} role="alert">{loadError}<button className={styles.secondary} onClick={()=>refresh().catch(e=>setLoadError(e.message))}>Try again</button></div>}{data?(screen??<Empty title="Record not found"><Link href="/admin/members">Return to members</Link></Empty>):!loadError?<p role="status">Opening the register…</p>:null}</main><footer className={styles.footer}><span>New Gold Gym 2.0</span><span>Browser demo · Asia/Karachi</span></footer></div>{nav()} {message&&<div role="status" aria-live="polite" className={styles.toast}><span>{message}</span><button aria-label="Dismiss notification" onClick={()=>setMessage("")}><Icon name="close" size={18}/></button></div>}{resetOpen&&<Modal title="Reset demo data?" onClose={()=>!refreshing&&setResetOpen(false)}><p>This replaces this browser’s demo register with fresh fictional members, attendance and payments. Your demo edits and unsaved form entries will be cleared.</p>{resetError&&<p role="alert" className={styles.formError}>{resetError}</p>}<div className={styles.dialogActions}><button className={styles.secondary} disabled={refreshing} onClick={()=>setResetOpen(false)}>Keep demo data</button><button className={styles.primary} disabled={refreshing} onClick={resetDemo}>{refreshing?"Resetting…":"Reset demo"}</button></div></Modal>}{pendingNavigation&&<Modal title="Discard unsaved changes?" onClose={()=>setPendingNavigation(null)}><p>Your edits have not been saved. Keep editing or discard them to leave this page.</p><div className={styles.dialogActions}><button className={styles.secondary} onClick={()=>setPendingNavigation(null)}>Keep editing</button><button className={styles.primary} onClick={()=>{const next=pendingNavigation;setDirty(false);setPendingNavigation(null);next();}}>Discard changes</button></div></Modal>}</div></AdminContext.Provider>;
}
