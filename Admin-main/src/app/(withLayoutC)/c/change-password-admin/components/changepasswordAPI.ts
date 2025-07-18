// src/api.ts
import { env } from "../../../../../../config/env";


//const BASE_URL = "http://localhost:5001/api/admin/auth";
const BASE_URL =`${env.NEXT_PUBLIC_API_URL}/api/admin/auth`


export const updatePassword = async (data: { email: string; currentpassword: string; newpassword: string }) => {
  try {
    const response = await fetch(`${BASE_URL}/update/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result)
    
    if (!response.ok) throw new Error(result.message || "Something went wrong");
    return result;
  } catch (error) {
    console.error("Password update error:", error);
    throw error;
  }
};
