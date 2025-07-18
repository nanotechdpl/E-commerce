import React, { useEffect, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { TiArrowUnsorted } from "react-icons/ti";
import DateTimeSearch from "./DateTimeSearch";
import { Poppins } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  addConstruction,
  Construction,
  deleteConstruction,
  setConstruction,
  updateConstruction,
} from "@/redux/fetures/service/constructionSlice";
import instance from "@/api/axios";
import CreateConstructionForm from "./CreateConstructionForm";
import { uploadFile } from "@/utils/uploadFile";
import { PiToggleRight } from "react-icons/pi";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const CreateConstruction = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState<string>("");
  const [totalData, setTotalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const construction = useSelector(
    (state: RootState) => state.construction.construction
  );
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<Construction>({
    photo: "",
    title: "",
    description: "",
    category: "",
    tag: "",
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
      const res = await instance.put(
        `/menu-services/construction/status/${id}`,
        {
          status,
        }
      );
      if (res.data && res.data.success) {
        // Update the visa in Redux store
        dispatch(updateConstruction(res.data.data));
        toast.success("data status updated successfully!");
      } else {
        toast.error(res.data?.message || "Failed to update data status");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Error updating data status"
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
          `/menu-services/construction/${formData._id}`,
          formData
        );

        console.log("update", res);
        if (res.data.success) {
          dispatch(updateConstruction(res.data.updatedConstruction));
          setFormData({
            photo: "",
            title: "",
            isDeleted: false,
            description: "",
            tag: "",
            category: "",
          });
          setIsEdit(false);
          setModalTitle(null);
          toast.success("Construction updated successfully!");
        }
      } catch (error) {
        toast.error("Error updating construction");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await instance.post(
          `/menu-services/construction`,
          formData
        );
        if (res.data && res.data.success) {
          dispatch(addConstruction(res.data.ConstructionData));
          setFormData({
            photo: "",
            title: "",
            isDeleted: false,
            description: "",
            tag: "",
            category: "",
          });
          setIsEdit(false);
          setModalTitle(null);
          toast.success("Construction created successfully!");
        }
      } catch (error) {
        toast.error("Error creating construction");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (id: string) => {
    const SelectedConstruction = construction.find(
      (construction) => construction._id === id
    );
    if (SelectedConstruction) {
      setFormData(SelectedConstruction);
      setIsEdit(true);
      handleOpenModal("Edit");
    }
  };

  const handleDeleteRow = async (id: string) => {
    try {
      const res = await instance.delete(`/menu-services/construction/${id}`);
      if (res.data && res.data.success) {
        dispatch(deleteConstruction(id));
        toast.success("Construction deleted successfully!");
      }
    } catch (error) {
      toast.error("Error deleting construction");
    }
  };

  const handleSortRows = (): void => {
    // setRows((prevRows) => [...prevRows].reverse());
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await instance.get(
          `/menu-services/construction?query=${query}&limit=${limit}`
        );

        if (res.data && res.data.success) {
          dispatch(setConstruction(res.data.data));
          console.log(res.data, "res.data construction");
          setTotalData(res.data.totalData);
        }
      } catch (error) {
        console.log("Error fetching visas", error);
        toast.error("Error fetching construction");
      }
    })();
  }, [query, limit, dispatch]);

  return (
    <div className="p-2">
      {/* Table */}
      <div className="overflow-x-auto  mt-4">
        <DateTimeSearch
          title="Create Construction"
          onOpenModal={handleOpenModal}
          setQuery={setQuery}
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
              {construction?.map((row, index) => (
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
                      {row.status === "active" ? (
                        <>
                          <button
                            onClick={() =>
                              updatedStatus({
                                id: row._id || "",
                                status: "inactive",
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
                              updatedStatus({
                                id: row._id || "",
                                status: "active",
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
        <CreateConstructionForm
          formData={formData}
          construction={construction}
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
          Showing {construction?.length || 0} of {totalData} results
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

export default CreateConstruction;
