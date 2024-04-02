import { describe, expect, test, beforeAll, beforeEach, afterEach, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app";
import MemberTestUtils from "../../utils/memberTestUtils";
import AuthTestUtils from "../../utils/authTestUtils";
import EventsTestUtils from "../../utils/eventsTestUtils";
import { UpdateEventRequest } from "types/EventTypes";

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
      expect(response.body).toHaveLength(1);
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

  describe("PUT /events/{eventID}", () => {
    test("Should return 200 OK and update the event (with Permission)", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);
      const eventID = 7;
      const updatedEvent: UpdateEventRequest = {
        event: {
          eventID: 7,
          name: "Test Event Updated",
          description: "Test Description Updated",
          location: "Test Location Updated",
          startDate: "2024-04-04",
          endDate: "2025-05-05",
          startTime: "14:00",
          endTime: "15:00",
          registrationStart: "2023-03-03",
          registrationEnd: "2023-04-04",
          maxParticipants: 200,
          type: "JBT goes",
        },
        organizers: [
          {
            memberID: 8167,
            vorname: "Wolfgang",
            nachname: "Luft",
            status: "aktives Mitglied",
          },
        ],
      };

      // --- WHEN
      const response = await request(app)
        .put(`/api/events/${eventID}`)
        .send(updatedEvent)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(204);
    });

    test("Should return 200 OK and update the event (as Organizer)", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);
      const eventID = 7;
      const updatedEvent: UpdateEventRequest = {
        event: {
          eventID: 7,
          name: "Test Event Updated",
          location: "Test Location Updated",
          startDate: "2024-04-04",
          endDate: "2025-05-05",
          startTime: "14:00",
          endTime: "15:00",
          registrationStart: "2023-03-03",
          registrationEnd: "2023-04-04",
          maxParticipants: 200,
          description: "Test Description Updated",
          type: "JBT goes",
        },
        organizers: [
          {
            memberID: 8167,
            vorname: "Wolfgang",
            nachname: "Luft",
            status: "aktives Mitglied",
          },
        ],
      };

      // --- WHEN
      const response = await request(app)
        .put(`/api/events/${eventID}`)
        .send(updatedEvent)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(204);
    });

    test("Should return 404 Not Found", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);
      const eventID = 999;
      const updatedEvent: UpdateEventRequest = {
        event: {
          eventID: 999,
          name: "Test Event Updated",
          location: "Test Location Updated",
          startDate: "2024-04-04",
          endDate: "2025-05-05",
          startTime: "14:00",
          endTime: "15:00",
          registrationStart: "2023-03-03",
          registrationEnd: "2023-04-04",
          maxParticipants: 200,
          description: "Test Description Updated",
          type: "JBT goes",
        },
        organizers: [
          {
            memberID: 8167,
            vorname: "Wolfgang",
            nachname: "Luft",
            status: "aktives Mitglied",
          },
          {
            memberID: 8111,
            nachname: "Frye",
            vorname: "Brandon-Lee",
            status: "Senior",
          },
        ],
      };

      // --- WHEN
      const response = await request(app)
        .put(`/api/events/${eventID}`)
        .send(updatedEvent)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(404);
    });

    test("Should return 403 Unauthorized", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);
      const eventID = 7;
      const updatedEvent: UpdateEventRequest = {
        event: {
          eventID: 7,
          name: "Test Event Updated",
          description: "Test Description Updated",
          location: "Test Location Updated",
          startDate: "2024-04-04",
          endDate: "2025-05-05",
          startTime: "14:00",
          endTime: "15:00",
          registrationStart: "2023-03-03",
          registrationEnd: "2023-04-04",
          maxParticipants: 200,
          type: "JBT goes",
        },
        organizers: [
          {
            memberID: 8167,
            vorname: "Wolfgang",
            nachname: "Luft",
            status: "aktives Mitglied",
          },
          {
            memberID: 8111,
            nachname: "Frye",
            vorname: "Brandon-Lee",
            status: "Senior",
          },
        ],
      };

      // --- WHEN
      const response = await request(app)
        .put(`/api/events/${eventID}`)
        .send(updatedEvent)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });
  });
});
