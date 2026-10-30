"use client";
import { useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { validDate } from "@/lib/admin/calendar";
const subscribe=(callback:()=>void)=>{const media=window.matchMedia("(min-width: 1024px)");media.addEventListener("change",callback);return()=>media.removeEventListener("change",callback);};
const desktop=()=>window.matchMedia("(min-width: 1024px)").matches;
export function usePageSize(){return useSyncExternalStore(subscribe,desktop,()=>false)?6:4;}
export function useQuery(){const params=useSearchParams();return {get:(key:string,fallback="")=>{const value=params.get(key)??fallback;if(["date","from","through"].includes(key)&&!validDate(value))return fallback;if(key==="month"&&!/^\d{4}-(0[1-9]|1[0-2])$/.test(value))return fallback;return value;},set:(values:Record<string,string>)=>{const next=new URLSearchParams(window.location.search);for(const [key,value]of Object.entries(values)){if(value)next.set(key,value);else next.delete(key);}window.history.replaceState(null,"",window.location.pathname+(next.size?"?"+next.toString():""));}};}
export function pageNumber(value:string,total:number,size:number){return Math.max(1,Math.min(Number(value)||1,Math.max(1,Math.ceil(total/size))));}
