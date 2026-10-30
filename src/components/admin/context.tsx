"use client";
import { createContext, useContext, useState } from "react";
import type { AdminCommand, AdminState } from "@/lib/admin/types";
export class FormIssue extends Error { constructor(message:string,public field?:string){super(message);} }
export interface AdminContextValue { data:AdminState; mutate:(command:AdminCommand,success?:string,submissionId?:string)=>Promise<{target?:string}>; refresh:()=>Promise<void>; notify:(message:string)=>void; setDirty:(dirty:boolean)=>void }
export const AdminContext=createContext<AdminContextValue|null>(null);
export function useAdmin(){const context=useContext(AdminContext);if(!context)throw new Error("Missing admin context");return context;}
export function useTask(){const [busy,setBusy]=useState(false);const [error,setError]=useState<FormIssue|null>(null);return {busy,error,clearError:()=>setError(null),run:async(work:()=>Promise<void>)=>{if(busy)return;setBusy(true);setError(null);try{await work();}catch(e){setError(e instanceof FormIssue?e:new FormIssue("Your changes could not be saved. Please try again."));}finally{setBusy(false);}}};}
