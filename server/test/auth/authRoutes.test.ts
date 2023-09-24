import { describe, expect, test, beforeAll, beforeEach, afterEach } from "@jest/globals";
import request = require("supertest");
import app from "../../src/app";
import { clearMemberData, initMemberData, setupMemberData } from "../utils/memberTestUtils";

describe("Test auth routes", () => {
  // --------------------------- SETUP AND TEARDOWN --------------------------- \\
  beforeAll(async () => {
    // await initMemberData(); // Executes before the first test
  });

  beforeEach(async () => {
    await setupMemberData(); // Executes before every test
  });

  afterEach(async () => {
    await clearMemberData(); // Executes after every test
  });

  // --------------------------- TESTS --------------------------- \\

  describe("POST /login", () => {
    test("should return 401 for incomplete credentials", async () => {
      const response = await request(app).post("/auth/login").send({ username: "", password: "" });

      expect(response.status).toBe(401);
      expect(response.text).toBe("Credentials incomplete");
    });

    // Additional test case to check the case when credentials are correct.
    test("should return 200 and a token when credentials are correct", async () => {
      // Modify the send object with correct username and password
      const response = await request(app).post("/auth/login").send({ username: "w.luft", password: "s3cre7" });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined; // Check if token is present in response
    });
  });
});
