/**
 * Provides access to the mediawiki api
 */
import dotenv = require("dotenv");
import { mwn } from "mwn";
dotenv.config();

/**
 * The url of the mediawiki application
 */
const MW_URL = process.env.MW_URL;

/**
 * The neomdb-user of the mediawiki application
 */
const MW_USER = process.env.MW_USER;

/**
 * The password for the mediawiki neomdb-user
 */
const MW_PSW = process.env.MW_PSW;

/**
 * Bot which holds the connection to the mediawiki
 */
const wikiBot = new mwn({
  apiUrl: MW_URL,
  username: MW_USER,
  password: MW_PSW,
});

/**
 * Creates a new mediawiki user and returns a promise
 * @param username The name of the user
 * @param userPassword The password of the user
 * @param userEmail The email of the user
 * @returns A promise
 */
export const createMWUser = (username: string, userPassword: string, userEmail: string) => {
  return new Promise((resolve, reject) => {
    let result = null;
    wikiBot
      .login()
      .then(() =>
        // Retrieves the token for user creation
        wikiBot.request({
          action: "query",
          meta: "tokens",
          type: "createaccount",
        })
      )
      .then((tokenRes) =>
        // Creates a new user
        wikiBot.request({
          action: "createaccount",
          createtoken: tokenRes.query.tokens.createaccounttoken,
          email: userEmail,
          username,
          password: userPassword,
          retype: userPassword,
          createreturnurl: MW_URL,
        })
      )
      .then((res) => {
        // Saves the result to resolve it if logout is succesful
        result = res.createaccount.status;
        return wikiBot.logout();
      })
      .then(() => {
        resolve(result);
      })
      .catch((err) => {
        wikiBot
          .logout()
          .then(() => reject(err))
          .catch(() => reject(err));
      });
  });
};
