import React, { useRef, useState } from "react";
import { FieldValues } from "react-hook-form";
import ServiceCard from "./ServiceCard";
import { env } from "../../../../config/env";
import { ImageRes } from "@/app/(withLayoutC)/c/home/actions";
import axiosInstance from "../../../redux/axios";

const CardFourUpdate = () => {
  interface ModalProps {
    isVisible: boolean;
    onClose: (this: Window, ev: Event) => any;
    children: React.ReactNode;
    hideCloseIcon?: boolean;
  }

  const [submitting, setIsSubmitting] = useState<boolean>(false);
  const [card, setCard] = useState<string>("card one");
  const [C1File, setC1File] = useState("");
  const [C2File, setC2File] = useState("");
  const [C3File, setC3File] = useState("");
  const [C4File, setC4File] = useState("");
  const C1Editor = useRef(null);
  const C2Editor = useRef(null);
  const C3Editor = useRef(null);
  const C4Editor = useRef(null);
  const [content1, setContent1] = useState("");
  const [content2, setContent2] = useState("");
  const [content3, setContent3] = useState("");
  const [content4, setContent4] = useState("");

  const handleSubmit = async (data: FieldValues) => {
    setIsSubmitting(true);
    const formDataImage = new FormData();
    const formData = new FormData();
    formDataImage.append("file", data?.image);
    try {
      const imageLink: ImageRes = await axiosInstance.post(
        "/api/v1/file-upload/upload",
        //change,
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
            "/api/v1/factory-app/admin/home/four-cards ",
            formData
          );
          setIsSubmitting(false);
        } catch (err) {
          setIsSubmitting(false);
          console.log(err);
        }
      }
    } catch (err) {
      setIsSubmitting(false);
      console.log(err);
    }
  };

  return (
    <>
      <div className="threeCard border-slate-300 p-5   md:py-10">
        {/* Button and Update Button */}
        <div className="mb-10 flex gap-2 justify-between">
          <div className="flex items-center justify-end flex-wrap gap-5">
            <button
              className={`${
                card === "card one"
                  ? "bg-[#ffb200] text-black-4"
                  : "bg-white text-[#00000080]"
              } rounded-lg border-[#ffb200] w-[80px] h-[45px] text-sm text-black border-[0.5px] border-[#00000080] font-semibold hover:bg-[#ffb200] whitespace-nowrap`}
              onClick={() => setCard("card one")}
            >
              Card 1
            </button>

            <button
              className={`${
                card === "card two"
                  ? "bg-[#ffb200] text-black-4"
                  : "bg-white text-[#00000080]"
              } rounded-lg border-[#ffb200] w-[80px] h-[45px] text-sm text-black border-[0.5px] border-[#00000080] font-semibold hover:bg-[#ffb200] whitespace-nowrap`}
              onClick={() => setCard("card two")}
            >
              Card 2
            </button>
            <button
              className={`${
                card === "card three"
                  ? "bg-[#ffb200] text-black-4"
                  : "bg-white text-[#00000080]"
              } rounded-lg border-[#ffb200] w-[80px] h-[45px] text-sm text-black border-[0.5px] border-[#00000080] font-semibold hover:bg-[#ffb200] whitespace-nowrap`}
              onClick={() => setCard("card three")}
            >
              Card 3
            </button>
            <button
              className={`${
                card === "card three"
                  ? "bg-[#ffb200] text-black-4"
                  : "bg-white text-[#00000080]"
              } rounded-lg border-[#ffb200] w-[80px] h-[45px] text-sm text-black border-[0.5px] border-[#00000080] font-semibold hover:bg-[#ffb200] whitespace-nowrap`}
              onClick={() => setCard("card four")}
            >
              Card 4
            </button>
          </div>
        </div>
        {card === "card one" && (
          <ServiceCard
            isSubmitting={submitting}
            content={content1}
            setContent={setContent1}
            onSubmitForm={handleSubmit}
            file={C1File}
            setFile={setC1File}
            editor={C1Editor}
          />
        )}
        {card === "card two" && (
          <ServiceCard
            isSubmitting={submitting}
            content={content2}
            setContent={setContent2}
            onSubmitForm={handleSubmit}
            file={C2File}
            setFile={setC2File}
            editor={C2Editor}
          />
        )}
        {card === "card three" && (
          <ServiceCard
            isSubmitting={submitting}
            content={content3}
            setContent={setContent3}
            onSubmitForm={handleSubmit}
            file={C3File}
            setFile={setC3File}
            editor={C3Editor}
          />
        )}
        {card === "card four" && (
          <ServiceCard
            isSubmitting={submitting}
            content={content4}
            setContent={setContent4}
            onSubmitForm={handleSubmit}
            file={C3File}
            setFile={setC4File}
            editor={C4Editor}
          />
        )}
      </div>
    </>
  );
};

export default CardFourUpdate;
