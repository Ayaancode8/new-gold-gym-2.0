import { test, expect, type Page } from "@playwright/test";

const tabs = (page: Page) => page.getByRole("navigation", { name: "Admin navigation", exact: true });
const back = (page: Page, label: string) => page.locator("main").getByRole("link", { name: label, exact: true }).filter({ visible: true }).first();
const heading = (page: Page, name: string) => page.getByRole("heading", { name, exact: true });

async function openMore(page: Page) {
  await tabs(page).getByRole("link", { name: "More", exact: true }).click();
  await expect(heading(page, "More")).toBeVisible();
}

test("daily tabs and More provide access from every mobile task", async ({ page }) => {
  await page.goto("/admin/");
  await expect(heading(page, "Overview")).toBeVisible();
  await expect(tabs(page).getByRole("link")).toHaveText(["Overview", "Attendance", "Members", "Payments", "More"]);
  await expect(heading(page, "Recent attendance")).toHaveCount(0);
  for (const section of ["Overview", "Attendance", "Members", "Payments"]) {
    await tabs(page).getByRole("link", { name: section, exact: true }).click();
    await expect(heading(page, section)).toBeVisible();
    await expect(tabs(page).getByRole("link", { name: section, exact: true })).toHaveAttribute("aria-current", "page");
  }
  await openMore(page);
  const more = page.getByRole("navigation", { name: "More sections" });
  await expect(more.getByRole("link")).toHaveText(["Analytics", "Fee reminders", "Inactive members", "Archived members"]);
  for (const [label, title] of [["Analytics", "Analytics"], ["Fee reminders", "WhatsApp reminders"], ["Inactive members", "Inactive members"], ["Archived members", "Archived members"]]) {
    await more.getByRole("link", { name: label, exact: true }).click();
    await expect(heading(page, title)).toBeVisible();
    await expect(tabs(page).getByRole("link", { name: "More", exact: true })).toHaveAttribute("aria-current", "page");
    await openMore(page);
  }
  await page.reload();
  await expect(heading(page, "More")).toBeVisible();
  await page.goBack();
  await expect(heading(page, "Archived members")).toBeVisible();
  await page.goForward();
  await expect(heading(page, "More")).toBeVisible();

  for (const [route, active] of [["members/new", "Members"], ["members/demo-0142", "Members"], ["members/demo-0142/edit", "Members"], ["reminders/review?audience=3", "More"]]) {
    await page.goto(`/admin/#/${route}`);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(tabs(page)).toBeVisible();
    await expect(tabs(page).getByRole("link", { name: active, exact: true })).toHaveAttribute("aria-current", "page");
    await openMore(page);
  }
});

test("member editing restores profile and filtered list context across refresh", async ({ page }) => {
  await page.goto("/admin/#/members?q=Ahmed&filter=all&page=1");
  await heading(page, "Members").waitFor();
  const listURL = page.url();
  await page.getByRole("link", { name: "Ahmed Khan", exact: true }).click();
  await expect(heading(page, "Ahmed Khan")).toBeVisible();
  await page.getByLabel("Calendar month").fill("2026-10");
  const profileURL = page.url();
  await page.getByRole("link", { name: "Edit", exact: true }).click();
  await page.getByLabel("Full name", { exact: false }).fill("Ahmed Khan Updated");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(heading(page, "Ahmed Khan Updated")).toBeVisible();
  await expect(page).toHaveURL(profileURL);
  await page.reload();
  await expect(back(page, "Back to members")).toBeVisible();
  await back(page, "Back to members").click();
  await expect(page).toHaveURL(listURL);
  await expect(page.getByRole("searchbox")).toHaveValue("Ahmed");
  await expect(page.getByRole("button", { name: "All members", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("return links preserve source section, pagination and scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await page.goto("/admin/#/inactive?filter=recent&page=2");
  await heading(page, "Inactive members").waitFor();
  const listURL = page.url();
  const profileLink = page.locator("main table").getByRole("link").last();
  await profileLink.evaluate(element => element.scrollIntoView({ block: "center" }));
  const scrollY = await page.evaluate(() => window.scrollY);
  await profileLink.click();
  await expect(back(page, "Back to inactive members")).toBeVisible();
  await page.reload();
  await back(page, "Back to inactive members").click();
  await expect(page).toHaveURL(listURL);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(scrollY, 0);
});

test("payment save and Cancel retain the filtered fee register", async ({ page }) => {
  await page.goto("/admin/#/payments?filter=pending&page=2");
  await heading(page, "Payments").waitFor();
  const month = await page.getByLabel("Fee month").inputValue();
  await page.getByLabel("Fee month").fill(month);
  const listURL = page.url();
  await page.getByRole("link", { name: "Record payment", exact: true }).first().click();
  await expect(tabs(page).getByRole("link", { name: "Payments", exact: true })).toHaveAttribute("aria-current", "page");
  await page.getByLabel("Amount received", { exact: false }).fill("1");
  await page.getByRole("link", { name: "Cancel", exact: true }).click();
  await page.getByRole("button", { name: "Keep editing", exact: true }).click();
  await expect(page.getByLabel("Amount received", { exact: false })).toHaveValue("1");
  await page.getByRole("link", { name: "Cancel", exact: true }).click();
  await page.getByRole("button", { name: "Discard changes", exact: true }).click();
  await expect(page).toHaveURL(listURL);
  await page.getByRole("link", { name: "Record payment", exact: true }).first().click();
  await page.getByLabel("Amount received", { exact: false }).fill("1");
  await page.getByRole("button", { name: "Record payment", exact: true }).click();
  await expect(heading(page, "Payment details")).toBeVisible();
  await page.reload();
  await back(page, "Back to payments").click();
  await expect(page).toHaveURL(listURL);
  await expect(page.getByRole("button", { name: "Pending", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("dirty form navigation protects values and preserves browser Forward", async ({ page }) => {
  await page.goto("/admin/#/members?q=0142");
  await heading(page, "Members").waitFor();
  await page.getByRole("link", { name: "Ahmed Khan", exact: true }).click();
  const profileURL = page.url();
  await page.getByRole("link", { name: "Edit", exact: true }).click();
  const editURL = page.url();
  await page.getByLabel("Full name", { exact: false }).fill("Unsaved member name");
  for (const label of ["Attendance", "More"]) {
    await tabs(page).getByRole("link", { name: label, exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Keep editing", exact: true }).click();
    await expect(page.getByLabel("Full name", { exact: false })).toHaveValue("Unsaved member name");
    await expect(page).toHaveURL(editURL);
  }
  await page.getByRole("link", { name: "Cancel", exact: true }).click();
  await page.getByRole("button", { name: "Keep editing", exact: true }).click();
  await page.goBack();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Keep editing", exact: true }).click();
  await expect(page).toHaveURL(editURL);
  await expect(page.getByLabel("Full name", { exact: false })).toHaveValue("Unsaved member name");
  await page.goBack();
  await page.getByRole("button", { name: "Discard changes", exact: true }).click();
  await expect(page).toHaveURL(profileURL);
  await expect(heading(page, "Ahmed Khan")).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(editURL);
  await expect(page.getByLabel("Full name", { exact: false })).toHaveValue("Ahmed Khan");
  await page.getByLabel("Full name", { exact: false }).fill("Discard this name");
  await tabs(page).getByRole("link", { name: "More", exact: true }).click();
  await page.getByRole("button", { name: "Discard changes", exact: true }).click();
  await expect(heading(page, "More")).toBeVisible();
});

test("member corrections from recipients return through the profile", async ({ page }) => {
  await page.goto("/admin/#/reminders/review?audience=3&filter=excluded");
  await heading(page, "Review recipients").waitFor();
  const recipientsURL = page.url();
  await page.getByRole("link", { name: "Review member", exact: true }).last().click();
  await expect(heading(page, "Edit member")).toBeVisible();
  await expect(back(page, "Back to member profile")).toBeVisible();
  await page.getByRole("link", { name: "Cancel", exact: true }).click();
  await expect(page.getByLabel("Calendar month")).toBeVisible();
  await back(page, "Back to recipients").click();
  await expect(page).toHaveURL(recipientsURL);
});

test("direct-entry fallback and untrusted return destinations stay inside admin", async ({ page }) => {
  await page.goto("/admin/#/members/demo-0142");
  await expect(back(page, "Back to members")).toBeVisible();
  await page.evaluate(() => history.replaceState({ gymAdminNavigation: { route: "/admin/members/demo-0142", index: 0, scrollY: 0, parent: { route: "https://example.com/", index: -1, scrollY: 0 } } }, ""));
  await page.reload();
  await back(page, "Back to members").click();
  await expect(page).toHaveURL(/\/admin\/#\/members$/);
});

test("mobile layouts keep navigation and form actions accessible; desktop retains its sidebar", async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ["more", "members/new", "reminders/review?audience=7", "payments"]) {
      await page.goto(`/admin/#/${route}`);
      await page.locator("main h1").waitFor();
      await expect(tabs(page)).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const link of await tabs(page).getByRole("link").all()) {
        const box = await link.boundingBox();
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }
      if (route === "members/new") {
        const action = page.getByRole("button", { name: "Add member", exact: true });
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        const box = await action.boundingBox();
        const navBox = await tabs(page).boundingBox();
        expect(box!.y + box!.height).toBeLessThanOrEqual(navBox!.y);
      }
    }
  }
  await page.goto("/admin/#/more");
  const link = page.getByRole("navigation", { name: "More sections" }).getByRole("link", { name: "Analytics", exact: true });
  await link.focus();
  await expect(link).toBeFocused();
  expect(await link.evaluate(element => getComputedStyle(element).outlineStyle)).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(heading(page, "Analytics")).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/admin/");
  await expect(page.getByRole("navigation", { name: "Admin sidebar", exact: true }).getByRole("link")).toHaveText(["Overview", "Attendance", "Members", "Payments", "Analytics"]);
  await expect(page.getByRole("navigation", { name: "More admin tools", exact: true }).getByRole("link")).toHaveText(["Inactive members", "Archived members", "Fee reminders"]);
  await expect(tabs(page)).toBeHidden();
});
