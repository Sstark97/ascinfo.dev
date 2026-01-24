import { test, expect } from "@playwright/test";

test.describe("About Page", () => {
  test("should display page title and heading", async ({ page }) => {
    await page.goto("/sobre-mi");

    // Page title should be correct
    await expect(page).toHaveTitle(/Sobre mí.*Aitor Santana/i);

    // Main heading should be visible
    await expect(page.getByRole("heading", { name: /Sobre mí/i, level: 1 })).toBeVisible();
  });

  test("should display breadcrumbs navigation", async ({ page }) => {
    await page.goto("/sobre-mi");

    // Breadcrumb navigation should be visible
    const breadcrumb = page.getByRole("navigation", { name: /Breadcrumb/i });
    await expect(breadcrumb).toBeVisible();

    // Should have "Inicio" link
    const homeLink = breadcrumb.getByRole("link", { name: /Inicio/i });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute("href", "/");

    // Should have current page
    await expect(breadcrumb.getByText("Sobre mí")).toBeVisible();
  });

  test("should display bio introduction", async ({ page }) => {
    await page.goto("/sobre-mi");

    // Bio text should be visible - use first() to handle multiple matches
    await expect(page.getByText(/Software Crafter/i).first()).toBeVisible();
    await expect(page.getByText(/Lean Mind/i).first()).toBeVisible();
  });

  test("should display career timeline with positions", async ({ page }) => {
    await page.goto("/sobre-mi");

    // Timeline section heading should be visible
    await expect(page.getByRole("heading", { name: /Trayectoria Profesional/i })).toBeVisible();

    // Main positions should be visible
    await expect(page.getByRole("heading", { name: /Lean Mind/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Codemotion/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /NEWE/i })).toBeVisible();
  });

  test("should display Lean Mind internal projects", async ({ page }) => {
    await page.goto("/sobre-mi");

    // Internal projects should be visible
    await expect(page.getByRole("heading", { name: /Fintech & Payments/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Multimedia Platform/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /EdTech Platform/i })).toBeVisible();
  });

  test("should display active status badges", async ({ page }) => {
    await page.goto("/sobre-mi");

    // Active badges should be visible
    const activeBadges = page.getByText(/Activo|Actual/i);
    await expect(activeBadges.first()).toBeVisible();
  });

  test("should display technical approach section", async ({ page }) => {
    await page.goto("/sobre-mi");

    // Technical approach section should be visible
    await expect(page.getByRole("heading", { name: /Enfoque Técnico/i })).toBeVisible();

    // Values cards should be visible
    await expect(page.getByRole("heading", { name: /Software Craftsmanship/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Test-Driven Development/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Domain-Driven Design/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Clean Architecture/i })).toBeVisible();
  });

  test("should display tech stack section", async ({ page }) => {
    await page.goto("/sobre-mi");

    // Tech stack section should be visible
    await expect(page.getByRole("heading", { name: /Stack Técnico Actual/i })).toBeVisible();

    // Stack categories should be visible
    await expect(page.getByRole("heading", { name: /Backend/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Frontend/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /DevOps & Tools/i })).toBeVisible();

    // Some technologies should be visible (use first() as they may appear in projects too)
    await expect(page.getByText(".NET Core").first()).toBeVisible();
    await expect(page.getByText("React").first()).toBeVisible();
    await expect(page.getByText("Docker").first()).toBeVisible();
  });

  test("should have correct meta tags for SEO", async ({ page }) => {
    await page.goto("/sobre-mi");

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      "content",
      /Software Crafter.*Lean Mind/i
    );

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /Sobre mí.*Aitor Santana/i);

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute("content", "profile");

    const ogUrl = page.locator('meta[property="og:url"]');
    await expect(ogUrl).toHaveAttribute("content", /sobre-mi/i);
  });

  test("should have JSON-LD structured data", async ({ page }) => {
    await page.goto("/sobre-mi");

    // Check for JSON-LD script - there are multiple, we want the Person one (second)
    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScripts.nth(1)).toBeAttached();

    // Get and parse JSON-LD content (Person schema)
    const jsonLdContent = await jsonLdScripts.nth(1).textContent();
    expect(jsonLdContent).toBeTruthy();

    const structuredData = JSON.parse(jsonLdContent!);

    // Verify Person schema
    expect(structuredData["@type"]).toBe("Person");
    expect(structuredData.name).toBe("Aitor Santana");
    expect(structuredData.jobTitle).toBe("Software Crafter");

    // Verify worksFor organization
    expect(structuredData.worksFor).toBeDefined();
    expect(structuredData.worksFor.name).toBe("Lean Mind");

    // Verify sameAs (social links)
    expect(structuredData.sameAs).toBeDefined();
    expect(Array.isArray(structuredData.sameAs)).toBe(true);
    expect(structuredData.sameAs.length).toBeGreaterThan(0);

    // Verify knowsAbout array
    expect(structuredData.knowsAbout).toBeDefined();
    expect(Array.isArray(structuredData.knowsAbout)).toBe(true);

    // Verify ProfilePage schema
    expect(structuredData.mainEntityOfPage).toBeDefined();
    expect(structuredData.mainEntityOfPage["@type"]).toBe("ProfilePage");

    // Verify Breadcrumb schema (third JSON-LD)
    const breadcrumbContent = await jsonLdScripts.nth(2).textContent();
    expect(breadcrumbContent).toBeTruthy();

    const breadcrumbData = JSON.parse(breadcrumbContent!);
    expect(breadcrumbData["@type"]).toBe("BreadcrumbList");
    expect(breadcrumbData.itemListElement).toBeDefined();
    expect(Array.isArray(breadcrumbData.itemListElement)).toBe(true);
    expect(breadcrumbData.itemListElement.length).toBe(2); // Inicio + Sobre mí
  });

  test("should be accessible via navigation dock", async ({ page }) => {
    await page.goto("/");

    // Click on "Sobre mí" in navigation dock
    const aboutLink = page.getByRole("link", { name: /Sobre mí/i }).first();
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();

    // Should navigate to about page
    await expect(page).toHaveURL("/sobre-mi");
    await expect(page.getByRole("heading", { name: /Sobre mí/i, level: 1 })).toBeVisible();
  });

  test("should display career timeline with proper visual hierarchy", async ({ page }) => {
    await page.goto("/sobre-mi");

    // Timeline should be present
    const leanMindCard = page.locator("text=Lean Mind").first();
    await expect(leanMindCard).toBeVisible();

    // Check that timeline shows date ranges
    await expect(page.getByText(/Mar 2023.*Actualidad/i)).toBeVisible();
    await expect(page.getByText(/Feb 2025.*Actualidad/i)).toBeVisible();
  });

  test("should be responsive and display correctly on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/sobre-mi");

    // Main content should still be visible
    await expect(page.getByRole("heading", { name: /Sobre mí/i, level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Lean Mind/i })).toBeVisible();
  });
});
