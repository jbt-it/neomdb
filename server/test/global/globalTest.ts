/**
 * Tests for code in the src/global directory
 */
import app from "../../src/app";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";

chai.use(chaiHttp);
const assert = chai.assert;

describe("Global Test", () => {
  describe("Login", () => {
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
});
