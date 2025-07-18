import React, { useState } from "react";
import { FieldValues } from "react-hook-form";
import ServiceCard from "./ServiceCard";
import { Poppins } from "next/font/google";
import { env } from "../../../../config/env";
import { ImageRes } from "@/app/(withLayoutC)/c/home/actions";
import axiosInstance from "@/redux/axios";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

const SecurityPage = () => {
  const [C1File, setC1File] = useState("");
  const [C1Editor, setC1Editor] = useState("");
  const [content, setContent] = useState("");
  const [submiting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (data: FieldValues) => {
    setIsSubmitting(true);
    const formDataImage = new FormData();
    const formData = new FormData();
    formDataImage.append("file", data?.image);
    try {
      const imageLink: ImageRes = await axiosInstance.post(
        `/api/v1/admin/file-upload/upload`,
        formDataImage,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (imageLink && imageLink?.data?.status == 200) {
        try {
          formData.append("title", data?.title);
          formData.append(
            "image",
            `${env.NEXT_PUBLIC_API_URL}${imageLink?.data?.filePath}`
          );
          formData.append("tag", data?.tag);
          formData.append("description", data?.description);
          const res = await axiosInstance.post(
            `/api/v1/factory-app/admin/home/security-page/add`,
            formData
          );
          console.log(res);
        } catch (err) {
          console.log(err);
        }
        setIsSubmitting(false);
      }
    } catch (err) {
      setIsSubmitting(false);
      console.log(err);
    }
  };

  return (
    <>
      <div className="threeCard border-slate-300 p-5 shadow-4 md:px-20 md:py-10 mt-3">
        <h2
          className={`${poppins.className} font-bold text-[24px] leading-[37.2px] text-start ml-24 my-4 text-[#000000]`}
        >
          {/* Security Page */}
        </h2>

        <ServiceCard
          content={content}
          isSubmitting={submiting}
          setContent={setContent}
          onSubmitForm={handleSubmit}
          file={C1File}
          setFile={setC1File}
          editor={C1Editor}
        />
      </div>
    </>
  );
};

export default SecurityPage;
