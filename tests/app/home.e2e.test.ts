import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("should display profile information", async ({ page }) => {
    await page.goto("/")

    // Profile block should be visible (H2 visible heading)
    await expect(page.getByRole("heading", { level: 2, name: /Aitor Santana/i })).toBeVisible()
  })

  test("should display navigation dock", async ({ page }) => {
    await page.goto("/")

    // Navigation links should be visible
    const blogLink = page.getByRole("link", { name: /blog/i }).first()
    await expect(blogLink).toBeVisible()
  })

  test("should navigate to blog from home", async ({ page }) => {
    await page.goto("/")

    const blogLink = page.getByRole("link", { name: /blog/i }).first()
    await Promise.all([
      page.waitForURL("/blog"),
      blogLink.click()
    ])

    await expect(page).toHaveURL("/blog")
    await expect(page.locator("h1")).toContainText("Blog")
  })

  test("should navigate to projects from home", async ({ page }) => {
    await page.goto("/")

    const projectsLink = page.getByRole("link", { name: /proyectos/i }).first()
    await projectsLink.click()

    await expect(page).toHaveURL("/proyectos")
    await expect(page.locator("h1")).toContainText("Proyectos")
  })

  test("should navigate to talks from home", async ({ page }) => {
    await page.goto("/")

    const talksLink = page.getByRole("link", { name: /charlas/i }).first()
    await talksLink.click()

    await expect(page).toHaveURL("/charlas")
    await expect(page.locator("h1")).toContainText("Charlas")
  })

  test("should display bento grid layout", async ({ page }) => {
    await page.goto("/")

    // Verify the main container is visible
    const mainContent = page.locator("main")
    await expect(mainContent).toBeVisible()

    // Profile heading should be visible (H2 visible heading)
    await expect(page.getByRole("heading", { level: 2, name: /Aitor Santana/i })).toBeVisible()
  })
})
