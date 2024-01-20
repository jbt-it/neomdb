import { describe, expect, test, beforeAll, beforeEach, afterEach, jest, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../../../src/app";
import TraineeTestUtils from "../../utils/traineeTestUtils";
import AuthTestUtils from "../../utils/authTestUtils";

const authTestUtils = new AuthTestUtils(app);
const traineeTestUtils = new TraineeTestUtils(app);

// --------------------------- SETUP AND TEARDOWN --------------------------- \\
beforeAll(() => {
  //try {
  return traineeTestUtils.initTraineeData();
  // await setupTraineeData();
  // } catch (error) {
  //console.log(error);
  // } // Executes after every test
  // await initTraineeData(); // Executes before the first test
  // await setupTraineeData();
});

beforeEach(() => {
  return traineeTestUtils.setupTraineeData(); // Executes before every test
});

afterEach(() => {
  return traineeTestUtils.clearTraineeData();
});

afterAll(() => {
  return traineeTestUtils.clearInitTraineeData();
});

// --------------------------- TESTS --------------------------- \\

// -----------------------GET ROUTES-----------------------

describe("GET /ip/:id", () => {
  test("should return 200 for getting an IP", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app).get("/api/trainees/ip/62").send().set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.projektname).toBe("JE7 Analyse");
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
    expect(response.body.length).toBe(2);
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

  test("should return 200 for getting Trainees choises generation ", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app)
      .get("/api/trainees/generations/15/trainee-choices")
      .send()
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});

describe("GET /ip/:id/mails", () => {
  test("should return 200 for getting Trainees email of an IP", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app).get("/api/trainees/ip/62/mails").send().set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("should return 404 for getting Trainees email of an unknown IP", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app).get("/api/trainees/ip/99/mails").send().set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(404);
  });
});

describe("GET /generations", () => {
  test("should return 403 for getting all generations without permission", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("b.frye", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN

    const response = await request(app).get("/api/trainees/generations").send().set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(403);
  });

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

    const response = await request(app)
      .get("/api/trainees/generations/15/motivation")
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

    const response = await request(app)
      .get("/api/trainees/generations/15/trainee-progress")
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
      votingStart: "2021-01-01",
      votingEnd: "2021-01-01",
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
      votingStart: "2021-01-01",
      votingEnd: "2021-01-01",
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
      votingStart: "123",
      votingEnd: 123,
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
      DLBeiEV: true,
      APGehalten: "2021-01-01",
      APBeiEV: true,
      ZPGehalten: "2021-01-01",
      ZPBeiEV: true,
      AngebotBeiEV: true,
      kickoff: "2021-01-01",
      kuerzel: "string",
      projektname: "string-long",
      generation: 15,
      internesProjektID: 62,
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
    const assignments = {
      DLBeiEV: true,
      APGehalten: "2021-01-01",
      APBeiEV: true,
      ZPGehalten: "2021-01-01",
      ZPBeiEV: true,
      AngebotBeiEV: true,
      kickoff: "2021-01-01",
      kuerzel: "string",
      projektname: "string-long",
      generation: 15,
      internesProjektID: 62,
    };
    const response = await request(app).put("/api/trainees/ip/62").send(assignments).set("Cookie", `token=${token}`);

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
