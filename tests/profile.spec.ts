import { test, expect } from "@playwright/test";
import { resetDatabase } from "./utils/resetDatabase";
import { createUserAndSignIn } from "./utils/createUserAndSignIn";

test.describe("Profile", () => {
  test.beforeEach(async () => {
    await resetDatabase();
  });

  test("can create a new note", async ({ page, context }) => {
    await createUserAndSignIn("testuser", "password123", context);

    await page.goto("/profile");

    const noteInput = page.getByLabel("Note");

    await noteInput.fill("wow");
    await noteInput.press("Enter");

    // Show a bug that the button should be disabled when submitting the form
    await expect(page.getByTestId("note-content")).toHaveCount(1);
    await expect(page.getByTestId("note-content")).toHaveText("wow");
  });
});
