import { prisma } from "@/client";
import { test, expect } from "@playwright/test";
import { resetDatabase } from "./utils/resetDatabase";

test.describe("Home", () => {
  test.beforeEach(async () => {
    await resetDatabase();
  });

  test("lists notes in correct order", async ({ page }) => {
    await test.step(`Given there are three notes with different creation dates`, async () => {
      await prisma.user.create({
        data: {
          username: "testuser",
          passwordHash: "password123",
          notes: {
            createMany: {
              data: [
                {
                  id: 3,
                  content: "Third",
                  createdAt: new Date("2025-01-03T00:00:00Z"),
                },
                {
                  id: 2,
                  content: "Second",
                  createdAt: new Date("2025-01-02T00:00:00Z"),
                },
                {
                  id: 1,
                  content: "First",
                  createdAt: new Date("2025-01-01T00:00:00Z"),
                },
              ],
            },
          },
        },
      });
    });

    await test.step(`When I visit the home page`, async () => {
      await page.goto("/");
    });

    await test.step(`Then I should see the notes in reverse chronological order`, async () => {
      const noteContents = page.getByTestId("note-content");

      await expect(noteContents).toHaveCount(3);
      await expect(noteContents.nth(0)).toHaveText("Third");
      await expect(noteContents.nth(1)).toHaveText("Second");
      await expect(noteContents.nth(2)).toHaveText("First");
    });
  });
});
