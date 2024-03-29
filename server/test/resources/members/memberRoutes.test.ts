import { describe, expect, test, beforeAll, beforeEach, afterEach, afterAll } from "@jest/globals";
import request from "supertest";
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
      expect(response.body).toHaveLength(3);
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
      expect(response.body).toHaveLength(85);
    });
  });

  describe("GET /:id", () => {
    test("should return 200 for getting own user page", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8222;
      const response = await request(app).get(`/api/members/${mitgliedID}`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body.iban).not.toBeNull();
      expect(response.body.kontoinhaber).not.toBeNull();
      expect(response.body.mitgliedID).toBe(mitgliedID);
    });

    test("should return 200 for admin user on other profile", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8222;
      const response = await request(app).get(`/api/members/${mitgliedID}`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body.iban).not.toBeNull();
      expect(response.body.kontoinhaber).not.toBeNull();
      expect(response.body.mitgliedID).toBe(mitgliedID);
    });

    test("should return 200 for getting normal user on other profile", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("j.bautista", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8364;
      const response = await request(app).get(`/api/members/${mitgliedID}`).send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body.iban).toBeUndefined();
      expect(response.body.kontoinhaber).toBeUndefined();
      expect(response.body.mitgliedID).toBe(mitgliedID);
    });
  });

  describe("GET /:id/permissions", () => {
    test("should return 200 for EV geeting own Permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8324;
      const response = await request(app)
        .get(`/api/members/${mitgliedID}/permissions`)
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body.permissions).toEqual(loginResponse.body.permissions);
    });

    test("should return 403 for member without permissions getting Permissions of a member", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("r.norton", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8167;
      const response = await request(app)
        .get(`/api/members/${mitgliedID}/permissions`)
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
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
        vorname: "Jesse",
        nachname: "Pinkman",
        name: "j.pinkman",
        geburtsdatum: "2000-04-01",
        password: "s3cre7",
        handy: "0176/123456",
        geschlecht: "1",
        generation: "15",
        traineeSeit: createCurrentTimestamp(),
        email: "j.pinkman@lethimcook.com",
      };
      const response = await request(app).post("/api/members/").send(newMember).set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(201);
      expect(response.body.memberID).toBeDefined();
      expect(response.body.statusOverview.querySuccesful).toBe(true);

      const memberFromDB = await memberTestUtils.getMemberByIDFromDB(response.body.memberID);
      expect(memberFromDB).not.toBeNull();
      expect(memberFromDB.mitgliedID).toBe(response.body.memberID);
      expect(memberFromDB.mitgliedstatus).toBe("Trainee");
    });

    test("should return 403 for creating a new member without permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const newMember = {
        vorname: "Jesse",
        nachname: "Pinkman",
        name: "j.pinkman",
        geburtsdatum: "2000-04-01",
        password: "s3cre7",
        handy: "0176/123456",
        geschlecht: "1",
        generation: "15",
        traineeSeit: createCurrentTimestamp(),
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
        vorname: "Jesse",
        nachname: "Pinkman",
        name: "jesse.pinkman",
        geburtsdatum: "2000-05-01",
        password: "s3cre7",
        handy: "0176/1234567",
        geschlecht: "0",
        generation: "15",
        traineeSeit: createCurrentTimestamp(),
        email: "j.pinkman@cookpot.com",
      };
      const firstResponse = await request(app).post("/api/members/").send(newMember).set("Cookie", `token=${token}`);
      const secondResponse = await request(app).post("/api/members/").send(newMember).set("Cookie", `token=${token}`);
      // --- THEN
      const firstMemberFromDB = await memberTestUtils.getMemberByIDFromDB(firstResponse.body.memberID);
      const secondMemberFromDB = await memberTestUtils.getMemberByIDFromDB(secondResponse.body.memberID);

      expect(firstResponse.status).toBe(201);
      expect(firstResponse.body.memberID).toBeDefined();
      expect(firstResponse.body.statusOverview.querySuccesful).toBe(true);

      expect(firstMemberFromDB).not.toBeNull();
      expect(firstMemberFromDB.mitgliedID).toBe(firstResponse.body.memberID);
      expect(firstMemberFromDB.mitgliedstatus).toBe("Trainee");

      expect(secondResponse.status).toBe(201);
      expect(secondResponse.body.memberID).toBeDefined();
      expect(secondResponse.body.statusOverview.querySuccesful).toBe(true);

      expect(secondMemberFromDB).not.toBeNull();
      expect(secondMemberFromDB.mitgliedID).toBe(secondResponse.body.memberID);
      expect(secondMemberFromDB.mitgliedstatus).toBe("Trainee");

      expect(firstMemberFromDB.jbt_email).toBe("jesse.pinkman@studentische-beratung.de");
      expect(secondMemberFromDB.jbt_email).toBe("jesse.pinkman1@studentische-beratung.de");
    });
  });

  describe("POST /permissions", () => {
    test("should return 201  for deligating a permission to a member", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8320;
      const permissionID = 8;
      const response = await request(app)
        .post("/api/members/permissions")
        .send({ memberID, permissionID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(201);
    });

    test("should return 403 for deligate without havig permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8320;
      const permissionID = 8;
      const response = await request(app)
        .post("/api/members/permissions")
        .send({ memberID, permissionID })
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
      const memberID = 9999;
      const permissionID = 8;
      const response = await request(app)
        .post("/api/members/permissions")
        .send({ memberID, permissionID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(404);
      expect(JSON.parse(response.text).message).toBe(`Member with id ${memberID} does not exist`);
    });

    test("should return 403 for deligate permission not existing", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8320;
      const permissionID = 9999;
      const response = await request(app)
        .post("/api/members/permissions")
        .send({ memberID, permissionID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
      expect(JSON.parse(response.text).message).toBe("Permission cannot be delegated!");
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
      const linkZielvorstellung =
        "https://juniorbusiness.sharepoint.com/:f:/s/RessortIT/hwekfoiwfjGFHCkhdllewlj12Q?e=JHVUZFZU";
      const linkOrganigramm = "https://juniorbusiness.sharepoint.com/:f:/s/RessortIT/kffkCDZTFU54698?e=GUJGZZU";
      const response = await request(app)
        .put(`/api/members/departments/${departmentID}`)
        .send({ linkZielvorstellung, linkOrganigramm })
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
      const mitgliedID = 8111;
      const memberInfo = {
        mitgliedID,
        vorname: "Brandon-Lee",
        nachname: "Frye",
        jbt_email: "b.frye@studentische-beratung.de",
        geschlecht: 1,
        geburtsdatum: "1990-06-05",
        handy: "0162/9846320",
        mitgliedstatus: "passives Mitglied",
        generation: null,
        internesprojekt: null,
        trainee_seit: "2011-04-30",
        mitglied_seit: "2012-11-30",
        alumnus_seit: null,
        senior_seit: null,
        aktiv_seit: "2012-11-30",
        passiv_seit: null,
        ausgetreten_seit: null,
        ressort: "Mitglieder",
        arbeitgeber: "Versicherung Deutschland",
        strasse1: "Woodsman Ave 61",
        plz1: "70364",
        ort1: "Stuttgart",
        tel1: null,
        email1: "brandon-lee@gmx.de",
        strasse2: "Budapester Straße 96",
        plz2: "56370",
        ort2: "Rheinland-Pfalz",
        tel2: "07042/984365",
        email2: "brandon-lee@gmx.de",
        hochschule: "Universität Hohenheim",
        studiengang: "Master of Financial Management",
        studienbeginn: "2014-09-30T22:00:00.000Z",
        studienende: null,
        vertiefungen: "Controlling und Unternehmensrechnung",
        ausbildung: null,
        engagement: null,
        canPL: "2013-12-22",
        canQM: "2013-12-22",
        lastchange: "1899-11-29",
        fuehrerschein: false,
        ersthelferausbildung: false,
        mentor: null,
        mentees: [],
        sprachen: [
          {
            wert: "Deutsch",
            niveau: 5,
          },
          {
            wert: "English",
            niveau: 3,
          },
          {
            wert: "Französisch",
            niveau: 1,
          },
        ],
        edvkenntnisse: [
          {
            wert: "MS-Office",
            niveau: 3,
          },
          {
            wert: "PHP",
            niveau: 1,
          },
        ],
      };
      const response = await request(app)
        .patch(`/api/members/${mitgliedID}`)
        .send(memberInfo)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(204);
    });

    test("should return 403 for update member with permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("r.norton", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8111;
      const memberInfo = {
        mitgliedID,
        vorname: "Brandon-Lee",
        nachname: "Frye",
        jbt_email: "b.frye@studentische-beratung.de",
        geschlecht: 1,
        geburtsdatum: "1990-06-05",
        handy: "0162/9846320",
        mitgliedstatus: "passives Mitglied",
        generation: null,
        internesprojekt: null,
        trainee_seit: "2011-04-30",
        mitglied_seit: "2012-11-30",
        alumnus_seit: null,
        senior_seit: null,
        aktiv_seit: "2012-11-30",
        passiv_seit: null,
        ausgetreten_seit: null,
        ressort: "Mitglieder",
        arbeitgeber: "Versicherung Deutschland",
        strasse1: "Woodsman Ave 61",
        plz1: "70364",
        ort1: "Stuttgart",
        tel1: null,
        email1: "brandon-lee@gmx.de",
        strasse2: "Budapester Straße 96",
        plz2: "56370",
        ort2: "Rheinland-Pfalz",
        tel2: "07042/984365",
        email2: "brandon-lee@gmx.de",
        hochschule: "Universität Hohenheim",
        studiengang: "Master of Financial Management",
        studienbeginn: "2014-09-30T22:00:00.000Z",
        studienende: null,
        vertiefungen: "Controlling und Unternehmensrechnung",
        ausbildung: null,
        engagement: null,
        canPL: "2013-12-22",
        canQM: "2013-12-22",
        lastchange: "1899-11-29",
        fuehrerschein: false,
        ersthelferausbildung: false,
        mentor: null,
        mentees: [],
        sprachen: [
          {
            wert: "Deutsch",
            niveau: 5,
          },
          {
            wert: "English",
            niveau: 3,
          },
          {
            wert: "Französisch",
            niveau: 1,
          },
        ],
        edvkenntnisse: [
          {
            wert: "MS-Office",
            niveau: 3,
          },
          {
            wert: "PHP",
            niveau: 1,
          },
        ],
      };
      const response = await request(app)
        .patch(`/api/members/${mitgliedID}`)
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
      const mitgliedID = 8167;
      const mitgliedstatus = "passives Mitglied";
      const response = await request(app)
        .patch(`/api/members/${mitgliedID}/status`)
        .send({ mitgliedstatus })
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
      const mitgliedID = 8167;
      const mitgliedstatus = "unbekannt";
      const response = await request(app)
        .patch(`/api/members/${mitgliedID}/status`)
        .send({ mitgliedstatus })
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
      const memberID = 8167;
      const permissionID = 8;
      const response = await request(app)
        .delete(`/api/members/permissions`)
        .send({ permissionID, memberID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(204);
    });

    test("should return 403 for delete member's permission without permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8167;
      const permissionID = 1;
      const response = await request(app)
        .delete(`/api/members/permissions`)
        .send({ permissionID, memberID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 403 for delete member's permission without permission as normal member", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8320;
      const permissionID = 5;
      const response = await request(app)
        .delete(`/api/members/permissions`)
        .send({ permissionID, memberID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 404 for delete member's permission without the member having one and not existing permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8320;
      const permissionID = 200;
      const response = await request(app)
        .delete(`/api/members/permissions`)
        .send({ permissionID, memberID })
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
