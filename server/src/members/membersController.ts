/**
 * Definition of the handler functions for the members module
 */
import database = require("../database");
import bcrypt = require("bcryptjs");
import { PoolConnection } from "mysql";

import { Request, Response } from "express";
import * as membersTypes from "./membersTypes";
import * as authTypes from "./../global/auth/authTypes";
import { canPermissionBeDelegated, doesPermissionsInclude } from "../utils/authUtils";

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
      bcrypt.compare(req.body.oldPassword, result[0].passwordHash).then((match) => {
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
  if (Number(req.params.id) === res.locals.memberID || doesPermissionsInclude(res.locals.permissions, [6])) {
    database
      .query(
        `SELECT mitgliedID, vorname, nachname, geschlecht, geburtsdatum, handy,
        mitgliedstatus.bezeichnung AS mitgliedstatus, generation, internesprojekt,
        trainee_seit, mitglied_seit, alumnus_seit, senior_seit, aktiv_seit, passiv_seit,
        ausgetreten_seit, ressort.bezeichnung AS ressort, arbeitgeber, strasse1, plz1, ort1,
        tel1, email1, strasse2, plz2, ort2, tel2, email2, hochschule, studiengang,
        studienbeginn, studienende, vertiefungen, ausbildung, kontoinhaber, iban, bic,
        engagement, canPL, canQM, lastchange, fuehrerschein, ersthelferausbildung
        FROM mitglied
        INNER JOIN ressort ON mitglied.ressort = ressort.ressortID
        INNER JOIN mitgliedstatus ON mitglied.mitgliedstatus = mitgliedstatus.mitgliedstatusID
        WHERE mitgliedID = ?`,
        [req.params.id]
      )
      .then((result: membersTypes.GetMemberQueryResult[]) => {
        if (result.length === 0) {
          res.status(404).send("User not found");
        } else {
          database
            .query(
              `SELECT wert, niveau
              FROM sprachen
              WHERE mitglied_mitgliedID = ?`,
              [req.params.id]
            )
            .then((resultLang: membersTypes.GetLanguageOfMemberQueryResult[]) => {
              database
                .query(
                  `SELECT mitgliedID, vorname, nachname
                  FROM mitglied
                  WHERE mentor = ?`,
                  [req.params.id]
                )
                .then((resultMentees: membersTypes.GetMenteeOfMemberQueryResult[]) => {
                  database
                    .query(
                      `SELECT mitgliedID, vorname, nachname
                      FROM mitglied
                      WHERE mitgliedID =
                      (SELECT mentor
                      FROM mitglied
                      WHERE mitgliedID = ?)`,
                      [req.params.id]
                    )
                    .then((resultMentor: membersTypes.GetMentorOfMemberQueryResult[]) => {
                      database
                        .query(
                          `SELECT wert, niveau
                        FROM edvkenntnisse
                        WHERE mitglied_mitgliedID = ?`,
                          [req.params.id]
                        )
                        .then((resultEDV: membersTypes.GetEDVSkillsOfMemberQueryResult) => {
                          // Combine the four different query results
                          const member = [
                            {
                              ...result[0],
                              mentor: resultMentor[0],
                              mentees: resultMentees,
                              sprachen: resultLang,
                              edvkenntnisse: resultEDV,
                            },
                          ];
                          res.status(200).json(member);
                        })
                        .catch((err) => {
                          res.status(500).send("Query Error: Retrieving EDV Skills");
                        });
                    })
                    .catch((err) => {
                      res.status(500).send("Query Error: Retrieving Mentor");
                    });
                })
                .catch((err) => {
                  res.status(500).send("Query Error: Retrieving Mentees");
                });
            })
            .catch((err) => {
              res.status(500).send("Query Error: Retrieving Languages");
            });
        }
      })
      .catch((err) => {
        res.status(500).send("Query Error: Retrieving Member");
      });
  } else {
    database
      .query(
        `SELECT mitgliedID, vorname, nachname, geschlecht, geburtsdatum, handy,
        mitgliedstatus.bezeichnung AS mitgliedstatus, generation, internesprojekt,
        mentor, trainee_seit, mitglied_seit, alumnus_seit, senior_seit, aktiv_seit,
        passiv_seit, ausgetreten_seit, ressort.bezeichnung AS ressort, arbeitgeber,
        strasse1, plz1, ort1, tel1, email1, strasse2, plz2, ort2, tel2, email2, hochschule,
        studiengang, studienbeginn, studienende, vertiefungen, ausbildung, engagement, canPL,
        canQM, lastchange, fuehrerschein, ersthelferausbildung
        FROM mitglied
        INNER JOIN ressort ON mitglied.ressort = ressort.ressortID
        INNER JOIN mitgliedstatus ON mitglied.mitgliedstatus = mitgliedstatus.mitgliedstatusID
        WHERE mitgliedID = ?`,
        [req.params.id]
      )
      .then((result: membersTypes.GetMemberQueryResult[]) => {
        if (result.length === 0) {
          res.status(404).send("User not found");
        } else {
          database
            .query(
              `SELECT wert, niveau
              FROM sprachen
              WHERE mitglied_mitgliedID = ?`,
              [req.params.id]
            )
            .then((resultLang: membersTypes.GetLanguageOfMemberQueryResult[]) => {
              database
                .query(
                  `SELECT mitgliedID, vorname, nachname
                  FROM mitglied
                  WHERE mentor = ?`,
                  [req.params.id]
                )
                .then((resultMentees: membersTypes.GetMenteeOfMemberQueryResult[]) => {
                  database
                    .query(
                      `SELECT mitgliedID, vorname, nachname
                      FROM mitglied
                      WHERE mitgliedID =
                      (SELECT mentor
                      FROM mitglied
                      WHERE mitgliedID = ?)`,
                      [req.params.id]
                    )
                    .then((resultMentor: membersTypes.GetMentorOfMemberQueryResult[]) => {
                      database
                        .query(
                          `SELECT wert, niveau
                          FROM edvkenntnisse
                          WHERE mitglied_mitgliedID = ?`,
                          [req.params.id]
                        )
                        .then((resultEDV: membersTypes.GetEDVSkillsOfMemberQueryResult) => {
                          // Combine the four different query results
                          const member = [
                            {
                              ...result[0],
                              mentor: resultMentor[0],
                              mentees: resultMentees,
                              sprachen: resultLang,
                              edvkenntnisse: resultEDV,
                            },
                          ];
                          res.status(200).json(member);
                        })
                        .catch((err) => {
                          res.status(500).send("Query Error: Retrieving EDV Skills");
                        });
                    })
                    .catch((err) => {
                      res.status(500).send("Query Error: Retrieving Mentor");
                    });
                })
                .catch((err) => {
                  res.status(500).send("Query Error: Retrieving Mentees");
                });
            })
            .catch((err) => {
              res.status(500).send("Query Error: Retrieving Languages");
            });
        }
      })
      .catch((err) => {
        res.status(500).send("Query Error: Retrieving Member");
      });
  }
};

/**
 * Retrieves all members of a department
 */
export const retrieveDepartmentMembers = (req: Request, res: Response): void => {
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
 * Creates a new member
 */
export const createMember = (req: Request, res: Response): void => {
  bcrypt
    .hash(req.body.password, 12)
    .then((hash) => {
      database
        .query(
          `INSERT INTO mitglied (vorname, nachname, name, passwordHash, geschlecht,
          geburtsdatum, handy)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            req.body.vorname,
            req.body.nachname,
            req.body.name,
            hash,
            req.body.geschlecht,
            req.body.geburtsdatum,
            req.body.handy,
          ]
        )
        .then((result) => {
          res.status(201).send("User created");
        })
        .catch((err) => {
          res.status(500).send("Query Error: Creating User");
        });
    })
    .catch((err) => {
      res.status(500).send("Hashing error");
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
 * Retrieves the languages
 */
export const retrieveLanguages = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT DISTINCT wert
      FROM sprachen`,
      []
    )
    .then((result: string[]) => {
      if (result.length === 0) {
        res.status(404).send("Languages not found");
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Retrieves the edv skills
 */
export const retrieveEDVSkills = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT DISTINCT wert
      FROM edvkenntnisse`,
      []
    )
    .then((result: string[]) => {
      if (result.length === 0) {
        res.status(404).send("EDV Skills not found");
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

  const mentorID = req.body.mentor ? req.body.mentor.mitgliedID : null;

  // Grants access to all fields if member is himself and has additional permission
  if (Number(req.params.id) === res.locals.memberID && doesPermissionsInclude(res.locals.permissions, [1])) {
    database
      .startTransaction()
      .then((connection: PoolConnection) => {
        database
          .connectionQuery(
            connection,
            `UPDATE mitglied
            SET handy = ?, mitgliedstatus = (SELECT mitgliedstatusID FROM mitgliedstatus WHERE bezeichnung = ?),
            generation = ?, internesprojekt = ?, mentor = ?, trainee_seit = ?, mitglied_seit = ?, alumnus_seit = ?,
            senior_seit = ?, aktiv_seit = ?, passiv_seit = ?, ausgetreten_seit = ?,
            ressort = (SELECT ressortID FROM ressort WHERE bezeichnung = ?), arbeitgeber = ?, strasse1 = ?,
            plz1 = ?, ort1 = ?, tel1 = ?, email1 = ?, strasse2 = ?, plz2 = ?, ort2 = ?, tel2 = ?,
            email2 = ?, hochschule = ?, studiengang = ?, studienbeginn = ?, studienende = ?, vertiefungen = ?, ausbildung = ?,
            kontoinhaber = ?, iban = ?, bic = ?, engagement = ?, canPL = ?, canQM = ?, lastchange = ?,
            fuehrerschein = ?, ersthelferausbildung = ?
            WHERE mitgliedID = ?`,
            [
              req.body.handy,
              req.body.mitgliedstatus,
              req.body.generation,
              req.body.internesprojekt,
              mentorID,
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
              req.body.vertiefungen,
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
            // Delete the exisitng entries of languages of the specific member
            database
              .connectionQuery(connection, `DELETE FROM sprachen WHERE mitglied_mitgliedID = ?`, [req.params.id])
              .then((deleteLangResult) => {
                // To save/update the different languages of the member sql strings are saved into an array
                const langQueries = [];

                // To save/update the different languages of the member sql strings are saved into an array
                req.body.sprachen.map((language) => {
                  langQueries.push(`INSERT INTO sprachen (mitglied_mitgliedID, wert, niveau)
                    VALUES (${req.params.id}, '${language.wert}', ${language.niveau})
                    ON DUPLICATE KEY UPDATE niveau = ${language.niveau};`);
                });
                database
                  .executeMultipleConnectionQueries(connection, langQueries)
                  .then((langResult) => {
                    // Delete the existing entries of edv skills of the specific member
                    database
                      .connectionQuery(connection, `DELETE FROM edvkenntnisse WHERE mitglied_mitgliedID = ?`, [
                        req.params.id,
                      ])
                      .then((deleteEDVResult) => {
                        // To save/update the different edv skills of the member sql strings are saved into an array
                        const edvQueries = [];

                        // To save/update the different edv skills of the member sql strings are saved into an array
                        req.body.edvkenntnisse.map((edv) => {
                          edvQueries.push(`INSERT INTO edvkenntnisse (mitglied_mitgliedID, wert, niveau)
                            VALUES (${req.params.id}, '${edv.wert}', ${edv.niveau})
                            ON DUPLICATE KEY UPDATE niveau = ${edv.niveau};`);
                        });
                        database
                          .executeMultipleConnectionQueries(connection, edvQueries)
                          .then((edvResult) => {
                            database
                              .commit(connection)
                              .then((commitResult) => {
                                res.status(200).send("Profile Update Successful");
                              })
                              .catch((err) => {
                                res.status(500).send("Query Error: Commiting failed");
                              });
                          })
                          .catch((err) => {
                            res.status(500).send("Query Error: Updating EDV Skills failed");
                          });
                      })
                      .catch((err) => {
                        res.status(500).send("Query Error: Deleting EDV Skills failed");
                      });
                  })
                  .catch((err) => {
                    res.status(500).send("Query Error: Updating Languages failed");
                  });
              })
              .catch((err) => {
                res.status(500).send("Query Error: Deleting Languages failed");
              });
          })
          .catch((err) => {
            res.status(500).send("Query Error: Updating Profile failed");
          });
      })
      .catch((error) => {
        res.status(500).send("Query Error: Starting Transaction failed");
      });
  }

  // Grants access to non critical fields to the member himself
  else if (Number(req.params.id) === res.locals.memberID) {
    database
      .startTransaction()
      .then((connection: PoolConnection) => {
        database
          .connectionQuery(
            connection,
            `UPDATE mitglied
            SET handy = ?, arbeitgeber = ?, strasse1 = ?, plz1 = ?, ort1 = ?, tel1 = ?, email1 = ?, strasse2 = ?,
            plz2 = ?, ort2 = ?, tel2 = ?, email2 = ?, hochschule = ?, studiengang = ?, studienbeginn = ?,
            studienende = ?, vertiefungen = ?, ausbildung = ?, kontoinhaber = ?, iban = ?, bic = ?, lastchange = ?, fuehrerschein = ?,
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
              req.body.vertiefungen,
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
            // Delete the exisitng entries of languages of the specific member
            database
              .connectionQuery(connection, `DELETE FROM sprachen WHERE mitglied_mitgliedID = ?`, [req.params.id])
              .then((deleteLangResult) => {
                // To save/update the different languages of the member sql strings are saved into an array
                const langQueries = [];

                // To save/update the different languages of the member sql strings are saved into an array
                req.body.sprachen.map((language) => {
                  langQueries.push(`INSERT INTO sprachen (mitglied_mitgliedID, wert, niveau)
                    VALUES (${req.params.id}, '${language.wert}', ${language.niveau})
                    ON DUPLICATE KEY UPDATE niveau = ${language.niveau};`);
                });
                database
                  .executeMultipleConnectionQueries(connection, langQueries)
                  .then((langResult) => {
                    // Delete the existing entries of edv skills of the specific member
                    database
                      .connectionQuery(connection, `DELETE FROM edvkenntnisse WHERE mitglied_mitgliedID = ?`, [
                        req.params.id,
                      ])
                      .then((deleteEDVResult) => {
                        // To save/update the different edv skills of the member sql strings are saved into an array
                        const edvQueries = [];

                        // To save/update the different edv skills of the member sql strings are saved into an array
                        req.body.edvkenntnisse.map((edv) => {
                          edvQueries.push(`INSERT INTO edvkenntnisse (mitglied_mitgliedID, wert, niveau)
                            VALUES (${req.params.id}, '${edv.wert}', ${edv.niveau})
                            ON DUPLICATE KEY UPDATE niveau = ${edv.niveau};`);
                        });
                        database
                          .executeMultipleConnectionQueries(connection, edvQueries)
                          .then((edvResult) => {
                            database
                              .commit(connection)
                              .then(() => {
                                res.status(200).send("Profile Update Successful");
                              })
                              .catch((err) => {
                                res.status(500).send("Query Error: Commiting failed");
                              });
                          })
                          .catch((err) => {
                            res.status(500).send("Query Error: Updating EDV Skills failed");
                          });
                      })
                      .catch((err) => {
                        res.status(500).send("Query Error: Deleting EDV Skills failed");
                      });
                  })
                  .catch((err) => {
                    res.status(500).send("Query Error: Updating Languages failed");
                  });
              })
              .catch((err) => {
                res.status(500).send("Query Error: Deleting Languages failed");
              });
          })
          .catch((err) => {
            res.status(500).send("Query Error: Updating Profile failed");
          });
      })
      .catch((err) => {
        res.status(500).send("Query Error: Starting Transaction failed");
      });
  }

  // Grants access to critical fields for members with permission
  else if (doesPermissionsInclude(res.locals.permissions, [1])) {
    database
      .query(
        `UPDATE mitglied
        SET mitgliedstatus = (SELECT mitgliedstatusID FROM mitgliedstatus WHERE bezeichnung = ?), generation = ?, internesprojekt = ?, mentor = ?,
        trainee_seit = ?, mitglied_seit = ?, alumnus_seit = ?, senior_seit = ?,
        aktiv_seit = ?, passiv_seit = ?, ausgetreten_seit = ?,
        ressort = (SELECT ressortID FROM ressort WHERE bezeichnung = ?), engagement = ?,
        canPL = ?, canQM = ?
        WHERE mitgliedID = ?`,
        [
          req.body.mitgliedstatus,
          req.body.generation,
          req.body.internesprojekt,
          mentorID,
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
    res.status(403).send("Authorization failed: You are not permitted to do this");
  }
};

/**
 * Retrieves all directors and members with their permission and name
 */
export const retrievePermissionsOfMembers = (req: Request, res: Response): void => {
  // Evposten gets memberID of -1 to fill NULL
  database
    .query(
      `SELECT kuerzel AS name, berechtigung_berechtigungID AS permission, canDelegate, -1 AS memberID
    FROM evposten
    INNER JOIN evposten_has_berechtigung ON evposten.evpostenID = evposten_has_berechtigung.evposten_evpostenID
    UNION
    SELECT CONCAT(vorname,' ' , nachname) AS name, berechtigung_berechtigungID AS permission, 0 AS canDelegate, mitglied.mitgliedID AS memberID
    FROM mitglied
    LEFT JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID`,
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
 * Retrieves name, description and ID of all permissions
 */
export const retrievePermissions = (req: Request, res: Response): void => {
  database
    .query(`SELECT * FROM berechtigung`, [])
    .then((result: membersTypes.GetPermissionsQueryResult) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).send("Query Error: Getting permissions failed");
    });
};

/**
 * Retrieves a list of all permissions of the member with the given ID
 */
export const retrievePermissionsByMemberId = (req: Request, res: Response) => {
  database
    .query(
      `SELECT GROUP_CONCAT(mitglied_has_berechtigung.berechtigung_berechtigungID) AS permissions
      FROM mitglied
      LEFT JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID
      WHERE mitgliedID = ?
      GROUP BY mitgliedID`,
      [req.params.id]
    )
    .then((result: authTypes.UserDataQueryResult[]) => {
      // If the result is empty, no member with the given id exists
      if (result.length === 0) {
        res.status(404).send(`Member with id "${req.params.id}" does not exist`);
        return;
      }
      // Selects permissions belonging to a possible role of the member
      database
        .query(
          `SELECT berechtigung_berechtigungID AS permissionID, canDelegate
          FROM mitglied_has_evposten
          LEFT JOIN evposten_has_berechtigung ON mitglied_has_evposten.evposten_evpostenID = evposten_has_berechtigung.evposten_evpostenID
          WHERE mitglied_has_evposten.mitglied_mitgliedID = ?;
        `,
          [req.params.id]
        )
        .then((directorPermissionsResult: authTypes.DirectorPermissionsQueryResult[]) => {
          let permissions = [];

          // Adds role permissions to the permissions array
          if (directorPermissionsResult.length > 0) {
            permissions = directorPermissionsResult;
          }

          if (result.length > 0) {
            // Adds normal permissions to the permissions array
            if (result[0].permissions) {
              result[0].permissions
                .split(",")
                .map(Number)
                .map((perm) => {
                  // A Permission which was delegated to a member cannot be delegated further (therefore canDelegate is always 0)
                  permissions.push({ permissionID: perm, canDelegate: 0 });
                });
            }
          }
          res.status(200).json({ ...result[0], permissions });
        })
        .catch((error) => {
          res.status(500).send("Query Error");
        });
    })
    .catch((error) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Create new permission
 */
export const createPermission = (req: Request, res: Response): void => {
  // Checks if the member is allowed to delegate the permission
  if (
    !doesPermissionsInclude(res.locals.permissions, [req.body.permissionID]) ||
    !canPermissionBeDelegated(res.locals.permissions, req.body.permissionID)
  ) {
    res.status(403).send("Permission cannot be delegated!");
    return;
  }

  database
    .query(
      `INSERT INTO mitglied_has_berechtigung (mitglied_mitgliedID, berechtigung_berechtigungID)
      VALUES (?, ?)`,
      [req.body.memberID, req.body.permissionID]
    )
    .then((result) => {
      res.status(201).send({
        message: "Permission created",
        mitgliedID: req.body.memberID,
        berechtigungID: req.body.permissionID,
      });
    })
    .catch((err) => {
      res.status(500).send("Database Error: Creating Permission failed");
    });
};

/**
 * Delete issued permission
 */
export const deletePermission = (req: Request, res: Response): void => {
  // Checks if the member is allowed to delete the permission
  if (
    !doesPermissionsInclude(res.locals.permissions, [req.body.permissionID]) ||
    !canPermissionBeDelegated(res.locals.permissions, req.body.permissionID)
  ) {
    res.status(403).send("Permission cannot be deleted!");
    return;
  }

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
