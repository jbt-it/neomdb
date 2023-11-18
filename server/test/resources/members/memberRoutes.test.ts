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
  return memberTestUtils.clearMemberData();
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

describe("Test member routes", () => {
  // --------------------------- TESTS --------------------------- \\

  // -----------------------GET ROUTES-----------------------
  describe("GET / get member", () => {
    test("should return 200 for getting all member data", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app).get("/api/users/").send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(10);
    });
  });

  describe("GET /directors", () => {
    test("should return 200 for getting directors", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("t.driscoll", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app).get("/api/users/directors").send().set("Cookie", `token=${token}`);

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

      const response = await request(app).get("/api/users/departments").send().set("Cookie", `token=${token}`);

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

      const response = await request(app).get("/api/users/department-members").send().set("Cookie", `token=${token}`);

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

      const response = await request(app).get("/api/users/edv-skills").send().set("Cookie", `token=${token}`);

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

      const response = await request(app).get("/api/users/languages").send().set("Cookie", `token=${token}`);

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

      const response = await request(app).get("/api/users/permissions").send().set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
    });

    test("should return 200 for getting permissions with having permissions", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN

      const response = await request(app).get("/api/users/permissions").send().set("Cookie", `token=${token}`);

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
        .get("/api/users/permission-assignments")
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
        .get("/api/users/permission-assignments")
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
      const response = await request(app).get(`/api/users/${mitgliedID}`).send().set("Cookie", `token=${token}`);

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
      const response = await request(app).get(`/api/users/${mitgliedID}`).send().set("Cookie", `token=${token}`);

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
      const response = await request(app).get(`/api/users/${mitgliedID}`).send().set("Cookie", `token=${token}`);

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
        .get(`/api/users/${mitgliedID}/permissions`)
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body.permissions).toEqual(loginResponse.body.permissions);
    });

    test("should return 200 for member without permissions gets empty return", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("r.norton", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8167;
      const response = await request(app)
        .get(`/api/users/${mitgliedID}/permissions`)
        .send()
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body.permissions).toHaveLength(0);
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
      const response = await request(app).post("/api/users/").send(newMember).set("Cookie", `token=${token}`);

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
      const response = await request(app).post("/api/users/").send(newMember).set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
      expect(response.text).toBe("Authorization failed: You are not permitted to do this");
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
      const firstResponse = await request(app).post("/api/users/").send(newMember).set("Cookie", `token=${token}`);
      const secondResponse = await request(app).post("/api/users/").send(newMember).set("Cookie", `token=${token}`);
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
        .post("/api/users/permissions")
        .send({ memberID, permissionID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Permission created");
      expect(response.body.mitgliedID).toBe(memberID);
      expect(response.body.berechtigungID).toBe(permissionID);
    });

    test("should return 403 for deligate without havig permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8320;
      const permissionID = 8;
      const response = await request(app)
        .post("/api/users/permissions")
        .send({ memberID, permissionID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
      expect(response.text).toBe("Permission cannot be delegated!");
    });

    test("should return 404 for deligate to member not existing", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 9999;
      const permissionID = 8;
      const response = await request(app)
        .post("/api/users/permissions")
        .send({ memberID, permissionID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(404);
      expect(response.text).toBe(`Member with id ${memberID} does not exist`);
    });

    test("should return 403 for deligate permission not existing", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8320;
      const permissionID = 9999;
      const response = await request(app)
        .post("/api/users/permissions")
        .send({ memberID, permissionID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
      expect(response.text).toBe("Permission cannot be delegated!");
    });
  });
  // -----------------------PATCH ROUTES-----------------------
  describe("PATCH /departments/:id", () => {
    test("should return 200 for director changes own departement info", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const departmentID = 1;
      const linkZielvorstellung =
        "https://juniorbusiness.sharepoint.com/:f:/s/RessortIT/hwekfoiwfjGFHCkhdllewlj12Q?e=JHVUZFZU";
      const linkOrganigramm = "https://juniorbusiness.sharepoint.com/:f:/s/RessortIT/kffkCDZTFU54698?e=GUJGZZU";
      const response = await request(app)
        .patch(`/api/users/departments/${departmentID}`)
        .send({ linkZielvorstellung, linkOrganigramm })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(11);
    });
  });

  describe("PATCH /:id  update Member", () => {
    test("should return 200 for update member with permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8167;
      const memberInfo = {
        mitgliedID,
        mentor: null,
        //sprachen: { Englisch: 5, Hindi: 6 },
        //edvkenntnisse: { "HTML/PHP": 2, "MS Office (Word, Powerpoint, Excel)": 3 },
        member: {
          mitgliedID,
          handy: "0123/456789",
        },
      };
      const response = await request(app)
        .patch(`/api/users/${mitgliedID}`)
        .send(memberInfo)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(11);
    });

    test("should return 403 for update member with permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("r.norton", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8167;
      const memberInfo = {
        mitgliedID,
        mentor: null,
        //sprachen: { Englisch: 5, Hindi: 6 },
        //edvkenntnisse: { "HTML/PHP": 2, "MS Office (Word, Powerpoint, Excel)": 3 },
        member: {
          mitgliedID,
          handy: "0123/456789",
        },
      };
      const response = await request(app)
        .patch(`/api/users/${mitgliedID}`)
        .send(memberInfo)
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
      expect(response.text).toBe("Authorization failed: You are not permitted to do this");
    });
  });

  describe("PATCH /:id/status Member", () => {
    test("should return 200 for update member status with permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8167;
      const mitgliedstatus = "passives Mitglied";
      const response = await request(app)
        .patch(`/api/users/${mitgliedID}/status`)
        .send({ mitgliedstatus })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.text).toBe("Status Update successful");
    });

    test("should return 422 for unknown member status", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8167;
      const mitgliedstatus = "unbekannt";
      const response = await request(app)
        .patch(`/api/users/${mitgliedID}/status`)
        .send({ mitgliedstatus })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(422);
      expect(response.text).toBe("Status unbekannt is not valid");
    });

    test("should return 403 for unauthorized user", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("r.norton", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const mitgliedID = 8167;
      const mitgliedstatus = "unbekannt";
      const response = await request(app)
        .patch(`/api/users/${mitgliedID}/status`)
        .send({ mitgliedstatus })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
      expect(response.text).toBe("Authorization failed: You are not permitted to do this");
    });
  });

  describe("DELETE /permissions", () => {
    test("should return 200 for delete member's permission with permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8167;
      const permissionID = 8;
      const response = await request(app)
        .delete(`/api/users/permissions`)
        .send({ permissionID, memberID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(200);
      expect(response.text).toBe("Permission deleted");
    });

    test("should return 403 for delete member's permission without permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8167;
      const permissionID = 1;
      const response = await request(app)
        .delete(`/api/users/permissions`)
        .send({ permissionID, memberID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
      expect(response.text).toBe("Permission cannot be deleted!");
    });

    test("should return 403 for delete member's permission without permission as normal member", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("w.luft", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8320;
      const permissionID = 5;
      const response = await request(app)
        .delete(`/api/users/permissions`)
        .send({ permissionID, memberID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
      expect(response.text).toBe("Permission cannot be deleted!");
    });

    test("should return 404 for delete member's permission without the member having one and not existing permission", async () => {
      // --- GIVEN
      const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
      const token = authTestUtils.extractAuthenticatonToken(loginResponse);

      // --- WHEN
      const memberID = 8320;
      const permissionID = 200;
      const response = await request(app)
        .delete(`/api/users/permissions`)
        .send({ permissionID, memberID })
        .set("Cookie", `token=${token}`);

      // --- THEN
      expect(response.status).toBe(403);
      expect(response.text).toBe("Permission cannot be deleted!");
    });
  });
});
