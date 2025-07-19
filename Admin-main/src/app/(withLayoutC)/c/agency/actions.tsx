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
      const res = await axiosInstance.post(
        `/admin/user/agency/single/${id}`
      );
      const agency = res?.data?.data || null;
      dispatch(fetchedSingleAgency(agency));
    } catch (error: any) {
      console.log(error);
      dispatch(singleAgencyFetchingFailed({ error: error?.message }));
    }
  };
};
