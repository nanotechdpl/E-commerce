import { env } from "../../../../../config/env";
import { Dispatch } from "redux"
import { AllReturnsFetchingFailed, fetchedAllReturns, fetchedSingleReturn, fetchingAllReturns, fetchingSingleReturn, singleReturnFetchingFailed } from "@/redux/fetures/returns/returnSlice";

const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

interface PaymentParams {
        status: string,
        startdate: string,
        enddate: string,
        currency: string,
        viewperpage: 10
}

export const getAllReturns = (reqBody: PaymentParams) => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchingAllReturns())
        fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/admin/user/return/dashboard`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token ? token : ''}`
            },
            body: JSON.stringify(reqBody),
        }).then(res => {
            return res.json()
        }).then(result => {
            if (result.status === 200 || result.status_code === 200 || result?.success) {
                dispatch(fetchedAllReturns({ data: result?.data }))
            }
        }).catch(err => {
            dispatch(AllReturnsFetchingFailed({ error: err.message }))
        })
    }
}

export const getSingleReturn = (id: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchingSingleReturn())
        fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/admin/user/return/single`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token ? token : ''}`
            },
            body: JSON.stringify({refundid: id})
        }).then(res => {
            return res.json()
        }).then(result => {
            if (result.status === 200 || result.status_code === 200 || result?.success) {
                dispatch(fetchedSingleReturn({ data: result?.data?.refund }))
            }
        }).catch(err => {
            dispatch(singleReturnFetchingFailed({ error: err.message }))
        })
    }
}