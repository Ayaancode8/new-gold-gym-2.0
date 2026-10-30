import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { SESSION_COOKIE, sessionValid } from "@/lib/admin/auth";
import { adminStore } from "@/lib/admin/store";
import { AdminPortal } from "@/components/admin/portal";
export const runtime="nodejs";
export const metadata:Metadata={title:"Administration | New Gold Gym",robots:{index:false,follow:false}};
export default async function AdminPage({params}:{params:Promise<{path?:string[]}>}){
  const {path=[]}=await params;const route="/admin"+(path.length?"/"+path.map(encodeURIComponent).join("/"):"");
  if(!sessionValid((await cookies()).get(SESSION_COOKIE)?.value))redirect("/admin/login?next="+encodeURIComponent(route));
  if(path.length && !["attendance","members","payments","analytics","inactive","archived","reminders"].includes(path[0]))notFound();
  let initialState=null;let initialError:string|undefined;
  try{initialState=await adminStore().state();}catch(e){initialError=e instanceof Error?e.message:"The register could not be opened.";}
  return <AdminPortal initialState={initialState} initialError={initialError}/>;
}
