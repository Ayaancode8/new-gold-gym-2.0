import type { Metadata } from "next";
import { OwnerLogin } from "@/components/admin/login";
export const metadata: Metadata = { title: "Explore the admin demo | New Gold Gym", robots: { index: false, follow: false } };
export default function LoginPage() { return <OwnerLogin/>; }
