import { describe, expect, test, beforeAll, beforeEach, afterEach, jest, afterAll } from "@jest/globals";
import * as request from "supertest";
import app from "../../../src/app";
import { clearMemberData, initMemberData, setupMemberData } from "../../utils/memberTestUtils";
import AuthTestUtils from "../../utils/authTestUtils";

const authTestUtils = new AuthTestUtils(app);

describe("Test member routes", () => {
  // --------------------------- SETUP AND TEARDOWN --------------------------- \\
  beforeAll(async () => {
    // await initMemberData(); // Executes before the first test
    await setupMemberData();
  });

  beforeEach(async () => {
    // await setupMemberData(); // Executes before every test
  });

  afterAll(async () => {
    await clearMemberData();
    await setupMemberData(); // Executes after every test
  });

  // --------------------------- TESTS --------------------------- \\

  describe("POST /permissions", () => {
    test("should return 201 and the new entry in mitglied_has_berechtigung", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app)
        .post("/api/users/permissions")
        .send({ memberID: 8167, permissionID: 8 })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(201);
      expect(response.text).toBe("Created");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("mitgliedID");
      expect(response.body).toHaveProperty("berechtigungID");
    });
  });
});
