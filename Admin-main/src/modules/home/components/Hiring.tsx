"use client";
import React, { useState } from "react";
import { FieldValues } from "react-hook-form";
import { Poppins } from "next/font/google";

import FromsInCars from "./FormsInCars";
import { toast } from 'react-toastify';


import { uploadFile } from "@/utils/uploadFile";
import instance from "@/api/axios";



const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const Hiring = () => {
  
  const [isLoading, setIsLoading] = useState(false);
 



  const handleSubmit = async (data: FieldValues) => {
    try {
      

      // Upload the file and get the Cloudinary URL
      setIsLoading(true);
      const imageUrl = await uploadFile(data?.photo);
     

      // Prepare form data for the card API
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("photo", imageUrl || ""); // Send the Cloudinary URL as "image"
      formData.append("tag", data.tag);
      formData.append("description", data.description);
      console.log({ formData });

      const res: any = await instance.put(
        `/admin/home/hiring/hiring`,
        formData
      );

 

  
      if (res?.data?.success) {
        console.log("hiring", res);
       
        setIsLoading(false);
        toast.success(res?.message || "Submitted successfully");
      
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsLoading(false);
      toast.error("An unexpected error occurred.");

    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className={`${poppins.className} p-6 min-h-screen`}>
      <div className="w-[80%] mx-auto">
        
        <FromsInCars handleSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Hiring;