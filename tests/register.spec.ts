import { prisma } from "@/client";
import { test, expect } from "@playwright/test";
import { resetDatabase } from "./utils/resetDatabase";
import { createUserAndSignIn } from "./utils/createUserAndSignIn";

test.describe("Register", () => {
  test.beforeEach(async ({ page }) => {
    await resetDatabase();
  });

  test("works", async ({ page }) => {
    await page.goto("/register");

    const usernameInput = page.getByLabel("Username");
    const passwordInput = page.getByLabel("Password");

    await usernameInput.fill("testuser");
    await passwordInput.fill("password123");
    await passwordInput.press("Enter");

    await expect(page).toHaveURL("/");
    await expect(page.getByText("Welcome, testuser")).toBeVisible();
  });

  test("username taken", async ({ page }) => {
    await prisma.user.create({
      data: {
        username: "testuser",
        passwordHash: "password123",
      },
    });
    await page.goto("/register");

    const usernameInput = page.getByLabel("Username");
    const passwordInput = page.getByLabel("Password");

    await usernameInput.fill("testuser");
    await passwordInput.fill("password123");
    await passwordInput.press("Enter");

    await expect(page).toHaveURL("/register");
    await expect(page.getByText("Username is already taken")).toBeVisible();
  });

  test("redirects authenticated user to their profile page", async ({
    page,
    context,
  }) => {
    await createUserAndSignIn("testuser", "password123", context);

    await page.goto("/register");

    await expect(page).toHaveURL("/profile");
    await expect(page.getByText("Welcome, testuser")).toBeVisible();
  });
});
