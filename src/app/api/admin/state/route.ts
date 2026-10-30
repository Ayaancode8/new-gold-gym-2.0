import type { NextRequest } from "next/server";
import { authenticated, failure, json } from "@/lib/admin/http";
import { adminStore } from "@/lib/admin/store";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request: NextRequest){try{authenticated(request);return json(await adminStore().state());}catch(e){return failure(e);}}
