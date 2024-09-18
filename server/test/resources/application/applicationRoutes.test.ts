import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app";
import { AppDataSource } from "../../../src/datasource";
import ApplicationTestUtils from "../../utils/applicationTestUtils";
import { ApplicationDto, ApplicationImageDto } from "types/applicationTypes";

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

  // -----------------------POST ROUTES-----------------------
  describe("POST / create application", () => {
    test("should return 200 for creating new application", async () => {
      const application: ApplicationDto = {
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

      const applicationImage: ApplicationImageDto = {
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
      expect(response.status).toBe(200);
    });
  });
});
