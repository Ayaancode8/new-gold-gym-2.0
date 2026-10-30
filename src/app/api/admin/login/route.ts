import type { NextRequest } from "next/server";
import { assertLoginAllowed, clearLoginFailures, createSession, credentialsValid, loginFailure, SESSION_COOKIE, SESSION_SECONDS } from "@/lib/admin/auth";
import { AdminError } from "@/lib/admin/domain";
import { body, failure, json, sameOrigin } from "@/lib/admin/http";
export const runtime="nodejs";
export async function POST(request: NextRequest){try{sameOrigin(request);assertLoginAllowed();const values=await body(request);if(!credentialsValid(values?.username,values?.password)){loginFailure();throw new AdminError("The username or password is incorrect.",401);}clearLoginFailures();const response=json({ok:true});response.cookies.set(SESSION_COOKIE,createSession(),{httpOnly:true,secure:request.nextUrl.protocol==="https:" || request.headers.get("x-forwarded-proto")==="https",sameSite:"strict",path:"/",maxAge:SESSION_SECONDS});return response;}catch(e){return failure(e);}}
