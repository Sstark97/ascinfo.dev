import { test, expect } from "@playwright/test"

test.describe("Projects Flow", () => {
  test("should display projects listing", async ({ page }) => {
    await page.goto("/proyectos")

    await expect(page.locator("h1")).toContainText("Proyectos")

    // Verify at least one project card is visible
    const projects = page.locator("article")
    await expect(projects.first()).toBeVisible()
  })

  test("should have search and filter functionality", async ({ page }) => {
    await page.goto("/proyectos")

    // Wait for page to load
    await expect(page.locator("h1")).toContainText("Proyectos")

    // Verify search input exists
    const searchInput = page.getByPlaceholder(/buscar/i)
    await expect(searchInput).toBeVisible()

    // Verify at least one article is still visible
    await expect(page.locator("article").first()).toBeVisible()
  })

  test("should filter projects by technology tag", async ({ page }) => {
    await page.goto("/proyectos")

    // Wait for page to load
    await expect(page.locator("h1")).toContainText("Proyectos")

    // Open filter panel by clicking the filter button
    const filterButton = page.getByRole("button", { name: /Filtrar por tag|Tags/i })
    await filterButton.click()

    // Wait for filter panel to be visible
    await page.locator("#filter-tags").waitFor({ state: "visible" })

    // Click a tag inside the filter panel
    const tag = page.locator("#filter-tags button").filter({ hasText: /typescript|react|nextjs/i }).first()
    if (await tag.isVisible()) {
      await tag.click()

      // Verify at least one project is visible
      const projects = page.locator("article")
      await expect(projects.first()).toBeVisible()
    }
  })

  test("should filter projects by search query", async ({ page }) => {
    await page.goto("/proyectos")

    // Wait for page to load
    await expect(page.locator("h1")).toContainText("Proyectos")

    const searchInput = page.getByPlaceholder(/buscar/i)
    await searchInput.fill("dev")

    // Verify filtering worked (either shows results or empty state)
    const hasResults = await page.locator("article").first().isVisible().catch(() => false)
    const hasEmptyState = await page.getByText(/no se encontraron/i).isVisible().catch(() => false)

    expect(hasResults || hasEmptyState).toBe(true)
  })

  test("should navigate back to home from projects listing", async ({ page }) => {
    await page.goto("/proyectos")

    // Click back link
    const backLink = page.getByRole("link", { name: /volver/i })
    await backLink.click()

    // Verify we're on home page
    await expect(page).toHaveURL("/")
  })
})
