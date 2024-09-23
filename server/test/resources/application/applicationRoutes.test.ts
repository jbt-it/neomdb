import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app";
import { AppDataSource } from "../../../src/datasource";
import AuthTestUtils from "../../utils/authTestUtils";
import ApplicationTestUtils from "../../utils/applicationTestUtils";

const authTestUtils = new AuthTestUtils(app);
const applicationTestUtils = new ApplicationTestUtils(app);

// --------------------------- SETUP AND TEARDOWN --------------------------- \\
beforeAll(async () => {
  // Initialize the data source
  await AppDataSource.initialize();
});

beforeEach(async () => {
  // Populate the database with test data before each test
  await applicationTestUtils.initApplicationData();
  await applicationTestUtils.setupApplicationData();
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
  // delete the image in /applicants
  await applicationTestUtils.deleteApplicationImage("Michael_Scott");
});

describe("Test application routes", () => {
  // --------------------------- TESTS --------------------------- \\

  // -----------------------GET ROUTES-----------------------
  describe("GET /evaluations", () => {
    test("should return 403 for getting evaluations without having any permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app).get(`/api/application/evaluations`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 200 for getting evaluations with permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app).get(`/api/application/evaluations`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.body).toStrictEqual([
        {
          traineeApplicantId: 1,
          firstName: "Michael",
          lastName: "Scott ",
          availabilitySelectionWeekend: "nichtFR",
          workingWeekend: 0,
          evaluations: [
            {
              traineeApplicantId: 1,
              memberId: 8324,
              evaluation: 0,
            },
          ],
        },
        {
          traineeApplicantId: 2,
          firstName: "Jim",
          lastName: "Halpert",
          availabilitySelectionWeekend: "nichtSO",
          workingWeekend: 1,
          evaluations: [
            {
              traineeApplicantId: 2,
              memberId: 8324,
              evaluation: 1,
            },
          ],
        },
        {
          traineeApplicantId: 3,
          firstName: "Pam",
          lastName: "Beesly",
          availabilitySelectionWeekend: "nichtSA",
          workingWeekend: 1,
          evaluations: [
            {
              traineeApplicantId: 3,
              memberId: 8324,
              evaluation: 2,
            },
          ],
        },
        {
          traineeApplicantId: 4,
          firstName: "Dwight",
          lastName: "Schrute",
          availabilitySelectionWeekend: "kannImmer",
          workingWeekend: 1,
          evaluations: [
            {
              traineeApplicantId: 4,
              memberId: 8324,
              evaluation: 3,
            },
          ],
        },
        {
          traineeApplicantId: 5,
          firstName: "Stanley",
          lastName: "Hudson",
          availabilitySelectionWeekend: "nichtFR",
          workingWeekend: 1,
          evaluations: [
            {
              traineeApplicantId: 5,
              memberId: 8324,
              evaluation: 2,
            },
          ],
        },
        {
          traineeApplicantId: 6,
          firstName: "Creed",
          lastName: "Bratton",
          availabilitySelectionWeekend: "nichtFR",
          workingWeekend: 1,
          evaluations: [],
        },
      ]);
      expect(response.status).toBe(200);
    });
  });

  describe("GET /feedback", () => {
    test("should return 403 for getting feedback without having any permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app).get(`/api/application/feedback`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 200 for getting feedback with permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app).get(`/api/application/feedback`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.body).toStrictEqual({
        flyer: 2,
        posters: 2,
        lectures: 2,
        friends: 1,
        informationStand: 3,
        internet: 3,
        socialMedia: 4,
        campusRally: 2,
        partner: 2,
        newsletter: 2,
        others: 3,
        othersText: ["TMS", "TV Werbung", "Werbung auf U-Bahn"],
        totalApplicants: 6,
      });
      expect(response.status).toBe(200);
    });
  });

  describe("GET /generation", () => {
    test("should return 403 for getting current generation without having any permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app).get(`/api/application/generation`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 200 for getting current generation with permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app).get(`/api/application/generation`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.body).toStrictEqual({
        generationId: 15,
        description: "Wintersemester 19/20",
        applicationStart: "2019-10-28T17:00:00.000Z",
        applicationEnd: "2019-11-02T19:10:00.000Z",
        selectionWeDateStart: "2019-11-08",
        selectionWeDateEnd: "2019-11-10",
        wwDateStart: "2019-11-15",
        wwDateEnd: "2019-11-17",
        infoEveningVisitors: 107,
        doorCode: "000000",
        electionStart: "2019-11-17T22:59:00.000Z",
        electionEnd: "2019-11-20T18:30:00.000Z",
      });
      expect(response.status).toBe(200);
    });
  });

  // -----------------------POST ROUTES-----------------------
  describe("POST / create application", () => {
    test("should return 201 for creating new application", async () => {
      const application = {
        firstName: "Michael",
        lastName: "Scott",
        gender: "männlich",
        picture: "jpg",
        birthDate: new Date("1990-09-10T22:00:00.000Z"),
        mobilePhone: "0123456789",
        email: "michael.scott@dunder-mifflin.com",
        confirmEmail: "michael.scott@dunder-mifflin.com",
        homeAddressStreet: "Heimatstr",
        homeAddressNumber: "1",
        homeAddressPostalCode: "12345",
        homeAddressCity: "",
        studyAddressStreet: "Studienstr",
        studyAddressNumber: "2",
        studyAddressPostalCode: "",
        studyAddressCity: "Studienstadt",
        enrolledDegree: "Bachelor",
        enrolledUniversity: "Universität Hohenheim",
        enrolledSubject: "Maschinenbau",
        enrolledOtherSubject: null,
        studyStart: new Date("2023-08-17T22:00:00.000Z"),
        studySemester: "99",
        studyFirstMajor: "1. Vertiefung",
        studySecondMajor: "2. Vertiefung",
        studyThirdMajor: null,
        bachelorSubject: null,
        bachelorUniversity: null,
        apprenticeship: true,
        apprenticeshipJob: "Ausbildungsberuf ",
        apprenticeshipCompany: "Ausbildungsunternehmen",
        apprenticeshipLocation: "Ausbildungsort",
        apprenticeshipStart: new Date("2015-09-17T22:00:00.000Z"),
        apprenticeshipEnd: new Date("2017-09-17T22:00:00.000Z"),
        hasOccupation: true,
        occupation: "Berufliche Tätigkeit",
        occupationCompany: "Berufsunternehmen",
        occupationLocation: "Berufsort",
        occupationStart: new Date("2017-05-17T22:00:00.000Z"),
        occupationEnd: new Date("2018-04-17T22:00:00.000Z"),
        internship: [
          {
            id: 1,
            activity: "Praktikum1",
            company: "Praktikumunternehmen1",
            location: "Praktikumsort1",
            start: new Date("2018-06-17T22:00:00.000Z"),
            end: new Date("2019-06-17T22:00:00.000Z"),
          },
          {
            id: 2,
            activity: "Praktikum2",
            company: "Praktikumunternehmen2",
            location: "Praktikumsort2",
            start: new Date("2016-03-17T23:00:00.000Z"),
            end: new Date("2019-08-17T22:00:00.000Z"),
          },
        ],
        hiwiStudentJob: [
          {
            id: 1,
            activity: "Werkstudententätigkeit ",
            company: "Werkstudentenunternehmen",
            location: "Werkstudentenort",
            start: new Date("2019-05-17T22:00:00.000Z"),
            end: new Date("2020-06-17T22:00:00.000Z"),
          },
        ],
        voluntarySchool: ["Klassensprecher", "Schulsprecher"],
        voluntaryStudy: ["Fachschaft", "Verein"],
        languages: [
          { id: 1, name: "Deutsch", level: 4 },
          { id: 2, name: "Englisch", level: 3 },
        ],
        itSkills: [
          { id: 1, name: "EDV", level: 3 },
          { id: 2, name: "Java", level: 1 },
        ],
        hobbies: "Hobbies",
        timeInvestment: "Zeitliche Verfügbarkeit",
        motivation: "Motivation",
        selfAssessment1: 1,
        selfAssessment2: 2,
        selfAssessment3: 3,
        selfAssessment4: 4,
        selfAssessment5: 5,
        selfAssessment6: 6,
        selfAssessment7: 7,
        selfAssessment8: 6,
        flyer: false,
        posters: true,
        lectures: false,
        friends: true,
        informationStand: true,
        internet: false,
        others: true,
        othersText: "Sonstiges",
        workingWeekend: true,
        socialMedia: false,
        campusRally: true,
        partner: true,
        newsletter: false,
        availabilitySelectionWeekend: "kannImmer",
      };

      const applicationImage = {
        base64:
          "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAI3UlEQVR42u3WsQ3AMBADscT7z/zJEAbs4sgRBBX3zsz3sGGZYGu9MYL/XTPL//zv5nr+53/WAwDgEAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAg5gcr4wu/0P1wEAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMC0xOFQxNToxNzo1MSswMDowMB8NhYkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTAtMThUMTU6MTc6NTErMDA6MDBuUD01AAAAAElFTkSuQmCC",
        mimeType: "png",
      };

      // --- WHEN
      const response = await request(app).post(`/api/application`).send({
        application,
        applicationImage,
      });

      // --- THEN
      expect(response.status).toBe(201);
    });
  });

  describe("POST /generation", () => {
    test("should return 403 for creating new generation without having any permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      const requestBody = {
        description: "Wintersemester 24/25",
        applicationStart: new Date("2024-10-01T22:00:00.000Z"),
        applicationEnd: new Date("2024-10-17T22:00:00.000Z"),
        selectionWeDateStart: new Date("2024-10-18T22:00:00.000Z"),
        selectionWeDateEnd: new Date("2024-10-20T22:00:00.000Z"),
        wwDateStart: new Date("2024-11-01T22:00:00.000Z"),
        wwDateEnd: new Date("2024-11-03T22:00:00.000Z"),
      };

      // --- WHEN
      const response = await request(app)
        .post(`/api/application/generation`)
        .send(requestBody)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 201 for creating new generation", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      const requestBody = {
        description: "Wintersemester 24/25",
        applicationStart: new Date("2024-10-01T22:00:00.000Z"),
        applicationEnd: new Date("2024-10-17T22:00:00.000Z"),
        selectionWeDateStart: new Date("2024-10-18T22:00:00.000Z"),
        selectionWeDateEnd: new Date("2024-10-20T22:00:00.000Z"),
        wwDateStart: new Date("2024-11-01T22:00:00.000Z"),
        wwDateEnd: new Date("2024-11-03T22:00:00.000Z"),
      };

      // --- WHEN
      const response = await request(app)
        .post(`/api/application/generation`)
        .send(requestBody)
        .set("Cookie", `token=${token}`);

      // --- THEN
      const currentGenerationIdFromDB = await applicationTestUtils.getCurrenctGenerationByIDFromDB();
      expect(currentGenerationIdFromDB).toBe(response.body.generationId);
      expect(response.status).toBe(201);
    });
  });

  describe("POST /application/evaluations/{id}", () => {
    test("should return 403 for changing the rating of an application without having any permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app)
        .post(`/api/application/evaluations/6`)
        .send({ traineeApplicantId: 6, memberId: 8222, evaluation: 1 })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 200 for changing the rating of an application with having permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app)
        .post(`/api/application/evaluations/6`)
        .send({ traineeApplicantId: 6, memberId: 8324, evaluation: 5 })
        .set("Cookie", `token=${token}`);

      // --- THEN
      const evaluation = await applicationTestUtils.getEvaluationsByApplicantIdFromDB(6);

      expect(evaluation.evaluation).toBe(5);
      expect(response.status).toBe(200);
    });
  });

  // -----------------------PATCH ROUTES-----------------------
  describe("PATCH /generation", () => {
    test("should return 403 for updating generation without having any permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      const requestBody = {
        generationId: 15,
        description: new Date("2024-10-01T22:00:00.000Z"),
        applicationStart: new Date("2024-10-01T22:00:00.000Z"),
        applicationEnd: new Date("2024-10-17T22:00:00.000Z"),
        selectionWeDateStart: new Date("2024-10-18T22:00:00.000Z"),
        selectionWeDateEnd: new Date("2024-10-20T22:00:00.000Z"),
        wwDateStart: new Date("2024-11-01T22:00:00.000Z"),
        wwDateEnd: new Date("2024-11-03T22:00:00.000Z"),
        infoEveningVisitors: 100,
        doorCode: "12345",
        electionStart: new Date("2024-11-04T22:00:00.000Z"),
        electionEnd: new Date("2024-11-11T22:00:00.000Z"),
      };

      // --- WHEN
      const response = await request(app)
        .patch(`/api/application/generation`)
        .send(requestBody)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 200 for updating generation with having permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      const requestBody = {
        generationId: 15,
        description: "Wintersemester 19/20",
        applicationStart: new Date("2024-10-01T22:00:00.000Z"),
        applicationEnd: new Date("2024-10-17T22:00:00.000Z"),
        selectionWeDateStart: new Date("2024-10-18T22:00:00.000Z"),
        selectionWeDateEnd: new Date("2024-10-20T22:00:00.000Z"),
        wwDateStart: new Date("2024-11-01T22:00:00.000Z"),
        wwDateEnd: new Date("2024-11-03T22:00:00.000Z"),
        infoEveningVisitors: 100,
        doorCode: "12345",
        electionStart: new Date("2024-11-04T22:00:00.000Z"),
        electionEnd: new Date("2024-11-11T22:00:00.000Z"),
      };

      // --- WHEN
      const response = await request(app)
        .patch(`/api/application/generation`)
        .send(requestBody)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.body).toStrictEqual({
        generationId: 15,
        description: "Wintersemester 19/20",
        applicationStart: "2024-10-01T22:00:00.000Z",
        applicationEnd: "2024-10-17T22:00:00.000Z",
        selectionWeDateStart: "2024-10-18T22:00:00.000Z",
        selectionWeDateEnd: "2024-10-20T22:00:00.000Z",
        wwDateStart: "2024-11-01T22:00:00.000Z",
        wwDateEnd: "2024-11-03T22:00:00.000Z",
        infoEveningVisitors: 100,
        doorCode: "12345",
        electionStart: "2024-11-04T22:00:00.000Z",
        electionEnd: "2024-11-11T22:00:00.000Z",
      });
      expect(response.status).toBe(200);
    });
  });

  // -----------------------DELETE ROUTES-----------------------
  describe("DELETE /application/{id}", () => {
    test("should return 403 for deleting an application without having any permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app).delete(`/api/application/6`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 200 for deleting an application with having permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app).delete(`/api/application/6`).send().set("Cookie", `token=${token}`);

      // --- THEN
      const application = await applicationTestUtils.getApplicationByIDFromDB(6);

      expect(application).toBe(null);
      expect(response.status).toBe(200);
    });
  });
});
