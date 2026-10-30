import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
const root=".impeccable/review/admin";
const groups={
  "mobile-main":["mobile-overview","mobile-attendance","mobile-members","mobile-payments","mobile-analytics","mobile-profile"],
  "mobile-flows":["mobile-login","mobile-member-add","mobile-reminders","mobile-recipients","mobile-inactive","mobile-archived","mobile-payment-details","mobile-payment-record","mobile-correct-payment","mobile-archive-dialog"],
  "desktop-main":["desktop-overview","desktop-attendance","desktop-members","desktop-payments","desktop-analytics","desktop-profile"],
  "desktop-flows":["desktop-member-add","desktop-reminders","desktop-recipients","desktop-inactive","desktop-archived","desktop-payment-details","desktop-payment-record","desktop-correct-payment","desktop-archive-dialog"],
  "responsive":[...["1024","768","320"].flatMap(w=>["overview","members","member-add","analytics","profile"].map(s=>`${w}-${s}`))],
};
const browser=await chromium.launch({executablePath:"/opt/google/chrome/chrome",args:["--no-sandbox"]});
for(const [group,names]of Object.entries(groups)){
  const desktop=group.startsWith("desktop");const page=await browser.newPage({viewport:{width:desktop?1600:1500,height:1000}});
  const cards=await Promise.all(names.map(async name=>`<figure><figcaption>${name}</figcaption><img src="data:image/png;base64,${(await readFile(`${root}/${name}.png`)).toString("base64")}" /></figure>`));
  await page.setContent(`<style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#101511;color:#f2ede3;font:14px sans-serif}main{display:grid;grid-template-columns:repeat(${desktop?2:5},minmax(0,1fr));gap:24px}figure{margin:0}figcaption{padding:8px 0}img{width:100%;display:block}</style><main>${cards.join("")}</main>`);
  await page.locator("img").evaluateAll(images=>Promise.all(images.map(i=>i.decode())));await page.screenshot({path:`${root}/contact-${group}.png`,fullPage:true});await page.close();
}
await browser.close();console.log("Five contact sheets generated from the production captures.");
