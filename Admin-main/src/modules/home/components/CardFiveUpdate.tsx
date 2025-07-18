import React, { useState } from "react";
import { FieldValues } from "react-hook-form";
import FormsInCars from "./FormsInCars"

import { toast } from "react-toastify";
import { uploadFile } from "@/utils/uploadFile";
import instance from "@/api/axios";

const CardFiveUpdate = () => {
   const [card, setCard] = useState<string>("card1");
     const [isLoading, setIsLoading] = useState(false);
 



  const handleSubmit = async (data: FieldValues) => {
     try {
      
 
       // Upload the file and get the Cloudinary URL
       setIsLoading(true);
       const imageUrl = await uploadFile(data?.photo);
     
 
      
 
       // Prepare form data for the card API
       const formData = new FormData();
       formData.append("title", data.title);
       formData.append("photo", imageUrl || ""); 
       formData.append("tag", data.tag);
       formData.append("description", data.description);
       console.log({ formData });
 
       const res: any = await instance.put(
         `/admin/home/five-cards/${card}`,
         formData
       );
 
  
 
   
       if (res?.data?.success) {
         console.log("five card", res);
        
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
    <>
      <div className="threeCard p-5  w-[80%] mx-auto md:py-10">
        {/* Button and Update Button */}
        
        <div className="mb-10 flex gap-2 ">
          <div className="flex items-center justify-end flex-wrap gap-5">
            {["card1", "card2", "card3", "card4", "card5"].map(
              (cardType) => (
                <button
                  key={cardType}
                  className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                    card === cardType
                      ? "bg-[#FFB200] text-black"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => setCard(cardType)}
                >
                  {cardType.replace("card", "Card ")}
                </button>
              )
            )}
          </div>
        </div>
      
      
   
        <FormsInCars isLoading={isLoading} handleSubmit={handleSubmit} />
      </div>
    </>
  );
};

export default CardFiveUpdate;
