/**
 * Definition of the handler functions for the members module
 */
import database = require("../database");
import auth = require("../global/authController");
import bcrypt = require("bcryptjs");
import nodemailer = require("nodemailer");

import { Request, Response } from "express";
import * as membersTypes from "./membersTypes";
import { JWTPayload } from "../global/globalTypes";

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
          .catch((_err) => {
            res.status(401).send("Username or password wrong");
          });
      })
      .catch((_err) => {
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
              .catch((_error) => {
                res.status(500).send("Internal Error");
              });
          } else {
            res.status(401).send("The old password was not correct");
          }
        });
    })
    .catch((_err) => {
      res.status(500).send("Internal SQL Error");
    });
};

/**
 * An email is sent with an password reset link and a key in the url to the user
 * The key used in the link is saved in the databse for the later verification
 * @param req email
 * @param res 200 if process is available, 500 else
 */
export const sendPasswordResetLink = (req: Request, res: Response): void => {
  const date = new Date();
  const name = req.body.email.split("@");
  // Create a token
  const plaintextToken = req.body.email.concat(date.getTime());
  // Create a hash from the token
  bcrypt.genSalt(10, (_err, salt) => {
    bcrypt.hash(plaintextToken, salt, (_, hash) => {
      // Check if email is valid
      database
        .query(
          `SELECT jbt_email
          FROM mitglied
          WHERE mitglied.name = ?`,
          [name]
        )
        .then((result: membersTypes.GetEmailToVerifyValidity[]) => {
          if (result.length === 1) {
            // Delete old entrys, if any exist
            database
              .query(
                `DELETE FROM passwort_reset
                WHERE mitglied_jbt_email = ?`,
                [req.body.email]
              )
              .then(() => {
                // Insert the values into the passwort_reset table
                database
                  .query(
                    `INSERT INTO passwort_reset (mitglied_jbt_email, salt, token)
                    VALUES (?, ?, ?)`,
                    [req.body.email, salt, hash]
                  )
                  .then(() => {
                    // Send email with correct URL to usermail
                    const transport = nodemailer.createTransport({
                      host: "studentische-beratung.de",
                      port: 465,
                      auth: {
                        user: "foo@studentische-beratung.de", // TODO use actual email
                        pass: "fooPassword", // TODO use actual PW
                      },
                    }); // Setup e-mail data with unicode symbols
                    const mailOptions = {
                      from: "\"JBT MDB SUPPORT\" <foo@studentische-beratung.de>", // TODO actual sender address
                      to: req.body.email, // List of receivers
                      subject:
                        "Passwort reset link for the account belonging to this mail", // Subject line
                      text:
                        "Hello " +
                        name +
                        ",\n\n" +
                        "There was a request to change your password for the MDB! \n\n" +
                        "If you did not make this request then please ignore this email. \n\n" +
                        "Otherwise, please use this url to change your password: \n\n" +
                        "http://localhost:3000/#/passwort-vergessen-zuruecksetzten/" +
                        hash +
                        "\n\n" + // TODO use actual website instead of localhost
                        "Regards your IT ressort", // Plaintext body
                    };
                    res.status(200).send();
                  })
                  .catch(() => {
                    res.status(500).send("Internal Error");
                  });
              })
              .catch(() => {
                res.status(500).send("Internal Error");
              });
          } else {
            res.status(200).send();
          }
        })
        .catch(() => {
          res.status(500).send("Internal Error");
        });
    });
  });
};

/**
 * The user can set a new password by entering their mailadress and a new password
 * The mail and the key in the url are then checked to se if it is a valid pair
 * If the pair is valid the new password is stored
 * @param req email, key, new password
 * @param res 200 if process is available, 404 else
 */
export const resetPasswordWithKey = (req: Request, res: Response): void => {
  const name = req.body.email.split("@");
  // Get current date
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  // Check if a valid email and token are safed in the table
  database
    .query(
      `SELECT mitglied_jbt_email, DATEDIFF(day, datum, ?), token
    FROM passwort_reset
    WHERE mitglied_jbt_email = ?
    AND token = ?`,
      [date, req.body.email, req.body.key]
    )
    .then((result: membersTypes.GetEmailDateTokenToVerifyValidity[]) => {
      if (result.length !== 0) {
        // Check if the entry is older then five days
        if (result[0].datediff < 5) {
          bcrypt.hash(req.body.newPassword, 10)
          .then((hash) => {
            // Store hash in your password DB
            database
              .query(
                `UPDATE mitglied
            SET passwordHash = ?
            WHERE mitglied.name = ?`,
                [hash, name]
              )
              .then(() => {
                // Delete used entry
                database.query(
                  `DELETE FROM passwort_reset
                WHERE mitglied_jbt_email = ?`,
                  [req.body.email]
                )
                .then(() => {
                  res.status(200).send();
                })
                .catch(() => {
                  res.status(500).send("Internal Error");
                });
              })
              .catch(() => {
                res.status(500).send("Internal Error");
              });
          })
          .catch(() => {
            res.status(500).send("Internal Error");
          })
        } else {
          // User got the correct result since the date was to to old
          res.status(200).send();
        }
      } else {
        // User got the correct result since the email or token was invalid
        res.status(200).send();
      }
    })
    .catch(() => {
      res.status(500).send("Internal Error");
    });
};

/**
 * Retrieves an overview of all registered members
 */
export const retrieveMemberList = (_req: Request, res: Response): void => {
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
    .catch((_err) => {
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
      .catch((_err) => {
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
      .catch((_err) => {
        res.status(500).send("Query Error");
      });
  }
};

/**
 * Retrieves all members of a department
 */
export const retrieveDepartmentMembers = (
  _req: Request,
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
    .catch((_err) => {
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
        .then((_result) => {
          res.status(201).send("User created");
        })
        .catch((_err) => {
          res.status(500).send("Query Error: Creating User");
        });
    })
    .catch((_err) => {
      res.status(500).send("Hashing error");
    });
};

/**
 * Retrieves the history of directors
 */
export const retrieveDirectors = (_req: Request, res: Response): void => {
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
    .catch((_err) => {
      res.status(500).send("Query Error");
    });
};

/**
 * Retrieves the departments
 */
export const retrieveDepartments = (_req: Request, res: Response): void => {
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
    .catch((_err) => {
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
      .then((_result) => {
        res.status(200).send("Profile Update Successful");
      })
      .catch((_err) => {
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
      .then((_result) => {
        res.status(200).send("Profile Update Successful");
      })
      .catch((_err) => {
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
      .then((_result) => {
        res.status(200).send("Profile Update Successful");
      })
      .catch((_err) => {
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
export const retrievePermissionsList = (_req: Request, res: Response): void => {
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
    .catch((_err) => {
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
    .then((_result) => {
      res.status(201).send("Permission created");
    })
    .catch((_err) => {
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
    .then((_result) => {
      res.status(200).send("Permission deleted");
    })
    .catch((_err) => {
      res.status(500).send("Database Error: Deleting Permission failed");
    });
};
