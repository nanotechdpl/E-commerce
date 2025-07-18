import React, { useEffect, useMemo, useRef, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { RxCross2, RxSwitch } from "react-icons/rx";
import { TiArrowUnsorted } from "react-icons/ti";
import DateTimeSearch from "./DateTimeSearch";
import RealEstateForm from "./RealEstateForm";

import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { bindActionCreators } from "@reduxjs/toolkit";
import { getAll } from "@/app/(withLayoutC)/c/menu-services/actions";
import { uploadFile } from "@/utils/uploadFile";
import { env } from "../../../../../config/env";
import axiosInstance from "@/redux/axios";
import Image from "next/image";

import {
  RealEstate,
  setRealEstate,
  addRealEstate,
  updateRealEstate,
  deleteRealEstate,
} from "@/redux/fetures/service/realEstateSlice";
import { toast } from "react-toastify";
import instance from "@/api/axios";
import { PiToggleRight } from "react-icons/pi";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const CreateArchitecture = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState<string>("");
  const [totalData, setTotalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const realEstateData = useSelector(
    (state: RootState) => state.realEstate.realEstate
  );
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<RealEstate>({
    photo: "",
    type: "",
    propertyStatus: "",
    address: "",
    sizeOrSquareFeet: "",
    priceOrBudget: "",
    beds: "",
    bathRoom: "",
    kitchen: "",
    description: "",
    features: [],
    visible: "true",
    isDeleted: false,
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
      type: "",
      propertyStatus: "",
      address: "",
      sizeOrSquareFeet: "",
      priceOrBudget: "",
      beds: "",
      bathRoom: "",
      kitchen: "",
      description: "",
      features: [],
      visible: "true",
      isDeleted: false,
    });
    setIsEdit(false);
  };

  const updatedVisible = async ({
    id,
    visible,
  }: {
    id: string;
    visible: string;
  }): Promise<void> => {
    try {
      const res = await instance.put(`/menu-services/real-estate/visible/${id}`, {
        visible,
      });
      if (res.data && res.data.success) {
        // Update the visa in Redux store
        dispatch(updateRealEstate(res.data.data));
        toast.success("Real Estate visible updated successfully!");
      } else {
        toast.error(res.data?.message || "Failed to update  visible");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Error updating real estate visible"
      );
    }
  };

  const handleSave = async () => {

    console.log("formData", formData);
    if (
      !formData.photo ||
      !formData.type ||
      !formData.description ||
      !formData.propertyStatus ||
      !formData.address ||
      !formData.sizeOrSquareFeet ||
      !formData.priceOrBudget ||
      !formData.beds ||
      !formData.bathRoom ||
      !formData.kitchen
    ) {
      toast.error("Please fill all the fields");

      return;
    }



    setLoading(true);
    if (isEdit) {
      try {
        const res = await instance.put(
          `/menu-services/real-estate/${formData._id}`,
          formData
        );

        if (res.data && res.data.success) {
          dispatch(updateRealEstate(res.data.data));
          setFormData({
            photo: "",
            type: "",
            propertyStatus: "",
            address: "",
            sizeOrSquareFeet: "",
            priceOrBudget: "",
            beds: "",
            bathRoom: "",
            kitchen: "",
            description: "",
            features: [],
            visible: "true",
            isDeleted: false,
          });
          setIsEdit(false);
          setModalTitle(null);
          toast.success("real estate updated successfully!");
        }
      } catch (error) {
        toast.error("Error updating real estate");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await instance.post("/menu-services/real-estate", formData);
        if (res.data && res.data.success) {
          // dispatch(addRealEstate(res.data));
          setFormData({
            photo: "",
            type: "",
            propertyStatus: "",
            address: "",
            sizeOrSquareFeet: "",
            priceOrBudget: "",
            beds: "",
            bathRoom: "",
            kitchen: "",
            description: "",
            features: [],
            visible: "true",
            isDeleted: false,
          });
          setIsEdit(false);
          setModalTitle(null);
          toast.success("real estate created successfully!");
        }
      } catch (error) {
        toast.error("Error creating real estate");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (id: string) => {
    const row = realEstateData.find((realEstate) => realEstate._id === id);
    if (row) {
      setFormData(row);
      setIsEdit(true);
      handleOpenModal("Edit");
    }
  };
 const handleSortRows = (): void => {};

  
  const handleDeleteRow = async (id: string) => {
    try {
      const res = await instance.delete(`/menu-services/real-estate/${id}`);
      if (res.data && res.data.success) {
        dispatch(deleteRealEstate(res.data.technical._id));
        toast.success("Real Estate deleted successfully!");
      }
    } catch (error) {
      toast.error("Error deleting Technical");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get(
          `/menu-services/real-estate?query=${query}&limit=${limit}`
        );
        console.log("real estate data", res);

        if (res.data && res.data.success) {
          dispatch(setRealEstate(res.data.data));
          console.log(res.data, "res.data");
          setTotalData(res.data.totalData);
        }
      } catch (error) {
        console.log("Error fetching real estate", error);
      }
    })();
  }, [query, limit, dispatch]);

  return (
    <div className="p-2">
      {/* Table */}
      <div className="overflow-">
        <DateTimeSearch
          title="Create Real Estate"
          onOpenModal={handleOpenModal}
          setQuery={setQuery}
        />
        <div className="rounded-t-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFB200] rounded-t-lg text-black font-semibold">
                <th
                  className={`px-2 py-4 text-center  border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  No.
                </th>
                <th
                  className={`px-2 py-4 text-center  border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Photo
                </th>
                <th
                  className={`px-2 py-4 text-center  border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Property Type
                </th>
                <th
                  className={`max-w-[258px] px-2 py-4 text-center  border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Property Status
                </th>
                <th
                  className={`px-2 py-4 text-center  border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Price/Budget
                </th>

                <th
                  className={`px-2 py-4 text-center  ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {realEstateData?.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-[#FAEFD8]" : "bg-[#fff]"
                  } md:text-base text-sm`}
                >
                  <td className="p-3 text-center border-r border-black/20 border-opacity-50">
                    <div className="w-[26.1px] rounded-md h-[26.1px] bg-[#FFB200] mx-auto">
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
                          : "/placeholder.png"
                      }
                      width={70}
                      height={50}
                      alt="image"
                      className="rounded-md w-[70px] h-[70px] object-fill"
                    />
                  </td>

                  <td
                    className={`p-3 text-left border-r border-black/20 border-opacity-50 ${poppins.className} font-medium text-[14.13px] leading-[21.2px] text-[#000000]`}
                  >
                    {row.type}
                  </td>
                  <td
                    className={`max-w-[258px] mx-auto p-3 text-center border-r border-black/20 border-opacity-50 ${poppins.className} font-medium text-[12px] leading-[15px] text-[#00000099]`}
                  >
                    {row.propertyStatus}
                  </td>
                  <td
                    className={`p-3 text-center border-r border-black/20 ${poppins.className} font-normal text-[14.13px] leading-[21.2px] text-[#000000]`}
                  >
                    ${row.priceOrBudget}
                  </td>

                  <td className="p-3 text-center border-r border-black/20 border-opacity-50">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={handleSortRows}
                        className="text-yellow-600"
                      >
                        <TiArrowUnsorted size={20} />
                      </button>
                      {row.visible === "active" ? (
                        <>
                          <button
                            onClick={() =>
                              updatedVisible({
                                id: row._id || "",
                                visible: "inactive",
                              })
                            }
                            className="flex items-center cursor-pointer"
                          >
                            <PiToggleRight
                              size={20}
                              className="text-green-500"
                            />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              updatedVisible({
                                id: row._id || "",
                                visible: "active",
                              })
                            }
                            className="flex items-center cursor-pointer"
                          >
                            <PiToggleRight
                              size={20}
                              className="text-red-500 rotate-180"
                            />
                          </button>
                        </>
                      )}
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
        <RealEstateForm
         formData={formData}
         realEstateData={realEstateData}
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

       <div className="flex flex-col w-full items-center justify-center my-7 gap-5">
        <p className="font-inter font-semibold text-base leading-[19.36px] text-black-4">
          Showing {realEstateData?.length || 0} of {totalData} results
        </p>
        <div className="rounded-[10px] border-[0.89px] border-white bg-[#FFB200] text-[#231F20] font-inter font-semibold text-[13px] leading-[15.73px] py-2 px-4">
          <span>More Results</span>
          <select
            onChange={(e) => setLimit(e.target.value)}
            name=""
            id=""
            className="ml-4"
          >
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="48">48</option>
            <option value="96">96</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CreateArchitecture;
