import axios from "axios";
import { env } from "../../config/env";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: "http://localhost:7000/api/v1", // Restored original base URL
    timeout: 10000, // Set timeout (optional)
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor (Add Token)
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token"); // Get token from localStorage
            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor (Handle Errors)
axiosInstance.interceptors.response.use(
    (response) => response, // Just return response if successful
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.error("Unauthorized! Redirecting to login...");
                // Handle token expiration (e.g., redirect to login)
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
