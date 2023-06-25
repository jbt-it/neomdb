/**
 * Provides access to the nextcloud api
 */
import dotenv = require("dotenv");
import axios from "axios";
dotenv.config();

/**
 * The host of the nextcloud application
 */
const NC_HOST = process.env.NC_HOST;

/**
 * The port on which the nextcloud application is accesible
 */
const NC_PORT = process.env.NC_PORT;

/**
 * The neomdb-user of the nextcloud application
 */
const NC_USER = process.env.NC_USER;

/**
 * The password for the nextcloud neomdb-user
 */
const NC_PASSWORD = process.env.NC_PASSWORD;

/**
 * The default quota of a new user
 */
const DEFAULT_QUOTA = "2GB";

/**
 * The config of the nextcloud api connection
 */
const connectionConfig = {
  baseURL: `http://${NC_HOST}:${NC_PORT}/ocs/v1.php/cloud`,
  headers: { "OCS-APIRequest": true },
  auth: {
    username: NC_USER,
    password: NC_PASSWORD,
  },
};

/**
 * The connection to the nexcloud api
 */
const nextcloudConnection = axios.create(connectionConfig);

/**
 * Creates a new nextcloud user and returns a promise
 * @param username The name of the user, which also acts as the id
 * @param displayUserName The displayes user name
 * @param userPassword The password of the user
 * @param userEmail The email of the user
 * @param userGroups The different groups the user should be in
 * @returns A promise
 */
export const createNCUser = (
  username: string,
  displayUserName: string,
  userPassword: string,
  userEmail: string,
  userGroups: string[]
) => {
  return new Promise((resolve, reject) => {
    nextcloudConnection
      .post("/users", {
        userid: username,
        password: userPassword,
        displayName: displayUserName,
        email: userEmail,
        groups: userGroups,
        quota: DEFAULT_QUOTA,
      })
      .then((res) => {
        resolve(res.data.ocs.meta);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
