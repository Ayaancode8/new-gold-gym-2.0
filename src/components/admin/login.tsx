"use client";
import Image from "next/image";
import Link from "./navigation";
import styles from "./admin.module.css";

export function OwnerLogin(){
  return <main className={styles.login}><Link href="/" aria-label="New Gold Gym website"><Image src="/brand/logo.svg" width={184} height={56} alt="New Gold Gym 2.0" priority/></Link><div className={styles.loginPanel}><h1>Explore the admin demo</h1><p>Try managing members, attendance and payments with fictional sample records.</p><p>Changes stay in this browser. Use the Demo menu to reset the register whenever you like.</p><Link className={styles.primary} href="/admin">Open demo</Link><Link href="/" className={styles.textLink}>Back to the gym website</Link></div><p className={styles.loginFoot}>New Gold Gym 2.0 · Browser demo · No password needed</p></main>;
}
