import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, sessionValid } from "@/lib/admin/auth";
import { OwnerLogin } from "@/components/admin/login";
export const metadata:Metadata={title:"Owner login | New Gold Gym",robots:{index:false,follow:false}};
export default async function LoginPage(){if(sessionValid((await cookies()).get(SESSION_COOKIE)?.value))redirect("/admin");return <OwnerLogin/>;}
