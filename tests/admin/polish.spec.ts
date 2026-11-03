import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768]) {
  test(`payment rows keep dates and actions separate at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/admin/#/payments");
    await expect(page.getByRole("heading", { name: "Payments", exact: true })).toBeVisible();
    const rows = page.locator("main table tbody tr");
    await expect(rows).toHaveCount(4);
    for (const row of await rows.all()) {
      const cells = row.locator("td");
      const date = await cells.filter({ hasText: /^(Paid|Due) / }).last().boundingBox();
      const action = row.getByRole("link").last();
      const box = await action.boundingBox();
      expect(date).not.toBeNull();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(date!.x + date!.width).toBeLessThanOrEqual(box!.x + 1);
      await action.scrollIntoViewIfNeeded();
      const visible = await action.boundingBox();
      const nav = await page.getByRole("navigation", { name: "Admin navigation", exact: true }).boundingBox();
      expect(visible!.y + visible!.height).toBeLessThanOrEqual(nav!.y + 1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`dialogs preserve focus, modality and scroll locking with ${reducedMotion} motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/admin/#/members/demo-0142");
    const trigger = page.getByRole("button", { name: "Archive member", exact: true });
    for (const method of ["escape", "cancel", "close", "backdrop"]) {
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
      await page.keyboard.press("Shift+Tab");
      expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
      if (reducedMotion === "reduce") expect(await dialog.evaluate(el => getComputedStyle(el).transform)).toBe("none");
      if (method === "escape") await page.keyboard.press("Escape");
      else if (method === "cancel") await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
      else if (method === "close") await dialog.getByRole("button", { name: "Close dialog" }).click();
      else await page.mouse.click(2, 2);
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
    }
    // Navigation keeps its focus target without outlining the whole workspace.
    await page.goto("/admin/#/members");
    await expect(page.locator("main h1")).toHaveText("Members");
    expect(await page.locator("main").evaluate(el => getComputedStyle(el).outlineStyle)).toBe("none");
  });
}
