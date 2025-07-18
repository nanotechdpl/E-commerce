import {
  adminData,
  fetchingAdminData,
  fetchingAdminDataFailed,
} from "@/redux/fetures/admin/adminSlice";
import Cookies from "js-cookie";
import { Dispatch } from "redux";
import axiosInstance from "@/redux/axios";
import instance from "@/api/axios";
const token = Cookies.get("token");

export const getAllAdmin = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingAdminData());
    try {
      const result = await instance.get("/admins");
      console.log("result", result);
       if(result && result.data && result.data.success){ 
        dispatch(adminData({ data: result?.data?.admins }));
       }
   
    } catch (error: any) {
      console.log(error);
      dispatch(fetchingAdminDataFailed({ error: error.message }));
    }
  };
};
export const changeStatus = (email: string, isActive: boolean) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingAdminData());

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/factory-app/auth-admin/status`,
        {
          method: "POST",
          body: JSON.stringify({ email, status: isActive }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (
        result.status === 200 ||
        result.status_code === 200 ||
        result?.success
      ) {
        dispatch(adminData({ data: result?.data }));
      } else {
        throw new Error(result.message || "Failed to update status.");
      }
    } catch (err: any) {
      dispatch(fetchingAdminDataFailed({ error: err.message }));
    }
  };
};
