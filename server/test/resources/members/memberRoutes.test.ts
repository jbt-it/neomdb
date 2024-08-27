import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app";
import { AppDataSource } from "../../../src/datasource";
import AuthTestUtils from "../../utils/authTestUtils";
import MemberTestUtils from "../../utils/memberTestUtils";

const authTestUtils = new AuthTestUtils(app);
const memberTestUtils = new MemberTestUtils(app);

// --------------------------- SETUP AND TEARDOWN --------------------------- \\
beforeAll(async () => {
  // Initialize the data source
  await AppDataSource.initialize();
});

beforeEach(async () => {
  // Populate the database with test data before each test
  await memberTestUtils.initMemberData();
  await memberTestUtils.setupMemberData();
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

describe("Test member routes", () => {
  // --------------------------- TESTS --------------------------- \\

  // -----------------------GET ROUTES-----------------------
  describe("GET / get member", () => {
    test("should return 200 for getting all member data", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app).get("/api/members/").send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(10);
    });
  });

  describe("GET /directors", () => {
    test("should return 200 for getting all directors", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app)
        .get("/api/members/directors?current=false")
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
    });

    test("should return 200 for getting current directors", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app)
        .get("/api/members/directors?current=true")
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe("GET /departments", () => {
    test("should return 200 for getting departments", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app).get("/api/members/departments").send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(7);
    });
  });

  describe("GET /department-members", () => {
    test("should return 200 for getting members of department", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app).get("/api/members/department-members").send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(5);
    });
  });

  describe("GET /edv-skills", () => {
    test("should return 200 for getting edv-skills", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app).get("/api/members/edv-skills").send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(16);
    });
  });

  describe("GET /languages", () => {
    test("should return 200 for getting languages", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app).get("/api/members/languages").send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(11);
    });
  });

  describe("GET /permissions", () => {
    test("should return 403 for getting permissions without having any permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app).get("/api/members/permissions").send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 200 for getting permissions with having permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app).get("/api/members/permissions").send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(25);
    });
  });

  describe("GET /permission-assignments", () => {
    test("should return 403 for getting permissions assignments without having any permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app)
        .get("/api/members/permission-assignments")
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 200 for getting permissions assignments with having any permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app)
        .get("/api/members/permission-assignments")
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(25);
    });
  });

  describe("GET /:id", () => {
    test("should return 200 for getting own user page", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8222;
      const response = await request(app).get(`/api/members/${memberId}`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body.iban).not.toBeNull();
      expect(response.body.kontoinhaber).not.toBeNull();
      expect(response.body.memberId).toBe(memberId);
    });

    test("should return 200 for admin user on other profile", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8222;
      const response = await request(app).get(`/api/members/${memberId}`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body.iban).not.toBeNull();
      expect(response.body.kontoinhaber).not.toBeNull();
      expect(response.body.memberId).toBe(memberId);
    });

    test("should return 200 for getting normal user on other profile", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("j.bautista", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8364;
      const response = await request(app).get(`/api/members/${memberId}`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body.iban).toBeUndefined();
      expect(response.body.kontoinhaber).toBeUndefined();
      expect(response.body.memberId).toBe(memberId);
    });
  });

  describe("GET /director-positions", () => {
    test("should return 200 for getting director positions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app).get("/api/members/director-positions").send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(9);
      expect(Object.keys(response.body[0])).toHaveLength(9);
    });
  });

  describe("GET /director-positions/details", () => {
    test("should return 200 for getting director positions details", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app)
        .get("/api/members/director-positions/details")
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(Object.keys(response.body[0])).toHaveLength(15);
    });
  });

  describe("GET /:id/director-positions", () => {
    test("should return 200 for getting all directoy roles of the user", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const response = await request(app)
        .get("/api/members/8222/director-positions")
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  // -----------------------POST ROUTES-----------------------

  describe("POST / create member", () => {
    test("should return 201 for creating new member with permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const newMember = {
        firstName: "Jesse",
        lastName: "Pinkman",
        name: "j.pinkman",
        birthday: new Date("2000-04-01"),
        mobile: "0176/123456",
        gender: 1,
        generationId: 15,
        email: "j.pinkman@lethimcook.com",
      };
      const response = await request(app).post("/api/members/").send(newMember).set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(201);
      expect(response.body.memberId).toBeDefined();
      expect(response.body.statusOverview.querySuccesful).toBe(true);

      const memberFromDB = await memberTestUtils.getMemberByIDFromDB(response.body.memberId);
      expect(memberFromDB).not.toBeNull();
      expect(memberFromDB.memberId).toBe(response.body.memberId);
      expect(memberFromDB.memberStatus.name).toBe("Trainee");
    });

    test("should return 403 for creating a new member without permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const newMember = {
        firstName: "Jesse",
        lastName: "Pinkman",
        name: "j.pinkman",
        birthday: new Date("2000-04-01"),
        mobile: "0176/123456",
        gender: 1,
        generationId: 15,
        email: "j.pinkman@lethimcook.com",
      };
      const response = await request(app).post("/api/members/").send(newMember).set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
      expect(JSON.parse(response.text).message).toBe("Authorization failed: Insufficient permissions");
    });

    test("should return 201 for creating member with duplicated member name", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const newMember = {
        firstName: "Jesse",
        lastName: "Pinkman",
        name: "jesse.pinkman",
        birthday: new Date("2000-04-01"),
        mobile: "0176/123456",
        gender: 0,
        generationId: 15,
        email: "j.pinkman@lethimcook.com",
      };
      const firstResponse = await request(app).post("/api/members/").send(newMember).set("Cookie", `token=${token}`);
      const secondResponse = await request(app).post("/api/members/").send(newMember).set("Cookie", `token=${token}`);
      // --- THEN
      const firstMemberFromDB = await memberTestUtils.getMemberByIDFromDB(firstResponse.body.memberId);
      const secondMemberFromDB = await memberTestUtils.getMemberByIDFromDB(secondResponse.body.memberId);

      expect(firstResponse.status).toBe(201);
      expect(firstResponse.body.memberId).toBeDefined();
      expect(firstResponse.body.statusOverview.querySuccesful).toBe(true);

      expect(firstMemberFromDB).not.toBeNull();
      expect(firstMemberFromDB.memberId).toBe(firstResponse.body.memberId);
      expect(firstMemberFromDB.memberStatus.name).toBe("Trainee");

      expect(secondResponse.status).toBe(201);
      expect(secondResponse.body.memberId).toBeDefined();
      expect(secondResponse.body.statusOverview.querySuccesful).toBe(true);

      expect(secondMemberFromDB).not.toBeNull();
      expect(secondMemberFromDB.memberId).toBe(secondResponse.body.memberId);
      expect(secondMemberFromDB.memberStatus.name).toBe("Trainee");

      expect(firstMemberFromDB.jbtEmail).toBe("jesse.pinkman@studentische-beratung.de");
      expect(secondMemberFromDB.jbtEmail).toBe("jesse.pinkman1@studentische-beratung.de");
    });
  });

  describe("POST /permissions", () => {
    test("should return 201  for deligating a permission to a member", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8320;
      const permissionID = 8;
      const response = await request(app)
        .post("/api/members/permissions")
        .send({ memberId, permissionID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(201);
    });

    test("should return 403 for deligate without having permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("r.norton", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8320;
      const permissionID = 8;
      const response = await request(app)
        .post("/api/members/permissions")
        .send({ memberId, permissionID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
      expect(JSON.parse(response.text).message).toBe("Permission cannot be delegated!");
    });

    test("should return 404 for deligate to member not existing", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 9999;
      const permissionID = 8;
      const response = await request(app)
        .post("/api/members/permissions")
        .send({ memberId, permissionID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(404);
      expect(JSON.parse(response.text).message).toBe(`Member with id ${memberId} does not exist`);
    });

    test("should return 403 for deligate permission not existing", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8320;
      const permissionID = 9999;
      const response = await request(app)
        .post("/api/members/permissions")
        .send({ memberId, permissionID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
      expect(JSON.parse(response.text).message).toBe("Permission cannot be delegated!");
    });
  });

  describe("POST /:id/director-positions/{directorPositionID}", () => {
    test("should return 201 for adding a director positions to the member", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const newPosition = {
        from: new Date("2023-03-01"),
        until: new Date("2026-03-01"),
      };
      const response = await request(app)
        .post("/api/members/8324/director-positions/2")
        .send(newPosition)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(201);
    });

    test("should return 500 for adding a director positions to the member", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const newPosition = {
        from: new Date("2026-03-01"),
        until: new Date("2023-03-01"),
      };
      const response = await request(app)
        .post("/api/members/8324/director-positions/2")
        .send(newPosition)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(500);
    });

    test("should return 403 for adding a director positions to the member", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const newPosition = {
        von: "2023-03-01",
        bis: "2026-03-01",
      };
      const response = await request(app)
        .post("/api/members/8324/director-positions/2")
        .send(newPosition)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });
  });

  // -----------------------PATCH ROUTES-----------------------
  describe("PUT /departments/:id", () => {
    test("should return 204 for director changes own departement info", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const departmentID = 1;
      const linkObjectivePresentation =
        "https://juniorbusiness.sharepoint.com/:f:/s/RessortIT/hwekfoiwfjGFHCkhdllewlj12Q?e=JHVUZFZU";
      const linkOrganigram = "https://juniorbusiness.sharepoint.com/:f:/s/RessortIT/kffkCDZTFU54698?e=GUJGZZU";
      const response = await request(app)
        .put(`/api/members/departments/${departmentID}`)
        .send({ linkObjectivePresentation, linkOrganigram })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(204);
    });

    test("should return 403 for member changes departement info", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const departmentID = 1;
      const linkZielvorstellung =
        "https://juniorbusiness.sharepoint.com/:f:/s/RessortIT/hwekfoiwfjGFHCkhdllewlj12Q?e=JHVUZFZU";
      const linkOrganigramm = "https://juniorbusiness.sharepoint.com/:f:/s/RessortIT/kffkCDZTFU54698?e=GUJGZZU";
      const response = await request(app)
        .put(`/api/members/departments/${departmentID}`)
        .send({ linkZielvorstellung, linkOrganigramm })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });
  });

  describe("PATCH /:id  update Member", () => {
    test("should return 204 for update member with permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8111;
      const memberInfo = {
        memberId,
        firstname: "Brandon-Lee",
        lastname: "Frye",
        jbtEmail: "b.frye@studentische-beratung.de",
        gender: Boolean(1),
        birthday: new Date("1990-06-05"),
        mobile: "0162/9846320",
        memberStatus: {
          memberStatusId: 4,
          name: "passives Mitglied",
        },
        generation: null,
        internalProject: null,
        traineeSince: new Date("2011-04-30"),
        memberSince: new Date("2012-11-30"),
        alumnusSince: null,
        seniorSince: null,
        activeSince: new Date("2012-11-30"),
        passiveSince: null,
        exitedSince: null,
        department: {
          departmentId: 5,
          name: "Mitglieder",
          shortName: "MIT",
        },
        employer: "Versicherung Deutschland",
        street1: "Woodsman Ave 61",
        postalCode1: "70364",
        city1: "Stuttgart",
        phone1: null,
        email1: "brandon-lee@gmx.de",
        street2: "Budapester Straße 96",
        postalCode2: "56370",
        city2: "Rheinland-Pfalz",
        phone2: "07042/984365",
        email2: "brandon-lee@gmx.de",
        university: "Universität Hohenheim",
        courseOfStudy: "Master of Financial Management",
        studyStart: new Date("2014-09-30T22:00:00.000Z"),
        studyEnd: null,
        specializations: "Controlling und Unternehmensrechnung",
        apprenticeship: null,
        commitment: null,
        canPL: new Date("2013-12-22"),
        canQM: new Date("2013-12-22"),
        drivingLicense: 0,
        firstAidTraining: false,
        mentor: null,
        mentees: [],
        languages: [
          {
            memberId: memberId,
            value: "Deutsch",
            level: 5,
          },
          { memberId: memberId, value: "English", level: 3 },
          {
            memberId: memberId,
            value: "Französisch",
            level: 1,
          },
        ],
        itSkills: [
          {
            memberId: memberId,
            value: "MS-Office",
            level: 3,
          },
          {
            memberId: memberId,
            value: "PHP",
            level: 1,
          },
        ],
      };
      const response = await request(app)
        .patch(`/api/members/${memberId}`)
        .send(memberInfo)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(204);

      // Check if the member was updated correctly in the database
      const memberFromDB = await memberTestUtils.getMemberByIDFromDB(memberId);
      expect(memberFromDB).not.toBeNull();
      expect(memberFromDB.memberId).toBe(memberId);
      expect(memberFromDB.firstName).toBe(memberInfo.firstname);
      expect(memberFromDB.lastChange).not.toBeNull();
    });

    test("should return 403 for update member with permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("r.norton", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8111;
      const memberInfo = {
        memberId,
        firstname: "Brandon-Lee",
        lastname: "Frye",
        jbtEmail: "b.frye@studentische-beratung.de",
        gender: Boolean(1),
        birthday: new Date("1990-06-05"),
        mobile: "0162/9846320",
        memberStatus: {
          memberStatusId: 4,
          name: "passives Mitglied",
        },
        generation: null,
        internalProject: null,
        traineeSince: new Date("2011-04-30"),
        memberSince: new Date("2012-11-30"),
        alumnusSince: null,
        seniorSince: null,
        activeSince: new Date("2012-11-30"),
        passiveSince: null,
        exitedSince: null,
        department: {
          departmentId: 5,
          name: "Mitglieder",
          shortName: "MIT",
        },
        employer: "Versicherung Deutschland",
        street1: "Woodsman Ave 61",
        postalCode1: "70364",
        city1: "Stuttgart",
        phone1: null,
        email1: "brandon-lee@gmx.de",
        street2: "Budapester Straße 96",
        postalCode2: "56370",
        city2: "Rheinland-Pfalz",
        phone2: "07042/984365",
        email2: "brandon-lee@gmx.de",
        university: "Universität Hohenheim",
        courseOfStudy: "Master of Financial Management",
        studyStart: new Date("2014-09-30T22:00:00.000Z"),
        studyEnd: null,
        specializations: "Controlling und Unternehmensrechnung",
        apprenticeship: null,
        commitment: null,
        canPL: new Date("2013-12-22"),
        canQM: new Date("2013-12-22"),
        lastChange: new Date("1899-11-29"),
        drivingLicense: 0,
        firstAidTraining: false,
        mentor: null,
        mentees: [],
        languages: [
          {
            memberId: memberId,
            value: "Deutsch",
            level: 5,
          },
          { memberId: memberId, value: "English", level: 3 },
          {
            memberId: memberId,
            value: "Französisch",
            level: 1,
          },
        ],
        itSkills: [
          {
            memberId: memberId,
            value: "MS-Office",
            level: 3,
          },
          {
            memberId: memberId,
            value: "PHP",
            level: 1,
          },
        ],
      };
      const response = await request(app)
        .patch(`/api/members/${memberId}`)
        .send(memberInfo)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });
  });

  describe("PATCH /:id/status Member", () => {
    test("should return 204 for update member status with permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8167;
      const memberStatus = "passives Mitglied";
      const response = await request(app)
        .patch(`/api/members/${memberId}/status`)
        .send({ memberStatus })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(204);
    });

    test("should return 422 for unknown member status", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8167;
      const mitgliedstatus = "unbekannt";
      const response = await request(app)
        .patch(`/api/members/${mitgliedID}/status`)
        .send({ mitgliedstatus })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(422);
    });

    test("should return 403 for unauthorized user", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("r.norton", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8167;
      const memberStatus = "unbekannt";
      const response = await request(app)
        .patch(`/api/members/${memberId}/status`)
        .send({ memberStatus })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });
  });

  describe("PATCH /:id/director-positions/:directorPositionID", () => {
    test("should return 204 for update director position", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8324;
      const directorID = 1;
      const posten = {
        from: new Date("2023-03-01"),
        until: new Date("2026-03-01"),
      };

      const response = await request(app)
        .patch(`/api/members/${memberID}/director-positions/${directorID}`)
        .send(posten)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(204);
    });

    test("should return 500 for malformatted date", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8324;
      const directorID = 1;
      const posten = {
        from: new Date("2026-03-01"),
        until: new Date("2023-03-01"),
      };

      const response = await request(app)
        .patch(`/api/members/${memberID}/director-positions/${directorID}`)
        .send(posten)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(500);
    });

    test("should return 403 for unautherized user", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8324;
      const directorID = 1;
      const posten = {
        from: new Date("2023-03-01"),
        until: new Date("2026-03-01"),
      };

      const response = await request(app)
        .patch(`/api/members/${memberID}/director-positions/${directorID}`)
        .send(posten)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });
  });

  describe("DELETE /director-positions", () => {
    test("should return 200 for delete member's director position with permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8167;
      const directorID = 1;
      const response = await request(app)
        .delete(`/api/members/${memberID}/director-positions/${directorID}`)
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
    });

    test("should return 403 for delete member's director position with permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8167;
      const evpostenID = 1;
      const response = await request(app)
        .delete(`/api/members/${mitgliedID}/director-positions/${evpostenID}`)
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });
  });

  describe("DELETE /permissions", () => {
    test("should return 204 for delete member's permission with permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8167;
      const permissionID = 8;
      const response = await request(app)
        .delete(`/api/members/permissions`)
        .send({ permissionID, memberId })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(204);
    });

    test("should return 403 for delete member's permission without permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8167;
      const permissionID = 1;
      const response = await request(app)
        .delete(`/api/members/permissions`)
        .send({ permissionID, memberId })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 403 for delete member's permission without permission as normal member", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("r.norton", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8320;
      const permissionID = 5;
      const response = await request(app)
        .delete(`/api/members/permissions`)
        .send({ permissionID, memberId })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 404 for delete member's permission without the member having one and not existing permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberId = 8320;
      const permissionID = 200;
      const response = await request(app)
        .delete(`/api/members/permissions`)
        .send({ permissionID, memberId })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });
  });

  describe("GET /:id/image", () => {
    test("should return 200 for getting member image", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("j.bautista", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8111;
      const response = await request(app)
        .get(`/api/members/${mitgliedID}/image`)
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    test("should return 204 for getting member image without image", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("j.bautista", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8167;
      const response = await request(app)
        .get(`/api/members/${mitgliedID}/image`)
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(204);
    });
  });

  describe("POST /:id/image", () => {
    test("should return 204 for setting member image", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8111;
      const response = await request(app)
        .post(`/api/members/${mitgliedID}/image`)
        .send({
          base64:
            "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAI3UlEQVR42u3WsQ3AMBADscT7z/zJEAbs4sgRBBX3zsz3sGGZYGu9MYL/XTPL//zv5nr+53/WAwDgEAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAg5gcr4wu/0P1wEAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMC0xOFQxNToxNzo1MSswMDowMB8NhYkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTAtMThUMTU6MTc6NTErMDA6MDBuUD01AAAAAElFTkSuQmCC",
          mimeType: "png",
        })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(204);
    });

    test("should return 403 for setting member image of other member", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8111;
      const response = await request(app)
        .post(`/api/members/${mitgliedID}/image`)
        .send({
          base64:
            "iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAI3UlEQVR42u3WsQ3AMBADscT7z/zJEAbs4sgRBBX3zsz3sGGZYGu9MYL/XTPL//zv5nr+53/WAwDgEAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAgRgACAMQIQACAGAEIABAjAAEAYgQgAECMAAQAiBGAAAAxAhAAIEYAAgDECEAAgBgBCAAQIwABAGIEIABAjAAEAIgRgAAAMQIQACBGAAIAxAhAAIAYAQgAECMAAQBiBCAAQIwABACIEYAAADECEAAg5gcr4wu/0P1wEAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMC0xOFQxNToxNzo1MSswMDowMB8NhYkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTAtMThUMTU6MTc6NTErMDA6MDBuUD01AAAAAElFTkSuQmCC",
          mimeType: "png",
        })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });
  });
});
