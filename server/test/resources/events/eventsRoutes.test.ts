import { describe, expect, test, beforeAll, beforeEach, afterEach, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app";
import MemberTestUtils from "../../utils/memberTestUtils";
import AuthTestUtils from "../../utils/authTestUtils";
import EventsTestUtils from "../../utils/eventsTestUtils";
import { UpdateEventRequest } from "../../../src/types/EventTypes";
import { AppDataSource } from "../../../src/datasource";

const authTestUtils = new AuthTestUtils(app);
const eventsTestUtils = new EventsTestUtils(app);
const memberTestUtils = new MemberTestUtils(app);

// --------------------------- SETUP AND TEARDOWN --------------------------- \\
beforeAll(async () => {
  // Initialize the data source
  await AppDataSource.initialize();
});

beforeEach(async () => {
  await memberTestUtils.initMemberData();
  await memberTestUtils.setupMemberData();
  return eventsTestUtils.setupEventsData();
});

afterEach(async () => {
  // Clean up the database after each test
  const source = AppDataSource;
  const entities = source.entityMetadatas;

  await source.query(`SET FOREIGN_KEY_CHECKS = 0;`);
  for (const entity of entities) {
    const repository = source.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName}`);
  }
  await source.query(`SET FOREIGN_KEY_CHECKS = 1;`);
});

afterAll(async () => {
  // Close the data source
  await AppDataSource.destroy();
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
      expect(response.body).toEqual(expect.objectContaining({ location: "Euro Forum Katharinasaal/TMS" }));
      expect(response.body.organizers).toHaveLength(1);
      expect(response.body.members).toHaveLength(2);
    });
    test("Should return 404 Not Found", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const eventID = 999;
      const response = await request(app).get(`/api/events/${eventID}`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(404);
    });
    test("Should return 200 OK and the ww event", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const eventID = 10;
      const response = await request(app).get(`/api/events/${eventID}`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({ name: "Working-Weekend" }));
      expect(response.body).toEqual(expect.objectContaining({ location: "Sulz am Neckar" }));
      expect(response.body.wwMembers).toHaveLength(2);
    });
  });

  describe("PUT /events/{eventID}", () => {
    test("Should return 204 OK and update the event (with Permission)", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);
      const eventID = 7;
      // Rework tests
      const updatedEvent: UpdateEventRequest = {
        eventId: 7,
        name: "Test Event Updated",
        location: "Test Location Updated",
        startDate: new Date("2024-04-04"),
        endDate: new Date("2025-05-05"),
        startTime: "14:00",
        endTime: "15:00",
        registrationStart: new Date("2023-03-03"),
        registrationEnd: new Date("2023-04-04"),
        maxParticipants: 200,
        description: "Test Description Updated",
        type: "Sonstige",
        organizers: [
          {
            memberID: 8167,
            vorname: "Wolfgang",
            nachname: "Luft",
            status: "aktives Mitglied",
            name: "w.luft",
          },
        ],
        members: [
          {
            memberID: 8111,
            nachname: "Frye",
            vorname: "Brandon-Lee",
            status: "Senior",
            name: "b.frye",
          },
        ],
        wwMembers: [],
      };

      // --- WHEN
      const response = await request(app)
        .put(`/api/events/${eventID}`)
        .send(updatedEvent)
        .set("Cookie", `token=${token}`);
      // Second request to check if providing the same data again will still return 204
      const response2 = await request(app)
        .put(`/api/events/${eventID}`)
        .send(updatedEvent)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(204);
      expect(response2.status).toBe(204);
    });

    test("Should return 204 OK and update the event (as Organizer)", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);
      const eventID = 7;
      // Rework tests
      const updatedEvent: UpdateEventRequest = {
        eventId: 7,
        name: "Test Event Updated",
        location: "Test Location Updated",
        startDate: new Date("2024-04-04"),
        endDate: new Date("2025-05-05"),
        startTime: "14:00",
        endTime: "15:00",
        registrationStart: new Date("2023-03-03"),
        registrationEnd: new Date("2023-04-04"),
        maxParticipants: 200,
        description: "Test Description Updated",
        type: "Sonstige",
        organizers: [
          {
            memberID: 8167,
            vorname: "Wolfgang",
            nachname: "Luft",
            status: "aktives Mitglied",
            name: "w.luft",
          },
        ],
        members: [
          {
            memberID: 8111,
            nachname: "Frye",
            vorname: "Brandon-Lee",
            status: "Senior",
            name: "b.frye",
          },
        ],
        wwMembers: [],
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
      // Rework tests
      const updatedEvent: UpdateEventRequest = {
        eventId: 999,
        name: "Test Event Updated",
        location: "Test Location Updated",
        startDate: new Date("2024-04-04"),
        endDate: new Date("2025-05-05"),
        startTime: "14:00",
        endTime: "15:00",
        registrationStart: new Date("2023-03-03"),
        registrationEnd: new Date("2023-04-04"),
        maxParticipants: 200,
        description: "Test Description Updated",
        type: "Sonstige",
        organizers: [
          {
            memberID: 8167,
            vorname: "Wolfgang",
            nachname: "Luft",
            status: "aktives Mitglied",
            name: "w.luft",
          },
        ],
        members: [
          {
            memberID: 8111,
            nachname: "Frye",
            vorname: "Brandon-Lee",
            status: "Senior",
            name: "b.frye",
          },
        ],
        wwMembers: [],
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
      // Rework tests
      const updatedEvent: UpdateEventRequest = {
        eventId: 7,
        name: "Test Event Updated",
        location: "Test Location Updated",
        startDate: new Date("2024-04-04"),
        endDate: new Date("2025-05-05"),
        startTime: "14:00",
        endTime: "15:00",
        registrationStart: new Date("2023-03-03"),
        registrationEnd: new Date("2023-04-04"),
        maxParticipants: 200,
        description: "Test Description Updated",
        type: "Sonstige",
        organizers: [
          {
            memberID: 8167,
            vorname: "Wolfgang",
            nachname: "Luft",
            status: "aktives Mitglied",
            name: "w.luft",
          },
        ],
        members: [
          {
            memberID: 8111,
            nachname: "Frye",
            vorname: "Brandon-Lee",
            status: "Senior",
            name: "b.frye",
          },
        ],
        wwMembers: [],
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
