/**
 * Configuration for the used API endpoint
 */
import axios from "axios";

export default axios.create({
  // If the production API location is set (by docker-compose), use it, otherwise use the development API location
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3030/api/",
  responseType: "json",
  withCredentials: true,
});
