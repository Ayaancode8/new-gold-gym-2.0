import { defineConfig } from "@playwright/test";
export default defineConfig({testDir:"./tests/admin",testMatch:["domain.spec.ts","browser-store.spec.ts"],fullyParallel:true,workers:3,reporter:"list"});
