import { describe, expect, test, beforeAll, beforeEach, afterEach, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app";
import MemberTestUtils from "../../utils/memberTestUtils";
import AuthTestUtils from "../../utils/authTestUtils";
import EventsTestUtils from "../../utils/eventsTestUtils";

const authTestUtils = new AuthTestUtils(app);
const eventsTestUtils = new EventsTestUtils(app);
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

beforeEach(async () => {
  await memberTestUtils.setupMemberData();
  return eventsTestUtils.setupEventsData(); // Executes before every test
});

afterEach(async () => {
  await eventsTestUtils.clearEventsData();
  return memberTestUtils.clearMemberData();
});

afterAll(() => {
  return memberTestUtils.clearInitMemberData();
});

describe("Test events routes", () => {
  // --------------------------- TESTS --------------------------- \\
  describe("GET /events/{eventID}", () => {
    test("Should return 200 OK and the event", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const eventID = 7;
      const response = await request(app).get(`/api/events/${eventID}`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({ name: "Jahreshauptversammlung/Weihnachtsfeier" }));
    });
  });

  describe("GET /events/{eventID}/members", () => {
    test("Should return 200 OK and the members of the event", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const eventID = 7;
      const response = await request(app).get(`/api/events/${eventID}/members`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    test("Should return 404 Not Found", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const eventID = 999;
      const response = await request(app).get(`/api/events/${eventID}/members`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(404);
    });
  });

  describe("GET /events/{eventID}/ww-members", () => {
    test("Should return 200 OK and the working weekend members of the event", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const eventID = 5;
      const response = await request(app)
        .get(`/api/events/${eventID}/ww-members`)
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(6);
    });

    test("Should return 404 Not Found", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const eventID = 999;
      const response = await request(app)
        .get(`/api/events/${eventID}/ww-members`)
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(404);
    });
  });

  describe("GET /events/{eventID}/organizers", () => {
    test("Should return 200 OK and the organizers of the event", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const eventID = 7;
      const response = await request(app)
        .get(`/api/events/${eventID}/organizers`)
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    test("Should return 404 Not Found", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const eventID = 999;
      const response = await request(app)
        .get(`/api/events/${eventID}/organizers`)
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(404);
    });
  });
});
