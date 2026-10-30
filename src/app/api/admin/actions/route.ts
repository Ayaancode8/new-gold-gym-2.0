import type { NextRequest } from "next/server";
import { authenticated, body, failure, json, sameOrigin } from "@/lib/admin/http";
import { adminStore } from "@/lib/admin/store";
export const runtime="nodejs";
export async function POST(request: NextRequest){try{authenticated(request);sameOrigin(request);return json(await adminStore().action(await body(request)));}catch(e){return failure(e);}}
