import { describe, expect, test, beforeAll, beforeEach, afterEach, jest, afterAll } from "@jest/globals";
import * as request from "supertest";
import app from "../../../src/app";
import MemberTestUtils from "../../utils/memberTestUtils";
import AuthTestUtils from "../../utils/authTestUtils";
import { createCurrentTimestamp } from "../../../src/utils/dateUtils";

const authTestUtils = new AuthTestUtils(app);
const memberTestUtils = new MemberTestUtils(app);

// --------------------------- SETUP AND TEARDOWN --------------------------- \\
beforeAll(() => {
  //try {
  return memberTestUtils.initMemberData();
  // await setupMemberData();
  // } catch (error) {
  //console.log(error);
  // } // Executes after every test
  // await initMemberData(); // Executes before the first test
  // await setupMemberData();
});

beforeEach(() => {
  return memberTestUtils.setupMemberData(); // Executes before every test
});

afterEach(() => {
  return memberTestUtils.clearMemberData();
});

afterAll(() => {
  return memberTestUtils.clearInitMemberData();
});

// --------------------------- TESTS --------------------------- \\

// -----------------------GET ROUTES-----------------------

describe("GET / get IP", () => {
  test("should return 200 for getting a IP", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app).get("/api/trainees/ip/62").send().set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.projektname).toBe("JE7 Analyse");
  });
});
