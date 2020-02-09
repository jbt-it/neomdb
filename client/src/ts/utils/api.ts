/**
 * Configuration for the used API endpoint
 */
import axios from "axios";

export default axios.create({
  baseURL: "https://localhost:3030",
  responseType: "json"
});