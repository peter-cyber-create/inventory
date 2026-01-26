import axios from "axios";

// Use relative path in production (Nginx proxies /api to backend)
// Use absolute URL in development
const baseURL =
  (process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_BASE_URL_DEV || "http://localhost:5000"
    : process.env.REACT_APP_API_BASE_URL_PROD || "");

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
    // Handle network errors (no response from server)
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        error.message = "Request timeout. Please try again.";
      } else if (error.message.includes('Network Error')) {
        error.message = "Network error. Please check your connection and ensure the server is running.";
      } else {
        error.message = "Unable to connect to server. Please check your connection.";
      }
      return Promise.reject(error);
    }

    const status = error.response.status;
    const data = error.response.data;

    // Handle 401 - Unauthorized
    if (status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      // Redirect to login if not already there
      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = '/';
      }
    }

    // Handle 503 - Service Unavailable (Database connection issues)
    if (status === 503) {
      error.message = data?.message || "Service temporarily unavailable. Please try again later.";
      return Promise.reject(error);
    }

    // Handle 500 - Internal Server Error
    if (status === 500) {
      error.message = data?.message || "Internal server error. Please try again later.";
      return Promise.reject(error);
    }

    // Handle 400 - Bad Request (Validation errors)
    if (status === 400) {
      if (data?.errors && Array.isArray(data.errors)) {
        error.message = data.errors.join(', ');
      } else {
        error.message = data?.message || "Invalid request. Please check your input.";
      }
      return Promise.reject(error);
    }

    // Extract error message from response
    const errorMessage =
      data?.message ||
      data?.error ||
      (typeof data === 'string' ? data : undefined) ||
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
