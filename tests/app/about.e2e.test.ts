import { test, expect } from "@playwright/test";

test.describe("About Page - Critical User Flows", () => {
  test("should be accessible via navigation and display core content", async ({ page }) => {
    // Navigate from homepage
    await page.goto("/");

    const aboutLink = page.getByRole("link", { name: /Sobre mí/i }).first();
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();

    // Verify navigation worked
    await expect(page).toHaveURL("/sobre-mi");
    
    // Verify core structure exists (not specific text)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation", { name: /Breadcrumb/i })).toBeVisible();
  });

  test("should have correct SEO meta tags", async ({ page }) => {
    await page.goto("/sobre-mi");

    // Meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute("content", /.+/);

    // Open Graph
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /.+/);

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute("content", "profile");

    const ogUrl = page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveAttribute("content", /sobre-mi/i);
  });

  test("should have structured data (JSON-LD)", async ({ page }) => {
    await page.goto("/sobre-mi");

    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const count = await jsonLdScripts.count();
    
    // Should have at least 2 schemas (Person + Breadcrumb)
    expect(count).toBeGreaterThanOrEqual(2);

    // Verify Person schema exists
    const personSchema = await jsonLdScripts.nth(1).textContent();
    expect(personSchema).toBeTruthy();
    
    const personData = JSON.parse(personSchema!);
    expect(personData["@type"]).toBe("Person");
    expect(personData.name).toBeTruthy();
    expect(personData.jobTitle).toBeTruthy();

    // Verify Breadcrumb schema exists
    const breadcrumbSchema = await jsonLdScripts.nth(2).textContent();
    expect(breadcrumbSchema).toBeTruthy();
    
    const breadcrumbData = JSON.parse(breadcrumbSchema!);
    expect(breadcrumbData["@type"]).toBe("BreadcrumbList");
    expect(Array.isArray(breadcrumbData.itemListElement)).toBe(true);
  });

  test("should be responsive on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/sobre-mi");

    // Core content should be visible on mobile
    const mainHeading = page.getByRole("heading", { level: 1 });
    await expect(mainHeading).toBeVisible();

    // Timeline should be present
    const companyHeadings = page.getByRole("heading", { level: 3 });
    await expect(companyHeadings.first()).toBeVisible();
  });

  test("should load without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/sobre-mi");

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Should have no console errors
    expect(errors).toHaveLength(0);
  });
});
