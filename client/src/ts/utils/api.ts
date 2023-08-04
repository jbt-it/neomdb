/**
 * Configuration for the used API endpoint
 */
import axios from "axios";

/**
 * Returns the base URL of the API endpoint depending on the environment variable REACT_APP_ENV
 * @returns The base URL of the API endpoint
 */
const getBaseUrl = () => {
  // Only if the client was build the environment variable NODE_ENV is set to "production"
  // therefore we can use it to determine if we are in production mode
  if (process.env.NODE_ENV === "production") {
    return process.env.REACT_APP_API_URL;
  } else {
    return "http://localhost:3030/api/";
  }
};

export default axios.create({
  // Use the environment variable if it exists, otherwise use the default value
  baseURL: getBaseUrl(),
  responseType: "json",
  withCredentials: true,
});
