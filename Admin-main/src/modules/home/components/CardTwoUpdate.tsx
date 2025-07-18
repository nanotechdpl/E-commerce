import { useRef, useState } from "react";

import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
import ServiceCard from "./ServiceCard";
import { FieldValues } from "react-hook-form";
import axios from "axios";
const CardTwoUpdate = () => {
  const [C1File, setC1File] = useState("");

  const C1Editor = useRef(null);

  const [content1, setContent1] = useState("");
  const [submiting, setIsSubmitting] = useState<boolean>(false);

  const C1Submit = (data: FieldValues) => {
    setIsSubmitting(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/create/securitypage`,
        data
      )
      .then((res) => {
        setIsSubmitting(false);
        console.log("Response:", res.data);
        alert("Form data saved successfully!");
      });
    setIsSubmitting(false);
  };

  return (
    <div className="border-slate-300 px-20 py-10 shadow-4">
      {/* button  and update button  */}
      <ServiceCard
        content={content1}
        isSubmitting={submiting}
        setContent={setContent1}
        onSubmitForm={C1Submit}
        file={C1File}
        setFile={setC1File}
        editor={C1Editor}
      />
    </div>
  );
};

export default CardTwoUpdate;
