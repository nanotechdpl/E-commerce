import axios from "axios";
import { env } from "../../config/env";

const BASE_URL = `${env.NEXT_PUBLIC_API_URL}/api/v1`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});



// Auth Routes
export const adminSignup = async (data: object) => {
    debugger
    console.log("create Admin post data::", data)
  return await api.post("/user-admin/create/", data);
};

export const adminLogin = async (data: object) => {
  return await api.post("/admin/auth/login", data);
};

export const adminForgotPassword = async (data: object) => {
  return await api.post("/forgot/password", data);
};

