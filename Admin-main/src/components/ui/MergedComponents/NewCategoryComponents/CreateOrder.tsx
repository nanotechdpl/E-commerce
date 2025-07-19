import React, { useEffect, useRef, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { RxSwitch } from "react-icons/rx";
import { TiArrowUnsorted } from "react-icons/ti";
import DateTimeSearch from "./DateTimeSearch";

import { Poppins } from "next/font/google";
import { uploadFile } from "@/utils/uploadFile";
import { env } from "../../../../../config/env";
import axiosInstance from "@/redux/axios";
import { useDispatch, useSelector } from "react-redux";
import { getAll } from "@/app/(withLayoutC)/c/menu-services/actions";
import { RootState } from "@/redux/store/store";
import Image from "next/image";
import OrderForm from './OrderForm';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

interface RowData {
  _id?: string;
  photo: string | null;
  serviceType: string;
  title: string;
  visible?: boolean;
}

const initialFormData: RowData = {
  photo: null,
  serviceType: "",
  title: "",
  visible: true,
};

const CreateOrder = () => {
  const [rows, setRows] = useState<RowData[]>([
    {
      _id: "demo1",
      photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
      serviceType: "other",
      title: "Modern Villa with Pool",

      visible: true
    },
    {
      _id: "demo2",
      photo: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
      title: "Downtown Penthouse",
      serviceType: "other",

      visible: true
    },
    {
      _id: "demo3",
      photo: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
      title: "Cozy Family Home",
      serviceType: "other",
      visible: true
    }
  ]); const [formData, setFormData] = useState<RowData>(initialFormData);
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [orderDataArr, setOrderDataArr] = useState<RowData[]>(
    useSelector((state: RootState) => state.category?.data || [])
  );
  const dispatch = useDispatch();

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        setPreviewImage(file);

        // Upload the file
        const uploadedPath = await uploadFile(file);
        const fullImageUrl = `${env.NEXT_PUBLIC_API_URL}${uploadedPath}`;

        // Update form data with the full URL
        setFormData(prev => ({
          ...prev,
          photo: fullImageUrl
        }));
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  const handleOpenModal = (title: string) => {
    setModalTitle(title);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalTitle(null);
    setIsModalVisible(false);
    setFormData(initialFormData);
    setEditingRow(null);
    setPreviewImage(null); // Clear preview image
  };

  const handleSaveOrEdit = (): void => {
    // Validate required fields
    if (!formData.title || !formData?.photo) {
      alert("Please fill in all required fields, including an image.");
      return;
    }

    if (editingRow !== null) {
      axiosInstance
        .put(`/api/v1/factory-app/order/${formData._id}`, formData)
        .then((res) => {
          setRows((prev) =>
            prev.map((row, index) =>
              index === editingRow ? { ...formData } : row
            )
          );
          console.log(res.data.order);
        });
    } else {
      axiosInstance
        .post(`/api/v1/factory-app/order/new`, formData)
        .then((res) => {
          console.log(res.data);
          setRows((prev) => [...prev, res?.data?.orders]);
        });
    }

    handleCloseModal();
  };

  const handleEditRow = (index: number, data: RowData) => {
    setEditingRow(index);
    setFormData(data);
    handleOpenModal("Edit");
  };

  const handleDeleteRow = (index: number, _id: string) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
    axiosInstance
      .delete(
        `${env.NEXT_PUBLIC_API_URL}/api/v1/factory-app/realEstate/delete/${_id}`
      )
      .then((res) => {
        console.log(res.data);
      });
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/factory-app/order/all");
        const mappedData = response.data.data.map((item: any) => ({
          _id: item._id,
          photo: item.photo,
          serviceType: item.serviceType,
          title: item.title,
          visible: item.visible
        }));
        setRows(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSortRows = (): void => {
    setRows((prevRows) => [...prevRows].reverse());
  };

  return (
    <div className="p-2">
      <div className="overflow-x-auto mt-[-3rem]">
        <div className="p-3 rounded-md overflow-x-auto">
          <DateTimeSearch title="Create Order" onOpenModal={handleOpenModal} />
      <div className="rounded-t-lg  overflow-hidden">
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
                  Title
                </th>
                <th
                  className={`px-2 py-4 text-center  border-opacity-50 ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Service Type
                </th>

                <th
                  className={`px-2 py-4 text-center  ${poppins.className} font-semibold text-[15px] leading-[22.5px] text-[#000000]`}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {rows?.map((row: RowData, index) => (
                <tr
                  key={row._id}
                  className={`${index % 2 === 0 ? "bg-[#FAEFD8]" : "bg-[#fff]"
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
                    {row.photo && (
                      <Image
                        src={row.photo}
                        width={70}
                        height={50}
                        alt={row.title || ""}
                        className=""
                      />
                    )}
                  </td>
                  <td
                    className={`p-3 text-left border-r border-black/20 border-opacity-50 ${poppins.className} font-medium text-[14.13px] leading-[21.2px] text-[#000000]`}
                  >
                    {row.title}
                  </td>
                  <td
                    className={`p-3 text-center border-r border-black/20 border-opacity-50 ${poppins.className} font-normal text-[14.13px] leading-[21.2px] text-[#000000]`}
                  >
                    {row.serviceType}
                  </td>

                  <td className="p-3 text-center border-r border-black/20 border-opacity-50">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={handleSortRows}
                        className="text-yellow-600"
                      >
                        <TiArrowUnsorted size={20} />
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(index)}
                        className="text-green-600"
                      >
                        <RxSwitch size={20} />
                      </button>
                      <button
                        className="text-blue-600"
                        onClick={() => handleEditRow(index, row)}
                      >
                        <CiEdit size={20} />
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => handleDeleteRow(index, row._id!)}
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

        <OrderForm
          isVisible={isModalVisible}
          formData={formData}
          editingRow={editingRow}
          onClose={handleCloseModal}
          onSave={handleSaveOrEdit}
          onImageChange={handleImageChange}
          onFormChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
        />
      </div>
      {orderDataArr && orderDataArr?.length > 0 && (
        <div className="flex flex-col w-full items-center justify-center my-7 gap-5">
          <p className="font-inter font-semibold text-base leading-[19.36px] text-black-4">
            Showing 1 to 5 of 97 results
          </p>
          <div className="rounded-[10px] border-[0.89px] border-white bg-[#FFB200] text-[#231F20] font-inter font-semibold text-[13px] leading-[15.73px] py-2 px-4">
            More Results
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;
