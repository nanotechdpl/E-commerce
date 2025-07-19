import { Dispatch } from "redux";

import axiosInstance from "@/redux/axios";
import {
  AllPaymentsFetchingFailed,
  fetchedAllPayments,
  fetchedSinglePayment,
  fetchingAllPayments,
  fetchingASingleayment,
  singlePaymentsFetchingFailed,
} from "@/redux/fetures/payment/paymentSlice";

export const getAllPayments = (userId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingAllPayments());
    try {
      const res = await axiosInstance.post(
        `/admin/user/payment/dashboard`
      );
      // console.log(res?.data);
      dispatch(fetchedAllPayments({ data: res?.data?.data }));
    } catch (error: any) {
      console.log(error);
      dispatch(AllPaymentsFetchingFailed({ data: error?.message }));
    }
  };
};

export const getSinglePayment = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingASingleayment());

    try {
      const res = await axiosInstance.post(
        `/factory-app/admin/single/payment`,
        { paymentid: id }
      );
      // console.log(res?.data);
      dispatch(fetchedSinglePayment({ data: res?.data?.data }));
    } catch (error: any) {
      console.log(error);
      dispatch(singlePaymentsFetchingFailed({ errro: error?.message }));
    }
  };
};
export const updateSinglePayment = async (id: string, status: string) => {
  try {
    const res = await axiosInstance.post(
      `/factory-app/admin/update/payment/status`,
      { paymentid: id, status: status }
    );
    console.log(res);
  } catch (error: any) {
    console.log(error);
  }
};
