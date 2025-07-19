import { Dispatch } from "redux";
import axiosInstance from "@/redux/axios";
import {
  DashboardAgenciesFetchingFailed,
  DashboardOrdersFetchingFailed,
  DashboardPaymentsFetchingFailed,
  DashboardReturnsFetchingFailed,
  DashboardUsersFetchingFailed,
  fetchedDashboardAgencies,
  fetchedDashboardOrders,
  fetchedDashboardPayments,
  fetchedDashboardReturns,
  fetchedDashboardUsers,
} from "@/redux/fetures/dashboard/dashboardSlice";

export const getAdminOrdersData = () => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axiosInstance.post(
        `/admin/user/order/dashboard`
      );
      //   console.log(res.data);
      dispatch(fetchedDashboardOrders({ data: res?.data?.data }));
    } catch (error: any) {
      console.log(error);
      dispatch(DashboardOrdersFetchingFailed({ error: error.message }));
    }
  };
};

export const getAdminDashboadUsersData = () => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axiosInstance.post(
        `/admin/all/user/dashboard`
      );
      //   console.log(res.data);
      dispatch(fetchedDashboardUsers({ data: res?.data?.data }));
    } catch (error: any) {
      console.log(error);
      dispatch(DashboardUsersFetchingFailed({ error: error.message }));
    }
  };
};

export const getAdminDashboadPaymentsData = () => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axiosInstance.post(
        `/admin/user/payment/dashboard`
      );

      dispatch(fetchedDashboardPayments({ data: res?.data?.data }));
    } catch (error: any) {
      console.log(error);
      dispatch(DashboardPaymentsFetchingFailed({ error: error.message }));
    }
  };
};

export const getAdminDashboadRetrunsData = () => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axiosInstance.post(
        `/admin/user/return/dashboard`
      );
      console.log(res.data);
      dispatch(fetchedDashboardReturns({ data: res?.data?.data }));
    } catch (error: any) {
      console.log(error);
      dispatch(DashboardReturnsFetchingFailed({ error: error.message }));
    }
  };
};

export const getAdminDashboadAgenciesData = () => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axiosInstance.post(
        `/admin/user/agency/dashboard`
      );
      console.log("res:  ", res.data);
      dispatch(fetchedDashboardAgencies({ data: res?.data?.data }));
    } catch (error: any) {
      console.log(error);
      dispatch(DashboardAgenciesFetchingFailed({ error: error.message }));
    }
  };
};
