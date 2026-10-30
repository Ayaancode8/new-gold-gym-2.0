import { test, expect } from "@playwright/test";
import { BrowserAdminStore, DEMO_STORAGE_KEY } from "../../src/lib/admin/browser-store";

const today = () => "2026-10-30";
function memory() { const data = new Map<string,string>(); return { getItem: (key:string) => data.get(key) ?? null, setItem: (key:string,value:string) => { data.set(key,value); } }; }

test("browser register seeds, persists across store instances and deduplicates submissions", async () => {
  const storage=memory();const first=new BrowserAdminStore(storage,today);const data=await first.state();
  const request={revision:data.revision,submissionId:"unique-submission",command:{type:"attendance.mark" as const,memberKey:data.members.find(m=>m.id==="0206")!.key,date:today(),time:"12:30"}};
  const saved=await first.action(request);const replay=await new BrowserAdminStore(storage,today).action(request);
  expect(replay.state.attendance).toEqual(saved.state.attendance);
  expect((await new BrowserAdminStore(storage,today).state()).revision).toBe(saved.state.revision);
});
test("stale tabs and forms opened before reset cannot overwrite newer records",async()=>{
  const storage=memory();const a=new BrowserAdminStore(storage,today);const old=await a.state();await a.reset();
  await expect(a.action({revision:old.revision,submissionId:"stale-submission",command:{type:"member.archive",key:old.members[0].key}})).rejects.toThrow("changed in another tab");
  expect((await a.state()).members[0].archivedOn).toBeNull();
});
test("quota failures preserve the saved register and corruption requires explicit reset",async()=>{
  const storage=memory();const store=new BrowserAdminStore(storage,today);const initial=await store.state();const raw=storage.getItem(DEMO_STORAGE_KEY);
  const full=new BrowserAdminStore({getItem:storage.getItem,setItem:()=>{throw new Error("Quota exceeded");}},today);
  await expect(full.action({revision:initial.revision,submissionId:"quota-submission",command:{type:"member.archive",key:initial.members[0].key}})).rejects.toThrow("not saved");expect(storage.getItem(DEMO_STORAGE_KEY)).toBe(raw);
  storage.setItem(DEMO_STORAGE_KEY,"damaged");await expect(store.state()).rejects.toThrow("Reset demo data");expect(storage.getItem(DEMO_STORAGE_KEY)).toBe("damaged");await store.reset();expect((await store.state()).members).toHaveLength(126);
});
