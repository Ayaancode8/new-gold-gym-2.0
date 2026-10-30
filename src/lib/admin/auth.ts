import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { AdminError } from "./domain";

export const SESSION_COOKIE="new_gold_owner";
export const SESSION_SECONDS=8*60*60;
function configuration(){
  const hash=process.env.ADMIN_PASSWORD_HASH;const secret=process.env.ADMIN_SESSION_SECRET;
  if(!hash || !/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(hash) || !secret || secret.length<32)throw new AdminError("Owner login is not configured. Contact the site administrator.",503);
  return {hash,secret,username:process.env.ADMIN_USERNAME??"owner"};
}
export function hashPassword(password: string,salt=randomBytes(16).toString("hex")){return `${salt}:${scryptSync(password,salt,64).toString("hex")}`;}
export function credentialsValid(username: unknown,password: unknown): boolean {
  const config=configuration();if(typeof username!=="string" || typeof password!=="string" || password.length>512)return false;
  const [salt,expected]=config.hash.split(":");const actual=scryptSync(password,salt,64);return timingSafeEqual(Buffer.from(expected,"hex"),actual) && username===config.username;
}
function signature(payload: string){const c=configuration();return createHmac("sha256",c.secret+":"+c.hash).update(payload).digest("base64url");}
export function createSession(now=Date.now()): string {const payload=Buffer.from(JSON.stringify({expires:now+SESSION_SECONDS*1000,nonce:randomBytes(16).toString("hex")})).toString("base64url");return `${payload}.${signature(payload)}`;}
export function sessionValid(value: string | undefined,now=Date.now()): boolean {
  if(!value || value.length>1000)return false;
  try{const [payload,sig,...extra]=value.split(".");if(!payload || !sig || extra.length)return false;const expected=Buffer.from(signature(payload));const actual=Buffer.from(sig);if(expected.length!==actual.length || !timingSafeEqual(expected,actual))return false;const session=JSON.parse(Buffer.from(payload,"base64url").toString());return Number.isSafeInteger(session.expires) && session.expires>now && session.expires<=now+SESSION_SECONDS*1000;}catch{return false;}
}
const globalAuth=globalThis as typeof globalThis & { ownerLoginFailures?: {attempts:number;until:number} };
export function assertLoginAllowed(now=Date.now()) {const entry=globalAuth.ownerLoginFailures;if(entry && entry.until>now && entry.attempts>=5)throw new AdminError("Too many login attempts. Try again in 15 minutes.",429);}
export function loginFailure(now=Date.now()){const previous=globalAuth.ownerLoginFailures;globalAuth.ownerLoginFailures={attempts:previous && previous.until>now?previous.attempts+1:1,until:previous && previous.until>now?previous.until:now+15*60*1000};}
export function clearLoginFailures(){delete globalAuth.ownerLoginFailures;}
