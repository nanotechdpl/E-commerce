import { env } from "../../../../../config/env";
import { Dispatch } from "redux";
import {
  AllPaymentsFetchingFailed,
  fetchedAllPayments,
  fetchedPaymentTracker,
  fetchingAllPayments,
  fetchingPaymentTracker,
  PaymentTrackerFetchingFailed,
} from "@/redux/fetures/payment/paymentSlice";

interface Tracker {
  status: string;
  startdate: string;
  enddate: string;
  viewperpage: number;
  bankid: string;
  payment_type: string;
}

const getAuthToken = () => localStorage.getItem("token") || ""; // Retrieve token safely

export const getAllPayments = (userId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingAllPayments());
    const token = getAuthToken();

    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/api/v1/factory-app/admin/payment/dashboard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ orderid: userId }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      if (result.status === 200 || result.status_code === 200 || result?.success) {
        dispatch(fetchedAllPayments(result?.data));
      } else {
        throw new Error(result.message || "Failed to fetch payments.");
      }
    } catch (err: any) {
      dispatch(AllPaymentsFetchingFailed({ error: err.message }));
    }
  };
};

function buildApiUrl(path: string) {
  // Avoid double /api/v1 in the URL
  const base = env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  if (base.endsWith("/api/v1")) {
    return `${base}${path}`;
  } else {
    return `${base}/api/v1${path}`;
  }
}

export const getPaymentTracker = (track: Tracker) => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchingPaymentTracker());
    const token = getAuthToken();

    try {
      console.log('API URL used for payment tracker:', buildApiUrl("/factory-app/admin/payment-tracker"));
      const response = await fetch(
        buildApiUrl("/factory-app/admin/payment-tracker"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(track),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      if (result.status === 200 || result.status_code === 200 || result?.success) {
        dispatch(fetchedPaymentTracker(result?.data));
      } else {
        throw new Error(result.message || "Failed to fetch payment tracker.");
      }
    } catch (err: any) {
      dispatch(PaymentTrackerFetchingFailed({ error: err.message }));
    }
  };
};
