import Templates from "@/types/templates";
import { Button } from "antd";
import { Upload } from "lucide-react";
import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { BsTrash3, BsTrashFill } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
import { RxSwitch } from "react-icons/rx";
import { TiArrowUnsorted } from "react-icons/ti";
import templatesDataArray from "../../../../constants/templatesData";
import DateTimeSearch from "./DateTimeSearch";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

interface RowData {
  id: number;
  icon: File | null;
  name: string;
  title: string;
  tag: string;
  uploadDate: string;
  visible: boolean;
}

const CreateService = () => {
  const editorRef = useRef(null);
  const [editModal, setEditModal] = useState<Templates>({
    images: "",
    title: "",
    projectPlanning: "",
    tag: "",
    price: "",
    uploadDate: "",
    visible: false,
  });
  const [rows, setRows] = useState<RowData[]>([]);
  const [formData, setFormData] = useState<RowData>({
    id: Math.random(),
    icon: null,
    name: "",
    title: "",
    tag: "",
    uploadDate: new Date().toISOString().split("T")[0],
    visible: true,
  });

  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const hiddenIconInput = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, icon: file }));
    }
  };

  const handleOpenModal = (title: string) => {
    setModalTitle(title);
    setIsModalVisible(true);
  };

  const handleIconImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      setPreviewImage(files[0]); // Set the first uploaded image for preview
    }
  };

  const handleDeleteIconPreview = () => {
    setPreviewImage(null); // Remove the preview image
  };

  const handleSaveIconImage = () => {
    if (previewImage) {
      setUploadedImages((prev) => [...prev, previewImage]);
      setPreviewImage(null); // Clear the preview image after saving
    }
  };

  const handleDeleteIconImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCloseModal = () => {
    setModalTitle(null);
    setIsModalVisible(false);
    setFormData({
      id: Math.random(),
      icon: null,
      name: "",
      title: "",
      tag: "",
      uploadDate: new Date().toISOString().split("T")[0],
      visible: true,
    });
    setEditingRow(null);
  };

  const handleSaveOrEdit = (): void => {
    // Validate required fields
    if (!formData.title || !formData.tag || !formData.icon) {
      alert("Please fill in all required fields, including an image.");
      return;
    }

    if (editingRow !== null) {
      // Update the row in edit mode
      setRows((prev) =>
        prev.map((row, index) => (index === editingRow ? { ...formData } : row))
      );
    } else {
      // Add a new row
      setRows((prev) => [...prev, { ...formData, id: Math.random() }]);
    }

    handleCloseModal();
  };

  const handleEditRow = (index: number): void => {
    setEditingRow(index);
    setEditModal(templatesDataArray[index]);
    handleOpenModal("Edit Blog");
  };

  const handleDeleteRow = (id: number): void => {
    setRows((prev) => prev.filter((_, index) => index !== id));
  };

  const handleToggleVisibility = (index: number): void => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, visible: !row.visible } : row
      )
    );
  };

  const handleReorder = () => {
    const sortedRows = [...rows];
    if (sortOrder === "asc") {
      sortedRows.sort((a, b) => b.title.localeCompare(a.title));
      setSortOrder("desc");
    } else {
      sortedRows.sort((a, b) => a.title.localeCompare(b.title));
      setSortOrder("asc");
    }
    setRows(sortedRows);
  };

  const handleIconClick = () => hiddenIconInput.current?.click();

  return (
    <div className="overflow-x-auto mt-[-3rem]">
      <span>Banner</span>
      <div className="flex flex-row justify-between items-center gap-4">
        {/* Upload Preview Area */}
        <div className="flex flex-row justify-evenly items-center">
          <div
            className="relative flex items-center justify-center w-[89px] h-[65px] bg-white rounded cursor-pointer"
            onClick={!previewImage ? handleIconClick : undefined}
          >
            {previewImage ? (
              <>
                <Image
                  src={URL.createObjectURL(previewImage)}
                  alt="Preview"
                  className="rounded-lg object-cover"
                  width={47}
                  height={47}
                />
                <button
                  onClick={handleDeleteIconPreview}
                  className="absolute top-1 right-[2px] bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <BsTrashFill color="red" />
                </button>
              </>
            ) : (
              <FaCloudUploadAlt size={40} className="" />
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              ref={hiddenIconInput}
              onChange={handleIconImageUpload}
            />
          </div>

          {/* Save Button */}
          <Button
            className={`w-[95px] h-12 bg-[#ffb200]  border border-[#FFB200] text-black rounded-lg px-4 ml-8`}
            onClick={handleSaveIconImage}
          >
            Save
          </Button>
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-hidden ml-12"
            style={{ scrollBehavior: "smooth" }}
          >
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative w-[50px] h-[65px]">
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded ${index}`}
                  className="rounded object-cover mt-2"
                  width={48.7}
                  height={47.2}
                />
                <button
                  onClick={() => handleDeleteIconImage(index)}
                  className="absolute -top-3 -right-3 overflow-visible bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center"
                >
                  <IoMdCloseCircle color="red" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Uploaded Images */}

        {/* Horizontal Scroll Buttons */}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center w-full my-8">
          {/* Input and Button Group */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Icon</h2>

            <div className="flex items-center gap-4">
              {/* Upload Icon Box */}
              <div className="w-16 h-16 bg-white rounded-lg shadow-sm flex items-center justify-center relative">
                <Upload className="w-8 h-8 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px]">1</span>
                </div>
              </div>

              {/* Add Button */}
              <button className="px-8 py-2 bg-orange-400 hover:bg-orange-500 text-black font-medium rounded-md transition-colors">
                Add
              </button>

              {/* Software Icons */}
              <div className="flex items-center gap-3">
                {[
                  { bg: "bg-[#001E36]", text: "Ps" },
                  { bg: "bg-[#330000]", text: "Ai" },
                  { bg: "bg-[#470137]", text: "A" },
                  { bg: "bg-[#001E36]", text: "Ps" },
                  { bg: "bg-[#330000]", text: "Ai" },
                  { bg: "bg-[#470137]", text: "A" },
                  { bg: "bg-[#001E36]", text: "Ps" },
                  { bg: "bg-[#330000]", text: "Ai" },
                  { bg: "bg-[#470137]", text: "A" },
                ].map((icon, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`w-12 h-12 ${icon.bg} rounded-full flex items-center justify-center`}
                    >
                      <span
                        className={`text-lg ${
                          icon.text === "Ps"
                            ? "text-[#31A8FF]"
                            : icon.text === "Ai"
                            ? "text-[#FF9A00]"
                            : "text-[#FF45A5]"
                        }`}
                      >
                        {icon.text}
                      </span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">2</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => handleScroll("left")}
            className="text-gray-500"
          >
            <FaCircleArrowLeft
              size={30}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#000000")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "gray")}
            />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="text-black ml-2 "
          >
            <FaCircleArrowRight
              size={30}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#000000")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "gray")}
            />
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-md mt-4">
        <DateTimeSearch title="Create Service" onOpenModal={handleOpenModal} />
        <table className="w-full text-center">
          <thead>
            <tr className="bg-[#FFB200] text-black font-semibold rounded-t-[11.78px]">
              <th
                className={`p-3 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
              >
                No.
              </th>
              <th
                className={`p-3 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
              >
                Icon
              </th>
              <th
                className={`p-3 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
              >
                Title
              </th>
              <th
                className={`max-w-[258px] p-3 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
              >
                Tag
              </th>
              <th
                className={`p-3 text-center border-r border-black border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
              >
                Upload Data
              </th>
              <th
                className={`p-3 text-center ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {templatesDataArray.map((row, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-[#FAEFD8]" : "bg-[#fff]"
                } md:text-base text-sm`}
              >
                <td className="p-3 text-center border-r border-black border-opacity-50">
                  <div className="w-[33.36px] h-[26.1px] bg-[#FFB200] mx-auto">
                    <span
                      className={`${poppins.className} font-bold text-[13.43px] leading-[20.15px] text-[#000000]`}
                    >
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="p-3 border-r border-black border-opacity-50">
                  <div className="flex justify-center">
                    {row.images && (
                      <Image
                        src={row.images}
                        width={100}
                        height={50}
                        alt="Blog Image"
                        className="object-contain"
                      />
                    )}
                  </div>
                </td>
                <td
                  className={`p-3 text-center border-r border-black border-opacity-50 ${poppins.className} font-medium text-[14.13px] leading-[21.2px] text-[#000000]`}
                >
                  {row.visible ? row.title : "*****"}
                </td>
                <td
                  className={`max-w-[258px] mx-auto p-3 text-center border-r border-black border-opacity-50 ${poppins.className} font-medium text-[10px] leading-[15px] text-[#00000099]`}
                >
                  {row.visible ? row.tag : "*****"}
                </td>
                <td
                  className={`p-3 text-center whitespace-nowrap border-r border-black border-opacity-50 ${poppins.className} font-normal text-[14.13px] leading-[21.2px] text-[#000000]`}
                >
                  {row.uploadDate}
                </td>
                <td className="p-3 border-r border-black border-opacity-50">
                  <div className="flex justify-center gap-2">
                    <button onClick={handleReorder}>
                      <TiArrowUnsorted color="yellow" />
                    </button>
                    <button onClick={() => handleToggleVisibility(index)}>
                      <RxSwitch />
                    </button>
                    <button onClick={() => handleEditRow(index)}>
                      <CiEdit color="green" />
                    </button>
                    <button onClick={() => handleDeleteRow(index)}>
                      <BsTrash3 color="red" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#ccccff] p-8 h-[657px] mt-[50px] rounded-[10px] shadow-lg w-100%">
            <div className="flex justify-end">
              <button
                className="relative bottom-4 left-43 text-gray-700 text-lg"
                onClick={handleCloseModal}
              >
                ✖
              </button>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex flex-row items-center">
                <button
                  className={`${poppins.className} font-semibold text-base bg-[#ffb200] w-25 h-16 rounded-[8px] text-[#000000] `}
                  onClick={handleClick}
                >
                  Photo &gt;
                </button>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                  ref={hiddenFileInput}
                  multiple
                />
                <div className="flex flex-row gap-3 ml-4">
                  <div className="relative w-[101px] h-20 bg-[#CCCCFF33] rounded shadow-xl">
                    <Image
                      src={editModal.images}
                      width={62}
                      height={50}
                      alt="Preview"
                      className="object-cover mt-8 ml-3"
                    />
                    <button
                      onClick={() => {}}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <BsTrash3 color="red" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                className="bg-[#ffb200] w-44 h-[45px] rounded-lg text-[#000000] "
                onClick={() => {}}
              >
                Save
              </button>
            </div>
            <div className="flex flex-col w-150">
              <span className="flex flex-col">
                <label
                  className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#000000]`}
                >
                  Title
                </label>
                <input
                  type="text"
                  className="rounded-[5px] w-[300px] h-14 border border-[#000000]"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </span>
              <span className="flex flex-col mt-4">
                <label
                  className={`${poppins.className} font-medium text-[20px] leading-[31px] text-[#000000]`}
                >
                  Tag
                </label>
                <input
                  type="text"
                  className="rounded-[5px] w-[300px] h-14 border border-[#000000]"
                  value={formData.tag}
                  onChange={(e) =>
                    setEditModal((prev) => ({ ...prev, tag: e.target.value }))
                  }
                />
              </span>

              <div className="bg-white mt-6 p-2 rounded-[10px] border border-[#000000]">
                <label
                  className={`${poppins.className} font-normal text-[16px] leading-[31px] text-[#00000099]`}
                >
                  Description
                </label>
                <JoditEditor
                  ref={editorRef}
                  value={editModal.projectPlanning}
                  config={{
                    height: 200,
                  }}
                  onBlur={(newContent) =>
                    setEditModal({ ...editModal, projectPlanning: newContent })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col w-full items-center justify-center my-7 gap-5">
        <p className="font-inter font-semibold text-base leading-[19.36px] text-black-4">
          Showing 1 to 5 of 97 results
        </p>
        <div className="rounded-[10px] border-[0.89px] border-white bg-[#FFB200] text-[#231F20] font-inter font-semibold text-[13px] leading-[15.73px] py-2 px-4">
          More Results
        </div>
      </div>
    </div>
  );
};

export default CreateService;
