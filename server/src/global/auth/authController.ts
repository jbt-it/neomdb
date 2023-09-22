/**
 * Definition of the functions required for authentification and authorization
 */
import bcrypt = require("bcryptjs");
import { QueryResult } from "databaseTypes";
import { CookieOptions, Request, Response } from "express";
import { createUserDataPayload } from "../../utils/authUtils";
import { generateJWT, verifyJWT } from "../../utils/jwtUtils";
import nodemailer = require("nodemailer");
import * as authTypes from "./authTypes";
import database = require("../../database");
import crypto = require("node:crypto");

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
      .then(
        (
          result: QueryResult
          // authTypes.LoginQueryResult[]
        ) => {
          let member = null;
          if (Array.isArray(result)) {
            member = result[0] as authTypes.UserDataQueryResult;
          }
          if (result.length === 0) {
            // Sleeping randomly between 50 and 100 miliseconds to prevent username prediction
            sleepRandomly(50, 110);
            res.status(401).send("Username or password wrong");
            return;
          }

          // Selects permissions belonging to a possible role of the member
          database
            .query(
              `SELECT berechtigung_berechtigungID AS permissionID, canDelegate, mitglied_has_evposten.evposten_evpostenID as directorID
          FROM mitglied_has_evposten
          LEFT JOIN evposten_has_berechtigung ON mitglied_has_evposten.evposten_evpostenID = evposten_has_berechtigung.evposten_evpostenID
          WHERE mitglied_has_evposten.mitglied_mitgliedID = ? AND mitglied_has_evposten.von <= NOW() AND mitglied_has_evposten.bis >= NOW();
        `,
              [member.mitgliedID]
            )
            .then(
              (
                directorPermissionsResult: QueryResult
                //  globalTypes.Permission[]
              ) => {
                let permissions = [];
                // Adds role permissions to the permissions array
                if (directorPermissionsResult.length !== 0) {
                  permissions = directorPermissionsResult;
                }
                bcrypt
                  .compare(req.body.password, member.passwordHash)
                  .then((match) => {
                    if (match) {
                      const payload = createUserDataPayload(member, permissions);
                      const token = generateJWT(payload);
                      res.cookie("token", token, cookieOptions).status(200).json(payload);
                    } else {
                      res.status(401).send("Username or password wrong");
                    }
                  })
                  .catch(() => {
                    res.status(401).send("Username or password wrong");
                  });
              }
            )
            .catch(() => {
              res.status(500).send("Query Error");
            });
        }
      )
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
    .then(
      (
        result: QueryResult
        // authTypes.UserDataQueryResult[]
      ) => {
        let member = null;
        if (Array.isArray(result)) {
          member = result[0] as authTypes.UserDataQueryResult;
        }
        if (result.length === 0) {
          // Sleeping randomly between 50 and 100 miliseconds to prevent username prediction
          sleepRandomly(50, 110);
          res.status(401).send("Username or password wrong");
          return;
        }
        // Selects permissions belonging to a possible role of the member
        database
          .query(
            `SELECT berechtigung_berechtigungID AS permissionID, canDelegate, mitglied_has_evposten.evposten_evpostenID as directorID
          FROM mitglied_has_evposten
          LEFT JOIN evposten_has_berechtigung ON mitglied_has_evposten.evposten_evpostenID = evposten_has_berechtigung.evposten_evpostenID
          WHERE mitglied_has_evposten.mitglied_mitgliedID = ?;
        `,
            [jwtData.mitgliedID]
          )
          .then(
            (
              directorPermissionsResult: QueryResult
              // globalTypes.Permission[]
            ) => {
              let permissions = [];
              // Adds role permissions to the permissions array
              if (directorPermissionsResult.length !== 0) {
                permissions = directorPermissionsResult;
              }
              const payload = createUserDataPayload(member, permissions);
              res.status(200).json(payload);
            }
          )
          .catch(() => {
            res.status(500).send("Query Error");
          });
      }
    )
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

/**
 * TODO: implement nodemailer to be able to send mails with microsoft exchange 365
 * put nodemailer transporter in a new file
 */
export const sendPasswordResetLink = async (req: Request, res: Response): Promise<void> => {
  const name = String(req.body.email).split("@")[0];
  database.query(`SELECT vorname FROM mitglied WHERE mitglied.name = ?`, [name]).then((result: any) => {
    const vorname = result[0].vorname;
    // Create a token
    const token = crypto.randomBytes(64).toString("base64url");

    // Check if email is valid
    sleepRandomly(300, 400);
    database
      .query(
        `SELECT jbt_email
          FROM mitglied
          WHERE mitglied.name = ?`,
        [name]
      )
      .then((result: authTypes.GetEmailToVerifyValidityQueryResult[]) => {
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
                  [req.body.email, "salt", token]
                )
                .then(() => {
                  // Send email with correct URL to usermail
                  console.log("Send Mail");
                  const transport = nodemailer.createTransport({
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    secure: false,
                    auth: {
                      user: process.env.MAIL_USER, // Email
                      pass: process.env.MAIL_PASSWORD, // PW
                    },
                    tls: {
                      rejectUnauthorized: false,
                    },
                  }); // Setup e-mail data with unicode symbols
                  const mailOptions = {
                    from: '"JBT MDB SUPPORT" <mdb@studentische-beratung.de>', // TODO actual sender address
                    to: req.body.email, // List of receivers
                    subject: "Passwort zurücksetzen", // Subject line
                    text:
                      "Hello " +
                      vorname +
                      ",\n\n" +
                      "Es gab eine Anfrage, dein Passwort für die MDB zu ändern! \n" +
                      "Falls du diese Anfrage nicht gestellt haben, ignoriere bitte diese E-Mail oder wende dich an das Ressort IT. \n" +
                      "Andernfalls verwende bitte die folgende URL, um dein Passwort zu ändern: \n\n" +
                      "http://localhost:3000/#/passwort-vergessen-zuruecksetzten/" + // TODO use actual website instead of localhost
                      token +
                      "\n\n" +
                      "\n\n" +
                      "Beste Grüße \n\n" +
                      "Dein Ressort IT",
                  };
                  transport.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      return console.log(error);
                    }
                    console.log("Message sent: %s", info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                  });
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
};

/**
 * The user can set a new password by entering their mailadress and a new password
 * The mail and the key in the url are then checked to se if it is a valid pair
 * If the pair is valid the new password is stored
 * @param req email, key, new password
 * @param res 200 if process is available, 500 else
 */
export const resetPasswordWithKey = (req: Request, res: Response): void => {
  console.log("resetPasswordWithKey");
  console.log(req.body);
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
    .then((result: authTypes.GetEmailDateTokenToVerifyValidityQueryResult[]) => {
      // Check if the email and token are valid
      if (result.length == 0) {
        console.log(result);
        res.status(404).send();
        return;
      }
      // Check if the entry is older than five days
      if (result[0].datediff <= -6) {
        database
          .query(
            `DELETE FROM passwort_reset
                  WHERE mitglied_jbt_email = ?`,
            [req.body.email]
          )
          .then(() => {
            res.status(422).send("Token expired");
          })
          .catch((e) => {
            console.log(e);
            res.status(500).send("Internal Error");
          });
        return;
      }
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
              // Delete used entry from the passwort_reset table
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
    })
    .catch(() => {
      res.status(500).send();
    });
};

/**
 * Loggs the user out by removing the jwt from the cookie
 */
export const logout = (req: Request, res: Response) => {
  const token = null;
  res.cookie("token", token, cookieOptions).status(200).send("Logout succesful!");
};
