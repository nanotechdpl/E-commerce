import { env } from "../../../../../config/env";
import Cookies from "js-cookie";
import { Dispatch } from "redux";
import {
  AllOrdersFetchingFailed,
  fetchedAllOrders,
  fetchingAllOrders,
  fetchedSingleOrder,
  fetchingSingleOrder,
  SingleOrderFetchingFailed,
} from "@/redux/fetures/order/orderSlice";
import axiosInstance from "@/redux/axios";
import instance from "@/api/axios";

const token = Cookies.get("token");
console.log(token);

type FilterParams = {
  status: string;
  startdate: string; // ISO date string
  enddate: string; // ISO date string
  viewperpage: number;
};

export const getAllOrders = (filters: { 
  email?: string; 
  orderStatus?: string; 
  serviceType?: string; 
  page?: number; 
  limit?: number; 
}) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingAllOrders());
    try {
      const params = new URLSearchParams();
      if (filters.email) params.append("email", filters.email);
      if (filters.orderStatus) params.append("orderStatus", filters.orderStatus);
      if (filters.serviceType) params.append("serviceType", filters.serviceType);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const res = await instance.get(
        `/orders${params.toString() ? "?" + params.toString() : ""}`
      );
      dispatch(fetchedAllOrders({ data: res.data }));
    } catch (err: any) {
      dispatch(AllOrdersFetchingFailed({ error: err.message }));
    }
  };
};

export const getSingleOrder = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingSingleOrder());

    try {
      const res = await axiosInstance.post(
        `/api/v1/factory-app/admin/single/order`,
        { orderid: id }
      );
      console.log(res?.data);
      dispatch(fetchedSingleOrder({ data: res?.data?.data }));
    } catch (error: any) {
      console.log(error);
      dispatch(SingleOrderFetchingFailed({ error: error.message }));
    }
  };
};
