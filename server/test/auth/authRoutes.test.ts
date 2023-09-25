import { describe, expect, test, beforeAll, beforeEach, afterEach, jest, afterAll } from "@jest/globals";
import * as request from "supertest";
import app from "../../src/app";
import { clearMemberData, initMemberData, setupMemberData } from "../utils/memberTestUtils";
import AuthTestUtils from "../utils/authTestUtils";

const authTestUtils = new AuthTestUtils(app);

describe("Test auth routes", () => {
  // --------------------------- SETUP AND TEARDOWN --------------------------- \\
  beforeAll(async () => {
    // await initMemberData(); // Executes before the first test
    await setupMemberData();
  });

  beforeEach(async () => {
    // await setupMemberData(); // Executes before every test
  });

  afterAll(async () => {
    await clearMemberData(); // Executes after every test
  });

  // --------------------------- TESTS --------------------------- \\

  describe("POST /login", () => {
    test("should return 200 and a token when credentials are correct", async () => {
      // --- WHEN
      const response = await request(app).post("/api/auth/login").send({ username: "w.luft", password: "s3cre7" });

      // --- THEN
      expect(response.status).toBe(200);

      // Check if the token is present
      expect(response.headers["set-cookie"]).toBeDefined();
      const cookies = response.headers["set-cookie"];
      const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
      expect(tokenCookie).toBeDefined();
    });

    test("should return 401 for incomplete credentials", async () => {
      // --- WHEN
      const response = await request(app).post("/api/auth/login").send({ username: "", password: "" });

      // --- THEN
      expect(response.status).toBe(401);
      expect(response.text).toBe("Credentials incomplete");
    });

    test("should return 401 for invalid username", async () => {
      // --- WHEN
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "invalidUser", password: "anyPassword" });

      // --- THEN
      expect(response.status).toBe(401);
    });

    test("should return 401 for invalid password", async () => {
      // --- WHEN
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "w.luft", password: "invalidPassword" });

      // --- THEN
      expect(response.status).toBe(401);
    });
  });

  describe("GET /user-data", () => {
    test("should return 200 and user data for valid token", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app).get("/api/auth/user-data").set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("mitgliedID");
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("permissions");
      expect(response.body).toHaveProperty("roles");
    });

    test("should return 401 for invalid or no token", async () => {
      // --- WHEN
      const response = await request(app).get("/api/auth/user-data").set("Cookie", "token=invalidToken");

      // --- THEN
      expect(response.statusCode).toBe(401);
    });
  });

  describe("POST /forgot-password", () => {
    test("should return 200 for valid email", async () => {
      // --- WHEN
      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "w.luft@studentische-beratung.de" });

      // --- THEN
      expect(response.statusCode).toBe(200);
    });

    // TODO: Mock SMTP server to fix test
    test("should return 404 for invalid email", async () => {
      // --- WHEN
      const response = await request(app).post("/api/auth/forgot-password").send({ email: "invalid" });

      // --- THEN
      expect(response.statusCode).toBe(404);
    });
  });

  describe("PATCH /reset-forgot-password", () => {
    // TODO: Reset password and get token from db and use it in test to fix test
    test("should return 200 for valid token and password", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const email = "w.luft@studentische-beratung.de";
      const validToken = authTestUtils.retrievePasswordResetTokenFromDB(email);
      const response = await request(app)
        .patch("/api/auth/reset-forgot-password")
        .send({
          email,
          key: validToken,
          newPassword: "newValidPassword",
        })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.statusCode).toBe(200);
    });

    test("should return 404 for invalid token or password", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const email = "w.luft@studentische-beratung.de";
      const invalidToken = "invalidToken";
      const response = await request(app)
        .patch("/api/auth/reset-forgot-password")
        .send({
          email,
          key: invalidToken,
          newPassword: "newValidPassword",
        })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe(`No password reset entry found with email ${email} and token ${invalidToken}`);
    });
  });

  describe("POST /logout", () => {
    test("should return 200 for successful logout", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app).post("/api/auth/logout").set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.statusCode).toBe(200);
    });
  });
});
