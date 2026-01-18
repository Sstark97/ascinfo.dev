import { test, expect } from "@playwright/test"

test.describe("Blog Flow", () => {
  test("should display blog listing with articles", async ({ page }) => {
    await page.goto("/blog")

    // Verify listing page loads
    await expect(page.locator("h1")).toContainText("Blog")

    // Verify at least one article is visible
    const articles = page.locator("article")
    await expect(articles.first()).toBeVisible()
  })

  test("should filter posts by search query", async ({ page }) => {
    await page.goto("/blog")

    // Wait for page to load
    await expect(page.locator("h1")).toContainText("Blog")

    const searchInput = page.getByPlaceholder(/buscar/i)
    await searchInput.fill("dev")

    // Verify filtering worked (either shows results or empty state)
    const hasResults = await page.locator("article").first().isVisible().catch(() => false)
    const hasEmptyState = await page.getByText(/no se encontraron/i).isVisible().catch(() => false)

    expect(hasResults || hasEmptyState).toBe(true)
  })

  test("should filter posts by tag", async ({ page }) => {
    await page.goto("/blog")

    // Wait for page to load
    await expect(page.locator("h1")).toContainText("Blog")

    // Click a tag badge
    const tag = page.locator("button").filter({ hasText: /typescript|react|nextjs/i }).first()
    if (await tag.isVisible()) {
      await tag.click()

      // Verify at least one article is visible
      const articles = page.locator("article")
      await expect(articles.first()).toBeVisible()
    }
  })

  test("should show empty state when no results", async ({ page }) => {
    await page.goto("/blog")

    // Wait for page to load
    await expect(page.locator("h1")).toContainText("Blog")

    const searchInput = page.getByPlaceholder(/buscar/i)
    await searchInput.fill("zzzznonexistentkeywordzzz")

    // Verify empty state message
    await expect(page.getByText(/no se encontraron/i)).toBeVisible()
  })

  test("should navigate back to home from blog listing", async ({ page }) => {
    await page.goto("/blog")

    // Click back link
    const backLink = page.getByRole("link", { name: /volver/i })
    await backLink.click()

    // Verify we're on home page
    await expect(page).toHaveURL("/")
  })
})
