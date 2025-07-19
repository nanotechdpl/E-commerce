import {
  contactFetchingFailed,
  fetchedContactsData,
  fetchedSocialIcosData,
  fetching,
  paymentnIconsFetchingFailed,
  socialIconsFetchingFailed,
} from "@/redux/fetures/home/homeSlice";
import { env } from "../../../../../config/env";
import Cookies from "js-cookie";
import { Dispatch } from "redux";
import axiosInstance from "@/redux/axios";

const token = Cookies.get("token");

export const getAllContacts = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetching());
    fetch(
      `${env.NEXT_PUBLIC_API_URL}/api/v1/admin/contact-us`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ? token : ""}`,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result.status === 200 || result.status_code === 200) {
          dispatch(fetchedContactsData({ data: result?.data }));
        }
      })
      .catch((err) => {
        dispatch(contactFetchingFailed({ error: err.message }));
      });
  };
};
export const getAllSocialIcons = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetching());
    fetch(
      `${env.NEXT_PUBLIC_API_URL}/api/v1/admin/home/social-icons`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ? token : ""}`,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        if (result.status === 200 || result.status_code === 200) {
          dispatch(fetchedSocialIcosData({ data: result?.data }));
        }
      })
      .catch((err) => {
        dispatch(socialIconsFetchingFailed({ error: err.message }));
      });
  };
};
export const getAllPaymentIcons = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetching());
    try {
      const res = await axiosInstance.get(`/admin/payment-icon`);
      console.log(res);
      if (res.status === 200) {
        dispatch(fetchedSocialIcosData({ data: res?.data?.data }));
      }
    } catch (error: any) {
      dispatch(paymentnIconsFetchingFailed({ error: error.message }));
    }
  };
};
