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
      dispatch(fetchedAllPayments(res?.data?.data));
    } catch (error: any) {
      console.log(error);
      dispatch(AllPaymentsFetchingFailed({ error: error?.message }));
    }
  };
};

export const getSinglePayment = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingASingleayment());

    try {
      const res = await axiosInstance.post(
        `/admin/single/payment`,
        { paymentid: id }
      );
      // console.log(res?.data);
      dispatch(fetchedSinglePayment(res?.data?.data));
    } catch (error: any) {
      console.log(error);
      dispatch(singlePaymentsFetchingFailed({ error: error?.message }));
    }
  };
};
export const updateSinglePayment = async (id: string, status: string) => {
  try {
    const res = await axiosInstance.post(
      `/admin/update/payment/status`,
      { paymentid: id, status: status }
    );
    console.log(res);
  } catch (error: any) {
    console.log(error);
  }
};
