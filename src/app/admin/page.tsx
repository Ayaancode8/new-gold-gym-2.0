import type { Metadata } from "next";
import { AdminPortal } from "@/components/admin/portal";
export const metadata: Metadata = { title: "Admin demo | New Gold Gym", robots: { index: false, follow: false } };
export default function AdminPage() { return <AdminPortal/>; }
