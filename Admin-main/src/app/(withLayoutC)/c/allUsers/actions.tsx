import {
  fetchedSingleUserData,
  fetchedUserAnalytics,
  fetchedUsersData,
  fetchingAllUsers,
  fetchedAllUsers,
  AllUsersFetchingFailed,
  fetchingSingleUserData,
  fetchingUserAnalytics,
  fetchingUsersData,
  SingleUserFetchinFailed,
  UserAnalyticsFetchinFailed,
  UsersFetchingFailed,
  toggleUserFailed,
  fetchedUserOrderById,
  userOrderByIdFailed,
  fetchedUserPaymentById,
  userPaymentsByIdFailed,
} from "@/redux/fetures/admin/userSlice";
import { env } from "../../../../../config/env";
import Cookies from "js-cookie";
import { Dispatch } from "redux";
import axiosInstance from "@/redux/axios";
import instance from "@/api/axios";

const token = Cookies.get("token");

export const getAllAdminUsers = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingUsersData());

    try {
      const res = await axiosInstance.post(`/admin/all/user/dashboard`);
      dispatch(fetchedUsersData({ data: res?.data?.data }));
    } catch (error: any) {
      console.log(error);
      dispatch(UsersFetchingFailed({ error: error.message }));
    }
  };
};

export const getSingleUser = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingSingleUserData());
    try {
      const res = await axiosInstance.get(
        `/factory-app/user-admin/${id}`
      );
      console.log(id, res.data);
      dispatch(fetchedSingleUserData({ data: res?.data?.data }));
    } catch (error: any) {
      console.log(error);
      dispatch(SingleUserFetchinFailed({ error: error.message }));
    }
  };
};

export const getAllUser = (query: string = "") => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingAllUsers());

    try {
      const res = await axiosInstance.post(`/admin/all/user/dashboard`);
      const result = res.data;

      if (
        res &&
        (result.status_code === 200 || result.status === 200)
      ) {
        dispatch(fetchedAllUsers({ data: result?.data }));
      } else {
        throw new Error(result.message || "Failed to fetch users");
      }
    } catch (error: any) {
      dispatch(AllUsersFetchingFailed({ error: error.message }));
    }
  };
};

export const getUserAnalytics = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingUserAnalytics());

    try {
      const res = await axiosInstance.post(
        `/admin/user/analytics`
      );
      console.log(res.data);
      dispatch(fetchedUserAnalytics({ data: res?.data?.data }));
    } catch (error: any) {
      console.log(error);
      dispatch(UserAnalyticsFetchinFailed({ error: error.message }));
    }
  };
};

export const createAdminUser = (data: object) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingUsersData());
   instance.post(`/admin`)
      .then((res) => {
        return res.data;
      })
      .then((result) => {
        debugger;
        if (result.status === 200 || result.status_code === 200) {
          dispatch(fetchedUsersData({ data: result?.data }));
        }
      })
      .catch((err) => {
        dispatch(UsersFetchingFailed({ error: err.message }));
      });
  };
};

export const toggleUser = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingUsersData());
    try {
      const res = await axiosInstance.post(
        `factory-app/user-admin/block/${id}`
      );
      console.log(res.data);
    } catch (error: any) {
      console.log(error);
      dispatch(toggleUserFailed({ error: error?.message }));
    }
  };
};
export const deleteUser = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingUsersData());
    try {
      const res = await axiosInstance.post(
        `factory-app/user-admin/delete/${id}`
      );
      console.log(res.data);
    } catch (error: any) {
      console.log(error);
      dispatch(toggleUserFailed({ error: error?.message }));
    }
  };
};

export const suspendUser = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingUsersData());
    try {
      const res = await axiosInstance.post(
        `factory-app/user-admin/suspend/${id}`
      );
      console.log(res.data);
    } catch (error: any) {
      console.log(error);
      dispatch(toggleUserFailed({ error: error?.message }));
    }
  };
};
export const getUserOrdersById = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingUsersData());
    try {
      const res = await axiosInstance.post(
        `factory-app/admin/user/order/dashboard`,
        { userid: id }
      );
      console.log(res.data.data);
      dispatch(fetchedUserOrderById({ data: res?.data?.data }));
    } catch (error: any) {
      console.log(error);
      dispatch(userOrderByIdFailed({ error: error?.message }));
    }
  };
};

export const getUserPaymentsById = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingUsersData());
    try {
      const res = await axiosInstance.post(
        `/admin/user/payment/dashboard`,
        { userid: id }
      );
      console.log(res.data);
      dispatch(fetchedUserPaymentById({ data: res?.data?.data }));
    } catch (error: any) {
      console.log(error);
      dispatch(userPaymentsByIdFailed({ error: error?.message }));
    }
  };
};
