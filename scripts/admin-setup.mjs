import { randomBytes, scryptSync } from "node:crypto";
import { mkdir, readFile, writeFile, chmod } from "node:fs/promises";

const existing=await readFile(".env.local","utf8").catch(e=>{if(e.code==="ENOENT")return "";throw e;});
if(/^ADMIN_PASSWORD_HASH=/m.test(existing) || /^ADMIN_SESSION_SECRET=/m.test(existing)){
  console.log("Owner configuration already exists in .env.local. Existing credentials were preserved.");
}else{
  const password=randomBytes(18).toString("base64url");const salt=randomBytes(16).toString("hex");const hash=`${salt}:${scryptSync(password,salt,64).toString("hex")}`;
  await writeFile(".env.local",existing+`\n# Local owner access\nADMIN_USERNAME=owner\nADMIN_PASSWORD_HASH=${hash}\nADMIN_SESSION_SECRET=${randomBytes(32).toString("hex")}\n`,{mode:0o600});await chmod(".env.local",0o600);
  await mkdir(".data",{recursive:true});
  await writeFile(".data/owner-access.txt",`New Gold Gym owner login\nURL: http://localhost:3000/admin\nUsername: owner\nPassword: ${password}\n\nKeep this local file private. The application uses only the password hash in .env.local.\n`,{mode:0o600});
  console.log("Owner login configured. Your username and generated password are in .data/owner-access.txt. Restart the dev server to load the configuration.");
}
