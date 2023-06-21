/**
 * Configuration for the used API endpoint
 */
import axios from "axios";

export default axios.create({
  // TODO: baseURL: "https://localhost:3030/api/",
  baseURL: "https://localhost/api/",
  responseType: "json",
  withCredentials: true,
});
