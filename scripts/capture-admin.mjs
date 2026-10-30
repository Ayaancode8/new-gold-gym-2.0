import { chromium } from "@playwright/test";
import { readFile, mkdir, writeFile } from "node:fs/promises";

const base=process.env.ADMIN_CAPTURE_URL??"http://localhost:3002";
const directory=".impeccable/review/admin";await mkdir(directory,{recursive:true});
const access=await readFile(".data/owner-access.txt","utf8");const password=access.match(/^Password: (.+)$/m)[1];
const browser=await chromium.launch({executablePath:"/opt/google/chrome/chrome",args:["--no-sandbox","--disable-dev-shm-usage"]});
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:"reduce"});const page=await context.newPage();
const errors=[];page.on("pageerror",e=>errors.push(e.message));
page.setDefaultTimeout(20000);await page.goto(base+"/admin/login");await page.waitForLoadState("networkidle");await page.getByRole("heading",{name:"Owner login"}).waitFor();await page.screenshot({path:`${directory}/mobile-login.png`,fullPage:true});
await page.getByLabel("Password",{exact:true}).fill(password);await page.getByRole("button",{name:"Log in",exact:true}).click();await page.waitForURL("**/admin");
const register=await (await page.request.get(base+"/api/admin/state")).json();
const paidPeriod=register.periods.find(p=>p.memberKey==="demo-0142"&&p.dueOn.startsWith(register.today.slice(0,7)));
const unpaidPeriod=register.periods.find(p=>p.memberKey==="demo-0143"&&p.dueOn.startsWith(register.today.slice(0,7)));
const routes=[ ["overview","/admin"],["attendance","/admin/attendance"],["members","/admin/members"],["payments","/admin/payments"],["analytics","/admin/analytics"],["profile","/admin/members/demo-0142"],["member-add","/admin/members/new"],["reminders","/admin/reminders"],["recipients","/admin/reminders/review?audience=3"],["inactive","/admin/inactive"],["archived","/admin/archived"] ];
routes.push(["payment-details",`/admin/payments/${encodeURIComponent(paidPeriod.key)}`],["payment-record",`/admin/payments/${encodeURIComponent(unpaidPeriod.key)}/record`]);
const report=[];
for(const width of (process.env.ADMIN_CAPTURE_MOBILE_ONLY?[390]:[390,1440,1024,768,320])){
  await page.setViewportSize({width,height:width>=1024?1000:844});
  for(const [name,route]of routes){if(![390,1440].includes(width)&&!["overview","members","member-add","analytics","profile"].includes(name))continue;await page.goto(base+route);await page.waitForLoadState("networkidle");await page.locator("main h1").waitFor();await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${directory}/${width===390?"mobile":width===1440?"desktop":width}-${name}.png`,fullPage:true});report.push({width,route,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),heading:await page.locator("h1").innerText()});}
  if([390,1440].includes(width)){
    await page.goto(base+`/admin/payments/${encodeURIComponent(paidPeriod.key)}`);await page.getByRole("button",{name:"Mark unpaid / correct",exact:true}).click();await page.getByRole("dialog").waitFor();await page.screenshot({path:`${directory}/${width===390?"mobile":"desktop"}-correct-payment.png`,fullPage:true});await page.keyboard.press("Escape");
    await page.goto(base+"/admin/members/demo-0142");await page.getByRole("button",{name:"Archive member",exact:true}).click();await page.getByRole("dialog").waitFor();await page.screenshot({path:`${directory}/${width===390?"mobile":"desktop"}-archive-dialog.png`,fullPage:true});await page.keyboard.press("Escape");
  }
}
await writeFile(`${directory}/capture-report.json`,JSON.stringify({report,errors},null,2));console.log(JSON.stringify({captures:report.length,overflows:report.filter(r=>r.overflow),errors},null,2));await browser.close();
