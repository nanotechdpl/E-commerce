"use client";

import React, { useState } from "react";
// import Image from "next/image";
import { AiOutlineEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import dynamic from "next/dynamic";
import { Button, Modal } from "antd";
import CustomSearch from "../CustomSearch";
import CustomForm from "@/components/Form/Form";
import PrimaryButton from "@/components/button/PrimaryButton";
import CustomInput from "@/components/Form/Input";
import SelectSingleOrMultiImg from "@/components/Upload/SelectSingleOrMultiImg";

// Dynamic import for JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const CreateBlog: React.FC = () => {
  const [blogData, setBlogData] = useState([
    {
      title: "Large Society 1",
      blog: "Words combined with a handful of models to generate reasonable content.",
    },
    {
      title: "Large Society 2",
      blog: "Words combined with a handful of models to generate reasonable content.",
    },
    // Add more blog entries as needed
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBlogIndex, setActiveBlogIndex] = useState<number | null>(null);
  const [draggedRow, setDraggedRow] = useState<number | null>(null);

  // Handle drag-and-drop functionality
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedRow(index);
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData("text/plain"));
    const newBlogData = [...blogData];
    const [draggedItem] = newBlogData.splice(draggedIndex, 1);
    newBlogData.splice(index, 0, draggedItem);
    setBlogData(newBlogData);
    setDraggedRow(null);
  };

  // Handle blog deletion
  const handleDeleteBlog = (index: number) => {
    setBlogData((prevData) => prevData.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <div className="mt-4 md:mt-0">
          <CustomSearch
            placeholder="Search blogs..."
            onSearch={(value: any) => console.log(value)}
          />
          <Button
            type="primary"
            className="ml-4 bg-blue-500"
            onClick={() => setIsModalOpen(true)}
          >
            Create Blog
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blogData.map((item, index) => (
          <SingleBlog
            key={index}
            item={item}
            index={index}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDelete={handleDeleteBlog}
            isActive={index === activeBlogIndex}
            setActiveBlogIndex={setActiveBlogIndex}
          />
        ))}
      </div>

      <CreateBlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

// Single Blog Component
const SingleBlog = ({
  item,
  index,
  onDragStart,
  onDragOver,
  onDrop,
  onDelete,
  isActive,
  setActiveBlogIndex,
}: {
  item: any;
  index: number;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDelete: (index: number) => void;
  isActive: boolean;
  setActiveBlogIndex: (index: number | null) => void;
}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div
      className={`rounded-lg border bg-white shadow-lg transition-transform ${
        isActive ? "scale-105" : ""
      }`}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onClick={() => setActiveBlogIndex(index)}
    >
      <div className="flex items-center justify-between bg-gray-100 p-3">
        <label className="flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`h-6 w-11 rounded-full bg-gray-300 transition-colors ${
              isChecked ? "bg-green-500" : ""
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                isChecked ? "translate-x-5" : ""
              }`}
            ></div>
          </div>
        </label>
        <div className="flex gap-2">
          <AiOutlineEdit className="cursor-pointer text-blue-500" size={24} />
          <MdDelete
            className="cursor-pointer text-red-500"
            size={24}
            onClick={() => onDelete(index)}
          />
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-yellow-700 to-pink-600">
            <IoIosContact size={30} color="white" />
          </div>
          <h2 className="text-xl font-bold">{item.title}</h2>
          <p className="mt-2 text-gray-600">{item.blog}</p>
        </div>
      </div>
    </div>
  );
};

// Create Blog Modal Component
const CreateBlogModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [content, setContent] = useState("");
  const [icon, setIcon] = useState<File[]>([]);

  const onSubmitForm = (data: any) => {
    console.log(data);
    onClose();
  };

  return (
    <Modal
      title="Create Blog"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
    >
      <div className="mx-auto w-[90%]">
        <div className="mb-4">
          <SelectSingleOrMultiImg
            file={icon}
            setFile={setIcon}
            title="Select Blog Image"
          />
        </div>
        <CustomForm onSubmit={onSubmitForm}>
          <CustomInput
            type="text"
            name="blogTitle"
            placeholder="Blog Title"
            label="Blog Title"
          />
          <CustomInput
            type="text"
            name="blogTag"
            placeholder="Blog Tag"
            label="Blog Tag"
          />
          <div className="mt-4">
            <label className="block text-sm font-medium">
              Blog Description
            </label>
            <JoditEditor
              value={content}
              config={{ height: 400 }}
              onBlur={(newContent) => setContent(newContent)}
            />
          </div>
          <PrimaryButton type="submit" text="Submit" className="mt-4" />
        </CustomForm>
      </div>
    </Modal>
  );
};

export default CreateBlog;
