/**
 * Configuration for the used API endpoint
 */
import axios from "axios";

console.log("API", process.env.REACT_APP_API_LOCATION);
export default axios.create({
  // TODO: Make env available
  // If the production API location is set (by docker-compose), use it, otherwise use the development API location
  baseURL: process.env.REACT_APP_API_LOCATION || "http://localhost:9000/api/",
  responseType: "json",
  withCredentials: true,
});
