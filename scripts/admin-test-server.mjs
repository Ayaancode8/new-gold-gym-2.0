import { spawn } from "node:child_process";
import { scryptSync } from "node:crypto";
const salt="0123456789abcdef0123456789abcdef";
const env={...process.env,ADMIN_USERNAME:"owner",ADMIN_PASSWORD_HASH:`${salt}:${scryptSync("admin-test-password",salt,64).toString("hex")}`,ADMIN_SESSION_SECRET:"test-session-secret-isolated-from-owner-credentials-0123456789",SITE_URL:"http://127.0.0.1:3010"};
const child=spawn(process.execPath,["node_modules/next/dist/bin/next","start","--hostname","127.0.0.1","--port","3010"],{env,stdio:"inherit"});
for(const signal of ["SIGINT","SIGTERM"])process.on(signal,()=>child.kill(signal));
child.on("exit",code=>process.exit(code??0));
