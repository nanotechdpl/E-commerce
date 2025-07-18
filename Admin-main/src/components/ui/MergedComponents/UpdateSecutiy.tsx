import dynamic from "next/dynamic";
import React, { useRef, useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const UpdateSecutiy = () => {
  const [ContentValue, setContentValue] = useState<string>("");
  const editor = useRef(null);
  return (
    <div className="mx-auto xl:w-[70%]">
      <p className="my-3 text-center text-2xl font-bold">
        Security Update Page
      </p>
      <div className="flex items-center justify-end gap-2">
        <FaEdit size={25} className="cursor-pointer text-green-500" />
        <FaSave size={25} className="cursor-pointer text-blue-500" />
      </div>
      <label className="text-md py-5">Description</label>
      <JoditEditor
        ref={editor}
        value={ContentValue}
        config={{
          height: 600,
        }}
        onBlur={(newContent) => setContentValue(newContent)} // preferred to use only this option to update the content for performance reasons
      />
    </div>
  );
};

export default UpdateSecutiy;
