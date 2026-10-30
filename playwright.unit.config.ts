import { defineConfig } from "@playwright/test";
export default defineConfig({testDir:"./tests/admin",testMatch:"domain.spec.ts",fullyParallel:true,workers:3,reporter:"list"});
