/**
 * Tests for code in the src/global directory
 */
import app from "../../src/app";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";

chai.use(chaiHttp);
const assert = chai.assert;
const expect = chai.expect;

describe("Global Test", () => {
  describe("Login Test", () => {
    describe("POST /users/login", () => {
      it("Should get a valid response after successful login", () => {
        return chai.request(app)
        .post("/users/login")
        .send({"username": "w.luft", "password": "s3cre7"})
        .then((res) => {

          // Check if response status is correct
          assert.equal(res.status, 200, "Request should be successful");

          // Check if crutial elements are included in the response
          assert.exists(res.body.token, "Response contains JWT token");
          assert.exists(res.body.id, "Response contains user id");
          assert.exists(res.body.name, "Response contains shortened username");

          // Check if contained elements are of the right type
          assert.typeOf(res.body.token, "string", "JWT token is a string");
          assert.typeOf(res.body.id, "number", "User id is a number");
          assert.typeOf(res.body.name, "string", "Shortened username is a string");
        });
      });
      it("Login should fail with incorrect password", () => {
        return chai.request(app)
        .post("/users/login")
        .send({"username": "w.luft", "password": "somethingThatIsNotACorrectPassw0rd"})
        .then((res) => {
          assert.equal(res.status, 401, "Request should fail with status 401");
          assert.isEmpty(res.body, "Empty response body after failed login");
        });
      });
      it("Login should fail with epmty password field", () => {
        return chai.request(app)
        .post("/users/login")
        .send({"username": "w.luft", "password": ""})
        .then((res) => {
          assert.equal(res.status, 401, "Request should fail with status 401");
          assert.isEmpty(res.body, "Empty response body after failed login");
        });
      });
    });
  });
  describe("Retrieve members list", () => {
    describe("GET /users", () => {
      it("Member list retrival should succeed", () => {
        return chai.request(app)
        .post("/users/login")
        .send({"username": "w.luft", "password": "s3cre7"})
        .then((res) => {
          return chai.request(app)
          .get("/users")
          .set("Authorization", "Bearer " + res.body.token)
          .then((users) => {

            // General Response
            assert.equal(users.status, 200, "Request should be successful");
            assert.isArray(users.body, "Response should contain array");
            assert.isNotEmpty(users.body, "Retrieved array should contain members");

            // Content of the response
            assert.exists(users.body[0].mitgliedID, "Responed Object contains member id");
            assert.exists(users.body[0].nachname, "Responed Object contains last name");
            assert.exists(users.body[0].vorname, "Responed Object contains first name");
            assert.exists(users.body[0].handy, "Responed Object contains mobile phone number");
            assert.exists(users.body[0].jbt_email, "Responed Object contains internal email address");
            assert.exists(users.body[0].mitgliedstatus, "Responed Object contains member status");
            assert.exists(users.body[0].ressort, "Responed Object contains department id");
            assert.isDefined(users.body[0].lastchange, "Responed Object contains date of last profile update");

            // Type of content of the response
            assert.typeOf(users.body[0].mitgliedID, "number", "Member id is a number");
            assert.typeOf(users.body[0].nachname, "string", "Last name is a string");
            assert.typeOf(users.body[0].vorname, "string", "First name is a string");
            assert.typeOf(users.body[0].handy, "string", "Phone number is a string");
            assert.typeOf(users.body[0].jbt_email, "string", "Email address is a string");
            assert.typeOf(users.body[0].mitgliedstatus, "string", "Member status is a string");
            assert.typeOf(users.body[0].ressort, "string", "Department id is a string");
            assert.typeOf(users.body[0].lastchange, "null", "Date of last profile update is a string ");
            expect(users.body[1].lastchange).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Date of last profile update is a string or null");
          });
        });
      });
      it("Member list retrieval should fail without JWT", () => {
        return chai.request(app)
        .get("/users")
        .set("Authorization", "Bearer ")
        .then((res) => {
          assert.equal(res.status, 401, "Request should fail with status 401");
          assert.isEmpty(res.body, "Empty response body after failed authentication");
        });
      });
      it("Member list retrieval should fail with outdated JWT", () => {
        return chai.request(app)
        .get("/users")
        .set("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.\
        eyJtaXRnbGllZElEIjo4NzA1LCJuYW1lIjoicC5ncmlmZmluIiwicGVybWlzc2lvbnMiOls2LDIxXSwiaWF0I\
        joxNTgxNjA0ODk5LCJleHAiOjE1ODE2OTEyOTl9.CJJpSO66yBhzqJdiah9BpAgWU2loceJI_w-SSAGEBVz7nN\
        ivTt6oLkLf0_HMy_oX5usNF2impE5jyMlPKl2pkA")
        .then((res) => {
          assert.equal(res.status, 401, "Request should fail with status 401");
          assert.isEmpty(res.body, "Empty response body after failed authentication");
        });
      });
    });
  });
  describe("Retrieve members profile", () => {

  });
});
