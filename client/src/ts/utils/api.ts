/**
 * Configuration for the used API endpoint
 */
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:9000/api/",
  responseType: "json",
  withCredentials: true,
});
