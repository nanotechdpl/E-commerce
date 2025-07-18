import { Dispatch } from "redux";
import axios from "../../../../redux/axios";
import {
  adding,
  addingDone,
  resetStatus,
  updateStatus,
  uploadingImage,
  uploadingImageDone,
  uploadingImageFailed,
} from "@/redux/fetures/home/homeSlice";

export interface ImageRes {
  data: { filePath: string; message: string; status: number };
}

export const getImageUrl = () => {
  return async (dispatch: Dispatch) => {
    dispatch(uploadingImage());

    try {
      const response = await axios.post(
        "/file-upload/upload",
        {},
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(uploadingImageDone());

      if (response?.data?.status === 200) {
        return response?.data?.filePath;
      } else {
        return response;
      }
    } catch (err) {
      dispatch(uploadingImageFailed(err));
      return null;
    }
  };
};

export const postHomeData = (url: string, formData) => {
  return async (dispatch: Dispatch) => {
    dispatch(adding());

    try {
      const res = await axios.post(`${url}`, formData);
      debugger;
      if (res?.data?.success) {
        dispatch(
          updateStatus({ status: "success", message: "Submitted Successfully" })
        );
        dispatch(addingDone());
        return res.data;
      } else {
        dispatch(
          updateStatus({ status: "failed", message: res?.data?.message })
        );
        return res;
      }
    } catch (error) {
      debugger;
      console.error("Error submitting data:", error);
      dispatch(
        updateStatus({
          status: "failed",
          message: "An error occurred, please try again",
        })
      );
      return null;
    }
  };
};

export const resetMessageStatus = () => {
  return async (dispatch: Dispatch) => {
    dispatch(resetStatus());
  };
};
