"use client";
import React from "react";
import CustomDropdown from "../DropDownManues/TecnologyCategory";
import { useRef, useState } from "react";

const AddNewTechnology: React.FC = () => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const inputStyle = "p-2 border w-full rounded-md border-blue-400";
  return (
    <div>
      <div className="px-10 py-5">
        <h1 className="text-center text-2xl font-bold">
          Create Technology Name
        </h1>
        <div className="mb-5 mt-10 flex h-64 flex-col sm:flex-row sm:space-x-5">
          <div className=" ">
            <CustomDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewTechnology;
