import axios from "axios";

const baseURL =
  (process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_BASE_URL_DEV
    : process.env.REACT_APP_API_BASE_URL_PROD) || "http://localhost:5000";

const API = axios.create({
  baseURL,
  timeout: 30000, // 30 second timeout
});

// Request interceptor - add auth token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      error.message = "Network error. Please check your connection.";
      return Promise.reject(error);
    }

    // Handle 401 - Unauthorized
    if (error.response.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
    }

    // Extract error message
    const errorMessage =
      error.response.data?.message ||
      error.response.data?.error ||
      error.response.data ||
      error.message ||
      "An error occurred";

    error.message = typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage);
    return Promise.reject(error);
  }
);

// Enable mock API in standalone mode
if (
  String(process.env.REACT_APP_MOCK_API || "false").toLowerCase() === "true"
) {
  import("./mock").then(({ default: enableMocks }) => enableMocks(API));
}

export default API;
