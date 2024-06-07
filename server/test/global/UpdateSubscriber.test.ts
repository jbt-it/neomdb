import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "../../src/app";
import { AppDataSource } from "../../src/datasource";
import { Trace } from "../../src/entities/Trace";
import AuthTestUtils from "../utils/authTestUtils";
import MemberTestUtils from "../utils/memberTestUtils";

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

describe("Test UpdateSubscriber", () => {
  test("Should create a trace entry when a member is updated", async () => {
    // --- GIVEN
    const loginResponse = await authTestUtils.performLogin("m.decker", "s3cre7");
    const token = authTestUtils.extractAuthenticatonToken(loginResponse);

    // --- WHEN
    const memberId = 8324;
    // Retrieve the member
    const memberResponse = await request(app).get(`/api/members/${memberId}`).set("Cookie", `token=${token}`);
    const updatedMember = {
      ...memberResponse.body,
      employer: "Changed employer",
      specializations: "Changed specializations",
    };
    const response = await request(app)
      .patch(`/api/members/${memberId}`)
      .send(updatedMember)
      .set("Cookie", `token=${token}`);

    // --- THEN
    expect(response.status).toBe(204);
    // Wait for the subscriber to finish
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const traceRepository = AppDataSource.getRepository(Trace);
    const traces = await traceRepository.find();
    expect(traces.length).toBe(1);
    expect(traces[0].changedId).toBe(memberId);
    expect(traces[0].table).toBe("Member");
    expect(traces[0].action).toBe("Changed employer and specializations.");
  });
});
