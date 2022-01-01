/**
 * Definition of the handler functions for the members module
 */
import database = require("../database");
import auth = require("../global/authController");
import bcrypt = require("bcryptjs");

import { Request, Response } from "express";
import * as membersTypes from "./membersTypes";
import { JWTPayload } from "../global/globalTypes";
import { createNCUser } from "../utils/nextcloud";
import { addMailAccountToMailingList, createMailAccount } from "../utils/plesk";
import { createMWUser } from "../utils/mediawiki";
import { getRandomString } from "../utils/stringUtils";

/**
 * Obtains username and corresponding permissions
 */
export const login = (req: Request, res: Response): void => {
  if (req.body.username === "" || req.body.password === "") {
    res.status(401).send("Credentials incomplete");
  } else {
    database
      .query(
        `SELECT mitgliedID, name, passwordHash, GROUP_CONCAT(mitglied_has_berechtigung.berechtigung_berechtigungID) AS permissions
    FROM mitglied
    LEFT JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID
    WHERE mitglied.name = ?
    GROUP BY mitgliedID, name`,
        [req.body.username]
      )
      .then((result: membersTypes.LoginQueryResult[]) => {
        if (result.length === 0) {
          res.status(401).send("Username or password wrong");
        }
        bcrypt
          .compare(req.body.password, result[0].passwordHash)
          .then((match) => {
            if (match) {
              const payload: JWTPayload = {
                mitgliedID: result[0].mitgliedID,
                name: result[0].name,
                permissions: result[0].permissions
                  ? result[0].permissions.split(",").map(Number)
                  : [],
              };
              res.status(200).json({
                token: auth.generateJWT(payload),
              });
            } else {
              res.status(401).send("Username or password wrong");
            }
          })
          .catch((err) => {
            res.status(401).send("Username or password wrong");
          });
      })
      .catch((err) => {
        res.status(500).send("Query Error");
      });
  }
};

/**
 * User can change his password knowing his old one
 * Updates the passwordHash in the database
 * Returns a 200 only when the update was succesfull
 */
export const changePassword = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT passwordHash
    FROM mitglied
    WHERE mitglied.name = ?`,
      [req.body.userName]
    )
    .then((result: membersTypes.GetPasswordForValidation[]) => {
      if (result.length === 0) {
        res.status(204).send("User does not exist");
      }
      bcrypt
        .compare(req.body.oldPassword, result[0].passwordHash)
        .then((match) => {
          if (match) {
            bcrypt
              .hash(req.body.newPassword, 10)
              .then((hash) => {
                // Store hash in your password DB
                database
                  .query(
                    `UPDATE mitglied
                SET passwordHash = ?
                WHERE mitglied.name = ?
                AND mitglied.mitgliedID = ?`,
                    [hash, req.body.userName, req.body.userID]
                  )
                  .then(() => {
                    res.status(200).send("The new password has been saved");
                  })
                  .catch(() => {
                    res.status(500).send("Update query Error");
                  });
              })
              .catch((error) => {
                res.status(500).send("Internal Error");
              });
          } else {
            res.status(401).send("The old password was not correct");
          }
        });
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Retrieves an overview of all registered members
 */
export const retrieveMemberList = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT mitgliedID, nachname, vorname, handy, mitglied.jbt_email, mitgliedstatus.bezeichnung AS mitgliedstatus, ressort.kuerzel AS ressort, lastchange
   FROM mitglied
   INNER JOIN ressort ON mitglied.ressort = ressort.ressortID
   INNER JOIN mitgliedstatus ON mitglied.mitgliedstatus = mitgliedstatus.mitgliedstatusID
   ORDER BY nachname DESC`,
      []
    )
    .then((result: membersTypes.GetMembersQueryResult) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Retrieves a member specified by id
 * Returns financial data iff member has permission or is himself
 */
export const retrieveMember = (req: Request, res: Response): void => {
  if (
    Number(req.params.id) === res.locals.memberID ||
    res.locals.permissions.includes(6)
  ) {
    database
      .query(
        `SELECT mitgliedID, vorname, nachname, geschlecht, geburtsdatum, handy, mitgliedstatus,
      generation, internesprojekt, mentor, trainee_seit, mitglied_seit, alumnus_seit,
      senior_seit, aktiv_seit, passiv_seit, ausgetreten_seit, ressort, arbeitgeber,
      strasse1, plz1, ort1, tel1, email1, strasse2, plz2, ort2, tel2, email2, hochschule,
      studiengang, studienbeginn, studienende, vertiefungen, ausbildung, kontoinhaber,
      iban, bic, engagement, canPL, canQM, lastchange, fuehrerschein, ersthelferausbildung
      FROM mitglied
      WHERE mitgliedID = ?`,
        [req.params.id]
      )
      .then((result: []) => {
        if (result.length === 0) {
          res.status(404).send("User not found");
        } else {
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        res.status(500).send("Query Error");
      });
  } else {
    database
      .query(
        `SELECT mitgliedID, vorname, nachname, geschlecht, geburtsdatum, handy, mitgliedstatus,
      generation, internesprojekt, mentor, trainee_seit, mitglied_seit, alumnus_seit,
      senior_seit, aktiv_seit, passiv_seit, ausgetreten_seit, ressort, arbeitgeber,
      strasse1, plz1, ort1, tel1, email1, strasse2, plz2, ort2, tel2, email2, hochschule,
      studiengang, studienbeginn, studienende, vertiefungen, ausbildung, engagement, canPL,
      canQM, lastchange, fuehrerschein, ersthelferausbildung
      FROM mitglied
      WHERE mitgliedID = ?`,
        [req.params.id]
      )
      .then((result: []) => {
        if (result.length === 0) {
          res.status(404).send("User not found");
        } else {
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        res.status(500).send("Query Error");
      });
  }
};

/**
 * Retrieves all members of a department
 */
export const retrieveDepartmentMembers = (
  req: Request,
  res: Response
): void => {
  database
    .query(
      `SELECT mitgliedID, vorname, nachname, ressort, bezeichnung
    FROM mitglied, ressort
    WHERE ressort = ressortID AND mitgliedstatus <= 3
    ORDER BY ressortID`,
      []
    )
    .then((result: membersTypes.GetDepartmentMembersQueryResult[]) => {
      if (result.length === 0) {
        res.status(404).send("Members not found");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Retrieves all current directors
 */
export const retrieveCurrentDirectors = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT mitgliedID, vorname, nachname, geschlecht, bezeichnung_weiblich, bezeichnung_maennlich, kuerzel
    FROM mitglied, mitglied_has_evposten, evposten
    WHERE mitgliedID = mitglied_mitgliedID AND von < DATE(NOW()) AND DATE(NOW()) < bis AND evpostenID = evposten_evpostenID`,
      []
    )
    .then((result: membersTypes.GetCurrentDirectorsQueryResult[]) => {
      if (result.length === 0) {
        res.status(404).send("Directors not found");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Creates a new member in the database and creates accounts
 * for the different systems (webmail, nextcloud, mediawiki)
 */
export const createMember = (req: Request, res: Response): void => {
  let jbtMail = "";
  if (req.body.name) {
    jbtMail = `${req.body.name}@studentische-beratung.de`;
  } else {
    res.status(500).send("Username not specified");
    return;
  }

  /**
   * Overview of the status of the different account creation operations
   */
  let statusOverview = {
    // Status of the query to create a member in the database
    queryStatus: "fail",

    // Error message if query failed
    queryErrorMsg: "",

    // Status of the mail api-call to create a mail account
    mailStatus: "fail",

    // Error message if mail account creation failed
    mailErrorMsg: "",

    // Status of the mail api-call to add the mail account to a mailing list
    mailListStatus: "fail",

    // Error message if mail account couldn't be added to the mailing list
    mailListErrorMsg: "",

    // Status of the nextcloud api-call to create a nextcloud account
    nextcloudStatus: "fail",

    // Error message if nextcloud account creation failed
    nextcloudErrorMsg: "",

    // Status of the mediawiki api-call to create a mediawiki account
    wikiStatus: "fail",

    // Error message if wiki account creation failed
    wikiErrorMsg: "",
  };

  bcrypt
    .hash(req.body.password, 12)
    .then((hash) => {
      database
        .query(
          `INSERT INTO mitglied (vorname, nachname, name, geschlecht, passwordHash, icalToken, mitgliedstatus, generation, trainee_seit, email2, jbt_email, ressort)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            req.body.vorname,
            req.body.nachname,
            req.body.name,
            req.body.geschlecht,
            hash,
            getRandomString(16),
            1,
            req.body.generation,
            req.body.traineeSeit,
            req.body.email,
            jbtMail,
            8,
            req.body.geburtsdatum,
            req.body.handy,
          ]
        )
        .then((result) => {
          // Set the status of the query
          statusOverview = { ...statusOverview, queryStatus: "success" };

          createMailAccount(jbtMail, hash)
            .then((mailResult: membersTypes.PleskApiResult) => {
              if (mailResult.code === 0) {
                // Set the status of the mail
                statusOverview = { ...statusOverview, mailStatus: "success" };
              } else {
                // Set the error message of the mail
                statusOverview = {
                  ...statusOverview,
                  mailErrorMsg: mailResult.stderr,
                };
                res.status(500).json(statusOverview);
                return;
              }
              addMailAccountToMailingList("trainee", jbtMail)
                .then((mailListRes: membersTypes.PleskApiResult) => {
                  if (mailListRes.code === 0) {
                    // Set the status of the mailing list
                    statusOverview = {
                      ...statusOverview,
                      mailListStatus: "success",
                    };
                  } else {
                    // Set the error message of the mailing list
                    statusOverview = {
                      ...statusOverview,
                      mailErrorMsg: mailListRes.stderr,
                    };
                    return;
                  }
                  createNCUser(req.body.name, req.body.name, "", jbtMail, [
                    "Mitglied",
                  ])
                    .then((ncResult: membersTypes.NCApiResult) => {
                      if (ncResult.statuscode === 100) {
                        // Set the status of the nextcloud
                        statusOverview = {
                          ...statusOverview,
                          nextcloudStatus: "success",
                        };
                      } else {
                        statusOverview = {
                          ...statusOverview,
                          nextcloudErrorMsg: ncResult.message,
                        };
                      }

                      createMWUser(req.body.name, hash, jbtMail)
                        .then((mwResult: membersTypes.MWApiResult) => {
                          if (mwResult.status === "PASS") {
                            // Set the status of the mediawiki
                            statusOverview = {
                              ...statusOverview,
                              wikiStatus: "success",
                            };
                            res.status(201).json(statusOverview);
                          } else {
                            statusOverview = {
                              ...statusOverview,
                              wikiErrorMsg: mwResult.message,
                            };
                            res.status(500).json(statusOverview);
                          }
                        })
                        .catch((err) => {
                          statusOverview = {
                            ...statusOverview,
                            wikiErrorMsg: err,
                          };
                          res.status(500).json(statusOverview);
                        });
                    })
                    .catch((ncErr) => {
                      statusOverview = {
                        ...statusOverview,
                        nextcloudErrorMsg: ncErr,
                      };
                      createMWUser(req.body.name, hash, jbtMail)
                        .then((mwResult: membersTypes.MWApiResult) => {
                          if (mwResult.status === "PASS") {
                            // Set the status of the mediawiki
                            statusOverview = {
                              ...statusOverview,
                              wikiStatus: "success",
                            };
                          } else {
                            statusOverview = {
                              ...statusOverview,
                              wikiErrorMsg: mwResult.message,
                            };
                          }
                          res.status(500).json(statusOverview);
                        })
                        .catch((err) => {
                          statusOverview = {
                            ...statusOverview,
                            wikiErrorMsg: err,
                          };
                          res.status(500).json(statusOverview);
                        });
                    });
                })
                .catch((err) => {
                  // Set the error message of the mailing list
                  statusOverview = {
                    ...statusOverview,
                    mailListErrorMsg: err,
                  };
                });
            })
            .catch((err) => {
              statusOverview = {
                ...statusOverview,
                mailErrorMsg: err,
              };
              res.status(500).json(statusOverview);
            });
        })
        .catch((err) => {
          statusOverview = {
            ...statusOverview,
            queryErrorMsg: err.sqlMessage,
          };
          res.status(500).json(statusOverview);
        });
    })
    .catch((err) => {
      statusOverview = {
        ...statusOverview,
        queryErrorMsg: err,
      };
      res.status(500).json(statusOverview);
    });
};

/**
 * Retrieves the history of directors
 */
export const retrieveDirectors = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT mitgliedID, vorname, nachname, geschlecht, kuerzel, bezeichnung_maennlich,bezeichnung_weiblich, von, bis
    FROM mitglied, mitglied_has_evposten, evposten
    WHERE mitgliedID = mitglied_mitgliedID AND evpostenID = evposten_evpostenID `,
      []
    )
    .then((result: membersTypes.GetDirectorsQueryResult[]) => {
      if (result.length === 0) {
        res.status(404).send("Directors not found");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Retrieves the departments
 */
export const retrieveDepartments = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT ressortID, bezeichnung, kuerzel
    FROM ressort
    WHERE bezeichnung != "Ohne Ressort"`,
      []
    )
    .then((result: membersTypes.GetDepartmentsQueryResult[]) => {
      if (result.length === 0) {
        res.status(404).send("Departments not found");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Updates an existing member
 * Update of critical fields can be done by member with certain permission
 * Update of critical and non critical fields can be done by member himself with additional permission
 */
export const updateMember = (req: Request, res: Response): void => {
  const date: Date = new Date();

  // Format date yyyy-mm-dd hh:mm:ss
  const lastChangeTime =
    date.getFullYear() +
    "-" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getDate()).slice(-2) +
    " " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2);

  // Grants access to all fields if member is himself and has additional permission
  if (
    Number(req.params.id) === res.locals.memberID &&
    res.locals.permissions.includes(1)
  ) {
    database
      .query(
        `UPDATE mitglied
      SET handy = ?, mitgliedstatus = ?, generation = ?, internesprojekt = ?, mentor = ?, trainee_seit = ?,
      mitglied_seit = ?, alumnus_seit = ?, senior_seit = ?, aktiv_seit = ?, passiv_seit = ?,
      ausgetreten_seit = ?, ressort = ?, arbeitgeber = ?, strasse1 = ?, plz1 = ?, ort1 = ?, tel1 = ?,
      email1 = ?, strasse2 = ?, plz2 = ?, ort2 = ?, tel2 = ?, email2 = ?, hochschule = ?, studiengang = ?,
      studienbeginn = ?, studienende = ?, ausbildung = ?, kontoinhaber = ?, iban = ?, bic = ?,
      engagement = ?, canPL = ?, canQM = ?, lastchange = ?, fuehrerschein = ?, ersthelferausbildung = ?
      WHERE mitgliedID = ?`,
        [
          req.body.handy,
          req.body.mitgliedstatus,
          req.body.generation,
          req.body.internesprojekt,
          req.body.mentor,
          req.body.trainee_seit,
          req.body.mitglied_seit,
          req.body.alumnus_seit,
          req.body.senior_seit,
          req.body.aktiv_seit,
          req.body.passiv_seit,
          req.body.ausgetreten_seit,
          req.body.ressort,
          req.body.arbeitgeber,
          req.body.strasse1,
          req.body.plz1,
          req.body.ort1,
          req.body.tel1,
          req.body.email1,
          req.body.strasse2,
          req.body.plz2,
          req.body.ort2,
          req.body.tel2,
          req.body.email2,
          req.body.hochschule,
          req.body.studiengang,
          req.body.studienbeginn,
          req.body.studienende,
          req.body.ausbildung,
          req.body.kontoinhaber,
          req.body.iban,
          req.body.bic,
          req.body.engagement,
          req.body.canPL,
          req.body.canQM,
          lastChangeTime,
          req.body.fuehrerschein,
          req.body.ersthelferausbildung,
          req.params.id,
        ]
      )
      .then((result) => {
        res.status(200).send("Profile Update Successful");
      })
      .catch((err) => {
        res.status(500).send("Query Error: Updating Profile failed");
      });
  }

  // Grants access to non critical fields to the member himself
  else if (Number(req.params.id) === res.locals.memberID) {
    database
      .query(
        `UPDATE mitglied
      SET handy = ?, arbeitgeber = ?, strasse1 = ?, plz1 = ?, ort1 = ?, tel1 = ?, email1 = ?, strasse2 = ?,
      plz2 = ?, ort2 = ?, tel2 = ?, email2 = ?, hochschule = ?, studiengang = ?, studienbeginn = ?,
      studienende = ?, ausbildung = ?, kontoinhaber = ?, iban = ?, bic = ?, lastchange = ?, fuehrerschein = ?,
      ersthelferausbildung = ?
      WHERE mitgliedID = ?`,
        [
          req.body.handy,
          req.body.arbeitgeber,
          req.body.strasse1,
          req.body.plz1,
          req.body.ort1,
          req.body.tel1,
          req.body.email1,
          req.body.strasse2,
          req.body.plz2,
          req.body.ort2,
          req.body.tel2,
          req.body.email2,
          req.body.hochschule,
          req.body.studiengang,
          req.body.studienbeginn,
          req.body.studienende,
          req.body.ausbildung,
          req.body.kontoinhaber,
          req.body.iban,
          req.body.bic,
          lastChangeTime,
          req.body.fuehrerschein,
          req.body.ersthelferausbildung,
          req.params.id,
        ]
      )
      .then((result) => {
        res.status(200).send("Profile Update Successful");
      })
      .catch((err) => {
        res.status(500).send("Query Error: Updating Profile failed");
      });
  }

  // Grants access to critical fields for members with permission
  else if (res.locals.permissions.includes(1)) {
    database
      .query(
        `UPDATE mitglied
      SET mitgliedstatus = ?, generation = ?, internesprojekt = ?, mentor = ?,
      trainee_seit = ?, mitglied_seit = ?, alumnus_seit = ?, senior_seit = ?,
      aktiv_seit = ?, passiv_seit = ?, ausgetreten_seit = ?, ressort = ?,
      engagement = ?, canPL = ?, canQM = ?
      WHERE mitgliedID = ?`,
        [
          req.body.mitgliedstatus,
          req.body.generation,
          req.body.internesprojekt,
          req.body.mentor,
          req.body.trainee_seit,
          req.body.mitglied_seit,
          req.body.alumnus_seit,
          req.body.senior_seit,
          req.body.aktiv_seit,
          req.body.passiv_seit,
          req.body.ausgetreten_seit,
          req.body.ressort,
          req.body.engagement,
          req.body.canPL,
          req.body.canQM,
          req.params.id,
        ]
      )
      .then((result) => {
        res.status(200).send("Profile Update Successful");
      })
      .catch((err) => {
        res.status(500).send("Query Error: Updating Profile failed");
      });
  } else {
    res
      .status(403)
      .send("Authorization failed: You are not permitted to do this");
  }
};

/**
 * Retrieves an overview of all issued permissions
 */
export const retrievePermissionsList = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT vorname, nachname, berechtigung_berechtigungID AS permission
    FROM mitglied
    INNER JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID`,
      []
    )
    .then((result: membersTypes.GetPermissionsQueryResult) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).send("Query Error: Getting permissions failed");
    });
};

/**
 * Create new permission
 */
export const createPermission = (req: Request, res: Response): void => {
  database
    .query(
      `INSERT INTO mitglied_has_berechtigung (mitglied_mitgliedID, berechtigung_berechtigungID)
    VALUES (?, ?)`,
      [req.body.memberID, req.body.permissionID]
    )
    .then((result) => {
      res.status(201).send("Permission created");
    })
    .catch((err) => {
      res.status(500).send("Database Error: Creating Permission failed");
    });
};

/**
 * Delete issued permission
 */
export const deletePermission = (req: Request, res: Response): void => {
  database
    .query(
      `DELETE
    FROM mitglied_has_berechtigung
    WHERE mitglied_mitgliedID = ? AND berechtigung_berechtigungID = ?`,
      [req.body.memberID, req.body.permissionID]
    )
    .then((result) => {
      res.status(200).send("Permission deleted");
    })
    .catch((err) => {
      res.status(500).send("Database Error: Deleting Permission failed");
    });
};
