import { localToday } from "./calendar";
import { AdminError, applyCommand, ensurePeriods } from "./domain";
import { seedData } from "./seed";
import { toState } from "./selectors";
import { storageValid } from "./validation";
import type { ActionRequest, AdminData } from "./types";

export const DEMO_STORAGE_KEY = "new-gold-gym:demo-register:v1";

export class BrowserAdminStore {
  constructor(private storage: Pick<Storage, "getItem" | "setItem">, private today = localToday) {}

  private locked<T>(work: () => T): Promise<T> {
    // The synchronous fallback cannot interleave within a tab. Web Locks also
    // serialize read/modify/write operations between tabs on supported browsers.
    if (typeof window !== "undefined" && navigator.locks) {
      return navigator.locks.request(DEMO_STORAGE_KEY, work);
    }
    return Promise.resolve().then(work);
  }

  private write(data: AdminData) {
    try { this.storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data)); }
    catch { throw new AdminError("Browser storage is full or unavailable. Your changes were not saved. Allow site storage or free some space, then try again.", 503); }
  }

  private read(): AdminData {
    let raw: string | null;
    try { raw = this.storage.getItem(DEMO_STORAGE_KEY); }
    catch { throw new AdminError("Browser storage is unavailable. Allow storage for this site, then try again.", 503); }
    if (raw === null) {
      const data = seedData(this.today());
      this.write(data);
      return data;
    }
    let data: unknown;
    try { data = JSON.parse(raw); } catch { /* Report without silently replacing the saved demo. */ }
    if (!storageValid(data)) throw new AdminError("The saved demo could not be opened. Use Reset demo data in the Demo menu to start again.", 503);
    return data;
  }

  state() {
    return this.locked(() => {
      const data = this.read();
      const today = this.today();
      if (ensurePeriods(data, today)) { data.revision++; this.write(data); }
      return toState(data, today);
    });
  }

  action(request: ActionRequest) {
    return this.locked(() => {
      if (!Number.isSafeInteger(request.revision) || !/^[a-zA-Z0-9_-]{8,100}$/.test(request.submissionId)) {
        throw new AdminError("Invalid submission. Refresh the demo and try again.", 400);
      }
      const data = this.read();
      const today = this.today();
      const previous = data.submissions.find(s => s.id === request.submissionId);
      if (previous) return { state: toState(data, today), target: previous.target };
      if (data.revision !== request.revision) throw new AdminError("The demo changed in another tab. Review the refreshed records and try again.", 409);
      ensurePeriods(data, today);
      const result = applyCommand(data, request.command, today);
      data.revision++;
      data.submissions.push({ id: request.submissionId, ...result });
      this.write(data);
      return { state: toState(data, today), ...result };
    });
  }

  reset() {
    return this.locked(() => {
      const data = seedData(this.today());
      // Invalidate forms in other tabs, even when the previous data is damaged.
      data.revision = Date.now();
      this.write(data);
      return toState(data, this.today());
    });
  }
}

export function browserStore() {
  // Call only after hydration or from an event handler; never during prerender.
  let storage: Storage;
  try { storage = window.localStorage; }
  catch { throw new AdminError("Browser storage is unavailable. Allow storage for this site, then try again.", 503); }
  return new BrowserAdminStore(storage);
}
