/**
 * Definition of the handler functions for the members module
 */
import bcrypt = require("bcryptjs");
import { Request, Response } from "express";
import database = require("../database");
import { getRandomString } from "../utils/stringUtils";
import * as membersTypes from "./membersTypes";
import { PoolConnection } from "mysql";
import * as authTypes from "./../global/auth/authTypes";
import { canPermissionBeDelegated, doesPermissionsInclude } from "../utils/authUtils";
// TODO: Out comment if external account creation is activated
// import { createMailAccount, addMailAccountToMailingList } from "../utils/plesk";
// import { createMWUser } from "../utils/mediawiki";
// import { createNCUser } from "../utils/nextcloud";

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
            .catch(() => {
              res.status(500).send("Internal Error");
            });
        } else {
          res.status(401).send("The old password was not correct");
        }
      });
    })
    .catch(() => {
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
    .catch(() => {
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
        `SELECT mitgliedID, vorname, nachname, mitglied.jbt_email, geschlecht, geburtsdatum, handy,
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
                        .catch(() => {
                          res.status(500).send("Query Error: Retrieving EDV Skills");
                        });
                    })
                    .catch(() => {
                      res.status(500).send("Query Error: Retrieving Mentor");
                    });
                })
                .catch(() => {
                  res.status(500).send("Query Error: Retrieving Mentees");
                });
            })
            .catch(() => {
              res.status(500).send("Query Error: Retrieving Languages");
            });
        }
      })
      .catch(() => {
        res.status(500).send("Query Error: Retrieving Member");
      });
  } else {
    database
      .query(
        `SELECT mitgliedID, vorname, nachname, mitglied.jbt_email, geschlecht, geburtsdatum, handy,
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
                        .catch(() => {
                          res.status(500).send("Query Error: Retrieving EDV Skills");
                        });
                    })
                    .catch(() => {
                      res.status(500).send("Query Error: Retrieving Mentor");
                    });
                })
                .catch(() => {
                  res.status(500).send("Query Error: Retrieving Mentees");
                });
            })
            .catch(() => {
              res.status(500).send("Query Error: Retrieving Languages");
            });
        }
      })
      .catch(() => {
        res.status(500).send("Query Error: Retrieving Member");
      });
  }
};

/**
 * Retrieves all members of a department (this does not invclude the director of a department)
 */
export const retrieveDepartmentMembers = (req: Request, res: Response): void => {
  /*
   * This database call searches for all members which are trainees, active members or seniors
   * and their assigned departments if they are not currently a director
   */
  database
    .query(
      `SELECT mitgliedID, vorname, nachname, ressort, bezeichnung
      FROM mitglied, ressort
      WHERE ressort = ressortID AND mitgliedstatus <= 3
      AND NOT EXISTS (
        SELECT mitglied_mitgliedID
        FROM mitglied_has_evposten
        WHERE von < DATE(NOW()) AND DATE(NOW()) < bis AND mitglied_mitgliedID = mitgliedID
        )
      ORDER BY ressortID`,
      []
    )
    .then((result: membersTypes.GetDepartmentMembersQueryResult[]) => {
      res.status(200).json(result);
    })
    .catch(() => {
      res.status(500).send("Query Error");
    });
};

/**
 * Retrieves all current directors
 */
export const retrieveCurrentDirectors = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT mitgliedID, vorname, nachname, evpostenID, evposten.ressortID, geschlecht, bezeichnung_weiblich, bezeichnung_maennlich, kuerzel
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
    .catch(() => {
      res.status(500).send("Query Error");
    });
};

/**
 * Creates a new member in the database and creates accounts
 * for the different systems (webmail, nextcloud, mediawiki)
 */
export const createMember = async (req: Request, res: Response) => {
  let jbtMail = "";
  // New user name if the name already exists
  let newUserName = "";
  if (req.body.name) {
    // Search for req.body.name to check if it already exists
    const resultFirstQuery = await database.query(`SELECT name FROM mitglied WHERE name = ?`, [req.body.name]);
    // Check if req.body.name already exists
    if (Array.isArray(resultFirstQuery) && resultFirstQuery.length === 0) {
      newUserName = req.body.name;
    }
    // Counter for the number of "duplicates" in the database
    let duplicateCounter = 1;
    // If name is already taken create name v.nachname1 (or v.nachname2 etc.)
    while (newUserName === "") {
      const result = await database.query(`SELECT name FROM mitglied WHERE name = ?`, [
        req.body.name + duplicateCounter,
      ]);
      // Check if the result is an array and if it's empty (this means, that the name does not already exist)
      if (Array.isArray(result) && result.length === 0) {
        newUserName = req.body.name + duplicateCounter;
      }
      duplicateCounter++;
    }
    jbtMail = `${newUserName}@studentische-beratung.de`;
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
          `INSERT INTO mitglied (vorname, nachname, geburtsdatum, handy, name, geschlecht, passwordHash, icalToken, mitgliedstatus, generation, trainee_seit, email2, jbt_email, ressort)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            req.body.vorname,
            req.body.nachname,
            req.body.geburtsdatum,
            req.body.handy,
            newUserName,
            req.body.geschlecht,
            hash,
            getRandomString(16),
            1, // Default status of member is "trainee"
            req.body.generation,
            req.body.traineeSeit,
            req.body.email,
            jbtMail,
            8, // Default department "Ohne Ressort"
          ]
        )
        .then(() => {
          // Set the status of the query
          statusOverview = { ...statusOverview, queryStatus: "success" };

          // TODO: Commented out for the time beeing
          // createMailAccount(jbtMail, hash)
          //   .then((mailResult: membersTypes.PleskApiResult) => {
          //     if (mailResult.code === 0) {
          //       // Set the status of the mail
          //       statusOverview = { ...statusOverview, mailStatus: "success" };
          //     } else {
          //       // Set the error message of the mail
          //       statusOverview = {
          //         ...statusOverview,
          //         mailErrorMsg: mailResult.stderr,
          //       };
          //       res.status(500).json(statusOverview);
          //       return;
          //     }
          //     addMailAccountToMailingList("trainee", jbtMail)
          //       .then((mailListRes: membersTypes.PleskApiResult) => {
          //         if (mailListRes.code === 0) {
          //           // Set the status of the mailing list
          //           statusOverview = {
          //             ...statusOverview,
          //             mailListStatus: "success",
          //           };
          //         } else {
          //           // Set the error message of the mailing list
          //           statusOverview = {
          //             ...statusOverview,
          //             mailErrorMsg: mailListRes.stderr,
          //           };
          //           return;
          //         }
          //         createNCUser(req.body.name, req.body.name, "", jbtMail, ["Mitglied"])
          //           .then((ncResult: membersTypes.NCApiResult) => {
          //             if (ncResult.statuscode === 100) {
          //               // Set the status of the nextcloud
          //               statusOverview = {
          //                 ...statusOverview,
          //                 nextcloudStatus: "success",
          //               };
          //             } else {
          //               statusOverview = {
          //                 ...statusOverview,
          //                 nextcloudErrorMsg: ncResult.message,
          //               };
          //             }

          //             createMWUser(req.body.name, hash, jbtMail)
          //               .then((mwResult: membersTypes.MWApiResult) => {
          //                 if (mwResult.status === "PASS") {
          //                   // Set the status of the mediawiki
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiStatus: "success",
          //                   };
          database
            .query("SELECT name, mitgliedID, jbt_email FROM mitglied WHERE name = ?", [newUserName])
            .then((result: membersTypes.GetMemberIdentificationQueryResult[]) => {
              if (result.length === 0) {
                res.status(500).send(`Error creating member with name: ${newUserName}`);
                return;
              }
              res.status(201).json({ statusOverview, newUser: result[0] });
            })
            .catch(() => {
              res.status(500).send(`Error creating member with name: ${newUserName}`);
            });
          //                 } else {
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiErrorMsg: mwResult.message,
          //                   };
          //                   res.status(500).json(statusOverview);
          //                 }
          //               })
          //               .catch((mwErr) => {
          //                 statusOverview = {
          //                   ...statusOverview,
          //                   wikiErrorMsg: mwErr,
          //                 };
          //                 res.status(500).json(statusOverview);
          //               });
          //           })
          //           .catch((ncErr) => {
          //             statusOverview = {
          //               ...statusOverview,
          //               nextcloudErrorMsg: ncErr,
          //             };
          //             createMWUser(req.body.name, hash, jbtMail)
          //               .then((mwResult: membersTypes.MWApiResult) => {
          //                 if (mwResult.status === "PASS") {
          //                   // Set the status of the mediawiki
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiStatus: "success",
          //                   };
          //                 } else {
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiErrorMsg: mwResult.message,
          //                   };
          //                 }
          //                 res.status(500).json(statusOverview);
          //               })
          //               .catch((err) => {
          //                 statusOverview = {
          //                   ...statusOverview,
          //                   wikiErrorMsg: err,
          //                 };
          //                 res.status(500).json(statusOverview);
          //               });
          //           });
          //       })
          //       .catch((err) => {
          //         // Set the error message of the mailing list
          //         statusOverview = {
          //           ...statusOverview,
          //           mailListErrorMsg: err,
          //         };
          //         createNCUser(req.body.name, req.body.name, "", jbtMail, ["Mitglied"])
          //           .then((ncResult: membersTypes.NCApiResult) => {
          //             if (ncResult.statuscode === 100) {
          //               // Set the status of the nextcloud
          //               statusOverview = {
          //                 ...statusOverview,
          //                 nextcloudStatus: "success",
          //               };
          //             } else {
          //               statusOverview = {
          //                 ...statusOverview,
          //                 nextcloudErrorMsg: ncResult.message,
          //               };
          //             }

          //             createMWUser(req.body.name, hash, jbtMail)
          //               .then((mwResult: membersTypes.MWApiResult) => {
          //                 if (mwResult.status === "PASS") {
          //                   // Set the status of the mediawiki
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiStatus: "success",
          //                   };
          //                   res.status(201).json(statusOverview);
          //                 } else {
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiErrorMsg: mwResult.message,
          //                   };
          //                   res.status(500).json(statusOverview);
          //                 }
          //               })
          //               .catch((mwErr) => {
          //                 statusOverview = {
          //                   ...statusOverview,
          //                   wikiErrorMsg: mwErr,
          //                 };
          //                 res.status(500).json(statusOverview);
          //               });
          //           })
          //           .catch((ncErr) => {
          //             statusOverview = {
          //               ...statusOverview,
          //               nextcloudErrorMsg: ncErr,
          //             };
          //             createMWUser(req.body.name, hash, jbtMail)
          //               .then((mwResult: membersTypes.MWApiResult) => {
          //                 if (mwResult.status === "PASS") {
          //                   // Set the status of the mediawiki
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiStatus: "success",
          //                   };
          //                 } else {
          //                   statusOverview = {
          //                     ...statusOverview,
          //                     wikiErrorMsg: mwResult.message,
          //                   };
          //                 }
          //                 res.status(500).json(statusOverview);
          //               })
          //               .catch((mwErr) => {
          //                 statusOverview = {
          //                   ...statusOverview,
          //                   wikiErrorMsg: mwErr,
          //                 };
          //                 res.status(500).json(statusOverview);
          //               });
          //           });
          //       });
          //   })
          //   .catch((err) => {
          //     // Set the error message of the webmail
          //     statusOverview = {
          //       ...statusOverview,
          //       mailErrorMsg: err,
          //     };
          //     res.status(500).json(statusOverview);
          //   });
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
    .catch(() => {
      res.status(500).send("Query Error");
    });
};

/**
 * Retrieves the departments
 */
export const retrieveDepartments = (req: Request, res: Response): void => {
  database
    .query(
      `SELECT ressortID, bezeichnung, kuerzel, jbt_email, linkZielvorstellung, linkOrganigramm
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
    .catch(() => {
      res.status(500).send("Query Error");
    });
};

/**
 * Updates the department infos with the given id
 */
export const updateDepartmentInfo = (req: Request, res: Response): void => {
  database
    .query(`UPDATE ressort SET linkOrganigramm = ?, linkZielvorstellung = ?  WHERE ressortID = ?`, [
      req.body.linkOrganigramm,
      req.body.linkZielvorstellung,
      req.params.id,
    ])
    .then(() => {
      res.status(200).send("Department Update succesful");
    })
    .catch(() => {
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
    .catch(() => {
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
    .catch(() => {
      res.status(500).send("Query Error");
    });
};

/**
 * Updates the status of an existing member
 * Update can be done by members with certain permission
 * Update can be done by member himself with an additional permission
 */
export const updateMemberStatus = (req: Request, res: Response): void => {
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

  // Get status that was changed
  // Trainee, aktives Mitglied, Senior, Alumnus, passives Mitglied, ausgetretenes Mitglied
  let statusChangeDate = "";
  switch (req.body.mitgliedstatus) {
    case "Trainee":
      statusChangeDate = "trainee_seit = ? ";
      break;
    case "aktives Mitglied":
      statusChangeDate = "aktiv_seit = ? ";
      break;
    case "Senior":
      statusChangeDate = "senior_seit = ? ";
      break;
    case "Alumnus":
      statusChangeDate = "alumnus_seit = ? ";
      break;
    case "passives Mitglied":
      statusChangeDate = "passiv_seit = ? ";
      break;
    case "ausgetretenes Mitglied":
      statusChangeDate = "ausgetreten_seit = ? ";
      break;
    default:
      break;
  }

  database
    .query(
      `UPDATE mitglied
        SET mitgliedstatus = (SELECT mitgliedstatusID FROM mitgliedstatus WHERE bezeichnung = ?), lastchange = ?, ` +
        statusChangeDate +
        `WHERE mitgliedID = ?`,
      [req.body.mitgliedstatus, lastChangeTime, lastChangeTime, req.params.id]
    )
    .then((result) => {
      res.status(200).send("Profile Update Successful");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Query Error: Updating Profile failed");
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
          .then(() => {
            // Delete the exisitng entries of languages of the specific member
            database
              .connectionQuery(connection, `DELETE FROM sprachen WHERE mitglied_mitgliedID = ?`, [req.params.id])
              .then(() => {
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
                  .then(() => {
                    // Delete the existing entries of edv skills of the specific member
                    database
                      .connectionQuery(connection, `DELETE FROM edvkenntnisse WHERE mitglied_mitgliedID = ?`, [
                        req.params.id,
                      ])
                      .then(() => {
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
                          .then(() => {
                            database
                              .commit(connection)
                              .then(() => {
                                res.status(200).send("Profile Update Successful");
                              })
                              .catch(() => {
                                res.status(500).send("Query Error: Commiting failed");
                              });
                          })
                          .catch(() => {
                            res.status(500).send("Query Error: Updating EDV Skills failed");
                          });
                      })
                      .catch(() => {
                        res.status(500).send("Query Error: Deleting EDV Skills failed");
                      });
                  })
                  .catch(() => {
                    res.status(500).send("Query Error: Updating Languages failed");
                  });
              })
              .catch(() => {
                res.status(500).send("Query Error: Deleting Languages failed");
              });
          })
          .catch(() => {
            res.status(500).send("Query Error: Updating Profile failed");
          });
      })
      .catch(() => {
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
          .then(() => {
            // Delete the exisitng entries of languages of the specific member
            database
              .connectionQuery(connection, `DELETE FROM sprachen WHERE mitglied_mitgliedID = ?`, [req.params.id])
              .then(() => {
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
                  .then(() => {
                    // Delete the existing entries of edv skills of the specific member
                    database
                      .connectionQuery(connection, `DELETE FROM edvkenntnisse WHERE mitglied_mitgliedID = ?`, [
                        req.params.id,
                      ])
                      .then(() => {
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
                          .then(() => {
                            database
                              .commit(connection)
                              .then(() => {
                                res.status(200).send("Profile Update Successful");
                              })
                              .catch(() => {
                                res.status(500).send("Query Error: Commiting failed");
                              });
                          })
                          .catch(() => {
                            res.status(500).send("Query Error: Updating EDV Skills failed");
                          });
                      })
                      .catch(() => {
                        res.status(500).send("Query Error: Deleting EDV Skills failed");
                      });
                  })
                  .catch(() => {
                    res.status(500).send("Query Error: Updating Languages failed");
                  });
              })
              .catch(() => {
                res.status(500).send("Query Error: Deleting Languages failed");
              });
          })
          .catch(() => {
            res.status(500).send("Query Error: Updating Profile failed");
          });
      })
      .catch(() => {
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
      .then(() => {
        res.status(200).send("Profile Update Successful");
      })
      .catch(() => {
        res.status(500).send("Query Error: Updating Profile failed");
      });
  } else {
    res.status(403).send("Authorization failed: You are not permitted to do this");
  }
};

/**
 * Change member status to left association (ausgetreten)
 */
export const deleteMember = (req: Request, res: Response): void => {
  // Checks if the member is allowed to delete the permission

  database
    .query("UPDATE mitglied SET mitgliedstatus=6 WHERE mitgliedID=?", [req.params.id])
    .then((result) => {
      res.status(200).send("Member status set to left association");
    })
    .catch((err) => {
      res.status(500).send("Database Error: Changing member status failed");
    });
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
    .catch(() => {
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
    .catch(() => {
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
        .catch(() => {
          res.status(500).send("Query Error");
        });
    })
    .catch(() => {
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
    .then(() => {
      res.status(201).send({
        message: "Permission created",
        mitgliedID: req.body.memberID,
        berechtigungID: req.body.permissionID,
      });
    })
    .catch(() => {
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
    .then(() => {
      res.status(200).send("Permission deleted");
    })
    .catch(() => {
      res.status(500).send("Database Error: Deleting Permission failed");
    });
};
