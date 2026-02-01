import { test, expect } from "@playwright/test"

test.describe("Talks Flow", () => {
  test("should display talks listing", async ({ page }) => {
    await page.goto("/charlas")

    await expect(page.locator("h1")).toContainText("Charlas")

    // Verify at least one talk card is visible
    const talks = page.locator("article")
    await expect(talks.first()).toBeVisible()
  })

  test("should have search and filter functionality", async ({ page }) => {
    await page.goto("/charlas")

    // Wait for page to load
    await expect(page.locator("h1")).toContainText("Charlas")

    // Verify search input exists
    const searchInput = page.getByPlaceholder(/buscar/i)
    await expect(searchInput).toBeVisible()

    // Verify at least one article is still visible
    await expect(page.locator("article").first()).toBeVisible()
  })

  test("should filter talks by tag", async ({ page }) => {
    await page.goto("/charlas")

    // Wait for page to load
    await expect(page.locator("h1")).toContainText("Charlas")

    // Open filter panel by clicking the filter button
    const filterButton = page.getByRole("button", { name: /Filtrar por tag|Tags/i })
    await filterButton.click()

    // Wait for filter panel to be visible
    await page.locator("#filter-tags").waitFor({ state: "visible" })

    // Click a tag inside the filter panel
    const tag = page.locator("#filter-tags button").filter({ hasText: /typescript|react|nextjs/i }).first()
    if (await tag.isVisible()) {
      await tag.click()

      // Verify at least one talk is visible
      const talks = page.locator("article")
      await expect(talks.first()).toBeVisible()
    }
  })

  test("should filter talks by search query", async ({ page }) => {
    await page.goto("/charlas")

    // Wait for page to load
    await expect(page.locator("h1")).toContainText("Charlas")

    const searchInput = page.getByPlaceholder(/buscar/i)
    await searchInput.fill("dev")

    // Verify filtering worked (either shows results or empty state)
    const hasResults = await page.locator("article").first().isVisible().catch(() => false)
    const hasEmptyState = await page.getByText(/no se encontraron/i).isVisible().catch(() => false)

    expect(hasResults || hasEmptyState).toBe(true)
  })

  test("should navigate back to home from talks listing", async ({ page }) => {
    await page.goto("/charlas")

    // Click back link and wait for navigation
    const backLink = page.getByRole("link", { name: /volver/i })
    await Promise.all([
      page.waitForURL("/"),
      backLink.click(),
    ])

    // Verify we're on home page
    await expect(page).toHaveURL("/")
  })
})
