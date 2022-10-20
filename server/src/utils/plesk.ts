/**
 * Provides access to the plesk api
 */
import dotenv = require("dotenv");
import axios from "axios";
import https = require("https");
dotenv.config();
/**
 * The host of the plesk application
 */
const PLESK_HOST = process.env.PLESK_HOST;

/**
 * The port on which the plesk application is accesible
 */
const PLESK_PORT = process.env.PLESK_PORT;

/**
 * The neomdb-user of the plesk application
 */
const PLESK_USER = process.env.PLESK_USER;

/**
 * The password of the plesk neomdb-user
 */
const PLESK_PASSWORD = process.env.PLESK_PASSWORD;

/**
 * The default mailbox quota of a new mail account
 */
const DEFAULT_QUOTA = "1G";

/**
 * The config of the plesk api connection
 */
const connectionConfig = {
  baseURL: `https://${PLESK_HOST}:${PLESK_PORT}/api/v2`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  auth: {
    username: PLESK_USER,
    password: PLESK_PASSWORD,
  },

  // Makes it possible to access plesk without providing https certificates
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
};

/**
 * The connection to the plesk api
 */
const pleskConnection = axios.create(connectionConfig);

/**
 * Creates a new mail account and returns a promise
 * @param mailAccount The new mail account (f.lastname@domain-name.de)
 * @param mailPsw The password of the new mail account
 * @returns A promise
 */
export const createMailAccount = (mailAccount: string, mailPsw: string) => {
  return new Promise((resolve, reject) => {
    pleskConnection
      .post("/cli/mail/call", {
        params: [
          "--create",
          mailAccount,
          "-mailbox",
          "true",
          "-passwd",
          mailPsw,
          "-mbox_quota",
          DEFAULT_QUOTA,
        ],
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Adds a mail account to a mail list
 * @param mailList The list to which the mail account should be added
 * @param mailAccount The mail account that should be added to the list
 * @returns A promise
 */
export const addMailAccountToMailingList = (
  mailList: string,
  mailAccount: string
) => {
  return new Promise((resolve, reject) => {
    pleskConnection
      .post("/cli/maillist/call", {
        params: [
          "-u",
          mailList,
          "-members",
          `add:${mailAccount}`,
          "-domain",
          "studentische-beratung.de",
        ],
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
