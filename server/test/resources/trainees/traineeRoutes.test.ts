import { describe, expect, test, beforeAll, beforeEach, afterEach, jest, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app";
import TraineeTestUtils from "../../utils/traineeTestUtils";
import AuthTestUtils from "../../utils/authTestUtils";
import { AppDataSource } from "../../../src/datasource";

const authTestUtils = new AuthTestUtils(app);
const traineeTestUtils = new TraineeTestUtils(app);

// --------------------------- SETUP AND TEARDOWN --------------------------- \\
beforeAll(async () => {
  // Initialize the data source
  await AppDataSource.initialize();
});

beforeEach(async () => {
  // Populate the database with test data before each test
  await traineeTestUtils.initTraineeData();
  await traineeTestUtils.setupTraineeData();
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

// --------------------------- TESTS --------------------------- \\

// -----------------------GET ROUTES-----------------------

describe("GET /ip/:id", () => {
  test("should return 200 for getting an IP", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    expect(loginResponse.status).toBe(200);
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app).get("/api/trainees/ip/62").send().set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.projectName).toBe("JE7 Analyse");
    // console.log(response.body.members);
    expect(response.body.members).toStrictEqual([
      {
        memberId: 8478,
        firstname: "Kellan",
        lastname: "Mclaughlin",
        memberStatus: {
          memberStatusId: 1,
          name: "Trainee",
        },
      },
      {
        memberId: 8748,
        firstname: "Mason",
        lastname: "Vinson",
        memberStatus: {
          memberStatusId: 1,
          name: "Trainee",
        },
      },
    ]);
    expect(response.body.qualityManagers).toStrictEqual([
      {
        memberId: 8320,
        firstname: "Radhika",
        lastname: "Norton",
        memberStatus: {
          memberStatusId: 4,
          name: "passives Mitglied",
        },
      },
      {
        memberId: 8324,
        firstname: "Miruna",
        lastname: "Decker",
        memberStatus: {
          memberStatusId: 5,
          name: "Alumnus",
        },
      },
    ]);
  });

  test("should return 404 for getting an IP not existing", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app).get("/api/trainees/ip/99").send().set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(404);
  });
});

describe("GET / Trainees", () => {
  test("should return 200 for getting Trainees of current generation", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app).get("/api/trainees").send().set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });
});

describe("GET /generations/:id/trainee-choices", () => {
  test("should return 403 for getting Trainees choises of generation without permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app)
      .get("/api/trainees/generations/15/trainee-choices")
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(403);
  });

  test("should return 404 for getting Trainees choises of unknown generation ", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app)
      .get("/api/trainees/generations/99/trainee-choices")
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(404);
  });

  test("should return 200 for getting Trainees choices generation ", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const generationID = 14;
    const response = await request(app)
      .get(`/api/trainees/generations/${generationID}/trainee-choices`)
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});

describe("GET /generations", () => {
  test("should return 200 for getting all generations", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app).get("/api/trainees/generations").send().set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(13);
  });
});

describe("GET /generations/:id/motivation", () => {
  test("should return 403 for getting motivation letters for a generation without permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app)
      .get("/api/trainees/generations/15/motivation")
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(403);
  });

  test("should return 200 for getting motivation letters for a generation with permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const generationID = 14;
    const response = await request(app)
      .get(`/api/trainees/generations/${generationID}/motivation`)
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});

describe("GET /generations/:id/mentors", () => {
  test("should return 403 for getting mentors for a generation without permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app)
      .get("/api/trainees/generations/15/mentors")
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(403);
  });

  test("should return 200 for getting mentors for a generation with permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app)
      .get("/api/trainees/generations/15/mentors")
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
});

describe("GET /generations/:id/internal-projects", () => {
  test("should return 403 for getting internal-projects for a generation without permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app)
      .get("/api/trainees/generations/15/internal-projects")
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(403);
  });

  test("should return 200 for getting internal-projects for a generation with permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app)
      .get("/api/trainees/generations/15/internal-projects")
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});

describe("GET /ips/current", () => {
  test("should return 200 for getting internal-projects for a generation with permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app).get("/api/trainees/ips/current").send().set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});

describe("GET /ips/all", () => {
  test("should return 200 for getting internal-projects for a generation with permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app).get("/api/trainees/ips/all").send().set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});

describe("GET /generations/:id/trainee-progress", () => {
  test("should return 403 for getting internal-projects for a generation without permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app)
      .get("/api/trainees/generations/15/trainee-progress")
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(403);
  });

  test("should return 200 for getting trainee-progress for a generation with permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const generationID = 14;
    const response = await request(app)
      .get(`/api/trainees/generations/${generationID}/trainee-progress`)
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});

describe("POST /generations/:id/set-deadline", () => {
  test("should return 403 for setting deadlines for a generation without permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const deadlines = {
      electionStart: "2021-01-01",
      electionEnd: "2021-01-01",
    };
    const response = await request(app)
      .post("/api/trainees/generations/15/set-deadline")
      .send(deadlines)
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(403);
  });

  test("should return 204 for setting deadlines for a generation with permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const deadlines = {
      electionStart: "2021-01-01",
      electionEnd: "2021-01-01",
    };
    const response = await request(app)
      .post("/api/trainees/generations/15/set-deadline")
      .send(deadlines)
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(204);
  });

  test("should return 422 for setting deadlines for a generation with invalid data", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const deadlines = {
      electionStart: "123",
      electionEnd: 123,
    };
    const response = await request(app)
      .post("/api/trainees/generations/15/set-deadline")
      .send(deadlines)
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(422);
  });
});

describe("POST /generations/:id/add-mentor/:memberID", () => {
  test("should return 403 for adding a mentor to a generation without permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const response = await request(app)
      .post("/api/trainees/generations/15/add-mentor/8111")
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(403);
  });

  test("should return 204 for adding a mentor to a generation with permission Test 1", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const response = await request(app)
      .post("/api/trainees/generations/15/add-mentor/8167")
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(204);
  });

  test("should return 204 for adding a mentor to a generation with permission Test 2", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const response = await request(app)
      .post("/api/trainees/generations/15/add-mentor/8167")
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(204);
  });

  test("should return 422 for setting set-deadline for a generation with invalid data", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const response = await request(app)
      .post("/api/trainees/generations/15/add-mentor/abc")
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(422);
  });
});

describe("PATCH /:id/assignment", () => {
  test("should return 403 for setting assignments for a trainee without permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const assignments = {
      memberID: 8478,
      ipID: 62,
      mentorID: 8167,
      departmentID: 1,
    };
    const response = await request(app)
      .patch("/api/trainees/8478/assignment")
      .send(assignments)
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(403);
  });

  test("should return 204 for setting assignments for a trainee with permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const assignments = {
      //memberID: 8478,
      ipID: 62,
      mentorID: 8167,
      departmentID: 1,
    };
    const response = await request(app)
      .patch("/api/trainees/8478/assignment")
      .send(assignments)
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(204);
  });

  test("should return 422 for setting assignments for a trainee with invalid data", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const assignments = {
      memberID: "1234",
      ipID: "abc",
      mentorID: "xyz",
      departmentID: "ß",
    };
    const response = await request(app)
      .patch("/api/trainees/8478/assignment")
      .send(assignments)
      .set("Cookie", `token=${token}`);
    // --- THEN
    expect(response.status).toBe(422);
  });
});

describe("PUT /ip/:id", () => {
  test("should return 403 for setting IP without permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const assignments = {
      internalProjectID: 62,
      generation: 15,
      generationName: "Wintersemester 19/20",
      projectName: "string-long",
      dlAtEv: true,
      apHeld: new Date("2021-01-01"),
      apAtEv: true,
      zpHeld: new Date("2021-01-01"),
      zpAtEv: true,
      offerAtEv: true,
      kickoff: new Date("2021-01-01"),
      abbreviation: "string",
    };
    const response = await request(app).put("/api/trainees/ip/62").send(assignments).set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(403);
  });

  test("should return 204 for setting IP with permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const newIPData = {
      members: [
        {
          memberId: 8478,
          firstname: "Kellan",
          lastname: "Mclaughlin",
        },
        {
          memberId: 8748,
          firstname: "Mason",
          lastname: "Vinson",
        },
      ],
      qualityManagers: [
        {
          memberId: 8320,
          firstname: "Radhika",
          lastname: "Norton",
        },
        {
          memberId: 8222,
          firstname: "Talha",
          lastname: "Driscoll",
        },
      ],
      dlAtEv: true,
      apHeld: new Date("2021-01-01"),
      apAtEv: true,
      zpHeld: new Date("2021-01-01"),
      zpAtEv: true,
      offerAtEv: true,
      kickoff: new Date("2021-01-01"),
      abbreviation: "string",
      projectName: "string-long",
      generation: 15,
      generationName: "string-long",
      internalProjectID: 62,
    };
    const response = await request(app).put("/api/trainees/ip/62").send(newIPData).set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(204);
  });

  test("should return 422 for setting IP with invalid data", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const assignments = {
      DLBeiEV: 1,
      APGehalten: "",
      APBeiEV: 2,
      ZPGehalten: null,
      ZPBeiEV: 3,
      AngebotBeiEV: 0,
      kickoff: "abc",
      kuerzel: true,
      projektname: 9.9,
      generation: 3,
      internesProjektID: 62,
    };
    const response = await request(app).put("/api/trainees/ip/62").send(assignments).set("Cookie", `token=${token}`);
    // --- THEN
    expect(response.status).toBe(422);
  });
});
describe("POST /admission/:id", () => {
  test("should return 204 for setting admission for a trainee with permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const response = await request(app).post("/api/trainees/admission/8478").set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(204);
  });

  test("should return 403 for setting admission for a trainee without permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const response = await request(app).post("/api/trainees/admission/8478").set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(403);
  });

  test("should return 404 for setting admission for a trainee with invalid id", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const response = await request(app).post("/api/trainees/admission/9999").set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(404);
  });
});
