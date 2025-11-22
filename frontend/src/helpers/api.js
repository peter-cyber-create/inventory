import axios from "axios";

const baseURL =
  (process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_BASE_URL_DEV
    : process.env.REACT_APP_API_BASE_URL_PROD) || "http://localhost:5000";

const API = axios.create({
  baseURL,
});

// Enable mock API in standalone mode
if (
  String(process.env.REACT_APP_MOCK_API || "false").toLowerCase() === "true"
) {
  import("./mock").then(({ default: enableMocks }) => enableMocks(API));
}

export default API;
