import { prisma } from "@/client";
import { test, expect } from "@playwright/test";
import { resetDatabase } from "./utils/resetDatabase";
import { createUserAndSignIn } from "./utils/createUserAndSignIn";

test.describe("Register", () => {
  test.beforeEach(async () => {
    await resetDatabase();
  });

  test("register user with valid credentials and redirect to home page", async ({
    page,
  }) => {
    await test.step(`Given I am an unauthenticated user in the 'Register' page`, async () => {
      await page.goto("/register");
    });

    await test.step(`And I enter valid credentials and press 'Enter'`, async () => {
      const usernameInput = page.getByLabel("Username");
      const passwordInput = page.getByLabel("Password");

      await usernameInput.fill("testuser");
      await passwordInput.fill("password123");
      await passwordInput.press("Enter");
    });

    await test.step(`Then I should be registered successfully and redirected to the home page`, async () => {
      await expect(page).toHaveURL("/");
      await expect(page.getByText("Welcome, testuser")).toBeVisible();
    });
  });

  test("cannot register with taken username", async ({ page }) => {
    await test.step(`Given there is an existing user with username 'testuser'`, async () => {
      await prisma.user.create({
        data: {
          username: "testuser",
          passwordHash: "password123",
        },
      });
      await page.goto("/register");
    });

    await test.step(`And I try to register with the same username`, async () => {
      const usernameInput = page.getByLabel("Username");
      const passwordInput = page.getByLabel("Password");

      await usernameInput.fill("testuser");
      await passwordInput.fill("password123");
      await passwordInput.press("Enter");
    });

    await test.step(`Then I should see an error message and stay on the register page`, async () => {
      await expect(page).toHaveURL("/register");
      await expect(page.getByText("Username is already taken")).toBeVisible();
    });
  });

  test("redirects authenticated user to their profile page", async ({
    page,
    context,
  }) => {
    await test.step(`Given I am an authenticated user`, async () => {
      await createUserAndSignIn("testuser", "password123", context);
    });

    await test.step(`When I visit the 'Register' page`, async () => {
      await page.goto("/register");
    });

    await test.step(`Then I should be redirected to my profile page`, async () => {
      await expect(page).toHaveURL("/profile");
      await expect(page.getByText("Welcome, testuser")).toBeVisible();
    });
  });
});
