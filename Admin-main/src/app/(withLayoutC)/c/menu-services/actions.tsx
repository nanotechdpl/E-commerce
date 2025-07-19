import { env } from "../../../../../config/env";
import Cookies from "js-cookie";
import { Dispatch } from "redux";
import {
  fetchedData,
  fetchingData,
  fetchingFailed,
} from "@/redux/fetures/category/categorySlice";
import axiosInstance from "@/redux/axios";

const token = Cookies.get("token");

export const getAll = (endPint: string, attr: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingData());
    try {
      const res = await axiosInstance.get(`/${endPint}`);
      dispatch(fetchedData(res?.data[attr]));
    } catch (error: any) {
      dispatch(fetchingFailed({ error: error.message }));
    }
  };
};
