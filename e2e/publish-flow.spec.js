import { test, expect, devices } from "@playwright/test";

const viewports = [
  { name: "mobile", viewport: devices["iPhone 13"].viewport },
  { name: "desktop", viewport: { width: 1280, height: 800 } },
];

for (const viewport of viewports) {
  test.describe(`publish flow — ${viewport.name}`, () => {
    test.use({ viewport: viewport.viewport });

    test("a registered user can log in and publish a post", async ({ page, request }, testInfo) => {
      // Use a distinct UUID or random string segment instead of an absolute millisecond timestamp
      const cryptoToken = Math.random().toString(36).substring(2, 10);
      const email = `e2e-${testInfo.project.name}-${viewport.name}-${cryptoToken}@example.com`;
      const title = `Unique Post Content ${cryptoToken}`;

    

      // 2. Register user directly via backend API
      const registerRes = await request.post("http://localhost:4000/api/auth/register", {
        data: { email, displayName: "E2E Tester", password: "correcthorse" },
      });
      expect(registerRes.ok()).toBe(true);

      // Add this temporarily to see what's crashing the browser
      page.on('pageerror', exception => {
        console.log(`💥 BROWSER EXCEPTION: ${exception.message}`);
      });

      await page.goto("http://localhost:5173/login");


      // 3. Log in via UI
      await page.goto("http://localhost:5173/login");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill("correcthorse");
      await page.getByRole("button", { name: "Log In" }).click();
      await expect(page).toHaveURL("http://localhost:5173/");

      // 4. Navigate to editor & publish
      const writeLink = page.getByRole("link", { name: "Write", exact: true });
      await writeLink.scrollIntoViewIfNeeded();
      await writeLink.click();

      await page.getByLabel("Title").fill(title);
      await page.getByLabel("Body").fill("Published end to end.");

      const publishBtn = page.getByRole("button", { name: "Publish" });
      await publishBtn.scrollIntoViewIfNeeded();
      await publishBtn.click();

      // 5. Verify published post appears in the feed
      await expect(page).toHaveURL("http://localhost:5173/");
      const heading = page.getByRole("heading", { name: title });
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
    });
  });
}