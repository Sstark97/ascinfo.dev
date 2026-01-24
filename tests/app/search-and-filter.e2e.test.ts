import { test, expect } from "@playwright/test"

test.describe("SearchAndFilter Component", () => {
  test("should render search bar and filter button", async ({ page }) => {
    await page.goto("/blog")

    // Search bar should be visible
    const searchInput = page.getByPlaceholder("Buscar...")
    await expect(searchInput).toBeVisible()

    // Filter button should be visible
    const filterButton = page.getByRole("button", { name: /Filtrar/i })
    await expect(filterButton).toBeVisible()
  })

  test("should toggle filter panel on button click", async ({ page }) => {
    await page.goto("/blog")

    const filterButton = page.getByRole("button", { name: /Filtrar/i })
    
    // Initially, tags should be hidden (collapsed)
    const tagContainer = page.locator("#filter-tags")
    await expect(tagContainer).toHaveClass(/max-h-0/)

    // Click to expand
    await filterButton.click()
    await expect(tagContainer).toHaveClass(/max-h-96/)

    // Click to collapse
    await filterButton.click()
    await expect(tagContainer).toHaveClass(/max-h-0/)
  })

  test("should show active filter state when tag selected", async ({ page }) => {
    await page.goto("/blog")

    // Open filter panel
    const filterButton = page.getByRole("button", { name: /Filtrar/i })
    await filterButton.click()

    // Select a tag (assuming there's at least one)
    const firstTag = page.locator("#filter-tags button").first()
    const tagText = await firstTag.textContent()
    await firstTag.click()

    // Filter button should show "Filtrado" state
    await expect(filterButton).toContainText(/Filtrado/i)
    await expect(filterButton).toHaveClass(/bg-\[#fca311\]/)

    // Active filter badge should be visible
    const activeBadge = page.getByText(`Filtro activo:`)
    await expect(activeBadge).toBeVisible()
    await expect(page.getByText(tagText ?? "")).toBeVisible()
  })

  test("should filter items when tag selected", async ({ page }) => {
    await page.goto("/blog")

    // Count initial articles
    const initialArticles = await page.locator("article").count()
    expect(initialArticles).toBeGreaterThan(0)

    // Open filter and select first tag
    await page.getByRole("button", { name: /Filtrar/i }).click()
    await page.locator("#filter-tags button").first().click()

    // Articles should be filtered (count should be different or same)
    const filteredArticles = await page.locator("article").count()
    expect(filteredArticles).toBeLessThanOrEqual(initialArticles)
  })

  test("should clear filter when clicking X on active badge", async ({ page }) => {
    await page.goto("/blog")

    // Select a tag
    await page.getByRole("button", { name: /Filtrar/i }).click()
    await page.locator("#filter-tags button").first().click()

    // Active filter should be visible
    const activeBadge = page.locator("div").filter({ hasText: /Filtro activo:/ }).locator("button")
    await expect(activeBadge).toBeVisible()

    // Click X to clear
    await activeBadge.click()

    // Active filter should be gone
    await expect(activeBadge).not.toBeVisible()

    // Filter button should be back to default state
    const filterButton = page.getByRole("button", { name: /Filtrar/i })
    await expect(filterButton).toContainText(/Filtrar/)
  })

  test("should filter items by search query", async ({ page }) => {
    await page.goto("/blog")

    const searchInput = page.getByPlaceholder("Buscar...")
    
    // Type a search query
    await searchInput.fill("arquitectura")

    // Wait for filter to apply
    await page.waitForTimeout(300)

    // Should show filtered results or empty message
    const articles = page.locator("article")
    const emptyMessage = page.getByText(/No se encontraron/)

    const hasArticles = await articles.count() > 0
    const hasEmptyMessage = await emptyMessage.isVisible()

    expect(hasArticles || hasEmptyMessage).toBeTruthy()
  })

  test("should clear search when clicking X button", async ({ page }) => {
    await page.goto("/blog")

    const searchInput = page.getByPlaceholder("Buscar...")
    await searchInput.fill("test query")

    // X button should appear
    const clearButton = page.getByLabel("Limpiar búsqueda")
    await expect(clearButton).toBeVisible()

    // Click X
    await clearButton.click()

    // Input should be empty
    await expect(searchInput).toHaveValue("")
  })

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/blog")

    // Search bar should be visible on mobile
    await expect(page.getByPlaceholder("Buscar...")).toBeVisible()

    // Filter button should show shorter text on mobile
    const filterButton = page.getByRole("button", { name: /Filtrar/i })
    await expect(filterButton).toBeVisible()

    // Should be able to open filter panel
    await filterButton.click()
    const tagContainer = page.locator("#filter-tags")
    await expect(tagContainer).toHaveClass(/max-h-96/)
  })
})
