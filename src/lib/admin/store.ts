import { mkdir, readFile, writeFile, rename, unlink, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { localToday } from "./calendar";
import { AdminError, applyCommand, ensurePeriods } from "./domain";
import { seedData } from "./seed";
import { toState } from "./selectors";
import type { ActionRequest, AdminData } from "./types";

export function dataPath(): string { return resolve(/* turbopackIgnore: true */ process.env.ADMIN_DATA_PATH ?? ".data/admin.json"); }
export { storageValid } from "./validation";
import { storageValid } from "./validation";
export class JsonAdminStore {
  constructor(public path: string, public today=localToday) {}
  private async locked<T>(work:()=>Promise<T>): Promise<T> {
    try{await mkdir(dirname(this.path),{recursive:true});}catch{throw new AdminError("The register cannot be opened. Check storage permissions and try again.",503);}
    const lock=this.path+".lock";const deadline=Date.now()+7000;
    while(true){
      try{await writeFile(lock,JSON.stringify({pid:process.pid,at:Date.now()}),{flag:"wx",mode:0o600});break;}
      catch(error){
        if((error as NodeJS.ErrnoException).code!=="EEXIST")throw new AdminError("The register is not writable. Your changes have not been saved.",503);
        // Only reclaim a stale lock when its owning local process no longer exists.
        try{if(Date.now()-(await stat(lock)).mtimeMs>30000){const owner=JSON.parse(await readFile(lock,"utf8"));let alive=true;try{process.kill(owner.pid,0);}catch(e){if((e as NodeJS.ErrnoException).code==="ESRCH")alive=false;}if(!alive)await unlink(lock);}}catch{/* Another request may have released the lock. */}
        if(Date.now()>deadline)throw new AdminError("The register is busy. Please try saving again.",503);
        await delay(30);
      }
    }
    try{return await work();}finally{await unlink(lock).catch(()=>{});}
  }
  private async write(data: AdminData, previous?: string){
    const temporary=`${this.path}.${randomUUID()}.tmp`;
    try{
      if(previous){const backup=`${this.path}.backup.tmp`;await writeFile(backup,previous,{mode:0o600});await rename(backup,this.path+".backup");}
      await writeFile(temporary,JSON.stringify(data,null,2)+"\n",{mode:0o600});await rename(temporary,this.path);
    }catch{await unlink(temporary).catch(()=>{});throw new AdminError("The register could not be saved. Your entered information is still available; try again.",503);}
  }
  private async read(): Promise<{data:AdminData;raw:string}> {
    let raw: string;
    try{raw=await readFile(this.path,"utf8");}catch(e){
      if((e as NodeJS.ErrnoException).code!=="ENOENT")throw new AdminError("The register could not be read. Check storage access and try again.",503);
      // Never replace a missing primary if a backup already exists.
      if(await stat(this.path+".backup").then(()=>true).catch(()=>false))throw new AdminError("The register is missing but a backup exists. Restore it before continuing.",503);
      const data=seedData(this.today());await this.write(data);return {data,raw:JSON.stringify(data)};
    }
    let data: unknown;try{data=JSON.parse(raw);}catch{throw new AdminError("The register file is damaged. Your backup has been preserved; restore it before continuing.",503);}
    if(!storageValid(data))throw new AdminError("The register format is not supported or is damaged. Restore a valid backup before continuing.",503);
    return {data,raw};
  }
  async state(){return this.locked(async()=>{const {data,raw}=await this.read();const today=this.today();if(ensurePeriods(data,today)){data.revision++;await this.write(data,raw);}return toState(data,today);});}
  async action(request: ActionRequest){return this.locked(async()=>{
    if(!request || !Number.isSafeInteger(request.revision) || typeof request.submissionId!=="string" || !/^[a-zA-Z0-9_-]{8,100}$/.test(request.submissionId))throw new AdminError("Invalid submission. Refresh and try again.",400);
    const {data,raw}=await this.read();const today=this.today();
    const previous=data.submissions.find(s=>s.id===request.submissionId);
    if(previous)return {state:toState(data,today),duplicate:true,target:previous.target};
    if(data.revision!==request.revision)throw new AdminError("The register changed in another window. Refresh the latest records, review your entries, and save again.",409);
    ensurePeriods(data,today);const result=applyCommand(data,request.command,today);data.revision++;data.submissions.push({id:request.submissionId,...result});await this.write(data,raw);return {state:toState(data,today),...result};
  });}
}
export function adminStore(){return new JsonAdminStore(dataPath());}
