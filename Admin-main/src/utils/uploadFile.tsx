import instance from "@/api/axios";
import axiosInstance from "@/redux/axios";
import axios from "axios";
import { env } from "../../config/env";

export interface ImageRes {
  data: { fileUrl: string; message: string; status: number };
}

export const uploadFile = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file); // <-- Use "file" as the key

  try {
    const response: ImageRes = await instance.post(
      `${env.NEXT_PUBLIC_API_URL}/api/v1/file-upload/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log(response);
    return response?.data?.fileUrl || null; // <-- Use fileUrl from backend
  } catch (error) {
    console.error("File upload error:", error);
    return null;
  }
};