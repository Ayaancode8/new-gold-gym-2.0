import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, sessionValid } from "./auth";
import { AdminError } from "./domain";

export function json(data: unknown,status=200){return NextResponse.json(data,{status,headers:{"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"}});}
export function authenticated(request: NextRequest){if(!sessionValid(request.cookies.get(SESSION_COOKIE)?.value))throw new AdminError("Your owner session has ended. Please log in again.",401);}
export function sameOrigin(request: NextRequest){
  const origin=request.headers.get("origin");
  const forwarded=request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  const protocol=forwarded==="https"||forwarded==="http"?forwarded+":":request.nextUrl.protocol;
  const expected=process.env.SITE_URL?new URL(process.env.SITE_URL).origin:`${protocol}//${request.headers.get("host")??request.nextUrl.host}`;
  if(!origin || origin!==expected)throw new AdminError("This request did not come from the admin portal.",403);
}
export async function body(request: NextRequest){
  if(!request.headers.get("content-type")?.startsWith("application/json"))throw new AdminError("Send a valid JSON request.",400);
  const raw=await request.text();if(raw.length>16000)throw new AdminError("This request is too large.",413);try{return JSON.parse(raw);}catch{throw new AdminError("This request is not valid JSON.",400);}
}
export function failure(error: unknown){
  if(error instanceof AdminError)return json({error:error.message,...(error.field?{field:error.field}:{})},error.status);
  console.error("Admin operation failed:",error instanceof Error?error.message:"Unknown error");return json({error:"The request could not be completed. Your entries have been preserved. Please try again."},500);
}
