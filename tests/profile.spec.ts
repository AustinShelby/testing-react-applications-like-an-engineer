import { test, expect } from "@playwright/test";
import { resetDatabase } from "./utils/resetDatabase";
import { createUserAndSignIn } from "./utils/createUserAndSignIn";

test.describe("Profile", () => {
  test.beforeEach(async () => {
    await resetDatabase();
  });

  test("authenticated user can create a new note", async ({
    page,
    context,
  }) => {
    await test.step(`Given I am an authenticated user in the 'Profile' page`, async () => {
      await createUserAndSignIn("testuser", "password123", context);
      await page.goto("/profile");
    });

    await test.step(`And I write a new note 'wow' and press 'Enter' twice`, async () => {
      const noteInput = page.getByLabel("Note");

      await noteInput.fill("wow");
      await noteInput.press("Enter");
      await noteInput.press("Enter");
    });

    await test.step(`Then I should see one new note with the content 'wow'`, async () => {
      await expect(page.getByTestId("note-content")).toHaveCount(1);
      await expect(page.getByTestId("note-content")).toHaveText("wow");
    });
  });
});
