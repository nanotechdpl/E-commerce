import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AiOutlineEdit } from "react-icons/ai";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

import dynamic from "next/dynamic";
import CustomSearch from "../CustomSearch";
import { Button, Modal, Row } from "antd";
import CustomForm from "@/components/Form/Form";
import PrimaryButton from "@/components/button/PrimaryButton";
import CustomInput from "@/components/Form/Input";
import CustomTextarea from "@/components/Form/Textarea";
import { MdDelete } from "react-icons/md";
import SelectSingleOrMultiImg from "@/components/Upload/SelectSingleOrMultiImg";
import { FaCheck } from "react-icons/fa";

const CreateArchitecture: React.FC = () => {
  
  const [isFormSubmitted] = useState(false);
 

  const [bloagData] = useState([
    {
      title: "Large Society 1",
      blog: " Words combined with a handfull of model to generate which looks reasonable",
    },
    {
      title: "Large Society 2",
      blog: " Words combined with a handfull of model to generate which looks reasonable",
    },
    {
      title: "Large Society 3",
      blog: " Words combined with a handfull of model to generate which looks reasonable",
    },
    {
      title: "Large Society 4",
      blog: " Words combined with a handfull of model to generate which looks reasonable",
    },
    {
      title: "Large Society 5",
      blog: " Words combined with a handfull of model to generate which looks reasonable",
    },
    {
      title: "Large Society 6",
      blog: " Words combined with a handfull of model to generate which looks reasonable",
    },
  ]);

  const [uploadSucces] = useState(false);


  const onSearch = (value: any) => {
    console.log(value);
  };

  // const buttonStyle =
  //   "bg-indigo-600 p-2 w-40 text-lg font-semibold text-white mt-4  rounded-md border border-indigo-500 flex items-center justify-center gap-2 hover:bg-indigo-100";

  return (
    <div className="p-4">
      <div className="flex flex-col items-center py-10 md:flex-row md:justify-between">
        <p className="my-3 text-center text-2xl font-bold">
          Create Architecture
        </p>
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <div className="mb-4 w-full md:mb-0 md:w-1/2">
            <CustomSearch onSearch={onSearch} placeholder="Search..." />
          </div>
          <div className="md:ml-4">
            <CreateArchitectureModal />
          </div>
        </div>
      </div>
      <div className="mt-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bloagData.map((item, index) => (
            <SingleOrder item={item} key={index} />
          ))}
        </div>
      </div>

      {isFormSubmitted && (
        <div className="pt-6">
          <ul>
            <div className="w-96 border border-gray-800 px-8 py-4">
              <button className="mt-3 bg-green-600 px-4 py-1.5 text-white">
                Edit
              </button>
            </div>
          </ul>
        </div>
      )}
      {uploadSucces && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-slate-700 bg-opacity-75">
          <div className="rounded-md bg-gradient-to-tr from-yellow-200 to-pink-200 p-4">
            <p className="text-2xl font-bold text-green-500">
              Uploaded Successfully
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const CreateArchitectureModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState<File[]>([]);
  const [ContentValue, setContentValue] = useState<string>("");
  const editor = useRef(null);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onSubmitForm = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <Button className="bg-blue-500 text-white" onClick={showModal}>
        Creation Architecture
      </Button>
      <Modal
        title="Create Architecture"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        width={900}
      >
        <div className="mx-auto w-[95%]">
          <div className="mb-3 flex flex-col items-center gap-3">
            <SelectSingleOrMultiImg
              file={file}
              setFile={setFile}
              title="Select File"
            />
            <PrimaryButton text="Save" />
          </div>
          <CustomForm onSubmit={onSubmitForm} className="w-full">
            <CustomInput
              type="text"
              name="title"
              placeholder="Title"
              label="Title"
            />
            <CustomInput
              type="number"
              name="plantAmount"
              placeholder="Plant Amount"
              label="Plant Amount"
            />
            <PrimaryButton type="submit" text={"Submit"} />
          </CustomForm>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
              <label className="text-md py-5">Plant Description</label>
              <JoditEditor
                ref={editor}
                value={ContentValue}
                config={{
                  height: 300,
                }}
                onBlur={(newContent) => setContentValue(newContent)}
              />
            </div>
            <CustomForm
              onSubmit={(data) => {
                console.log(data);
              }}
            >
              <CustomTextarea
                label="Panlt Details"
                type="text"
                name="plantDetails"
              />
            </CustomForm>
          </div>
          <PrimaryButton text="Add" className="mt-2 w-full" />
        </div>
      </Modal>
    </>
  );
};

const SingleOrder = ({ item }: { item: any }) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className="w-full text-center font-medium sm:w-[350px]">
      <div className="flex flex-col px-2">
        <div className="flex items-center justify-between gap-1 bg-slate-300 p-2">
          <label className="flex cursor-pointer select-none items-center">
            <div className="relative">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`box block h-8 w-14 rounded-full ${
                  isChecked ? "bg-green-500" : "bg-slate-400"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                  isChecked ? "translate-x-full" : ""
                }`}
              ></div>
            </div>
          </label>
          <AiOutlineEdit size={30} />
          <MdDelete className="cursor-pointer text-rose-600" size={30} />
        </div>
        <div className="relative h-[400px] w-full overflow-hidden">
          <Image
            height={800}
            alt="img"
            width={800}
            className="h-full object-cover"
            src={
              "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg"
            }
          />
          <div className="absolute bottom-0 left-0 right-0 top-[30%] flex flex-col justify-between bg-slate-600/50 p-5 font-semibold text-meta-6">
            <div className="flex items-center justify-between">
              <span>Staning Design</span>
              <span>3200$</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <FaCheck />
                <span>Moder Scale</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck />
                <span>Moder Scale</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheck />
                <span>Moder Scale</span>
              </div>
            </div>
            <div>
              <button className="w-full rounded bg-meta-6 p-1 py-3 font-bold text-white">
                See Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArchitecture;
