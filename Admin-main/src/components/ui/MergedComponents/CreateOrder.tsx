import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineEdit } from "react-icons/ai";

// import dynamic from "next/dynamic";
import CustomSearch from "../CustomSearch";
import { Button, Modal } from "antd";
import CustomForm from "@/components/Form/Form";
import PrimaryButton from "@/components/button/PrimaryButton";
import CustomInput from "@/components/Form/Input";
import { MdDelete } from "react-icons/md";
import SelectSingleOrMultiImg from "@/components/Upload/SelectSingleOrMultiImg";
const CreateOrder: React.FC = () => {
  
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

  return (
    <div>
     
      <div className="m-1  flex w-full place-items-end justify-center">
        <div>
          <p className="my-3 text-center text-2xl font-bold">Order</p>
          <div className="flex w-full  justify-between">
            <div className="... flex  justify-center">
              <div className="... w-48 flex-none  rounded-2xl"></div>
              <div className="...  grow  text-center">
                <div className="mb-3 ">
                  <div className="relative mb-4 flex w-full flex-wrap items-stretch ">
                    {/* search */}
                    <CustomSearch onSearch={onSearch} placeholder="Search..." />
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-36">
              <CreateOrderModal />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="mx-auto mt-20 flex flex-wrap  items-center  justify-center gap-4 space-y-2">
          {bloagData.map((item, index) => (
            <SingleOrder item={item} key={index} />
          ))}
        </div>
      </div>

      {isFormSubmitted && (
        <div className="pt-6">
          <ul>
            <div className="border-gray-800 w-96 border px-8 py-4">
              <button className="mt-3 bg-green-600 px-4 py-1.5 text-white">
                Edit
              </button>
            </div>
          </ul>
        </div>
      )}
      {uploadSucces && (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-slate-700 bg-opacity-75">
          <div className="rounded-md bg-gradient-to-tr from-yellow-200 to-pink-200   p-4">
            <p className="text-2xl font-bold text-green-500 ">
              {" "}
              Uploaded Successfully
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Crate modal
const CreateOrderModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [icon, setIcon] = useState<File[]>([]);
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
        Creation Order
      </Button>
      <Modal
        title="Create Order"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        width={600}
      >
        {/* FORM */}
        <div className="mx-auto w-[90%]">
          <div className="mb-3 flex flex-col items-center gap-3">
            {/* ------Select Logo -------- */}
            <SelectSingleOrMultiImg
              file={icon}
              setFile={setIcon}
              title="Select Order Image"
            />
          </div>
          <CustomForm onSubmit={onSubmitForm} className="w-full">
            <CustomInput
              type="text"
              name="orderTitle"
              placeholder="Order Title"
              label="Order Title"
            />
            <PrimaryButton type="submit" text={"Submit"} />
          </CustomForm>
        </div>
      </Modal>
    </>
  );
};

// blogModal
const SingleOrder = ({ item }: { item: any }) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div className={`w-[350px] text-center font-medium`}>
      <div className="flex flex-col  px-2 ">
        <div className="flex items-center justify-between gap-1 bg-slate-300 p-2 ">
          {/* Togale tbn */}
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
                className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center  rounded-full bg-white  transition ${
                  isChecked ? "translate-x-full" : ""
                }`}
              ></div>
            </div>
          </label>
          <AiOutlineEdit
            className=" cursor-pointer text-blue-600"
          
            size={30}
          />
          <MdDelete
            className="cursor-pointer  text-rose-600"
            size={30}
          />
        </div>

        <div className="w-full">
          <Image
            height={800}
            alt="img"
            width={800}
            src={
              "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg"
            }
          />
        </div>
      </div>
    </div>
  );
};
export default CreateOrder;
