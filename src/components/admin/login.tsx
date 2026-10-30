"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import styles from "./admin.module.css";

export function OwnerLogin(){
  const router=useRouter();const [busy,setBusy]=useState(false);const [error,setError]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(busy)return;setBusy(true);setError("");const form=new FormData(event.currentTarget);try{const response=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:form.get("username"),password:form.get("password")})});const result=await response.json();if(!response.ok){setError(result.error);return;}const next=new URLSearchParams(window.location.search).get("next");router.replace(next && (next==="/admin"||next.startsWith("/admin/")) && !next.startsWith("/admin/login")?next:"/admin");router.refresh();}catch{setError("Could not connect. Check your connection and try again.");}finally{setBusy(false);}}
  return <main className={styles.login}><Link href="/" aria-label="New Gold Gym website"><Image src="/brand/logo.svg" width={184} height={56} alt="New Gold Gym 2.0" priority/></Link><div className={styles.loginPanel}><h1>Owner login</h1><p>Your gym register, in one place.</p><form method="post" onSubmit={submit}><label htmlFor="username">Username</label><input id="username" name="username" autoComplete="username" defaultValue="owner" required maxLength={100}/><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required maxLength={512} aria-describedby={error?"login-error":undefined} aria-invalid={!!error}/>{error&&<p id="login-error" role="alert" className={styles.formError}>{error}</p>}<button className={styles.primary} disabled={busy}>{busy?"Logging in…":"Log in"}</button></form><Link href="/" className={styles.textLink}>Back to the gym website</Link></div><p className={styles.loginFoot}>New Gold Gym 2.0 · Owner access</p></main>;
}
