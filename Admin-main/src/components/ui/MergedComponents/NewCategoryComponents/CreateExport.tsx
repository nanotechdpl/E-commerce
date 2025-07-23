"use client";
import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";
import React, { useEffect, useRef, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { RxSwitch } from "react-icons/rx";
import { TiArrowUnsorted } from "react-icons/ti";
import DateTimeSearch from "./DateTimeSearch";
import Image from "next/image";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
import axiosInstance from "@/redux/axios";
import { env } from "../../../../../config/env";
import { uploadFile } from "@/utils/uploadFile";
import { getAllExports } from "@/app/(withLayoutC)/c/service/action";
import CreateExportForm from "./CreateExportForm";
import {
  addExport,
  deleteExport,
  Export,
  setExports,
  updateExport,
} from "@/redux/fetures/service/exportSlice";
import instance from "@/api/axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { toast } from "react-toastify";
import { PiToggleRight } from "react-icons/pi";

const CreateExport = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState<string>("");
  const [totalData, setTotalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const exportedData = useSelector((state: RootState) => state.export.exports);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<Export>({
    photo: "",
    title: "",
    description: "",
    isDeleted: false,
    category: "",
    tag: "",
  });

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setLoading(true);
        const pic = await uploadFile(file);
        formData.photo = pic;
      }
    } catch (error) {
      setLoading(false);
      toast.error("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setFormData((prev) => ({
      ...prev,
      photo: null,
    }));
  };

  const handleOpenModal = (title: string) => setModalTitle(title);

  const handleCloseModal = () => {
    setModalTitle(null);
    setFormData({
      photo: "",
      title: "",
      description: "",
      category: "",
      tag: "",
      isDeleted: false,
    });
    setIsEdit(false);
  };

  const updatedStatus = async ({
    id,
    status,
  }: {
    id: string;
    status: string;
  }): Promise<void> => {
    try {
      const res = await instance.put(`/menu-services/export/status/${id}`, {
        status,
      });
      if (res.data && res.data.success) {
        // Update the visa in Redux store
        dispatch(updateExport(res.data.data));
        toast.success("updateExport status updated successfully!");
      } else {
        toast.error(
          res.data?.message || "Failed to update updateExport status"
        );
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Error updating updateExport status"
      );
    }
  };

  const handleSave = async () => {
    if (
      !formData.title ||
      !formData.photo ||
      !formData.category ||
      !formData.description
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);
    if (isEdit) {
      try {
        const res = await instance.put(
          `/menu-services/export/${formData._id}`,
          formData
        );

        if (res.data && res.data.success) {
          dispatch(updateExport(res.data.data));
          setFormData({
            photo: "",
            title: "",
            isDeleted: false,
            description: "",
            category: "",
            tag: "",
          });
          setIsEdit(false);
          setModalTitle(null);
          toast.success("Export updated successfully!");
        }
      } catch (error) {
        toast.error("Error updating Export");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await instance.post(`/menu-services/export`, formData);
        if (res.data && res.data.success) {
          dispatch(setExports(res.data.data));
          setFormData({
            photo: "",
            title: "",
            isDeleted: false,
            description: "",
            category: "",
            tag: "",
          });
          setIsEdit(false);
          setModalTitle(null);
          toast.success("visa created successfully!");
        }
      } catch (error) {
        toast.error("Error creating visa");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (id: string) => {
    const row = exportedData.find((row) => row._id === id);
    if (row) {
      setFormData(row);
      setIsEdit(true);
      handleOpenModal("Edit");
    } else {
      console.error(`Row with id ${id} not found.`);
    }
  };

  const handleSortRows = (): void => {
    // setRows((prevRows) => [...prevRows].reverse());
  };

  const handleDeleteRow = async (id: string) => {
    try {
      const res = await instance.delete(`/menu-services/export/${id}`);
      if (res.data && res.data.success) {
        dispatch(deleteExport(id));
        toast.success("Export deleted successfully!");
      }
    } catch (error) {
      toast.error("Error deleting Export");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get(
          `/menu-services/export?query=${query}&limit=${limit}`
        );

        if (res.data && res.data.success) {
          dispatch(setExports(res.data.data));
          console.log(res.data, "res.data export");
          setTotalData(res.data.totalData);
        }
      } catch (error) {
        console.log("Error fetching visas", error);
        toast.error("Error fetching Technical");
      }
    })();
  }, [query, limit, dispatch]);

  console.log(exportedData, "exportedData");

  return (
    <div className="overflow-x-auto p-3">
      <div className="overflow-x-auto mt-4">
        <DateTimeSearch
          title="Create Export"
          onOpenModal={handleOpenModal}
          setQuery={setQuery} // Provide a no-op or actual setQuery function as needed
        />
        <div className="rounded-t-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFB200] text-black font-semibold">
                <th
                  className={`px-2 py-4 text-center   ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  No.
                </th>
                <th
                  className={`px-2 py-4 text-center   ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Photo
                </th>
                <th
                  className={`px-2 py-4 text-center   ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Title
                </th>
                <th
                  className={`px-2 py-4 text-center   ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Tag
                </th>
                <th
                  className={`max-w-[258px] px-2 py-4 text-center  ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Category
                </th>
                <th
                  className={`px-2 py-4 text-center  ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {
               (Array.isArray(exportedData) ? exportedData : []).map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-[#FAEFD8]" : "bg-[#fff]"
                  } md:text-base text-sm`}
                >
                  <td className="p-3 text-center border-r border-black/20 border-opacity-50">
                    <div className="w-[33.36px] h-[26.1px] bg-[#FFB200] mx-auto">
                      <span
                        className={`${poppins.className} font-bold text-[13.43px] leading-[20.15px] text-[#000000]`}
                      >
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center mx-auto border-r border-black/20 border-opacity-50">
                    <Image
                      src={
                        row?.photo && row.photo.startsWith("http")
                          ? row.photo
                          : "/placeholder.png" // Use a valid placeholder image in your public folder
                      }
                      width={70}
                      height={50}
                      alt="image"
                      className="rounded-md w-[70px] h-[70px] object-fill"
                    />
                  </td>
                  <td
                    className={`p-3 text-center border-r border-black/20 border-opacity-50 ${poppins.className} font-medium text-[14.13px] leading-[21.2px] text-[#000000]`}
                  >
                    {row?.title}
                  </td>
                  <td
                    className={`p-3 text-center border-r border-black/20 border-opacity-50 ${poppins.className} font-medium text-[14.13px] leading-[21.2px] text-[#000000]`}
                  >
                    {row?.tag}
                  </td>
                  <td
                    className={`max-w-[258px] mx-auto p-3 text-center border-r border-black/20 border-opacity-50 ${poppins.className} font-medium text-[10px] leading-[15px] text-[#00000099]`}
                  >
                    {row?.category}
                  </td>

                  <td className="p-3 text-center border-r border-black/20 border-opacity-50">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={handleSortRows}
                        className="text-yellow-600"
                      >
                        <TiArrowUnsorted size={20} />
                      </button>
                      {/* Remove or skip status-related UI since Export does not have a status property */}
                      <button
                        className="text-blue-600 cursor-pointer"
                        onClick={() => handleEdit(row._id!)}
                      >
                        <CiEdit size={20} />
                      </button>
                      <button
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleDeleteRow(row._id!)}
                      >
                        <BsTrash3 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalTitle && (
        <CreateExportForm
          formData={formData}
          exportedData={exportedData}
           onClose={handleCloseModal}
          onSave={handleSave}
          onImageChange={handleImageChange}
          onDeleteImage={handleDeleteImage}
          onFormChange={(field, value) =>
            setFormData((prev) => ({ ...prev, [field]: value }))
          }
          loading={loading}
        />
      )}
    </div>
  );
};

export default CreateExport;
