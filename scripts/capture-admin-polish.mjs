import { chromium } from "@playwright/test";
import { mkdir, writeFile, copyFile } from "node:fs/promises";

const base=process.env.ADMIN_CAPTURE_URL??"http://localhost:3012";
const directory=".impeccable/review/admin-apple";
await mkdir(directory,{recursive:true});
for(const name of ["desktop-overview","mobile-overview","desktop-members","mobile-payment"]){
  await copyFile(`/tmp/apple-admin-${name}.png`,`${directory}/before-${name}.png`).catch(()=>{});
}
const browser=await chromium.launch({executablePath:"/opt/google/chrome/chrome",args:["--no-sandbox","--disable-dev-shm-usage"]});
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
const errors=[];page.on("pageerror",error=>errors.push(error.message));
await page.goto(base+"/admin/");await page.locator("main h1").waitFor();
const data=await page.evaluate(()=>JSON.parse(localStorage.getItem("new-gold-gym:demo-register:v1")));
const paid=data.periods.find(period=>data.receipts.some(receipt=>receipt.periodKey===period.key&&!receipt.voidedAt));
const unpaid=data.periods.find(period=>!data.receipts.some(receipt=>receipt.periodKey===period.key));
const routes=[ ["overview","/"],["attendance","/attendance"],["members","/members"],["payments","/payments"],["analytics","/analytics"],["more","/more"],["profile","/members/demo-0142"],["member-add","/members/new"],["member-edit","/members/demo-0142/edit"],["reminders","/reminders"],["recipients","/reminders/review?audience=3"],["inactive","/inactive"],["archived","/archived"],["payment-details",`/payments/${encodeURIComponent(paid.key)}`],["payment-record",`/payments/${encodeURIComponent(unpaid.key)}/record`] ];
const report=[];
async function capture(name,width){
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:`${directory}/${width}-${name}.png`,fullPage:true});
 report.push({name,width,url:page.url(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
}
for(const width of [390,1440,320,768,1024]){
 await page.setViewportSize({width,height:width>=1024?1000:844});
 for(const [name,route] of routes){
  if(![390,1440].includes(width)&&!["members","payments","member-add","analytics","profile"].includes(name))continue;
  await page.goto(base+"/admin/#"+route);await page.locator("main h1").waitFor();await capture(name,width);
 }
 if([390,1440].includes(width)){
  await page.goto(base+"/admin/login/");await page.locator("h1").waitFor();await capture("entry",width);
  await page.goto(base+"/admin/#/members/demo-0142");await page.getByRole("button",{name:"Archive member",exact:true}).click();await page.getByRole("dialog").waitFor();await capture("archive-dialog",width);await page.keyboard.press("Escape");await page.getByRole("dialog").waitFor({state:"detached"});
  await page.goto(base+"/admin/#/payments/"+encodeURIComponent(paid.key));await page.getByRole("button",{name:"Mark unpaid / correct",exact:true}).first().click();await page.getByRole("dialog").waitFor();await capture("correction-dialog",width);await page.keyboard.press("Escape");await page.getByRole("dialog").waitFor({state:"detached"});
  await page.goto(base+"/admin/#/members?q=no-such-record");await page.getByRole("heading",{name:"No matching members"}).waitFor();await capture("empty",width);
 }
}
// 200% desktop zoom equivalent: halve the CSS viewport while retaining content.
await page.setViewportSize({width:720,height:500});await page.goto(base+"/admin/#/members/new");await page.locator("main h1").waitFor();await capture("zoom-200-form",720);
const cdp=await page.context().newCDPSession(page);
const preferences=[];
for(const feature of ["prefers-reduced-transparency","prefers-contrast"]){
 await cdp.send("Emulation.setEmulatedMedia",{features:[{name:feature,value:feature==="prefers-contrast"?"more":"reduce"}]});
 preferences.push({feature,...await page.locator('nav[aria-label="Admin navigation"]').evaluate(el=>({background:getComputedStyle(el).backgroundColor,blur:getComputedStyle(el).backdropFilter}))});
 await capture(feature,720);
}
await cdp.send("Emulation.setEmulatedMedia",{features:[]});
await writeFile(`${directory}/capture-report.json`,JSON.stringify({report,preferences,errors},null,2));
console.log(JSON.stringify({captures:report.length,overflows:report.filter(item=>item.overflow),preferences,errors},null,2));await browser.close();
