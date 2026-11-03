"use client";

import Link, { useReturnTarget } from "./navigation";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { LayoutGroup, motion, useIsPresent, useReducedMotion } from "motion/react";
import { adminMotion } from "./motion";
import styles from "./admin.module.css";

export { AnimatePresence as ModalPresence } from "motion/react";

export type IconName="overview"|"attendance"|"members"|"payments"|"analytics"|"clock"|"archive"|"chat"|"search"|"plus"|"back"|"next"|"check"|"close"|"more";
export function Icon({name,size=22}:{name:IconName;size?:number}){
  const paths:Record<IconName,ReactNode>={
    more:<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    overview:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    attendance:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v5m10-5v5M3 10h18m-14 5 3 3 6-6"/></>,
    members:<><path d="M16 21v-3a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v3m16 0v-3a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="10" cy="7" r="4"/></>,
    payments:<><path d="M20 7V3H4v18h16V7H7V3m13 9h-7v6h7m-4-3h1"/></>,
    analytics:<><path d="M4 3v18h17M8 6h10M8 10h6m-6 4h12M8 18h5"/></>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
    archive:<><path d="M4 8v13h16V8M9 12h6"/><rect x="2" y="3" width="20" height="5" rx="1"/></>,
    chat:<><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l1.9-5.4A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 9h8m-8 4h5"/></>,
    search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,plus:<path d="M12 4v16M4 12h16"/>,back:<path d="m15 4-8 8 8 8"/>,next:<path d="m9 4 8 8-8 8"/>,check:<path d="m5 12 4 4L19 6"/>,close:<path d="m6 6 12 12M6 18 18 6"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
export function PageHeading({title,description,back,action}:{title:string;description?:string;back?:string;action?:ReactNode}){
  const destination=useReturnTarget(back??"/admin");
  return <div className={`${styles.heading} ${back?styles.supportHeading:""}`}>
    {back&&<Link back href={back} className={styles.mobileBack}><Icon name="back" size={18}/>{destination.label}</Link>}
    <div className={styles.headingLine}><h1>{title}</h1>{(action||back)&&<div className={styles.headingAction}>{back&&<Link back href={back} className={`${styles.secondary} ${styles.desktopBack}`}>{destination.label}</Link>}{action}</div>}</div>{description&&<p>{description}</p>}
  </div>;
}

export function Empty({title,children}:{title:string;children?:ReactNode}){return <div className={styles.empty}><h2>{title}</h2>{children&&<p>{children}</p>}</div>;}
export function Search({value,onChange,label="Search name or member ID"}:{value:string;onChange:(s:string)=>void;label?:string}){return <label className={styles.search}><Icon name="search"/><span className={styles.srOnly}>{label}</span><input type="search" value={value} onChange={e=>onChange(e.target.value)} placeholder={label}/></label>;}
export function Pager({page,total,size,onChange}:{page:number;total:number;size:number;onChange:(p:number)=>void}){return <div className={styles.pager}><span>{total?`${(page-1)*size+1}–${Math.min(page*size,total)} of ${total}`:"0 records"}</span><div><button className={styles.iconButton} disabled={page<=1} onClick={()=>onChange(page-1)} aria-label="Previous page"><Icon name="back"/></button><button className={styles.iconButton} disabled={page*size>=total} onClick={()=>onChange(page+1)} aria-label="Next page"><Icon name="next"/></button></div></div>;}
export function Filters({options,value,onChange,label}:{options:{value:string;label:string}[];value:string;onChange:(value:string)=>void;label:string}){
  const id=useId();const reduce=useReducedMotion();
  return <LayoutGroup id={id}><div className={styles.filters} role="group" aria-label={label}>{options.map(o=><button key={o.value} aria-pressed={o.value===value} onClick={()=>onChange(o.value)}>{o.value===value&&<motion.i aria-hidden="true" className={styles.filterSelection} layoutId={reduce?undefined:"selection"} transition={adminMotion.spring}/>}<span>{o.label}</span></button>)}</div></LayoutGroup>;
}
export function Field({label,name,error,help,children}:{label:string;name:string;error?:string;help?:string;children:ReactNode}){return <div className={styles.field}><label htmlFor={name}>{label}</label>{children}{error?<p id={`${name}-error`} className={styles.fieldError} role="alert">{error}</p>:help?<p id={`${name}-help`}>{help}</p>:null}</div>;}
// Presence can briefly keep two dialogs mounted when one task hands off to another.
// Count locks so the exiting dialog cannot unlock the page under its successor.
let dialogLocks=0;
let previousOverflow="";
let previousPadding="";
export function Modal({title,children,onClose}:{title:string;children:ReactNode;onClose:()=>void}){
  const ref=useRef<HTMLDialogElement>(null);const titleId=useId();
  const present=useIsPresent();const reduce=useReducedMotion();
  useEffect(()=>{
    const d=ref.current!;
    // Release native modality immediately on dismissal. The inert, non-modal
    // presentation can finish fading without blocking a new route or form.
    if(!present){d.setAttribute("open","");return()=>d.removeAttribute("open");}
    const previous=document.activeElement as HTMLElement|null;
    if(dialogLocks++===0){
      previousOverflow=document.body.style.overflow;previousPadding=document.body.style.paddingRight;
      const gutter=window.innerWidth-document.documentElement.clientWidth;
      if(gutter>0)document.body.style.paddingRight=`${parseFloat(getComputedStyle(document.body).paddingRight)+gutter}px`;
      document.body.style.overflow="hidden";
    }
    d.showModal();
    d.querySelector<HTMLButtonElement>("button")?.focus({preventScroll:true});
    return()=>{
      d.close();
      if(--dialogLocks===0){document.body.style.overflow=previousOverflow;document.body.style.paddingRight=previousPadding;}
      if(previous?.isConnected&&!document.querySelector("dialog:modal"))previous.focus({preventScroll:true});
    };
  },[present]);
  return <><motion.div className={styles.dialogScrim} aria-hidden="true" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduce?adminMotion.reducedFade:adminMotion.fade}}/>
    <motion.dialog ref={ref} className={styles.dialog} aria-labelledby={titleId} data-exiting={!present||undefined} inert={!present} aria-hidden={!present||undefined}
    initial={{opacity:0,y:reduce?0:"var(--dialog-travel)"}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduce?0:"var(--dialog-travel)"}}
    transition={reduce?{duration:adminMotion.reducedFade}:{...adminMotion.spring,opacity:{duration:adminMotion.fade}}}
    onKeyDown={e=>{
      if(e.key!=="Tab")return;
      const controls=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')).filter(el=>el.getClientRects().length>0);
      const first=controls[0];const last=controls.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
    }}
    onCancel={e=>{e.preventDefault();if(present)onClose();}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left || e.clientX>r.right || e.clientY<r.top || e.clientY>r.bottom)onClose();}}}>
    <div className={styles.dialogHeading}><h2 id={titleId}>{title}</h2><button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close dialog"><Icon name="close"/></button></div>{children}
  </motion.dialog></>;
}
