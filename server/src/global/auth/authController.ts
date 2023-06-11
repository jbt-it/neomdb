/**
 * Definition of the functions required for authentification and authorization
 */
import bcrypt = require("bcryptjs");
import { CookieOptions, Request, Response } from "express";
import database = require("../../database");
import * as globalTypes from "./../globalTypes";
import * as authTypes from "./authTypes";
import { doesPermissionsHaveSomeOf, doesPermissionsInclude } from "../../utils/authUtils";
import { generateJWT, verifyJWT } from "../../utils/jwtUtils";
import nodemailer = require("nodemailer");

/**
 * Options for the cookie
 */
const cookieOptions: CookieOptions = {
  httpOnly: true, // Cookie is only accesible via the browser
  secure: true, // Cookie can only be sent to an HTTPS page
  sameSite: "none", // Cookie can be sent to every site
};

/**
 * Sleeps randomly between a given minimum and maximum of miliseconds
 * @param minMiliSec Minimum of miliseconds
 * @param maxMiliSec Maximum of miliseconds
 */
const sleepRandomly = (minMiliSec, maxMiliSec) => {
  const randomMiliSec = Math.floor(Math.random() * (maxMiliSec - minMiliSec)) + minMiliSec;
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < randomMiliSec);
};

/**
 * Sends an httpOnly cookie to the client and retrieves id, username and corresponding permissions
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
      .then((result: authTypes.LoginQueryResult[]) => {
        if (result.length === 0) {
          // Sleeping randomly between 50 and 100 miliseconds to prevent username prediction
          sleepRandomly(50, 110);
          res.status(401).send("Username or password wrong");
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
            [result[0].mitgliedID]
          )
          .then((directorPermissionsResult: globalTypes.Permission[]) => {
            let permissions = [];
            // Adds role permissions to the permissions array
            if (directorPermissionsResult.length !== 0) {
              permissions = directorPermissionsResult;
            }

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
            bcrypt
              .compare(req.body.password, result[0].passwordHash)
              .then((match) => {
                if (match) {
                  const payload: globalTypes.JWTPayload = {
                    mitgliedID: result[0].mitgliedID,
                    name: result[0].name,
                    permissions,
                  };
                  const token = generateJWT(payload);
                  res.cookie("token", token, cookieOptions).status(200).json(payload);
                } else {
                  res.status(401).send("Username or password wrong");
                }
              })
              .catch(() => {
                res.status(401).send("Username or password wrong");
              });
          })
          .catch(() => {
            res.status(500).send("Query Error");
          });
      })
      .catch(() => {
        res.status(500).send("Query Error");
      });
  }
};

/**
 * Retrieves the data of the currently logged in user
 */
export const retrieveUserData = (req: Request, res: Response) => {
  // Decode the JWT to access the id of the user
  const jwtData = verifyJWT(req.cookies.token);
  database
    .query(
      `SELECT mitgliedID, name, GROUP_CONCAT(mitglied_has_berechtigung.berechtigung_berechtigungID) AS permissions
      FROM mitglied
      LEFT JOIN mitglied_has_berechtigung ON mitglied.mitgliedID = mitglied_has_berechtigung.mitglied_mitgliedID
      WHERE mitgliedID = ?
      GROUP BY mitgliedID, name`,
      [jwtData.mitgliedID]
    )
    .then((result: authTypes.UserDataQueryResult[]) => {
      // Selects permissions belonging to a possible role of the member
      database
        .query(
          `SELECT berechtigung_berechtigungID AS permissionID, canDelegate
          FROM mitglied_has_evposten
          LEFT JOIN evposten_has_berechtigung ON mitglied_has_evposten.evposten_evpostenID = evposten_has_berechtigung.evposten_evpostenID
          WHERE mitglied_has_evposten.mitglied_mitgliedID = ?;
        `,
          [jwtData.mitgliedID]
        )
        .then((directorPermissionsResult: globalTypes.Permission[]) => {
          let permissions = [];

          // Adds role permissions to the permissions array
          if (directorPermissionsResult.length !== 0) {
            permissions = directorPermissionsResult;
          }

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
 * An email is sent with an password reset link and a key in the url to the user
 * The key used in the link is saved in the databse for the later verification
 * @param req email
 * @param res 200 if process is available, 500 else
 */
export const sendPasswordResetLink = (req: Request, res: Response): void => {
  const date = new Date();
  const name = String(req.body.email).split("@")[0];
  // Create a token
  const plaintextToken = req.body.email.concat(date.getTime());
  // Create a hash from the token
  bcrypt.genSalt(10, (_err, salt) => {
    bcrypt.hash(plaintextToken, salt, (_, hash) => {
      // Check if email is valid
      sleepRandomly(300, 400);
      database
        .query(
          `SELECT jbt_email
          FROM mitglied
          WHERE mitglied.name = ?`,
          [name]
        )
        .then((result: authTypes.GetEmailToVerifyValidity[]) => {
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
                        user: "mdbpasswortreset@studentische-beratung.de", // Email
                        pass: "pQam721?", // PW
                      },
                    }); // Setup e-mail data with unicode symbols
                    const mailOptions = {
                      from: '"JBT MDB SUPPORT" <foo@studentische-beratung.de>', // TODO actual sender address
                      to: req.body.email, // List of receivers
                      subject: "Passwort reset link for the account belonging to this mail", // Subject line
                      text:
                        "Hello " +
                        name +
                        ",\n\n" +
                        "There was a request to change your password for the MDB! \n\n" +
                        "If you did not make this request then please ignore this email. \n\n" +
                        "Otherwise, please use this url to change your password: \n\n" +
                        "http://localhost:3000/#/passwort-vergessen-zuruecksetzten/" + // TODO use actual website instead of localhost
                        hash +
                        "\n\n" +
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
 * @param res 200 if process is available, 500 else
 */
export const resetPasswordWithKey = (req: Request, res: Response): void => {
  const name = String(req.body.email).split("@")[0];
  // Get current date
  const today = new Date();
  const date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate() +
    " " +
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();
  // Check if a valid email and token are safed in the table
  sleepRandomly(300, 400);
  database
    .query(
      `SELECT mitglied_jbt_email, DATEDIFF(datum, ?) AS datediff, token FROM passwort_reset
    WHERE mitglied_jbt_email = ?
    AND token = ?`,
      [date, req.body.email, req.body.key]
    )
    .then((result: authTypes.GetEmailDateTokenToVerifyValidity[]) => {
      console.log(result[0].datediff);
      if (result.length !== 0) {
        // Check if the entry is older then five days
        if (result[0].datediff < 5) {
          bcrypt
            .hash(req.body.newPassword, 10)
            .then((hash) => {
              // Store hash in your password DB
              database
                .query(
                  `UPDATE mitglied
                SET passwort = ?, passwordHash = ?
                WHERE mitglied.name = ?`,
                  [req.body.newPassword, hash, name] //TODO: dont save new passwort as plaintext
                )
                .then(() => {
                  // Delete used entry
                  database
                    .query(
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
            });
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
      res.status(200).send();
    });
};

/**
 * Loggs the user out by removing the jwt from the cookie
 */
export const logout = (req: Request, res: Response) => {
  const token = null;
  res.cookie("token", token, cookieOptions).status(200).send("Logout succesful!");
};
