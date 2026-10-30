import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin/auth";
import { authenticated, failure, json, sameOrigin } from "@/lib/admin/http";
export async function POST(request: NextRequest){try{authenticated(request);sameOrigin(request);const response=json({ok:true});response.cookies.set(SESSION_COOKIE,"",{httpOnly:true,sameSite:"strict",path:"/",maxAge:0});return response;}catch(e){return failure(e);}}
