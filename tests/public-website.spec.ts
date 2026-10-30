import { expect, test, type Page } from "@playwright/test";

const tabNav = (page: Page) => page.getByRole("navigation", { name: "Explore New Gold Gym" });

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test("mobile destinations support direct links, refresh and browser history", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Train with purpose.", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Explore memberships" }).click();
  await expect(page.getByRole("heading", { name: "Find your plan." })).toBeVisible();
  await expect(tabNav(page).getByRole("link", { name: "Plans" })).toHaveAttribute("aria-current", "page");
  await tabNav(page).getByRole("link", { name: "Reviews" }).click();
  await expect(page.getByRole("heading", { name: "Member reviews." })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Find your plan." })).toBeVisible();
  await page.goForward();
  await expect(page.getByRole("heading", { name: "Member reviews." })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Member reviews." })).toBeVisible();
  await page.goto("/#gym");
  await expect(page.getByRole("heading", { name: "Inside New Gold." })).toBeVisible();
  await tabNav(page).getByRole("link", { name: "Discover" }).click();
  await page.getByRole("link", { name: "See gym" }).click();
  await expect(page).toHaveURL(/#gym$/);
});

for (const [name, price] of [["Basic", "1,500"], ["Trainer Basic", "5,000"], ["Trainer Advanced", "10,000"]]) {
  test(`${name} enquiry preserves the selected plan in a WhatsApp draft`, async ({ page, context }) => {
    await page.goto("/#plans");
    const trigger = page.getByRole("button", { name: new RegExp(`^${name} PKR`) });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name, exact: true })).toBeVisible();
    await expect(dialog.getByText("One-time admission fee: PKR 1,000")).toBeVisible();
    const action = dialog.getByRole("link", { name: "Enquire on WhatsApp" });
    const url = new URL((await action.getAttribute("href"))!);
    expect(url.origin + url.pathname).toBe("https://wa.me/923331267175");
    expect(url.searchParams.get("text")).toContain(`${name} membership at PKR ${price} per month`);
    expect(url.searchParams.get("text")).toContain("one-time PKR 1,000 admission fee");
    await context.route("https://wa.me/**", route => route.fulfill({ contentType: "text/html", body: "<title>Draft link verified</title>" }));
    const popupPromise = page.waitForEvent("popup");
    await action.click();
    const popup = await popupPromise;
    await expect(popup).toHaveTitle("Draft link verified");
    await popup.close();
    await dialog.getByRole("button", { name: "Done", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
}

test("contact is available on every screen with real phone and honest location details", async ({ page }) => {
  await page.goto("/");
  for (const label of ["Discover", "Gym", "Plans", "Reviews"]) {
    await tabNav(page).getByRole("link", { name: label }).click();
    const trigger = page.getByRole("button", { name: "Contact New Gold Gym", exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("Address to be confirmed")).toBeVisible();
    await expect(dialog.getByText("Contact us for current timings.")).toBeVisible();
    await expect(dialog.getByRole("link", { name: "+92 333 1267175", exact: true })).toBeVisible();
    await expect(dialog).not.toContainText(/Mock/);
    await dialog.getByRole("button", { name: "Done", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});

test("enquiry traps keyboard focus, closes with Escape or backdrop, and restores scrolling", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Contact New Gold Gym", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "Close enquiry" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Done", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Close enquiry" })).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await trigger.click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(dialog).not.toBeVisible();
});

test("bottom sheet can be dragged down and a short drag returns to rest", async ({ page }) => {
  await page.goto("/#plans");
  await page.getByRole("button", { name: /^Basic PKR/ }).click();
  const dialog = page.getByRole("dialog");
  const handle = page.getByTestId("sheet-drag-handle");
  await expect(handle).toBeVisible();
  await expect.poll(async () => handle.boundingBox().then(box => Math.round(box!.y))).toBeGreaterThan(100);
  const box = (await handle.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + 18);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + 48, { steps: 12 });
  await page.waitForTimeout(120);
  await page.mouse.up();
  await expect(dialog).toBeVisible();
  await expect.poll(async () => Math.abs(((await handle.boundingBox())?.y ?? 0) - box.y)).toBeLessThan(2);
  const resting = (await handle.boundingBox())!;
  await page.mouse.move(resting.x + resting.width / 2, resting.y + 18);
  await page.mouse.down();
  await page.mouse.move(resting.x + resting.width / 2, resting.y + 200, { steps: 15 });
  await page.mouse.up();
  await expect(dialog).not.toBeVisible();
});

test("all gym photos open completely with an accessible dismiss action", async ({ page }) => {
  await page.goto("/#gym");
  for (const label of ["Gym floor", "Machines", "Free weights"]) {
    const trigger = page.getByRole("button", { name: `View complete photo: ${label}`, exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("img")).toHaveCSS("object-fit", "contain");
    await expect(dialog.getByRole("img")).toBeVisible();
    await dialog.getByRole("button", { name: "Close photo viewer" }).click();
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});

test("desktop homepage, anchors and dialog preserve mobile selection across resizing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Memberships" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1500);
  await page.getByRole("button", { name: "Enquire about this plan" }).nth(1).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Trainer Basic", exact: true })).toBeVisible();
  const panel = dialog.locator("section");
  expect((await panel.boundingBox())!.width).toBe(480);
  await dialog.getByRole("button", { name: "Done", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: "Find your plan." })).toBeVisible();
  await expect(tabNav(page).getByRole("link", { name: "Plans" })).toHaveAttribute("aria-current", "page");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1500);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`layout and controls fit at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    if (width < 1024) {
      for (const label of ["Discover", "Gym", "Plans", "Reviews"]) {
        await tabNav(page).getByRole("link", { name: label }).click();
        await noOverflow(page);
      }
      const sizes = await tabNav(page).getByRole("link").evaluateAll(elements => elements.map(el => ({ w: el.getBoundingClientRect().width, h: el.getBoundingClientRect().height })));
      expect(sizes.every(size => size.w >= 44 && size.h >= 44)).toBe(true);
    } else {
      await noOverflow(page);
      await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}

test("200 percent text remains readable without horizontal overflow", async ({ page }) => {
  await page.goto("/#plans");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  await noOverflow(page);
  await page.getByRole("button", { name: /^Trainer Advanced PKR/ }).click();
  await expect(page.getByRole("dialog").getByRole("link", { name: "Enquire on WhatsApp" })).toBeVisible();
  await noOverflow(page);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await tabNav(page).getByRole("link", { name: "Reviews" }).click();
  await noOverflow(page);
});

test("reduced motion keeps all functionality and stable initial rendering", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#plans");
  await expect(page.getByRole("heading", { name: "Find your plan." })).toBeVisible();
  await page.getByRole("button", { name: /^Basic PKR/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.getByRole("dialog").locator("section").evaluate(el => getComputedStyle(el).transform)).toMatch(/none|matrix\(1, 0, 0, 1, 0, 0\)/);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("metadata, local assets and complete hero artwork are present", async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on("request", request => { if (!request.url().startsWith(new URL(baseURL!).origin) && !request.url().startsWith("data:")) external.push(request.url()); });
  await page.goto("/");
  await expect(page).toHaveTitle("New Gold Gym 2.0 | Train with purpose.");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /images\/social.jpg$/);
  const hero = page.getByRole("img", { name: "New Gold Gym artwork with strength athletes and the words Today painful, Tomorrow powerful.", exact: true });
  const bounds = (await hero.boundingBox())!;
  expect(bounds.width / bounds.height).toBeCloseTo(2, 1);
  expect(external).toEqual([]);
  const admin = await page.request.get("/admin/");
  expect(admin.status()).toBe(200);
  expect(await admin.text()).toContain("Admin demo");
});
