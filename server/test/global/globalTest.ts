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

            // Type of content of the response
            assert.typeOf(users.body[0].mitgliedID, "number", "Response contains member id of type number");
            assert.typeOf(users.body[0].nachname, "string", "Response contains last name of type string");
            assert.typeOf(users.body[0].vorname, "string", "Response contains first name of type string");
            assert.typeOf(users.body[0].handy, "string", "Response contains mobile phone number of type string");
            assert.typeOf(users.body[0].jbt_email, "string", "Response contains email address of type string");
            assert.typeOf(users.body[0].mitgliedstatus, "string", "Response contains member status of type string");
            assert.typeOf(users.body[0].ressort, "string", "Response contains department id of type string");
            expect(users.body[0].lastchange).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains date of last profile update of type string or null");
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
    describe("GET /users/:id", () => {
      it("Member profile retrieval should succeed without financial data due to no permission and not own profile", () => {
        return chai.request(app)
        .post("/users/login")
        .send({"username": "m.decker", "password": "s3cre7"})
        .then((res) => {
          return chai.request(app)
          .get("/users/profile/8167")
          .set("Authorization", "Bearer " + res.body.token)
          .then((profile) => {

            // General response
            assert.equal(profile.status, 200, "Request should be successful");
            assert.isArray(profile.body, "Response should contain array");
            assert.lengthOf(profile.body, 1, "Retrieved array should contain only one profile");

            // Response should contain
            assert.typeOf(profile.body[0].mitgliedID, "number", "Response contains member id of type number");
            assert.typeOf(profile.body[0].vorname, "string", "Response contains first name of type string");
            assert.typeOf(profile.body[0].nachname, "string", "Response contains last name of type string");
            assert.typeOf(profile.body[0].geschlecht, "number", "Response contains gender of type number");
            assert.typeOf(profile.body[0].geburtsdatum, "string", "Response contains date of birth of type string");
            assert.typeOf(profile.body[0].handy, "string", "Response contains mobile phone number of type string");
            assert.typeOf(profile.body[0].mitgliedstatus, "number", "Response contains member status of type number");
            expect(profile.body[0].generation).to.satisfy((s: any) => {
              return s === null || typeof(s) === "number";
            }, "Response contains generation id of type number or null");
            expect(profile.body[0].internesprojekt).to.satisfy((s: any) => {
              return s === null || typeof(s) === "number";
            }, "Response contains internal project id of type number or null");
            expect(profile.body[0].mentor).to.satisfy((s: any) => {
              return s === null || typeof(s) === "number";
            }, "Response contains mentor id of type number or null");
            expect(profile.body[0].trainee_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of traineeship of type string or null");
            expect(profile.body[0].mitglied_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of membership of type string or null");
            expect(profile.body[0].alumnus_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of alumnusship of type string or null");
            expect(profile.body[0].senior_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of senioreship of type string or null");
            expect(profile.body[0].aktiv_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of activity of type string or null");
            expect(profile.body[0].passiv_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of passivity of type string or null");
            expect(profile.body[0].ausgetreten_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains end of membership of type string or null");
            assert.typeOf(profile.body[0].ressort, "number", "Response contains department id of type number");
            expect(profile.body[0].arbeitgeber).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains employer of type string or null");
            assert.typeOf(profile.body[0].strasse1, "string", "Response contains primary street of type string");
            assert.typeOf(profile.body[0].plz1, "string", "Response contains primary zip code of type string");
            assert.typeOf(profile.body[0].ort1, "string", "Response contains primary area of type string");
            expect(profile.body[0].tel1).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains primary phone number of type string or null");
            assert.typeOf(profile.body[0].email1, "string", "Response contains primary email address of type string");
            expect(profile.body[0].strasse2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary street of type string or null");
            expect(profile.body[0].plz2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary zip code of type string or null");
            expect(profile.body[0].ort2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary area of type string or null");
            expect(profile.body[0].tel2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary phone number of type string or null");
            expect(profile.body[0].email2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary email address of type string or null");
            assert.typeOf(profile.body[0].hochschule, "string", "Response contains name of university of type string");
            assert.typeOf(profile.body[0].studiengang, "string", "Response contains study program of type string");
            assert.typeOf(profile.body[0].studienbeginn, "string", "Response contains date of start of studies of type string");
            expect(profile.body[0].studienende).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains date of end of studies of type string or null");
            expect(profile.body[0].vertiefungen).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains in depth studies of type string or null");
            expect(profile.body[0].ausbildung).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains apprenticeship of type string or null");

            // Response should not contain
            assert.notProperty(profile.body[0], "kontoinhaber");
            assert.notProperty(profile.body[0], "iban");
            assert.notProperty(profile.body[0], "bic");
          });
        });
      });
      it("Member profile retrieval should succeed with financial data due to permission", () => {
        return chai.request(app)
        .post("/users/login")
        .send({"username": "w.luft", "password": "s3cre7"})
        .then((res) => {
          return chai.request(app)
          .get("/users/profile/8324")
          .set("Authorization", "Bearer " + res.body.token)
          .then((profile) => {

            // General response
            assert.equal(profile.status, 200, "Request should be successful");
            assert.isArray(profile.body, "Response should contain array");
            assert.lengthOf(profile.body, 1, "Retrieved array should contain only one profile");

            // Response should contain
            assert.typeOf(profile.body[0].mitgliedID, "number", "Response contains member id of type number");
            assert.typeOf(profile.body[0].vorname, "string", "Response contains first name of type string");
            assert.typeOf(profile.body[0].nachname, "string", "Response contains last name of type string");
            assert.typeOf(profile.body[0].geschlecht, "number", "Response contains gender of type number");
            assert.typeOf(profile.body[0].geburtsdatum, "string", "Response contains date of birth of type string");
            assert.typeOf(profile.body[0].handy, "string", "Response contains mobile phone number of type string");
            assert.typeOf(profile.body[0].mitgliedstatus, "number", "Response contains member status of type number");
            expect(profile.body[0].generation).to.satisfy((s: any) => {
              return s === null || typeof(s) === "number";
            }, "Response contains generation id of type number or null");
            expect(profile.body[0].internesprojekt).to.satisfy((s: any) => {
              return s === null || typeof(s) === "number";
            }, "Response contains internal project id of type number or null");
            expect(profile.body[0].mentor).to.satisfy((s: any) => {
              return s === null || typeof(s) === "number";
            }, "Response contains mentor id of type number or null");
            expect(profile.body[0].trainee_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of traineeship of type string or null");
            expect(profile.body[0].mitglied_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of membership of type string or null");
            expect(profile.body[0].alumnus_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of alumnusship of type string or null");
            expect(profile.body[0].senior_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of senioreship of type string or null");
            expect(profile.body[0].aktiv_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of activity of type string or null");
            expect(profile.body[0].passiv_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of passivity of type string or null");
            expect(profile.body[0].ausgetreten_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains end of membership of type string or null");
            assert.typeOf(profile.body[0].ressort, "number", "Response contains department id of type number");
            expect(profile.body[0].arbeitgeber).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains employer of type string or null");
            assert.typeOf(profile.body[0].strasse1, "string", "Response contains primary street of type string");
            assert.typeOf(profile.body[0].plz1, "string", "Response contains primary zip code of type string");
            assert.typeOf(profile.body[0].ort1, "string", "Response contains primary area of type string");
            expect(profile.body[0].tel1).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains primary phone number of type string or null");
            assert.typeOf(profile.body[0].email1, "string", "Response contains primary email address of type string");
            expect(profile.body[0].strasse2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary street of type string or null");
            expect(profile.body[0].plz2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary zip code of type string or null");
            expect(profile.body[0].ort2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary area of type string or null");
            expect(profile.body[0].tel2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary phone number of type string or null");
            expect(profile.body[0].email2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary email address of type string or null");
            assert.typeOf(profile.body[0].hochschule, "string", "Response contains name of university of type string");
            assert.typeOf(profile.body[0].studiengang, "string", "Response contains study program of type string");
            assert.typeOf(profile.body[0].studienbeginn, "string", "Response contains date of start of studies of type string");
            expect(profile.body[0].studienende).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains date of end of studies of type string or null");
            expect(profile.body[0].vertiefungen).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains in depth studies of type string or null");
            expect(profile.body[0].ausbildung).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains apprenticeship of type string or null");
            assert.typeOf(profile.body[0].kontoinhaber, "string", "Response contains owner of bank account of type string");
            assert.typeOf(profile.body[0].iban, "string", "Response contains iban of bank account of type string");
            assert.typeOf(profile.body[0].bic, "string", "Response contains bic of bank account of type string");
          });
        });
      });
      it("Member profile retrieval should succeed with financial data due to own profile", () => {
        return chai.request(app)
        .post("/users/login")
        .send({"username": "m.decker", "password": "s3cre7"})
        .then((res) => {
          return chai.request(app)
          .get("/users/profile/8324")
          .set("Authorization", "Bearer " + res.body.token)
          .then((profile) => {
            
            // General response
            assert.equal(profile.status, 200, "Request should be successful");
            assert.isArray(profile.body, "Response should contain array");
            assert.lengthOf(profile.body, 1, "Retrieved array should contain only one profile");
            
            // Response should contain
            assert.typeOf(profile.body[0].mitgliedID, "number", "Response contains member id of type number");
            assert.typeOf(profile.body[0].vorname, "string", "Response contains first name of type string");
            assert.typeOf(profile.body[0].nachname, "string", "Response contains last name of type string");
            assert.typeOf(profile.body[0].geschlecht, "number", "Response contains gender of type number");
            assert.typeOf(profile.body[0].geburtsdatum, "string", "Response contains date of birth of type string");
            assert.typeOf(profile.body[0].handy, "string", "Response contains mobile phone number of type string");
            assert.typeOf(profile.body[0].mitgliedstatus, "number", "Response contains member status of type number");
            expect(profile.body[0].generation).to.satisfy((s: any) => {
              return s === null || typeof(s) === "number";
            }, "Response contains generation id of type number or null");
            expect(profile.body[0].internesprojekt).to.satisfy((s: any) => {
              return s === null || typeof(s) === "number";
            }, "Response contains internal project id of type number or null");
            expect(profile.body[0].mentor).to.satisfy((s: any) => {
              return s === null || typeof(s) === "number";
            }, "Response contains mentor id of type number or null");
            expect(profile.body[0].trainee_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of traineeship of type string or null");
            expect(profile.body[0].mitglied_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of membership of type string or null");
            expect(profile.body[0].alumnus_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of alumnusship of type string or null");
            expect(profile.body[0].senior_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of senioreship of type string or null");
            expect(profile.body[0].aktiv_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of activity of type string or null");
            expect(profile.body[0].passiv_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of passivity of type string or null");
            expect(profile.body[0].ausgetreten_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains end of membership of type string or null");
            assert.typeOf(profile.body[0].ressort, "number", "Response contains department id of type number");
            expect(profile.body[0].arbeitgeber).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains employer of type string or null");
            assert.typeOf(profile.body[0].strasse1, "string", "Response contains primary street of type string");
            assert.typeOf(profile.body[0].plz1, "string", "Response contains primary zip code of type string");
            assert.typeOf(profile.body[0].ort1, "string", "Response contains primary area of type string");
            expect(profile.body[0].tel1).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains primary phone number of type string or null");
            assert.typeOf(profile.body[0].email1, "string", "Response contains primary email address of type string");
            expect(profile.body[0].strasse2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary street of type string or null");
            expect(profile.body[0].plz2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary zip code of type string or null");
            expect(profile.body[0].ort2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary area of type string or null");
            expect(profile.body[0].tel2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary phone number of type string or null");
            expect(profile.body[0].email2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary email address of type string or null");
            assert.typeOf(profile.body[0].hochschule, "string", "Response contains name of university of type string");
            assert.typeOf(profile.body[0].studiengang, "string", "Response contains study program of type string");
            assert.typeOf(profile.body[0].studienbeginn, "string", "Response contains date of start of studies of type string");
            expect(profile.body[0].studienende).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains date of end of studies of type string or null");
            expect(profile.body[0].vertiefungen).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains in depth studies of type string or null");
            expect(profile.body[0].ausbildung).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains apprenticeship of type string or null");
            assert.typeOf(profile.body[0].kontoinhaber, "string", "Response contains owner of bank account of type string");
            assert.typeOf(profile.body[0].iban, "string", "Response contains iban of bank account of type string");
            assert.typeOf(profile.body[0].bic, "string", "Response contains bic of bank account of type string");
          });
        });
      });
      it("Member profile retrieval should succeed with financial data due to permission and own profile", () => {
        return chai.request(app)
        .post("/users/login")
        .send({"username": "w.luft", "password": "s3cre7"})
        .then((res) => {
          return chai.request(app)
          .get("/users/profile/8167")
          .set("Authorization", "Bearer " + res.body.token)
          .then((profile) => {
            
            // General response
            assert.equal(profile.status, 200, "Request should be successful");
            assert.isArray(profile.body, "Response should contain array");
            assert.lengthOf(profile.body, 1, "Retrieved array should contain only one profile");
            
            // Response should contain
            assert.typeOf(profile.body[0].mitgliedID, "number", "Response contains member id of type number");
            assert.typeOf(profile.body[0].vorname, "string", "Response contains first name of type string");
            assert.typeOf(profile.body[0].nachname, "string", "Response contains last name of type string");
            assert.typeOf(profile.body[0].geschlecht, "number", "Response contains gender of type number");
            assert.typeOf(profile.body[0].geburtsdatum, "string", "Response contains date of birth of type string");
            assert.typeOf(profile.body[0].handy, "string", "Response contains mobile phone number of type string");
            assert.typeOf(profile.body[0].mitgliedstatus, "number", "Response contains member status of type number");
            expect(profile.body[0].generation).to.satisfy((s: any) => {
              return s === null || typeof(s) === "number";
            }, "Response contains generation id of type number or null");
            expect(profile.body[0].internesprojekt).to.satisfy((s: any) => {
              return s === null || typeof(s) === "number";
            }, "Response contains internal project id of type number or null");
            expect(profile.body[0].mentor).to.satisfy((s: any) => {
              return s === null || typeof(s) === "number";
            }, "Response contains mentor id of type number or null");
            expect(profile.body[0].trainee_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of traineeship of type string or null");
            expect(profile.body[0].mitglied_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of membership of type string or null");
            expect(profile.body[0].alumnus_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of alumnusship of type string or null");
            expect(profile.body[0].senior_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of senioreship of type string or null");
            expect(profile.body[0].aktiv_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of activity of type string or null");
            expect(profile.body[0].passiv_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains begin of passivity of type string or null");
            expect(profile.body[0].ausgetreten_seit).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains end of membership of type string or null");
            assert.typeOf(profile.body[0].ressort, "number", "Response contains department id of type number");
            expect(profile.body[0].arbeitgeber).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains employer of type string or null");
            assert.typeOf(profile.body[0].strasse1, "string", "Response contains primary street of type string");
            assert.typeOf(profile.body[0].plz1, "string", "Response contains primary zip code of type string");
            assert.typeOf(profile.body[0].ort1, "string", "Response contains primary area of type string");
            expect(profile.body[0].tel1).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains primary phone number of type string or null");
            assert.typeOf(profile.body[0].email1, "string", "Response contains primary email address of type string");
            expect(profile.body[0].strasse2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary street of type string or null");
            expect(profile.body[0].plz2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary zip code of type string or null");
            expect(profile.body[0].ort2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary area of type string or null");
            expect(profile.body[0].tel2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary phone number of type string or null");
            expect(profile.body[0].email2).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains secondary email address of type string or null");
            assert.typeOf(profile.body[0].hochschule, "string", "Response contains name of university of type string");
            assert.typeOf(profile.body[0].studiengang, "string", "Response contains study program of type string");
            assert.typeOf(profile.body[0].studienbeginn, "string", "Response contains date of start of studies of type string");
            expect(profile.body[0].studienende).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains date of end of studies of type string or null");
            expect(profile.body[0].vertiefungen).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains in depth studies of type string or null");
            expect(profile.body[0].ausbildung).to.satisfy((s: any) => {
              return s === null || typeof(s) === "string";
            }, "Response contains apprenticeship of type string or null");
            assert.typeOf(profile.body[0].kontoinhaber, "string", "Response contains owner of bank account of type string");
            assert.typeOf(profile.body[0].iban, "string", "Response contains iban of bank account of type string");
            assert.typeOf(profile.body[0].bic, "string", "Response contains bic of bank account of type string");
          });
        });
      });
      it("Member profile retrieval should fail without JWT", () => {
        return chai.request(app)
        .get("/users/profile/8167")
        .set("Authorization", "Bearer ")
        .then((res) => {
          assert.equal(res.status, 401, "Request should fail with status 401");
          assert.isEmpty(res.body, "Empty response body after failed authentication");
        });
      });
      it("Member profile retrieval should fail with outdated JWT", () => {
        return chai.request(app)
        .get("/users/profile/8167")
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
  describe("Retrieve members permissions", () => {
    describe("GET /users/permissions/", () => {
      it("Permission retrieval should succeed due to permission", () => {
        return chai.request(app)
        .post("/users/login")
        .send({"username": "w.luft", "password": "s3cre7"})
        .then((res) => {
          return chai.request(app)
          .get("/users/permissions")
          .set("Authorization", "Bearer " + res.body.token)
          .then((permissions) => {

            // Check if response status is correct
            assert.equal(permissions.status, 200, "Request should be successful");
            assert.isArray(permissions.body, "Response should contain array");
            assert.isNotEmpty(permissions.body, "Response contains at least one permission");

            // Response should contain
            assert.typeOf(permissions.body[0].vorname, "string", "Response contains first name of type string");
            assert.typeOf(permissions.body[0].nachname, "string", "Response contains last name of type string");
            assert.typeOf(permissions.body[0].permission, "number", "Response contains permission id of type number");
          });
        });
      });
      it("Permissions retrieval should fail due to no permission", () => {
        return chai.request(app)
        .post("/users/login")
        .send({"username": "m.decker", "password": "s3cre7"})
        .then((res) => {
          return chai.request(app)
          .get("/users/permissions")
          .set("Authorization", "Bearer " + res.body.token)
          .then((permissions) => {

            // Check if response status is correct
            assert.equal(permissions.status, 403, "Request should be successful");
            assert.isEmpty(permissions.body, "Response contains no permissions");
          });
        });
      });
      it("Permissions retrieval should fail without JWT", () => {
        return chai.request(app)
        .get("/users/permissions")
        .set("Authorization", "Bearer ")
        .then((res) => {
          assert.equal(res.status, 401, "Request should fail with status 401");
          assert.isEmpty(res.body, "Empty response body after failed authentication");
        });
      });
      it("Permissions retrieval should fail with outdated JWT", () => {
        return chai.request(app)
        .get("/users/permissions")
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
});
