"use client";
import React, { useMemo, useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Poppins } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { bindActionCreators } from "@reduxjs/toolkit";
import FromsInCars from "./FormsInCars";
import { toast } from 'react-toastify';
import {
  getImageUrl,
  postHomeData,
  resetMessageStatus,
} from "@/app/(withLayoutC)/c/home/actions";
import { updateStatus } from "@/redux/fetures/home/homeSlice";
import { uploadFile } from "@/utils/uploadFile";
import instance from "@/api/axios";



const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const CardThreeUpdate = () => {
  const [card, setCard] = useState<string>("card1");
  const [isLoading, setIsLoading] = useState(false);
 
  const dispatch = useDispatch();

  const { isSubmitting, message, status, threeCard }: any = useSelector(
    (state: RootState) => state.home
  );
  const actions = useMemo(
    () =>
      bindActionCreators(
        { getImageUrl, postHomeData, resetMessageStatus, updateStatus },
        dispatch
      ),
    [dispatch]
  );


  const handleSubmit = async (data: FieldValues) => {
    try {
      if (!data?.photo) {
        actions.updateStatus({
          status: "failed",
          message: "Please select an image.",
        });
        return;
      }

      // Upload the file and get the Cloudinary URL
      setIsLoading(true);
      const imageUrl = await uploadFile(data?.photo);
      console.log({ imageUrl });

      if (!imageUrl) {
        actions.updateStatus({
          status: "failed",
          message: "Image upload failed.",
        });
        return;
      }

      // Prepare form data for the card API
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("photo", imageUrl); // Send the Cloudinary URL as "image"
      formData.append("tag", data.tag);
      formData.append("description", data.description);
      console.log({ formData });

      const res: any = await instance.put(
        `/admin/home/three-cards/${card}`,
        formData
      );

 

  
      if (res?.data?.success) {
        console.log("threeCard", res);
        actions.updateStatus({
          status: "success",
          message: "Submitted successfully",
        });
        setIsLoading(false);
        toast.success(res?.message || "Submitted successfully");
      
      } else {
        actions.updateStatus({
          status: "failed",
          message: res?.data?.message,
        });
        toast.error(res?.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
      toast.error("An unexpected error occurred.");
      actions.updateStatus({
        status: "failed",
        message: "An unexpected error occurred.",
      });
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className={`${poppins.className} p-6 min-h-screen`}>
      <div className="w-[80%] mx-auto">
        <div className="flex flex-wrap gap-4 mb-8">
          {["card1", "card2", "card3"].map((cardKey) => (
            <button
              key={cardKey}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                card === cardKey
                  ? "bg-[#FFB200] text-black"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setCard(cardKey)}
            >
              {cardKey.replace("card", "Card ")}
            </button>
          ))}
        </div>
        <FromsInCars handleSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default CardThreeUpdate;