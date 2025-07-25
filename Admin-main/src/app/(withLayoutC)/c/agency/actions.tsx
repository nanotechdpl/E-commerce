import {
  AgencyAnalyticsFetchingFailed,
  AllAgeniesFetchingFailed,
  fetchedAgencyAnalytics,
  fetchedAllAgenies,
  fetchedSingleAgency,
  fetchingAgencyAnalytics,
  fetchingAllAgenies,
  fetchingSingleAgency,
  singleAgencyFetchingFailed,
} from "@/redux/fetures/agency/agencySlice";
import { env } from "../../../../../config/env";
import Cookies from "js-cookie";
import { Dispatch } from "redux";
import axiosInstance from "@/redux/axios";

const token = Cookies.get("token");

export const getAllAgencies = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingAllAgenies());
    try {
      const res = await axiosInstance.post(
        `/admin/user/agency/dashboard`
      );
      const agencies = res?.data?.data?.agencies || [];
      dispatch(fetchedAllAgenies(agencies));
    } catch (error: any) {
      console.log(error);
      dispatch(AllAgeniesFetchingFailed({ error: error?.message }));
    }
  };
};

export const getAgencyAnalytics = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingAgencyAnalytics());
    try {
      const res = await axiosInstance.post(
        `/admin/user/agency/dashboard`
      );
      const analytics = res?.data?.data?.analytics || [];
      dispatch(fetchedAgencyAnalytics(analytics));
    } catch (err: any) {
      dispatch(AgencyAnalyticsFetchingFailed({ error: err.message }));
    }
  };
};

export const getSingleAgency = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingSingleAgency());
    try {
      const res = await axiosInstance.get(`/agency/${id}`);
      const agency = res?.data?.agency || null;
      dispatch(fetchedSingleAgency(agency));
    } catch (error: any) {
      console.log(error);
      dispatch(singleAgencyFetchingFailed({ error: error?.message }));
    }
  };
};

export const deleteAgency = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      await axiosInstance.delete(`/agency/${id}`);
      // Optionally, you can dispatch an action to remove from state or refetch
      dispatch(getAllAgencies());
    } catch (error: any) {
      console.log(error);
      // Optionally, dispatch an error action
    }
  };
};

export const updateAgencyStatus = (id: string, status: string) => {
  return async (dispatch: Dispatch) => {
    try {
      await axiosInstance.put(`/agency/update/${id}`, { status });
      dispatch(getSingleAgency(id)); // Refresh single agency
      dispatch(getAllAgencies()); // Refresh list
    } catch (error: any) {
      console.log(error);
      // Optionally, dispatch an error action
    }
  };
};
