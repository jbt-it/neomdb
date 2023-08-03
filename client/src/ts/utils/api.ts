/**
 * Configuration for the used API endpoint
 */
import axios from "axios";

export default axios.create({
  // Use the environment variable if it exists, otherwise use the default value
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3030/api/",
  responseType: "json",
  withCredentials: true,
});
